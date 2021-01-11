var Geolocation = {
    currentLocation: () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition((position) => {
                var res = {
                    'latitude': position.coords.latitude,
                    'longitude': position.coords.longitude,
                    'altitude': position.coords.altitude,
                    'accuracy': position.coords.accuracy,
                    'altitudeAccuracy': position.coords.altitudeAccuracy,
                    'heading': position.coords.heading,
                    'speed': position.coords.speed,
                    'timestamp': position.timestamp
                }
                resolve(res);
            }, (error) => {
                reject(error);
            });

        });
    },
    loadJavascript: () => {
        return new Promise((resolve, reject) => {
            var gmaps = document.createElement("script");
            gmaps.type = "text/javascript";
            gmaps.src = "https://maps.googleapis.com/maps/api/js?key=DKASHDJASJDA";
            document.head.appendChild(gmaps);
            gmaps.onload = () => { resolve("Success") }
        });
    },
    loadMap: (elem) => {
        return new Promise((resolve, reject) => {
            Geolocation.currentLocation().then((res) => {
                var mapOptions = {
                    center: new google.maps.LatLng(0, 0),
                    zoom: 1,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map(elem, mapOptions);
                var latLong = new google.maps.LatLng(res.latitude, res.longitude);
                var marker = new google.maps.Marker({
                    position: latLong
                });
                marker.setMap(map);
                map.setZoom(15);
                map.setCenter(marker.getPosition());
                resolve("OK");
            }).catch((err) => {
                reject(err);
            });
        });
    },
    getMapLocaton: async (elem) => {
        if (!window["google"] || !google.maps) await Geolocation.loadJavascript();
        return new Promise((resolve, reject) => {
            Geolocation.loadMap(elem).then((res) => { resolve("OK") }).catch((err) => { reject(err) });
        });
    }
}

export default Geolocation;

/*
-Geolocation
framework7 cordova plugin add cordova-plugin-geolocation
geolocation.js
Contoh:
*Ambil kordinat
const currentLocation = () => {
    Geolocation.currentLocation().then(res => {
        //res = array
        alert('sucess : ' + JSON.stringify(res));
    }
    ).catch(err => {
        if(err != "") alert('error : ' + JSON.stringify(err));
    })
}
*Map
const displayMaps = () => {
    Geolocation.getMapLocaton(document.getElementById("map_canvas")).then(res => {
        //res = string
        console.log(res);
    }
    ).catch(err => {
        if(err != "") alert('error : ' + err);
    })
}
*/