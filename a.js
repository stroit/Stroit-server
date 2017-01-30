const rq = require('request-promise');

let option = {
    method: 'GET',
    uri: "https://maps.googleapis.com/maps/api/directions/json?origin=place_id:ChIJ-2NA5mDFJIgRHb4natoQAv4&destination=place_id:ChIJdR3LEAHKJIgR0sS5NU6Gdlc&language=en&mode=walking&alternatives=true&key=AIzaSyAE6o3bNueg57_Ij5oK3oTqd40R0nac5No",
    json: true
  };

  rq(option)
    .then(function(parsedJson){
      console.log(parsedJson)
    })
    .catch(function(err) {
        console.log(err);
    })
