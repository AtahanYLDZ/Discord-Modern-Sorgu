const config = require('../../Settings/config');
const { emojis } = config;
const sorgucuSchema = require('../../Database/Schemas/sorgucuSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");

module.exports = {
    customId: "adminPanel",
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
            `)], components: [], ephemeral: true })

        }

        let controlPanelMenu = new StringSelectMenuBuilder()
        .setCustomId(`controlPanelMenu-${username}-${int.user.id}`)
        .setPlaceholder("Admin paneline erişmek için tıklayın.")
        .addOptions([
            new StringSelectMenuOptionBuilder()
            .setLabel("Kullanıcı Bilgileri")
            .setValue("userInfo")
            .setDescription("Kullanıcı bilgilerini görüntüleyin.")
            .setEmoji(emojis.INFO),
            new StringSelectMenuOptionBuilder()
            .setLabel("Kullanıcı Düzenle")
            .setValue("userEdit")
            .setDescription("Kullanıcı bilgilerini düzenleyin.")
            .setEmoji(emojis.EDIT),
            new StringSelectMenuOptionBuilder()
            .setLabel("Kullanıcı Üyeliğini Düzenle")
            .setValue("userExtend")
            .setDescription("Kullanıcının üyeliğini uzatın.")
            .setEmoji(emojis.ADD),
            new StringSelectMenuOptionBuilder()
            .setLabel("Kullanıcı Banla")
            .setValue("userBan")
            .setDescription("Kullanıcıyı bot üzerinden banlayın.")
            .setEmoji(emojis.BAN),
            new StringSelectMenuOptionBuilder()
            .setLabel("Kullanıcı Ban Kaldır")
            .setValue("userUnban")
            .setDescription("Kullanıcının bot üzerinden banını kaldırın.")
            .setEmoji(emojis.UNBAN),
            new StringSelectMenuOptionBuilder()
            .setLabel("TEMIZLE")
            .setValue("clear")
            .setDescription("Seçimi temizle.")
            .setEmoji(emojis.BIN)
        ])

        let controlPanelRow = new ActionRowBuilder().addComponents(controlPanelMenu)
        
        let row = new ActionRowBuilder().addComponents([
            new ButtonBuilder()
            .setCustomId(`info-${int.user.id}`)
            .setEmoji(emojis.INFO)
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId(`payment-${username}-${int.user.id}`)
            .setEmoji(emojis.PAYMENT)
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId(`settings-${username}-${int.user.id}`)
            .setEmoji(emojis.SETTINGS)
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setCustomId(`back-${username}-${int.user.id}`)
            .setEmoji(emojis.BACK)
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId(`membership-${username}-${int.user.id}`)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(emojis.MONEY)
        ])

        await int.update({ embeds: [embed.setDescription(`
        Merhaba ${int.user} ${emojis.HELLO}!

        Sisteme başarılı bir şekilde giriş yaptınız, mevcut olan tüm sorguları kullanabilirsiniz.

        Üyelik Bilgileriniz;
        \`•\` Kullanıcı Adı: \`${userData.Username}\`
        \`•\` Üyelik Tipi: \`${userData.Premium.type}\`
        \`•\` Üyelik Bitiş Tarihi: ${userData.Premium.type === "FREE" ? "\`Sınırsız\`" : `<t:${Math.floor(userData.Premium.endTimestamp / 1000)}:R>`}
        \`•\` Son Giriş Tarihi: <t:${Math.floor(userData.LastLogin / 1000)}:R>

        \`1.\` \`${emojis.PAYMENT}\` butonuna tıklayarak ödeme geçmişinizi görüntüleyebilirsiniz.
        \`2.\` Aşağıdaki \`çoktan seçmeli\` menüyü kullanarak Admin paneline erişebilirsiniz.
        `)], components: [row, controlPanelRow], });

    }
}