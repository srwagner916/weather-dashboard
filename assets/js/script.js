var apiKey = "89893227e2cfb5edad9b90f12127f1ef"

var getWeather = function(){
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
          displayTodayWeather(weatherData);
          fiveDayForecast(weatherData);
        });
    });
};

var displayTodayWeather = function(data){
  var today = dayjs().format('MM/DD/YYYY');
  console.log(today);
  var temp = data.current.temp;
  var wind = data.current.wind_speed;
  var humidity = data.current.humidity;
  var uv = data.current.uvi;
  var weatherInfoContainer = $('#weatherInfoContainer');
  // clear weatherInfoContainer before displaying new search
  weatherInfoContainer.empty();
   // create an h2 element for city and date
  $('<h2>')
  .html($('#search-city').val() + ` (${today}) <img src='http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png'>`)
  .appendTo($('#weatherInfoContainer'));
  // create a and display a list of weather info
  $('<ul>')
    .html(`
      <li>Temp: ${temp}&degF</li>
      <li>Wind: ${wind} MPH</li>
      <li>Humidity: ${humidity} %</li>
      <li>UV Index: ${uv}</li>
    `)
    .appendTo($('#weatherInfoContainer'));
};

var fiveDayForecast = function(data){
  // create elements for five day forecast
  var fiveDayForecast = $('#five-day-forecast')
  var fiveDayHeading = $('<h2>');
  var fiveDayCardDeck = $('<div>');
  // set fiveday forecast cards to variables
  var day0Card = $('<div>').attr('class', 'card');
  var day1Card = $('<div>').attr('class', 'card');
  var day2Card = $('<div>').attr('class', 'card');
  var day3Card = $('<div>').attr('class', 'card');
  var day4Card = $('<div>').attr('class', 'card');
  // create an array of day cards
  var dayCards = [day0Card, day1Card, day2Card, day3Card, day4Card];
  // clear forecasts before displaying newly searched city
  fiveDayForecast.empty();
  fiveDayHeading.html('Five Day Forecast:')
  .appendTo(fiveDayForecast)
  // card deck to append cards to
  fiveDayCardDeck
    .attr('class', 'card-deck')
    .appendTo(fiveDayForecast);
  // loop through dayCards array to display weather data
  for(var i=0; i<dayCards.length; i++){
    $('<div>')
      .attr('class', 'card-body')
      .html(`
      <h3>${dayjs().add([i+1], 'day').format('MM/DD/YYYY')}</h3>
      <img src='http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png'>
      <ul>
        <li>Temp: ${data.daily[i].temp.day}&degF</li>
        <li>Wind: ${data.daily[i].wind_speed} MPH</li>
        <li>Humidity: ${data.daily[i].humidity} %</li>
      </ul>
      `)
    .appendTo(fiveDayCardDeck);
  }
};

//submit event listener
$('#search-city-form').submit(function(event){
  // fetch call to get coordinates
  getWeather();
  event.preventDefault();
});

