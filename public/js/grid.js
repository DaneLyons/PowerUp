$(function () {
  $('#demo button').on('click', function () {
    $('#demo_screen').animate({ opacity: 0 }, 300, function () {
      $(this).remove();
    });
    $('#demo').animate({ top: -500 }, 300, function () {
      $(this).remove();
    });
  });
  
  $('#progress_section .nav button').on('click',function(){
    $('#progress_section').attr('class',$(this).attr('class'));
  });
  
  $(document).keydown(function(ev){   
    if($('#grid li.current').length > 0){
      if(ev.which == 37){
        //prev
        $('#grid li.current').prev('.active').trigger('click');
      }
      if(ev.which == 39){
        //next
        $('#grid li.current').next('.active').trigger('click');
      }
    }
  });
  
  $('#filter_button').on('click',function(){
    submitFilter();
  });
  
  $('#filter_attr').on('change',function(){
    var val = $(this).find(":selected").data('type');
    console.log(val);
    if(val=='text'){
      $('#filter_opp option.number').attr("disabled","disabled");
    }
    if(val=='number'){
      $('#filter_opp option.number').removeAttr("disabled");
    }
    $('#filter_opp').val('equal');
  });
  
  $('#filter').keypress(function(e) {
    if(e.which == 13) {
      submitFilter();
    }
  });
  
  $('button.s1').on('click',resetPowerUps);
  
  function submitFilter(){
    var attr = $('#filter_attr').val();
    var val = $('#filter_val').val();
    var opp = $('#filter_opp').val();
    filterPowerUps(attr,val,opp);
  }
  
  function filterPowerUps(attr,val,opp){
		for(var i=0;i<powerups.models.length;i++){
			var metadata = powerups.models[i].get("metadata");
			if(opp == 'less'){
			  if(metadata && parseInt(metadata[attr]) < parseInt(val)){
  				powerups.models[i].view.$el.css({ opacity:1 });
  			}else{
  				powerups.models[i].view.$el.css({ opacity:.15 });
  			}
			}
			
			if(opp == 'equal'){
			  if(metadata && metadata[attr] == val){
  				powerups.models[i].view.$el.css({ opacity:1 });
  			}else{
  				powerups.models[i].view.$el.css({ opacity:.15 });
  			}
			}
			
			if(opp == 'more'){
			  if(metadata && parseInt(metadata[attr]) > parseInt(val)){
  				powerups.models[i].view.$el.css({ opacity:1 });
  			}else{
  				powerups.models[i].view.$el.css({ opacity:.15 });
  			}
			}
		}
	}
	
	function resetPowerUps(){
		for(var i=0;i<powerups.models.length;i++){
			powerups.models[i].view.$el.css({ opacity:1 });
		}
	}
});