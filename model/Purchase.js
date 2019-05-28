"use strict";
const mongoose = require('mongoose');
const Promise = require('bluebird');
Promise.promisifyAll(mongoose);

const PurchaseSchema = new mongoose.Schema({
    user_email: {
        type: String,
        trim: true,
    },
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Books"
    },
    created_at: {
        type: Date,
        default: new Date()
    },

}, { versionKey: false });


const Purchase = mongoose.model('Purchase', PurchaseSchema);
module.exports = Purchase;
