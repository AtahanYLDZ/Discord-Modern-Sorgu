const config = require('../../Settings/config');
const { emojis } = config;
const sorgucuSchema = require('../../Database/Schemas/sorgucuSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { uyeTable } = require('../../Settings/Functions/functions');

module.exports = {
    customId: "payment",
    deferReply: false,
    async execute(client, int, embed, values) {

        const username = values[1];

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

        const tableContent = await uyeTable(userData)
                    
        await int.update({
            embeds: [embed.setThumbnail(null).setDescription(`${codeBlock("css", tableContent)}`)]
        }).catch(() => {});

    }
}