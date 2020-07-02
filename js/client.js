let host = "http://exam-2020-1-api.std-400.ist.mospolytech.ru";
let recordsPath = "/api/data1";
let recordsArr;
let table20 = document.getElementById("20").getElementsByTagName("tbody");
let menuCards = document.getElementsByClassName("card");
let searchForm = document.getElementById("searchBiz");
let sets = [];

function sendRequest(url, method, onloadHandler, params) {
  let xhr = new XMLHttpRequest();
  /* xhr.upload.onerror = onerrorHandler;
  xhr.upload.onabort = onerrorHandler;
  xhr.upload.ontimeout = onerrorHandler;
  xhr.onerror = onerrorHandler;
  xhr.onabort = onerrorHandler;
  xhr.ontimeout = onerrorHandler; */
  xhr.onload = onloadHandler;
  xhr.open(method, url);
  /* xhr.setRequestHeader("Access-Control-Allow-Origin", "true"); */
  /* xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json"); */
  xhr.responseType = "json";
  if (params) {
    xhr.send(params);
  } else {
    xhr.send();
  }
}
function fillSets() {
  table20[0].querySelectorAll("tr").forEach(
    (row) =>
      (row.onclick = function () {
        sets = [];
        let record = recordsArr.find((item) => item.id == row.id);
        for (let s = 1; s < 11; s++)
          sets.push({ name: "set_" + s, price: record["set_" + s] });
        fillPrices();
      })
  );
}
function fillPrices() {
  for (let cardID = 0; cardID < menuCards.length; cardID++) {
    let cardPrice = menuCards[cardID].querySelector("span");
    cardPrice.innerText = sets[cardID].price;
  }
}
function recordPath(id) {
  return recordsPath + "/" + id;
}
function downloadData() {
  let url = new URL(recordsPath, host);
  sendRequest(url, "GET", function () {
    recordsArr = Array.prototype.slice.call(this.response);
    fillSearchForm();
  });
}
function fillSearchForm() {
  renderRecords(rateFilter20(recordsArr));
  searchForm
    .querySelectorAll("select:not([name='socialPrivileges'])")
    .forEach((element) => {
      let options = recordsArr
        .filter((item) => item.rate != null)
        .map((record) => record[element.name])
        .filter(function (item, pos, arr) {
          /* if (item && item != "Не выбрано") */ return (
            arr.indexOf(item) == pos
          );
        });
      for (option of options) {
        element.innerHTML += "<option>" + option + "</option>";
      }
    });
}
downloadData();
function searchObjects() {
  /* let url = new URL(recordsPath, host); */
  let searchOptions = [];
  searchForm.querySelectorAll("select").forEach((select) => {
    let value;
    let selected = select.options[select.selectedIndex];
    if (selected.innerText == "Не выбрано") return;
    if (select.name == "socialPrivileges")
      value = selected.innerText == "Да" ? 1 : 0;
    else value = selected.innerText;
    /* url.searchParams.append(select.name, value); */
    searchOptions.push({ name: select.name, value: value });
  });
  let recordsRate = recordsArr
    .filter((item) => item.rate != null)
    .sort(function (prev, next) {
      return next.rate - prev.rate;
    });

  for (option of searchOptions) {
    recordsRate = recordsRate.filter(
      (item) => item[option.name] == option.value
    );
  }
  renderRecords(recordsRate.slice(0, 20));
  fillSets();
  /*  sendRequest(url, "GET", function () {
    searchResponse = Array.prototype.slice.call(this.response);
    renderRecords(rateFilter20(searchResponse));
  }); */
}
//get client
let searchBtn = document.getElementById("searchObjects");
searchBtn.onclick = searchObjects;
function renderRecord(record) {
  let row = document.createElement("tr");
  row.id = record.id;
  row.innerHTML =
    "<td>" +
    record.name +
    "</td> <td class='d-none d-md-table-cell'>" +
    record.typeObject +
    "</td> <td class='w-75 text-justify text-wrap'>" +
    record.address +
    "</td>";
  table20[0].appendChild(row);
  fillSets();
}
function renderRecords(records) {
  table20[0].innerHTML = "";
  records.forEach((element) => {
    renderRecord(element);
  });
}
function rateFilter20(arr) {
  return arr
    .filter((item) => item.rate != null)
    .sort(function (prev, next) {
      return next.rate - prev.rate;
    })
    .slice(0, 20);
}
function fillCard(menuCards, cardID, responseJSON) {
  let buttons = menuCards[cardID].querySelectorAll("button");
  let input = menuCards[cardID].querySelector("input");
  buttons.forEach((button) => {
    switch (button.innerText) {
      case "-": {
        button.onclick = function () {
          if (input.value != 0) {
            input.value--;
          }
        };
        break;
      }
      case "+": {
        button.onclick = function () {
          input.value++;
        };
      }
    }
  });
  input.onchange = function () {
    if (input.value == "") {
      input.value = 0;
      return;
    }
    input.value = input.value.replace(/\D/g, "");
    if (!Number.isInteger(input.value)) input.value = parseInt(input.value);
  };
  let cardName = menuCards[cardID].querySelector(".card-title");
  let cardDescription = menuCards[cardID].querySelector(".card-text");
  let cardImage = menuCards[cardID].querySelector("img");
  cardName.innerText = responseJSON[cardID].name;
  cardDescription.innerText = responseJSON[cardID].descripton;
  cardImage.setAttribute("src", responseJSON[cardID].image);
}

(async () => {
  let responseJSON = await $.getJSON("js/sets.json");
  for (let cardID = 0; cardID < menuCards.length; cardID++) {
    fillCard(menuCards, cardID, responseJSON);
  }
})();
