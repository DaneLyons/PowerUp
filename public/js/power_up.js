var PowerUp = {
  Models: {},
  Views: {},
  Collections: {}
};

(function () {
  PowerUp.Models.User = Backbone.Model.extend({});
  
  PowerUp.Models.PowerUp = Backbone.Model.extend({});
  PowerUp.Collections.PowerUps = Backbone.Collection.extend({
    model: PowerUp.Models.PowerUp
  });
  
  PowerUp.Models.Grid = Backbone.Model.extend({
    initialize: function () {
      this.powerUps = new Backbone.Collection(this.powerUps);
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
      this.$el.css({ width: this.size, height: this.size}); 
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
      "click .collaborate .expand.button": "expandCollaborators"
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
    }
  });
})();