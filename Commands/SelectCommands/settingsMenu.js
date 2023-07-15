const config = require("../../Settings/config");
const { emojis } = config;
const sorgucuSchema = require('../../Database/Schemas/sorgucuSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, AttachmentBuilder } = require("discord.js");
const { checkPerms, generate2FA, verify2FA } = require("../../Settings/Functions/functions");

module.exports = {
    customId: "settingsMenu",
    deferReply: false,
    async execute(client, int, embed, values) {

        const username = values[1];
        const islem = int.values[0];

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
            `)], components: [], attachments:[], ephemeral: true })

        }

        const codeInput = new TextInputBuilder()
        .setPlaceholder("2FA Kodunuzu girin. (Eğer 2FA'nız yoksa boş bırakınız.)")
        .setRequired(userData.TwoFactor.active || false)
        .setLabel("2FA Kodu")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(6)
        .setMinLength(6)
        .setCustomId("2fa")

        const passwordInput = new TextInputBuilder()
        .setPlaceholder("Şifrenizi girin.")
        .setRequired(true)
        .setLabel("Şifre")
        .setStyle(TextInputStyle.Short)
        .setCustomId("password")
        
        const newPasswordInput = new TextInputBuilder()
        .setPlaceholder("Yeni şifrenizi girin.")
        .setRequired(true)
        .setLabel("Yeni Şifre")
        .setStyle(TextInputStyle.Short)
        .setCustomId("newPassword")

        const whitelistInput = new TextInputBuilder()
        .setPlaceholder("Bir Kullanıcı ID'si girin.")
        .setRequired(true)
        .setLabel("WhiteList")
        .setStyle(TextInputStyle.Short)
        .setCustomId("id")

        const redeemCodeInput = new TextInputBuilder()
        .setPlaceholder("Bir kod girin.")
        .setRequired(true)
        .setLabel("Kod")
        .setStyle(TextInputStyle.Short)
        .setCustomId("promoCode")
        
        const codeRow = new ActionRowBuilder().addComponents(codeInput)
        const passwordRow = new ActionRowBuilder().addComponents(passwordInput)
        const newPasswordRow = new ActionRowBuilder().addComponents(newPasswordInput)
        const whitelistRow = new ActionRowBuilder().addComponents(whitelistInput)
        const redeemCodeRow = new ActionRowBuilder().addComponents(redeemCodeInput)

        const modal = new ModalBuilder()
        .setTitle("Perla Sorgu Botu - Ayarlar")
        .setCustomId(`${islem}Modal-${username}-${int.user.id}`)

        switch(islem) {

            case "change2FA":

                if(userData.TwoFactor.active) {

                    modal.setComponents([passwordRow, codeRow])

                    await int.showModal(modal);

                } else {

                    const google2FA = await generate2FA(username);

                    let qrRow = new ActionRowBuilder().addComponents([
                        new ButtonBuilder()
                        .setCustomId(`2FAConfirm-${username}-${google2FA.secret}-${int.user.id}`)
                        .setStyle(ButtonStyle.Success)
                        .setLabel("2FA Kodunu Gir"),
                        new ButtonBuilder()
                        .setCustomId(`back-${username}-${int.user.id}`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(emojis.BACK)
                    ])

                    const qrKod = new AttachmentBuilder(Buffer.from(google2FA.qrCode.replace("data:image/png;base64,", ""), "base64"), { name: "qrCode.jpg" })

                    await int.update({ embeds: [embed.setDescription(`
                    Merhaba ${int.user} 👋🏻!

                    2FA Aktif etmek için aşağıdaki adımları takip edin;
                    \`1.\` Telefonunuza "Authenticator" uygulamasını indirin.
                    \`2.\` Uygulamayı açın ve QR Kodunu okutun veya "Kod Ekle" seçeneğini seçin ve aşağıdaki kodu girin.
                    \`3.\` Uygulamada gözüken 6 haneli kodu aşağıdaki butona tıklayarak girin.
                    \`4.\` 2FA Aktif etme işlemi tamamlandı, artık 2FA aktif durumda.

                    **2FA Kodu:** \`${google2FA.secret}\`
                    `).setImage("attachment://qrCode.jpg")], files:[qrKod], components: [qrRow] })

                }

            break;

            case "changePw":

                modal.setComponents([passwordRow, newPasswordRow, codeRow])

                await int.showModal(modal);

                await int.deleteReply();

            break;

            case "addWl":

                modal.setComponents([whitelistRow, codeRow])

                await int.showModal(modal);

            break;

            case "removeWl":

                modal.setComponents([whitelistRow, codeRow])

                await int.showModal(modal);

            break;

            case "viewWl":

                let users = [];
                await Promise.all(userData.UserIDs.map(async (id) => {

                    let user = await client.users.fetch(id)

                    users.push(user)

                }))

                await int.update({ embeds: [embed.setDescription(`
                Merhaba ${int.user} 👋🏻!

                WhiteList'de bulunan kullanıcılar;
                ${users.map((user, index) => `\`${index + 1}.\` ${user.tag} (\`${user.id}\`)`).join("\n")}
                `)] })

            break;

            case "redeemCode": 

                modal.setComponents([redeemCodeRow])

                await int.showModal(modal);

            break;

            default:

                await int.deferUpdate();

            break;

        }

    }
}