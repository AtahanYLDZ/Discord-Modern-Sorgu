const config = require("../../Settings/config");
const { emojis } = config;
const sorgucuSchema = require("../../Database/Schemas/sorgucuSchema");
const { codeBlock, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");

module.exports = {
    name: "mesaj",
    commandData: new SlashCommandBuilder().setName("mesaj").setDescription("Mesaj gönderir."),
    async execute(client, int, embed) {

        let row = new ActionRowBuilder().addComponents([
            new ButtonBuilder()
            .setCustomId("login")
            .setLabel("Giriş")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId("register")
            .setLabel("Kayıt Ol")
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setCustomId(`quickLogin-${int.user.id}`)
            .setLabel("Hızlı Giriş")
            .setStyle(ButtonStyle.Success),
        ])

        await int.reply({ embeds: [embed.setTitle("Giriş Yap").setDescription(`
        Selam, ben Perla Sorgu Botu. Aşağıdaki butonlardan birine tıklayarak giriş yapabilir veya kayıt olabilirsiniz.

        Unutmaki, giriş yapmadan önce kayıt olmanız gerekmektedir.
        NOT: [Discord Sunucumuz](https://discord.gg/perla)'a gelmeden sorgu yapamazsınız.
        `).setImage(config.listeGif)], components: [row], ephemeral: true })

    }
}