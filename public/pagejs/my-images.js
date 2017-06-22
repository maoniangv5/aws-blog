// 页面加载执行
$(function () {
    getAllImgs();
    initImgMasonry();
})

// 获取所有可显示图片
function getAllImgs() {
    var str = '';
    var data = true;
    if (!data)  {
        data.map(function (index, key) {
            str += '<li class="item-masonry">' +
                '<div class="the-box full no-border featured-post-wide mansory-inner">' +
                '<a class="zooming" href="' + index.img_url + '" title="' + index.img_desc + '">' +
                '<img src="' + index.img_url + '" class="featured-img mfp-fade item-gallery img-responsive" alt="image" height="100%" width="auto">' +
                '</a>' +
                '<div class="featured-text relative">' +
                '<p style="margin: 0">' + index.img_desc + '</p>' +
                '<p class="additional-post-wrap" style="margin: 0">' +
                '<span class="additional-post" style="padding: 0"><i class="fa fa-clock-o"></i>April 20</span>' +
                '</p></div> </div> </li>'
        })
    }
    $('#img-show-list').html(str);
}

// 初始化图片zoom
function initImgMasonry() {
    if ($('.magnific-popup-wrap').length > 0) {
        $('.magnific-popup-wrap').each(function () {
            "use strict";
            $(this).magnificPopup({
                delegate: 'a.zooming',
                type: 'image',
                removalDelay: 300,
                mainClass: 'mfp-fade',
                gallery: {
                    enabled: true
                }
            });
        });
    }

    if ($('.inline-popups').length > 0) {
        $('.inline-popups').magnificPopup({
            delegate: 'a',
            removalDelay: 500,
            callbacks: {
                beforeOpen: function () {
                    this.st.mainClass = this.st.el.attr('data-effect');
                }
            },
            midClick: true
        });
    }
    $('.magnific-img').magnificPopup({
        type: 'image',
        removalDelay: 300,
        mainClass: 'mfp-fade'
    });
}

