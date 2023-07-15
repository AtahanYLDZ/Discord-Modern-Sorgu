const config = require("../../../Settings/config");
const { emojis } = config;
const sorgucuSchema = require('../../../Database/Schemas/sorgucuSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { verify2FA, multiCheck, checkPerms } = require("../../../Settings/Functions/functions");
const premiumList = require("../../../Settings/premiumList.json");

module.exports = {
    customId: "userExtendModal",
    deferReply: true,
    async execute(client, int, embed, values) {

        const ausername = values[1];
        const username = int.fields.getTextInputValue("username").trim();
        const gun = int.fields.getTextInputValue("gun");

        if(!Number(gun)) return await int.followUp({ embeds:[embed.setDescription(`Geçerli bir gün giriniz.`)], components: [], attachments: [] })

        let userData = await sorgucuSchema.findOne({ Username: username });
        if(!userData) return await int.followUp({ embeds:[embed.setDescription(`\`${username}\` Adlı bir hesap bulunamadı.`)], components: [], attachments: [] })
        if(!config.owners.includes(ausername) && config.admins.includes(username)) return await int.followUp({ embeds:[embed.setDescription(`\`${username}\` Adlı hesabı düzenleyemezsiniz.`)], components: [], attachments: [] })
        if(userData.Premium.type === "FREE") return await int.followUp({ embeds:[embed.setDescription(`\`${username}\` Adlı hesabın üyeliği zaten yok.`)], components: [], attachments: [] })

        let sure = Number(gun) * 24 * 60 * 60 * 1000;

        userData.Premium.endTimestamp = userData.Premium.endTimestamp + sure;
        userData.Premium.price = userData.Premium.price + (Number(gun) * premiumList.find(x => x.name === userData.Premium.type).dayPrice);

        await userData.save();

        let user = await client.users.fetch(userData.OwnerID);

        return await int.followUp({ embeds:[embed.setDescription(`
        Merhaba ${int.user} ${emojis.HELLO}!

        \`${username}\` Adlı hesabın üyeliği \`${gun}\` gün uzatıldı.
        Sahibi: **${user.tag}** (\`${user.id}\`)

        Yeni Bitiş Tarihi: <t:${Math.floor(userData.Premium.endTimestamp / 1000)}> (<t:${Math.floor(userData.Premium.endTimestamp / 1000)}:R>)
        `)], components: [], attachments: [] })

    }
}