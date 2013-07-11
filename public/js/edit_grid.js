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
  
  $('#data_fields').on('keydown', "input", function(){
    if($("#data_fields input").last().val() != ""){
      var count = $("#data_fields input").length;
      var new_field = $('<div class="field">\
  			<label>DATA '+(count+1)+'</label>\
  			<input type="text" name="grid[dataTypes][' + count + '][name]"\
  			  value="" placeholder="optional" class="med" />\
  			<select name="grid[dataTypes][' + count + '][dataType]"\
  			  class="small">\
  				<option value="number">Number</option>\
  				<option value="text">Text</option>\
  			</select>\
  	  </div>');
  	  $("#data_fields").append(new_field);
    }
  });
  
  $('label').on('mouseover',function(){
    $('#info').remove();
    
    var elem = $(this);
    var text = elem.data('info');
    if (!text) { return; }
    var info = $("<div id='info'>"+text+"</div>");
    var pos = elem.offset();
    info.css({ top:pos.top, left:(pos.left-230)});
    
    $('body').append(info);
  });
  
  $('label').on('mouseout',function(){
    $('#info').remove();
  });
  
  $(".delete a.delete").on('click', function (ev) {
    ev.preventDefault();
    var sure = confirm("Are you sure? All of this grid's data will be gone forever!");
    
    if (!sure) { return; }
    
    $(ev.currentTarget).parents("form.delete").submit();    
  });
});
