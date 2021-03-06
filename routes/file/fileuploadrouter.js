var express = require('express');
var router = express.Router();
var multer = require('multer');
var md5 = require('md5');
var fs = require('fs');
var path = require('path');

var config = require('../../config');
var RestMsg = require('../../common/restmsg');
var ImageService = require('../../service/images/imagesservice');

var imgs_dir = config.blog_images_config.imgs_dir;
var imgs_url = config.blog_images_config.imgs_url;

//初始化multer
var mwMulter = multer({
    dest: imgs_dir
});

router.post('/img', mwMulter.any(), function (req, res, next) { // 上传图片API
    if (!fs.existsSync(imgs_dir)) {
        fs.mkdirSync(imgs_dir);
    }
    var rm = new RestMsg();
    var files = req.files;
    var query = {};
    if (files[0]) {

        fs.readFile(files[0].path, function (err, buf) {
            var ext = files[0].mimetype.split('/')[files[0].mimetype.split('/').length - 1]
            var old_path = files[0].path
            query.md5 = md5(buf); // 调用md5包，计算图片md5值
            query.name = files[0].originalname;
            query.path = path.join(imgs_dir, md5(buf)) + '.' + ext;
            query.url = imgs_url + '/' + md5(buf) + '.' + ext;

            // 用计算出的md5值，重新命名文件
            fs.rename(old_path, query.path, function (err) {
                if (err) {
                    throw err;
                }
            })

            ImageService.count({"md5": query.md5}, function (err, count) {
                if (err) {
                    rm.errorMsg(err);
                    return res.send(rm);
                }
                if (count == 0) {
                    var desc = query.name.split('.');
                    desc.pop();
                    var obj = {
                        "title": query.name,
                        "url": query.url,
                        "type": "original",
                        "md5": query.md5,
                        "is_pub": true,
                        "desc": desc.join('.')
                    }
                    ImageService.save(obj, function (err, bo) {
                        if (err) {
                            rm.errorMsg(err);
                            return res.send(rm)
                        }
                        rm.successMsg();
                        rm.setResult(bo);
                        res.send(rm);
                    })
                } else {
                    ImageService.findOne({"md5": query.md5}, function (err, bo) {
                        if (err) {
                            rm.errorMsg(err);
                            return res.send(rm)
                        }
                        rm.successMsg();
                        rm.setResult(bo);
                        res.send(rm);
                    })
                }
            })
        });
    }
});

module.exports = router;