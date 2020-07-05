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
  }, 1000);

  mainBody.style.marginTop = header.offsetHeight + "px";
};

navButton.onclick = navIcon;
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
let active = navbar.getElementsByClassName("active");

navbar.onclick = function () {
  let navItem = event.target.closest(".nav-item");
  if (!navItem) return;
  active[0].classList.remove("active");
  navItem.querySelector("a").classList.add("active");
};
