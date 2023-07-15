const config = require("../../../Settings/config");
const { emojis } = config;
const sorgucuSchema = require('../../../Database/Schemas/sorgucuSchema');
const { getData, sendWebhook } = require("../../../Settings/Functions/functions");
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, AttachmentBuilder } = require("discord.js");
const moment = require("moment");
moment.locale("tr");

module.exports = {
    customId: "plakaModal",
    deferReply: true,
    async execute(client, int, embed, values) {

        const username = values[1];
        const PLAKA = int.fields.getTextInputValue("plaka").trim().replaceAll(" ", "");

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
            `)], components: [], attachments: [], ephemeral: true })

        }

        let veri = await getData(`${config.api.PLAKA}${PLAKA}`);

        if (veri.success === false) return await int.followUp({ embeds: [embed.setDescription("Böyle bir PLAKA bulunamadı.")], ephemeral: true });

        veri = veri.data;

        let kisi = veri.KISI;
        let araç = veri.ARAC;

        sendWebhook(username, "PLAKA", `${PLAKA}\nID: \`${int.user.id}\``);

        let row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`previous-${int.user.id}`)
            .setEmoji(emojis.LEFT)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true),
            new ButtonBuilder()
            .setCustomId(`next-${int.user.id}`)
            .setEmoji(emojis.RIGHT)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true),
            new ButtonBuilder()
            .setCustomId(`sayfa-${int.user.id}`)
            .setLabel("Sayfa")
            .setEmoji(emojis.UPLOAD)
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId(`hepsi-${int.user.id}`)
            .setLabel("Hepsi")
            .setEmoji(emojis.UPLOAD)
            .setStyle(ButtonStyle.Success)
            .setDisabled(true)
        )

        embed = embed
        .setTitle(`**${kisi.ADI}** - **${kisi.SOYADI}**`)
        .setDescription(`KİŞİ TC: \`${kisi.TC}\`\nADRES: \`${kisi.ADRES}\`\nGSM: \`${kisi.GSM}\`\nKİŞİ HİSSE SAHİPLİĞİ: \`${kisi.HISSESAHIPLIGI}\`\nMOTOR NO: \`${araç.MOTORNO}\`\nTESCİL TARİHİ: \`${araç.TESCILTARIHI}\`\nMARKA: \`${araç.MARKA}\`\nMODEL YILI: \`${araç.MODELYILI}\`\nMODEL: \`${araç.MODEL}\`\nCİNS: \`${araç.CINS}\`\nPLAKA: \`${araç.PLAKA}\`\nŞAŞI NO: \`${araç.SASINO}\`\nSİLİNDİR HACMİ: \`${araç.SILINDIRHACMI}\`\nİLK TESCİL TARİHİ: \`${araç.ILKTESCILTARIHI}\`\nOTURMA YERİ: \`${araç.OTURMAYERI}\``)
        await int.followUp({ embeds: [embed], components: [row] }).then(async (msg) => {

            const collector = await msg.createMessageComponentCollector({ componentType: ComponentType.Button });

            collector.on("collect", async(i) => {

            if(i.user.id === int.user.id) {

                if(i.customId === `sayfa-${int.user.id}`) {

                    let content = `Kullanıcı Adı: ${username}\nSorgulanan PLAKA: ${PLAKA} - Toplam Kayıt: 1\nTarih: ${moment(Date.now()).format("LLLL")}\n\nKİŞİ TC: ${kisi.TC}\nADRES: ${kisi.ADRES}\nGSM: ${kisi.GSM}\nKİŞİ HİSSE SAHİPLİĞİ: ${kisi.HISSESAHIPLIGI}\nMOTOR NO: ${araç.MOTORNO}\nTESCİL TARİHİ: ${araç.TESCILTARIHI}\nMARKA: ${araç.MARKA}\nMODEL YILI: ${araç.MODELYILI}\nMODEL: ${araç.MODEL}\nCİNS: ${araç.CINS}\nPLAKA: ${araç.PLAKA}\nŞAŞI NO: ${araç.SASINO}\nSİLİNDİR HACMİ: ${araç.SILINDIRHACMI}\nİLK TESCİL TARİHİ: ${araç.ILKTESCILTARIHI}\nOTURMA YERİ: ${araç.OTURMAYERI}`
            
                    let atc = new AttachmentBuilder(Buffer.from(content, "utf-8"), { name: 'Atahan.txt'});
                    await i.deferReply({ ephemeral:true })
                    await i.followUp({ files: [atc], ephemeral:true });

                }

            }

            })

        })

    }
}