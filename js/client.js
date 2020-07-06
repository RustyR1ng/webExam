let host = "http://exam-2020-1-api.std-900.ist.mospolytech.ru";
let recordsPath = "/api/data1";
let recordsArr;
let table20 = document.getElementById("20").getElementsByTagName("tbody");
let menuCards = document.getElementsByClassName("card");
let searchForm = document.getElementById("searchBiz");
let sets = [];
let chosenObj;
let primarySum = 0;
let setsContainer = $("#menu");
let primarySumElements = document.getElementsByClassName("primarySum");
let optinialD = document.getElementById("dopOp");
let totalButton = document.getElementById("openOrderModal");
let responseJSON = [];
let searchBtn = document.getElementById("searchObjects");

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
        chosenObj = recordsArr.find((item) => item.id == row.id);
        for (let s = 1; s < 11; s++) {
          let cardAmount = menuCards[s - 1].querySelector("input");
          sets.push({
            name: "set_" + s,
            price: chosenObj["set_" + s],
            amount: parseInt(cardAmount.value),
          });
        }

        if (setsContainer.hasClass("d-none"))
          setsContainer.toggleClass("d-none");
        fillPrices();
        calcPrimary();
        activeRow(row);
        let openModal = document.getElementById("openOrderModal");
        if (openModal.hasAttribute("disabled"))
          openModal.removeAttribute("disabled");
        let inputS = optinialD.querySelector("input#socDisc");
        let inputD = optinialD.querySelector("input#unContact");
        if (inputD.hasAttribute("disabled")) inputD.removeAttribute("disabled");

        if (inputS.hasAttribute("disabled") && chosenObj.socialPrivileges == 1)
          inputS.removeAttribute("disabled");
        else inputS.setAttribute("disabled", "disabled");
      })
  );
}
function fillPrices() {
  for (let cardID = 0; cardID < menuCards.length; cardID++) {
    let cardPrice = menuCards[cardID].querySelector("span");
    cardPrice.innerText = sets[cardID].price + "$";
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
    recordsRate = recordsRate.filter((item) => {
      return item[option.name] == option.value;
    });
  }
  renderRecords(recordsRate.slice(0, 20));
  fillSets();
  /*  sendRequest(url, "GET", function () {
    searchResponse = Array.prototype.slice.call(this.response);
    renderRecords(rateFilter20(searchResponse));
  }); */
}
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
            sets[cardID].amount = parseInt(input.value);
            calcPrimary();
          }
        };
        break;
      }
      case "+": {
        button.onclick = function () {
          input.value++;
          sets[cardID].amount = parseInt(input.value);
          calcPrimary();
        };
      }
    }
  });
  input.onchange = function () {
    if (input.value == "") input.value = 0;
    else {
      input.value = input.value.replace(/\D/g, "");
      if (!Number.isInteger(input.value)) input.value = parseInt(input.value);
    }
    if (isNaN(input.value)) input.value = 0;
    else {
      sets[cardID].amount = parseInt(input.value);
      calcPrimary();
    }
  };
  let cardName = menuCards[cardID].querySelector(".card-title");
  let cardDescription = menuCards[cardID].querySelector(".card-text");
  let cardImage = menuCards[cardID].querySelector("img");

  cardName.innerText = responseJSON[cardID].name;
  cardDescription.innerText = responseJSON[cardID].descripton;
  cardImage.setAttribute("src", responseJSON[cardID].image);
}
(async () => {
  responseJSON = await $.getJSON("js/sets.json");
  for (let cardID = 0; cardID < menuCards.length; cardID++) {
    fillCard(menuCards, cardID, responseJSON);
  }
  setsContainer.toggleClass("d-none");
})();
function calcPrimary() {
  let sum = 0;
  for (item of sets) sum += item.price * item.amount;
  primarySum = sum;
  for (elem of primarySumElements) elem.value = primarySum + "$";
}
function activeRow(row) {
  let oldActive = table20[0].querySelector(".active_set");
  if (oldActive) oldActive.classList.remove("active_set");
  row.classList.add("active_set");
}
totalButton.onclick = function () {
  let inputS = optinialD.querySelector("input#socDisc");
  let inputD = optinialD.querySelector("input#unContact");
  if (inputD.checked) {
    $("#uncontact_delivery").toggleClass("d-none", false);
    $("#uncontact_miss").toggleClass("d-none", true);
  } else {
    $("#uncontact_delivery").toggleClass("d-none", true);
    $("#uncontact_miss").toggleClass("d-none", false);
  }
  if (inputS.checked) {
    document.getElementById("socModal").value = chosenObj.socialDiscount + "%";
    document.getElementById("total_price").value =
      primarySum - primarySum * chosenObj.socialDiscount * 0.01 + "$";
  } else {
    document.getElementById("socModal").value = "-";
    document.getElementById("total_price").value = primarySum + "$";
  }

  document.getElementById("modal_info_name").innerText = chosenObj.name;
  document.getElementById("modal_info_admArea").innerText = chosenObj.admArea;
  document.getElementById("modal_info_district").innerText = chosenObj.district;
  document.getElementById("modal_info_rate").innerText = chosenObj.rate;
  let containerModalSets = document.getElementById("modalSets");
  containerModalSets.innerHTML = "";
  for (let i = 0; i < sets.length; i++) {
    if (sets[i].amount != 0)
      containerModalSets.innerHTML +=
        '<div class="row set_modal d-flex flex-column flex-md-row mb-2 py-1"><div class="col d-flex justify-content-center align-items-center"><img src="' +
        responseJSON[i].image +
        '" width="60" alt=""/></div><div class="col set_name d-flex justify-content-center align-items-center text-center">' +
        responseJSON[i].name +
        '</div><div class="col set_amount_price d-flex justify-content-center align-items-center"><span class="set_amount">' +
        sets[i].amount +
        'x</span><span class="set_price">' +
        sets[i].price +
        '$</span></div><div class="col set_total_price d-flex justify-content-center align-items-center"> ' +
        sets[i].amount * sets[i].price +
        "$</div></div>";
  }
};
