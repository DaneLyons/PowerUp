if (!PowerUp) {
  var PowerUp = {
    Models: {},
    Views: {},
    Collections: {}
  };
}

$(function () {
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
    el: $("#grid")
  });
  
  PowerUp.Views.GridContentView = Backbone.View.extend({
    el: $("#content"),
    isExpanded: false,
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
});