/* ============================================
   Cloud 9 Key West -- Immersive Scroll Experience
   Pure vanilla JS. No dependencies.
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
        // Subtle zoom in + upward drift as user scrolls away
        var progress = scrollY / vh;
        var scale = 1.05 + progress * 0.08;
        var translateY = progress * -30;
        image.style.transform = 'scale(' + scale + ') translate3d(0, ' + translateY + 'px, 0)';

        // Fade out content and scroll cue
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

    if (!section || !slides.length) return;

    var totalSlides = slides.length;
    var currentSlide = -1;
    var ticking = false;

    function update() {
      var rect = section.getBoundingClientRect();
      var sectionTop = -rect.top;
      var sectionHeight = section.offsetHeight - window.innerHeight;

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
        // On last slide, fill completely
        if (slideIndex === totalSlides - 1) {
          progressPercent = 100;
        }
        progressBar.style.width = progressPercent + '%';
      }

      // Switch slide if changed
      if (slideIndex !== currentSlide) {
        currentSlide = slideIndex;

        slides.forEach(function (slide, i) {
          if (i === slideIndex) {
            slide.classList.add('is-active');
          } else {
            slide.classList.remove('is-active');
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
  // SCENE 3: DETAILS -- Horizontal scroll via vertical
  // ============================================
  function initDetailsHorizontalScroll() {
    var section = document.querySelector('.scene-details');
    var track = document.querySelector('.details__track');
    if (!section || !track) return;

    var ticking = false;

    function update() {
      var rect = section.getBoundingClientRect();
      var sectionTop = -rect.top;
      var sectionHeight = section.offsetHeight - window.innerHeight;

      if (sectionTop < 0) sectionTop = 0;
      if (sectionTop > sectionHeight) sectionTop = sectionHeight;

      // Calculate how far to translate the track
      var scrollProgress = sectionTop / sectionHeight;

      // Total scrollable width = track width - viewport width
      var trackWidth = track.scrollWidth;
      var viewportWidth = window.innerWidth;
      var maxTranslate = Math.max(0, trackWidth - viewportWidth + 60); // +60 for right padding

      var translateX = -scrollProgress * maxTranslate;

      track.style.transform = 'translate3d(' + translateX + 'px, 0, 0)';

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    // Also update on resize
    window.addEventListener('resize', function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }


  // ============================================
  // INTERSECTION OBSERVER -- Reveal animations
  // ============================================
  function initRevealObservers() {
    // Elements that get 'is-visible' class when entering viewport
    var revealTargets = [
      '.details__intro',
      '.scene-location',
      '.scene-designer'
    ];

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    revealTargets.forEach(function (selector) {
      var el = document.querySelector(selector);
      if (el) observer.observe(el);
    });
  }


  // ============================================
  // LAZY LOADING -- Native + IntersectionObserver fallback
  // ============================================
  function initLazyLoad() {
    // Modern browsers handle loading="lazy" natively.
    // This is a safety net for older browsers.
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
    // Skip on mobile, touch devices, or reduced motion
    if (prefersReducedMotion) return;
    if ('ontouchstart' in window) return;
    if (window.innerWidth < 1024) return;

    var currentScroll = window.scrollY;
    var targetScroll = window.scrollY;
    var scrolling = false;
    var ease = 0.09;

    function smoothStep() {
      currentScroll = lerp(currentScroll, targetScroll, ease);

      // Stop animating when close enough
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

    // Sync on resize
    window.addEventListener('resize', function () {
      currentScroll = window.scrollY;
      targetScroll = window.scrollY;
    }, { passive: true });

    // Sync on programmatic scroll (e.g., clicking links)
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
    initDetailsHorizontalScroll();
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
