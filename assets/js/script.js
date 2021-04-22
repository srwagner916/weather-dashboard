var apiKey = "89893227e2cfb5edad9b90f12127f1ef"

// var getCoordinates = function(){
//   var city = $('#search-city').val();
//   // fetch call to get coordinates
//   fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
//     .then(function(response){
//       return response.json;
//     })
//     .then(function(data){
//       console.log(data);
//     });
// };

//submit event listener

$('#search-city-form').submit(function(event){
    var city = $('#search-city').val();
  // fetch call to get coordinates
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
    .then(function(response){
       return response.json();
    })
    .then(function(data){
      console.log(data);
      var coordinates = {lat: data[0].lat, long: data[0].lon};
      return coordinates
    });
  event.preventDefault();
});

