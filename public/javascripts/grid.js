$(function(){
  var window_height = $(window).height();
  $('#page').css({height:window_height});
  
  var grid_size = window_height-115;
  var grid = $('#grid');
  grid.css({width:grid_size,height:grid_size}); 
  for(var i=0;i<25;i++){
    grid.append($('<li><div></div></li>'));
  }
  for(var i=0;i<10;i++){
    setTimeout(function(){
      var rand_square = Math.floor(Math.random() * 25);
      grid.find('li:eq('+rand_square+')').addClass('active');
    },(i+1)*75)
  }
});