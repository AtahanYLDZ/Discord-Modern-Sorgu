const config = require("../../../Settings/config");
const { emojis } = config;
const sorgucuSchema = require('../../../Database/Schemas/sorgucuSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { verify2FA, multiCheck } = require("../../../Settings/Functions/functions");
const sorguList = require("../../../Settings/sorguList.json");

module.exports = {
    customId: "registerModal",
    deferReply: true,
    async execute(client, int, embed, values) {

        let username = int.fields.getTextInputValue("username").trim();
        let password = int.fields.getTextInputValue("password").trim();
        let rePassword = int.fields.getTextInputValue("rePassword").trim();

        if(password !== rePassword) return await int.followUp({ embeds: [embed.setDescription(`Girilen şifreler birbiriyle uyuşmuyor.`)] })

        let checkData = await sorgucuSchema.findOne({ Username: username });
        let checkData2 = await sorgucuSchema.findOne({ OwnerID: int.user.id });
        if(checkData || checkData2) return await int.followUp({ embeds: [embed.setDescription(`${checkData2 ? `\`${checkData2.Username}\` Adlı hesabınız bulunmaktadır yeni kayıt yapamazsınız.` : `**${username}** Adlı bir hesap zaten bulunuyor.`}`)] })

        let userData = await sorgucuSchema.create({ Username: username, Password: password, OwnerID: int.user.id });

        return await int.followUp({ embeds: [embed.setDescription(`\`${userData.Username}\` olarak kayıtınız tamamlandı!`)] })

    }
}