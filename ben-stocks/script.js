"use strict";

async function getPrice(idToChange, ticker) {
  const apikey = "Enter  your api key here";
  let response = await fetch(
    `http://api.marketstack.com/v1/eod?access_key=${apikey}&symbols=${ticker}`
  );
  let message = await response.json();
  let stockData = message.data[0].close;
  document.getElementById(
    idToChange
  ).textContent = `Yesterday Stock close price was: ${stockData}`;
}

async function getPriceRange(idToChange, ticker, fromDate, toDate) {
  let n = new Date();
  if (fromDate >= n || fromDate >= toDate) {
    document.getElementById(idToChange).textContent =
      "Invalid input, try again";
    return;
  }

  if (toDate > n) {
    document.getElementById(idToChange).textContent =
      "Showing the results until today";
  }

  document.getElementById(idToChange).textContent = "";

  const apiKey = "8de724838acd2ccaa081b31504c3d93d";
  let response = await fetch(
    `http://api.marketstack.com/v1/intraday?access_key=${apiKey}&symbols=${ticker}&date_from=${fromDate}&date_to=${toDate}&limit=50&interval=24hour`
  );
  let message = await response.json();
  console.log(message);
  for (let i = 0; i < message.data.length; i++) {
    let table = document.getElementById("tableChange");
    document.getElementById("toVis").style.visibility = "visible";
    let row = table.insertRow(i);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    cell1.innerHTML = `${message.data[i].date.slice(0, 10)}`;
    cell2.innerHTML = `${message.data[i].open}`;
    cell3.innerHTML = `${ticker}`;
  }
}
