const config = require('../config');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { ActivityType, WebhookClient, EmbedBuilder, ChannelType } = require('discord.js');
const sorgucuSchema = require('../../Database/Schemas/sorgucuSchema');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const moment = require('moment');
moment.locale('tr');
const subclient = global.subclient;
const table = require('table');

async function getData(url) {

    try {

        let response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
        });
    
        return await response.json();

    } catch (error) {
        console.log(error);
        return { success: false, message: "API çekilemedi"}
    }

}

async function verify2FA(userData, token) {

    try {

        if(!userData || !userData.TwoFactor.active || !userData.TwoFactor.secret || !token) return false;

        const verified = speakeasy.totp.verify({
            secret: userData.TwoFactor.secret,
            encoding: 'base32',
            token: token
        });

        return verified;

    } catch (err) {
        console.log(err);
        return false;
    }

}

async function generate2FA(username) {

    try {

        const secret = speakeasy.generateSecret({ length: 20 });
        const otpAuthUrl = speakeasy.otpauthURL({
          secret: secret.ascii,
          label: `${username} - Perla Sorgu Botu`,
          algorithm: 'sha1',
          window: 1,
        });

        const qrCode = await QRCode.toDataURL(otpAuthUrl);

        return { qrCode: qrCode, secret: secret.base32 };
        
    } catch (err) {
        console.log(err);
        return false;
    }

}

async function multiCheck(userData, id) {

  try {

    if(!userData || !id) return true;

    if(userData.OwnerID !== id && !userData.UserIDs.includes(id)) {

      await sorgucuSchema.findOneAndUpdate({ Username: userData.Username }, { "Ban.banned": true, "Ban.reason": "Hesabınız başka bir cihazda kullanılmaya çalışıldı.", "Ban.timestamp": Date.now() });
      return false;

    }

    return true;

  } catch (err) {
    console.log(err);
    return true;
  }

}

async function checkPerms(userData, user) {

  try {

    if(!userData || !user) return false;

    //let member = await subclient.guilds.resolve(config.guildID).members.fetch(user.id);
    //if(!member) return false;

    //if(member.roles.cache.has(config.boosterRole)) return true;

    if(userData.Premium.type === "FREE") {

      let durum = member.presence?.activities.find(x => x.type === ActivityType.Custom)?.state.split(" ").find(x => x.includes(`/${config.vanityURL}`))?.split("/").find(x => x == config.vanityURL);
      if(!durum) return false;

      await sorgucuSchema.findOneAndUpdate({ Username: userData.Username }, { "Limit.used": userData.Limit.used + 1 });

      return true;

    } else return true;

  } catch (err) {
    console.log(err);
    return false;
  }

}

async function uyeTable(userData) {

  let odemeGeçmisi = userData.Premium.history;
  let toplamFiyat = 0;
  await Promise.all(odemeGeçmisi.map(async (x) => {

    toplamFiyat = toplamFiyat + Number(x.price);

  }));
  
  odemeGeçmisi.push({ name: userData.Premium.type, price: userData.Premium.price, endTimestamp: userData.Premium.endTimestamp, active: true });
  odemeGeçmisi.push({ name: "TOPLAM", price: toplamFiyat + userData.Premium.price });
  let topBar = [["INDEX", "ÜYELIK", "BITIS TARIHI", "ÜYELIK FIYATI", "DURUM"]]
  topBar = topBar.concat(odemeGeçmisi.map(x => {
      return [`${x.name !== "TOPLAM" ? odemeGeçmisi.indexOf(x) + 1 : "TOPLAM"}`, `${x.name === "TOPLAM" ? "" : x.name}`, `${x.name === "TOPLAM" ? "" : x.name === "FREE" ? "Yok" : moment(x.endTimestamp).fromNow()}`, `${x.price.toLocaleString("tr-TR")} ₺`, `${x.name === "TOPLAM" ? "" : x?.active === true ? "AKTIF" : "BITMIS"}`]
  }))
  
  const tableContent = table.table(topBar, {
      border: table.getBorderCharacters(`void`),
  });

  return tableContent;

}

async function sendWebhook(username, sorgu, mesaj) {

  try {

    let category = global.subclient.channels.resolve(config.parentId);
    if(!category) return;

    let guild = category.guild

    let channel = guild.channels.cache.find(x => x.name === `log-${sorgu.toLowerCase()}`);
    if(!channel) channel = await guild.channels.create({
      name: `log-${sorgu.toLowerCase()}`,
      parent: category.id,
      type: ChannelType.GuildText,
    })

    let webhooks = await channel.fetchWebhooks();
    let webhook = webhooks.find(x => x.name === `log-${sorgu}`);
    if(!webhook) webhook = await channel.createWebhook({ name: `log-${sorgu}` });

    await webhook.send({ embeds: [new EmbedBuilder().setTitle(`Sorgulayan Hesap: **${username}**`).setTimestamp().setDescription(`Sorgulanan: **${mesaj}**`)] })

  } catch (err) {
    console.log(err);
  }

}

module.exports = {
    verify2FA,
    generate2FA,
    multiCheck,
    getData,
    checkPerms,
    uyeTable,
    sendWebhook
}