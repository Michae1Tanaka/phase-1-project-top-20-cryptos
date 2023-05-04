//On content load, create table headers and table content based on api data
document.addEventListener("DOMContentLoaded", createTableHeaders);

//Global variables
const topTenCryptoApi = "https://api.coincap.io/v2/assets?limit=10";
const elevenThroughTwentyCryptoApi =
  "https://api.coincap.io/v2/assets?limit=10&offset=10";
const tableHeadRow = document.getElementById("table-head-row");
const tableBody = document.getElementById("main-table-body");
const ranks = [];
const names = [];
const symbols = [];
const marketCaps = [];
const volume = [];
const prices = [];
const explorers = [];

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
  properties.forEach(createHeaders);

  function createHeaders(property) {
    const attributeProperty = `${property.toLowerCase().replace(/\s+/g, "-")}`;
    const tableHeaders = document.createElement("th");
    tableHeaders.textContent = property;
    tableHeaders.id = `${attributeProperty}-header`;
    tableHeaders.classList = `${attributeProperty}-column`;
    tableHeadRow.appendChild(tableHeaders);
  }
  fetchTopTenCryptos();
}

function fetchTopTenCryptos() {
  fetch(topTenCryptoApi)
    .then((r) => r.json())
    .then((cryptoArrs) => {
      const cryptoObjs = cryptoArrs.data;
      cryptoObjs.forEach((crypto) => {
        ranks.push(crypto.rank);
        names.push(crypto.name);
        symbols.push(crypto.symbol);
        marketCaps.push(crypto.marketCapUsd);
        volume.push(crypto.volumeUsd24Hr);
        prices.push(crypto.priceUsd);
        explorers.push(crypto.explorer);
      });
      createRankColumn()
    });
}
function createRankColumn (){
  
  ranks.forEach(rank=>{
    const tableRow = document.createElement("tr");
    const tableData = document.createElement("td");
    tableData.textContent = rank
tableRow.appendChild(tableData)
tableBody.appendChild(tableRow)
  })
}
