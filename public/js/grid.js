$(function(){
  var window_height = $(window).height();
  var window_width = $(window).width();
  $('#page').css({height:window_height});
  
  var grid_size = window_height-115;
  if((grid_size+40)>(window_width/2)){
    grid_size = (window_width/2)-40;
  }
  
  var content_width = window_width-grid_size-60;
  var content_height = window_height-115;
  var content = $('#content');
  content.css({width:content_width,height:content_height});
  
  var grid = $('#grid');
  var grid_progress = $('#content .progress span');
  grid.css({width:grid_size,height:grid_size}); 
  for(var i=0;i<400;i++){
    grid.append($('<li><div></div></li>'));
  }
  for(var i=0;i<300;i++){
    (function(i){
    setTimeout(function(){
      var percent = Math.floor((i/400)*100);
      grid_progress.text(percent+'%');
      var rand_square = Math.floor(Math.random() * 400);
      grid.find('li:eq('+rand_square+')').addClass('active');
    },(i+1)*25)
    })(i);
  }
});