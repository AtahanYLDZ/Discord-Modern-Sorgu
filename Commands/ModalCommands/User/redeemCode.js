const config = require("../../../Settings/config");
const { emojis } = config;
const sorgucuSchema = require('../../../Database/Schemas/sorgucuSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { verify2FA, multiCheck, checkPerms } = require("../../../Settings/Functions/functions");
const fs = require("node:fs");
const promoCodeList = JSON.parse(fs.readFileSync("./Settings/promoCodes.json", "utf8"));

module.exports = {
    customId: "redeemCodeModal",
    deferReply: false,
    async execute(client, int, embed, values) {

        const username = values[1];
        let promoCode = int.fields.getTextInputValue("promoCode").toUpperCase().trim();

        let userData = await sorgucuSchema.findOne({ Username: username });
        if(!userData) {

            return await int.update({ embeds:[embed.setDescription(`
            Merhaba ${int.user} ${emojis.HELLO}!
            
            Girilen bilgilerle eşleşen bir __Kullanıcı__ kaydı bulunamadı, bilgilerinizi kontrol edin ve tekrar deneyin
            
            Başlıca Hatalar;
            \`1.\` Böyle bir Kullanıcı kaydı veritabanında bulunmuyor olabilir.
            \`2.\` Kullanıcı bilgisi veya Şifre bilgisi yanlış girilmiş olabilir.
            \`3.\` Yaptığınız bir hatadan dolayı "Kullanıcı" kaydınız silinmiş olabilir.
            
            Eğer hata bunlardan biri değil ise lütfen "Geliştirici ekibine" yazmayın, sorunlarınızı sadece yönetim ve üst yönetimdeki kişilere bildirin.
            `)], components: [], attachments: [], ephemeral: true })

        }

        let gift = promoCodeList.find(x => x.code === promoCode);

        if(!gift) return await int.update({ embeds: [embed.setDescription(`Girilen promosyon kodu geçersiz.`)], components: [], attachments: [], ephemeral: true })
        if(userData.PromoCodes.includes(promoCode)) return await int.update({ embeds: [embed.setDescription(`Girilen promosyon kodu zaten kullanılmış.`)], components: [], attachments: [], ephemeral: true })
        if(userData.Premium.type !== "FREE") return await int.update({ embeds: [embed.setDescription(`Girilen promosyon kodunu kullanabilmek için öncelikle __${userData.Premium.type}__ üyeliğinizin bitmesi gerekiyor.`)], components: [], attachments: [], ephemeral: true })

        if(promoCode === "IPOZEL1GUN") userData.PromoCodes.push("ITOZEL1GUN");
        if(promoCode === "ITOZEL1GUN") userData.PromoCodes.push("IPOZEL1GUN");

        userData.PromoCodes.push(promoCode);
        userData.Premium.type = gift.gift;
        userData.Premium.startTimestamp = Date.now();
        userData.Premium.endTimestamp = Date.now() + Number(gift.gifttime) * 24 * 60 * 60 * 1000;
        userData.Premium.price = 0;
        await userData.save();

        await int.update({ embeds: [embed.setDescription(`
        Merhaba ${int.user} ${emojis.HELLO}!

        Başarıyla **${gift.giftname}** üyeliğinizi aktif ettiniz, üyeliğiniz <t:${Math.floor(userData.Premium.endTimestamp / 1000)}> tarihinde sona erecek.
        `)], components: [], attachments: [], ephemeral: true })

    }
}