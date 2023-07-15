const config = require("../Settings/config");
const mongoose = require("mongoose");

mongoose.set('strictQuery', true);
mongoose.connect(config.database.mongoURI, config.database.options);

mongoose.connection.on('connected', async () => {
    console.log(`(*) MongoDB bağlantısı başarılı.`);
});