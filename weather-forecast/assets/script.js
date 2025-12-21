timeLabels = ["6:0am", "9:0am", "12:0am", "3:0pm", "6:0pm", "9:0pm"];
dayLabels = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

document.querySelector('#search').addEventListener('submit', async (event) => {
    event.preventDefault();

    const cityName = document.querySelector('#city_name').value;

    if (!cityName) {
        return;
    }

    const apiKey = '8a60b2de14f7a17c7a11706b2cfcd87c';

     apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`

    results = await fetch(apiUrl);
    json = await results.json();

    if (json.cod === 200) {
        showTodayInfo({
            city: json.name,
            country: json.sys.country,
            temperature: json.main.temp,
            feelsLike: json.main.feels_like,
            windSpeed: json.wind.speed,
            maxTemperature: json.main.temp_max,
            humidity: json.main.humidity,
            weatherMain: json.weather[0].main
        });
    }

    apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURI(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`;
    results = await fetch(apiUrl);
    json = await results.json();

    console.log(json.cod);

    if (parseInt(json.cod) === 200) {
        showForecastInfo(json.list.slice(0, 6));
        show5DayInfo(json.list);
    }
});

function showTodayInfo(json) {
    const regionNames = new Intl.DisplayNames(['pt-br'], { type: 'region' });

    document.querySelector("#city").innerHTML = json.city;
    document.querySelector("#country").innerHTML = regionNames.of(json.country);
    document.querySelector("#temperature").innerHTML = `${(json.temperature)}°C`;
    document.querySelector("#real-feel").innerHTML = `${(json.feelsLike)}°C`;
    document.querySelector("#wind-speed").innerHTML = `${json.windSpeed} km/h`;
    document.querySelector("#max-temperature").innerHTML = `${(json.maxTemperature)}°C`;
    document.querySelector("#humidity").innerHTML = `${json.humidity}%`;

    bigIcon = document.getElementById("big-icon");
    switch (json.weatherMain) {
        case "Clear":
            bigIcon.src = "assets/images/sunny.png";
            break;

        case "Rain":
            bigIcon.src = "assets/images/rain-cloud.png";
            break;
        
        case "Clouds":
            bigIcon.src = "assets/images/cloud.png";
            break;
    }
}

function showForecastInfo(list) {
    list.forEach((element, index) => {
        
        let icon = getIcon(element.weather[0].main);
        
        const forecastClassName = "forecast-0" + (index + 1);
        document.querySelector(`#${forecastClassName}`).innerHTML = `${timeLabels[index]} <br> ${icon} <br> ${(element.main.temp)}°C`;
    });
}

function show5DayInfo(list) {
    for (let i = 0; i < list.length; i += 8) {
        const element = list[i];
        console.log(element);

        const date = new Date(element.dt_txt.slice(0, 10));
        const dayClassName = "day-0" + ((i / 8) + 1);
        const temperature = element.main.temp;
        console.log(i / 8)
        document.querySelector(`#${dayClassName}`).innerHTML = `${dayLabels[i / 8]} <br> ${getIcon(element.weather[0].main)} <br> ${temperature}°C`;
        console.log(date.getDay());
    }
}

function getIcon(value) {
    switch (value) {
        case "Clear":
            return "<i class=\"fa-solid fa-sun\"></i>";
        case "Rain":
            return "<i class=\"fa-solid fa-cloud-rain\"></i>";
        case "Clouds":
            return "<i class=\"fa-solid fa-cloud\"></i>";
    }
}