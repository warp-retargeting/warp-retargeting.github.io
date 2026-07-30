window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    function setResultsVideoTab(targetId) {
      var $tabs = $('.resteer-video-tabs li[role="tab"]');
      var $panels = $('.resteer-tab-panel[role="tabpanel"]');

      $tabs.removeClass('is-active').attr('aria-selected', 'false');
      $tabs.filter('[data-target="' + targetId + '"]').addClass('is-active').attr('aria-selected', 'true');

      $panels.addClass('is-hidden');
      var $activePanel = $('#' + targetId);
      $activePanel.removeClass('is-hidden');

      $panels.not($activePanel).find('video').each(function() {
        this.pause();
      });
      $activePanel.find('video').each(function() {
        if (this.paused) this.play();
      });
    }

    $(document).on('click', '.resteer-video-tabs li[role="tab"]', function() {
      var targetId = $(this).data('target');
      if (targetId) setResultsVideoTab(targetId);
    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    // Card pager: wraps each .card-rail with prev/next arrows and dots,
    // paging one card at a time (native swipe still works without JS).
    document.querySelectorAll('.card-rail').forEach(function (rail) {
      var cards = rail.querySelectorAll('.info-card');
      if (cards.length < 2) return;

      var wrap = document.createElement('div');
      wrap.className = 'card-pager';
      rail.parentNode.insertBefore(wrap, rail);
      wrap.appendChild(rail);

      var prev = document.createElement('button');
      prev.type = 'button';
      prev.className = 'pager-arrow pager-prev';
      prev.setAttribute('aria-label', 'Previous card');
      prev.innerHTML = '&#10094;';
      var next = document.createElement('button');
      next.type = 'button';
      next.className = 'pager-arrow pager-next';
      next.setAttribute('aria-label', 'Next card');
      next.innerHTML = '&#10095;';
      wrap.appendChild(prev);
      wrap.appendChild(next);

      var dots = document.createElement('div');
      dots.className = 'pager-dots';
      cards.forEach(function (_, i) {
        var d = document.createElement('button');
        d.type = 'button';
        d.className = 'pager-dot';
        d.setAttribute('aria-label', 'Go to card ' + (i + 1));
        d.addEventListener('click', function () { go(i); });
        dots.appendChild(d);
      });
      wrap.appendChild(dots);

      function gap() {
        return parseFloat(getComputedStyle(rail).columnGap) || 0;
      }
      function index() {
        return Math.max(0, Math.min(cards.length - 1,
          Math.round(rail.scrollLeft / (rail.clientWidth + gap()))));
      }
      function go(i) {
        i = Math.max(0, Math.min(cards.length - 1, i));
        rail.scrollTo({ left: i * (rail.clientWidth + gap()), behavior: 'smooth' });
      }
      function update() {
        var i = index();
        dots.querySelectorAll('.pager-dot').forEach(function (d, j) {
          d.classList.toggle('is-active', j === i);
        });
        prev.disabled = i <= 0;
        next.disabled = i >= cards.length - 1;
      }

      prev.addEventListener('click', function () { go(index() - 1); });
      next.addEventListener('click', function () { go(index() + 1); });
      rail.addEventListener('scroll', function () { requestAnimationFrame(update); }, { passive: true });
      update();
    });

    // Autoplay videos only while in view; pause when scrolled away.
    // Opt in with class "js-autoplay-inview" (e.g. the method animation).
    (function () {
      var vids = document.querySelectorAll('video.js-autoplay-inview');
      if (!vids.length) return;
      function tryPlay(v) { v.muted = true; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      if (!('IntersectionObserver' in window)) {
        vids.forEach(tryPlay);
        return;
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) tryPlay(e.target);
          else e.target.pause();
        });
      }, { threshold: 0.35 });
      vids.forEach(function (v) { io.observe(v); });
    })();

    bulmaSlider.attach();

})
