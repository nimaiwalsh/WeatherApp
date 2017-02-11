var url;
var lat;
var long;

$(document).ready(function() {

  //Disable cache to ensure updates
  $.ajaxSetup({
    cache: false
  });

  //getCurrentPosition on page load
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation not supported by your browser.");
  }

  // Search for weather manually
  $("#locationBtn").on("click", function(e) {
    e.preventDefault();
    var value = $("#locationInput").val();  
    $("#message").hide();
    //Revert to Celcius  
    $("#tempConvert").html('&#8457;');
    $("#tempScale").html('&#8451;');
    
    if (value === "") {
      $("#message").html('Please enter a city').show();
    } else {
      url = "http://api.openweathermap.org/data/2.5/weather?q=" + value + "&appid=99ccd40e0a5fc26b95eb7d6d3ebeacd7&units=metric";
      getData();
    }

  });

});

//Assign the current position into variables and build API url
function showPosition(pos) {
  lat = pos.coords.latitude;
  long = pos.coords.longitude;
  url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=99ccd40e0a5fc26b95eb7d6d3ebeacd7&units=metric";
  getData();
}

//Retrieve the API weather data and display in the app  
function getData() {
  var summary;
  var temp;
  var icon;
  var location;
  var humidity;
  var pressure;

  $("#loading").show();
  $("article").hide();

  $.getJSON(url, function(data) {
      location = data.name;
      summary = data.weather[0].description;
      temp = (Math.round(data.main.temp * 10) / 10).toFixed(1);
      icon = data.weather[0].icon;
      humidity = data.main.humidity;
      pressure = data.main.pressure;
    })
    .done(function() {
      //Hide loading sign and show data    
      $("#loading").hide();
      $("#message").hide();
      $("article").show();

      //Populate data
      $("#locationData").html(location);
      $("#tempData").html(temp);
      $("#conditions").html(summary);
      $("#humidityData").html(humidity);
      $("#pressureData").html(pressure);

      //Change Icons    
      switch (icon) {
        case '01d':
          $("#icon").attr("class", "wi wi-day-sunny");
          break;
        case '01n':
          $("#icon").attr("class", "wi wi-night-clear");
          break;
        case '02d':
          $("#icon").attr("class", "wi wi-day-sunny-overcast");
          break;
        case '02n':
          $("#icon").attr("class", "wi wi-night-alt-partly-cloudy");
          break;
        case '03d':
          $("#icon").attr("class", "wi wi-day-cloudy");
          break;
        case '03n':
          $("#icon").attr("class", "wi wi-night-alt-cloudy");
          break;
        case '04d':
        case '04n':
          $("#icon").attr("class", "wi wi-cloud");
          break;
        case '09d':
        case '09n':
          $("#icon").attr("class", "wi wi-rain");
          break;
        case ('10d'):
          $("#icon").attr("class", "wi wi-day-rain");
          break;
        case ('10n'):
          $("#icon").attr("class", "wi wi-night-alt-rain");
          break;
        case ('11d'):
          $("#icon").attr("class", "wi wi-day-thunderstorm");
          break;
        case ('11n'):
          $("#icon").attr("class", "wi wi-night-alt-thunderstorm");
          break;
        case ('13d'):
          $("#icon").attr("class", "wi wi-day-snow");
          break;
        case ('13n'):
          $("#icon").attr("class", "wi wi-night-alt-snow");
      }
    })
    //Display error message if data cannot be retrieved
    .fail(function() {
      $("#loading").hide();
      $("#message").show();
      $("#message").html("Sorry, there was an error retrieving your weather data");
    })

  //Convert temperature between celcius and fahrenheight    
  var degrees = true;

  $("#tempConvert").on("click", function() {
    if (degrees) {
      $("#tempData").html((temp * 9 / 5 + 32).toFixed(1));
      $("#tempConvert").html('&#8451;');
      $("#tempScale").html('&#8457;');
      degrees = false;
    } else {
      $("#tempData").html(temp);
      $("#tempConvert").html('&#8457;');
      $("#tempScale").html('&#8451;');
      degrees = true;
    }
  });
}