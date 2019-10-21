/*-----------------------------------------------------------------------------|
 |                                 字符串格式化                                  |
 |----------------------------------------------------------------------------*/
/**
 * 替换字符串中 {placeholder} 或者 {0}, {1} 等模式部分为参数中传入的字符串
 * 使用方法:
 *     formatString('I can speak {language} since I was {age}', {language: 'Javascript', age: 10})
 *     formatString('I can speak {0} since I was {1}', 'Javascript', 10)
 * 输出都为:
 *     I can speak Javascript since I was 10
 *
 * @param str 带有 placeholder 的字符串
 * @param replacements 用来替换 placeholder 的 JSON 对象或者数组
 */
var formatString = function (str, replacements) {
    replacements = (typeof replacements === 'object') ? replacements : Array.prototype.slice.call(arguments, 1);
    return str.replace(/\{\{|\}\}|\{(\w+)\}/g, function(m, n) {
        if (m === '{{') { return '{'; }
        if (m === '}}') { return '}'; }
        return replacements[n];
    });
};

/**
 * 扩展了 String 类型，给其添加格式化的功能，替换字符串中 {placeholder} 或者 {0}, {1} 等模式部分为参数中传入的字符串
 * 使用方法:
 *     'I can speak {language} since I was {age}'.format({language: 'Javascript', age: 10})
 *     'I can speak {0} since I was {1}'.format('Javascript', 10)
 * 输出都为:
 *     I can speak Javascript since I was 10
 *
 * @param replacements 用来替换 placeholder 的 JSON 对象或者数组
 */
String.prototype.format = function(replacements) {
    replacements = (typeof replacements === 'object') ? replacements : Array.prototype.slice.call(arguments, 0);
    return formatString(this, replacements);
};

/**
 * 字符串转换为日期
 * 例子:
 *     '2016-03-29 18:30:00'.toDate('yyyy-MM-dd hh:mm:ss');
 *     '22/03/2016 14:03:01'.toDate('dd/MM/yyyy hh:mm:ss');
 *
 * @param  {String} format 日期格式，例如 yyyy-MM-dd hh:mm:ss
 * @return {Date} 返回字符串对应的日期
 */
String.prototype.toDate = function(format) {
    var normalized       = this.replace(/[^a-zA-Z0-9]/g, '-');
    var normalizedFormat = format.replace(/[^a-zA-Z0-9]/g, '-');
    var formatItems      = normalizedFormat.split('-');
    var dateItems        = normalized.split('-');

    var monthIndex   = formatItems.indexOf('MM');
    var dayIndex     = formatItems.indexOf('dd');
    var yearIndex    = formatItems.indexOf('yyyy');
    var hourIndex    = formatItems.indexOf('hh');
    var minutesIndex = formatItems.indexOf('mm');
    var secondsIndex = formatItems.indexOf('ss');

    var today = new Date();

    var year  = yearIndex>-1  ? dateItems[yearIndex]    : today.getFullYear();
    var month = monthIndex>-1 ? dateItems[monthIndex]-1 : today.getMonth()-1;
    var day   = dayIndex>-1   ? dateItems[dayIndex]     : today.getDate();

    var hour    = hourIndex>-1    ? dateItems[hourIndex]    : today.getHours();
    var minute  = minutesIndex>-1 ? dateItems[minutesIndex] : today.getMinutes();
    var second  = secondsIndex>-1 ? dateItems[secondsIndex] : today.getSeconds();

    return new Date(year, month, day, hour, minute, second);
};

/**
 * 解析 JSON 字符串为数组
 *
 * @return {Array} 返回字符串对应的数组，如果字符串不是数组格式，返回空数组
 */
String.prototype.toArray = function() {
    try {
        var array = JSON.parse(this);
        return Array.isArray(array) ? array : [];
    } catch (error) {
        console.log(`字符串解析为数组出错: ${this}`);
    }

    return [];
};

/*-----------------------------------------------------------------------------|
 |                                    Array                                    |
 |----------------------------------------------------------------------------*/
/**
 * 从数组中删除下标为 index 的元素
 *
 * @param  {Integer} index 要删除的元素的下标
 * @return 无返回值
 */
Array.prototype.remove = function(index) {
    this.splice(index, 1);
};

/**
 * 在下标为 index 处向数组中插入一个元素，例如 arr.remove(2)
 *
 * @param  {Integer}     index 要插入元素的位置
 * @param  {ElementType} elem  要插入的元素
 * @return 无返回值
 */
Array.prototype.insert = function(index, elem) {
    this.splice(index, 0, elem);
};

/**
 * 替换数组中下标为 index 处的元素
 *
 * @param  {Integer}     index 要替换的元素的位置
 * @param  {ElementType} elem  用于替换的元素
 * @return 无返回值
 */
Array.prototype.replace = function(index, elem) {
    if (index>=0 && index<this.length) {
        this.splice(index, 1, elem);
    }
};

/**
 * 将日期格式化成指定格式的字符串
 *
 * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
 * @returns 返回格式化后的日期字符串
 */
Date.prototype.format = function (fmt) {
    fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
    var obj = {
        y: this.getFullYear(),    // 年份，注意必须用getFullYear
        M: this.getMonth() + 1,   // 月份，注意是从0-11
        d: this.getDate(),        // 日期
        q: Math.floor((this.getMonth() + 3) / 3), // 季度
        w: this.getDay(),         // 星期，注意是0-6
        H: this.getHours(),       // 24小时制
        h: this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, // 12小时制
        m: this.getMinutes(),     // 分钟
        s: this.getSeconds(),     // 秒
        S: this.getMilliseconds() // 毫秒
    };
    var week = ['天', '一', '二', '三', '四', '五', '六'];
    for (var i in obj) {
        fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
            var val = obj[i] + '';
            if (i === 'w') return (m.length > 2 ? '星期' : '周') + week[val];
            for (var j = 0, len = val.length; j < m.length - len; j += 1) val = '0' + val;
            return m.length === 1 ? val : val.substring(val.length - m.length);
        });
    }
    return fmt;
};

/*-----------------------------------------------------------------------------|
 |                                   Utils                                     |
 |----------------------------------------------------------------------------*/
function Utils() {

}

// iView 的 Notice，需要注入，例如在 vue 的 created() 中注入: Utils.Notice = this.$Notice
Utils.Notice = null;

/**
 * 显示警告信息，默认使用 iView 的 Notice，如果没有设置则使用 alert()
 *
 * @param  {String}  title 标题
 * @param  {String}  desc  描述
 * @param  {Integer} duration  关闭时间，单位为秒
 * @return 无返回值
 */
Utils.warning = function(title, desc = '', duration = 10) {
    if (Utils.Notice) {
        Utils.Notice.warning({ title, desc, duration });
    } else {
        alert(`${title}\n${desc}`);
    }
};

// 成功
Utils.success = function(title, desc = '', duration = 4.5) {
    if (Utils.Notice) {
        Utils.Notice.success({ title, desc, duration });
    } else {
        alert(`${title}\n${desc}`);
    }
};

// 通知
Utils.info = function(title, desc = '', duration = 4.5) {
    if (Utils.Notice) {
        Utils.Notice.info({ title, desc, duration });
    } else {
        alert(`${title}\n${desc}`);
    }
};

Utils.message = Utils.info; // Utils.info 的别名

Utils.notice = function(title, desc = '', duration = 4.5) {
    if (Utils.Notice) {
        Utils.Notice.info({ title, desc, duration });
    } else {
        alert(`${title}\n${desc}`);
    }
};

/**
 * 文件类型和对应的 CSS 样式名
 */
Utils.types = {
    png : 'file-type-png',
    jpg : 'file-type-jpg',
    jpeg: 'file-type-jpg',
    gif : 'file-type-gif',
    pdf : 'file-type-pdf',
    doc : 'file-type-word',
    docx: 'file-type-word',
    ppt : 'file-type-ppt',
    pptx: 'file-type-ppt',
    xls : 'file-type-excel',
    xlsx: 'file-type-excel',
    zip : 'file-type-zip',
    rar : 'file-type-zip',
    '7z': 'file-type-zip',
    swf : 'file-type-swf',
    mp4 : 'file-type-mp4',
    mp3 : 'file-type-mp3',
};

/**
 * 获取文件名的后缀
 *
 * @param  {String} filename 文件名或者 URI、URL
 * @return {String} 返回文件名的后缀
 */
Utils.getFilenameExtension = function(filename) {
    var parser = document.createElement('a');
    parser.href  = filename;

    filename     = parser.pathname.toLowerCase(); // 去掉参数等和文件名无关的部分
    const dotPos = filename.lastIndexOf('.');
    const ext    = filename.substring(dotPos + 1);

    return ext;
};

/**
 * 根据文件名返回对应的 CSS class 名
 *
 * @param  {String} filename 文件名或者 URI、URL
 * @return {String} 返回文件名对应的 CSS class 名
 */
Utils.getFileClass = function(filename) {
    const type = Utils.types[Utils.getFilenameExtension(filename)];

    return type || 'file-type-other';
};

/**
 * 判断文件是否图片
 *
 * @param  {String} filename 文件名或者 URI、URL
 * @return {Boolean} 文件是图片时返回 true，否则返回 false
 */
Utils.isImage = function(filename) {
    const ext = Utils.getFilenameExtension(filename);

    return ('png' === ext || 'jpg' === ext || 'jpeg' === ext || 'gif' === ext);
};

/**
 * 判断文件是否 MP3
 *
 * @param  {String} filename 文件名或者 URI、URL
 * @return {Boolean} 文件是 MP3 时返回 true，否则返回 false
 */
Utils.isMp3 = function(filename) {
    const ext = Utils.getFilenameExtension(filename);

    return ext === 'mp3';
};

/**
 * 判断文件是否 MP4
 *
 * @param  {String} filename 文件名或者 URI、URL
 * @return {Boolean} 文件是 MP4 时返回 true，否则返回 false
 */
Utils.isMp4 = function(filename) {
    const ext = Utils.getFilenameExtension(filename);

    return ext === 'mp4';
};

/**
 * 从 100 开始生成新的 ID
 *
 * @return {Integer} 返回页面打开后按顺序生成的 ID
 */
Utils.nextId = function() {
    if (window.newGeneratedId) {
        window.newGeneratedId += 1;
    } else {
        window.newGeneratedId = 100;
    }

    return window.newGeneratedId;
};

Utils.BASE_CN_NUMBERS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

/**
 * 阿拉伯数字转为中文数字，支持 [0, 99]
 *
 * @param  {Integer} n 阿拉伯数字
 * @return {String}  返回 [0, 99] 之间的中文数字字符串，超出范围的返回 ''
 */
Utils.toCnNumber = function(n) {
    n = parseInt(n);

    if (0 <= n && n <= 10) {
        return Utils.BASE_CN_NUMBERS[n];
    } else if (11 <= n && n <= 99) {
        const ge  = parseInt(n%10);
        const shi = parseInt(n/10);

        if (1 === shi) {
            // 11-19: 十一、十二、...
            return '十' + (ge!==0?Utils.BASE_CN_NUMBERS[ge]:'');
        } else {
            // 20-99: 二十一、二十二、...
            return Utils.BASE_CN_NUMBERS[shi] + '十' + (ge===0?'':Utils.BASE_CN_NUMBERS[ge]);
        }
    } else {
        return '';
    }
};

/**
 * 生成一序列间隔为 step 整数，asc 为 true 时生成 [start, end]，asc 为 false 时生成 [end, start]
 *
 * @param  {Integer} start 开始的整数
 * @param  {Integer} end   结束的整数
 * @param  {Boolean} asc   为 true 则使用升序，为 false 使用降序
 * @return {Array} 返回整数的数组
 */
Utils.numbersInRange = function(start, end, step = 1, asc = true) {
    const ns = [];

    for (let i = start; i <= end; i += step) {
        ns.push(i);
    }

    return asc ? ns : ns.reverse();
};

Utils.CAN_NOT_PREVIEW  = 0; // 不可预览
Utils.CAN_PREVIEW      = 1; // 可以预览
Utils.CONVERTING       = 2; // 转换中
Utils.CONVERTING_ERROR = 3; // 转换错误

/**
 * 请求预览信息, 参数为 JSON 对象, 只有 uri 为必要参数, 其他的都为可选参数, 格式为
 * {
 *     uri     : '/file/data/2018-10-21/238639489453391872.docx', // 要预览文件的 URI
 *     ready   : function(previewUrl) {},    // 可以预览的回调函数, 参数为预览的 URL
 *     progress: function(progressValue) {}, // 文件正在转换中的回调函数, 参数 progressValue 为转换的进度, 值为 [0, 100]
 *     complete: function() {},              // 请求结束的回调函数, 例如结束加载动画
 *     timeout : 120,                        // 请求的超时时间, 单位为秒, 默认超时时间为 60 秒
 * }
 *
 * 算法: 定时轮询请求文件是否可预览了, 当文件可以预览或者请求超时则结束轮询请求.
 *
 * @param  {String}   uri      [必要] 要预览文件的 URI
 * @param  {Function} ready    [可选] 可以预览的回调函数, 参数为预览的 URL
 * @param  {Function} progress [可选] 文件正在转换中的回调函数, 参数 progressValue 为转换的进度, 值为 [0, 100]
 * @param  {Function} complete [可选] 请求结束的回调函数, 例如结束加载动画
 * @param  {Integer}  timeout  [可选] 请求的超时时间, 单位为秒
 * @return 无返回值
 */
Utils.canPreview = function({ uri, ready, progress, complete, timeout }) {
    const url     = Urls.API_CAN_PREVIEW_FILE_PREFIX + uri;
    let stopped   = false;
    let timerId   = 0;
    let expiredAt = new Date().getTime() + (timeout ? timeout*1000 : 120*1000); // 默认超时时间为 120 秒

    // 结束请求预览信息
    function stopRequestPreviewInfo() {
        window.clearInterval(timerId);
        stopped = true;
        complete && complete();
    }

    // 请求预览信息
    function requestPreviewInfo() {
        if (stopped) { return; }

        $.rest.get({ url, success: (result) => {
            if (result.success) {
                const previewResult   = result.data;
                const type            = previewResult.type; // 类型
                const previewUrl      = previewResult.url; // 预览的 URL
                const convertProgress = previewResult.progress; // 转换进度

                if (type === Utils.CAN_NOT_PREVIEW) {
                    // 不可预览
                    stopRequestPreviewInfo();
                    Utils.warning(`文件不可预览: ${uri}`);
                } else if (type === Utils.CAN_PREVIEW) {
                    // 可以预览
                    stopRequestPreviewInfo();
                    ready && ready(previewUrl);
                } else if (type === Utils.CONVERTING) {
                    // 转换中
                    progress && progress(convertProgress);

                    // 超时还在转换则结束请求
                    if (new Date().getTime() > expiredAt) {
                        stopRequestPreviewInfo();
                    }
                } else if (type === Utils.CONVERTING_ERROR) {
                    // 转换错误
                    stopRequestPreviewInfo();

                    Utils.warning('文件转换错误', '详细错误信息请查看控制台输出 (Chrome 按下快捷键 F12)');
                    console.error(previewResult.error);
                }
            } else {
                stopRequestPreviewInfo();
                Utils.warning(result.message);
            }
        }, fail: () => {
            stopRequestPreviewInfo();
        } });
    }

    requestPreviewInfo(); // 立即执行请求
    timerId = window.setInterval(requestPreviewInfo, 3000); // 每 3 秒执行请求一次
};

/**
 * 日期转为 JSON 字符串
 */
Date.prototype.toJSON = function() {
    return dayjs(this).format('YYYY-MM-DD HH:mm:ss'); // 使用 dayjs，输出 2019-09-30 11:10:53
};