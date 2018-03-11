$(document).ready(function() {

  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  function isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
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

  if (msieversion()) {
    $('body').addClass('is-ie');
  }

  if (isMobile()) {
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
  function pageReady() {
    legacySupport();

    initPopups();
    initSliders();
    initScrollMonitor();
    _window.on('resize', debounce(initScrollMonitor, 300))
    initMasks();
    initScrollbars();
    
    initMap();

  }

  pageReady();


  //////////
  // COMMON
  //////////

  function legacySupport() {
    // svg support for laggy browsers
    svg4everybody();

    // Viewport units buggyfill
    window.viewportUnitsBuggyfill.init({
      force: false,
      refreshDebounceWait: 150,
      appendToBody: true
    });
  }


  function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
      e.preventDefault();
    e.returnValue = false;
  }

  function preventDefaultForScrollKeys(e) {
    if (preventKeys[e.keyCode]) {
      preventDefault(e);
      return false;
    }
  }

  // SCROLL
  function disableScroll() {
    var target = $('body').get(0)
    if (window.addEventListener) // older FF
      target.addEventListener('DOMMouseScroll', preventDefault, false);
    target.onwheel = preventDefault; // modern standard
    target.onmousewheel = target.onmousewheel = preventDefault; // older browsers, IE
    target.ontouchmove = preventDefault; // mobile
    target.onkeydown = preventDefaultForScrollKeys;
  }

  function enableScroll() {
    var target = $('body').get(0)
    if (window.removeEventListener)
      target.removeEventListener('DOMMouseScroll', preventDefault, false);
    target.onmousewheel = target.onmousewheel = null;
    target.onwheel = null;
    target.ontouchmove = null;
    target.onkeydown = null;
  }

  // Prevent # behavior
  _document
    .on('click', '[href="#"]', function(e) {
      e.preventDefault();
    })
    .on('click', 'a[href^="#section"]', function() { // section scroll
      var el = $(this).attr('href');
      $('body, html').animate({
        scrollTop: $(el).offset().top
      }, 1000);
      return false;
    })

  //////////////
  // GENERAL - CLICK HANDLERS
  /////////////

  // MENU - HAMBURGER
  _document
    .on('click', '[jsOpenMenu]', function() {
      disableScroll();
      $('.main-nav').addClass('is-active');
      $('.main-nav__round').addClass('is-active');
      $('.main-nav__wrapper').addClass('is-active');
    })

    .on('click', '.main-nav__close', function() {
      enableScroll();
      $('.main-nav__round').removeClass('is-active');
      $('.main-nav__wrapper').removeClass('is-active');
      setTimeout(function() {
        $('.main-nav').removeClass('is-active');
      }, 400)
    })

  //SEARCH
  _document
    .on('click', '[jsOpenSearch]', function() {
      disableScroll();
      $('.search-panel').addClass('is-active');
      $('.search-panel__round').addClass('is-active');
      $('.search-panel__form').addClass('is-active');
      $('.search-panel__hint').addClass('is-active');
    })

    .on('click', '.search-panel__close', function() {
      enableScroll();
      $('.search-panel__round').removeClass('is-active');
      $('.search-panel__form').removeClass('is-active');
      $('.search-panel__hint').removeClass('is-active');
      setTimeout(function() {
        $('.search-panel').removeClass('is-active');
      }, 400)
    })

  // search panel
  $('.search-panel__input').keyup(function() {
    if ($(this).val().length > 0) {
      $('.search-panel__btn').addClass('is-active');
      $('.search-panel__hint').addClass('is-hidden');
    } else {
      $('.search-panel__btn').removeClass('is-active');
      $('.search-panel__hint').removeClass('is-hidden');
    }
  });


  // CATALOG
  $('.catalog-promo__secondsort input').change(function() {
    if ($('[jsTissue]').is(':checked')) {
      $('.sort-items').css('display', 'block');
    } else {
      $('.sort-items').css('display', 'none');
    }
  });

  // FOOTER TABS
  $('.footer__subtitle, .main-nav__submenu-title').on('click', function() {
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

  _window.on('resize', debounce(function() {
    if ($('.catalog-info__wrap').length > 0) {
      var wrapOffset = $('.catalog-info__wrap').offset().left;
      if (_window.width() > 992) {
        $('.catalog-info__photo img').css('width', 'calc(100% + ' + wrapOffset + 'px)');
      }
    }
  }, 250));

  _window.on('scroll', throttle(function() {
    // TO TOP BTN
    var vScroll = $(this).scrollTop()
    if (vScroll > 950) {
      $('.to-top-btn').addClass('is-active')
    } else {
      $('.to-top-btn').removeClass('is-active')
    }

    // MENU/SEARCH/CART BUTTONS
    if (vScroll > 100) {
      $('.header__menu, .header__search, .header__cart, .header__like').addClass('is-active')
    } else {
      $('.header__menu, .header__search, .header__cart, .header__like').removeClass('is-active')
    }
  }, 100));

  $('a[href*="#"]:not([href="#"])').click(function() {
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


  // SHARE
  $('.product-section__share').on('click', function() {
    if ($(this).hasClass('is-active')) {
      $(this).removeClass('is-active');
    } else {
      $(this).addClass('is-active')
    }
  });

  // PLUS MINUS
  //$('.cart__btn--plus').on('click', function(){
  //  var thisVal = $(this).prev('.cart__input').val();
  //  $('.cart__input').val(parseInt(thisVal) + 0.5)
  //});

  $('.cart__btn--plus').on('click', function() {
    var amount = parseFloat($(this).prev('.cart__input').val());
    $(this).prev('.cart__input').val(amount + 0.5);
  });

  $('.cart__btn--minus').on('click', function() {
    var amount = parseFloat($(this).next('.cart__input').val());
    if (amount > 0.5) {
      $(this).next('.cart__input').val(amount - 0.5);
    }
  });

  // TABS
  $('.product-section__tab-link').on('click', function(e) {
    e.preventDefault();
    $('.product-section__tab-link').removeClass('is-active');
    $(this).addClass('is-active');
    var dataId = $(this).attr('data-id');
    $('.product-section__tab-item').removeClass('is-active');
    $('.product-section__tab-item#' + dataId).addClass('is-active');
  });
  
  
  // FAVORITES
  $('.catalog-item__like').on('click', function(e){
    e.preventDefault();
    if ($(this).hasClass('is-active')) {
      $(this).removeClass('is-active');
    } else {
      $(this).addClass('is-active');
    }
  });


  //////////
  // SLIDERS
  //////////

  function initSliders() {

    // CLIENTS SLIDER
    $('[jsClientsSlider]').owlCarousel({
      loop: true,
      nav: true,
      dots: false,
      autoplay: true,
      smartSpeed: 900,
      items: 3,
      margin: 28,
      responsive: {
        0: {
          items: 1,
          nav: false,
          dots: true
        },

        768: {
          items: 2,
          nav: false,
          center: true
        },

        850: {
          items: 2,
          center: true,
          nav: false

        },
        991: {
          items: 3,
          center: false

        }
      }
    });

    //    // PHOTOS SLIDER
    $('[jsPhotosSlider]').owlCarousel({
      loop: true,
      nav: false,
      dots: false,
      autoplay: true,
      smartSpeed: 900,
      items: 7,
      responsive: {
        0: {
          items: 3
        },

        568: {
          items: 5
        },

        991: {
          items: 7

        }
      }
    });


    // POPULAR SLIDER
    $('[jsPopularSlider]').owlCarousel({
      loop: true,
      nav: true,
      dots: true,
      autoplay: true,
      smartSpeed: 900,
      items: 4,
      margin: 16,
      responsive: {
        0: {
          items: 1,
          nav: false
        },

        690: {
          items: 2,
          nav: false
        },

        991: {
          items: 3

        },
        1336: {
          items: 4

        }
      }
    });


    // RECENT SLIDER
    $('[jsRecentSlider]').owlCarousel({
      loop: true,
      nav: true,
      dots: true,
      autoplay: true,
      smartSpeed: 900,
      items: 6,
      margin: 16,
      responsive: {
        0: {
          items: 2,
          nav: false
        },

        768: {
          items: 3,
          nav: false
        },

        991: {
          items: 4

        },
        1110: {
          items: 5

        },
        1336: {
          items: 6

        }
      }
    });


    // MAIN SLIDER
    $('[jsMainSlider]').owlCarousel({
      loop: true,
      nav: false,
      dots: true,
      autoplay: true,
      smartSpeed: 900,
      items: 1
    });

    var myOwl = $('[jsProductSlider]');
    myOwl.owlCarousel({
      loop: false,
      nav: true,
      dots: false,
      autoplay: false,
      smartSpeed: 900,
      items: 1
    });

    $('[jsProductBtn]').on('click', function(e) {
      e.preventDefault();
      $('[jsProductBtn]').removeClass('is-active');
      $(this).addClass('is-active');
      var dataIndex = $(this).attr('data-index');
      myOwl.trigger('to.owl.carousel', dataIndex);
    });
    
  // ZOOM
  $('.product-section__slider-wrap').zoom({
    on: 'click',
    magnify: 1.2,
    touch: false
  });
  myOwl.on('change.owl.carousel', function(event) {
    $('.product-section__slider-wrap').trigger('zoom.destroy');
  })
  myOwl.on('changed.owl.carousel', function(event) {
    $('.product-section__slider-wrap').zoom({
    on: 'click',
    magnify: 1.2,
      touch: false
  });
  })
    
    // PRODUCT PAGE POPUP
    $('[jsNotifyMe]').on('click', function(){
      $('.product-popup__first').hide();
      $('.product-popup__second').show();
      
      $('[jsSubscr]').css('display', 'none');
      $('[jsSubscrDone]').css('display', 'inline-block');
    })
    $('[jsClosePopup]').on('click', function(){
      closeMfp();
      //$('.product-popup__first').show();
      //$('.product-popup__second').hide();
    }) 
    
    // CALLBACK POPUP
    $('[jsSendCallback]').on('click', function(){
      $('.callback__first').hide();
      $('.callback__second').show();
    })
    
    // recipient
    $('[jsNotYou]').on('change', function(){
      if ($(this).is(':checked')) {
        $('.order-section__recipient').css('display', 'flex')
      } else {
        $('.order-section__recipient').css('display', 'none')
      }
    });
    
    // FIZ UR IP
    $('.order-section__check-wrap input').on('change', function(){
      if ($('#fiz-type').is(':checked')) {
        $('.order-section__type').css('display', 'none');
        $('.order-section__type--fiz').css('display', 'block');
      }
      if ($('#ur-type').is(':checked')) {
        $('.order-section__type').css('display', 'none');
        $('.order-section__type--ur').css('display', 'block');
      }
      if ($('#ip-type').is(':checked')) {
        $('.order-section__type').css('display', 'none');
        $('.order-section__type--ip').css('display', 'block');
      }
    });
    
    // ORDER DELIVERY
    $('.order-section__delivery-check').on('change', function(){
      if ($('[jsCourier]').is(':checked')) {
        $('.order-section__myself').css('display', 'none');
        $('.order-section__address').css('display', 'block');
      }
      if ($('[jsMyself]').is(':checked')) {
        $('.order-section__address').css('display', 'none');
        $('.order-section__myself').css('display', 'block');
      }
    });
    
    // ORDER PAYMENT
    $('.order-section__delivery-check').on('change', function(){
      if ($('#pay-cash').is(':checked')) {
        $('.order-section__aside-pay').css('display', 'block');
      } else {
        $('.order-section__aside-pay').css('display', 'none');
      }
    });
    
    $('.city-popup__item').on('click', function(e){
      e.preventDefault();
      $('.city-popup__item').removeClass('is-active');
      $(this).addClass('is-active')
      var thisText = $(this).text();
      $('.order-section__city-link').text(thisText);
      closeMfp();
    });
    
    // MAP POPUP ITEM
    $('.order-section__list-item').on('click', function(e){
      $('.order-section__list-scroll').hide();
      $('.order-section__full').show();
    });
    
    $('.order-section__full-close, .order-section__full-another').on('click', function(e){
      $('.order-section__list-scroll').show();
      $('.order-section__full').hide();
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

    _window.on('resize', debounce(function(e) {
      if (_window.width() > 690) {
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
  
  
  // Map
  function initMap() {
	  var cntr = {
	  	lat: 56.308833,
	  	lng: 43.979796
	  }
	  //var myicon = '../img/map-marker.svg';
    var mapStyles = [
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e9e9e9"
                },
                {
                    "lightness": 17
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f5f5f5"
                },
                {
                    "lightness": 20
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                },
                {
                    "lightness": 17
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#ffffff"
                },
                {
                    "lightness": 29
                },
                {
                    "weight": 0.2
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ffffff"
                },
                {
                    "lightness": 18
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ffffff"
                },
                {
                    "lightness": 16
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f5f5f5"
                },
                {
                    "lightness": 21
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dedede"
                },
                {
                    "lightness": 21
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#ffffff"
                },
                {
                    "lightness": 16
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "saturation": 36
                },
                {
                    "color": "#333333"
                },
                {
                    "lightness": 40
                }
            ]
        },
        {
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f2f2f2"
                },
                {
                    "lightness": 19
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#fefefe"
                },
                {
                    "lightness": 20
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#fefefe"
                },
                {
                    "lightness": 17
                },
                {
                    "weight": 1.2
                }
            ]
        }
      ];

    if($('#contacts-map').length > 0) {
      var locations = [
        {
          lat: 56.308833,
	  	    lng: 43.979796
        }
      ];

      var contactMap = new google.maps.Map(document.getElementById('contacts-map'), {
	    	center: cntr,
	    	zoom: 16,
        styles: mapStyles
	    });

      var markers = locations.map(function (location, i) {
        return new google.maps.Marker({
          position: location,
          map: contactMap,
          icon: {
            url: '../img/map-marker.svg'
	        }
        });
      });
    }
    
    if($('#order-map').length > 0) {
      var locations = [
        {
          lat: 56.308833,
	  	    lng: 43.979796
        }
      ];

      var contactMap = new google.maps.Map(document.getElementById('order-map'), {
	    	center: cntr,
	    	zoom: 16,
        styles: mapStyles
	    });
    }

  }
  

  //////////
  // MODALS
  //////////

  function initPopups() {
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
        preload: [0, 1]
      },
      image: {
        tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
      }
    });

    // VIDEO PLAY POPUP
    $('[js-popupVideo]').magnificPopup({
      // disableOn: 700,
      type: 'iframe',
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
          // startWindowScroll = _window.scrollTop();
          // $('html').addClass('mfp-helper');
        }
      },
      patterns: {
        youtube: {
          index: 'youtube.com/',
          id: 'v=', // String that splits URL in a two parts, second part should be %id%
          // Or null - full URL will be returned
          // Or a function that should return %id%, for example:
          // id: function(url) { return 'parsed id'; }

          src: '//www.youtube.com/embed/%id%?autoplay=1&controls=0&showinfo=0' // URL that will be set as a source for iframe.
        }
      },
      closeMarkup: '<button class="mfp-close"><div class="video-box__close-button btn"><div class="item"></div><div class="item"></div><div class="item"></div><div class="item"></div><img src="img/setting/video_close.svg" alt=""/></div></button>'
    });

  }

  function closeMfp() {
    $.magnificPopup.close();
  }

  ////////////
  // SCROLLBARS
  ////////////

  function initScrollbars(){
    if ($('.cart-popup__topbar').length > 0) {
      var ps = new PerfectScrollbar('.cart-popup__topbar', {
        wheelSpeed: 1,
        maxScrollbarLength: 160
      });
    }

    if ($('.main-nav__wrapper').length > 0) {
      var ps = new PerfectScrollbar('.main-nav__wrapper', {
        wheelSpeed: 1,
        maxScrollbarLength: 160
      });
    }
    if ($('.advantages__scroll-wrap').length > 0) {
      var ps = new PerfectScrollbar('.advantages__scroll-wrap', {
        wheelSpeed: 1,
        maxScrollbarLength: 160
      });
    }
    if ($('.order-section__list').length > 0) {
      var ps = new PerfectScrollbar('.order-section__list', {
        wheelSpeed: 1,
        maxScrollbarLength: 160
      });
    }
  }

  ////////////
  // UI
  ////////////

  $('[jsSelect]').selectric();

  // textarea autoExpand
  _document
    .one('focus.autoExpand', '.ui-group textarea', function() {
      var savedValue = this.value;
      this.value = '';
      this.baseScrollHeight = this.scrollHeight;
      this.value = savedValue;
    })
    .on('input.autoExpand', '.ui-group textarea', function() {
      var minRows = this.getAttribute('data-min-rows') | 0,
        rows;
      this.rows = minRows;
      rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
      this.rows = minRows + rows;
    });

  // Masked input
  function initMasks() {
    $("[js-dateMask]").mask("99.99.99", {
      placeholder: "ДД.ММ.ГГ"
    });
    $("input[type='tel']").mask("+7 (000) 000-0000", {
      placeholder: "+7 (___) ___-____"
    });
  }

  ////////////
  // SCROLLMONITOR - WOW LIKE
  ////////////
  function initScrollMonitor() {
    $('.wow').each(function(i, el) {

      var elWatcher = scrollMonitor.create($(el));

      var delay;
      if (_window.width() < 992) {
        delay = 0
      } else {
        delay = $(el).data('animation-delay');
      }

      var animationClass = $(el).data('animation-class') || "wowFadeUp"

      var animationName = $(el).data('animation-name') || "wowFade"

      if (_window.width() > 991) {
        elWatcher.enterViewport(throttle(function() {
          $(el).addClass(animationClass);
          $(el).css({
            'animation-name': animationName,
            'animation-delay': delay,
            'visibility': 'visible'
          });
        }, 150, {
          'leading': true
        }));
      }

      // elWatcher.exitViewport(throttle(function() {
      //   $(el).removeClass(animationClass);
      //   $(el).css({
      //     'animation-name': 'none',
      //     'animation-delay': 0,
      //     'visibility': 'hidden'
      //   });
      // }, 150));
    });

  }

  //////////
  // BARBA PJAX
  //////////

  // Barba.Pjax.Dom.containerClass = "page";
  //
  // var FadeTransition = Barba.BaseTransition.extend({
  //   start: function() {
  //     Promise
  //       .all([this.newContainerLoading, this.fadeOut()])
  //       .then(this.fadeIn.bind(this));
  //   },
  //
  //   fadeOut: function() {
  //     var deferred = Barba.Utils.deferred();
  //
  //     anime({
  //       targets: this.oldContainer,
  //       opacity: .5,
  //       easing: [.02, .01, .47, 1], // swing
  //       duration: 250,
  //       complete: function(anim) {
  //         deferred.resolve();
  //       }
  //     });
  //
  //     return deferred.promise
  //   },
  //
  //   fadeIn: function() {
  //     var _this = this;
  //     var $el = $(this.newContainer);
  //
  //     $(this.oldContainer).hide();
  //
  //     $el.css({
  //       visibility: 'visible',
  //       opacity: .5
  //     });
  //
  //     document.body.scrollTop = 0;
  //
  //     anime({
  //       targets: $el.get(0),
  //       opacity: 1,
  //       easing: [.02, .01, .47, 1], // swing
  //       duration: 200,
  //       complete: function(anim) {
  //         triggerBody()
  //         _this.done();
  //       }
  //     });
  //   }
  // });
  //
  // Barba.Pjax.getTransition = function() {
  //   return FadeTransition;
  // };
  //
  // Barba.Prefetch.init();
  // Barba.Pjax.start();
  //
  // Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {
  //
  //   pageReady();
  //   closeMobileMenu();
  //
  // });
  //
  // function triggerBody() {
  //   $(window).scroll();
  //   $(window).resize();
  // }

});
