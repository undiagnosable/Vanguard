 $(document).ready(function($) {
    $('.vg-accordion').find('.accordion-toggle').click(function(){

      $(this).next().slideToggle('fast');

      $(".accordion-content").not($(this).next()).slideUp('fast');

      $('.accordion-toggle').removeClass('active');

      if($(this).next().is(':visible')){
          $(this).addClass('active');
      }
      
    });
 });