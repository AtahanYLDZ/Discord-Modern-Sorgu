const config = require("../Settings/config");
const { emojis } = config;
const sorgucuSchema = require("../Database/Schemas/sorgucuSchema");
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { executeButton } = require("../Settings/Functions/executor");

module.exports = {
    name: "interactionCreate",
    async execute(int) {

        if(!int.isButton()) return;

        let embed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setFooter({ text: `Perla Geliştirici Ekibi © 2023 API Services` })
        .setThumbnail(int.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setTitle("Perla Sorgu Botu")

        if(int.customId == `login`) {

            const usernameInput = new TextInputBuilder()
            .setCustomId("username")
            .setLabel("Kullanıcı Adı")
            .setPlaceholder("Kullanıcı adınızı giriniz.")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)

            const passwordInput = new TextInputBuilder()
            .setCustomId("password")
            .setLabel("Şifre")
            .setPlaceholder("Şifre'nizi giriniz.")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)

            const codeInput = new TextInputBuilder()
            .setCustomId("2fa")
            .setLabel("2FA Kodu")
            .setPlaceholder("2FA Kodunuzu giriniz. (Eğer 2FA'nız yoksa boş bırakınız.)")
            .setRequired(false)
            .setStyle(TextInputStyle.Short)
            .setMaxLength(6)
            .setMinLength(6)

            const usernameRow = new ActionRowBuilder().addComponents(usernameInput);
            const passwordRow = new ActionRowBuilder().addComponents(passwordInput);
            const codeRow = new ActionRowBuilder().addComponents(codeInput);

            const modal = new ModalBuilder()
            .setCustomId(`loginModal-${int.user.id}`)
            .setTitle("Perla Sorgu Botu - Giriş Yap")
            .setComponents([usernameRow, passwordRow, codeRow]);

            await int.showModal(modal).catch(() => {});

        } else if(int.customId == "register") {

            const usernameInput = new TextInputBuilder()
            .setCustomId("username")
            .setLabel("Kullanıcı Adı")
            .setPlaceholder("Kullanıcı adınızı giriniz.")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            .setMinLength(3)
            .setMaxLength(24)

            const passwordInput = new TextInputBuilder()
            .setCustomId("password")
            .setLabel("Şifre")
            .setPlaceholder("Şifre'nizi giriniz.")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            .setMinLength(8)
            .setMaxLength(24)

            const rePasswordInput = new TextInputBuilder()
            .setCustomId("rePassword")
            .setLabel("Şifre Tekrar")
            .setPlaceholder("Şifre'nizi tekrar giriniz.")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            .setMinLength(8)
            .setMaxLength(24)

            const usernameRow = new ActionRowBuilder().addComponents(usernameInput);
            const passwordRow = new ActionRowBuilder().addComponents(passwordInput);
            const rePasswordRow = new ActionRowBuilder().addComponents(rePasswordInput);

            const modal = new ModalBuilder()
            .setCustomId(`registerModal-${int.user.id}`)
            .setTitle("Perla Sorgu Botu - Kayıt Ol")
            .setComponents([usernameRow, passwordRow, rePasswordRow]);

            await int.showModal(modal).catch(() => {});

        } else {
            await executeButton(int, embed);
        }

    }
}