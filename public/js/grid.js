$(function () {
  $('#demo button').on('click', function () {
    $('#demo_screen').animate({ opacity: 0 }, 300, function () {
      $(this).remove();
    });
    $('#demo').animate({ top: -500 }, 300, function () {
      $(this).remove();
    });
  });
  
  function eventShowMetadata(ev) {
    ev.preventDefault();
    console.log("active click");
    $("#content .section").hide();
    $("#content .section.metadata").show();
  };
});