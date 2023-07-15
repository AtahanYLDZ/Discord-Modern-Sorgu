const config = require("../../../Settings/config");
const { emojis } = config;
const sorgucuSchema = require('../../../Database/Schemas/sorgucuSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { verify2FA } = require("../../../Settings/Functions/functions");

module.exports = {
    customId: "addWlModal",
    deferReply: true,
    async execute(client, int, embed, values) {

        const username = values[1];
        const id = int.fields.getTextInputValue("id");
        const code = int.fields.getTextInputValue("2fa");

        let userData = await sorgucuSchema.findOne({ Username: username });
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

        if(!["VIP+","PREMIUM+"].includes(userData.Premium.type)) return await int.followUp({ embeds:[embed.setDescription(`Bu komutu kullanabilmek için "VIP+" veya "PREMIUM+" üyelik gerekiyor.`)], components: [], attachments: [] })

        if(!userData.TwoFactor.active || !await verify2FA(userData, code)) return await int.followUp({ embeds:[embed.setDescription(`Girilen 2FA kodunuz yanlış.`)], components: [], attachments: [] })

        let wlLimit = 1;

        let user = null;
        try { user = await client.users.fetch(id) } catch (err) { user = null }

        if(!user) return await int.followUp({ embeds:[embed.setDescription(`Girilen ID ile eşleşen bir kullanıcı bulunamadı.`)], components: [], attachments: [] })
        if(userData.UserIDs.includes(id)) return await int.followUp({ embeds:[embed.setDescription(`Girilen ID zaten kayıtlı.`)], components: [], attachments: [] })
        if(userData.OwnerID === id) return await int.followUp({ embeds:[embed.setDescription(`Girilen ID zaten sizin ID'niz.`)], components: [], attachments: [] })
        if(userData.UserIDs.length >= wlLimit) return await int.followUp({ embeds:[embed.setDescription(`${wlLimit}'den fazla ID kaydedemezsiniz.`)], components: [], attachments: [] })

        userData.UserIDs.push(id);
        await userData.save();

        return await int.followUp({ embeds:[embed.setDescription(`
        Merhaba ${int.user} ${emojis.HELLO}!

        Başarıyla **${user.tag}** kullanıcısını whitelist'e eklediniz. 
        Artık bu kullanıcı hesabınızda sorgu yapabilir.
        `)], components: [], attachments: [] })

    }
}