const config = require("../../../Settings/config");
const { emojis } = config;
const sorgucuSchema = require('../../../Database/Schemas/sorgucuSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { verify2FA, multiCheck, checkPerms } = require("../../../Settings/Functions/functions");

module.exports = {
    customId: "userInfoModal",
    deferReply: true,
    async execute(client, int, embed, values) {

        const ausername = values[1];
        const username = int.fields.getTextInputValue("username").trim();
        const id = int.fields.getTextInputValue("id").trim();

        if(!id && !username) return await int.followUp({ embeds:[embed.setDescription(`Lütfen bir \`id\` veya \`username\` belirtiniz.`)], components: [], attachments: [] })
        let userData = username ? await sorgucuSchema.findOne({ Username: username }) : await sorgucuSchema.findOne({ OwnerID: id });
        if(!userData) return await int.followUp({ embeds:[embed.setDescription(`\`${username ? username : id}\` Adlı bir hesap bulunamadı.`)], components: [], attachments: [] })

        let user = await client.users.fetch(userData.OwnerID);
        let users = [];
        await Promise.all(userData.UserIDs.map(async (id) => {

            let user = await client.users.fetch(id);

            users.push(user);

        }))

        return await int.followUp({ embeds:[embed.setDescription(`
        Merhaba ${int.user} ${emojis.HELLO}!

        \`${userData.Username}\` Adlı hesabın bilgileri;
        Sahibi: **${user.tag}** (\`${user.id}\`)
        Sifre: ${!config.owners.includes(ausername) && config.admins.includes(userData.Username) ? `\`********\`` : userData.Password}
        Kayıt Tarihi: <t:${Math.floor(userData.RegisterDate / 1000)}>
        Son Giriş Tarihi: <t:${Math.floor(userData.LastLogin / 1000)}:R>

        Ban Durumu: \`${userData.Ban.banned ? `Banlı` : `Banlı Değil`}\`
        ${userData.Ban.banned === false ? `Ban Açılma Sebebi: \`${userData.Ban.reason}\`` : `Ban Sebebi: \`${userData.Ban.reason}\``}

        2FA: \`${userData.TwoFactor.active ? `Aktif` : `Pasif`}\`
        Üyelik: \`${userData.Premium.type}\`
        Üyelik Bitiş Tarihi: ${userData.Premium.type === "FREE" ? `\`-\`` : `<t:${Math.floor(userData.Premium.endTimestamp / 1000)}>`}

        Hediye Ettiği Kişiler;
        ${userData.UserIDs.length > 0 ? users.map((user, i) => `\`${i + 1}.\` **${user.tag}** (\`${user.id}\`)`).join("\n") : `Hediye ettiği kişi bulunmuyor.`}
        `)], components: [], attachments: [] })
        

    }
}