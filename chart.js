/* Import ChartJS lib */
import Chart from "chart.js/auto";

/* Plot the weather data */
export function renderChart({ daily_chart }) {
  /* Formatter */
  const DAY_FORMATTER_CHART = Intl.DateTimeFormat(undefined, {
    weekday: "short",
  });

  /* Chart Container div */
  const chartDiv = document.querySelector("div.chart");
  chartDiv.innerHTML = "";
  /* Template */
  const chartCanvasTemplate = document.getElementById("chart-canvas-template");
  /* Clone the template node */
  const element = chartCanvasTemplate.content.cloneNode(true);
  /* Append to DOM */
  chartDiv.append(element);

  /* Build the day chart */
  const ctx = document.getElementById("day-chart-canvas");
  /* New chart object */
  new Chart(ctx, {
    plugins: [
      {
        afterDraw: (chart) => {
          if (chart.tooltip?._active?.length) {
            let x = chart.tooltip._active[0].element.x;
            let yAxis = chart.scales.A;
            let ctx = chart.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, yAxis.top);
            ctx.lineTo(x, yAxis.bottom);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
            ctx.stroke();
            ctx.restore();
          }
        },
      },
    ],
    type: "line",
    data: {
      labels: daily_chart.time.map((x) =>
        DAY_FORMATTER_CHART.format(new Date(x))
      ),
      datasets: [
        {
          label: "Max. Temperature",
          yAxisID: "A",
          data: daily_chart.temperature_2m_max,
          borderWidth: 2,
          borderColor: "darkblue",
        },
        {
          label: "Min. Temperature",
          yAxisID: "A",
          data: daily_chart.temperature_2m_min,
          borderWidth: 2,
          borderColor: "DarkSlateBlue",
        },
        {
          label: "Max. FL Temperature",
          yAxisID: "A",
          data: daily_chart.apparent_temperature_max,
          borderWidth: 2,
          borderColor: "LightSlateGray",
        },
        {
          label: "Min. FL Temperature",
          yAxisID: "A",
          data: daily_chart.apparent_temperature_min,
          borderWidth: 2,
          borderColor: "LightSteelBlue",
        },
        {
          label: "Precipitation",
          yAxisID: "B",
          data: daily_chart.precipitation_sum,
          borderWidth: 2,
          borderColor: "SteelBlue",
        },
      ],
    },
    options: {
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        title: {
          display: true,
          text: "Daily weather",
        },
      },
      scales: {
        A: {
          title: {
            display: true,
            text: "Temperature in Celsius",
          },
          type: "linear",
          position: "left",
        },
        B: {
          title: {
            display: true,
            text: "Precipitation in cm",
          },
          type: "linear",
          position: "right",
        },
      },
    },
  });
}
