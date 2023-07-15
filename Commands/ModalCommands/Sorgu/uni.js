const config = require("../../../Settings/config");
const { emojis } = config;
const sorgucuSchema = require('../../../Database/Schemas/sorgucuSchema');
const { getData, sendWebhook } = require("../../../Settings/Functions/functions");
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, AttachmentBuilder } = require("discord.js");
const moment = require("moment");
moment.locale("tr");

module.exports = {
    customId: "universiteModal",
    deferReply: true,
    async execute(client, int, embed, values) {

        const username = values[1];
        const TCKN = int.fields.getTextInputValue("tckn");

        let veri = await getData(`${config.api.UNI}${TCKN}`);

        if (veri.success === false) return await int.followUp({ embeds: [embed.setDescription("Böyle bir TCKN bulunamadı.")], ephemeral: true });

        veri = veri.data;

        sendWebhook(username, "UNIVERSITE", `${TCKN}\nID: \`${int.user.id}\``)

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
        .setTitle(`**${veri.ADI}** - **${veri.SOYADI}** Adlı kişinin Üniversite sonuçları.`)
        .setDescription(`TC: \`${veri.TC}\`\nADI & SOYADI: \`${veri.ADI} - ${veri.SOYADI}\`\nDOĞUM TARİHİ: \`${veri.DOGUMTARIHI}\`\nÜNİVERSİTE: \`${veri.UNIVERSITE}\`\nPROGRAM: \`${veri.PROGRAM}\`\nDURUMU: \`${veri.DURUMU}\`\nPROGRAM TÜRÜ: \`${veri.PROGRAMTURU}\`\nÖĞRENİM SÜRESİ: \`${veri.OGRENIMSURESI}\``)
        await int.followUp({ embeds: [embed], components: [row] }).then(async (msg) => {

            const collector = await msg.createMessageComponentCollector({ componentType: ComponentType.Button });

            collector.on("collect", async(i) => {

            if(i.user.id === int.user.id) {

                if(i.customId === `sayfa-${int.user.id}`) {

                    let content = `Kullanıcı Adı: ${username}\nSorgulanan TCKN: ${TCKN} - Toplam Kayıt: 1\nTarih: ${moment(Date.now()).format("LLLL")}\n\nTC: ${veri.TC}\nADI & SOYADI: ${veri.ADI} - ${veri.SOYADI}\nDOĞUM TARİHİ: ${veri.DOGUMTARIHI}\nÜNİVERSİTE: ${veri.UNIVERSITE}\nPROGRAM: ${veri.PROGRAM}\nDURUMU: ${veri.DURUMU}\nPROGRAM TÜRÜ: ${veri.PROGRAMTURU}\nÖĞRENİM SÜRESİ: ${veri.OGRENIMSURESI}`
            
                    let atc = new AttachmentBuilder(Buffer.from(content, "utf-8"), { name: 'Atahan.txt'});
                    await i.deferReply({ ephemeral:true })
                    await i.followUp({ files: [atc], ephemeral:true });

                }

            }

            })

        })

    }
}