var apiKey = "89893227e2cfb5edad9b90f12127f1ef"

var getWeather = function(){
  var day = getToday();
  var city = $('#search-city').val();
  // fetch call to get coordinates
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
    .then(function(coordResponse){
      return coordResponse.json();
    })
    .then(function(coordData){
      console.log(coordData);
      // assign lat and lon values to variables
      var lat = coordData[0].lat;
      var lon = coordData[0].lon;

      // second fetch call
      return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
        .then(function(weatherResponse){
          return weatherResponse.json();
        })
        .then(function(weatherData){
          console.log(weatherData);
          // set information to variables
          var temp = weatherData.current.temp;
          var wind = weatherData.current.wind_speed;
          var humidity = weatherData.current.humidity;
          var uv = weatherData.current.uvi;
           // create an h2 element for city and date
          $('<h2>')
          .html($('#search-city').val() + ` ${day} <img src='http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png'>`)
          .appendTo($('#weatherInfoContainer'));
          // create a and display a list of weather info
          $('<ul>')
            .html(`
              <li>Temp: ${temp}</li>
              <li>Wind: ${wind}</li>
              <li>Humidity: ${humidity}</li>
              <li>UV Index: ${uv}</li>
            `)
            .appendTo($('#weatherInfoContainer'));
        });
    });
};


// function to get the current day
var getToday = function(){
  var currentDay = new Date();
  var d = currentDay.getDate();
  var m = currentDay.getMonth()+1;
  var y = currentDay.getFullYear();
  return `(${m}/${d}/${y})`;
};

//submit event listener
$('#search-city-form').submit(function(event){
  // fetch call to get coordinates
  getWeather();
  event.preventDefault();
});

