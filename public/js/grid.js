if (!PowerUp) { var PowerUp = {}; }

$(function () {
  PowerUp.GridMaster = {
    initializeGrid: function () {
      var window_height = $(window).height();
      var window_width = $(window).width();
      $('#page').css({height:window_height});

      var grid_size = window_height-155;
      if((grid_size+40)>(window_width/2)){
        grid_size = (window_width/2)-40;
      }

      var content_width = window_width-grid_size-60;
      var content_height = window_height-155;
      var content = $('#content');
      content.css({width:content_width,height:content_height});

      var grid = $('#grid');
      var grid_progress = $('#content .progress span');
      grid.css({ width: grid_size, height: grid_size}); 
      for(var i=0;i<400;i++){
        grid.append($('<li class="inactive" data-idx="'+i+'"><div></div></li>'));
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
        pos_arr.push(grid.powerUps[i].position);
        setTimeout(function(){
          var percent = Math.floor((i / grid.size) * 100);
          grid_progress.text(percent + '%');
          var rand_square = grid.powerUps[i].position;
          var sq = gridElem.find('li:eq('+rand_square+')');
          sq.removeClass('inactive');
          sq.addClass('active');
          if(grid.powerUps[i].color){
            sq.addClass(grid.powerUps[i].color);
          }
        }, (i + 1) * 25)
      }
      
      var pos_arr = [];
      for(var i = 0; i < grid.powerUps.length; i++) {
        setPowerUp(i);
      }
      
      $("#content .legend button.powerup").click(function (ev) {
        ev.preventDefault();
        
        var btn = $(this);
        
        if(!btn.hasClass('disabled')){
          var num = btn.data('powerup-num');
          var color = btn.data('color');
          var emptySquares = $("ul#grid li.inactive");
          var emptyLen = emptySquares.length;
          if(emptyLen != 400 && emptyLen % 40 == 0){
            PowerUp.GridMaster.gridMilestone();
          }
        
          var sockHost = "http://" + window.location.host;
          var socket = io.connect(sockHost);
          var gridId = $("#grid").data("grid-id");
          for (var i = 0; i < num; i++) {
            var idx = emptySquares.eq(Math.floor(Math.random() * emptySquares.length)).data('idx');
            socket.emit('Grid.PowerUp', {
              PowerUp: {
                grid: gridId,
                position: idx,
                color:color
              }
            });
          
            var newSquare = $("ul#grid li:eq("+idx+")");
            newSquare.removeClass('inactive');
            newSquare.addClass('active');
            newSquare.addClass(color);      
          }
        
          var gridSize = $("#grid li").length;
          var filledLen = gridSize - emptyLen;
          var percent = Math.floor((filledLen / gridSize) * 100);
          if (percent === 0) { percent = 1; }
          grid_progress.text(percent + '%');
        } //disabled check
      });
    },
    gridKeeper: function() {
      $('.legend button').on('click', function(ev) {
        console.log('GRID KEEPER');
      });
    },
    gridMilestone: function(){
      var grid = $('#grid');
      var grid_pos = grid.offset();
      var grid_width = grid.width();
      var grid_height = grid.height();
      var milestone = $('<div id="milestone">\
        <h1>Feel the progress!</h1>\
        <h2><img src="/img/icon_white.png" /></h2>\
      </div>');
      $('body').append(milestone);
      milestone.css({left:grid_pos.left,width:grid_width,height:(grid_height/4)});
      milestone.animate({top:(grid_pos.top+(grid_height/3))},1000,"easeOutBounce",function(){
        setTimeout(function(){
          milestone.animate({opacity:0},1000,function(){
            milestone.remove();
          });
        },5000)
      });
    }
  }
  
  var isExpanded = false;
  $("#content .collaborate .expand.button").click(function (ev) {
    ev.preventDefault();
    if (isExpanded) {
      $("#content .collaborate form.new_collaborator").animate({
        opacity: 0
      }, 200);
      isExpanded = false;
    } else {
      $("#content .collaborate form.new_collaborator").animate({
        opacity: 1
      }, 200);
      
      isExpanded = true;
    }
  });
});