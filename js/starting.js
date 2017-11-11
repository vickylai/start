function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function getIP() {
    let url = 'https://api.ipify.org/?format=json';

    fetch(url)
        .then(res => res.json())
        .then((out) => {
            document.getElementById('ip').innerHTML = out.ip;
        })
        .catch(err => { throw err });
}

function setMood(rise, set) {
    var h = getTime();
    if (h > set+1 || h < rise) {
        // Night
        document.body.style.backgroundImage = "linear-gradient(to top, #111111 0%, #232323 50%, #454545 100%)";
    } else
    if (h >= rise && h <= rise+1) {
        // Sunrise
        document.body.style.backgroundImage = "linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)";
        document.body.style.color = "#111111";
    } else
    if (h >= rise+2 && h <= set-1) {
        // Day
        document.body.style.backgroundImage = "linear-gradient(to top, #a1c4fd 0%, #c2e9fb 100%)";
        document.body.style.color = "#111111";
    } else
    if (h == set && h <= set+1) {
        // Sunset
        document.body.style.backgroundImage = "linear-gradient(to bottom, #fa709a 0%, #fee140 100%)";
        document.body.style.color = "#111111";
    }
}

function getTime() {
    // Get user's current time
    let time = new Date(),
        h = addZero(time.getHours()),
        m = addZero(time.getMinutes());
    document.getElementById('time').innerHTML = h + ':' + m;
    return h;
}

function newQuote() {
    let url = 'https://random-quote-generator.herokuapp.com/api/quotes/random';

    fetch(url)
        .then(res => res.json())
        .then((out) => {
            document.getElementById('quote-author').innerHTML = '-- ' + out.author;
            document.getElementById('quote-text').innerHTML = out.quote;
        })
        .catch(err => { throw err });
}

function geoFindMe() {
    let output = document.getElementById("geo");

    if (!navigator.geolocation) {
        output.innerHTML = "(geolocation is not supported by your browser)";
        return;
    }

    function success(position) {
        document.getElementById('advice').style.opacity = "0";
        document.getElementById('page').style.opacity = "1";

        let latitude = position.coords.latitude,
            longitude = position.coords.longitude,
            // Up to 1,000 API calls per day with Dark Sky's trial. May break.
            // Please use your own free key. Get it at https://darksky.net
            key = '1ab44c1eacf257905c07b689ff153685';

        let apiURL = 'https://api.darksky.net/forecast/' + key + '/' + latitude + ',' + longitude;

        // Get some weather info from DarkSky 

        var xhr = new XMLHttpRequest();
        xhr.open('GET', apiURL, true);
        xhr.onload = function (e) {
            let json = JSON.parse(this.response);

            // Get, parse degree info
            let degF = Math.round(json.currently.temperature),
                degC = Math.round((degF - 32) * (5 / 9)),
                degFHigh = Math.round(json.daily.data[0].temperatureMax),
                degFLow = Math.round(json.daily.data[0].temperatureMin),
                degCHigh = Math.round((degFHigh - 32) * (5 / 9)),
                degCLow = Math.round((degFLow - 32) * (5 / 9)),
                country = json.timezone,
                unixrise = json.daily.data.sunriseTime,
                rise = unixrise.getHours(),
                unixset = json.daily.data.sunsetTime,
                set = unixset.getHours();

            // Place weather info
            document.getElementById('pipeya').innerHTML = ' | ';

            function loadTemp(country) {
                if (country.indexOf('America') === 0) {
                    document.getElementById('temp').innerHTML = degC;
                    document.getElementById('deg').innerHTML = '°C';
                } else {
                    document.getElementById('temp').innerHTML = degF;
                    document.getElementById('deg').innerHTML = '°F';
                }
            }
            loadTemp(country);
            setMood(rise,set);
            document.getElementById('advice').style.opacity = "0";
            document.getElementById('page').style.opacity = "1";
        }
        xhr.send();
    }

    function error(error) {
        output.innerHTML = "You are here.";
        console.log(error);
        document.getElementById('advice').style.opacity = "0";
        document.getElementById('page').style.opacity = "1";
    }

    document.getElementById('advice').style.opacity = "1";
    document.getElementById('page').style.opacity = "0";

    navigator.geolocation.getCurrentPosition(success, error);
};

let ready = function (fn) {

    // Sanity check
    if (typeof fn !== 'function') return;

    // If document is already loaded, run method
    if (document.readyState === 'complete') {
        return fn();
    }

    // Otherwise, wait until document is loaded
    document.addEventListener('DOMContentLoaded', fn, false);

};

// Example
ready(function () {
    document.getElementById('advice').style.opacity = "1";
    document.getElementById('page').style.opacity = "0";
    getTime();
    getIP();
    newQuote();
    geoFindMe();
});
