window.onload = function () {
  setTimeout(function () {
    let preloader = $(".loaderBg");
    let loader = preloader.find(".loader");
    loader.fadeOut();
    preloader.fadeOut("slow");
    $("body").css("overflow", "auto");
  }, 2000);
};
