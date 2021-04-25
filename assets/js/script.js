var apiKey = "89893227e2cfb5edad9b90f12127f1ef"
var recentCitiesArr = JSON.parse(localStorage.getItem('cities') || '[]');

var getWeather = function(cityName){
  if ($('#search-city').val()){
    var city = $('#search-city').val();
  } else {
    var city = cityName
  }
  // fetch call to get coordinates
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
  .then(function(coordResponse){
    return coordResponse.json();
  })
  .then(function(coordData){
    // assign lat and lon values to variables
    var lat = coordData[0].lat;
    var lon = coordData[0].lon;
    
    // second fetch call
    return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
    .then(function(weatherResponse){
      return weatherResponse.json();
    })
    .then(function(weatherData){
      displayTodayWeather(weatherData, cityName, city);
      fiveDayForecast(weatherData);
    });
  });
};
    
    var displayTodayWeather = function(data, cityName, searchedCity){
      var today = dayjs().format('MM/DD/YYYY');
      var temp = data.current.temp;
      var wind = data.current.wind_speed;
      var humidity = data.current.humidity;
      var uv = data.current.uvi;
    
      if(cityName){
        var city = cityName;
      } else {
        var city = searchedCity;
      }
  
      var weatherInfoContainer = $('#weatherInfoContainer');
      // clear weatherInfoContainer before displaying new search
      weatherInfoContainer.empty();
      // create an h2 element for city and date
      weatherInfoContainer.attr('class', 'border border-dark p-4 my-4');
      $('<h2>')
      .html(`${city} (${today}) <img src='https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png'>`)
      .appendTo($('#weatherInfoContainer'));
      // create a and display a list of weather info
      $('<ul>')
      .attr('class', 'list-unstyled')
      .html(`
      <li>Temp: ${temp}&degF</li>
      <li>Wind: ${wind} MPH</li>
      <li>Humidity: ${humidity} %</li>
      <li>UV Index: <span id=uviContainer>${uv}</span></li>
      `)
      .appendTo($('#weatherInfoContainer'));
      if(Math.floor(uv) <=2){
          $('#uviContainer').attr('class', 'bg-success text-light p-1 rounded');
      } else if(Math.floor(uv) >=3 && Math.floor(uv) <= 5){
          $('#uviContainer').attr('class', 'bg-warning text-light p-1 rounded');
      } else if(uv >=6){
          $('#uviContainer').attr('class', 'bg-danger text-light p-1 rounded');
      }
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
        .attr('class', 'card-body bg-info text-light')
        .html(`
        <h3>${dayjs().add([i+1], 'day').format('MM/DD/YYYY')}</h3>
        <img src='https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png'>
        <ul class="list-unstyled">
        <li>Temp: ${data.daily[i].temp.day}&degF</li>
        <li>Wind: ${data.daily[i].wind_speed} MPH</li>
        <li>Humidity: ${data.daily[i].humidity} %</li>
        </ul>
        `)
        .appendTo(dayCards[i]);
        dayCards[i].appendTo(fiveDayCardDeck);
      }
    };
    
    var saveCities = function(){
      localStorage.setItem('cities', JSON.stringify(recentCitiesArr));
    };
    
    //submit event listener
    $('#search-city-form').submit(function(event){
      // fetch call to get coordinates
      getWeather();
      if (recentCitiesArr.includes($('#search-city').val())){
        $('#search-city').val('');
        return false;
      } else{
        recentCitiesArr.push($('#search-city').val());
        localStorage.setItem('cities', JSON.stringify(recentCitiesArr));
        $('<button>')
        .attr('class', 'btn btn-secondary btn-block')
        .attr('type', 'button')
        .attr('id', $('#search-city').val())
        .html($('#search-city').val())
        .appendTo('#recent-cities-btns');
      }
      $('#search-city').val('');
      event.preventDefault();
    });

    // recent cities event listener
    $('#recent-cities-btns').delegate('button', 'click', function(){
      var cityName = $(this).attr('id');
      getWeather(cityName);
    });
    
    var loadRecentCities = function(){
      var savedCities = localStorage.getItem('cities');
      var savedCities =JSON.parse(savedCities);
    
      if(!savedCities){
        return false;
      } else {
        for (var i=0; i<savedCities.length; i++){
          $('<button>')
            .attr('class', 'btn btn-secondary btn-block text-light')
            .attr('type', 'button')
            .attr('id', savedCities[i])
            .html(savedCities[i])
            .appendTo('#recent-cities-btns');
        }
      }
    };
    
    loadRecentCities();

