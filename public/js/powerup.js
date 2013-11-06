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
        var uri = "wss://" + window.location.host;
    		var socket = io.connect(uri, { secure: true });
    		socket.on('connect', function () {
    		  var socketData = {
    		    gridId: grid.attributes._id,
    		    userId: PowerUp.currentUser.attributes._id
    		  };

    		  socket.emit("Grid.Join", socketData);

      		socket.on('Grid.Joined', function (data) {
      		  var userId = data.userId;
      		  
      		  tdSelector = ".collaborators.section td.user[data-user-id='" +
      		    userId + "']";
      		  var userTd = $(tdSelector);
      		  userTd.prepend('<div class="green-dot"></div>');
      		});
      		
      		socket.on('Grid.PowerUp.Created', function (data) {
      		  var powerUpAttr = data.power_up;
      		  powerUpAttr.grid = grid;
            var powerUp = new PowerUp.Models.PowerUp(powerUpAttr);
            powerUp.view = new PowerUp.Views.PowerUpView({
              el: $("#grid li:eq(" + powerUp.attributes.position + ")"),
              grid: grid,
              model: powerUp
            });
            var idx = $("ul#grid li.inactive").eq(0);
            powerUp.view.setPowerUp(idx);
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
      this.$('.sections .progress').css({ height: (section_height+60) });
      this.$('.sections #filter').css({ height: (section_height-30) });
      this.$('.sections #heatmap').css({ height: (section_height-30) });
      
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
          var sockHost = "wss://" + window.location.host;
          var socket = io.connect(sockHost, { secure: true });
          var gridId = $("#grid").data("grid-id");
          var idx = emptySquares.eq(0).index();
          var powerUpAttr = {
            grid: gridId,
            position: idx,
            color: color,
            user: PowerUp.user
          };
          socket.emit('Grid.PowerUp', {
            PowerUp: powerUpAttr
          });                   
        }
      }
    },
    gridMilestone: function () {
      var grid = $('#grid');
      var grid_pos = grid.offset();
      var grid_width = grid.width();
      var grid_height = grid.height();
      var percent_complete = $('.progress .percent').text();
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
      this.el = "ul#grid li:eq(" + this.model.attributes.position + ")";
      this.listenTo(this.model, 'change', this.render);
    },
    render: function () {
      this.$el.html(this.template(this.model.attributes));
    },
    setPowerUp: function (i) {
      var view = this;
      var grid_progress = $('#content .progress .percent');
      var grid = view.model.attributes.grid;
      
      setTimeout(function () {
        var filledLen = $("#grid li.active").length;
        var percent = Math.floor((filledLen / grid.attributes.size) * 100);
        if(filledLen>398){ 
          percent=100;
        }
        grid_progress.text(percent + '%');
        
        view.$el.removeClass('inactive');
        view.$el.addClass('active');
        if (view.model.attributes.color) {
          view.$el.addClass(view.model.attributes.color);
        }
      }, (i + 1) * 10)
    },
    
    events: {
      "click": "showMetadata"
    },
    
    showMetadata: function showMetadata(ev) {
      var powerUpView = this;
      var elem = powerUpView.$el;
      
      if (elem.hasClass('active')) {
        $('li.current').removeClass('current');
        elem.addClass('current');
        var popupView = new PowerUp.Views.PopupView({
          model: powerUpView.model
        });
        popupView.render();
      }
    }
  });
  
  PowerUp.Views.PopupView = Backbone.View.extend({
    template: _.template('<div id="popup">\
        <div class="arrow"></div>\
        <h1>POWERUP</h1>\
        <button class="close"></button>\
        <div class="time">\
          <%- new Date(createdAt).format("mmm dS yyyy, h:MM TT") %>\
          <span class="success">Data saved!</span>\
        </div>\
        \
        <% if (grid.attributes.dataTypes && grid.attributes.dataTypes.length) { %>\
          <% _.each(grid.attributes.dataTypes, function (dataType) { %>\
            <% if (!dataType) { return; } %>\
            <div class="data">\
              <label><%- dataType.name %></label>\
              <input type="<%- dataType.dataType %>" name="<%- dataType.name %>" class="data"\
              <% if (typeof metadata !== "undefined" && metadata[dataType.name]) { %> \
                value="<%- metadata[dataType.name] %>" \
              <% } %> \
              <% if (!PowerUp.currentUser || PowerUp.currentUser.id !== user.id) { %>\
                readonly\
              <% } %>\
              />\
            </div>\
          <% }); %>\
        <% } %>\
        \
        <div class="add">\
          <a href="<%- window.location + "/edit" %>">Edit</a>\
        </div>\
        <div class="delete">\
          <a href="#">Delete PowerUp</a>\
        </div>\
      </div>'),
    
    render: function () {
      $("#popup").remove();
      PowerUp.fuck = this.model.attributes;
      
      var createdAt = this.model.attributes.createdAt;
      if (createdAt) {
        createdAt = new Date(createdAt);
        var createdStr = createdAt.getMonth() + 1 + "/" + 
          createdAt.getDate() + "/" + createdAt.getFullYear() + ", " +
          createdAt.getHours() + ":" + createdAt.getMinutes();
          
        var sec = createdAt.getSeconds();
        if (sec < 9) { sec = "0" + sec }
        createdStr = createdStr + ":" + sec;
        this.model.attributes.createdAt = createdStr;
      } else {
        this.model.attributes.createdAt = "";
      }

      this.$el.html(this.template(this.model.attributes));
      
      var popup = this.$("#popup");
      var elem = this.model.view.$el;
      var offset = elem.offset();
      var windowHeight = $(window).height();
      
      popup.css({
        left: (offset.left + elem.width() + 14),
        top: (offset.top- 26),
        opacity: 1
      });
      $("body").append(this.el);
      popup.find('input').first().focus();
      
      var windowHeight = $(window).height();
      var popupHeight = popup.outerHeight();
      
      if((popupHeight+(offset.top- 26)) > windowHeight){
        var diff = (popupHeight+(offset.top- 26)) - windowHeight;
        popup.css({
          top:'-='+(diff+10)
        });
        $("#popup .arrow").css({
          top:'+='+(diff+10)
        });
      }
      
      
      //popup.animate({ left: '-=10', opacity: 1 }, 300);
    },
    
    events: {
      "change input.data": "updateData",
      "click .close": "closePopup",
      "click .delete a": "deletePowerUp"
    },
    
    closePopup: function closePopup(ev) {
      ev.preventDefault();
      this.$el.remove();
    },
    
    deletePowerUp: function deletePowerUp(ev) {
      ev.preventDefault();
      var popupView = this;
      var powerUp = popupView.model;
      
      $.ajax({
        url: "/powerups/" + powerUp.attributes._id,
        type: "DELETE",
        success: function (res) {
          var sel = "#grid li:eq(" + powerUp.attributes.position + ")";
          $(sel).remove();
        }
      });
    },
    
    updateData: function updateData(ev) {
      var popupView = this;
      var powerUp = popupView.model;
      var dataElem = $(ev.currentTarget);
      
      var dataAttr = {};
      var dataInputs = $("#popup input.data");
      for (var i = 0; i < dataInputs.length; i++) {
        var dataElem = $(dataInputs[i]);
        dataAttr[dataElem.attr('name')] = dataElem.val();
      }
      
      if (!powerUp.attributes.metadata) { powerUp.attributes.metadata = {}; }
      for (prop in dataAttr) {
        powerUp.attributes.metadata[prop] = dataAttr[prop];
      }
    
      var powerUpUrl = "/powerups/" + powerUp.attributes._id + "/data";
      $.ajax({
        type: "POST",
        url: powerUpUrl,
        data: dataAttr,
        statusCode: {
          200: function (data) {
            var successMsg = popupView.$(".success");
            successMsg.css("opacity", 1);
            setTimeout(function () {
              successMsg.animate({
                opacity: 0
              }, 500);
            }, 1000);
          }
        }
      });
    }
    
  });
  
})();
