const config = require("../../../Settings/config");
const { emojis } = config;
const sorgucuSchema = require('../../../Database/Schemas/sorgucuSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { verify2FA, multiCheck, checkPerms } = require("../../../Settings/Functions/functions");
const premiumList = require("../../../Settings/premiumList.json");

module.exports = {
    customId: "userEditModal",
    deferReply: true,
    async execute(client, int, embed, values) {

        const ausername = values[1];
        const username = int.fields.getTextInputValue("username").trim();
        const uyelik = int.fields.getTextInputValue("uyelik").toUpperCase().trim();
        const tipi = int.fields.getTextInputValue("tipi").toLowerCase().trim();
        let gun = int.fields.getTextInputValue("gun");
        if(!gun) gun = 30;

        const uyelikler = premiumList.map(x => x.name.toUpperCase());
        if(!["ver","al"].includes(tipi)) return await int.followUp({ embeds:[embed.setDescription(`Geçerli bir tip seçiniz (Ver veya Al).`)], components: [], attachments: [] })
        if(!uyelikler.includes(uyelik)) return await int.followUp({ embeds:[embed.setDescription(`Geçerli bir üyelik seçiniz (VIP veya PREMIUM).`)], components: [], attachments: [] })

        let userData = await sorgucuSchema.findOne({ Username: username });
        if(!userData) return await int.followUp({ embeds:[embed.setDescription(`\`${username}\` Adlı bir hesap bulunamadı.`)], components: [], attachments: [] })
        if(!config.owners.includes(ausername) && config.admins.includes(username)) return await int.followUp({ embeds:[embed.setDescription(`\`${username}\` Adlı hesabı düzenleyemezsiniz.`)], components: [], attachments: [] })

        let sure = Number(gun) * 24 * 60 * 60 * 1000;

        switch(tipi) {

            case "ver":

                if(userData.Premium.type !== "FREE") userData.Premium.history.push({ name: userData.Premium.type, startTimestamp: userData.Premium.startTimestamp, endTimestamp: userData.Premium.endTimestamp, price: userData.Premium.price });

                userData.Premium.type = uyelik;
                userData.Premium.startTimestamp = Date.now();
                userData.Premium.endTimestamp = Date.now() + sure;
                userData.Premium.price = Number(gun) * premiumList.find(x => x.name === uyelik).dayPrice;

            break;

            case "al":

                if(userData.Premium.type === "FREE" || userData.Premium.type !== uyelik) return await int.followUp({ embeds:[embed.setDescription(`\`${username}\` Adlı hesabın üyeliği zaten yok.`)], components: [], attachments: [] })

                userData.Premium.history.push({ name: uyelik, startTimestamp: userData.Premium.startTimestamp, endTimestamp: userData.Premium.endTimestamp, price: userData.Premium.price });

                userData.Premium.type = "FREE";
                userData.Premium.startTimestamp = null;
                userData.Premium.endTimestamp = null;
                userData.Premium.price = 0;

            break;

        }

        await userData.save();

        let user = await client.users.fetch(userData.OwnerID);

        return await int.followUp({ embeds:[embed.setDescription(`
        Merhaba ${int.user} ${emojis.HELLO}!

        \`${username}\` Adlı hesabın ${tipi === "ver" ? "verilen" : "alınan"} üyelik;
        Sahibi: **${user.tag}** (\`${user.id}\`)

        Üyelik: \`${userData.Premium.type}\`
        Başlangıç Tarihi: <t:${Math.floor(userData.Premium.startTimestamp / 1000)}>
        Bitiş Tarihi: <t:${Math.floor(userData.Premium.endTimestamp / 1000)}>
        `)], components: [], attachments: [] })

    }
}