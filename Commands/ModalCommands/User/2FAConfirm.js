const config = require("../../../Settings/config");
const { emojis } = config;
const sorgucuSchema = require('../../../Database/Schemas/sorgucuSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { verify2FA } = require("../../../Settings/Functions/functions");
const speakeasy = require("speakeasy");

module.exports = {
    customId: "2FAConfirmModal",
    deferReply: false,
    async execute(client, int, embed, values) {

        const username = values[1];
        const secret = values[2];
        const code = int.fields.getTextInputValue("2fa")

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
            `)], components: [], ephemeral: true })

        }

        if(userData.TwoFactor.active) return await int.update({ embeds:[embed.setDescription(`2FA zaten aktif.`)], components: [], attachments: [] })

        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: code
        });

        if(!verified) return await int.update({ embeds:[embed.setDescription(`Girilen 2FA kodunuz yanlış.`)], components: [], attachments: [] })

        userData.TwoFactor.active = true;
        userData.TwoFactor.secret = secret;
        await userData.save();

        let row = new ActionRowBuilder().addComponents([
            new ButtonBuilder()
            .setCustomId(`back-${username}-${int.user.id}`)
            .setEmoji(emojis.BACK)
            .setStyle(ButtonStyle.Primary),
        ])

        return await int.update({ embeds:[embed.setDescription(`
        Merhaba ${int.user} ${emojis.HELLO}!

        Başarıyla 2FA sistemi aktif edildi.
        `)], attachments: [], components: [row] })

    }
}