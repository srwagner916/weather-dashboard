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
   // create an h2 element for city and date
  $('<h2>')
  .html($('#search-city').val() + ` (${today}) <img src='http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png'>`)
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
};

var fiveDayForecast = function(data){
  // create elements for five day forecast
  var fiveDayForecast = $('#five-day-forecast')
  var fiveDayHeading = $('<h2>');
  // date variables
  var day1 = dayjs().add(1, 'day').format('MM/DD/YYYY');
  var day2 = dayjs().add(2, 'day').format('MM/DD/YYYY');
  var day3 = dayjs().add(3, 'day').format('MM/DD/YYYY');
  var day3 = dayjs().add(4, 'day').format('MM/DD/YYYY');
  var day5 = dayjs().add(5, 'day').format('MM/DD/YYYY');
  //card variables
  var day1Card = $('<div>').attr('class', 'card');
  var day2Card = $('<div>').attr('class', 'card');
  var day3Card = $('<div>').attr('class', 'card');
  var day4Card = $('<div>').attr('class', 'card');
  var day5Card = $('<div>').attr('class', 'card');
  // add information
  fiveDayHeading.html('Five Day Forecast:')
    .appendTo(fiveDayForecast);
  $('<div>')
    .attr('class', 'card-body')
    .html(`
      <h3>${day1}</h3>
      <img src='http://openweathermap.org/img/wn/${data.daily[1].weather[0].icon}@2x.png'>
      <ul>
        <li>Temp: ${data.daily[1].temp.day}</li>
        <li>Wind: ${data.daily[1].wind_speed}</li>
        <li>Humidity: ${data.daily[1].humidity}</li>
      </ul>
      `)
    .appendTo(fiveDayForecast);
};

//submit event listener
$('#search-city-form').submit(function(event){
  // fetch call to get coordinates
  getWeather();
  event.preventDefault();
});

