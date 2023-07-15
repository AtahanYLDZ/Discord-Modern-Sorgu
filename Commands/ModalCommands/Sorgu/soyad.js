const config = require("../../../Settings/config");
const { emojis } = config;
const sorgucuSchema = require('../../../Database/Schemas/sorgucuSchema');
const { getData, sendWebhook } = require("../../../Settings/Functions/functions");
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, AttachmentBuilder } = require("discord.js");
const moment = require("moment");
moment.locale("tr");

module.exports = {
    customId: "soyadModal",
    deferReply: true,
    async execute(client, int, embed, values) {

        const username = values[1];
        const soyad = int.fields.getTextInputValue("soyad").toLocaleUpperCase("TR");
        const il = int.fields.getTextInputValue("il");
        const ilce = int.fields.getTextInputValue("ilce");
        const dt = int.fields.getTextInputValue("dt");
        const uyruk = int.fields.getTextInputValue("uyruk");

        const conditions = [
            dt && `dt=${dt}`,
            il && `il=${il}`,
            ilce && `ilce=${ilce}`,
            uyruk && `uyruk=${uyruk}`,
        ].filter(Boolean);

        let veri = await getData(`${config.api.SOYAD}${soyad}${conditions.length > 0 ? "&" + conditions.join("&") : ""}`);

        if (veri.success === false) return await int.followUp({ embeds: [embed.setDescription(`\`${soyad}\` Adında biri bulunamadı!`)], ephemeral: true });

        veri = veri.data;

        sendWebhook(username, "SOYAD", `${soyad} - ${il ?? ""}\nID: \`${int.user.id}\``)

        let page = 0;
        let index = 10
        let maxPage = Math.ceil(veri.length / index)

        let row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`previous-${int.user.id}`)
            .setEmoji(emojis.LEFT)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === 0),
            new ButtonBuilder()
            .setCustomId(`next-${int.user.id}`)
            .setEmoji(emojis.RIGHT)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(veri.length > index ? page === maxPage - 1 : true),
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
            .setDisabled(veri.length <= index)
        )

        let slicedVeri = veri.slice(page * index, (page + 1) * index)

        embed = embed
        .setTitle(`**${soyad}** Adlı kişinin **${veri.length}** sonuç bulundu.`)
        .setDescription(`${slicedVeri.map((x, i) => `\`${i+1}.\` TC: \`${x.TC}\` - \`${x.ADI} ${x.SOYADI}\` - DOĞUM TARİHİ: \`${x.DOGUMTARIHI}\` - ANA ADI: \`${x.ANNEADI}\` - BABA ADI: \`${x.BABAADI}\` - NÜFUS İL: \`${x.NUFUSIL}\` - NÜFUS İLÇE: \`${x.NUFUSILCE}\` - UYRUK: :flag_${x.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`)
        await int.followUp({ embeds: [embed], components: [row] }).then(async msg => {

            const collector = await msg.createMessageComponentCollector({ componentType: ComponentType.Button });

            collector.on("collect", async(i) => {

            if(i.user.id === int.user.id) {

                if(i.customId === `previous-${int.user.id}`) {

                    page--;

                    slicedVeri = veri.slice(page * index, (page + 1) * index)
                    let embeds = msg.embeds[0];
                    embeds.data.description = `${slicedVeri.map((x, i) => `\`${(i+1) + (page * index)}.\` TC: \`${x.TC}\` - \`${x.ADI} ${x.SOYADI}\` - DOĞUM TARİHİ: \`${x.DOGUMTARIHI}\` - ANA ADI: \`${x.ANNEADI}\` - BABA ADI: \`${x.BABAADI}\` - NÜFUS İL: \`${x.NUFUSIL}\` - NÜFUS İLÇE: \`${x.NUFUSILCE}\` - UYRUK: :flag_${x.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`
                
                    row.components[0].setDisabled(page === 0);
                    row.components[1].setDisabled(page === maxPage - 1);
                    await i.update({ embeds: [embeds], components: [row]}).catch(() => {});

                }

                if(i.customId === `next-${int.user.id}`) {

                    page++;

                    slicedVeri = veri.slice(page * index, (page + 1) * index)
                    let embeds = msg.embeds[0];
                    embeds.data.description = `${slicedVeri.map((x, i) => `\`${(i+1) + (page * index)}.\` TC: \`${x.TC}\` - \`${x.ADI} ${x.SOYADI}\` - DOĞUM TARİHİ: \`${x.DOGUMTARIHI}\` - ANA ADI: \`${x.ANNEADI}\` - BABA ADI: \`${x.BABAADI}\` - NÜFUS İL: \`${x.NUFUSIL}\` - NÜFUS İLÇE: \`${x.NUFUSILCE}\` - UYRUK: :flag_${x.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`
                
                    row.components[0].setDisabled(page === 0);
                    row.components[1].setDisabled(page === maxPage - 1);
                    await i.update({ embeds: [embeds], components: [row]}).catch(() => {});

                }

                if(i.customId === `sayfa-${int.user.id}`) {

                    let content = `Kullanıcı Adı: ${username}\nSorgulanan Kişi: ${soyad} - Toplam Kayıt: ${slicedVeri.length}\nTarih: ${moment(Date.now()).format("LLLL")}\n\n${slicedVeri.map((x, i) => `TC: ${x.TC}\nADI & SOYADI: ${x.ADI} ${x.SOYADI}\nDOĞUM TARİHİ: ${x.DOGUMTARIHI}\nANA ADI: ${x.ANNEADI}\nBABA ADI: ${x.BABAADI}\nNÜFUS İL: ${x.NUFUSIL}\nNÜFUS İLÇE: ${x.NUFUSILCE}\nUYRUK: ${x.UYRUK ? x.UYRUK : "TR"}`).join("\n\n")}`
            
                    let atc = new AttachmentBuilder(Buffer.from(content, "utf-8"), { name: 'Atahan.txt'});
                    await i.deferReply({ ephemeral:true })
                    await i.followUp({ files: [atc], ephemeral:true });

                }

                if(i.customId === `hepsi-${int.user.id}`) {

                    let content = `Kullanıcı Adı: ${username}\nSorgulanan Kişi: ${soyad} - Toplam Kayıt: ${veri.length}\nTarih: ${moment(Date.now()).format("LLLL")}\n\n${veri.map((x, i) => `TC: ${x.TC}\nADI & SOYADI: ${x.ADI} ${x.SOYADI}\nDOĞUM TARİHİ: ${x.DOGUMTARIHI}\nANA ADI: ${x.ANNEADI}\nBABA ADI: ${x.BABAADI}\nNÜFUS İL: ${x.NUFUSIL}\nNÜFUS İLÇE: ${x.NUFUSILCE}\nUYRUK: ${x.UYRUK ? x.UYRUK : "TR"}`).join("\n\n")}`
            
                    let atc = new AttachmentBuilder(Buffer.from(content, "utf-8"), { name: 'Atahan.txt'});
                    await i.deferReply({ ephemeral:true })
                    await i.followUp({ files: [atc], ephemeral:true });

                }

            }

            })

        })

    }
}