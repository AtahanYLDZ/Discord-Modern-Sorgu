const config = require("../../Settings/config");
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({

    Username: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    OwnerID: { type: String, required: true },
    UserIDs: { type: Array, default: [] },
    RegisterDate: { type: Number, default: Date.now() },
    LastLogin: { type: Number, default: null },
    TwoFactor: { 
        active: { type: Boolean, default: false },
        secret: { type: String, default: null },
    },
    Premium: {
        type: { type: String, default: "FREE" },
        startTimestamp: { type: Number, default: null },
        endTimestamp: { type: Number, default: null },
        price: { type: Number, default: 0 },
        history: { type: Array, default: [] },
    },
    Ban: {
        banned: { type: Boolean, default: false },
        reason: { type: String, default: null },
        timestamp: { type: Number, default: null },
    },
    Limit: {
        total: { type: Number, default: config.sorguhak },
        used: { type: Number, default: 0 },
    },
    PromoCodes: { type: Array, default: [] },

});

module.exports = mongoose.model("user", customerSchema);