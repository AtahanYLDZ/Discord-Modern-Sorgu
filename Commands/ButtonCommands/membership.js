const config = require('../../Settings/config');
const { emojis } = config;
const sorgucuSchema = require('../../Database/Schemas/sorgucuSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");

module.exports = {
    customId: "membership",
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
                    
        await int.update({
            embeds: [embed.setThumbnail(null).setDescription(`
            Merhaba ${int.user} ${emojis.HELLO}!

            Botumuzun üyelik fiyatları ve hangi üyelikte ne özellikler olduğunu merak ediyor musun?
            O zaman kısaca sana bunları anlatmama izin ver.

            \`Premium Fiyatı Aylık 100 TL\`
            Premium özellikleri: plaka sorgu hariç tüm sorguları kullanabilirsiniz.
            
            \`Premium+ Fiyatı Aylık 150 TL\`
            Premium+ özellikleri: plaka sorgu hariç tüm sorguları kullanabilirsiniz + ekstra olarak spotify duo gibi düşünün yani siz bu üyeliği satın aldınız **1 arkadaşınıza daha hediye edebiliyorsunuz** aynı üyelikten veyahut 2 kişisiniz 150/2=75 lira yapar iki arkadaş 75 lira toplayıp bu üyeliği alabilirsiniz.
            
            \`Vip Fiyatı Aylık 250 TL\`
            Vip özellikleri: plaka sorgu dahil tüm sorguları kullanabilirsiniz.
            
            \`Vip+ Fiyatı Aylık 300 TL\`
            Vip+ özellikleri: plaka sorgu dahil tüm sorguları kullanabilirsiniz + ekstra olarak spotify duo gibi düşünün yani siz bu üyeliği satın aldınız **1 arkadaşınıza daha hediye edebiliyorsunuz** aynı üyelikten veyahut 2 kişisiniz 300/2=150 lira yapar iki arkadaş 150 lira toplayıp bu üyeliği alabilirsiniz.
            `).setImage(config.listeGif)]
        }).catch(() => {});

    }
}