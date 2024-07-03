const form = document.getElementById("form");
form.addEventListener("submit", fetchData);

const wrapper = document.getElementById("wrapper");
let grid;

const newSearchBtn = document.getElementById("new-search");
newSearchBtn.addEventListener("click", () => location.reload());

async function fetchData(event) {
  event.preventDefault();
  wrapper.innerHTML = null;
  const searchBy = event.target[0].value;
  const searchText = event.target[1].value;

  const URL = `https://restcountries.com/v3.1/${searchBy}/${searchText}?fields=name,capital,population,flags`;

  try {
    const response = await fetch(URL);

    const data = await response.json();

    if(data.message === "Not Found") {wrapper.innerHTML = "no countries matched the search"
        throw new Error(`HTTP error! Status: ${response.status}`);
    };

    const sortedData = data.sort((a, b) => b.population - a.population);

    grid ? updateData(sortedData) : displayData(sortedData);
    displayData(sortedData);
  } catch (error) {
    if (error instanceof TypeError) {
        if(error.message.includes("NetworkError")) {
            wrapper.innerHTML = "Something went wrong, check if you have connection and reload the page"
        }
        console.error("TypeError", error);
    }else if (error instanceof ReferenceError) {
        wrapper.innerHTML = "Something went wrong, check if you have connection and reload the page"
        console.error("ReferenceError", error);
    } else {
      console.error("Error fetching data:", error);
    }
  }
}

function displayData(countriesData) {
  grid = new gridjs.Grid({
    columns: ["Name", "Capital", "Population", "Flag"],
    data: countriesData.map((countryData) => [
      countryData.name.official,
      countryData?.capital?.[0] || "No capital",
      countryData.population,
      gridjs.html(
        `<img src="${countryData.flags.png}" alt="Flag of ${countryData.name.official}" style="width: 50px;"/>`
      ),
    ]),
    pagination: true,
    sort: true,
  }).render(wrapper);
}

function updateData(countriesData) {
  setTimeout(() => {
    grid
      .updateConfig({
        data: countriesData.map((countryData) => [
          countryData.name.official,
          countryData?.capital?.[0] || "No capital",
          countryData.population,
          gridjs.html(
            `<img src="${countryData.flags.png}" alt="Flag of ${countryData.name.official}" style="width: 50px;"/>`
          ),
        ]),
      })
      .forceRender();
  }, 400);
}
