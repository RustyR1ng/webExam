let mainBody = document.querySelector("main");
let header = document.querySelector("nav");
let navButton = document.querySelector(".navbar-toggler");
let icon = document.querySelector(".navbar-toggler-icon");
let navbar = document.querySelector(".navbar");
let underlineB = navbar.querySelector(".underline");

window.onload = function () {
  setTimeout(function () {
    let preloader = $(".loaderBg");
    let loader = preloader.find(".loader");
    loader.fadeOut();
    preloader.fadeOut("slow");
    $("body").css("overflow", "auto");
  }, 2000);
  let active = navbar.querySelector(".active");
  mainBody.style.marginTop = header.offsetHeight + "px";
  underlineB.style.width = active.offsetWidth + "px";
  underlineB.style.left = active.offsetLeft + "px";
  underlineB.style.top = active.offsetTop + active.offsetHeight + "px";
};

function navIcon() {
  let navIconClass = "nav-icon-clicked";
  switch (navButton.getAttribute("aria-expanded")) {
    case "false": {
      icon.classList.add(navIconClass);
      break;
    }
    case "true": {
      icon.classList.remove(navIconClass);
      break;
    }
  }
}
function activeA(event) {
  let newActive = event.target.closest("a");
  let oldActive = navbar.querySelector(".active");
  if (!newActive) {
    underlineB.style.width = oldActive.offsetWidth + "px";
    underlineB.style.left = oldActive.offsetLeft + "px";
    underlineB.style.top = oldActive.offsetTop + oldActive.offsetHeight + "px";
    return;
  }

  oldActive.classList.remove("active");
  newActive.classList.add("active");
  underlineB.style.width = newActive.offsetWidth + "px";
  underlineB.style.left = newActive.offsetLeft + "px";
  underlineB.style.top = newActive.offsetTop + newActive.offsetHeight + "px";
}

navButton.onclick = navIcon;
navbar.onclick = activeA;
