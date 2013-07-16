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
  
  $('#filter').on('change','.filter_attr',function(){
    var val = $(this).find(":selected").data('type');
    if(val=='text'){
      $(this).next('.filter_opp').find('option.number').attr("disabled","disabled");
    }
    if(val=='number'){
      $(this).next('.filter_opp').find('option.number').removeAttr("disabled");
    }
    $(this).next('.filter_opp').val('equal');
  });
  
  $('#filter').keypress(function(e) {
    if(e.which == 13) {
      submitFilter();
    }
  });
  
  $('button.s1').on('click',resetPowerUps);
  
  $('#filter button.and').on('click',function(){
    var filterHtml = $('#filter .filter').html();
    var filter = $('<div class="sub_filter group">'+filterHtml+'</button></div>');
    filter.find('label').text('AND');
    filter.find('button.and').removeClass('and').addClass('remove').text('-');
    
    $('#filter .group').last().after(filter);
  });
  
  $('#filter').on('click','button.remove',function(){
    $(this).parent('.group').remove();
  });
  
  function submitFilter(){
    var filters = []
    $('#filter .group').each(function(){
      var elem = $(this);
      var opt = {
        attr:elem.find('.filter_attr').val(),
        val:elem.find('.filter_val').val(),
        opp:elem.find('.filter_opp').val()
      };
      filters.push(opt);
    });
    filterPowerUps(filters);
  }
  
  function filterPowerUps(filters){
		for(var i=0;i<powerups.models.length;i++){
			var metadata = powerups.models[i].get("metadata");
			var opacity=1;
			for(var ii=0;ii<filters.length;ii++){
			  if(!metadata){
			    opacity=.15;
			  }
			  if(filters[ii].opp == 'less' && (metadata && parseInt(metadata[filters[ii].attr]) >= parseInt(filters[ii].val))){
			    opacity=.15;
			  }
			  if(filters[ii].opp == 'equal' && (metadata && metadata[filters[ii].attr] != filters[ii].val)){
			    opacity=.15;
			  }
			  if(filters[ii].opp == 'more' && (metadata && parseInt(metadata[filters[ii].attr]) <= parseInt(filters[ii].val))){
			    opacity=.15;
			  }
			}
			powerups.models[i].view.$el.css({ opacity:opacity });
		}
	}
	
	function resetPowerUps(){
		for(var i=0;i<powerups.models.length;i++){
			powerups.models[i].view.$el.css({ opacity:1 });
		}
	}
});