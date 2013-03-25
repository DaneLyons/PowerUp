$(function(){
  $('.toc button').click(function(){
    var elem = $(this);
    var slide = elem.data('slide');
    
    //activate new toc button
    $('.toc button.active').removeClass('active');
    elem.addClass('active');
    
    //show slide
    $('.slides .active').removeClass('active');
    $('.slides .'+slide).addClass('active');
  });
  
  $('.content .next').click(function(ev){
    ev.preventDefault();
    var slide = $(this).data('slide');
    $('.toc button.'+slide).trigger('click');
  });
});