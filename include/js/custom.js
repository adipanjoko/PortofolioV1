gsap.registerPlugin(ScrollTrigger, TextPlugin, SplitText)
jQuery(document).ready(function ($) {
  'use strict'
  gsap.registerPlugin(ScrollTrigger, TextPlugin, SplitText)
  /************ TABLE OF CONTENTS ***************
01. Scramble text effect in header 
02. Reset all animation for .animate-child class in each section 
03. Back to normal state of menu
04. Open/close mobile nav
05. Open respective page when user click on any nav item
06. Animation for hero text after navigation go full width
07. Animation for all child element (e.g FadeIn, Animated Numbers, Animated Ruler)
08. Move overlays position with their respective parents
09. Page transition animation when user click on bottom nav(next/prev)
10. Add class to body when navigation toggle
11. Dark/Light mode switch
12. Swiper js script  for all sliders/carousels
13. Add class to active tab content
14. Show more blog post
15. Validate and submit form with AJAX
**********************************************/

  //01. START -- Scramble text effect in header
  if (document.querySelector('#text_change')) {
    const textChange = Array.from(document.querySelectorAll('#text_change_list span')).map((line) => line.textContent)
    let index = 0
    function scrambleText() {
      gsap.to('#text_change', {
        duration: 1,
        text: {
          value: textChange[index],
        },
        onComplete: () => {
          index = (index + 1) % textChange.length
          setTimeout(scrambleText, 1000) // Delay before next scramble
        },
      })
    }
    scrambleText()
  }
  //01. END -- Scramble text effect in header

  //02. START -- reset all animation for .animate-child class in each section
  function resetAnimations() {
    gsap.set('.animate-child > *', {opacity: 0, y: 60, rotate: 3})
    gsap.set('hr', {width: 0})
    gsap.set('.count', {innerText: 0})
  }
  resetAnimations()
  //02. END -- reset all animation for .animate-child class in each section

  //03. START -- back to normal state of menu
  $('.back-to-menu').on('click', function () {
    $('.navbar-block').removeClass('remove')
    $('.navbar-block').removeClass('full')
    $('body').removeClass('page-active')
    $('.page-section').removeClass('active-page')
  })
  //03. END -- back to normal state of menu

  //04. START -- open/close mobile nav
  $('.nav-toggle-btn').on('click', function () {
    if (!$('body').hasClass('nav-open')) {
      $('body').addClass('nav-open')
      $('body').addClass('nav-stagger')

      setTimeout(function () {
        $('body').removeClass('nav-stagger')
      }, 1000)
    } else {
      $('body').removeClass('nav-open')
    }

    return false
  })
  //04. END -- open/close mobile nav

  //05. START -- open respective page when user click on any nav item
  $('.navbar-block').on('click', function () {
    if (!$(this).hasClass('full')) {
      var targetDiv = '#' + $(this).attr('data-target')
      var targetHeroText = $(this).find('.hero-heading')
      $('.navbar-block').addClass('remove')
      $(this).addClass('full')
      $('body').addClass('page-active')
      $('.page-section').addClass('d-none').removeClass('active-page')
      $(targetDiv).removeClass('d-none').addClass('active-page')
      heroTextAnimation(targetHeroText)
      runAnimations(targetDiv)
    }
  })
  //05. END -- open respective page when user click on any nav item

  //06. START -- animation for hero text after navigation go full width
  function heroTextAnimation(targetHeroText) {
    var heroText = $(targetHeroText)
    var heroTextSplit = new SplitText(heroText, {type: 'words'})
    //now animate each character into place
    gsap.from(heroTextSplit.words, {delay: 0.5, duration: 0.7, x: 20, autoAlpha: 0, stagger: 0.05})

    // Revert the text back to its original state after the animation
    setTimeout(function () {
      heroTextSplit.revert()
    }, 3000) // Adjust the timeout duration as needed
  }
  //06. END -- animation for hero text after navigation go full width

  //07. START -- Animation for all child element (e.g FadeIn, Animated Numbers, Animated Ruler)
  function runAnimations(targetDiv) {
    resetAnimations()
    // Animate child tags of each .animate-child class on scroll
    $(targetDiv + ' .animate-child').each(function () {
      // Animate each child element within the active parent
      gsap.to($(this).children(), {
        opacity: 1, // End state
        y: 0,
        rotate: 0,
        duration: 1, // Duration of 2 seconds for each child
        stagger: 0.3, // Stagger timing of 0.3 seconds between each child
        ease: 'power4.out', // Adding easing for smooth transition
        scrollTrigger: {
          trigger: this, // Start animation when this parent comes into view
          start: 'top 80%', // Trigger animation when the top of the parent is 80% from the top of the viewport
          end: 'bottom 20%', // End animation when the bottom of the parent is 20% from the top of the viewport
          toggleActions: 'play none none none', // Play the animation on enter, no actions on leave, enter back, or leave back
        },
      })
    })

    // Animate all <hr> tags on scroll
    $(targetDiv + ' hr').each(function () {
      // Animate each hr tag
      gsap.to($(this), {
        width: '100%', // End state

        duration: 0.7, // Duration of 2 seconds for each child
        ease: 'power1.out', // Adding easing for smooth transition
        scrollTrigger: {
          trigger: this, // Start animation when this parent comes into view
          start: 'top 80%', // Trigger animation when the top of the parent is 80% from the top of the viewport
          end: 'bottom 20%', // End animation when the bottom of the parent is 20% from the top of the viewport
          toggleActions: 'play none none none', // Play the animation on enter, no actions on leave, enter back, or leave back
        },
      })
    })

    // Animate all numbers with .count class on scroll
    $(targetDiv + ' .count').each(function () {
      let $numberElem = $(this)
      let targetValue = $numberElem.data('target')
      ScrollTrigger.create({
        trigger: $numberElem,
        start: 'top 90%',
        once: true,
        onEnter: function () {
          gsap.fromTo(
            $numberElem,
            {innerText: 0},
            {
              innerText: targetValue,
              duration: 2,
              snap: {innerText: 1},
              ease: 'power1.inOut',
              onUpdate: function () {
                $numberElem.text(Math.ceil($numberElem.text()))
              },
            }
          )
        },
      })
    })
  }

  //07. END -- Animation for all child element (e.g FadeIn, Animated Numbers, Animated Ruler)

  //08. START -- Move overlays position with their respective parents
  function updatePageNavChildPositions() {
    $('.active-page .page-nav-parent').each(function () {
      var parent = $(this)
      var childId = parent.data('overlay')
      var child = $('#' + childId)
      var parentOffset = parent.offset()
      var parentWidth = parent.outerWidth()
      var parentHeight = parent.outerHeight()
      child.css({
        width: parentWidth,
        height: parentHeight,
        top: parentOffset.top - $(window).scrollTop(),
        left: parentOffset.left - $(window).scrollLeft(),
      })
    })
  }
  $(window).on('scroll resize', updatePageNavChildPositions)
  updatePageNavChildPositions()
  //08. END -- Move overlays position with their respective parents

  //09. START -- Page transition animation when user click on bottom nav(next/prev)
  $('.page-nav-link').on('click', function () {
    var targetNav = $(this).attr('href')
    var targetDiv = '#' + $(this).attr('data-target')
    var targetHeroText = $(targetNav).find('.hero-heading')
    var targetOverlay = '#' + $(this).data('overlay')
    $('html').addClass('page-changing')
    $(targetOverlay).addClass('go-full')
    setTimeout(function () {
      $(window).scrollTop(0)
    }, 500)

    setTimeout(function () {
      $('.navbar-block').removeClass('full')
      $(targetNav).addClass('full')
      $('.page-section').addClass('d-none').removeClass('active-page')
      $(targetDiv).removeClass('d-none').addClass('active-page')
      heroTextAnimation(targetHeroText)
      runAnimations(targetDiv)
    }, 1000)

    setTimeout(function () {
      $(targetOverlay).fadeOut()
    }, 1500)

    setTimeout(function () {
      $(targetOverlay).show().removeClass('go-full')
      $('html').removeClass('page-changing')
    }, 2000)
    return false
  })
  //09. END -- page transition animation when user click on bottom nav(next/prev)

  //10. START -- Add class to body when navigation toggle
  $('.navbar').on('shown.bs.collapse', function () {
    $('body').addClass('nav-open')
  })
  $('.navbar').on('hidden.bs.collapse', function () {
    $('body').removeClass('nav-open')
  })
  //10. END -- Add class to body when navigation toggle

  //11. START -- Dark/Light mode switch
  const bodyParent = $('body')
  const button = $('.theme-toggler')

  function toggleDark() {
    if (bodyParent.hasClass('dark-theme')) {
      bodyParent.removeClass('dark-theme')
      localStorage.setItem('theme', 'light')
    } else {
      bodyParent.addClass('dark-theme')
      localStorage.setItem('theme', 'dark')
    }
  }

  if (localStorage.getItem('theme') === 'dark') {
    bodyParent.addClass('dark-theme')
  }

  $('.theme-toggler').on('click', toggleDark)

  //11. END -- Dark/Light mode switch

  //12. START -- Swiper js script  for all sliders/carousels

  /************ Testimonail Slider ************/
  if (document.querySelector('.testimonial-slider')) {
    var swiperTestimonial = new Swiper('.testimonial-slider', {
      //effect: "fade",
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction',
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    })
  }

  /************ Portfolio Slider ************/
  if (document.querySelector('.portfolio-slider')) {
    var swiperPortfolio = new Swiper('.portfolio-slider', {
      effect: 'fade',
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction',
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    })
  }

  //12. END -- Swiper js script  for all sliders/carousels

  //13. START -- add class to active tab content
  $('.customTab [data-bs-toggle="tab"]').on('shown.bs.tab', function (event) {
    // Remove the custom class from all tab panes
    $('.custom-tab-content').removeClass('reveal')

    // Add the custom class to the newly active tab pane
    var target = $(event.target).attr('data-bs-target')
    var childTarget = $(target).find('.custom-tab-content')
    $(childTarget).addClass('reveal')
  })
  //13. END -- add class to active tab content

  //14. START -- show more blog post
  function newPostAnimation() {
    // Animate child tags of each .animate-child class on scroll
    $('.new-post .animate-child').each(function () {
      // Animate each child element within the active parent
      gsap.to($(this).children(), {
        opacity: 1, // End state
        y: 0,
        rotate: 0,
        duration: 1, // Duration of 2 seconds for each child
        stagger: 0.3, // Stagger timing of 0.3 seconds between each child
        ease: 'power4.out', // Adding easing for smooth transition
        scrollTrigger: {
          trigger: this, // Start animation when this parent comes into view
          start: 'top 80%', // Trigger animation when the top of the parent is 80% from the top of the viewport
          end: 'bottom 20%', // End animation when the bottom of the parent is 20% from the top of the viewport
          toggleActions: 'play none none none', // Play the animation on enter, no actions on leave, enter back, or leave back
        },
      })
      // Animate each hr tag from new post on scroll
      $('.new-post hr').each(function () {
        // Animate each hr tag
        gsap.to($(this), {
          width: '100%', // End state

          duration: 0.7, // Duration of 2 seconds for each child
          ease: 'power1.out', // Adding easing for smooth transition
          scrollTrigger: {
            trigger: this, // Start animation when this parent comes into view
            start: 'top 80%', // Trigger animation when the top of the parent is 80% from the top of the viewport
            end: 'bottom 20%', // End animation when the bottom of the parent is 20% from the top of the viewport
            toggleActions: 'play none none none', // Play the animation on enter, no actions on leave, enter back, or leave back
          },
        })
      })
    })
    setTimeout(function () {
      $('.blog-item').removeClass('new-post')
    }, 1000)
  }
  $('.show-more-post').hide()
  const numToShow = $('.blog-list').data('show')
  $('.show-more-post').each(function (index, element) {
    const list = $('.blog-list > .blog-item')
    const numInList = list.length
    list.hide()
    if (numInList > numToShow) {
      $(element).show()
    }
    list.slice(0, numToShow).show()
    $(element).click(function () {
      const showing = list.filter(':visible').length
      list
        .slice(showing - 0, showing + numToShow)
        .fadeIn()
        .addClass('new-post')
      gsap.set('.new-post hr', {width: 0})
      gsap.set('.new-post .animate-child > *', {opacity: 0, y: 60, rotate: 3})
      newPostAnimation()
      const nowShowing = list.filter(':visible').length
      if (nowShowing >= numInList) {
        $(element).hide()
      }
      return false
    })
  })
  //14. END -- show more blog post

  //15. START -- Validate and submit form with AJAX

  $('#messageForm').validate({
    submitHandler: function (form) {
        $('.loading').show();
        $(form).ajaxSubmit({
            type: 'POST',
            data: $(form).serialize(),
            url: 'mail.php',
            success: function () {
                $('.loading').hide();
                $(form).trigger('reset');
                $('#messageForm').addClass('hide');
                $('#success').fadeIn();
            },
            error: function () {
                $('.loading').hide();
                $(form).trigger('reset');
                $('#messageForm').addClass('hide');
                $('#error').fadeIn();
            }
        });
    },
    messages: {
        name: 'Please enter your name',
        email: 'Please enter a valid email address',
        phone: 'Please enter your phone number',
        message: 'Please enter your message',
        agree: 'Please agree to my Terms & Conditions and Privacy Policy'
    },
    errorPlacement: function (error, element) {
        error.insertAfter(element);
    }
});

  //15. END -- Validate and submit form with AJAX
})
