var today = new Date()
var cityNameInputEl = document.querySelector("#city-name");
var clearHistoryEl = document.querySelector("#clear")
var historySearchListEl = document.querySelector("#history-search-list")
var currentWeatherEl =document.querySelector("#weather-status");
var submitFormEl = document.querySelector("#city-form");
var currentWeatherContainerEl = document.querySelector("#current-weather-list");
var currentWeatherCardEl = document.querySelector("#current-weather-card");
var fiveDayforcastCardEl = document.querySelector("#forecast-card");
var historyList =[];
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


//get the api key from Open Weather.com https://home.openweathermap.org/api_keys
var fetchWeather = function(cityName){
    
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&units=imperial&appid=d4a8a192fa2a47a2a72aca5e2a14cb93";

    fetch(apiUrl)
        .then(function(response){
            if (response.ok){
                console.log(response);
                var latitude = response.coord.lat;
                var longitude = response.coord.lon;

                response.json().then(function(data){
                    console.log(data);
                    displayWeather(response);
                    var city = data.name;
                    var date = (today.getMonth()) + "/" + today.getDate() + "/" +today.getFullYear();
                    var weatherIcon = data.weather[0].icon;
                    console.log(weatherIcon);
                    var weatherDescription = data.weather[0].description;
                    //get icon url http://openweathermap.org/img/wn/10d@2x.png
                    console.log(city, date, weather, weatherDescription);
                    var weatherIconLink = "<img src='http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png' alt='" + weatherDescription + "' title='" + weatherDescription + "'  />"
                    //update weather-status to show city , date and icon
                    currentWeatherEl.innerHTML = city + date + weatherIconLink
                    //show the current weather
                    currentWeatherCardEl.classList.remove("hidden");
                    fiveDayforcastCardEl.classList.remove("hidden");

                    // Return a fetch request to the OpenWeather using longitude and latitude from pervious fetch
                    return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=alerts,minutely,hourly&units=imperial&appid=d4a8a192fa2a47a2a72aca5e2a14cb93');
                });
                
            }else{
                alert('Error: ' + response.statusText);
            }
        })
        .then(function(response){
            return response.JSON();
        
        })
        .then(function(response){
            console.log(response);
            displayWeather(response);
        })
        .catch(function(error){
            alert('Unable to connect to Open Weather API.')
        });
};

var displayWeather = function (weather, searchWeather){
    if (weather.length === 0){
        currentWeatherContainerEl.textContent = 'No weather information found.'
        return;
    }
    currentWeatherEl.textContent = searchWeather;

    //Create Temperature to the Weather Body list
    var temperature = document.createElement('p');
    temperature.id = "temperature";
    temperature.innerHTML = "<strong>Temperature:</strong> " + weather.current.temp.toFixed(1) + "°F";
    currentWeatherEl.appendChild(temperature);

    //Create Wind Speed to the Weather Body list
    var windSpeed = document.createElement('p');
    windSpeed.setAttribute('id','windSpeed');
    //toFixed(1)保留一位小数
    temperature.textContent = "<strong>Wind Speed: </strong>" + weather.current.windSpeed.toFixed(1) + "MPH";
    currentWeatherContainerEl.appendChild(windSpeed);


    //Create  Humidity to the Weather Body list
    var humidity = document.createElement('p');
    humidity.setAttribute('id','humidity');
    //toFixed(0)保留0位小数
    temperature.textContent = "<strong>Humidity: </strong>" + weather.current.humidity.toFixed(0) + "%";
    currentWeatherContainerEl.appendChild(humidity);

    //Create UV Index to the Weather Body list
    var uvIndex= document.createElement('p');
    uvIndex.setAttribute('id','uvIndex');
    uvIndexValue = weather.current.uvIndex.toFixed(1);
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
    uvIndex.textContent = "<strong>UV Index: </strong>" + uvIndexValue ;
    currentWeatherContainerEl.appendChild(uvIndex);

    //5 day forcast api api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    var forecastArray = weather.daily;

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
    localStorage.removeItem('searchWeather');
    clearHistory.className = "hidden";
}

clearHistoryEl.addEventListener('click', clearHistory);




