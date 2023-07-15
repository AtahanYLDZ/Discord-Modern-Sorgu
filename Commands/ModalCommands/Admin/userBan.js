const config = require("../../../Settings/config");
const { emojis } = config;
const sorgucuSchema = require('../../../Database/Schemas/sorgucuSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { verify2FA, multiCheck, checkPerms } = require("../../../Settings/Functions/functions");

module.exports = {
    customId: "userBanModal",
    deferReply: true,
    async execute(client, int, embed, values) {

        const ausername = values[1]
        const username = int.fields.getTextInputValue("username").trim();
        const sebep = int.fields.getTextInputValue("sebep").trim();

        let userData = await sorgucuSchema.findOne({ Username: username });
        if(!userData) return await int.followUp({ embeds:[embed.setDescription(`\`${username}\` Adlı bir hesap bulunamadı.`)], components: [], attachments: [] })
        if(!config.owners.includes(ausername) && config.admins.includes(username)) return await int.followUp({ embeds:[embed.setDescription(`\`${username}\` Adlı hesap bir "ADMIN" hesabı olduğu için banlanamaz.`)], components: [], attachments: [] })
        if(userData.Ban.banned === true) return await int.followUp({ embeds:[embed.setDescription(`\`${username}\` Adlı hesap zaten banlı.`)], components: [], attachments: [] })

        let user = await client.users.fetch(userData.OwnerID);

        userData.Ban.banned = true;
        userData.Ban.reason = sebep;
        userData.Ban.timestamp = Date.now();
        await userData.save();

        return await int.followUp({ embeds:[embed.setDescription(`
        Merhaba ${int.user} ${emojis.HELLO}!

        \`${username}\` Adlı hesap banlandı;
        Sahibi: **${user.tag}** (\`${user.id}\`)

        Sebep: \`${sebep}\`
        `)], components: [], attachments: [] })

    }
}