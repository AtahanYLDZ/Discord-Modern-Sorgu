const config = require("../../../Settings/config");
const { emojis } = config;
const sorgucuSchema = require('../../../Database/Schemas/sorgucuSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { verify2FA, multiCheck, checkPerms } = require("../../../Settings/Functions/functions");

module.exports = {
    customId: "changePwModal",
    deferReply: true,
    async execute(client, int, embed, values) {

        const username = values[1];
        const password = int.fields.getTextInputValue("password");
        const newPassword = int.fields.getTextInputValue("newPassword");
        const code = int.fields.getTextInputValue("2fa");

        let userData = await sorgucuSchema.findOne({ Username: username, Password: password });
        if(!userData) {

            return await int.followUp({ embeds:[embed.setDescription(`
            Merhaba ${int.user} ${emojis.HELLO}!
            
            Girilen bilgilerle eşleşen bir __Kullanıcı__ kaydı bulunamadı, bilgilerinizi kontrol edin ve tekrar deneyin
            
            Başlıca Hatalar;
            \`1.\` Böyle bir Kullanıcı kaydı veritabanında bulunmuyor olabilir.
            \`2.\` Kullanıcı bilgisi veya Şifre bilgisi yanlış girilmiş olabilir.
            \`3.\` Yaptığınız bir hatadan dolayı "Kullanıcı" kaydınız silinmiş olabilir.
            
            Eğer hata bunlardan biri değil ise lütfen "Geliştirici ekibine" yazmayın, sorunlarınızı sadece yönetim ve üst yönetimdeki kişilere bildirin.
            `)], components: [], ephemeral: true })

        }

        if(userData.TwoFactor.active === true && !await verify2FA(userData, code)) return await int.followUp({ embeds: [embed.setDescription(`Girilen 2FA kodunuz yanlış.`)], components: [] })

        userData.Password = newPassword;
        await userData.save();

        return await int.followUp({ embeds:[embed.setDescription(`
        Merhaba ${int.user} ${emojis.HELLO}!

        Şifreniz başarıyla değiştirildi, artık yeni şifreniz ile giriş yapabilirsiniz.

        Yeni şifreniz: \`${newPassword}\`
        `)], components: [], ephemeral: true })

    }
}