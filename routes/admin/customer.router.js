let express = require('express');
let router = express.Router();
let RestMsg = require("../../common/restmsg");
let Channel = require("../../service/channel/model/channelbo");
let CustomerService = require("../../service/customer/customerservice");
let CustomerBo = require("../../service/customer/model/customerbo");
let fs = require('fs');
let multer = require('multer');
let xlsx = require('node-xlsx');
const config = require("../../config/config");
const checkarea = require('../../common/checkarea');
const excelname = [`客户名称 * `, `区域  * `, `省/直辖市  * `, `城市/区县  * `, `网址`, `详细地址`, `姓名`, `部门`, `职位`],
    excelvalue = [`name`, `area`, `province`, `city`, `net`, `address`, `linkman_name`, `linkman_department`, `linkman_job`];

function deleteUndef(obj) {
    for (var i in obj) {
        if (obj[i] === undefined) delete obj[i];
    }
    return obj;
}


router.route('/')
    /**
     * 分页查询客户
     */
    .get(function(req, res, next) {
        let { row, start, name, area, province, city } = req.query,
            restmsg = new RestMsg(),
            query = {
                row,
                start,
                name: name ? new RegExp(name) : name,
                area: area ? new RegExp(area) : area,
                province: province ? new RegExp(province) : province,
                city: city ? new RegExp(city) : city,
            };
        query = deleteUndef(query);
        CustomerService.findList(query, function(err, customerpages) {
            if (err) next(err);
            restmsg.successMsg();
            restmsg.setResult(customerpages);
            res.send(restmsg);
        })
    })
    /**
     * 新增客户 2.1
     */
    .post(function(req, res, next) {
        let { name, area, province, city, address, net, linkman } = req.body,
            msg = '',
            restmsg = new RestMsg();
        // 校验数据
        if (!name) {
            msg += `客户名不能为空`;
        }
        // 校验地区表
        msg += checkarea(area, province, city);
        if (msg.length > 0) {
            restmsg.errorMsg(msg);
            return res.send(restmsg);
        }

        // 保存
        CustomerService.save({
            name, // 客户名
            area, // 区域
            province,
            city,
            address, // 详细地址
            net, // 网址
            linkman // 联系人
        }, function(err, channel) {
            if (err) return next(err);
            restmsg.successMsg();
            return res.send(restmsg);
        })
    });
/**
 * 导出客户excel表
 */
router.get('/export', function(req, res, next) {
    let { name, area, province, city } = req.query;
    query = {
        name: name ? new RegExp(name) : name,
        area: area ? new RegExp(area) : area,
        province: province ? new RegExp(province) : province,
        city: city ? new RegExp(city) : city
    };
    query = deleteUndef(query);
    CustomerService.find(query, function(err, customers) {
        if (err) return next(err);

        if (customers.length == 0) {
            return res.send("当前条件无数据!")
        }
        // 插入表头 => 按行插入数据 => 返回文件
        let data = [];
        // 表头
        data.push(excelname);
        // 
        customers.forEach(function(customer) {
            let row = [];
            excelvalue.forEach(function(v) {
                if (customer[v]) {
                    return row.push(customer[v])
                } else {
                    if (v == `linkman_name`) {
                        return row.push(customer.linkman.name || "")
                    } else if (v == `linkman_department`) {
                        return row.push(customer.linkman.department || "")
                    } else if (v == `linkman_job`) {
                        return row.push(customer.linkman.job || "")
                    } else {
                        row.push("");
                    }
                }
            })
            data.push(row);
        })

        // 新建一个xlsx 的文件
        let buffer = xlsx.build([{
            name: 'sheet1',
            data: data
        }]);
        let filenameStr = "客户信息";
        if (name) filenameStr = filenameStr + "_" + name;
        if (area) filenameStr = filenameStr + "_" + area;
        if (province) filenameStr = filenameStr + "_" + province;
        if (city) filenameStr = filenameStr + "_" + city;
        filenameStr +=".xlsx"

        res.set({
            'Content-Type': 'application/vnd.openxmlformats',
            'Content-Length': buffer.length
        });

        var userAgent = (req.headers['user-agent'] || '').toLowerCase();
        if (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
            res.set('Content-Disposition', 'attachment;filename=' + encodeURIComponent(filenameStr));
        } else if (userAgent.indexOf('firefox') >= 0) {
            res.set('Content-Disposition', 'attachment;filename*="utf8\'\'' + encodeURIComponent(filenameStr) + '"');
        } else {
            res.set('Content-Disposition', 'attachment;filename=' + encodeURIComponent(filenameStr));
        }

        return res.end(buffer, 'binary');
    })

});
/**
 * 导入客户excel表
 */
router.post('/import', multer({
    dest: config.excel
}), function(req, res, next) {
    let file = req.files.file,
        restmsg = new RestMsg()
        // 校验文件类型
    if (file.name.toLowerCase().indexOf(".xlsx") == -1) {
        restmsg.errorMsg("文件类型错误");
        return res.send(restmsg);
    }
    let customers = xlsx.parse(file.path)[0].data;
    // 保存到数据库
    let dvcustomer = [] // 格式化的customers 数组
    for (let i = 1; i < customers.length; i++) {
        let row = {
            linkman: {}
        };
        for (let j = 0; j < excelvalue.length; j++) {
            if (excelvalue[j].indexOf('linkman_name') != -1) {
                row.linkman.name = customers[i][j];
                continue;
            }
            if (excelvalue[j].indexOf('linkman_department') != -1) {
                row.linkman.department = customers[i][j];
                continue;
            }
            if (excelvalue[j].indexOf('linkman_job') != -1) {
                row.linkman.job = customers[i][j];
                continue;
            }
            row[excelvalue[j]] = customers[i][j];
        }
        if (row.name && row.area && row.province) {
            dvcustomer.push(row)
        } else {
            restmsg.errorMsg('表格文件缺少必填项,请按照星号必填输入');
            return res.send(restmsg);
        }
    }
    CustomerBo.create(dvcustomer, function(err) {
        if (err) return next(err);
        restmsg.successMsg();
        res.send(restmsg);
    })
});

router.route('/:cid')
    /**
     * 获取单条客户信息
     */
    .get(function(req, res, next) {
        const cid = req.params.cid,
            restmsg = new RestMsg();
        CustomerService.getById(cid, function(err, customer) {
            if (err) next(err);
            restmsg.successMsg();
            restmsg.setResult(customer);
            res.send(restmsg);
        })
    })
    /**
     * 修改单条客户信息
     */
    .put(function(req, res, next) {
        const { name, area, province, city, address, net, linkman } = req.body,
            restmsg = new RestMsg(),
            cid = req.params.cid;

        // 校验数据
        const msg = checkarea(province, city, address);
        if (msg.length > 0) {
            restmsg.errorMsg(msg);
            res.send(restmsg);
        }
        // 更新
        CustomerService.findByIdAndUpdate(cid, {
            name,
            area,
            province,
            city,
            address,
            net,
            linkman
        }, function(err, customer) {
            if (err) return next(err)
            if (!customer) {
                restmsg.errorMsg("客户不存在, 更新失败");
                return res.send(restmsg);
            }
            restmsg.successMsg();
            res.send(restmsg);
        })

    })
    /**
     * 删除单条客户信息
     */
    .delete(function(req, res, next) {
        const _id = req.params.cid,
            restmsg = new RestMsg();
        CustomerService.remove({
            _id
        }, function(err) {
            if (err) return next(err);
            restmsg.successMsg();
            res.send(restmsg);
        })
    });

module.exports = router;
