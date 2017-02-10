var directionsDisplay;
var displayPath;

import loadGoogleMapsAPI from 'load-google-maps-api';

let opt = {
    key: "AIzaSyALJXJGHtsniEtVTbzDj3H6j6hQUKV2cvA",
    language: "en",
    libraries: ["places"]
};

var orginBefore = false;
var destBefore = false;

function initMap() {
    loadGoogleMapsAPI(opt).then((googleMaps) => {
        var origin_place_id = null;
        var destination_place_id = null;
        var travel_mode = 'WALKING';
        var map = new google.maps.Map(document.getElementById('map'), {
            mapTypeControl: false,
            center: {
                lat: 42.331447,
                lng: -83.047632
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom: 13,
            styles : [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#596a80"},{"visibility":"on"}]}]
        });

        var originInput = document.getElementById('#origin-input');
        var destInput = document.getElementById('#destination-input');

        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(originInput);
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(destInput);

        var marker;
        var image = {
          url: require('./images/icon.png'),
          scaledSize: new google.maps.Size(24, 24),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 0)
        }

        $.get('/crime', function(data) {
          for(var i=0; i<data.length; i++) {
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(data[i].lat, data[i].lng),
              map: map,
              icon: image
            });
          }
        }) 
        displayPath = [];

        var directionsService = new google.maps.DirectionsService;
        directionsDisplay = new google.maps.DirectionsRenderer;
        directionsDisplay.setMap(map);
        var origin_input = document.getElementById('origin-input');
        var destination_input = document.getElementById('destination-input');

        var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
        var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);

        origin_autocomplete.bindTo('bounds', map);
        destination_autocomplete.bindTo('bounds', map);



        origin_autocomplete.addListener('place_changed', function() {
          var place = getPlaceAndCheck(origin_autocomplete);
          origin_place_id = place.place_id;

              expandViewportToFitPlace(map, place);
              displayPath = [];

              if (!orginBefore) {orginBefore = true;}
              else {
                appendDirections([origin_place_id, destination_place_id]);
                route(origin_place_id, destination_place_id, travel_mode,
                  directionsService, directionsDisplay, displayPath);
                }
            }
        );

        destination_autocomplete.addListener('place_changed', function() {
          var place = getPlaceAndCheck(destination_autocomplete);
          destination_place_id = place.place_id;

          if(!destBefore) {
            destBefore = true;
          }

            expandViewportToFitPlace(map, place);
            appendPanel();
            appendDirections([origin_place_id, destination_place_id]);

            displayPath = [];
            route(origin_place_id, destination_place_id, travel_mode,
                directionsService, directionsDisplay, displayPath);
              }
        )
    })
}

function route(origin_place_id, destination_place_id, travel_mode,
    directionsService, directionsDisplay, displayPath) {
    if (isPlaceValid) console.log("I got that valid places ~!");

    var request = {
        origin: {'placeId': origin_place_id},
        destination: {'placeId': destination_place_id},
        travelMode: travel_mode,
        provideRouteAlternatives: true
    };

    directionsService.route(request, function(response, status) {
        if (status == "OK") {
            console.log("success to load route!", response.routes);

            var len = response.routes.length;
            for (var i = 0; i < len; i++) {
                var changedResponse = jQuery.extend(true, {}, response);
                changedResponse.routes[0] = response.routes[i];
                displayPath.push(changedResponse);
            }
            directionsDisplay.setDirections(displayPath[0]);
        } else {
            console.log(('Directions request failed due to ' + status));
        }
    });
}



function getPlaceAndCheck(autocomplete) {
  if(isGeometryValid) console.log("Geometry is valid.");
  else console.log("Geometry is not valid for this place.")
  return autocomplete.getPlace();
}

function isGeometryValid(place) {
  return place.geometry ? true : false ;
}

function appendPanel() {
    if (!$('#panel').length) {
        $('header').after($("<div id='panel'></div>"));
//        $('#panel').animateCss('fadeIn');
        $('#wrapper').css('height', '100%').css('height', '-=165px');
      }
}

function appendDirections(placeId) {
  console.log(placeId);
  if($('#panel').length > 1) {
    $('.way-wrapper').remove();
  }
  $('.way-wrapper').remove();
    $.post('/danger', {
            data: placeId
        })
        .done(function(data) {
            var total = 0;
            var danger = data.data[0];
            var routeInfo = data.data[1];

            var via = [];
            var dur = [];
            
            //Should append element using pure.js
            for (var i = 0; i < routeInfo.routes.length; i++) {
                via.push(routeInfo.routes[i].summary);
                dur.push(routeInfo.routes[i].legs[0].duration.text);
                $('#panel').append($('<div class="way-wrapper"><div class="way_info"><h1 class="way_via">via ' + via[i] + '</h1>' + '<h1 class="way_min">' + dur[i] + '</h1></div></div>'));
            }
            $('.way-wrapper').click(function(e) {
                e.preventDefault();
                switchDirection($(this).index());
            });

            for (var i = 0; i < danger.length; i++) {
                total += danger[i];
            }

            $('.way-wrapper').each(function(i) {
                $(this).append($('<div class="danger"><img src="'+ require('./images/alarm.png') + '"class="icon" title="danger"/><span class="dangerRate" title="This shows how dangerous the route is">' + danger[i] + '%</span></div>'));
                var num = $('.dangerRate').text().replace("%", "");
                if (parseInt(num) >= 70) {
                    if (i == 0) $('.dangerRate').first().addClass('red');
                    else if (i == 1) $('.dangerRate').last().addClass('red');
                }
            })
            $('.icon').tipsy({gravity: 's'});
            $('.dangerRate').addClass('red');
        })
        .fail(function(xhr, status, err) {
            console.log(err);
        })
}

function isPlaceValid(origin, dest) {
    return origin || dest ? true : false;
}

function expandViewportToFitPlace(map, place) {
    if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
    } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
    }
}

function switchDirection(n) {
    console.log(displayPath, displayPath[n]);
    directionsDisplay.setDirections(displayPath[n]);
}

initMap();
console.log("finish initMap")
window.switchDirection = switchDirection;
window.initMap = initMap;
