$(function () {
  PowerUp.GridMaster = {
    initializeGrid: function (opts) {
      if (opts) {
        for (prop in opts) {
          PowerUp[prop] = opts[prop];
        }
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
      
      milestone.css({
        left: grid_pos.left,
        width: grid_width,
        height: (grid_height / 4)
      });
      milestone.animate({ 
        top: (grid_pos.top+(grid_height/3)) 
      }, 1000, "easeOutBounce",
        function () {
          setTimeout(function(){
            milestone.animate({opacity:0},1000,function(){
              milestone.remove();
            });
        }, 5000);
      });
    }
 
  }
});
