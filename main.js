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
let rowIndex = 1;

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
//creates and appends headers for each element in the properties array above.
  function createHeaders(property) {
    const tableHeaders = createElement("th");
    const attributeProperty = `${property.toLowerCase().replace(/\s+/g, "-")}`;
    tableHeaders.textContent = property;
    tableHeaders.id = `${attributeProperty}-header`;
    tableHeaders.classList = `${attributeProperty}-column`;
    tableHeadRow.appendChild(tableHeaders);
  }
  fetchTopTenCryptos();
}
//fetches data from the api and pushes the wanted data to a global variable to be accessed later
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
      createRowsandColumns();
    });
}
//creates each row and column of the table and attaches the data to each cell.
function createRowsandColumns() {
  for (let i = 0; i < ranks.length; i++) {
    const tableRow = createElement("tr");
    tableRow.id = `row${rowIndex++}`;
    tableBody.appendChild(tableRow);
    const rowData = [ranks[i], names[i], symbols[i], marketCaps[i], volume[i], prices[i], explorers[i]];
    for (let j = 0; j < rowData.length; j++) {
      const tableData = createElement("td");
      tableData.textContent = rowData[j];
      tableRow.appendChild(tableData);
    }
  }
}
//I dont know if needed but felt it was nice to have a function to create elements. Feels kind of useless since it onle cuts out the word document from the equation.
const createElement = (element) => document.createElement(element);

//Execute functions
createTableHeaders();