var today = new Date();
var cityNameInputEl = document.querySelector("#city-name");
var clearHistoryEl = document.querySelector("#clear");
var historySearchListEl = document.querySelector("#history-search-list");
var historyCardEl = document.querySelector('#search-history');
var currentWeatherEl =document.querySelector("#weather-status");
var submitFormEl = document.querySelector("#city-form");
var currentWeatherContainerEl = document.querySelector("#current-weather-list");
var currentWeatherCardEl = document.querySelector("#current-weather-card");
var fiveDayforcastCardEl = document.querySelector("#forecast-card");
var historyList =[];
var weatherData = [];
//search by city 
var formSubmitHandler = function(event){
    event.preventDefault();
    //get city name value from input element
    var cityName = cityNameInputEl.value.trim();
 
    //set city name in local storage and generate history button
    if (cityName){
        historyList.push(cityName);
        localStorage.setItem("searchWeather", JSON.stringify(historyList));
        currentWeatherContainerEl.textContent = '';
        cityName.value = '';
        fetchWeather(cityName);
    }
    else{
        alert("Please inpu a value city name.")
    }
};

submitFormEl.addEventListener('submit', formSubmitHandler);
var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=' + apiKey;
var apiKey = "d4a8a192fa2a47a2a72aca5e2a14cb93"
//get the api key from Open Weather.com https://home.openweathermap.org/api_keys
var fetchWeather = function(cityName){
    
    let latUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=5&appid=" +
    apiKey;

    fetch(latUrl, {
        method: "GET", //GET is the default.
        credentials: "same-origin", // include, *same-origin, omit
        redirect: "follow", // manual, *follow, error
      })
        .then(function (response) {
            return response.json();
          
        })
        .then(function (data) {
        //   console.log(data);
          var lat = data[0].lat;
          var lon = data[0].lon;

          console.log(lat,lon);
            var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&units=imperial&exclude={part}&appid=' + apiKey;
            fetch(apiUrl, {
                method: "GET", //GET is the default.
                credentials: "same-origin", // include, *same-origin, omit
                redirect: "follow", // manual, *follow, error
              })
                .then(function (response) {
                  return response.json();
                })
                .then(function (data){
                    // console.log(data);
                    weatherData = data;
                    console.log(weatherData);
                    displayWeather(weatherData, cityName);
                    currentWeatherCardEl.classList.remove("hidden");
                    fiveDayforcastCardEl.classList.remove("hidden");
                    historyCardEl.classList.remove("hidden");
                    historySearchListEl.append(cityName);

                } )
        })
        .catch(function(error){
            console.log(error);
            alert('Unable to connect to Open Weather API.' + error)
        });
    
    // fetch(latUrl, method())
    //     .then(function(response){
    //         console.log(response);
    //         if (response.ok){
    //             console.log(response);
    //             fetch(apiUrl)
    //                 .then(response.ok){
                        
    //                 }
        //         //`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`            
                
        //         var latitude = response.coord.lat;
        //         var longitude = response.coord.lon;
                
        //         response.json().then(function(data){
        //             console.log(data);
        //             displayWeather(response);
        //             var city = data.name;
        //             var date = (today.getMonth()) + "/" + today.getDate() + "/" +today.getFullYear();
        //             var weatherIcon = data.weather[0].icon;
        //             console.log(weatherIcon);
        //             var weatherDescription = data.weather[0].description;
        //             //get icon url http://openweathermap.org/img/wn/10d@2x.png
        //             console.log(city, date, weather, weatherDescription);
        //             var weatherIconLink = "<img src='http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png' alt='" + weatherDescription + "' title='" + weatherDescription + "'  />"
        //             //update weather-status to show city , date and icon
        //             currentWeatherEl.innerHTML = city + date + weatherIconLink
        //             //show the current weather
        //             currentWeatherCardEl.classList.remove("hidden");
        //             fiveDayforcastCardEl.classList.remove("hidden");

        //             // Return a fetch request to the OpenWeather using longitude and latitude from pervious fetch
        //             // return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=alerts,minutely,hourly&units=imperial&appid=d4a8a192fa2a47a2a72aca5e2a14cb93');
        //         });
                
        //     }else{
        //         alert('Error 1: ' + response.statusText);
        //     }
        // })
        // // .then(function(response){
        // //     return response.JSON();
        
        // // })
        // // .then(function(response){
        // //     console.log(response);
        // //     displayWeather(response);
        // // })
//         .catch(function(error){
//             console.log(error);
//             alert('Unable to connect to Open Weather API.' + error)
//         });
};

var displayWeather = function (weatherData, searchWeather){
    console.log(weatherData);
    if (weatherData.length === 0){
        currentWeatherContainerEl.textContent = 'No weather information found.'
        return;
    }
    currentWeatherEl.innerHTML = searchWeather;

    //Create date and weatherIcon
    



    //Create Temperature to the Weather Body list
    var temperature = document.createElement('p');
    temperature.id = "temperature";
    temperature.innerHTML = "<strong>Temperature:</strong>" + weatherData.current.temp.toFixed(1) + "°F";
    currentWeatherContainerEl.appendChild(temperature);

    //Create Wind Speed to the Weather Body list
    var windSpeed = document.createElement('p');
    windSpeed.setAttribute('id','windSpeed');
    //toFixed(1)保留一位小数
    windSpeed.innerHTML = "<strong>Wind Speed: </strong>" + weatherData.current.wind_speed.toFixed(1) + "MPH";
    currentWeatherContainerEl.appendChild(windSpeed);


    //Create  Humidity to the Weather Body list
    var humidity = document.createElement('p');
    humidity.setAttribute('id','humidity');
    //toFixed(0)保留0位小数
    humidity.innerHTML = "<strong> Humidity: </strong>" + weatherData.current.humidity.toFixed(0) + "%";
    currentWeatherContainerEl.appendChild(humidity);

    //Create UV Index to the Weather Body list
    var uvIndex= document.createElement('p');
    uvIndex.setAttribute('id','uvIndex');
    uvIndexValue = weatherData.current.uvi.toFixed(1);
    //according UV Index number to display diferent color:
    if(uvIndexValue>=0){
        uvIndex.className = 'uvGreen';
    }
    if(uvIndexValue>=3){
        uvIndex.className = 'uvYellow';
    }
    if(uvIndexValue>=8){
        uvIndex.className = 'uvRed';
    }
    uvIndex.innerHTML = "<strong>UV Index: </strong>" + uvIndexValue ;
    currentWeatherContainerEl.appendChild(uvIndex);

    //5 day forcast api api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    var forecastArray = weatherData.daily;

    // create day cards for extended forecast 
    for (let i = 0; i < forecastArray.length - 3; i++) {
        var date = (today.getMonth() + 1) + '/' + (today.getDate() + i + 1) + '/' + today.getFullYear();
        var weatherIcon = forecastArray[i].weather[0].icon;
        var weatherDescription = forecastArray[i].weather[0].description;
        var weatherIconLink = "<img src='http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png' alt='" + weatherDescription + "' title='" + weatherDescription + "'  />"
        var dayEl = document.createElement("div");
        dayEl.className = "day";
        dayEl.innerHTML = "<p><strong>" + date + "</strong></p>" +
            "<p>" + weatherIconLink + "</p>" +
            "<p><strong>Temp:</strong> " + forecastArray[i].temp.day.toFixed(1) + "°F</p>" +
            "<p><strong>Humidity:</strong> " + forecastArray[i].humidity + "%</p>"

        fiveDayforcastCardEl.appendChild(dayEl);

    }

}



//load city search history
var loadHistory = function(){
    searchArray = JSON.parse(localStorage.getItem('searchWeather'));
    if(searchArray){
        historyList = JSON.parse(localStorage.getItem('searchWeather'));
        for (let i = 0; i < searchArray; i++){
            historySearchListEl.textContent = searchArray[i];
        }
        
    }
}
loadHistory();

//clear search history
var clearHistory = function(event){
    localStorage.removeItem('');
    clearHistory.className = "hidden";
}

clearHistoryEl.addEventListener('click', clearHistory)
