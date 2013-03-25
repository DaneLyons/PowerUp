$(function () {
  $("#header .account .login.button").on('click', function (ev) {
    console.log("asdf");
    ev.preventDefault();
    window.location = "/log_in";
  });
});
