const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const dangerTest = require('../lib/dangerTest');
const populateRisk = require('../lib/riskGrid');
const riskGrid = populateRisk('./result.txt');

let APIKey = 'AIzaSyAE6o3bNueg57_Ij5oK3oTqd40R0nac5No';


router.post('/danger', function(req, res) {
    let placeId = req.body.data;
    console.log("THis is what I got", placeId);
    let option = {
      uri: 'https://maps.googleapis.com/maps/api/directions/json?',
      qs: {
        origin:`place_id:${placeId[0]}`, destination: `place_id:${placeId[1]}`,
        language: 'en', mode: 'walking', alternatives: true, key: APIKey
      }
    };
    
    rp(option)
      .then(function(json) {
	      console.log("YO!", json.length);
        let dangerRate = dangerTest(JSON.parse(json), riskGrid)
        res.json({ data: [dangerRate, JSON.parse(json)]});
      })
      .catch(function(err) {
	      console.log(err);
        console.error("Failed to get JSON from Google API", err);
      })
});

module.exports = router;