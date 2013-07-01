$(function () {
  $('#demo button').on('click', function () {
    $('#demo_screen').animate({ opacity: 0 }, 300, function () {
      $(this).remove();
    });
    $('#demo').animate({ top: -500 }, 300, function () {
      $(this).remove();
    });
  });
  
  $(document).keydown(function(ev){   
    if($('#grid li.current').length > 0){
      if(ev.which == 37){
        //prev
        $('#grid li.current').prev('.active').trigger('click');
      }
      if(ev.which == 39){
        //next
        $('#grid li.current').next('.active').trigger('click');
      }
    }
  });
});