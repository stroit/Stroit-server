const mongoose = require('mongoose');
const express = require('express');
var router = express.Router();

mongoose.connect('mongodb://yeom.me/stroit');

var Schema = mongoose.Schema;
var mapInfo = new Schema({
  LAT: Number,
  LON: Number,
  address: String,
  offensedescription: String,
  published_date: { type: Date, default: Date.now }
});

var Map = mongoose.model('map', mapInfo);

router.get('/crime', function (req, res) {
    Map.find({}, function(err, data) {
      res.json(data);
    });
});

module.exports = router;