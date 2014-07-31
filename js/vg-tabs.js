$(function(){
	$('.tabs .tabs-switch li').on('click', function(){
		$('.tabs .tabs-switch li.active').removeClass('active');
		$(this).addClass('active');

		var panelToShow = $(this).attr('rel');

		$('.tabs .tab-panel.active').fadeOut(200, showNextPanel);

		function showNextPanel(){
			$(this).removeClass('active');
			$('#'+panelToShow).fadeIn(250, function(){
				$(this).addClass('active');
			});
		}
	});
});