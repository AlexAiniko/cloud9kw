/* ============================================
   Cloud 9 Key West -- Immersive Scroll Experience
   Pure vanilla JS. No dependencies.
   Bold animations, mobile-optimized.
   ============================================ */

(function () {
  'use strict';

  // --- Utility: check reduced motion ---
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Utility: clamp ---
  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  // --- Utility: lerp ---
  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  // ============================================
  // SCENE 1: ARRIVAL -- Parallax zoom on scroll
  // ============================================
  function initArrivalParallax() {
    var image = document.querySelector('.arrival__image');
    var content = document.querySelector('.arrival__content');
    var scrollCue = document.querySelector('.arrival__scroll-cue');
    if (!image || prefersReducedMotion) return;

    var ticking = false;

    function update() {
      var scrollY = window.scrollY;
      var vh = window.innerHeight;

      if (scrollY < vh * 1.5) {
        var progress = scrollY / vh;
        var scale = 1.05 + progress * 0.08;
        var translateY = progress * -30;
        image.style.transform = 'scale(' + scale + ') translate3d(0, ' + translateY + 'px, 0)';

        if (content) {
          var fade = Math.max(0, 1 - progress * 1.8);
          content.style.opacity = fade;
          content.style.transform = 'translateY(' + (progress * -40) + 'px)';
        }
        if (scrollCue) {
          scrollCue.style.opacity = Math.max(0, 1 - progress * 3);
        }
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }


  // ============================================
  // SCENE 2: EXPERIENCE -- Scroll-driven slideshow
  // ============================================
  function initExperienceSlideshow() {
    var section = document.querySelector('.scene-experience');
    var slides = document.querySelectorAll('.experience__slide');
    var progressBar = document.querySelector('.experience__progress-bar');
    var counterCurrent = document.querySelector('.experience__counter-current');
    var watermark = document.querySelector('.experience__watermark');
    var designerCredit = document.querySelector('.experience__designer-credit');

    if (!section || !slides.length) return;

    var totalSlides = slides.length;
    var currentSlide = -1;
    var ticking = false;

    function update() {
      var rect = section.getBoundingClientRect();
      var sectionTop = -rect.top;
      var sectionHeight = section.offsetHeight - window.innerHeight;

      // Show/hide watermark and designer credit when in the experience section
      if (sectionTop > -100 && sectionTop < sectionHeight + 100) {
        if (watermark) watermark.classList.add('is-visible');
        if (designerCredit) designerCredit.classList.add('is-visible');
      } else {
        if (watermark) watermark.classList.remove('is-visible');
        if (designerCredit) designerCredit.classList.remove('is-visible');
      }

      if (sectionTop < 0 || sectionTop > sectionHeight) {
        ticking = false;
        return;
      }

      // Calculate which slide we're on based on scroll progress
      var scrollProgress = sectionTop / sectionHeight;
      var slideIndex = Math.floor(scrollProgress * totalSlides);
      slideIndex = clamp(slideIndex, 0, totalSlides - 1);

      // Update progress bar
      if (progressBar) {
        var progressPercent = ((scrollProgress * totalSlides) % 1) * 100;
        if (slideIndex === totalSlides - 1) {
          progressPercent = 100;
        }
        progressBar.style.width = progressPercent + '%';
      }

      // Switch slide if changed
      if (slideIndex !== currentSlide) {
        var previousSlide = currentSlide;
        currentSlide = slideIndex;

        slides.forEach(function (slide, i) {
          if (i === slideIndex) {
            slide.classList.remove('is-leaving');
            slide.classList.add('is-active');
          } else if (i === previousSlide) {
            slide.classList.remove('is-active');
            slide.classList.add('is-leaving');
            // Remove is-leaving after transition completes
            setTimeout(function () {
              slide.classList.remove('is-leaving');
            }, 1400);
          } else {
            slide.classList.remove('is-active');
            slide.classList.remove('is-leaving');
          }
        });

        // Update counter
        if (counterCurrent) {
          var displayNum = slideIndex + 1;
          counterCurrent.textContent = displayNum < 10 ? '0' + displayNum : '' + displayNum;
        }
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    // Run once immediately
    update();
  }


  // ============================================
  // SCENE 3: DETAILS -- Staggered masonry reveal
  // ============================================
  // (No horizontal scroll JS needed -- handled by
  // CSS grid + IntersectionObserver in initRevealObservers)


  // ============================================
  // INTERSECTION OBSERVER -- Reveal animations
  // ============================================
  function initRevealObservers() {
    // Section-level reveals
    var revealTargets = [
      '.details__intro',
      '.scene-location',
      '.scene-designer'
    ];

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    revealTargets.forEach(function (selector) {
      var el = document.querySelector(selector);
      if (el) sectionObserver.observe(el);
    });

    // Detail items -- staggered reveal as they enter viewport
    var detailItems = document.querySelectorAll('.details__item');
    if (detailItems.length) {
      var revealBatch = 0;
      var itemObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var item = entry.target;
            // Use data-reveal attribute for stagger delay (0.15s per item)
            var revealIndex = parseInt(item.getAttribute('data-reveal') || '0', 10);
            item.style.transitionDelay = (revealIndex * 0.12) + 's';
            item.classList.add('is-visible');
            itemObserver.unobserve(item);
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -80px 0px'
      });

      detailItems.forEach(function (item) {
        itemObserver.observe(item);
      });
    }
  }


  // ============================================
  // LAZY LOADING -- Native + IntersectionObserver fallback
  // ============================================
  function initLazyLoad() {
    if ('loading' in HTMLImageElement.prototype) return;

    var lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if (!lazyImages.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px 0px'
    });

    lazyImages.forEach(function (img) {
      observer.observe(img);
    });
  }


  // ============================================
  // SMOOTH MOMENTUM -- Optional custom smooth scroll
  // (Only on desktop, non-reduced-motion)
  // ============================================
  function initSmoothMomentum() {
    if (prefersReducedMotion) return;
    if ('ontouchstart' in window) return;
    if (window.innerWidth < 1024) return;

    var currentScroll = window.scrollY;
    var targetScroll = window.scrollY;
    var scrolling = false;
    var ease = 0.09;

    function smoothStep() {
      currentScroll = lerp(currentScroll, targetScroll, ease);

      if (Math.abs(currentScroll - targetScroll) < 0.5) {
        currentScroll = targetScroll;
        window.scrollTo(0, currentScroll);
        scrolling = false;
        return;
      }

      window.scrollTo(0, currentScroll);
      requestAnimationFrame(smoothStep);
    }

    window.addEventListener('wheel', function (e) {
      e.preventDefault();
      targetScroll += e.deltaY;
      targetScroll = clamp(targetScroll, 0, document.body.scrollHeight - window.innerHeight);

      if (!scrolling) {
        scrolling = true;
        currentScroll = window.scrollY;
        requestAnimationFrame(smoothStep);
      }
    }, { passive: false });

    window.addEventListener('resize', function () {
      currentScroll = window.scrollY;
      targetScroll = window.scrollY;
    }, { passive: true });

    window.addEventListener('scroll', function () {
      if (!scrolling) {
        currentScroll = window.scrollY;
        targetScroll = window.scrollY;
      }
    }, { passive: true });
  }


  // ============================================
  // INIT
  // ============================================
  function init() {
    initArrivalParallax();
    initExperienceSlideshow();
    initRevealObservers();
    initLazyLoad();
    initSmoothMomentum();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
