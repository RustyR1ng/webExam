let host = "http://exam-2020-1-api.std-400.ist.mospolytech.ru";
let recordsPath = "/api/data1";

function sendRequest(url, method, onloadHandler, params) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.responseType = "json";
  xhr.onload = onloadHandler;
  xhr.send(params);
}

function recordPath(id) {
  return recordsPath + "/" + id;
}

function resetForm() {
  let form = document.getElementById("createUpdModal").querySelector("form");
  form
    .querySelectorAll("input:not([type='radio']), textarea")
    .forEach((element) => {
      element.value = "";
    });
  form.querySelectorAll("input[type='radio']").forEach((element) => {
    element.removeAttribute("checked");
  });
}
function renderRecord(record) {
  let row = document.createElement("tr");
  let td = document.createElement("td");
  row.id = record.id;
  td.innerHTML = record.name;
  row.append(td);
  td = document.createElement("td");
  td.innerHTML = record.address;
  row.append(td);
  td = document.createElement("td");
  let btn = document.createElement("button");
  btn.dataset.recordId = record.id;
  btn.innerHTML = "Удалить";
  btn.classList.add("btn", "btn-danger");
  btn.setAttribute("data-toggle", "modal");
  btn.setAttribute("data-target", "#deleteModal");
  btn.onclick = function () {
    let delbtn = document.getElementById("deleteModalBtn");
    delbtn.dataset.recordId = event.target.dataset.recordId;
    delbtn.onclick = deleteBtnHandler;
  };

  td.append(btn);
  row.append(td);
  td = document.createElement("td");
  btn = document.createElement("button");
  btn.dataset.recordId = record.id;
  btn.innerHTML = "Редактировать";
  btn.classList.add("btn", "btn-secondary");
  btn.setAttribute("data-toggle", "modal");
  btn.setAttribute("data-target", "#createUpdModal");
  btn.dataset.recordId = record.id;
  btn.onclick = function () {
    let modal = document.getElementById("createUpdModal");
    modal.querySelector(".modal-title").innerHTML = "Редактирование записи";
    let updateBtn = document.getElementById("createBtn");
    updateBtn.dataset.recordId = event.target.dataset.recordId;
    let url = new URL(recordPath(event.target.dataset.recordId), host);
    let form = modal.querySelector("form");
    resetForm();
    sendRequest(url, "GET", function () {
      for (var k in this.response) {
        let input = form.querySelector("*[name='" + k + "']");
        if (input != null && this.response[k] != null)
          switch (input.tagName) {
            case "INPUT": {
              let type = input.getAttribute("type");
              switch (type) {
                case "radio": {
                  let answer = form.querySelector(
                    "input[name='" + k + "'][value='" + this.response[k] + "']"
                  );
                  console.log(this.response[k]);
                  console.log(
                    "input[name='" + k + "'][value='" + this.response[k] + "']"
                  );
                  answer.toggleAttribute("checked", "true");
                  break;
                }
                default: {
                  input.value = this.response[k];
                  break;
                }
              }
              break;
            }
            case "TEXTAREA": {
              input.value = this.response[k];
              break;
            }
          }
      }
    });
    updateBtn.onclick = updateBtnHandler;
  };

  td.append(btn);
  row.append(td);
  return row;
}
function renderRecords(records) {
  let t = document.getElementById("records").querySelector("tbody");
  t.innerHTML = "";
  for (record of records) {
    t.append(renderRecord(record));
  }
}

//read
document.getElementById("downloandDataBtn").onclick = function () {
  let url = new URL(recordsPath, host);
  sendRequest(url, "GET", function () {
    renderRecords(this.response);
  });
};
//create
document.getElementById("openCreateModal").onclick = function () {
  let modal = document.getElementById("createUpdModal");
  modal.querySelector(".modal-title").innerHTML = "Создание записи";
  resetForm();
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
  let url = new URL(recordPath(event.target.dataset.recordId), host);
  console.log(url);
  let params = new FormData(document.getElementById("createForm"));
  sendRequest(
    url,
    "PUT",
    function () {
      renderRecord(this.response);
    },
    params
  );
}
