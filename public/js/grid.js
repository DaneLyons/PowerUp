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
      var popup = $('<div id="popup"><div class="arrow"></div><h1>PowerUp</h1></div>');
      //add content to popup
      var content = $('<p>Sample content</p><p>Sample content</p>');
      popup.append(content);
      
      var offset = elem.offset();
      popup.css({ left:(offset.left+elem.width()+14), top:(offset.top-26) });
      $('body').append(popup);
    }
  });
});