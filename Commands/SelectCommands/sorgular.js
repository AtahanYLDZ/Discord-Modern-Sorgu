const config = require("../../Settings/config");
const { emojis } = config;
const sorgucuSchema = require('../../Database/Schemas/sorgucuSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { checkPerms } = require("../../Settings/Functions/functions");

module.exports = {
    customId: "sorgular",
    deferReply: false,
    async execute(client, int, embed, values) {

        const username = values[1];
        const sorgu = int.values[0];

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

        if(!["TEMIZLE","LIMIT"].includes(sorgu) && !await checkPerms(userData, int.user)) return await int.update({ embeds: [embed.setDescription(`Sorgu yaparken bir hata oluştu başlıca hatalar;\n\n\`1.\` [Discord Sunucumuz](https://discord.gg/perla)'da olmanız gerekebilir.\n\`2.\` ${userData.Premium.type === "FREE" ? `Durumunuza \`.gg/${config.vanityURL}\` almanız gerekebilir.` : `\`${userData.Premium.type}\` Üyeliğiniz bitmiş olabiir.`}`)] })
        if(userData.Limit.total - userData.Limit.used <= 0) return await int.update({ embeds: [embed.setDescription(`Sorgu limitiniz \`${config.sorguhak}/${config.sorguhak}\` dolmuştur limit kaldırmak için üyelik alabilirsiniz.`)] })

        const tcknInput = new TextInputBuilder()
        .setCustomId("tckn")
        .setLabel("TCKN")
        .setPlaceholder("TC Kimlik Numaranısı Giriniz.")
        .setMinLength(11)
        .setMaxLength(11)
        .setStyle(TextInputStyle.Short)
        .setRequired(true)

        const adInput = new TextInputBuilder()
        .setCustomId("ad")
        .setLabel("ADI")
        .setPlaceholder("Kişinin Adını Giriniz.")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)

        const soyadInput = new TextInputBuilder()
        .setCustomId("soyad")
        .setLabel("SOYADI")
        .setPlaceholder("Kişinin Soyadını Giriniz.")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)

        const ilInput = new TextInputBuilder()
        .setCustomId("il")
        .setLabel("İL")
        .setPlaceholder("Kişinin İlini Giriniz.")
        .setStyle(TextInputStyle.Short)
        .setRequired(userData.Premium.type === "FREE" || ["AD","SOYAD"].includes(sorgu))

        const ilceInput = new TextInputBuilder()
        .setCustomId("ilce")
        .setLabel("İLÇE")
        .setPlaceholder("Kişinin İlçesini Giriniz.")
        .setStyle(TextInputStyle.Short)
        .setRequired(false)

        const dtInput = new TextInputBuilder()
        .setCustomId("dt")
        .setLabel("DOĞUM TARİHİ")
        .setPlaceholder("Kişinin Doğum Tarihini Giriniz. (örn: 01.01.2000 veya 2000 gibi)")
        .setStyle(TextInputStyle.Short)
        .setRequired(["AD","SOYAD"].includes(sorgu))

        const uyrukInput = new TextInputBuilder()
        .setCustomId("uyruk")
        .setLabel("UYRUK")
        .setPlaceholder("Kişinin Uyruğunu Giriniz. (örn: FR, DE, US)")
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setMaxLength(3)
        .setMinLength(2)

        const gsmInput = new TextInputBuilder()
        .setCustomId("gsm")
        .setLabel("GSM")
        .setPlaceholder("Kişinin GSM Numarasını Giriniz.")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)

        const plakaInput = new TextInputBuilder()
        .setCustomId("plaka")
        .setLabel("PLAKA")
        .setPlaceholder("Kişinin Plakasını Giriniz.")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(11)

        const tcknRow = new ActionRowBuilder().addComponents(tcknInput);
        const adRow = new ActionRowBuilder().addComponents(adInput);
        const soyadRow = new ActionRowBuilder().addComponents(soyadInput);
        const ilRow = new ActionRowBuilder().addComponents(ilInput);
        const ilceRow = new ActionRowBuilder().addComponents(ilceInput);
        const dtRow = new ActionRowBuilder().addComponents(dtInput);
        const uyrukRow = new ActionRowBuilder().addComponents(uyrukInput);
        const gsmRow = new ActionRowBuilder().addComponents(gsmInput);
        const plakaRow = new ActionRowBuilder().addComponents(plakaInput);

        let modal = new ModalBuilder()
        .setCustomId(`${sorgu.toLowerCase()}Modal-${username}-${int.user.id}`)
        .setTitle(`${sorgu} Sorgusu`)

        switch(sorgu) {

            case "ADSOYAD":

                modal.setComponents([adRow, soyadRow, ilRow, ilceRow, dtRow])

                await int.showModal(modal);

            break;

            case "AD":

                modal.setComponents([adRow, ilRow, ilceRow, dtRow, uyrukRow])

                await int.showModal(modal);

            break;

            case "SOYAD":

                modal.setComponents([soyadRow, ilRow, ilceRow, dtRow, uyrukRow])

                await int.showModal(modal);

            break;

            case "GSMTC":

                modal.setComponents([gsmRow])

                await int.showModal(modal);

            break;

            case "PLAKA":

                modal.setComponents([plakaRow])

                await int.showModal(modal);

            break;

            case "LIMIT":

                await int.update({ embeds: [embed.setDescription(`Sorgu limitiniz \`${userData.Limit.total - userData.Limit.used}/${userData.Limit.total}\` olarak görünüyor.`)] })

            break;

            case "TEMIZLE":

                await int.deferUpdate();

            break;

            default:

                modal.setComponents([tcknRow])

                await int.showModal(modal);

            break;

        }

    }
}