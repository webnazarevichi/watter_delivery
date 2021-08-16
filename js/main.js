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
	$('.overlay').click(function(e) {
		if ($(e.target).closest('.modal').length == 0) {
			$(this).fadeOut();					
		}
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

	
	//Add class hamburger "active"
	$('.hamburger').click(function(){
		$('.hamburger').toggleClass('hamburger_active');
		//No scroll open menu
		$('body').toggleClass('overflow_hidden');	
	});
    
});
// Cart functions
$(function(){
	'use strict'; 
	// инициализация плагина
	$.jqCart({
		buttons: '.add_item',
		handler: './php/handler.php',
		cartLabel: '.label-place',
		visibleLabel: true,
		openByAdding: false,
		currency: '&#8381;'
	}); 
	// Пример с дополнительными методами
	$('#open').click(function(){
	  $.jqCart('openCart'); // открыть корзину
	});
	$('#clear').click(function(){
	  $.jqCart('clearCart'); // очистить корзину
	}); 
  });
  
  ;(function($) {
	'use strict';
	var cartData,
	  itemData,
	  orderPreview = '',
	  totalCnt = 0,
	  visibleLabel = false,
	  label = $('<div class="jqcart-cart-label"><img src="icons/корзина.png" alt="card"><span class="jqcart-total-cnt">0</span></div>'),
	  modal = '<div class="jqcart-layout"><div class="jqcart-checkout">123</div></div>',
	  orderform = '<p class="jqcart-cart-title">Контактная информация:</p><form class="jqcart-orderform"><p><input type="text" name="user_name" required><label>ФИО:</label></p><p><input type="number" name="user_phone" required><label>Телефон:</label></p><p><input type="text" name="user_mail" required><label>Email:</label></p><p><input type="text" name="user_address" required><label>Адрес:</label></p><p><textarea name="user_comment" required></textarea><label>Комментарий:</label></p><p><input type="submit" value="Оформить заказ"></p></form>';
	var opts = {
		buttons: '.add_item',
		cartLabel: 'body',
		visibleLabel: false,
		openByAdding: false,
		handler: '/',
		currency: '$'
	};
	var actions = {
	  init: function(o) {
		opts = $.extend(opts, o);
		cartData = actions.getStorage();
		if (cartData !== null && Object.keys(cartData).length) {
		  for (var key in cartData) {
			if (cartData.hasOwnProperty(key)) {
			  totalCnt += cartData[key].count;
			}
		  }
		  visibleLabel = true;
		}
		label.prependTo(opts.cartLabel)[visibleLabel || opts.visibleLabel ? 'show' : 'hide']()
		  .on('click', actions.openCart)
		  .find('.jqcart-total-cnt').text(totalCnt);
		$(document)
		  .on('click', opts.buttons, actions.addToCart)
		  .on('click', '.jqcart-layout', function(e) {
			if (e.target === this) {
			  actions.hideCart();
			}
		  })
		  .on('click', '.jqcart-incr', actions.changeAmount)
				  .on('input keyup', '.jqcart-amount', actions.changeAmount)
		  .on('click', '.jqcart-del-item', actions.delFromCart)
		  .on('submit', '.jqcart-orderform', actions.sendOrder)
		  .on('reset', '.jqcart-orderform', actions.hideCart)
				  .on('click', '.jqcart-print-order', actions.printOrder);
		return false;
	  },
	  addToCart: function(e) {
		e.preventDefault();
		itemData = $(this).data();
			  if(typeof itemData.id === 'undefined') {
				  console.log('Отсутствует ID товара');
				  return false;
			  }
		cartData = actions.getStorage() || {};
		if (cartData.hasOwnProperty(itemData.id)) {
		  cartData[itemData.id].count++;
		} else {
		  itemData.count = 1;
		  cartData[itemData.id] = itemData;
		}
		actions.setStorage(cartData);
		actions.changeTotalCnt(1);
		label.show();
			  if(opts.openByAdding) {
				  actions.openCart();
			  }
		return false;
	  },
	  delFromCart: function() {
		var $that = $(this),
		  line = $that.closest('.jqcart-tr'),
		  itemId = line.data('id');
		cartData = actions.getStorage();
		actions.changeTotalCnt(-cartData[itemId].count);
		delete cartData[itemId];
		actions.setStorage(cartData);
		line.remove();
		actions.recalcSum();
		return false;
	  },
	  changeAmount: function() {
		var $that = $(this),
				  manually = $that.hasClass('jqcart-amount'),
		  amount = +(manually ? $that.val() : $that.data('incr')),
		  itemId = $that.closest('.jqcart-tr').data('id');
		cartData = actions.getStorage();
			  if(manually) {
			cartData[itemId].count = isNaN(amount) || amount < 1 ? 1 : amount;
			  } else {
				  cartData[itemId].count += amount;
			  }
		if (cartData[itemId].count < 1) {
		  cartData[itemId].count = 1;
		}
			  if(manually) {
				  $that.val(cartData[itemId].count);
			  } else {
			$that.siblings('input').val(cartData[itemId].count);
			  }
		actions.setStorage(cartData);
		actions.recalcSum();
		return false;
	  },
	  recalcSum: function() {
		var subtotal = 0,
		  amount,
		  sum = 0,
		  totalCnt = 0;
		$('.jqcart-tr').each(function() {
		  amount = +$('.jqcart-amount', this).val();
		  sum = Math.ceil((amount * $('.jqcart-price', this).text()) * 100) / 100;
		  $('.jqcart-sum', this).html(sum + ' ' + opts.currency);
				  subtotal = Math.ceil((subtotal + sum) * 100) / 100;
		  totalCnt += amount;
		});
		$('.jqcart-subtotal strong').text(subtotal);
		$('.jqcart-total-cnt').text(totalCnt);
		if (totalCnt <= 0) {
				  actions.hideCart();
				  if(!opts.visibleLabel) {
			  label.hide();
				  }
		}
		return false;
	  },
	  changeTotalCnt: function(n) {
		var cntOutput = $('.jqcart-total-cnt');
		cntOutput.text((+cntOutput.text() + n));
		return false;
	  },
	  openCart: function() {
		var subtotal = 0,
			  cartHtml = '';
		cartData = actions.getStorage();
		orderPreview = '<p class="jqcart-cart-title">Корзина</p><div class="jqcart-table-wrapper"><div class="jqcart-manage-order"><div class="jqcart-thead"><div>ID</div><div></div><div>Наименование</div><div>Цена</div><div>Кол-во</div><div>Сумма</div><div></div></div>';
		var key, sum = 0;
		for (key in cartData) {
			if (cartData.hasOwnProperty(key)) {
						sum = Math.ceil((cartData[key].count * cartData[key].price) * 100) / 100;
						subtotal = Math.ceil((subtotal + sum) * 100) / 100;
						
			  orderPreview += '<div class="jqcart-tr" data-id="' + cartData[key].id + '">';
						orderPreview += '<div class="jqcart-small-td">' + cartData[key].id + '</div>';
						orderPreview += '<div class="jqcart-small-td jqcart-item-img"><img src="' + cartData[key].img + '" alt=""></div>';
			  orderPreview += '<div class="jqcart-wrapper"><div>' + cartData[key].title + '</div>';
			  orderPreview += '<div class="jqcart-price">' + cartData[key].price + '</div>';
			  orderPreview += '<div><span class="jqcart-incr" data-incr="-1">&#8211;</span><input type="text" class="jqcart-amount" value="' + cartData[key].count + '"><span class="jqcart-incr" data-incr="1">+</span></div></div>';
			  orderPreview += '<div class="jqcart-small-td jqcart-sum">' + sum + ' ' + opts.currency + '</div>';
						orderPreview += '<div class="jqcart-small-td"><span class="jqcart-del-item"></span></div>';
			  orderPreview += '</div>';
			}
		  }
		orderPreview += '</div></div>';
		orderPreview += '<div class="jqcart-subtotal">Итого: <strong>' + subtotal + '</strong> ' + opts.currency + '</div>';
			  
			  cartHtml = subtotal ? (orderPreview + orderform) : '<h2 class="jqcart-empty-cart">Корзина пуста</h2>';
		$(modal).appendTo('body').find('.jqcart-checkout').html(cartHtml);
	  },
	  hideCart: function() {
		$('.jqcart-layout').fadeOut('fast', function() {
		  $(this).remove();
		});
		return false;
	  },
	  sendOrder: function(e) {
		e.preventDefault();
		var $that = $(this);
		if ($.trim($('[name=user_name]', $that).val()) === '' || $.trim($('[name=user_phone]', $that).val()) === '') {
		  $('<p class="jqcart-error">Пожалуйста, укажите свое имя и контактный телефон!</p>').insertBefore($that).delay(3000).fadeOut();
		  return false;
		}
		$.ajax({
		  url: opts.handler,
		  type: 'POST',
				  dataType: 'json',
		  data: {
			orderlist: $.param(actions.getStorage()),
			userdata: $that.serialize()
		  },
		  error: function() {},
		  success: function(resp) {
			$('.jqcart-checkout').html('<p>' + resp.message + '</p>');
					  if(!resp.errors) {
						  setTimeout(methods.clearCart, 2000);
					  }
		  }
		});
	  },
		  
  
	  setStorage: function(o) {
		localStorage.setItem('jqcart', JSON.stringify(o));
		return false;
	  },
	  getStorage: function() {
		return JSON.parse(localStorage.getItem('jqcart'));
	  }
	};
	var methods = {
		  clearCart: function(){
			  localStorage.removeItem('jqcart');
			  label[opts.visibleLabel ? 'show' : 'hide']().find('.jqcart-total-cnt').text(0);
			  actions.hideCart();
		  },
		  openCart: actions.openCart,
		  printOrder: actions.printOrder,
		  test: function(){
			  actions.getStorage();
		  }
	  };
	$.jqCart = function(opts) {
	  if (methods[opts]) {
		return methods[opts].apply(this, Array.prototype.slice.call(arguments, 1));
	  } else if (typeof opts === 'object' || !opts) {
		return actions.init.apply(this, arguments);
	  } else {
		$.error('Метод с именем "' + opts + '" не существует!');
	  }
	};
  })(jQuery);


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