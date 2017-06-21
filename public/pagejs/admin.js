$(function () {
    getCategory();
})
// 获取分类
function getCategory() {
    $.ajax({
        url: '/api/category',
        type: 'GET',
        success: function (rm) {
            if (rm.code == 1) {
                var data = rm.result;
                $("#category-total").text(data.length);
                var str_li = '';
                data.map(function (index, key) {
                    str_li += '<li><a href="#" data-simple="' + index.simple + '">' + index.name + '<span class="badge badge-info span-sidebar"></span></a></li>';
                });
                $("#category-li").html(str_li);
            } else {
                toastr.error("查询分类失败:" + rm.msg + "！");
            }
        }
    });
}