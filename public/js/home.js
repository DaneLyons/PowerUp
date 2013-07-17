$(function(){
  var window_height = $(window).height();
  $('#page').css({ height: window_height });
  
  $('.slide_nav button').on('click',function(){
    $('.slide_nav button.active').removeClass('active');
    $(this).addClass('active');
    
    $('.slideshow li.active').removeClass('active');
    $('.slideshow li:eq('+$(this).data('slide')+')').addClass('active');
  });
});