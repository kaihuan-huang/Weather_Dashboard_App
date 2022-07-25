var today = new Date()
var cityNameInputEl = document.querySelector("#city-name");
var historyButtonEl = document.querySelector(".history-btn")
var currentWeatherEl =document.querySelector("#weather-status")
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
        historyList.innerText = cityName;
        historyList.appendChild(historyList);
    }
    else{
        alert("Please inpu a value city name.")
    }

}

//get the api key from Open Weather.com https://home.openweathermap.org/api_keys
var weather = {
    apiKey : "d4a8a192fa2a47a2a72aca5e2a14cb93",
    fetchWeather: function(city){
        fetch(
            "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + this.apiKey
        )
        .then((response)=> response.json())
        .then((data)=> this.displayWeather(data));
    },
    displayWeatherHead: function(data){
        // find out all the element display on the page, and replace their content
       var city = data.name;
       var date = (today.getMonth()) + "/" + today.getDate() + "/" +today.getFullYear();
       var weatherIcon = data.weather[0].icon;
       var weatherDescription = data.weather[0].description;
       //get icon url http://openweathermap.org/img/wn/10d@2x.png
       console.log(city, date, weather, weatherDescription);
       var weatherIconLink = "<img src='http://openweathermap.org/img/wn/" + weatherIcon +"@2x.png' />"

       //update weather-status to show city , date and icon
       currentWeatherEl.innerHTML = city + date + weatherIconLink
       
    }
};

//display current weather on the cardbody
var displayWeatherBody

