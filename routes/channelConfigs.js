/**
 * Created by rabbiddog on 6/1/16.
 */
var express = require('express');
var router = express.Router();
var ChannelConfig = require('../model/ChannelConfig.model');
var randomString = require('randomstring');

var createEmptyResponse = function(req, res, next)
{
    req.config = [];
    return next();
};
/*GET channel congifuration listings*/

var sendAll = function(req, res, next){
    var title = req.query.title;
    var uniqueId = req.query.id;
    if(!title && !uniqueId)
    {
        ChannelConfig.find({})
            .exec(function (err, dayCycle) {
                if(err){
                    console.log('Error occured while serving all day-cycles');
                    console.error(err.stack);
                    var error= new Error("An error occured while processing this request."); //don't expose actual error
                    return next(error);

                }else{
                    console.log('Serving all day cycles');
                    dayCycle.forEach(function (item) {
                        req.config.push(item);
                    })

                    return next();
                }
            });
    }
    else if(title && uniqueId){
        ChannelConfig.findOne({
            "uniqueID":uniqueId
        }, function(err, dayCycle){
            if(err){
                console.log("Error occured while searching for day-cycles with uniqueID "+uniqueId);
                console.error(err.stack);
                var error= new Error("An error occured while processing this request."); //don't expose actual error
                return next(error);
            }else{
                console.log("Serving day-cycles with uniqueID "+uniqueId+ " and title"+title);
                if(dayCycle && dayCycle.title === title)
                    req.config.push(dayCycle);
                return next();
            }
        });
    }
    else if(uniqueId){
        ChannelConfig.findOne({
            "uniqueID":uniqueId
        }, function(err, dayCycle){
            if(err){
                console.log("Error occured while searching for day-cycles with uniqueID "+uniqueId);
                console.error(err.stack);
                var error= new Error("An error occured while processing this request."); //don't expose actual error
                return next(error);
            }else{
                console.log("Serving day-cycles with uniqueID "+uniqueId);
                if(dayCycle)
                    req.config.push(dayCycle);
                return next();
            }
        });
    }
    else if(title){
        ChannelConfig.find({
            "title": {"$regex": title, "$options": "i"}
        }, function (err, dayCycle) {
            if(err){
                console.log("Error occured while searching for day-cycles with "+title +" in their title");
                console.error(err.stack);
                var error= new Error("An error occured while processing this request."); //don't expose actual error
                next(error);
            }else{
                console.log("Serving day-cycles with "+title +" in their title");
                dayCycle.forEach(function (item) {
                    console.log(item);
                    req.config.push(item);
                })
                return next();
            }
        });
    }
};

var returnCollectedConfig = function(req, res){
    res.json(req.config);
};

router.get('/', createEmptyResponse, sendAll, returnCollectedConfig);

router.post('/', function (req, res) {

    var newDayCycle = new ChannelConfig();
    
    if(req.body.title)
        newDayCycle.title = req.body.title;
    else{
        console.log("missing title");
        var error = new Error("title was not provided");
        res.json(error);
    }

    if(req.body.configuration)
        newDayCycle.configuration = req.body.configuration;
    else{
        console.log("missing configuration");
        var error = new Error("configuration was not provided");
        res.json(error);
    }

    if(req.body.description)
        newDayCycle.description = req.body.description;
    else{
        console.log("missing description");
        var error = new Error("description was not provided");
        res.json(error);
    }

    if(req.body.maxmoonlight)
        newDayCycle.maxmoonlight = req.body.maxmoonlight;

    newDayCycle.uniqueID = randomString.generate(6);

    newDayCycle.save(function (err, dayCycle) {
        if(err)
        {
            res.send(null);
        }else {
            res.json(dayCycle);
        }
    })

});

module.exports = router;
