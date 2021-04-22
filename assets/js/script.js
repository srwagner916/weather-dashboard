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
      return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(function(weatherResponse){
          return weatherResponse.json();
        })
        .then(function(weatherData){
          console.log(weatherData);
        });
    });
};

//submit event listener
$('#search-city-form').submit(function(event){
  // fetch call to get coordinates
  getWeather();
  event.preventDefault();
});

