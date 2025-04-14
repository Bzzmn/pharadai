(function ($) {
  "use strict";
  /*=================================
    JS Index Here
==================================*/
  /*
  01. On Load Function
  02. Preloader
  03. Mobile Menu Active
  04. Sticky fix
  05. Scroll To Top
  06. Set Background Image & Color
  07. Popup Sidemenu
  08. Search Box Popup
  09. Hero Slider Active
  10. Magnific Popup
  22. WOW Js
*/
  /*=================================
    JS Index End
==================================*/
  /*


  /*---------- 01. On Load Function ----------*/
  $(window).on("load", function () {
    $(".preloader").fadeOut();
  });

  /*---------- 02. Preloader ----------*/
  if ($(".preloader").length > 0) {
    $(".preloaderCls").each(function () {
      $(this).on("click", function (e) {
        e.preventDefault();
        $(".preloader").css("display", "none");
      });
    });
  }

  // Function to handle the zoom-style functionality
  function handleZoomStyle() {
    if ($(".zoom-style").length > 0) {
      gsap.set(".vs-hero-img", { scale: 0, opacity: 0 });

      gsap.to(".vs-hero-img", {
        scrollTrigger: {
          trigger: ".banner-style1",
          start: "center center",
          markers: false,
        },
        duration: 1.5,
        ease: "none",
        scale: 1,
        opacity: 1,
      });
    }
  }

  // extra
  // Get Device width
  let device_width = window.innerWidth;

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, TweenMax, ScrollToPlugin);

  gsap.config({
    nullTargetWarn: false,
  });

  if (device_width > 100) {
    const smoother = ScrollSmoother.create({
      smooth: 1.35,
      effects: device_width < 1025 ? false : true,
      smoothTouch: false,
      normalizeScroll: false,
      ignoreMobileResize: true,
    });
  }

  if ($(".vs-hero-bottom-img-wrap").length > 0) {
    let ms = gsap.matchMedia();
    ms.add("(min-width: 768px)", () => {
      // Home 8
      let tp_hero = gsap.timeline({
        scrollTrigger: {
          trigger: ".vs-hero-bottom-img-wrap",
          start: "top 70",
          pin: true,
          markers: false,
          scrub: 1,
          pinSpacing: false,
          end: "bottom 50%",
        },
      });
      tp_hero.to(".vs-hero-bottom-img", {
        width: "100%",
      });
    });
  }

  if ($(".vs_fade_bottom").length > 0) {
    gsap.set(".vs_fade_bottom", { y: 100, opacity: 0 });
    const fadeArray = gsap.utils.toArray(".vs_fade_bottom");
    fadeArray.forEach((item, i) => {
      let fadeTl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top center+=400",
        },
      });
      fadeTl.to(item, {
        y: 0,
        opacity: 1,
        ease: "power2.out",
        duration: 1.5,
      });
    });
  }

  function handleCharStyle() {
    if ($(".vs-char-animation").length > 0) {
      // 25. Title Animation
      let char_come = gsap.utils.toArray(".vs-char-animation");
      char_come.forEach((splitTextLine) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: splitTextLine,
            start: "top 90%",
            end: "bottom 60%",
            scrub: false,
            markers: false,
            toggleActions: "play none none none",
          },
        });

        const itemSplitted = new SplitText(splitTextLine, {
          type: "chars, words",
        });
        gsap.set(splitTextLine, { perspective: 300 });
        itemSplitted.split({ type: "chars, words" });
        tl.from(itemSplitted.chars, {
          duration: 1,
          delay: 0.5,
          x: 100,
          autoAlpha: 0,
          stagger: 0.05,
        });
      });
    }
  }

  // button hover animation
  $(".vs-hover-btn").on("mouseenter", function (e) {
    var x = e.pageX - $(this).offset().left;
    var y = e.pageY - $(this).offset().top;

    $(this).find(".vs-btn-circle-dot").css({
      top: y,
      left: x,
    });
  });

  $(".vs-hover-btn").on("mouseout", function (e) {
    var x = e.pageX - $(this).offset().left;
    var y = e.pageY - $(this).offset().top;

    $(this).find(".vs-btn-circle-dot").css({
      top: y,
      left: x,
    });
  });

  /*---------- 03. Mobile Menu Active ----------*/
  $.fn.vsmobilemenu = function (options) {
    var opt = $.extend(
      {
        menuToggleBtn: ".vs-menu-toggle",
        bodyToggleClass: "vs-body-visible",
        subMenuClass: "vs-submenu",
        subMenuParent: "vs-item-has-children",
        subMenuParentToggle: "vs-active",
        meanExpandClass: "vs-mean-expand",
        subMenuToggleClass: "vs-open",
        toggleSpeed: 400,
      },
      options
    );

    return this.each(function () {
      var menu = $(this); // Select menu

      // Menu Show & Hide
      function menuToggle() {
        menu.toggleClass(opt.bodyToggleClass);

        // collapse submenu on menu hide or show
        var subMenu = "." + opt.subMenuClass;
        $(subMenu).each(function () {
          if ($(this).hasClass(opt.subMenuToggleClass)) {
            $(this).removeClass(opt.subMenuToggleClass);
            $(this).css("display", "none");
            $(this).parent().removeClass(opt.subMenuParentToggle);
          }
        });
      }

      // Class Set Up for every submenu
      menu.find("li").each(function () {
        var submenu = $(this).find("ul");
        submenu.addClass(opt.subMenuClass);
        submenu.css("display", "none");
        submenu.parent().addClass(opt.subMenuParent);
        submenu.prev("a").addClass(opt.meanExpandClass);
        submenu.next("a").addClass(opt.meanExpandClass);
      });

      // Toggle Submenu
      function toggleDropDown($element) {
        if ($($element).next("ul").length > 0) {
          $($element).parent().toggleClass(opt.subMenuParentToggle);
          $($element).next("ul").slideToggle(opt.toggleSpeed);
          $($element).next("ul").toggleClass(opt.subMenuToggleClass);
        } else if ($($element).prev("ul").length > 0) {
          $($element).parent().toggleClass(opt.subMenuParentToggle);
          $($element).prev("ul").slideToggle(opt.toggleSpeed);
          $($element).prev("ul").toggleClass(opt.subMenuToggleClass);
        }
      }

      // Submenu toggle Button
      var expandToggler = "." + opt.meanExpandClass;
      $(expandToggler).each(function () {
        $(this).on("click", function (e) {
          e.preventDefault();
          toggleDropDown(this);
        });
      });

      // Menu Show & Hide On Toggle Btn click
      $(opt.menuToggleBtn).each(function () {
        $(this).on("click", function () {
          menuToggle();
        });
      });

      // Hide Menu On out side click
      menu.on("click", function (e) {
        e.stopPropagation();
        menuToggle();
      });

      // Stop Hide full menu on menu click
      menu.find("div").on("click", function (e) {
        e.stopPropagation();
      });
    });
  };

  $(".vs-menu-wrapper").vsmobilemenu();

  /*---------- 04. Sticky fix ----------*/
  var lastScrollTop = "";
  var scrollToTopBtn = ".scrollToTop";

  function stickyMenu($targetMenu, $toggleClass, $parentClass) {
    var st = $(window).scrollTop();
    var height = $targetMenu.css("height");
    $targetMenu.parent().css("min-height", height);
    if ($(window).scrollTop() > 800) {
      $targetMenu.parent().addClass($parentClass);

      if (st > lastScrollTop) {
        $targetMenu.removeClass($toggleClass);
      } else {
        $targetMenu.addClass($toggleClass);
      }
    } else {
      $targetMenu.parent().css("min-height", "").removeClass($parentClass);
      $targetMenu.removeClass($toggleClass);
    }
    lastScrollTop = st;
  }
  $(window).on("scroll", function () {
    stickyMenu($(".sticky-active"), "active", "will-sticky");
    if ($(this).scrollTop() > 500) {
      $(scrollToTopBtn).addClass("show");
    } else {
      $(scrollToTopBtn).removeClass("show");
    }
  });

  /*---------- 05. Scroll To Top ----------*/
  $(scrollToTopBtn).each(function () {
    $(this).on("click", function (e) {
      e.preventDefault();
      $("html, body").animate(
        {
          scrollTop: 0,
        },
        lastScrollTop / 3
      );
      return false;
    });
  });

  /*---------- 06.Set Background Image & Color ----------*/
  if ($("[data-bg-src]").length > 0) {
    $("[data-bg-src]").each(function () {
      var src = $(this).attr("data-bg-src");
      $(this).css("background-image", "url(" + src + ")");
    });
  }

  if ($("[data-bg-color]").length > 0) {
    $("[data-bg-color]").each(function () {
      var color = $(this).attr("data-bg-color");
      $(this).css("background-color", color);
    });
  }

  /*---------- 07. Popup Sidemenu ----------*/
  function popupSideMenu($sideMenu, $sideMunuOpen, $sideMenuCls, $toggleCls) {
    // Sidebar Popup
    $($sideMunuOpen).on("click", function (e) {
      e.preventDefault();
      $($sideMenu).addClass($toggleCls);
    });
    $($sideMenu).on("click", function (e) {
      e.stopPropagation();
      $($sideMenu).removeClass($toggleCls);
    });
    var sideMenuChild = $sideMenu + " > div";
    $(sideMenuChild).on("click", function (e) {
      e.stopPropagation();
      $($sideMenu).addClass($toggleCls);
    });
    $($sideMenuCls).on("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      $($sideMenu).removeClass($toggleCls);
    });
  }
  popupSideMenu(
    ".sidemenu-wrapper",
    ".sideMenuToggler",
    ".sideMenuCls",
    "show"
  );

  /*---------- 08. Search Box Popup ----------*/
  function popupSarchBox($searchBox, $searchOpen, $searchCls, $toggleCls) {
    $($searchOpen).on("click", function (e) {
      e.preventDefault();
      $($searchBox).addClass($toggleCls);
    });
    $($searchBox).on("click", function (e) {
      e.stopPropagation();
      $($searchBox).removeClass($toggleCls);
    });
    $($searchBox)
      .find("form")
      .on("click", function (e) {
        e.stopPropagation();
        $($searchBox).addClass($toggleCls);
      });
    $($searchCls).on("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      $($searchBox).removeClass($toggleCls);
    });
  }
  popupSarchBox(
    ".popup-search-box",
    ".searchBoxTggler",
    ".searchClose",
    "show"
  );

  /*---------- 08. counter-box ----------*/

  // Function to handle the intersection of the element with the viewport
  function handleIntersection(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Your existing code to animate the circle percent
        var $this = $(entry.target),
          $dataV = $this.data("percent"),
          $dataDeg = $dataV * 3.6,
          $round = $this.find(".round_per");

        $round.css("transform", "rotate(" + parseInt($dataDeg + 180) + "deg)");
        $this.append(
          '<div class="circle_inbox"><span class="percent_text"></span></div>'
        );

        $this.prop("Counter", 0).animate(
          { Counter: $dataV },
          {
            duration: 2000,
            easing: "swing",
            step: function (now) {
              $this.find(".percent_text").text(Math.ceil(now) + "%");
            },
          }
        );

        if ($dataV >= 51) {
          $round.css("transform", "rotate(" + 360 + "deg)");
          setTimeout(function () {
            $this.addClass("percent_more");
          }, 1000);
          setTimeout(function () {
            $round.css(
              "transform",
              "rotate(" + parseInt($dataDeg + 180) + "deg)"
            );
          }, 1000);
        }
        // Disconnect the observer after triggering the animation
        observer.unobserve(entry.target);
      }
    });
  }

  // Create an intersection observer instance
  var observer = new IntersectionObserver(handleIntersection, {
    threshold: 0.5, // Adjust the threshold as needed
  });

  // Observe each element with the class 'circle_percent'
  $(".circle_percent").each(function () {
    observer.observe(this);
  });

  /*----------- 09. Hero Slider Active ----------*/
  $(".vs-hero-carousel").each(function () {
    var vsHslide = $(this);

    // Get Data From Dom
    function d(data) {
      return vsHslide.data(data);
    }

    // Custom Style Set
    vsHslide
      .on("sliderWillLoad", function (event, slider) {
        // Define Variable
        var respLayer = jQuery(this).find(".ls-responsive"),
          lsDesktop = "ls-desktop",
          lsMobile = "ls-mobile",
          lsTablet = "ls-tablet",
          lsLaptop = "ls-laptop",
          windowWid = jQuery(window).width(),
          lgDevice = 1025,
          mdDevice = 993,
          smDevice = 768;

        // Set Style on each Layer
        respLayer.each(function () {
          var layer = jQuery(this);

          function lsd(data) {
            return layer.data(data) === ""
              ? layer.data(null)
              : layer.data(data);
          }
          // var respStyle = (windowWid < smDevice) ? ((lsd(lsMobile)) ? lsd(lsMobile) : lsd(lsTablet)) : ((windowWid < mdDevice) ? ((lsd(lsTablet)) ? lsd(lsTablet) : lsd(lsDesktop)) : lsd(lsDesktop)),
          var respStyle =
              windowWid < smDevice
                ? lsd(lsMobile)
                : windowWid < mdDevice
                ? lsd(lsTablet)
                : windowWid < lgDevice
                ? lsd(lsLaptop)
                : lsd(lsDesktop),
            mainStyle =
              layer.attr("style") !== undefined ? layer.attr("style") : " ";
          layer.attr("style", mainStyle + respStyle);
        });
      })
      .on("sliderDidLoad", function (event, slider) {
        setTimeout(() => {
          /* Custom Thumb Navigation Select */
          var navDom = "data-slide-go";
          var customNav = ".ls-custom-dot";

          var currentSlide = slider.slides.current.index; // current Slide index
          var i = 1;

          // Set Attribute
          vsHslide.find(customNav).each(function () {
            $(this).attr(navDom, i);
            i++;
            // On Click Thumb, Change slide
            $(this).on("click", function (e) {
              e.preventDefault();
              var sliderdsf = $(this).closest(".ls-container");
              var target = $(this).attr(navDom);
              sliderdsf.layerSlider(parseFloat(target));
            });
          });

          // custom arrow js
          vsHslide.find(".ls-custom-arrow").each(function () {
            $(this).on("click", function (e) {
              e.preventDefault();
              var gotarget = $(this).attr("data-change-slide");
              $(this).closest(".ls-container").layerSlider(gotarget);
            });
          });

          // Add class To current Thumb
          var currentNav = customNav + "[" + navDom + '="' + currentSlide + '"';
          $(currentNav).addClass("active");
        }, 1000);
      })
      .on("slideChangeDidComplete", function (event, slider) {
        var currentActive = slider.slides.current.index; // After change Current Index
        var currentNav = '.ls-custom-dot[data-slide-go="' + currentActive + '"';
        $(currentNav).addClass("active").siblings().removeClass("active");
      });

    // Custom Arrow
    vsHslide.find("[data-ls-go]").each(function () {
      $(this).on("click", function (e) {
        e.preventDefault();
        var target = $(this).data("ls-go");
        vsHslide.layerSlider(target);
      });
    });

    vsHslide.layerSlider({
      allowRestartOnResize: true,
      maxRatio: d("maxratio") ? d("maxratio") : 1,
      type: d("slidertype") ? d("slidertype") : "responsive",
      pauseOnHover: d("pauseonhover") ? true : false,
      navPrevNext: d("navprevnext") ? true : false,
      hoverPrevNext: d("hoverprevnext") ? true : false,
      hoverBottomNav: d("hoverbottomnav") ? true : false,
      navStartStop: d("navstartstop") ? true : false,
      navButtons: d("navbuttons") ? true : false,
      loop: d("loop") === false ? false : true,
      autostart: d("autostart") ? true : false,
      height: d("height") ? d("height") : 1080,
      responsiveUnder: d("responsiveunder") ? d("responsiveunder") : 1220,
      layersContainer: d("container") ? d("container") : 1220,
      showCircleTimer: d("showcircletimer") ? true : false,
      skinsPath: "layerslider/skins/",
      thumbnailNavigation: d("thumbnailnavigation") === false ? false : true,
      globalBGImage: d("globalbgimage") ? d("globalbgimage") : false,
      globalBGSize: d("globalbgsize") ? d("globalbgsize") : false,
    });
  });

  /*----------- 10. Magnific Popup ----------*/
  /* magnificPopup img view */
  $(".popup-image").magnificPopup({
    type: "image",
    gallery: {
      enabled: true,
    },
  });

  /* magnificPopup video view */
  $(".popup-video").magnificPopup({
    type: "iframe",
  });

  /*---------- 22. WOW Js ----------*/
  var wow = new WOW({
    boxClass: "wow", // default
    animateClass: "animated", // default
    offset: 0, // default
    mobile: true, // default
    live: true, // default
    resetAnimation: false,
  });
  wow.init();

  /*----------- 25. Service Slider Active ----------*/
  $(".service-slider1").slick({
    dots: true,
    arrows: true,
    infinite: true,
    autoplay: false,
    fade: false,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 1,
    prevArrow:
      '<button type="button" class="slick-prev"><i class="far fa-long-arrow-left"></i></button>',
    nextArrow:
      '<button type="button" class="slick-next"><i class="far fa-long-arrow-right"></i></button>',
    appendArrows: $("#slidenav1"),
    appendDots: $("#slidenav1"),
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ],
  });

  $(".accordion-item").on("click", function () {
    $(this).toggleClass("active").siblings().removeClass("active");
  });

  $(".testi-img ul li").on("click", function () {
    var tab_id = $(this).attr("data-tab");
    $(".testi-img ul li").removeClass("current");
    $(".testi-slide2").removeClass("current");
    $(this).addClass("current animated fadeIn");
    $("#" + tab_id).addClass("current animated fadeIn");
    return false;
  });

  /**************************************
   ***** 14. Counter Activation
   **************************************/
  /**************************************
   ***** 14. Counter Activation
   **************************************/

  // Function to animate the counters
  function animateCounter(counter) {
    const targetValueRaw = counter.getAttribute("data-counter");
    const targetValue = parseFloat(targetValueRaw);
    const animationDuration = 1000; // Set the desired animation duration in milliseconds
    const startTimestamp = performance.now();
    
    // Determine if we need to show decimals
    const isDecimal = targetValueRaw.includes('.');
    const decimalPlaces = isDecimal ? targetValueRaw.split('.')[1].length : 0;

    function updateCounter(timestamp) {
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / animationDuration, 1);

      // Calculate current value with decimal precision if needed
      const currentValue = targetValue * progress;
      
      // Format the number based on whether it has decimals
      counter.textContent = isDecimal ? 
        currentValue.toFixed(decimalPlaces) : 
        Math.floor(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // Function to start the counting animation when the counter is intersecting with the viewport
  function startCounterAnimation(entries, observerInstance) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target.querySelector(".counter1");
        animateCounter(counter);
        // observerInstance.unobserve(entry.target); // Uncomment this line if you want to stop observing after the animation starts
      }
    });
  }

  // Create an intersection observer instance
  const counterObserver = new IntersectionObserver(startCounterAnimation, {
    rootMargin: "0px",
    threshold: 0.2, // Adjust the threshold value as needed (0.2 means 20% visibility)
  });

  // Observe all counter blocks
  const counterBlocks = document.querySelectorAll(".counter-block");
  counterBlocks.forEach((counterBlock) => {
    counterObserver.observe(counterBlock);
  });

  // end
})(jQuery);
