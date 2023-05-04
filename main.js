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
        marketCaps.push(parseFloat(crypto.marketCapUsd).toFixed(2));
        volume.push(parseFloat(crypto.volumeUsd24Hr).toFixed(2));
        prices.push(parseFloat(crypto.priceUsd).toFixed(2));
        explorers.push(crypto.explorer);
      });
      createRowsAndColumns();
    });
}
//creates each row and column of the table and attaches the data to each cell.
function createRowsAndColumns() {
  for (let i = 0; i < ranks.length; i++) {
    const tableRow = createElement("tr");
    tableRow.id = `row${rowIndex++}`;
    tableBody.appendChild(tableRow);
    const rowData = [ranks[i], names[i], symbols[i], marketCaps[i], volume[i], prices[i], explorers[i]];
    for (let j = 0; j < rowData.length; j++) {
      const tableData = createElement("td");
      const columnClass = tableHeadRow.children[j].classList[0]
      tableData.classList.add(columnClass)
      if(j === rowData.length -1 ){
        const explorerLink = createElement('a')
        explorerLink.href = rowData[j]
        explorerLink.textContent = rowData[j]
        explorerLink.target = "_blank"
        tableData.appendChild(explorerLink)
      } else {
      tableData.textContent = rowData[j];
    }
    tableRow.appendChild(tableData);
    }
  }
}
//I dont know if this is needed. Feels kind of useless since it only cuts out the word, document, from the norm way.
const createElement = (element) => document.createElement(element);

//Execute functions
createTableHeaders();