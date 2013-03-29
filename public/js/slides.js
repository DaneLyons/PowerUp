$(function(){
  $('.toc button').click(function(){
    var elem = $(this);
    var slide = elem.data('slide');
    
    //activate new toc button
    $('.toc button.active').removeClass('active');
    elem.addClass('active');
    
    //show slide
    var currentSlide = $('.slides .active');
    var newSlide = $('.slides .'+slide);
    
    if(newSlide.hasClass('seen')){
      currentSlide.removeClass('active seen');
    }else{
      currentSlide.removeClass('active');
      currentSlide.addClass('seen');
    }
    newSlide.addClass('active');
  });
  
  $('.content .next').click(function(ev){
    ev.preventDefault();
    var slide = $(this).data('slide');
    $('.toc button.'+slide).trigger('click');
  });
});