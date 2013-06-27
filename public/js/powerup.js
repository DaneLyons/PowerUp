var PowerUp = {
  Models: {},
  Views: {},
  Collections: {}
};

(function () {
  PowerUp.Models.User = Backbone.Model.extend({ });
  
  PowerUp.Models.PowerUp = Backbone.Model.extend({ });
  
  PowerUp.Collections.PowerUps = Backbone.Collection.extend({
    model: PowerUp.Models.PowerUp
  });
  
  PowerUp.Models.Grid = Backbone.Model.extend({
    initialize: function () {
      var grid = this;
      for (var i = 0; i < this.attributes.powerUps.length; i++) {
        var powerUpAttr = this.attributes.powerUps[i];
        powerUpAttr.grid = grid;
        var powerUp = new PowerUp.Models.PowerUp(powerUpAttr);
        powerUp.view = new PowerUp.Views.PowerUpView({
          el: $("#grid li:eq(" + powerUp.attributes.position + ")"),
          grid: grid,
          model: powerUp
        });
        powerUp.view.setPowerUp(i);
      }
      
      if (PowerUp.currentUser) {
        var uri = window.location.protocol + "//" + window.location.host;
    		var socket = io.connect(uri);
    		socket.on('connect', function () {
    		  var socketData = {
    		    gridId: grid.attributes._id,
    		    userId: PowerUp.currentUser.attributes._id
    		  };
    		  console.log(socketData);
    		  socket.emit("Grid.Join", socketData);

      		socket.on('Grid.Joined', function (data) {
      		  var userId = data.userId;
      		  
      		  tdSelector = ".collaborators.section td.user[data-user-id='" +
      		    userId + "']";
      		  var userTd = $(tdSelector);
      		  console.log(userTd);
      		  userTd.prepend('<div class="green-dot"></div>');
      		  console.log(userId);
      		  console.log("JOINED!!!");
      		});
    		});
      }
      
      return this;
    }
  });
  
  PowerUp.Views.GridView = Backbone.View.extend({
    el: $("#grid"),
    initialize: function () {
      var window_height = $(window).height();
      var window_width = $(window).width();
      $('#page').css({ height: window_height });

      // make sure there's room at the bottom
      this.size = window_height-155;
      if ((this.size + 40) > (window_width / 2)) {
        this.size = (window_width / 2) - 40;
      }
      this.$el.css({ width: this.size, height: this.size }); 
    }
  });
  
  PowerUp.Views.GridContentView = Backbone.View.extend({
    el: $("#content"),
    isExpanded: false,
    initialize: function () {
      var window_height = $(window).height();
      var window_width = $(window).width();
      
      var content_width = window_width - this.model.view.size - 60;
      var content_height = window_height - 155;
      this.$el.css({ width: content_width, height: content_height });
      
      var section_height = content_height-300;
      this.$('.collaborators').css({ height: section_height });
      this.$('.sections .about').css({ height: section_height });
      
      var legend_buttons = this.$('.legend button');
      var legend_width = content_width / legend_buttons.length;
      for (var i = 0; i < legend_buttons.length; i++) {
        this.$('.legend button:eq(' + i + ')').css({ width: legend_width });
      }
    },
  
    events: {
      "click .controls button": "showSection",
      "click .collaborate .expand.button": "expandCollaborators",
      "click .legend button.powerup": "addPowerUp"
    },
  
    showSection: function showSection(ev) {
      var target = $(ev.currentTarget);
      this.$(".controls button").removeClass('active');
      target.addClass('active');

      var section = target.data('show');
      $(".sections .section").hide();
      $(".sections ."+section).show();
    },
  
    expandCollaborators: function expandCollaborators(ev) {
      ev.preventDefault();
      if (isExpanded) {
        this.$(".collaborate form.new_collaborator").animate({
          opacity: 0
        }, 200);
        this.isExpanded = false;
      } else {
        this.$(".collaborate form.new_collaborator").animate({
          opacity: 1
        }, 200);

        this.isExpanded = true;
      }
    },
    
    addPowerUp: function (ev) {
      ev.preventDefault();
      var btn = $(ev.currentTarget);
      var gridContentView = this;
      
      if (!btn.hasClass('disabled')) {
        var color = btn.data('color');
        var emptySquares = $("ul#grid li.inactive");
        var emptyLen = emptySquares.length;
        
        if (emptyLen > 0) {
          var sockHost = window.location.protocol + "//" + window.location.host;
          var socket = io.connect(sockHost);
          var gridId = $("#grid").data("grid-id");
          var idx = emptySquares.eq(0).index();
          socket.emit('Grid.PowerUp', {
            PowerUp: {
              grid: gridId,
              position: idx,
              color: color,
              user: PowerUp.user
            }
          });
          var newSquare = $("ul#grid li:eq("+idx+")");
          newSquare.removeClass('inactive');
          newSquare.addClass('active');
          newSquare.addClass(color);      

          var filledLen = $("#grid li.active").length;
          var grid = gridContentView.model;
          var grid_progress = $("#content .progress");
          var percent = Math.floor((filledLen / grid.attributes.size) * 100);
          grid_progress.text(percent + '%');

          if (emptyLen != 400 && emptyLen % 40 == 0){
            gridContentView.gridMilestone();
          }
        }
      }
    },
    gridMilestone: function () {
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
  });
  
  PowerUp.Views.PowerUpView = Backbone.View.extend({
    template: _.template('<li class="inactive">\
      <div class="square"></div>\
    </li>'),
    initialize: function () {
      this.el = "ul#grid li:eq(" + this.options.model.attributes.position + ")";
      this.listenTo(this.model, 'change', this.render);
    },
    render: function () {
      this.$el.html(this.template(this.model.attributes));
    },
    setPowerUp: function (i) {
      var view = this;
      var grid_progress = $('#content .progress');
      var grid = view.model.attributes.grid;
      
      setTimeout(function () {
        var filledLen = $("#grid li.active").length;
        var percent = Math.floor((filledLen / grid.attributes.size) * 100);
        grid_progress.text(percent + '%');
        
        view.$el.removeClass('inactive');
        view.$el.addClass('active');
        if (view.model.attributes.color) {
          view.$el.addClass(view.model.attributes.color);
        }
      }, (i + 1) * 25)
    }
  });
})();