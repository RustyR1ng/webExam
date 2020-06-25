let host = "http://exam-2020-1-api.std-400.ist.mospolytech.ru";
let recordsPath = "/api/data1";
let recordsList = document.getElementById("records");
let recordsRows = recordsList.querySelectorAll("div.row:not(:first-of-type)");
let recordsNode;

function sendRequest(url, method, onloadHandler, params) {
  let xhr = new XMLHttpRequest();
  xhr.onerror = onerrorHandler;
  xhr.onabort = onerrorHandler;
  xhr.ontimeout = onerrorHandler;
  xhr.onload = onloadHandler;
  xhr.open(method, url);
  /* xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json"); */
  xhr.responseType = "json";
  xhr.send(params);
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
  let formRecord = recordsNode.find((item) => item.id == id);
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
  function renderRecordName(row, col) {
    row.classList.add("row", "py-2");
    col.classList.add("col");
    row.id = record.id;
    col.innerHTML = record.name;
    row.append(col);
  }
  function renderRecordTypeObject(row, col) {
    col.classList.add("col-2", "d-none", "d-md-block");
    col.innerHTML = record.typeObject;
    row.append(col);
  }
  function renderRecordAdress(row, col) {
    col.classList.add("col");
    col.innerHTML = record.address;
    row.append(col);
  }
  function renderRecordButtons(row, col) {
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
      "btn",
      "btn-danger",
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
    btn.classList.add("btn", "btn-secondary", "changeRecordBtn", "icon");
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
  }
  let row = document.createElement("div");
  let col = document.createElement("div");
  let btn = document.createElement("button");

  renderRecordName(row, col);
  col = document.createElement("div");
  renderRecordTypeObject(row, col);
  col = document.createElement("div");
  renderRecordAdress(row, col);
  col = document.createElement("div");
  renderRecordButtons(row, col);
  return row;
}

function renderRecords(records) {
  for (record of records) {
    recordsList.append(renderRecord(record));
  }
}

//read
document.getElementById("downloandDataBtn").onclick = function () {
  let url = new URL(recordsPath, host);
  sendRequest(url, "GET", function () {
    recordsRows.forEach((element) => element.remove());
    renderRecords(this.response);
    recordsNode = this.response;
    recordsRows.forEach((element) => {
      element.classList.add("d-none");
    });
  });
};
//create
document.getElementById("openCreateModal").onclick = function () {
  let modal = document.getElementById("createUpdModal");
  modal.querySelector(".modal-title").innerHTML = "Создание записи";
  let form = modal.querySelector("form");
  resetForm(form);
  document.getElementById("createBtn").onclick = function () {
    let url = new URL(recordsPath, host);
    let params = new FormData(document.getElementById("createForm"));
    sendRequest(
      url,
      "POST",
      function () {
        renderRecord(this.response);
      },
      params
    );
  };
};
//delete
function deleteBtnHandler(event) {
  let url = new URL(recordPath(event.target.dataset.recordId), host);
  sendRequest(url, "DELETE", function () {
    document.getElementById(this.response).remove();
  });
}
//update
function updateBtnHandler(event) {
  let params = new FormData();
  let id = event.target.dataset.recordId;
  let thisRecord = recordsNode.find((item) => item.id == id);
  document
    .querySelector("#createUpdModal form")
    .querySelectorAll("input:not([type=radio]), textarea")
    .forEach((element) => {
      let prop = element.getAttribute("name");
      if (thisRecord[prop] != element.value) {
        params.append(prop, element.value);
      }
    });
  let url = new URL(recordPath(id), host);

  sendRequest(url, "PUT", null, params);
}
function onerrorHandler() {
  $("#error").toast("show");
}
