let host = "http://exam-2020-1-api.std-400.ist.mospolytech.ru";
let recordsPath = "/api/data1";
let recordsNode;
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

function recordPath(id) {
  return recordsPath + "/" + id;
}
//get client
let downloadBtn = document.getElementById("searchObjects");
downloadBtn.onclick = function () {
  let tableObjects = document.getElementById("20");
  let url = new URL(recordsPath, host);
  sendRequest(url, "GET", function () {
    recordsNode = this.response;
  });
  load20();
};
function load20() {
  let recordsArr = Array.prototype.slice
    .call(recordsNode)
    .filter((item) => item.rate != null);
  recordsArr.sort(function (prev, next) {
    return next.rate - prev.rate;
  });
  let list20 = recordsArr.slice(0, 20);
}
