LazyLoad.js(['https://dl.dropbox.com/s/vj6guwl2a8b0wze/notiflix-aio-1.9.1.min.js?',
             'https://dl.dropboxusercontent.com/s/d0bepdjq0bonnqj/notiflix-aio-1.9.1.js',
             'https://dl.dropboxusercontent.com/s/bwanjv361aifmls/papaparse.min.js',
             'https://dl.dropboxusercontent.com/s/2onm4emhos577sf/papaparse.js',
             'https://maps.googleapis.com/maps/api/js?key=AIzaSyBgREXIGcss-ug9KmqlJMuAQg9Ka016I8Y',
             'https://cdn.sobekrepository.org/includes/gmaps-markerwithlabel/1.9.1/gmaps-markerwithlabel-1.9.1.min.js'],function () {
});

function createMap() {  
    var mapClass = $('.my-google-map');
    for (var mi = 0; mi < mapClass.length; mi++) {
      var d_json = mapClass[mi].innerText;
      var markers = [];

      function initialize() {
              //var pinIcon = new google.maps.MarkerImage(
              //"https://dl.dropbox.com/s/b5abb3r39k62rh6/cargo_ship_icon.png?",
              //null, /* size is determined at runtime */
              //null, /* origin is 0,0 */
              //null, /* anchor is bottom center of the scaled image */
              //new google.maps.Size(40, 40)
          //); 
        var payload = JSON.parse(d_json);
        function loopreferences(container) {
          var c_list = '';
          for (var ki = 0; ki < container.length; ki++) {
            var containerdetails = container[ki].references;
            var f_eta = container[ki].eta;
            var f_dest = container[ki].dest;
            c_list = c_list + '</br><h4><div style="color:navy; font-weight:bold;"> Final Terminal: ' + f_dest +'</div>';
            c_list = c_list + '<div style="color:navy; font-weight:bold;"> ETA to Terminal: ' + f_eta +'</div></h4>';
            for (var kj = 0; kj < containerdetails.length; kj++) {
                c_list = c_list + '<div>Container #: '+ containerdetails[kj]+'</div>';
            }
          }
          return c_list;
        }

        function averageGeolocation(coords) {
          if (coords.length === 1) {
            return {
              latitude: coords[0].lat,
              longitude: coords[0].lon
            };
          }
          if (coords.length === 0) {
            return {
              latitude: 32,
              longitude: -79
            };
          }

          let x = 0.0;
          let y = 0.0;
          let z = 0.0;

          for (let coord of coords) {
            let latitude = coord.lat * Math.PI / 180;
            let longitude = coord.lon * Math.PI / 180;
            x += Math.cos(latitude) * Math.cos(longitude);
            y += Math.cos(latitude) * Math.sin(longitude);
            z += Math.sin(latitude);
          }

          let total = coords.length;

          x = x / total;
          y = y / total;
          z = z / total;

          let centralLongitude = Math.atan2(y, x);
          let centralSquareRoot = Math.sqrt(x * x + y * y);
          let centralLatitude = Math.atan2(z, centralSquareRoot);

          return {
            latitude: centralLatitude * 180 / Math.PI,
            longitude: centralLongitude * 180 / Math.PI
          };
        }
        var map = new google.maps.Map(mapClass[mi], {
          zoom: 3,
          center: new google.maps.LatLng(19.781357, -31.328932),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          streetViewControl: false
        });
        var infowindow = new google.maps.InfoWindow();

        for (var i = 0; i < payload.length; i++) {
          var newMarker = new MarkerWithLabel({
            map: map,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(payload[i].lat, payload[i].lon),
            icon: {
              url: "https://lh3.googleusercontent.com/3ODRoNTUYuAEjDUxtUvNLIaoLheX_5p8IOnky3q0JPUsoxuOSy4TG8bxxP2utCGXfZv4dzuZATjUxlCXJXfsYfoxL8nhF8z3bOFqmGr2eGmjrCQ05NM_lRztD7BYRyHV-7gRu6EcESElFSFdvMTUKCP4qwhXXpRG2QrSv58WvTxXoh-rQmNJnSKBG19uR7zjUKFtk5pt0zBqJP-AWHwekvOPuWgcMAIe9r4Qzun9yAt8_Nh2lJE77fIlNX2B1shTrr1UHB5vFr9ozl_1xcTC84QgPmzw5SJJ_wNR8jW2LvSD9A5ln3Tud1PFOQM28q-J-W9JZ63AC-eNMc41R_7F9ZIoVBpywyBambUClzyfRXsWcvnWpxcNzbmEmcVsOG34dS8ENgYccDExzBfoFiNc8LL7iaCK3-7fexgeRW05M7oQts_13N8bScBcLSuVRV5pW3ZPvR_h2NmXXi-E8bU3hOCTcqcTIfHgzJa9KJho-Q_NG2fp3LGuVYwxQvvRi8wNNaK7_WSUTESnShhFMxcJ125HChcDjleI1_aF_ijwOfOvBkrPZdNIL738kfV9DFh2V9JAyW80fTM1MrU1EeO_o0qpRw1jvsBBAdUiCUaUhW8QElQmHUmophaKcNHJFYVo5hm_oN2usqYyVY3QfF5mKEgVKVlpkQOmsMons84ewayrRc6Umnow=s128-no",
              labelOrigin: new google.maps.Point(30, 52),
              scaledSize: new google.maps.Size(50,50),
              anchor: new google.maps.Point(16,38)
            },
            labelContent: payload[i].vessel,
            labelAnchor: new google.maps.Point(16, -1),
            labelClass: "my-custom-class-for-label",
            labelInBackground: true
          });
          google.maps.event.addListener(newMarker, 'click', (function (newMarker, i) {
            return function () {
              var contentString = '<div id="content">'+
                  '<h3 style="color:navy;">Vessel Name: '+payload[i].vessel+
                  //'<div style="color:green; text-align: left;">Vessel ETA to '+payload[i].dest
                  '<div style="color:green; text-align: left;">Next Port ('+ payload[i].dest +') ETA'+
                  ': </br>'+payload[i].ETA +
                  '</h3></div><div id="bodyContent">'+
                  loopreferences(payload[i].references)+'</div>';
              infowindow.setContent(contentString);
              infowindow.open(map, newMarker);
            };
          })(newMarker, i));
          markers.push(newMarker);
        }
      }
      initialize();
    }
}
