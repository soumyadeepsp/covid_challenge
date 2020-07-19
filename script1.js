const country1Default = "Ireland";
const country2Default = "Ukraine";

function fetchData(url) {
  return fetch(url).then((response) => {
    if (response.status != 200) {
      throw new Error(`Unexpected response status: ${response.status}`);
    } else {
      return response.json();
    }
  });
}
function downloadData() {
  const primaryDataUrl = "https://coronavirus-tracker-api.herokuapp.com/all";
  const backupDataUrl = "https://gentle-peak-51697.herokuapp.com/all";
  return fetchData(primaryDataUrl).catch((error) => {
    console.log(error);
    console.warn(
      `Fetching data from primary API (${primaryDataUrl}) failed so attempting to use backup API (${backupDataUrl}).`
    );
    return fetchData(backupDataUrl).catch((error) => {
      console.log(error);
      console.error(`Fetching data failed.`);
    });
  });
}

function setupSelections(chartConfig, rawData) {
  const confirmedRadio = document.getElementById("confirmed");
  const deathsRadio = document.getElementById("deaths");
  const country1Select = document.getElementById("country1");
  const country2Select = document.getElementById("country2");

  const addChangeListener = (element) => {
    element.addEventListener("change", (event) => {
      updateChart(chartConfig, rawData, country1Select, country2Select);
    });
  };

  addChangeListener(confirmedRadio);
  addChangeListener(deathsRadio);

  // Note: We're using rawData.confirmed to construct select lists even though the user can specify deaths.
  const countries = rawData.confirmed.locations
    .filter((l) => !l.province)
    .map((l) => l.country)
    .sort((a, b) => a.localeCompare(b));

  for (let countryName of countries) {
    const el = document.createElement("option");
    el.textContent = countryName;
    el.value = countryName;
    const el2 = el.cloneNode(true);

    if (el.value == country1Default) {
      el.setAttribute("selected", "selected");
    }

    if (el2.value == country2Default) {
      el2.setAttribute("selected", "selected");
    }

    country1Select.appendChild(el);
    country2Select.appendChild(el2);
  }

  addChangeListener(country1Select);
  addChangeListener(country2Select);

  return { country1Select, country2Select };
}

function setupChart() {
  // Set the dimensions and margins of the graph
  const margin = { top: 30, right: 150, bottom: 30, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  const containerWidth = width + margin.left + margin.right,
    containerHeight = height + margin.top + margin.bottom;

  // Setup ranges
  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  // Append the svg object to the body of the page
  var svg = d3
    .select(".chart")
    .classed("svg-container", true)
    .append("svg")
    .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  return { svg, x, y, width, height };
}

function gatherChartData(rawData, type, country1, country2) {
  const sourceData = rawData[type];

  let maxDate = null;
  let maxCount = null;

  const countries = [country1, country2].map((country) => {
    const countryData = sourceData.locations.find(
      (d) => d.country == country && !d.province
    ).history;
    const data = Object.keys(countryData)
      .map((k) => {
        const date = d3.timeParse("%m/%d/%y")(k);
        const count = +countryData[k];

        if (!maxDate || maxDate < date) {
          maxDate = date;
        }

        if (!maxCount || maxCount < count) {
          maxCount = count;
        }

        return { date, count };
      })
      .sort((a, b) => a.date - b.date);

    return { country, data };
  });

  const chartData = { maxDate, maxCount, countries };

  console.log(chartData);

  return chartData;
}

function renderData(chartConfig, chartData) {
  // Remove any previous lines
  d3.selectAll("g > *").remove();

  // Scale the range of the data
  chartConfig.x.domain(
    d3.extent(chartData.countries[0].data, function (d) {
      return d.date;
    })
  );
  chartConfig.y.domain([0, chartData.maxCount]);

  // Add line for each country
  for (let i = 0; i < chartData.countries.length; i++) {
    const countryData = chartData.countries[i].data;

    // Build the line
    const line = d3
      .line()
      .x(function (d) {
        return chartConfig.x(d.date);
      })
      .y(function (d) {
        return chartConfig.y(d.count);
      });

    // Add the line to the chart
    chartConfig.svg
      .append("path")
      .data([countryData])
      .attr("class", `line country${(i + 1).toString()}`)
      .attr("d", line);

    // Add legend
    chartConfig.svg
      .append("text")
      .attr(
        "transform",
        "translate(" +
          (chartConfig.width + 3) +
          "," +
          chartConfig.y(countryData[countryData.length - 1].count) +
          ")"
      )
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .attr("class", `legend country${(i + 1).toString()}`)
      .text(
        `${chartData.countries[i].country} (${chartData.countries[i].data[
          chartData.countries[i].data.length - 1
        ].count.toLocaleString()})`
      );
  }

  // Add the x axis
  chartConfig.svg
    .append("g")
    .attr("transform", "translate(0," + chartConfig.height + ")")
    .call(d3.axisBottom(chartConfig.x));

  // Add the y axis
  chartConfig.svg.append("g").call(d3.axisLeft(chartConfig.y));
}

function updateChart(chartConfig, rawData, country1Select, country2Select) {
  const type = document.querySelector('input[name="type"]:checked').value;
  const country1 = country1Select.options[country1Select.selectedIndex].value;
  const country2 = country2Select.options[country2Select.selectedIndex].value;

  const chartData = gatherChartData(rawData, type, country1, country2);

  renderData(chartConfig, chartData);
}

document.addEventListener("DOMContentLoaded", (event) => {
  downloadData().then((rawData) => {
    const chartConfig = setupChart();
    const { country1Select, country2Select } = setupSelections(
      chartConfig,
      rawData
    );

    // Initially render the chart
    updateChart(chartConfig, rawData, country1Select, country2Select);

    document.body.classList.add("loaded");
  });
});