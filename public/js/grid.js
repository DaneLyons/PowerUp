if (!PowerUp) { var PowerUp = {}; }

$(function () {
  PowerUp.GridMaster = {
    initializeGrid: function () {
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
      grid.css({ width: grid_size, height: grid_size}); 
      for(var i=0;i<400;i++){
        grid.append($('<li><div></div></li>'));
      }
      
      var legend_buttons = $('#content .legend button');
      var legend_width = content_width/legend_buttons.length;
      for(var i=0;i<legend_buttons.length;i++){
        $('#content .legend button:eq('+i+')').css({width:legend_width});
      }
      
      legend_buttons.click(function(){
        
      });
    },
    populateGrid: function (grid) {
      var powerUpCount = grid.powerUps.length;
      var gridSize = grid.size;
      var gridElem = $("#grid");
      var grid_progress = $('#content .progress');
      
      function setPowerUp(i) {
        setTimeout(function(){
          var percent = Math.floor((i / grid.size) * 100);
          console.log(percent);
          grid_progress.text(percent + '%');
          var rand_square = Math.floor(Math.random() * gridSize);
          gridElem.find('li:eq('+rand_square+')').addClass('active');
        }, (i + 1) * 25)
      }
      
      for(var i = 0; i < grid.powerUps.length; i++) {
        setPowerUp(i);
      }
    }
  }
});