$(function(){
	if($('.star_rating').length>0) {
		// Star Rating
		var holder = $('input[type="hidden"][name="review[rate]"]');
		$('.star_rating a').click(function(){
			$(this).addClass('checked');
			$(holder).val($(this).attr('data-stars'));
		});
		$('.star_rating').hover(function(){
			$(this).find('.checked').removeClass('checked');
		},function(){
			if($(holder).val() != ''){
				$('.visual_star'+$(holder).val()).addClass('checked');
			}
		});
	}
});