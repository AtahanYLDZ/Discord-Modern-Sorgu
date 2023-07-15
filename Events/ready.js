const config = require("../Settings/config");
const { ActivityType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: "ready",
    async execute(client) {

        client.user?.setPresence({ activities: [{ name: `${client.guilds.cache.size} Sunucuda Aktif!`, type: ActivityType.Playing }], status: "dnd" });
        console.log(`${client.user.tag} ismi ile giriş yapıldı!`);

        client.application?.commands.set(client.globalCommands).then(() => console.log("Slash komutları başarıyla yüklendi!")).catch(() => {});

        await Promise.all(client.guilds.cache.map(async (guild) => {

            if(!config.guildWhitelist.includes(guild.id) && guild.memberCount < config.sunucuLimit) return await guild.leave();

        }));

    }
}