/**
 * Created by rabbiddog on 6/1/16.
 */
'use.strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChannelConfigSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    configuration:{
        type: String,
        required: true,
        unique: false
    },
    description: {
        type: String,
        required: false,
        unique: false,
        default: "Day-Cycle Configuration"
    },
    maxmoonlight: {
        type: Number,
        required: false,
        unique: false,
        default: 50
    },
    uniqueID:{
        type: String,
        required: true,
        unique: true
    }
});
module.exports = mongoose.model('ChannelConfig', ChannelConfigSchema);
