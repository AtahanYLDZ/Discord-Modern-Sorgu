const config = require('../../Settings/config');
const { emojis } = config;
const sorgucuSchema = require('../../Database/Schemas/sorgucuSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");

module.exports = {
    customId: "2FAConfirm",
    deferReply: false,
    async execute(client, int, embed, values) {

        const username = values[1];
        const secret = values[2];

        const codeInput = new TextInputBuilder()
        .setPlaceholder("2FA Kodunuzu girin. (Eğer 2FA'nız yoksa boş bırakınız.)")
        .setRequired(true)
        .setLabel("2FA Kodu")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(6)
        .setMinLength(6)
        .setCustomId("2fa")

        const codeRow = new ActionRowBuilder().addComponents(codeInput)

        const modal = new ModalBuilder()
        .setTitle("Perla Sorgu Botu - Ayarlar")
        .setCustomId(`2FAConfirmModal-${username}-${secret}-${int.user.id}`)
        .setComponents([codeRow])

        await int.showModal(modal)

    }
}