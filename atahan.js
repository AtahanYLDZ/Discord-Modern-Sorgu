const config = require("./Settings/config");
const fs = require("node:fs");
const glob = require("glob");
const { Client, Collection, Partials, ActivityType } = require("discord.js");
const sorgucuSchema = require("./Database/Schemas/sorgucuSchema");
const CronJob = require('cron').CronJob;
const client = global.client = new Client({
    intents: [3276799],
    partials: [Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message]
});
client.login(config.token);

const subClient = global.subclient = new Client({
    intents: [3276799],
    partials: [Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message],
    presence: { activities: [{ name: "Made By Atahan#8888", type: ActivityType.Playing }], status: "dnd" }
});
subClient.login(config.token2)
require("./Database/connect");

const dailyCheck = new CronJob("0 0 * * *", async() => {

  console.log("Günlük sorgu kontrolü başladı.")

  let data = await sorgucuSchema.find().lean() || null;
  if(!data || !data.length > 0) return;

  await Promise.all(data.map(async (db) => {

    if(db.Premium.type === "FREE") {

        db.Limit.used = 0;

    } else if(db.Premium.endTimestamp - Date.now() <= 0) {

        db.Premium.history.push({ name: db.Premium.type, startTimestamp: db.Premium.startTimestamp, endTimestamp: db.Premium.endTimestamp, price: db.Premium.price, active: false });

        db.Premium.type = "FREE";
        db.Premium.startTimestamp = null;
        db.Premium.endTimestamp = null;
        db.Premium.price = 0;

    }

    await sorgucuSchema.findOneAndUpdate({ Username: db.Username }, { Premium: db.Premium, Limit: db.Limit })

  }));

  console.log("Günlük sorgu kontrolü tamamlandı.")

}, null, true, "Europe/Istanbul")
dailyCheck.start()


client.modalCommands = new Collection();
client.selectCommands = new Collection();
client.buttonCommands = new Collection();
client.slashCommands = new Collection();
client.globalCommands = [];

const modalFiles = glob.sync(__dirname + "/Commands/ModalCommands/**/*.js");
for (const file of modalFiles) {
    const command = require(`./${file}`);
    client.modalCommands.set(command.customId, command);
}

const selectFiles = glob.sync(__dirname + "/Commands/SelectCommands/*.js");
for (const file of selectFiles) {
    const command = require(`./${file}`);
    client.selectCommands.set(command.customId, command);
}

const buttonFiles = glob.sync(__dirname + "/Commands/ButtonCommands/*.js");
for (const file of buttonFiles) {
    const command = require(`./${file}`);
    client.buttonCommands.set(command.customId, command);
}

const slashFiles = glob.sync(__dirname + "/Commands/SlashCommands/*.js");
for (const file of slashFiles) {
    const command = require(`./${file}`);
    client.slashCommands.set(command.name, command);
    client.globalCommands.push(command.commandData);

}

const eventFiles = glob.sync(__dirname + "/Events/*.js");
for (const file of eventFiles) {
    const event = require(`./${file}`);
    client.on(event.name, event.execute);
}