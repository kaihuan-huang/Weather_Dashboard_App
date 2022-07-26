var today = new Date()
var cityNameInputEl = document.querySelector("#city-name");
var historyButtonEl = document.querySelector(".history-btn"); 
var currentWeatherEl =document.querySelector("#weather-status");
var submitFormEl = document.querySelector("#city-form");
var currentWeatherContainerEl = document.querySelector("#current-weather-list");
var historyList =[];
//search by city form
var formSubmitHandler = function(event){
    event.preventDefault();
    //get city name value from input element
    var cityName = cityNameInputEl.value.trim();
    // console.log(cityName);

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
// var apiKey = "d4a8a192fa2a47a2a72aca5e2a14cb93";
// var fetchWeather =function(city){
//     fetch(
//         "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + apiKey
//     )
//     .then((response)=> response.json())
//     .then((data)=> displayWeather(data));
// };
var fetchWeather = function(cityName){
    var apiKey = "d4a8a192fa2a47a2a72aca5e2a14cb93";
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&units=imperial&appid=" + apiKey;

    fetch(apiUrl)
    .then(function(response){
        if (response.ok){
            console.log(response);
            response.json().then(function(data){
                console.log(data);
                displayWeather(data, cityName);
            });
        }else{
            alert('Error: ' + response.statusText);
        }
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

}

var displayWeatherHead = function(data){
    // find out all the element display on the page, and replace their content
   var city = data.name;
   var date = (today.getMonth()) + "/" + today.getDate() + "/" +today.getFullYear();
   var weatherIcon = data.weather[0].icon;
   console.log(weatherIcon);
   var weatherDescription = data.weather[0].description;
   //get icon url http://openweathermap.org/img/wn/10d@2x.png
   console.log(city, date, weather, weatherDescription);
   var weatherIconLink = "<img src='http://openweathermap.org/img/wn/" + weatherIcon +"@2x.png' />"

   //update weather-status to show city , date and icon
   currentWeatherEl.innerHTML = city + date + weatherIconLink
   
}


//display current weather on the cardbody List
var displayWeatherBody = function(weather){
    //check if api return any weather data
    if (weather.length === 0){
        currentWeatherContainerEl.textContent = "No weather information found."
        return;   
    }
    //Create Temperature to the Weather Body list
    var temperature = document.createElement('p');
    temperature.setAttribute('id','temperature');
    //toFixed(1)保留一位小数
    temperature.textContent = "<strong>Temperature: </strong>" + weather.current.temperature.toFixed(1) + "°F";
    currentWeatherEl.appendChild(temperature);

    //Create Wind Speed to the Weather Body list
    var windSpeed = document.createElement('p');
    windSpeed.setAttribute('id','windSpeed');
    //toFixed(1)保留一位小数
    temperature.textContent = "<strong>Wind Speed: </strong>" + weather.current.windSpeed.toFixed(1) + "MPH";
    currentWeatherEl.appendChild(windSpeed);


    //Create  Humidity to the Weather Body list
    var humidity = document.createElement('p');
    temperature.setAttribute('id','humidity');
    //toFixed(0)保留0位小数
    temperature.textContent = "<strong>Humidity: </strong>" + weather.current.humidity.toFixed(0) + "%";
    currentWeatherEl.appendChild(humidity);

    //Create UV Index to the Weather Body list
    var uvIndex= document.createElement('p');
    uvIndex.setAttribute('id','uvIndex');
    //toFixed(1)保留一位小数
    uvIndex.textContent = "<strong>UV Index: </strong>" + uvIndexValue ;
    currentWeatherEl.appendChild(uvIndex);
    uvIndexValue = weather.current.uvIndex.toFixed(1) ;
    //according UV Index number to display diferent color:

}


