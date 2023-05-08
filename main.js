// Global variables
const topTwentyCryptoApi = "https://api.coincap.io/v2/assets?limit=20";
const tableHeadRow = document.getElementById("table-head-row");
const tableBody = document.getElementById("main-table-body");
const showTenBtn = document.getElementById("extend-button");
const compareForm = document.getElementById("compare-form");
const cryptoDropDownList = document.getElementById("crypto-list");
const cryptoSearchA = document.getElementById("search-a");
const cryptoSearchB = document.getElementById("search-b");
const comparisonContainer = document.getElementById("comparison-cotainer");
const submitButton = document.querySelector("form>button");
const compareResultsDiv = document.getElementById("comparison-results");
const mainHeader = document.getElementById("mainHeader");
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

    const percentChangeTableRows = document.querySelectorAll(
      ".percent-change-24hr-column"
    );
    //changes color of percent change text so when its positive its green and red when negative
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
function loadDataListOptions() {
  fetchTopTwentyCryptos()
    .then((topTwentyCryptosArr) => {
      topTwentyCryptosArr.forEach((crypto) => {
        const cryptoListOptions = document.createElement("option");
        cryptoListOptions.value = crypto.name;
        cryptoDropDownList.appendChild(cryptoListOptions);
      });
    })
    .catch((error) => {
      alert(error);
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
        explorer: crypto.explorer,
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
      tableRow.classList.add("default");
    } else if (`${rowIndex}` > 11 && tableExpanded) {
      tableRow.classList.add("default");
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
  if (e.target.textContent === "Show 10 More") {
    mainHeader.textContent = "Top 20 Cryptos by Market Cap";
    e.target.textContent = "Hide 10";
    tableExpanded = true;
  } else {
    e.target.textContent = "Show 10 More";
    mainHeader.textContent = "Top 10 Cryptos by Market Cap";
    tableExpanded = false;
  }
}

function compareBtnHandler(e) {
  e.preventDefault();
  fetch(topTwentyCryptoApi)
    .then((resp) => resp.json())
    .then((topTwentyCryptosArr) => {
      if (cryptoSearchA.value && cryptoSearchB.value) {
        const spanPercent = document.createElement("span");
        const newPrice = compareMarketCap(
          cryptoSearchA.value,
          cryptoSearchB.value,
          topTwentyCryptosArr.data
        );
        const formattedPrice = formatPrice(newPrice);
        const compareResults = document.createElement("h3");
        compareResults.textContent = `${cryptoSearchA.value}'s price would be ${formattedPrice} with the same market cap as ${cryptoSearchB.value}`;
        compareResultsDiv.appendChild(compareResults);

        const extraInformationList = document.createElement("ul");
        const extraInfo1 = document.createElement("li");
        const extraInfo2 = document.createElement('p')
        extraInfo1.id = "extraInfo";
        spanPercent.textContent = marketCapDifference(
          cryptoSearchA.value,
          cryptoSearchB.value,
          topTwentyCryptosArr.data,
          extraInfo1,
          extraInfo2,
          spanPercent
        );
        extraInfo1.appendChild(spanPercent);
        extraInfo1.insertBefore(extraInfo2,null)
        compareResultsDiv.appendChild(extraInformationList);
        extraInformationList.appendChild(extraInfo1);
      }
    })
    .catch(error=>{
      alert(error)
    });
}

function searchEventHandler(e) {
  const cryptoA = cryptoSearchA.value;
  const cryptoB = cryptoSearchB.value;
  if (cryptoA !== "" && cryptoA === cryptoB) {
    alert(
      "You cannot choose 2 of the same options. Please change 1 of the options"
    );
    submitButton.disabled = true;
  } else {
    submitButton.disabled = false;
  }
}

//Event Listeners
document.addEventListener("DOMContentLoaded", createTableHeaders);
document.addEventListener("DOMContentLoaded", loadDataListOptions);
compareForm.addEventListener("submit", compareBtnHandler);
showTenBtn.addEventListener("click", showTenBtnHandler);
cryptoSearchA.addEventListener("change", searchEventHandler);
cryptoSearchB.addEventListener("change", searchEventHandler);

//Helper Functions
function createCellId(columnIndex, rowIndex) {
  return `cell-row${rowIndex}-column${columnIndex}`;
}
function formatMarketCap(marketCapData) {
  return (
    "$" +
    parseFloat(marketCapData / 1000000000).toLocaleString("en-US", {
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

function compareMarketCap(cryptoA, cryptoB, topTwentyCryptosArr) {
  const cryptoAData = topTwentyCryptosArr.find(
    (crypto) => crypto.name === cryptoA
  );
  const cryptoBData = topTwentyCryptosArr.find(
    (crypto) => crypto.name === cryptoB
  );
  const cryptoAMarketCap = cryptoAData.marketCapUsd;
  const cryptoBMarketCap = cryptoBData.marketCapUsd;
  const cryptoAPrice = cryptoAData.priceUsd;
  const newPrice = (cryptoAPrice * cryptoBMarketCap) / cryptoAMarketCap;
  return newPrice;
}

function marketCapDifference(
  cryptoA,
  cryptoB,
  topTwentyCryptosArr,
  listElement,
  paraElement,
  spanElement
) {
  const cryptoAData = topTwentyCryptosArr.find(
    (crypto) => crypto.name === cryptoA
  );
  const cryptoBData = topTwentyCryptosArr.find(
    (crypto) => crypto.name === cryptoB
  );
  const cryptoAMarketCap = cryptoAData.marketCapUsd;
  const cryptoBMarketCap = cryptoBData.marketCapUsd;
  if (cryptoAMarketCap > cryptoBMarketCap) {
    const newMultiplier =
      "(" + (cryptoAMarketCap / cryptoBMarketCap).toFixed(2) + "x)";
    spanElement.classList.add("percent-green");
    listElement.textContent = `${cryptoA}'s market cap is `;
    paraElement.textContent = ` larger than ${cryptoB}'s market cap.`
    return newMultiplier;
  } else if (cryptoAMarketCap < cryptoBMarketCap) {
    const newMultiplier =
    "(" + parseFloat(cryptoAMarketCap / cryptoBMarketCap).toFixed(2) + "x)";
    spanElement.classList.add("percent-red");
    listElement.textContent = `${cryptoA}'s market cap is `;
    paraElement.textContent = ` smaller than ${cryptoB}'s market cap.`
    return newMultiplier;
  }
  return listElement;
}
// Execute functions
refreshTable();
setInterval(refreshTable, 5000);
