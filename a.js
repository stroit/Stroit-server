const rp = require('request-promise');
const mongoose = require('mongoose');

mongoose.connect('mongodb://yeom.me/stroit');

var Schema = mongoose.Schema;
var mapInfo = new Schema({
  lat: Number,
  lng: Number,
  address: String,
  offensedescription: String,
  published_date: { type: Date, default: Date.now }
});

var Map = mongoose.model('map', mapInfo);


let option = {
  uri: 'https://data.detroitmi.gov/resource/i9ph-uyrp.json?',
  qs: {
    $select: "LON,LAT,offensedescription,address",
    incidentdate: "2016-01-01T00:00:00.000"
  },
  header: {
    "X-App-Token": "bjp8KrRvAPtuf809u1UXnI0Z8"
  }
};

rp(option)
  .then(function(json) {
    var jspnzz = JSON.parse(json);
    for(var i=0; i<jspnzz.length; i++){
      var map = new Map();
      map.lat = jspnzz[i].LAT;
      map.lng = jspnzz[i].LON;
      map.address = jspnzz[i].address;
      map.offensedescription = jspnzz[i].offensedescription;
      map.save(function(err) {console.log(i, jspnzz.length)});
    }
  })
  .catch(function(err) {
    console.error("띠용", err);
  })
