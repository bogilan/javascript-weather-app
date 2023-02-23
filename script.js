const weatherForecastURL = 'https://api.weatherapi.com/v1/forecast.json?key=9415c5aecbad4810a78201126232102&q=';

const searchCityInput = document.getElementById('search-city-input');
const searchBtn = document.querySelector('.search-btn');

const cityNameEl = document.querySelector('.location-name');
const cityTempEl = document.querySelector('.current-temp');
const weatherIconEl = document.querySelector('.current-weather-icon');
const weatherConditionEl = document.querySelector('.current-weather-desc');
const datetimeEl = document.querySelector('.date-time');
const airQualityIndexEl = document.querySelector('.air-quality-index');

const currentForecastEl = document.querySelector('.current-forecast');
const daysForecastEl = document.querySelector('.days-forecast');
const hourlyForecastEl = document.querySelector('.hourly-forecast');

document.addEventListener("DOMContentLoaded", ()=> {
  getWeatherData('London');
});

searchBtn.addEventListener('click', ()=> {
  getWeatherData(searchCityInput.value);
})

async function getWeatherData(city) {
  try {
      const res = await fetch(`${weatherForecastURL}${city}&aqi=yes&days=8`);
      const data = await res.json();

      cityNameEl.textContent = data.location.name;
      cityTempEl.innerHTML = `${data.current.temp_c} &#8451;`;
      weatherIconEl.src = data.current.condition.icon;
      weatherConditionEl.textContent = data.current.condition.text;
      datetimeEl.textContent = data.location.localtime;
      airQualityIndexEl.textContent = data.current.air_quality["us-epa-index"];

      getHourlyForecast(data);

      get7DayForecast(data);

  }
  catch(error) {
      alert('Failed to find, please try again.')
  }
}

function getHourlyForecast(data) {
  hourlyForecastEl.innerHTML = '<h2>Rest of the Day</h2>';
  const localtime = new Date(data.location.localtime);
  const hour = localtime.getHours();
  
  for(let hourIndex = hour + 1; hourIndex < 24; hourIndex++) {
    const hourData = data.forecast.forecastday[0].hour[hourIndex];
    const { temp_c, condition: { text } } = hourData;
    const hourHTML = `<div class="hour-forecast">
                        <span class="hour">${hourIndex}:00</span>
                        <span class="temp">${temp_c} &#8451;</span>
                        <span class="condition">${text}</span>
                      </div>`;
    hourlyForecastEl.innerHTML += hourHTML;
  }
}

function get7DayForecast(data) {
  daysForecastEl.innerHTML = '<h2>7 Days Forecast</h2>';

  for(let dayIndex = 1; dayIndex < 8; dayIndex++) {
    const dayData = data.forecast.forecastday[dayIndex];
    const { date, day: { avgtemp_c } } = dayData;
    const dayHTML = `<div class="day">
                        <span class="day-date">${date}</span>
                        <span class="temp">${avgtemp_c} &#8451;</span>
                      </div>`
    daysForecastEl.innerHTML += dayHTML;
  }
}
