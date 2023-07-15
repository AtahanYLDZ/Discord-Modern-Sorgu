const config = require("../Settings/config");
const { emojis } = config;
const sorgucuSchema = require("../Database/Schemas/sorgucuSchema");
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    async execute(int) {

        if(!int.isChatInputCommand()) return;

        let client = int.client;
        let embed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setFooter({ text: `Perla Geliştirici Ekibi © 2023 API Services` })
        .setThumbnail(int.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setTitle("Perla Sorgu Botu")

        let command = client.slashCommands.get(int.commandName);
        if(!command) return;

        await command.execute(client, int, embed)

    }
}