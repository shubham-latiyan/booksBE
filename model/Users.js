"use strict";
const mongoose = require('mongoose');
const Promise = require('bluebird');
var bcrypt = require('bcryptjs');
Promise.promisifyAll(mongoose);

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true
    },
    password: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    created_on: {
        type: Date,
        default: new Date()
    },

}, { versionKey: false });


UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (pw, cb) {
    bcrypt.compare(pw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

const Users = mongoose.model('Users', UserSchema);
module.exports = Users;
