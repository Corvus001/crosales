$(function () {
    $('.headerTitle').hover(function () {
        $('h2', this).fadeIn(350);
    }, function () {

        $('h2', this).fadeOut(5);
    });

    $('.box').hover(function () {
        let bgProp = $(this).css('background-image');
        console.log(bgProp);
        let url = bgProp.substring(bgProp.indexOf('url'));
        console.log(url);
        $(this).css("background-image", url);
    }, function () {
        let url = $(this).css('background-image');
        let bgProp = 'linear-gradient(rgba(20, 20, 20, 0.5), rgba(20, 20, 20, 0.5)), ' + url;
        $(this).css('background-image', bgProp);
    });
    // Scroll Smooth
    $('a[href*="#"]') // Select all links with #
        // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function (event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
                &&
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
});

