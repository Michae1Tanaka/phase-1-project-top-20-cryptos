// Global variables
const topTenCryptoApi = "https://api.coincap.io/v2/assets?limit=10";
const tableHeadRow = document.getElementById("table-head-row");
const tableBody = document.getElementById("main-table-body");
let rowIndex = 1;

// Callback Functions
function createTableHeaders() {
  const properties = [
    "Rank",
    "Name",
    "Symbol",
    "Market Cap",
    "Percent Change 24Hr",
    "Price",
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

function fetchTopTenCryptos() {
  return fetch(topTenCryptoApi)
    .then((r) => r.json())
    .then((cryptoArrs) => {
      const cryptoObjs = cryptoArrs.data;
      return cryptoObjs.map((crypto) => ({
        rank: crypto.rank,
        name: crypto.name,
        symbol: crypto.symbol,
        marketCap:
          "$" +
          parseFloat(crypto.marketCapUsd /10000000000).toLocaleString("en-US", {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) +
          "b",
        percentChange: parseFloat(crypto.changePercent24Hr).toFixed(2) + "%",
        price:
          "$" +
          parseFloat(crypto.priceUsd).toLocaleString("en-US", {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        explorer: crypto.explorer,
      }));
    });
}

function createRowsAndColumns(data) {
  data.forEach((crypto) => {
    const tableRow = document.createElement("tr");
    tableRow.id = `row${rowIndex++}`;
    tableBody.appendChild(tableRow);

    const rowData = [
      crypto.rank,
      crypto.name,
      crypto.symbol,
      crypto.marketCap,
      crypto.percentChange,
      crypto.price,
      crypto.explorer,
    ];

    rowData.forEach((cellData, index) => {
      const tableData = document.createElement("td");
      const columnClass = tableHeadRow.children[index].classList[0];
      tableData.classList.add(columnClass);

      if (index === rowData.length - 1) {
        const explorerLink = document.createElement("a");
        explorerLink.href = cellData;
        explorerLink.textContent = "Explorer Link";
        explorerLink.target = "_blank";
        tableData.appendChild(explorerLink);
      } else {
        tableData.textContent = cellData;
      }
      tableRow.appendChild(tableData);
    });
  });
}

function refreshTable() {
  fetchTopTenCryptos().then((data) => {
    // Clear the existing table body
    while (tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }

    rowIndex = 1;
    createRowsAndColumns(data);
    const percentChangeTableRows = document.querySelectorAll("td.percent-change-24hr-column")
    for(let i = 0; i < percentChangeTableRows.length; i++){
      let percentChangeAsNumber = parseFloat(percentChangeTableRows[i].textContent ,10)
      if(percentChangeAsNumber < 0){
        console.log(percentChangeAsNumber)
        percentChangeTableRows[i].classList.remove("percent-change-24hr-column")
        percentChangeTableRows[i].classList.add('percent-change-24hr-column-red')
      } else {
        console.log(percentChangeAsNumber)
        percentChangeTableRows[i].classList.remove("percent-change-24hr-column")
        percentChangeTableRows[i].classList.add('percent-change-24hr-column-green')
      }
    } 
  });
}
// Execute functions
createTableHeaders();
refreshTable()
setInterval(refreshTable, 5000);
