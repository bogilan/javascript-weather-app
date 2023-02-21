const weatherForecastURL = 'https://api.weatherapi.com/v1/forecast.json?key=9415c5aecbad4810a78201126232102&q=';

const searchCity = document.getElementById('search-city');
const searchBtn = document.querySelector('.search-btn');

const cityName = document.querySelector('.location-name');
const cityTemp = document.querySelector('.current-temp');
const weatherIcon = document.querySelector('.current-weather-icon');
const weatherCondition = document.querySelector('.current-weather-desc');
const datetime = document.querySelector('.date-time');

document.addEventListener("DOMContentLoaded", ()=> {
  getWeatherData('London');
});

searchBtn.addEventListener('click', ()=> {
  getWeatherData(searchCity.value);
})


async function getWeatherData(city) {
  try {
      const res = await fetch(`${weatherForecastURL}${city}`);
      const data = await res.json();

      cityName.textContent = data.location.name;
      cityTemp.textContent = data.current.temp_c;
      weatherIcon.src = data.current.condition.icon;
      weatherCondition.textContent = data.current.condition.text;
      datetime.textContent = data.location.localtime;


  }
  catch(error) {
      alert('Failed to find, please try again.')
  }
}
