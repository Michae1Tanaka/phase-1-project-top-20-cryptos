//On content load, create table headers and table content based on api data
document.addEventListener("DOMContentLoaded", createTableHeaders);


//Global variables
const topTenCryptoApi = "https://api.coincap.io/v2/assets?limit=10";
const elevenThroughTwentyCryptoApi =
  "https://api.coincap.io/v2/assets?limit=10&offset=10";
const tableHeadRow = document.getElementById("table-head-row");


//Callback Functions
function createTableHeaders() {
    const properties = [
        "Rank",
        "Name",
        "Symbol",
        "Market Cap",
        "Volume 24Hr",
        "Price",
        "Explorer",
      ];
  properties.forEach((property) => {
      const tableHeaders = document.createElement("th");
      tableHeaders.textContent = property;
      tableHeaders.id = `${property.toLowerCase().replace(/\s+/g,"-")}-header`
      tableHeadRow.appendChild(tableHeaders);
    });
}

// fetch(elevenThroughTwentyCryptoApi).then(r=>r.json()).then(crypto=>console.log(crypto))