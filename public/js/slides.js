var useCases = [
  { goal:"Lose Weight", units:["10 Push-Ups","20 Sit-Ups","Run 10 Minutes"] },
  { goal:"Become a Better Writer", units:["Write 15 Minutes","Read 15 Minutes","Study 15 Minutes"] },
  { goal:"Eat Healthier", units:["Cook a Meal","Drink Glass of Water","Refuse Dessert"] },
  { goal:"Get Stronger", units:["Weights: 10 Reps","Cardio: 5 Minutes","Sports: 30 Minutes"] },
  { goal:"Become a Better Programmer", units:["Code: 15 Minutes","Study: 15 Minutes","Write Blog Post"] },
  { goal:"Learn to Play Guitar", units:["Play: 15 Minutes","Study: 15 Minutes","Write Lyrics"] },
  { goal:"Become a Blogger", units:["Write Blog Post","Write Comment","Read Blog Post"] },
  { goal:"Allowance Grid", units:["Clean Room","Do Dishes","Take out Trash"] },
  { goal:"Game Leaderboard", units:["John Wins","Sarah Wins","Tie"] },
  { goal:"Save Money", units:["Cheap Dinner","Purchased Discount Item","Put $15 in Savings"] },
  { goal:"Become More Creative", units:["Documented Idea","Read: 30 Minutes","Art Project: 15 Minutes"] },
  { goal:"Be More Informed", units:["Read News: 15 Minutes","Study: 15 Minutes","Talk to Representative"] }
]

$(function(){
  $('.toc button').click(function(){
    var elem = $(this);
    var slide = elem.data('slide');
    
    //activate new toc button
    $('.toc button.active').removeClass('active');
    elem.addClass('active');
    
    //show slide
    var currentSlide = $('.slides .active');
    var newSlide = $('.slides .'+slide);
    
    if(newSlide.hasClass('seen')){
      currentSlide.removeClass('active seen');
    }else{
      currentSlide.removeClass('active');
      currentSlide.addClass('seen');
    }
    newSlide.addClass('active');
  });
  
  $('.content .next').click(function(ev){
    ev.preventDefault();
    var slide = $(this).data('slide');
    $('.toc button.'+slide).trigger('click');
  });
  
  $('button.clear').click(function(ev){
    ev.preventDefault();
    $('.work_unit,.goal').val('');
  });
  
  $('button.random').click(function(ev){
    ev.preventDefault();
    var useCase = useCases[Math.floor(Math.random() * useCases.length)];
    $('input.goal').val(useCase.goal);
    $('input.work_unit:eq(0)').val(useCase.units[0]);
    $('input.work_unit:eq(1)').val(useCase.units[1]);
    $('input.work_unit:eq(2)').val(useCase.units[2]);
  });
  
  $('button.submit').click(function(ev){
    return requiredCheck();
  });
  
  $('input').bind('keypress', function(e) {
  	if(e.keyCode==13){
  		$('button.submit').trigger('click');
  	}
  });
  
  function requiredCheck(){
    var submit = true;
    $('input.required').each(function(){
      if($(this).val() == ''){
        $(this).addClass('prompt');
        submit = false;
      }else{
        $(this).removeClass('prompt');
      }
    });
    return submit;
  }
});