$(function () {
  $('#demo button').on('click', function () {
    $('#demo_screen').animate({ opacity: 0 }, 300, function () {
      $(this).remove();
    });
    $('#demo').animate({ top: -500 }, 300, function () {
      $(this).remove();
    });
  });
  
  $('#grid li').on('click',function(){
    var elem = $(this);
    if(elem.hasClass('active')){
      $('#popup').remove();
      var popup = $('<div id="popup"><div class="arrow"></div><h1>POWERUP</h1></div>');
      var close = $('<button class="close"></button>');
      popup.append(close);
      close.on('click',function(){
        $('#popup').remove();
      });
      //add content to popup
      var content = $('<div class="time">July 1st, 7:39am</div>\
      <div class="data"><label>Current weight</label><input></div>\
      <div class="data"><label>Mood</label><input></div>\
      <div class="delete"><a href="#">Delete PowerUp</a>');
      popup.append(content);
      
      var offset = elem.offset();
      popup.css({ left:(offset.left+elem.width()+24), top:(offset.top-26), opacity:0 });
      $('body').append(popup);
      popup.animate({ left:'-=10',opacity:1 },400);
    }
  });
});