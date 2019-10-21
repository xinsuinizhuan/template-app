/**
 * 下载 url 指定的文件
 *
 * @param {String} url 要下载的 URL
 */
const download = function(url) {
    // 1. 如果 url 是文件仓库的 url，则替换为下载使用的 url
    // 2. 创建 form 表单
    // 3. 提交表单下载文件

    if (!url) {
        return;
    }

    // [1] 如果 url 是文件仓库的 url，则替换为下载使用的 url
    const finalUrl = url.replace('/file/repo', '/file/download');

    // [2] 创建 form 表单
    const form = document.createElement('form');
    form.method = 'GET';
    form.action = finalUrl;
    document.body.appendChild(form);

    // [3] 提交表单下载文件
    form.submit();
};

export default {
    download,
};