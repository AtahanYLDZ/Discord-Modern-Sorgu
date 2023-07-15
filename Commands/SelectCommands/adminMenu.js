const config = require("../../Settings/config");
const { emojis } = config;
const sorgucuSchema = require('../../Database/Schemas/sorgucuSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, AttachmentBuilder } = require("discord.js");
const { checkPerms, generate2FA, verify2FA } = require("../../Settings/Functions/functions");

module.exports = {
    customId: "controlPanelMenu",
    deferReply: false,
    async execute(client, int, embed, values) {

        const username = values[1];
        const islem = int.values[0];

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

        const usernameInput = new TextInputBuilder()
        .setCustomId("username")
        .setPlaceholder("Kullanıcı adı giriniz.")
        .setMinLength(3)
        .setMaxLength(24)
        .setRequired(islem !== "userInfo")
        .setLabel("Kullanıcı Adı")
        .setStyle(TextInputStyle.Short)

        const dcidInput = new TextInputBuilder()
        .setCustomId("id")
        .setPlaceholder("Kullanıcı ID giriniz.")
        .setRequired(false)
        .setLabel("Kullanıcı ID")
        .setStyle(TextInputStyle.Short)

        const uyelikInput = new TextInputBuilder()
        .setCustomId("uyelik")
        .setPlaceholder("Üyelik türünü giriniz.")
        .setRequired(true)
        .setLabel("Üyelik Türü")
        .setStyle(TextInputStyle.Short)

        const tipiInput = new TextInputBuilder()
        .setCustomId("tipi")
        .setPlaceholder("Tipi giriniz. (Ver veya Al)")
        .setRequired(true)
        .setLabel("Tipi")
        .setStyle(TextInputStyle.Short)

        const sebepInput = new TextInputBuilder()
        .setCustomId("sebep")
        .setPlaceholder("Sebep giriniz.")
        .setRequired(true)
        .setLabel("Sebep")
        .setStyle(TextInputStyle.Paragraph)
        .setMaxLength(1024)

        const sureInput = new TextInputBuilder()
        .setCustomId("gun")
        .setPlaceholder("Gün giriniz. (örn: 7, -3)")
        .setRequired(islem === "userExtend")
        .setLabel("Gün")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(4)

        const usernameRow = new ActionRowBuilder().addComponents(usernameInput);
        const dcidRow = new ActionRowBuilder().addComponents(dcidInput);
        const uyelikRow = new ActionRowBuilder().addComponents(uyelikInput);
        const tipiRow = new ActionRowBuilder().addComponents(tipiInput);
        const sebepRow = new ActionRowBuilder().addComponents(sebepInput);
        const sureRow = new ActionRowBuilder().addComponents(sureInput);

        const modal = new ModalBuilder()
        .setCustomId(`${islem}Modal-${username}-${int.user.id}`)
        .setTitle("Perla Sorgu Botu - Admin Paneli")

        switch(islem) {

            case "userEdit":

                modal.setComponents([usernameRow, uyelikRow, tipiRow, sureRow])

                await int.showModal(modal);

            break;

            case "userInfo":

                modal.setComponents([usernameRow, dcidRow])

                await int.showModal(modal);

            break;

            case "userBan":

                modal.setComponents([usernameRow, sebepRow])

                await int.showModal(modal);

            break;

            case "userUnban":

                modal.setComponents([usernameRow, sebepRow])

                await int.showModal(modal);

            break;

            case "userExtend":

                modal.setComponents([usernameRow, sureRow])

                await int.showModal(modal);

            break;

            default:

                await int.deferUpdate();
    
            break;

        }

    }
}