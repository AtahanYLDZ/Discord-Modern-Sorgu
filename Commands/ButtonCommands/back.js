const config = require("../../Settings/config");
const { emojis } = config;
const sorgucuSchema = require('../../Database/Schemas/sorgucuSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { verify2FA, multiCheck, checkPerms } = require("../../Settings/Functions/functions");
const sorguList = require("../../Settings/sorguList.json");

module.exports = {
    customId: "back",
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
            `)], attachments: [], components: [], ephemeral: true })

        }

        if(userData.Ban.banned === true || !await multiCheck(userData, int.user.id)) return await int.update({ embeds: [embed.setDescription(`Hesabınız askıya alınmıştır sebebi;\n\n\`${userData.Ban.reason ?? "Hesabınıza farklı bir cihazdan giriş yapıldığı için hesabınız askıya alınmıştır."}\``)] })

        let sorgular = sorguList.filter((sorgu) => sorgu.active === true && ["FREE",userData.Premium.type].some(type => sorgu.premiumType.includes(type)))
        if(userData.Premium.type === "FREE") sorgular.push({ value: "LIMIT", description: "Limitinizi gösterir." })

        let SelectMenu = new StringSelectMenuBuilder()
        .setCustomId(`sorgular-${username}-${int.user.id}`)
        .setPlaceholder("Mevcut Sorgularınızı görüntülemek için tıklayın.")
        .addOptions(sorgular.map((sorgu) => new StringSelectMenuOptionBuilder().setLabel(sorgu.value === "TEMIZLE" ? `${sorgu.value}` : `${sorgu.value} Sorgu`).setValue(sorgu.value).setDescription(sorgu.description).setEmoji(sorgu.value === "TEMIZLE" ? emojis.BIN : emojis.SEARCH)));

        let SelectMenuRow = new ActionRowBuilder().addComponents(SelectMenu);

        let row = new ActionRowBuilder().addComponents([
            new ButtonBuilder()
            .setCustomId(`info-${int.user.id}`)
            .setStyle(ButtonStyle.Primary)
            .setEmoji(emojis.INFO),
            new ButtonBuilder()
            .setCustomId(`payment-${username}-${int.user.id}`)
            .setStyle(ButtonStyle.Success)
            .setEmoji(emojis.PAYMENT),
            new ButtonBuilder()
            .setCustomId(`settings-${username}-${int.user.id}`)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(emojis.SETTINGS)
            .setDisabled(userData.OwnerID !== int.user.id),
            new ButtonBuilder()
            .setCustomId(`adminPanel-${username}-${int.user.id}`)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(emojis.ADMIN)
            .setDisabled(userData.OwnerID !== int.user.id || !config.admins.includes(username)),
            new ButtonBuilder()
            .setCustomId(`membership-${username}-${int.user.id}`)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(emojis.MONEY)
        ]);

        await int.update({ embeds: [embed.setDescription(`
        Merhaba ${int.user} ${emojis.HELLO}!

        Sisteme başarılı bir şekilde giriş yaptınız, mevcut olan tüm sorguları kullanabilirsiniz.

        Üyelik Bilgileriniz;
        \`•\` Kullanıcı Adı: \`${userData.Username}\`
        \`•\` Üyelik Tipi: \`${userData.Premium.type}\`
        \`•\` Üyelik Bitiş Tarihi: ${userData.Premium.type === "FREE" ? "\`Sınırsız\`" : `<t:${Math.floor(userData.Premium.endTimestamp / 1000)}:R>`}
        \`•\` Son Giriş Tarihi: <t:${Math.floor(userData.LastLogin / 1000)}:R>

        \`1.\` \`${emojis.PAYMENT}\` butonuna tıklayarak ödeme geçmişinizi görüntüleyebilirsiniz.
        \`2.\` \`${emojis.SETTINGS}\` butonuna tıklayarak ayarlarınızı görüntüleyebilirsiniz.
        \`3.\` Aşağıdaki \`çoktan seçmeli\` menüyü kullanarak mevcut olan sorguları yapabilirsiniz.
        `)], attachments: [], components: [row, SelectMenuRow] })

    }
}