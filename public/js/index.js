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
});