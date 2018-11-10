$(function () {
    //NavBar 
    $(window).scroll(function () {
        $('#mainNav').toggleClass('bg-navbar-scrolled', $(this).scrollTop() > 500)
        $('.js-scroll-trigger').toggleClass('scrolled-nav-link', $(this).scrollTop() > 500)
    });

    // ScrollReveal
    ScrollReveal({
        reset: true
    });
    ScrollReveal().reveal('.dash-center-name', {
        delay: 500
    });
    ScrollReveal().reveal('#skill-1', {
        delay: 200
    });
    ScrollReveal().reveal('#skill-2', {
        delay: 400
    });
    ScrollReveal().reveal('#skill-3', {
        delay: 600
    });
    ScrollReveal().reveal('#skill-4', {
        delay: 800
    });
    // Scroll Smooth
    $('a[href*="#"]') // Select all links with #
        // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function (event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
                location.hostname == this.hostname
            ) {
                // Figure out element to scroll to
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                // Does a scroll target exist?
                if (target.length) {
                    // Only prevent default if animation is actually gonna happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 500, function () {
                        // Callback after animation
                        // Must change focus!
                        var $target = $(target);
                        $target.focus();
                        if ($target.is(":focus")) { // Checking if the target was focused
                            return false;
                        } else {
                            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                            $target.focus(); // Set focus again
                        };
                    });
                }
            }
        });
    
    $('.portfolio-box-caption').on('mouseenter', function() {
        $('this').css('opacity', 1);
    })

});
