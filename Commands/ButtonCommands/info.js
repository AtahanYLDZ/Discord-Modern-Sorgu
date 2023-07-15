const config = require('../../Settings/config');
const { emojis } = config;
const sorgucuSchema = require('../../Database/Schemas/sorgucuSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");

module.exports = {
    customId: "info",
    deferReply: false,
    async execute(client, int, embed, values) {

        await int.update({ embeds: [embed.setDescription(`
        Merhaba ${int.user} ${emojis.HELLO}!

        \`Hakkımızda:\`
        Merhaba dostlar zamanında bir çoğunuzun bildiği üzere bu tarz sorgu işleriyle baya bi uğraştık örnek vermek gerekirse "Hoster Oyun Alanı, Perla Checker" vb bu tarz isimlerde bulunarak sorgu işlerinde uğraştık ve fark ettik ki discord üzerinde sorgu piyasası bitmiş durumda bunu kim eski haline getirebilir diye düşünürsek akla biz geliriz bu yüzden sizlere en kaliteli hizmeti sunmak için tekrardan karşınızdayız.

        \`Toplam Kayıtlı Kullanıcı:\` **${await sorgucuSchema.countDocuments()}**

        \`Nasıl kullanılır?\`
        Öncelikle [Main Sunucumuza](https://discord.gg/perla) gelmeniz gerekmektedir. Daha sonra \`/mesaj\` komutunu kullanarak giriş yapabilirsiniz.

        \`Ekibimiz:\`
        Geliştirici & Kurucu: [Atahan#8888](https://discord.com/users/783759784306147340) ([Github](https://github.com/AtahanYLDZ))
        Kurucu: [Hoster#1000](https://discord.com/users/854747242200170548)

        \`Sunucularımız:\`
        [Main Sunucu](https://discord.gg/perla)
        [API Servis](https://discord.gg/perlaservis)
        `).setImage(config.listeGif)] }).catch(() => {})

    }
}