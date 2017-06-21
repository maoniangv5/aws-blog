// 初始化iCheck
function initiCheck() {
    if ($('.icheck-cat').length > 0) {
        $('input.icheck-cat').iCheck({
            checkboxClass: 'icheckbox_square-grey',
            radioClass: 'iradio_square-grey',
            increaseArea: '20%'
        });
    }
}

// 新增分类
function addCategory() {
    $("#category-add").removeClass("hide");
    $("#category-info").addClass("hide");
    resetAddInfo();
}

// 保存新分类
function saveCategory() {
    var query = {};

    if ($("#name").val()) {
        query.name = $("#name").val().trim();
    } else {
        toastr.warning("请输入分类名称！");
        return;
    }

    if ($("#simple").val()) {
        query.simple = $("#simple").val().trim();
    } else {
        toastr.warning("请输入英文简称！");
        return;
    }

    if ($("#desc").val()) {
        query.desc = $("#desc").val().trim();
    } else {
        toastr.warning("请输入描述信息！");
        return;
    }
    query.style = $("#style").val();
    query.is_pub = $('input:radio:checked')[0].defaultValue;
    query.is_remove = $('input:radio:checked')[1].defaultValue;

    $.ajax({
        url: '/api/category',
        type: 'POST',
        data: query,
        success: function (data) {
            console.log(data)
            if (data.code == 1) {
                toastr.success("新增分类成功！");
                $("#category-add").addClass("hide");
                $("#category-info").removeClass("hide");
                resetAddInfo();
                getCategory();
            } else {
                toastr.error("新增分类失败:" + data.msg + "！");
            }
        }
    });
}

// 取消保存新分类
function cancelSave() {
    $("#category-add").addClass("hide");
    $("#category-info").removeClass("hide");
    resetAddInfo();
}

// 重置新增输入
function resetAddInfo() {
    $("#name").val("");
    $("#simple").val("");
    $("#desc").val("");
    $("#style").val("default");
}

// 获取分类
function getCategory() {
    $.ajax({
        url: '/api/category',
        type: 'GET',
        success: function (rm) {
            if (rm.code == 1) {
                var data = rm.result;
                var str_panel = '';
                data.map(function (index, key) {
                    str_panel += '<div class="panel panel-' + index.style + ' ">' +
                        '<div class="panel-heading">' +
                        '<h3 class="panel-title">' +
                        '<a class="block-collapse" data-parent="#accordion-' + key + '" data-toggle="collapse" href="#accordion-' + key + '-child-' + key + '">' + index.name +
                        '<span class="right-content">' +
                        '<span class="right-icon">' +
                        '<i class="glyphicon glyphicon-plus icon-collapse"></i>' +
                        '</span>' +
                        '</span>' +
                        '</a>' +
                        '</h3>' +
                        '</div>' +
                        '<div id="accordion-' + key + '-child-' + key + '" class="collapse">' +
                        '<div class="panel-body">' +
                        '<span>' + index.desc + '</span>' +
                        '<hr class="all-hr" />' +
                        '<span title="修改" style="cursor:pointer" onclick="detailCategory(\'' + index._id + '\')"><i class="fa fa-edit"></i></span>&nbsp;&nbsp;' +
                        '<span title="删除" style="cursor:pointer" onclick="detailCategory(\'' + index._id + '\')"><i class="fa fa-trash-o"></i></span>&nbsp;&nbsp;' +
                        '<span title="详情" style="cursor:pointer" onclick="detailCategory(\'' + index._id + '\')"><i class="fa fa-list-alt"></i></span>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                });
                $("#category-group").html(str_panel);
                initPanel();
            } else {
                toastr.error("查询分类失败:" + data.msg + "！");
            }
        }
    });
}

// 分类详情
function detailCategory(id) {
    toastr.success(id);
}
// 初始化panel点击
function initPanel() {
    $('.collapse').on('show.bs.collapse', function () {
        var id = $(this).attr('id');
        $('a.block-collapse[href="#' + id + '"] span.right-icon').html('<i class="glyphicon glyphicon-minus icon-collapse"></i>');
    });
    $('.collapse').on('hide.bs.collapse', function () {
        var id = $(this).attr('id');
        $('a.block-collapse[href="#' + id + '"] span.right-icon').html('<i class="glyphicon glyphicon-plus icon-collapse"></i>');
    });
}

// 页面加载执行
$(function () {
    $("#add-category").on("click", function () {
        addCategory();
    });
    $("#save").on("click", function () {
        saveCategory();
    });
    $("#cancel").on("click", function () {
        cancelSave();
    });
    getCategory();
    initiCheck();
})
