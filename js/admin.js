let host = "http://exam-2020-1-api.std-900.ist.mospolytech.ru";
let recordsPath = "/api/data1";
let recordsList = document.getElementById("records");
let recordsArr;
let api_key = "77ef80ba-04a9-46f4-bfd7-3ce1c20dc137";
let searchForm = document.getElementById("search");
function sendRequest(url, method, onloadHandler, params) {
  let xhr = new XMLHttpRequest();
  url.searchParams.append("api_key", api_key);
  let urlStr = url.toString();
  xhr.upload.onerror = onerrorHandler;
  xhr.upload.onabort = onerrorHandler;
  xhr.upload.ontimeout = onerrorHandler;
  xhr.onerror = onerrorHandler;
  xhr.onabort = onerrorHandler;
  xhr.ontimeout = onerrorHandler;
  xhr.onload = onloadHandler;
  xhr.open(method, urlStr);
  /*  xhr.setRequestHeader("Access-Control-Allow-Origin", "true");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json"); */
  xhr.responseType = "json";
  if (params) xhr.send(params);
  else xhr.send();
}
function recordPath(id) {
  return recordsPath + "/" + id;
}
function resetForm(form) {
  form
    .querySelectorAll("input:not([type='radio']), textarea")
    .forEach((element) => {
      element.value = "";
    });
  form.querySelectorAll("input[type='radio']").forEach((element) => {
    element.removeAttribute("checked");
  });
}
function fillForm(form, id) {
  let formRecord = recordsArr.find((item) => item.id == id);
  form.querySelectorAll("input, textarea").forEach((element) => {
    let property = element.getAttribute("name");
    if (formRecord[property] != null) {
      switch (element.tagName) {
        case "INPUT": {
          let type = element.getAttribute("type");
          switch (type) {
            case "radio": {
              let answer = form.querySelector(
                "input[name='" +
                  property +
                  "'][value='" +
                  formRecord[property] +
                  "']"
              );

              answer.toggleAttribute("checked", "true");
              break;
            }
            default: {
              element.value = formRecord[property];
              break;
            }
          }
          break;
        }
        case "TEXTAREA": {
          element.value = formRecord[property];
          break;
        }
      }
    }
  });
}
function renderRecord(record) {
  let row = document.createElement("div");
  let col = document.createElement("div");
  let btn = document.createElement("button");

  row.classList.add("row", "py-2");
  col.classList.add("col");
  row.id = record.id;
  col.innerHTML = record.name;
  row.append(col);

  col = document.createElement("div");
  col.classList.add("col-2", "d-none", "d-md-block");
  col.innerHTML = record.typeObject;
  row.append(col);

  col = document.createElement("div");
  col.classList.add("col");
  col.innerHTML = record.address;
  row.append(col);

  col = document.createElement("div");
  col.classList.add(
    "col-3",
    "d-flex",
    "d-md-block",
    "justify-content-center",
    "align-items-center",
    "flex-column",
    "p-0",
    "col-md-2",
    "pr-md-1",
    "p-md-2",
    "text-md-center"
  );
  btn.dataset.recordId = record.id;
  btn.classList.add(
    "dangerBtn",
    "deleteRecordBtn",
    "icon",
    "mr-md-1",
    "mr-md-3",
    "mb-2",
    "mb-md-0"
  );
  btn.setAttribute("data-toggle", "modal");
  btn.setAttribute("data-target", "#deleteModal");
  btn.onclick = function () {
    let delbtn = document.getElementById("deleteModalBtn");
    delbtn.dataset.recordId = event.target.dataset.recordId;
    delbtn.onclick = deleteBtnHandler;
  };
  col.append(btn);

  btn = document.createElement("button");
  btn.dataset.recordId = record.id;
  btn.classList.add("changeRecordBtn", "icon");
  btn.setAttribute("data-toggle", "modal");
  btn.setAttribute("data-target", "#createUpdModal");
  btn.dataset.recordId = record.id;
  btn.onclick = function () {
    let modal = document.getElementById("createUpdModal");
    modal.querySelector(".modal-title").innerHTML = "Редактирование записи";
    let updateBtn = document.getElementById("createBtn");
    updateBtn.dataset.recordId = event.target.dataset.recordId;
    let form = modal.querySelector("form");
    resetForm(form);
    fillForm(form, event.target.dataset.recordId);
    updateBtn.onclick = updateBtnHandler;
  };
  col.append(btn);
  row.append(col);

  return row;
}

function renderRecords(records) {
  recordsList.innerHTML = "";
  for (record of records) {
    recordsList.append(renderRecord(record));
  }
}
function downloadData() {
  let url = new URL(recordsPath, host);
  sendRequest(url, "GET", function () {
    recordsArr = Array.prototype.slice.call(this.response);
    renderRecords(recordsArr);
    fillSearchSelects();
  });
}
downloadData();
//read
document.getElementById("filterBtn").onclick = function () {
  let searchOptions = [];
  let recordsSearch = recordsArr;
  searchForm.querySelectorAll("select").forEach((select) => {
    let value;
    let selected = select.options[select.selectedIndex];
    if (selected.innerText == "Не выбрано") return;
    if (select.name == "socialPrivileges" || select.name == "isNetObject")
      value = selected.innerText == "Да" ? 1 : 0;
    else value = selected.innerText;
    /* url.searchParams.append(select.name, value); */
    searchOptions.push({ name: select.name, value: value });
  });
  let nameS = searchForm.querySelector("input[name=name]");
  if (nameS.value) searchOptions.push({ name: nameS.name, value: nameS.value });
  let seatsS = searchForm.querySelectorAll("input[name=seatsCount]");
  if (seatsS[0].value)
    recordsSearch = recordsSearch.filter((item) => {
      return item[seatsS[0].name] >= seatsS[0].value;
    });
  if (seatsS[1].value)
    recordsSearch = recordsSearch.filter((item) => {
      return item[seatsS[1].name] <= seatsS[1].value;
    });
  /* let dateS = searchForm.querySelectorAll("input[name=created_at]");
  if (dateS[0].value)
    recordsSearch = recordsSearch.filter((item) => {
      return item[dateS[0].name] >= new Date(dateS[0].value);
    });
  if (dateS[1].value)
    recordsSearch = recordsSearch.filter((item) => {
      return item[dateS[1].name] <= new Date(dateS[1].value);
    }); */

  for (option of searchOptions) {
    recordsSearch = recordsSearch.filter((item) => {
      return item[option.name] == option.value;
    });
  }
  renderRecords(recordsSearch);
};
//create
document.getElementById("openCreateModal").onclick = function () {
  let modal = document.getElementById("createUpdModal");
  modal.querySelector(".modal-title").innerHTML = "Создание записи";
  let form = modal.querySelector("form");
  resetForm(form);
  document.getElementById("createBtn").onclick = function () {
    let url = new URL(recordsPath, host);
    let params = new FormData();
    fillFormData(document.getElementById("createForm"), params);
    sendRequest(
      url,
      "POST",
      function () {
        recordsList.appendChild(renderRecord(this.response));
        recordsArr.push(this.response);
      },
      params
    );
  };
};
//delete
function deleteBtnHandler(event) {
  let url = new URL(recordPath(event.target.dataset.recordId), host);
  sendRequest(url, "DELETE", function () {
    document.getElementById(this.response.id).remove();
  });
}
//update
function updateBtnHandler(event) {
  let id = event.target.dataset.recordId;
  let url = new URL(recordPath(id), host);
  let thisRecord = recordsArr.find((item) => item.id == id);
  document
    .querySelector("#createUpdModal form")
    .querySelectorAll("input, textarea")
    .forEach((element) => {
      let prop = element.getAttribute("name");
      switch (element.type) {
        case "radio": {
          if (!element.checked) break;
        }
        default: {
          if (thisRecord[prop] != element.value) {
            url.searchParams.append(prop, element.value);
          }
        }
      }
    });

  sendRequest(url, "PUT", renderRecord(id), null);
}
function onerrorHandler() {
  $("#error").toast("show");
}
function fillSearchSelects() {
  searchForm
    .querySelectorAll(
      "select:not([name='socialPrivileges']):not([name='isNetObject']"
    )
    .forEach((selectElem) => {
      let options = recordsArr
        .map((record) => record[selectElem.name])
        .filter(function (item, pos, arr) {
          /* if (item && item != "Не выбрано") */ return (
            arr.indexOf(item) == pos
          );
        });
      for (option of options) {
        selectElem.innerHTML += "<option>" + option + "</option>";
      }
    });
}
function fillFormData(form, data) {
  form.querySelectorAll("input, textarea").forEach((element) => {
    let property = element.getAttribute("name");
    let value;
    switch (element.tagName) {
      case "INPUT": {
        let type = element.getAttribute("type");
        switch (type) {
          case "radio": {
            if (!element.checked) break;
          }
          default: {
            value = element.value;
            break;
          }
        }
        break;
      }
      case "TEXTAREA": {
        value = element.innerText;
        break;
      }
    }
    if (value) data.append(property, value);
  });
}
