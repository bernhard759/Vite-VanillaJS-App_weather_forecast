/* Import */
import axios from "axios";

/* Ajax Request to get the weather data */
export function getWeather(lat, lon, timezone) {
  return axios
    .get(
      "https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true",
      {
        params: {
          latitude: lat,
          longitude: lon,
          timezone,
        },
      }
    )
    .then(({ data }) => {
        console.log(data)
      return {
        current: parseCurrentWeather(data),
        daily: parseDailyWeather(data),
        hourly: parseHourlyWeather(data)
      };
    });
}

/** Parse the current weather data returned from the API call */
function parseCurrentWeather({ current_weather, daily }) {
  const {
    temperature: currentTemp,
    time: time,
    windspeed: windSpeed,
    weathercode: iconCode,
  } = current_weather;
  const {
    temperature_2m_max: [maxTemp],
    temperature_2m_min: [minTemp],
    apparent_temperature_max: [maxFeelsLike],
    apparent_temperature_min: [minFeelsLike],
    precipitation_sum: [precip],
  } = daily; // this is the same as const maxTemp = daily.temperature_2m_max[0]
  return {
    currentTemp: Math.round(currentTemp),
    time: new Date(time),
    highTemp: Math.round(maxTemp),
    lowTemp: Math.round(minTemp),
    highFeelsLike: Math.round(maxFeelsLike),
    lowFeelsLike: Math.round(minFeelsLike),
    windSpeed: Math.round(windSpeed),
    precip: Math.round(precip * 100) / 100,
    iconCode,
  };
}

/** Parse the daily weather data returned from the API call */
function parseDailyWeather({ daily }) {
  return daily.time.map((time, index) => {
    return {
      timestamp: new Date(time),
      iconCode: daily.weathercode[index],
      maxTemp: Math.round(daily.temperature_2m_max[index]),
    };
  });
}

/** Parse the hourly weather data returned from the API call */
function parseHourlyWeather({ hourly, current_weather }) {
  return hourly.time.map((time, index) => {
    //console.log("hour", new Date(time))
    return {
      timestamp: new Date(time),
      iconCode: hourly.weathercode[index],
      temp: Math.round(hourly.temperature_2m[index]),
      feelsLike: Math.round(hourly.apparent_temperature[index]),
      windSpeed: Math.round(hourly.windspeed_10m[index]),
      precip: Math.round(hourly.precipitation[index]*100)/100,
    };
  }).filter(({ timestamp }) => timestamp.valueOf() >= new Date(current_weather.time).valueOf())
}
