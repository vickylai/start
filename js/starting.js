function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function getIP() {
    $.getJSON("https://api.ipify.org/?format=json", function (e) {
        $('#ip').html(e.ip);
    });
}

function getTime() {
    // Get user's current time
    var time = new Date(),
        h = addZero(time.getHours()),
        m = addZero(time.getMinutes());
    $('#time').html(h + ':' + m);
}

function newQuote() {
    $.getJSON('https://random-quote-generator.herokuapp.com/api/quotes/random',
        function (json) {
            $('.quote-author').html('-- ' + json.author)
            $('.quote-text').html(json.quote);
        }
    );
}

function geoFindMe() {
    var output = document.getElementById("geo");

    if (!navigator.geolocation) {
        output.innerHTML = "(geolocation is not supported by your browser)";
        return;
    }

    function success(position) {
        $('.advice').fadeOut(500);

        var latitude = position.coords.latitude,
            longitude = position.coords.longitude,
            // Up to 1,000 API calls per day with Dark Sky's trial. May break.
            // Please use your own free key. Get it at https://darksky.net
            key = '1ab44c1eacf257905c07b689ff153685';

        // Uncomment to show lat and lon. I thought it a bit much.
        //output.innerHTML = latitude + '°, ' + longitude + '°';

        var apiURL = 'https://api.darksky.net/forecast/' + key + '/' + latitude + ',' + longitude;

        // Get some weather info from DarkSky 
        $.ajax({
            type: 'GET',
            dataType: 'jsonp',
            url: apiURL,
            crossDomain: true,
            cache: false,
            success: function (json) {

                // Get, parse degree info
                var degF = Math.round(json.currently.temperature),
                    degC = Math.round((degF - 32) * (5 / 9)),
                    degFHigh = Math.round(json.daily.data[0].temperatureMax),
                    degFLow = Math.round(json.daily.data[0].temperatureMin),
                    degCHigh = Math.round((degFHigh - 32) * (5 / 9)),
                    degCLow = Math.round((degFLow - 32) * (5 / 9)),
                    country = json.timezone;

                // Place weather info
                $('#pipeya').html(' | ');

                function loadTemp(country) {
                    if (country.indexOf('America') === 0) {
                        $('#temp').html(degC);
                        $('#deg').html('°C');
                    } else {
                        $('#temp').html(degF);
                        $('#deg').html('°F');
                    }
                }
                loadTemp(country);
                $('.page').fadeIn(500);
            },
            error: function (error) {
                console.log(error);
                $('.advice').fadeOut(500);
                $('.page').fadeIn(500);
            }
        });
    }

    function error(error) {
        output.innerHTML = "You are here.";
        console.log(error);
        $('.advice').fadeOut(500);
        $('.page').fadeIn(500);
    }

    $('.advice').fadeIn(500);

    navigator.geolocation.getCurrentPosition(success, error);
}


$(document).ready(function () {
    $('.advice').fadeOut(0);
    $('.page').fadeOut(0);
    getTime();
    getIP();
    geoFindMe();
    newQuote();
});