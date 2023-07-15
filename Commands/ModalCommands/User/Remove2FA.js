const config = require("../../../Settings/config");
const { emojis } = config;
const sorgucuSchema = require('../../../Database/Schemas/sorgucuSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { verify2FA } = require("../../../Settings/Functions/functions");

module.exports = {
    customId: "change2FAModal",
    deferReply: false,
    async execute(client, int, embed, values) {

        const username = values[1];
        const password = int.fields.getTextInputValue("password")
        const code = int.fields.getTextInputValue("2fa")

        let userData = await sorgucuSchema.findOne({ Username: username, Password: password })
        if(!userData) {

            return await int.update({ embeds:[embed.setDescription(`
            Merhaba ${int.user} ${emojis.HELLO}!
            
            Girilen bilgilerle eşleşen bir __Auth__ kaydı bulunamadı, bilgilerinizi kontrol edin ve tekrar deneyin
            
            Başlıca Hatalar;
            \`1.\` Böyle bir Auth kaydı veritabanında bulunmuyor olabilir.
            \`2.\` Auth bilgisi veya Şifre bilgisi yanlış girilmiş olabilir.
            \`3.\` Yaptığınız bir hatadan dolayı "Auth" kaydınız silinmiş olabilir.
            
            Eğer hata bunlardan biri değil ise lütfen "Geliştirici ekibine" yazmayın, sorunlarınızı sadece yönetim ve üst yönetimdeki kişilere bildirin.
            `)], components: [], ephemeral: true })

        } 

        if(!await verify2FA(userData, code)) return await int.update({ embeds:[embed.setDescription(`2FA Kodu yanlış girildi.`)] })

        userData.TwoFactor.active = false;
        userData.TwoFactor.secret = null;
        await userData.save();

        return await int.update({ embeds:[embed.setDescription(`
        2FA başarıyla kaldırıldı.

        Tekrar giriş yapabilirisiniz.
        `)], components: [], ephemeral: true })

    }
}