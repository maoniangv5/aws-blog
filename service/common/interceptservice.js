// 登陆拦截
module.exports = function (req, res, next) {
    var url = req.originalUrl;
    console.log(url + '================================================================')
    if (url != "/admin/login" && !req.session.uid) {
        return res.redirect("/admin/login");
    }
    next();
};