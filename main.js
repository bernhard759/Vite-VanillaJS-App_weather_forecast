/* Import */
import { getWeather } from "./weather";
import { renderChart } from "./chart";
import { ICON_MAP } from "./iconMap";

/* Get the user location */
navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

/* User location promise callback functions */
/** get the weather data from the API */
function positionSuccess({ coords }) {
  /* Get the weather data */
  getWeather(
    coords.latitude,
    coords.longitude,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )
    /* Render the weather data */
    .then(renderWeather)
    .catch((e) => {
      console.error(e);
    })
    /* Render the chart */
    .then(renderChart)
    .catch((e) => {
      console.error(e);
    });
}
/** Log and alert an error message */
function positionError() {
  console.error("There was an error getting your location");
  alert("there was an error getting your location.");
}

/** Render the weather data to the UI */
function renderWeather({ current, daily, daily_chart, hourly }) {
  /* Render the weather data using the HTML templates */
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);
  /* Add Eventlisteners */
  document.querySelectorAll(".day-card").forEach((card) => {
    card.addEventListener("click", function () {
      const mustFilter = setSelected(card);
      if (mustFilter) {
        filterHourlyWeather(card.querySelector(".day-card-day").textContent);
        document.querySelector("div.filter-tag").textContent =
          card.querySelector(".day-card-day").textContent;
      } else {
        /* Display all entries */
        document.querySelectorAll("tr.hour-row").forEach((hourRow) => {
          hourRow.style.display = "";
        });
        document.querySelector("div.filter-tag").textContent = "all days";
      }
    });
    card.addEventListener("touchend", function () {
      const mustFilter = setSelected(card);
      if (mustFilter) {
        filterHourlyWeather(card.querySelector(".day-card-day").textContent);
        document.querySelector("div.filter-tag").textContent =
          card.querySelector(".day-card-day").textContent;
      } else {
        /* Display all entries */
        document.querySelectorAll("tr.hour-row").forEach((hourRow) => {
          hourRow.style.display = "";
        });
        document.querySelector("div.filter-tag").textContent = "all days";
      }
    });
  });
  /* Remove loading class */
  document.body.classList.remove("loading");
  document.querySelector(".loading-overlay").style.display = "none";
  /* Return daily data for the chart */
  return { daily_chart };
}

/**  Query the DOM and set the textContent of a Node */
function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
}

/** Return the Icon path from the Code */
function getIconUrl(iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`;
}

/* Formatter and DOM Elements */
const TODAY_FORMATTER = Intl.DateTimeFormat(undefined, { weekday: "long" });
/* Current icon */
const currentIcon = document.querySelector("[data-current-icon");

/**  Render the current weather dsata to the UI */
function renderCurrentWeather(current) {
  setValue("today", TODAY_FORMATTER.format(current.time));
  currentIcon.src = getIconUrl(current.iconCode);
  setValue("current-temp", current.currentTemp);
  //document.querySelector("[data-current-temp]").textContent = current.currentTemp;
  setValue("current-high", current.highTemp);
  setValue("current-low", current.lowTemp);
  setValue("current-fl-high", current.highFeelsLike);
  setValue("current-fl-low", current.lowFeelsLike);
  setValue("current-wind", current.windSpeed);
  setValue("current-precip", current.precip);
}

/* Formatter and DOM Elements */
const DAY_FORMATTER = Intl.DateTimeFormat(undefined, { weekday: "long" });
const dailySection = document.querySelector("[data-day-div]");
const dayCardTemplate = document.getElementById("day-card-template");

/**  Render the daily weather data to the UI */
function renderDailyWeather(daily) {
  console.log("daily", daily);
  dailySection.innerHTML = "";
  daily.forEach((day) => {
    /* Clone the template node */
    const element = dayCardTemplate.content.cloneNode(true);
    setValue("temp", day.maxTemp, { parent: element });
    setValue("day", DAY_FORMATTER.format(day.timestamp), { parent: element });
    element.querySelector("[data-icon]").src = getIconUrl(day.iconCode);
    /* Append to DOM */
    dailySection.append(element);
  });
}

/* Formatter and DOM Elements */
const HOUR_FORMATTER = Intl.DateTimeFormat(undefined, { hour: "numeric" });
const hourlySection = document.querySelector("[data-hour-section]");
const hourRowTemplate = document.getElementById("hour-row-template");

/**  Render the hourly weather data to the UI */
function renderHourlyWeather(hourly) {
  hourlySection.innerHTML = "";
  console.log(hourly);
  hourly.forEach((hour) => {
    /* Clone the template node */
    const element = hourRowTemplate.content.cloneNode(true);
    setValue("temp", hour.temp, { parent: element });
    setValue("fl-temp", hour.feelsLike, { parent: element });
    setValue("wind", hour.windSpeed, { parent: element });
    setValue("precip", hour.precip, { parent: element });
    setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element });
    setValue("time", HOUR_FORMATTER.format(hour.timestamp), {
      parent: element,
    });
    element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode);
    hourlySection.append(element);
  });
}

/**  Filter the hourly weather data displayed in the table */
function filterHourlyWeather(filterDay) {
  document.querySelectorAll("tr.hour-row").forEach((hourRow) => {
    /* Filter on clicked day */
    if (
      hourRow.querySelector("[data-day]").textContent.toLowerCase() ==
      filterDay.toLowerCase()
    ) {
      hourRow.style.display = "";
    } else {
      hourRow.style.display = "none";
    }
  });
}

/** Add the selected class to the day card */
function setSelected(card) {
  if (card.classList.contains("selected")) {
    card.classList.remove("selected");
    return false;
  }
  document.querySelectorAll(".day-card").forEach((card) => {
    card.classList.remove("selected");
  });
  card.classList.add("selected");
  return true;
}
