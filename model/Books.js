"use strict";
const mongoose = require('mongoose');
const Promise = require('bluebird');
Promise.promisifyAll(mongoose);

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: String,
    },
    units: {
        type: Number,
    },
    created_at: {
        type: Date,
        default: new Date()
    },

}, { versionKey: false });


const Books = mongoose.model('Books', BookSchema);
module.exports = Books;
