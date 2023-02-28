const weatherForecastURL = 'https://api.weatherapi.com/v1/forecast.json?key=9415c5aecbad4810a78201126232102&q=';

const weekDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const airQuality = [
  'good',
  'moderate',
  'unhealthy for sensitive group',
  'unhealthy',
  'very unhealthy',
  'hazardous'
]

const searchCityInput = document.getElementById('search-city-input');
const searchBtn = document.querySelector('.search-btn');

const locationEl = document.querySelector('.location-name');
const cityTempEl = document.querySelector('.current-temp');
const weatherIconEl = document.querySelector('.current-weather-icon');
const weatherConditionEl = document.querySelector('.current-weather-desc');
const datetimeEl = document.querySelector('.date-time');
const airQualityEl = document.querySelector('.air-quality p');
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

searchCityInput.addEventListener('keydown', (e)=> {
	if (e.keyCode === 13) {
        e.preventDefault();
        getWeatherData(searchCityInput.value);
    }
})

async function getWeatherData(city) {
  try {
      const res = await fetch(`${weatherForecastURL}${city}&aqi=yes&days=8`);
      const data = await res.json();

      locationEl.innerHTML = `${data.location.name}<br>${data.location.country}`;
      cityTempEl.innerHTML = `${formatTemp(data.current.temp_c)} &#8451;`;

      const localdatetime = new Date(data.location.localtime);
      const weekDay = localdatetime.getDay();
      const dateDay = localdatetime.getDate();
      const dateMonth = localdatetime.getMonth();
      const hours = String(localdatetime.getHours()).padStart(2, '0');
      const minutes = String(localdatetime.getMinutes()).padStart(2, '0');
      datetimeEl.textContent = `${getDayName(weekDay)} - ${getMonthName(dateMonth)} ${dateDay}. - ${hours}:${minutes}`;

      weatherIconEl.src = data.current.condition.icon;
      weatherConditionEl.textContent = data.current.condition.text;

      const airQualityIndex = data.current.air_quality["us-epa-index"];
      airQualityIndexEl.textContent = getAirQuality(airQualityIndex);
      appendAirQualityClass(airQualityIndexEl.textContent);

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
    const { temp_c, condition: { text }, condition: {icon} } = hourData;
    const hourHTML = `<div class="hour-forecast">
                        <span class="hour">${String(hourIndex).padStart(2, '0')}:00</span>
                        <span class="temp">${formatTemp(temp_c)} &#8451;</span>
                        <span class="condition">${text}</span>
                        <img src="${icon}">
                      </div>`;
    hourlyForecastEl.innerHTML += hourHTML;
  }
}

function get7DayForecast(data) {
  daysForecastEl.innerHTML = '<h2>7 Days Forecast</h2>';

  for(let dayIndex = 1; dayIndex < 8; dayIndex++) {
    const dayData = data.forecast.forecastday[dayIndex];
    const { date, day: { avgtemp_c }, day: {condition} } = dayData;
    const weeklocaldate = new Date(date);
    const day = weeklocaldate.getDate();
    const month = weeklocaldate.getMonth();
    const dayHTML = `<div class="day">
                        <span class="day-date">${getMonthName(month)} ${day}.</span>
                        <span class="temp">${formatTemp(avgtemp_c)} &#8451;</span>
                        <span class="condition">${condition.text}</span>
                        <img src="${condition.icon}">
                      </div>`
    daysForecastEl.innerHTML += dayHTML;
  }
}

function getDayName(day) {
  return weekDays[day];
}

function getMonthName(month) {
  return months[month];
}

function getAirQuality(index) {
	return airQuality[index-1];
}

function appendAirQualityClass(name) {
	airQualityEl.className = `${name.replace(/ /g, '-')}`;
}

function formatTemp(temp) {
  return temp.toFixed(0);
}