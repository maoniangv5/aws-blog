/**
 * Created by duanying on 2017/5/18.
 */

module.exports = {
    db: "mongodb://localhost/websit",
    port: 3000,
    redis: { //redis配置
        isUsed: true, //需要使用redis是设置为true
        options: { //配置项
            host: '10.154.2.164', //主机地址
            port: 6379, //端口，6379为redis默认端口
            password: '', //密码，没有密码请去掉该项
            retryStrategy: function(times) { //重试时间
                var delay = Math.min(times * 2000, 60000);
                return delay;
            },
            reconnectOnError: function(err) { //报错重连
                var targetError = 'READONLY';
                if (err.message.slice(0, targetError.length) === targetError) { //仅错误以"READONLY"开头时重连
                    return true;
                }
            }
        }
    },
    imgs_config: { // 故障相关文件配置
        "imgs": __dirname.substring(0,__dirname.length-7)+ "\\public\\images" //图片临时上传路径
    },
    dicsConfig: { // 定时任务时间间隔，单位（小时）
        timeSpan: 1
    }
};
