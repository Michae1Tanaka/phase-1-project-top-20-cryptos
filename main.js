document.addEventListener("DOMContentLoaded", createTableHeaders);
// Global variables
const topTwentyCryptoApi = "https://api.coincap.io/v2/assets?limit=20";
const tableHeadRow = document.getElementById("table-head-row");
const tableBody = document.getElementById("main-table-body");
const showTenBtn = document.getElementById("extend-button");
const compareForm = document.getElementById("compare-form")
let rowIndex = 1;
let tableExpanded = false;

//Executable Functions

function refreshTable() {
  fetchTopTwentyCryptos().then((topTwentyCryptosArr) => {
    // Clear the existing table body
    while (tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }
    rowIndex = 1;
    //creates rows and columns of table after refresh of data comes in
    createRowsAndColumns(topTwentyCryptosArr);

    //changes color of percent change text so when its positive its green and red when negative
    const percentChangeTableRows = document.querySelectorAll(
      "td.percent-change-24hr-column"
    );
    for (let i = 0; i < percentChangeTableRows.length; i++) {
      let percentChangeAsNumber = parseFloat(
        percentChangeTableRows[i].textContent,
        10
      );
      if (percentChangeAsNumber < 0) {
        percentChangeTableRows[i].classList.remove("green");
        percentChangeTableRows[i].classList.add("red");
      } else {
        percentChangeTableRows[i].classList.remove("red");
        percentChangeTableRows[i].classList.add("green");
      }
    }
  });
}

// Callback Functions
//creates table headers
function createTableHeaders() {
  const properties = [
    "Rank",
    "Name",
    "Symbol",
    "Price",
    "Percent Change 24Hr",
    "Market Cap",
    "Explorer",
  ];

  properties.forEach((property) => {
    const tableHeaders = document.createElement("th");
    const attributeProperty = `${property.toLowerCase().replace(/\s+/g, "-")}`;
    tableHeaders.textContent = property;
    tableHeaders.id = `${attributeProperty}-header`;
    tableHeaders.classList = `${attributeProperty}-column`;
    tableHeadRow.appendChild(tableHeaders);
  });
}
//fetches data of top twenty cryptos
function fetchTopTwentyCryptos() {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  return fetch(topTwentyCryptoApi, requestOptions)
    .then((r) => r.json())
    .then((topTwentyCryptosArr) => {
      const cryptoObj = topTwentyCryptosArr.data;
      return cryptoObj.map((crypto) => ({
        rank: crypto.rank,
        name: crypto.name,
        symbol: crypto.symbol,
        price: formatPrice(crypto.priceUsd),
        percentChange: parseFloat(crypto.changePercent24Hr).toFixed(2) + "%",
        marketCap: formatMarketCap(crypto.marketCapUsd),
      }));
    });
}

//creates a table row for each category that is being tracked
function createRowsAndColumns(topTwentyCryptosArr) {
  topTwentyCryptosArr.forEach((crypto) => {
    const tableRow = document.createElement("tr");
    tableRow.id = `row${rowIndex++}`;
    if (`${rowIndex}` > 11 && !tableExpanded) {
      tableRow.classList.add("hidden");
      tableRow.classList.add('default')
      
    } else if (`${rowIndex}` > 11 && tableExpanded) {
      tableRow.classList.add('default')
    }
    tableBody.appendChild(tableRow);
    const rowData = [
      crypto.rank,
      crypto.name,
      crypto.symbol,
      crypto.price,
      crypto.percentChange,
      crypto.marketCap,
      crypto.explorer,
    ];
    //Inputs the Data collected into the table
    rowData.forEach((cellData, index) => {
      const tableData = document.createElement("td");
      const columnClass = tableHeadRow.children[index].classList[0];
      tableData.id = `${tableRow.id}-column${++index}`;

      tableData.classList.add(columnClass);

      if (index === rowData.length) {
        const explorerLink = document.createElement("a");
        explorerLink.href = cellData;
        explorerLink.textContent = `${crypto.name} Explorer`;
        explorerLink.target = "_blank";
        tableData.appendChild(explorerLink);
      } else {
        tableData.textContent = cellData;
      }
      tableRow.appendChild(tableData);
    });
  });
}
//Event Handlers

//when btn is pressed, cryptos 11-20 will show
function showTenBtnHandler(e) {
  const hiddenRows = document.querySelectorAll(".default");
  hiddenRows.forEach((cryptoRow) => {
    cryptoRow.classList.toggle("hidden");
  });
  if (e.target.textContent === "Show 10 More"){
    e.target.textContent = 'Hide 10'
    tableExpanded = true
  } else{
    e.target.textContent = 'Show 10 More'
    tableExpanded = false
  }
}
function compareBtnHandler(e){
  e.preventDefault()
  console.log('I am an ETH Maxi')
}
//Helper Functions
function createCellId(columnIndex, rowIndex) {
  return `cell-row${rowIndex}-column${columnIndex}`;
}
function formatMarketCap(marketCapData) {
  return (
    "$" +
    parseFloat(marketCapData / 10000000000).toLocaleString("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) +
    "b"
  );
}

function formatPrice(priceData) {
  return (
    "$" +
    parseFloat(priceData).toLocaleString("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}
//Event Listeners
compareForm.addEventListener('submit',compareBtnHandler)
showTenBtn.addEventListener("click", showTenBtnHandler);
// Execute functions
refreshTable();
setInterval(refreshTable, 5000);
