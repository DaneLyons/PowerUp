$(function () {
  $(".field a.delete.user").click(function (ev) {
    ev.preventDefault();
    var link = $(this);
    var name = link.parents(".field").find("input[type='text']").val();
    if (!confirm("Are you sure you want to remove " + name + "? This will delete all of their work!")) {
      return;
    }
        
    var user = link.data('user');
    var url = "/grids/" + link.data('grid-slug') + "/collaborators/delete";
    $.post(url, { user: user }, function (data) {
      var parent = link.parents(".field");
      parent.remove();
    });
  });
  
  $(".field a.delete.invite").click(function (ev) {
    ev.preventDefault();
    var link = $(this);
    var name = link.parents(".field").find("input[type='text']").val();
    if (!confirm("Are you sure you want to remove " + name + "?")) {
      return;
    }
    
    var invite = link.data('invite');
    var url = "/invites/" + invite + "/delete";
    $.post(url, {}, function (data) {
      var parent = link.parents(".field");
      parent.remove();
    });
  });
});