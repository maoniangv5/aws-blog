$(function () {
    var height = $(window).height();
    var width = $(window).width() + 20;
    setTimeout(function () {
        $(".blog-detail-image").css({'height': height + 'px', 'width': width + 'px', 'overflow': 'hidden'});
        $("img").attr('src','http://ac-b4we01tq.clouddn.com/2656d5abdf9a8df062b1.jpg')
    }, 0);
})