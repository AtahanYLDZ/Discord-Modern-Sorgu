const config = require("../Settings/config");
const { emojis } = config;
const { ActivityType } = require("discord.js");

module.exports = {
    name: "guildCreate",
    async execute(guild) {

        let client = guild.client;
        if(guild.memberCount < config.sunucuLimit && !config.guildWhitelist.includes(guild.id)) {

            let guildOwner = await client.users.fetch(guild.ownerId);

            await guildOwner.send({ content: `Sunucunuz **${config.sunucuLimit}** sayisindan az üyeye sahip oldugu için sunucuda çiktim.` }).catch(() => { return; })
            return await guild.leave();

        }

        client.user?.setPresence({ activities: [{ name: `${client.guilds.cache.size} Sunucuda Aktif!`, type: ActivityType.Playing }], status: "dnd" });

    }
}