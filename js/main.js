// Preloader

$(window).on('load', function() {
  $('.preloader').delay(500).fadeOut('slow');
});


// Slick slider
$(document).ready(function(){
    $('.sale__carousel').slick({
      prevArrow: '<button type="button" class="slick-prev"><img src="icons/left.svg"></button>',
      nextArrow: '<button type="button" class="slick-next"><img src="icons/right.svg"></button>',
      speed: 1200,
	  responsive: [
		{
			breakpoint: 767,
			settings: {
				dots: true,
				arrows: false
			}
		}
	  ]
    //   autoplay: true,
    //   autoplaySpeed: 3000
    });

    // Modal form
    $('[data-modal=consultation]').on('click', function(){
      $('.overlay, #consultation').fadeIn('slow');
    });
    $('.modal__close').on('click', function(){
      $('.overlay, #consultation, #thanks').fadeOut('slow');
    });

    // Modal submit


    //Scroll back to top
    var progressPath = document.querySelector('.progress-wrap path');
		var pathLength = progressPath.getTotalLength();
		progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
		progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
		progressPath.style.strokeDashoffset = pathLength;
		progressPath.getBoundingClientRect();
		progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';		
		var updateProgress = function () {
			var scroll = $(window).scrollTop();
			var height = $(document).height() - $(window).height();
			var progress = pathLength - (scroll * pathLength / height);
			progressPath.style.strokeDashoffset = progress;
		}
		updateProgress();
		$(window).scroll(updateProgress);	
		var offset = 50;
		var duration = 550;
		jQuery(window).on('scroll', function() {
			if (jQuery(this).scrollTop() > offset) {
				jQuery('.progress-wrap').addClass('active-progress');
			} else {
				jQuery('.progress-wrap').removeClass('active-progress');
			}
		});				
		jQuery('.progress-wrap').on('click', function(event) {
			event.preventDefault();
			jQuery('html, body').animate({scrollTop: 0}, duration);
			return false;
		});


    
  });



// Add active class to hamburger
  window.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.header__menu'),
    menuItem = document.querySelectorAll('.menu_item'),
    hamburger = document.querySelector('.hamburger');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('hamburger_active');
        menu.classList.toggle('header__menu_active');
    });

    menuItem.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.toggle('hamburger_active');
            menu.classList.toggle('header__menu_active');
        })
    });
});



//Circle menu
document.addEventListener('DOMContentLoaded', () => {
	const revealerNav = window.revealer({
	  revealElementSelector: '.nav-js',
	  options: {
		anchorSelector: '.nav-btn-js',
	  },
	});
  
	const actionBtn = document.querySelector('.nav-btn-js');
	actionBtn.addEventListener('click', () => {
	  if (!revealerNav.isRevealed()) {
		revealerNav.reveal();
		actionBtn.setAttribute('data-open', true);
	  } else {
		revealerNav.hide();
		actionBtn.setAttribute('data-open', false);
	  }
	});
  });