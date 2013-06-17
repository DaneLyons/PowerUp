$(function () {
  PowerUp.GridMaster = {
    initializeGrid: function (opts) {
      if (opts) {
        for (prop in opts) {
          PowerUp[prop] = opts[prop];
        }
      }

      var grid = $('#grid');
      var grid_progress = $('#content .progress span');
      
      for(var i=0;i<400;i++){
        grid.append($('<li class="inactive" data-idx="'+i+'"><div></div></li>'));
      }
    }, 
    gridMilestone: function gridMilestone(){
      var grid = $('#grid');
      var grid_pos = grid.offset();
      var grid_width = grid.width();
      var grid_height = grid.height();
      var percent_complete = $('.progress').text();
      var milestone = $('<div id="milestone">\
        <h1>'+percent_complete+' complete!</h1>\
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
          
          if (emptyLen > 0) {
            var sockHost = window.location.protocol + "//" + window.location.host;
            var socket = io.connect(sockHost);
            var gridId = $("#grid").data("grid-id");
            for (var i = 0; i < num; i++) {
              var idx = emptySquares.eq(0).data('idx');
              socket.emit('Grid.PowerUp', {
                PowerUp: {
                  grid: gridId,
                  position: idx,
                  color:color,
                  user: PowerUp.user
                }
              });
          
              var newSquare = $("ul#grid li:eq("+idx+")");
              newSquare.removeClass('inactive');
              newSquare.addClass('active');
              newSquare.addClass(color);      

              if(emptyLen != 400 && emptyLen % 40 == 0){
                gridMilestone();
              }
            }
          }
        } 
      });
    }
  }
});
