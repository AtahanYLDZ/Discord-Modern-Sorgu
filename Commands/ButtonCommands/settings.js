const config = require('../../Settings/config');
const { emojis } = config;
const sorgucuSchema = require('../../Database/Schemas/sorgucuSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");

module.exports = {
    customId: "settings",
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

        let SettingsMenu = new StringSelectMenuBuilder()
        .setCustomId(`settingsMenu-${username}-${int.user.id}`)
        .setPlaceholder("Ayarlarınızı görüntülemek için tıklayın.")
        .addOptions([
            new StringSelectMenuOptionBuilder()
            .setLabel("Şifre Değiştir")
            .setValue(`changePw`)
            .setDescription("Buraya tıklayarak şifrenizi değiştirebilirsiniz.")
            .setEmoji(emojis.PASSWORD),
            new StringSelectMenuOptionBuilder()
            .setLabel(userData.TwoFactor.active ? "2FA Devre Dışı Bırak" : "2FA Aktif Et")
            .setValue(`change2FA`)
            .setDescription(userData.TwoFactor.active ? "Buraya tıklayarak 2FA'nızı devre dışı bırakabilirsiniz." : "Buraya tıklayarak 2FA'nızı aktif edebilirsiniz.")
            .setEmoji(emojis.VERIFY),
            new StringSelectMenuOptionBuilder()
            .setLabel("Whitelist Ekle")
            .setValue(`addWl`)
            .setDescription(`Buraya tıklayarak hesabınızı paylaşmak istediğiniz kişileri ekleyebilirsiniz`)
            .setEmoji(emojis.ADD),
            new StringSelectMenuOptionBuilder()
            .setLabel("Whitelist Kaldır")
            .setValue(`removeWl`)
            .setDescription("Buraya tıklayarak hesabınızı paylaştığınız kişileri kaldırabilirsiniz.")
            .setEmoji(emojis.REMOVE),
            new StringSelectMenuOptionBuilder()
            .setLabel("Whitelist Görüntüle")
            .setValue(`viewWl`)
            .setDescription("Buraya tıklayarak hesabınızı paylaştığınız kişileri görüntüleyebilirsiniz.")
            .setEmoji(emojis.SEARCH),
            new StringSelectMenuOptionBuilder()
            .setLabel("Kod Kullan")
            .setValue(`redeemCode`)
            .setDescription("Buraya tıklayarak kod kullanabilirsiniz.")
            .setEmoji(emojis.GIFT),
            new StringSelectMenuOptionBuilder()
            .setLabel("TEMIZLE")
            .setValue("clear")
            .setDescription("Seçimi temizle.")
            .setEmoji(emojis.BIN)
        ])

        let settingsRow = new ActionRowBuilder().addComponents(SettingsMenu);
        
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
            .setCustomId(`back-${username}-${int.user.id}`)
            .setEmoji(emojis.BACK)
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId(`adminPanel-${username}-${int.user.id}`)
            .setEmoji(emojis.ADMIN)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(!config.admins.includes(username)),
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
        \`2.\` Aşağıdaki \`çoktan seçmeli\` menüyü kullanarak ayarlarınızı görüntüleyebilirsiniz.
        `)], components: [row, settingsRow] }).catch(() => {});

    }
}