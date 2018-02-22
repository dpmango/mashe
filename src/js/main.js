$(document).ready(function(){

  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  // detectors
  function isRetinaDisplay() {
    if (window.matchMedia) {
        var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
        return (mq && mq.matches || (window.devicePixelRatio > 1));
    }
  }

  function isMobile(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true
    } else {
      return false
    }
  }

  function msieversion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      return true
    } else {
      return false
    }
  }

  if ( msieversion() ){
    $('body').addClass('is-ie');
  }

  if ( isMobile() ){
    $('body').addClass('is-mobile');
  }


  // BREAKPOINT SETTINGS
  var bp = {
    mobileS: 375,
    mobile: 568,
    tablet: 768,
    desktop: 1024,
    wide: 1336,
    hd: 1680
  }

  ////////////
  // READY - triggered when PJAX DONE
  ////////////
  function pageReady(){
    legacySupport();

    updateHeaderActiveClass();
    initHeaderScroll();

    initPopups();
    initSliders();
    initScrollMonitor();
    initMasks();
    initTeleport();

    revealFooter();
    _window.on('resize', throttle(revealFooter, 100));

    // development helper
    _window.on('resize', debounce(setBreakpoint, 200))



    //SEARCH
    $('[jsOpenSearch]').on('click', function(){
      $('body').addClass('no-scroll');
      $('.search-panel').addClass('is-active');
      $('.search-panel__round').addClass('is-active');
      $('.search-panel__form').addClass('is-active');
      $('.search-panel__hint').addClass('is-active');
    });

    $('.search-panel__close').on('click', function(){
      $('body').removeClass('no-scroll');
      $('.search-panel__round').removeClass('is-active');
      $('.search-panel__form').removeClass('is-active');
      $('.search-panel__hint').removeClass('is-active');
      setTimeout(function(){
        $('.search-panel').removeClass('is-active');
      }, 500)
    });

    $('.search-panel__input').keyup(function(){
      if ($(this).val().length > 0) {
        $('.search-panel__btn').addClass('is-active');
        $('.search-panel__hint').addClass('is-hidden');
      } else {
        $('.search-panel__btn').removeClass('is-active');
        $('.search-panel__hint').removeClass('is-hidden');
      }
    });

    //MENU
    $('[jsOpenMenu]').on('click', function(){
      $('body').addClass('no-scroll');
      $('.main-nav').addClass('is-active');
      $('.main-nav__round').addClass('is-active');
      $('.main-nav__wrapper').addClass('is-active');
    });

    $('.main-nav__close').on('click', function(){
      $('body').removeClass('no-scroll');
      $('.main-nav__round').removeClass('is-active');
      $('.main-nav__wrapper').removeClass('is-active');
      setTimeout(function(){
        $('.main-nav').removeClass('is-active');
      }, 500)
    });
    
    
    // CATALOG
    $('.catalog-promo__secondsort input').change(function(){
      if ($('[jsTissue]').is(':checked')) {
        $('.sort-items').css('display', 'block');
      } else {
        $('.sort-items').css('display', 'none');
      }
    });
    
    // FOOTER TABS
      $('.footer__subtitle, .main-nav__submenu-title').on('click', function(){
        if (_window.width() < 768) {
        if ($(this).hasClass('is-active')) {
          $(this).removeClass('is-active');
          $(this).next('ul').slideUp(200);
        } else {
          $('.footer__subtitle, .main-nav__submenu-title').removeClass('is-active');
          $('.footer__subtitle, .main-nav__submenu-title').next('ul').slideUp(200);
          
          $(this).addClass('is-active');
          $(this).next('ul').slideDown(200);
        }
     } else {
      $('.footer__subtitle, .main-nav__submenu-title').removeClass('is-active');
      $('.footer__subtitle, .main-nav__submenu-title').next('ul').slideDown();
    }
      });
    
    // CATALOG PHOTO
    
    if ($('.catalog-info__wrap').length > 0) {
      var wrapOffset = $('.catalog-info__wrap').offset().left;
      if (_window.width() > 992) {
      $('.catalog-info__photo img').css('width', 'calc(100% + ' + wrapOffset + 'px)');
      }
    }
    
    _window.resize(function(){
      if ($('.catalog-info__wrap').length > 0) {
        var wrapOffset = $('.catalog-info__wrap').offset().left;
        if (_window.width() > 992) {
        $('.catalog-info__photo img').css('width', 'calc(100% + ' + wrapOffset + 'px)');
        }
      }  
    });
    
    _window.scroll(function () {
      // TO TOP BTN
		  if ($(this).scrollTop() > 950) {
		  	$('.to-top-btn').addClass('is-active')
		  } else {
		  	$('.to-top-btn').removeClass('is-active')
		  }
      
      // MENU/SEARCH/CART BUTTONS
      if ($(this).scrollTop() > 100) {
        $('.header__menu, .header__search, .header__cart, .header__like').addClass('is-active')
      } else {
        $('.header__menu, .header__search, .header__cart, .header__like').removeClass('is-active')
      }
	  });
    
    $('a[href*="#"]:not([href="#"])').click(function () {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				$('html, body').animate({
					scrollTop: target.offset().top
				}, 1200);
				return false;
			}
		}
	});
    
  }

  pageReady();


  //////////
  // COMMON
  //////////

  function legacySupport(){
    // svg support for laggy browsers
    svg4everybody();

    // Viewport units buggyfill
    window.viewportUnitsBuggyfill.init({
      force: true,
      refreshDebounceWait: 150,
      appendToBody: true
    });
  }



  // Prevent # behavior
	_document
    .on('click', '[href="#"]', function(e) {
  		e.preventDefault();
  	})
    .on('click', 'a[href^="#section"]', function() { // section scroll
      var el = $(this).attr('href');
      $('body, html').animate({
          scrollTop: $(el).offset().top}, 1000);
      return false;
    })

  // FOOTER REVEAL
  function revealFooter() {
    var footer = $('[js-reveal-footer]');
    if (footer.length > 0) {
      var footerHeight = footer.outerHeight();
      var maxHeight = _window.height() - footerHeight > 100;
      if (maxHeight && !msieversion() ) {
        $('body').css({
          'margin-bottom': footerHeight
        });
        footer.css({
          'position': 'fixed',
          'z-index': -10
        });
      } else {
        $('body').css({
          'margin-bottom': 0
        });
        footer.css({
          'position': 'static',
          'z-index': 10
        });
      }
    }
  }

  // HEADER SCROLL
  // add .header-static for .page or body
  // to disable sticky header
  function initHeaderScroll(){
    if ( $('.header-static').length == 0 ){
      _window.on('scroll', throttle(function() {
        var vScroll = _window.scrollTop();
        var header = $('.header').not('.header--static');
        var headerHeight = header.height();
        var heroHeight = $('.hero').outerHeight() - headerHeight;
        // probably should be found as a first child of page contents

        if ( vScroll > headerHeight ){
          header.addClass('header--transformed');
        } else {
          header.removeClass('header--transformed');
        }

        if ( vScroll > heroHeight ){
          header.addClass('header--fixed');
        } else {
          header.removeClass('header--fixed');
        }
      }, 10));
    }
  }

  // HAMBURGER TOGGLER
  _document.on('click', '[js-hamburger]', function(){
    $(this).toggleClass('is-active');
    $('.header').toggleClass('is-menu-opened')
    $('[js-header-menu]').toggleClass('is-active');
    $('.mobile-navi').toggleClass('is-active');
  });

  function closeMobileMenu(){
    $('[js-hamburger]').removeClass('is-active');
    $('.header').removeClass('is-menu-opened')
    $('[js-header-menu]').removeClass('is-active');
    $('.mobile-navi').removeClass('is-active');
  }

  // SET ACTIVE CLASS IN HEADER
  // * could be removed in production and server side rendering
  // user .active for li instead
  function updateHeaderActiveClass(){
    $('.header__menu li').each(function(i,val){
      if ( $(val).find('a').attr('href') == window.location.pathname.split('/').pop() ){
        $(val).addClass('is-active');
      } else {
        $(val).removeClass('is-active')
      }
    });
  }


  // VIDEO PLAY
  _document.on('click', '.promo-video .icon', function(){
    $(this).closest('.promo-video').toggleClass('playing');
    $(this).closest('.promo-video').find('iframe').attr("src", $("iframe").attr("src").replace("autoplay=0", "autoplay=1"));
  });


  //////////
  // SLIDERS
  //////////

  function initSliders(){
    var slickNextArrow = '<div class="slick-prev"><svg class="ico ico-back-arrow"><use xlink:href="img/sprite.svg#ico-back-arrow"></use></svg></div>';
    var slickPrevArrow = '<div class="slick-next"><svg class="ico ico-next-arrow"><use xlink:href="img/sprite.svg#ico-next-arrow"></use></svg></div>'

    // General purpose sliders
    $('[js-slider]').each(function(i, slider){
      var self = $(slider);

      // set data attributes on slick instance to control
      if (self && self !== undefined) {
        self.slick({
          autoplay: self.data('slick-autoplay') !== undefined ? true : false,
          dots: self.data('slick-dots') !== undefined ? true : false,
          arrows: self.data('slick-arrows') !== undefined ? true : false,
          prevArrow: slickNextArrow,
          nextArrow: slickPrevArrow,
          infinite: self.data('slick-infinite') !== undefined ? true : true,
          speed: 300,
          slidesToShow: 1,
          accessibility: false,
          adaptiveHeight: true,
          draggable: self.data('slick-no-controls') !== undefined ? false : true,
          swipe: self.data('slick-no-controls') !== undefined ? false : true,
          swipeToSlide: self.data('slick-no-controls') !== undefined ? false : true,
          touchMove: self.data('slick-no-controls') !== undefined ? false : true
        });
      }

    })

    // other individual sliders goes here

    // SLICK - UNSLICK EXAMPLE
    // used when slick should be disabled on certain breakpoints

    // var _socialsSlickMobile = $('.socials__wrapper');
    // var socialsSlickMobileOptions = {
    //   mobileFirst: true,
    //   dots: true,
    //   responsive: [
    //     {
    //       breakpoint: 0,
    //       settings: {
    //         slidesToShow: 1,
    //         slidesToScroll: 1,
    //       }
    //     },
    //     {
    //       breakpoint: 568,
    //       settings: {
    //         slidesToShow: 2,
    //         slidesToScroll: 2,
    //       }
    //
    //     },
    //     {
    //       breakpoint: 992,
    //       settings: "unslick"
    //     }
    //
    //   ]
    // }
    // _socialsSlickMobile.slick(socialsSlickMobileOptions);
    //
    // _window.on('resize', debounce(function(e){
    //   if ( _window.width() > 992 ) {
    //     if (_socialsSlickMobile.hasClass('slick-initialized')) {
    //       _socialsSlickMobile.slick('unslick');
    //     }
    //     return
    //   }
    //   if (!_socialsSlickMobile.hasClass('slick-initialized')) {
    //     return _socialsSlickMobile.slick(socialsSlickMobileOptions);
    //   }
    // }, 300));


    // CLIENTS SLIDER
    $('[jsClientsSlider]').slick({
      arrows: true,
      accessibility: false,
      dots: false,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3500,
      responsive: [
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: false,
        centerPadding: '70px',
        centerMode: true
      }
    },
        {
      breakpoint: 850,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        centerPadding: '150px',
        centerMode: true
      }
    },
        {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true
      }
    }
        ]
    });
    
    // PHOTOS SLIDER
    $('[jsPhotosSlider]').slick({
      arrows: false,
      accessibility: false,
      dots: false,
      slidesToShow: 7,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3500,
      responsive: [
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 5
      }
    },
        {
      breakpoint: 568,
      settings: {
        slidesToShow: 3
      }
    }
        ]
    });


    // POPULAR SLIDER
    $('[jsPopularSlider]').slick({
      arrows: true,
      accessibility: false,
      dots: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3500,
      responsive: [
    {
      breakpoint: 1336,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    },
        {
      breakpoint: 991,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: false
      }
    },
        {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false
      }
    }
        ]
    });
    
    // RECENT SLIDER
    $('[jsRecentSlider]').slick({
      arrows: true,
      accessibility: false,
      dots: true,
      slidesToShow: 6,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3500,
      responsive: [
    {
      breakpoint: 1336,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1
      }
    },
      {
      breakpoint: 1110,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1
      }
    },
        {
      breakpoint: 991,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false
      }
    },
        {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: false
      }
    },
        {
      breakpoint: 450,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false
      }
    }
        ]
    });

    // MAIN SLIDER
    $('[jsMainSlider]').slick({
      arrows: false,
      dots: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3500
    });
    
    // PRODUCT SLIDER
    $('[jsProductSlider]').slick({
      arrows: true,
      dots: false,
      slidesToShow: 1,
      slidesToScroll: 1
    });
    
    // EXAMPLES SLIDER
    var _socialsSlickMobile = $('[jsExamplesSlider]');
    var socialsSlickMobileOptions = {
      arrows: false,
      dots: true,
      slidesToShow: 1,
      slidesToScroll: 1
     }
     //_socialsSlickMobile.slick(socialsSlickMobileOptions);
    
     _window.on('resize', debounce(function(e){
       if ( _window.width() > 767 ) {
         if (_socialsSlickMobile.hasClass('slick-initialized')) {
           _socialsSlickMobile.slick('unslick');
         }
         return
       }
       if (!_socialsSlickMobile.hasClass('slick-initialized')) {
         return _socialsSlickMobile.slick(socialsSlickMobileOptions);
       }
     }, 300));

  }

  //////////
  // MODALS
  //////////

  function initPopups(){
    // Magnific Popup
    var startWindowScroll = 0;
    $('[js-popup]').magnificPopup({
      type: 'inline',
      fixedContentPos: true,
      fixedBgPos: true,
      overflowY: 'auto',
      closeBtnInside: true,
      preloader: false,
      midClick: true,
      removalDelay: 300,
      mainClass: 'popup-buble',
      callbacks: {
        beforeOpen: function() {
          startWindowScroll = _window.scrollTop();
          // $('html').addClass('mfp-helper');
        },
        close: function() {
          // $('html').removeClass('mfp-helper');
          _window.scrollTop(startWindowScroll);
        }
      }
    });

    $('[js-popup-gallery]').magnificPopup({
  		delegate: 'a',
  		type: 'image',
  		tLoading: 'Загрузка #%curr%...',
  		mainClass: 'popup-buble',
  		gallery: {
  			enabled: true,
  			navigateByImgClick: true,
  			preload: [0,1]
  		},
  		image: {
  			tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
  		}
  	});
  }

  function closeMfp(){
    $.magnificPopup.close();
  }

  ////////////
  // UI
  
  
  $('[jsSelect]').selectric();

  // custom selects
  _document.on('click', '.ui-select__visible', function(e){
    var that = this
    // hide parents
    $(this).parent().parent().parent().find('.ui-select__visible').each(function(i,val){
      if ( !$(val).is($(that)) ){
        $(val).parent().removeClass('active')
      }
    });

    $(this).parent().toggleClass('active');
  });

  _document.on('click', '.ui-select__dropdown span', function(){
    // parse value and toggle active
    var value = $(this).data('val');
    if (value){
      $(this).siblings().removeClass('active');
      $(this).addClass('active');

      // set visible
      $(this).closest('.ui-select').removeClass('active');
      $(this).closest('.ui-select').find('input').val(value);

      $(this).closest('.ui-select').find('.ui-select__visible span').text(value);
    }

  });

  // textarea autoExpand
  _document
    .one('focus.autoExpand', '.ui-group textarea', function(){
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.autoExpand', '.ui-group textarea', function(){
        var minRows = this.getAttribute('data-min-rows')|0, rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
        this.rows = minRows + rows;
    });

  // Masked input
  function initMasks(){
    $("[js-dateMask]").mask("99.99.99",{placeholder:"ДД.ММ.ГГ"});
    $("input[type='tel']").mask("+7 (000) 000-0000", {placeholder: "+7 (___) ___-____"});
  }


  ////////////
  // TELEPORT PLUGIN
  ////////////
  function initTeleport(){
    $('[js-teleport]').each(function (i, val) {
      var self = $(val)
      var objHtml = $(val).html();
      var target = $('[data-teleport-target=' + $(val).data('teleport-to') + ']');
      var conditionMedia = $(val).data('teleport-condition').substring(1);
      var conditionPosition = $(val).data('teleport-condition').substring(0, 1);

      if (target && objHtml && conditionPosition) {

        function teleport() {
          var condition;

          if (conditionPosition === "<") {
            condition = _window.width() < conditionMedia;
          } else if (conditionPosition === ">") {
            condition = _window.width() > conditionMedia;
          }

          if (condition) {
            target.html(objHtml)
            self.html('')
          } else {
            self.html(objHtml)
            target.html("")
          }
        }

        teleport();
        _window.on('resize', debounce(teleport, 100));


      }
    })
  }

  ////////////
  // SCROLLMONITOR - WOW LIKE
  ////////////
  function initScrollMonitor(){
    $('.wow').each(function(i, el){

      var elWatcher = scrollMonitor.create( $(el) );

      var delay;
      if ( $(window).width() < 768 ){
        delay = 0
      } else {
        delay = $(el).data('animation-delay');
      }

      var animationClass = $(el).data('animation-class') || "wowFadeUp"

      var animationName = $(el).data('animation-name') || "wowFade"

      elWatcher.enterViewport(throttle(function() {
        $(el).addClass(animationClass);
        $(el).css({
          'animation-name': animationName,
          'animation-delay': delay,
          'visibility': 'visible'
        });
      }, 100, {
        'leading': true
      }));
      elWatcher.exitViewport(throttle(function() {
        $(el).removeClass(animationClass);
        $(el).css({
          'animation-name': 'none',
          'animation-delay': 0,
          'visibility': 'hidden'
        });
      }, 100));
    });

  }

  //////////
  // BARBA PJAX
  //////////

  Barba.Pjax.Dom.containerClass = "page";

  var FadeTransition = Barba.BaseTransition.extend({
    start: function() {
      Promise
        .all([this.newContainerLoading, this.fadeOut()])
        .then(this.fadeIn.bind(this));
    },

    fadeOut: function() {
      var deferred = Barba.Utils.deferred();

      anime({
        targets: this.oldContainer,
        opacity : .5,
        easing: [.02, .01, .47, 1], // swing
        duration: 250,
        complete: function(anim){
          deferred.resolve();
        }
      });

      return deferred.promise
    },

    fadeIn: function() {
      var _this = this;
      var $el = $(this.newContainer);

      $(this.oldContainer).hide();

      $el.css({
        visibility : 'visible',
        opacity : .5
      });

      document.body.scrollTop = 0;

      anime({
        targets: $el.get(0),
        opacity: 1,
        easing: [.02, .01, .47, 1], // swing
        duration: 200,
        complete: function(anim) {
          triggerBody()
          _this.done();
        }
      });
    }
  });

  Barba.Pjax.getTransition = function() {
    return FadeTransition;
  };

  Barba.Prefetch.init();
  Barba.Pjax.start();

  Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {

    pageReady();
    closeMobileMenu();

  });

  function triggerBody(){
    $(window).scroll();
    $(window).resize();
  }


  //////////
  // DEVELOPMENT HELPER
  //////////
  function setBreakpoint(){
    var wHost = window.location.host.toLowerCase()
    var displayCondition = wHost.indexOf("localhost") >= 0 || wHost.indexOf("surge") >= 0
    if (displayCondition){
      console.log(displayCondition)
      var wWidth = _window.width();

      var content = "<div class='dev-bp-debug'>"+wWidth+"</div>";

      $('.page').append(content);
      setTimeout(function(){
        $('.dev-bp-debug').fadeOut();
      },1000);
      setTimeout(function(){
        $('.dev-bp-debug').remove();
      },1500)
    }
  }

});
