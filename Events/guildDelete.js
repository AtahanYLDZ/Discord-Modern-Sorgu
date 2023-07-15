const config = require("../Settings/config");
const { emojis } = config;
const { ActivityType } = require("discord.js");

module.exports = {
    name: "guildDelete",
    async execute(guild) {

        let client = guild.client;

        client.user?.setPresence({ activities: [{ name: `${client.guilds.cache.size} Sunucuda Aktif!`, type: ActivityType.Playing }], status: "dnd" });

    }
}