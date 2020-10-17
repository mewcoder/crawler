const Crawler = require('crawler');
const toMarkdown = require('to-markdown');
const fs = require('fs');

//解决node.js中使用https请求报CERT_UNTRUSTED的问题
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let articlesLink = [];
let articles = [];

// 获取所有的文章链接
const crawlerLink = new Crawler({
    maxConnections: 1,
    callback: (error, res, done) => {
        console.log('=========================获取所有的文章链接=============================');
        if (error) {
            console.log(error);
        } else {
            //console.log('referer:' + res.request.headers.referer);
            let $ = res.$;
            // 判断是否重定向, 如果页面数量超标的话则会重定向到其他页面
            if (res.request.headers.referer != undefined) {
                // console.log(res.request.uri.href);
                // 获取所有的标题
                $('ul.note-list').find('li').each((i, item) => {
                    var $article = $(item);
                    let link = $article.find('.title').attr('href');
                    console.log(link);
                    articlesLink.push(link);
                })
            }
        }
        done();

    }
})


// 处理链接
crawlerLink.on('drain', () => {
    console.log('=========================处理链接=============================');
    let linkQueue = []
    articlesLink.forEach((link) => {
        linkQueue.push(`http://www.jianshu.com${link}`);
    });
    //console.log(linkQueue);
    crawlerArticle.queue(linkQueue);
});


//爬取文章内容
const crawlerArticle = new Crawler({
    maxConnections: 1,
    callback: (error, res, done) => {
        console.log('=========================爬取文章内容=============================');
        if (error) {
            console.log(error);
        } else {
            let $ = res.$;


            //let article;
            // 
            let $content = $('article');
            //let title = $article.find('.title').text();
            //console.log(title);
            //let date = $article.find('.publish-time').text().replace('*', '');
            // let $content = $article.find('.show-content');

            //  console.log(date);
            //let $footer = $article.find('.show-foot');
            // let anthology = $footer.find('.notebook span').text();

            // 删除图片的标题
            //$content.find('.image-package').remove();
            // $content.find('div').each(function(i, item) {
            //     var children = $(this).html();
            //     $(this).replaceWith(children);
            // })
            let articleBody = toMarkdown($content.html());

            article = {
                //title,
                //date: new Date(date),
                articleBody,
                //anthology
            }

            articles.push(article);
        }
        done();
    }
})


//处理内容
crawlerArticle.on('drain', () => {
    console.log('=========================处理内容=============================');
    let i = 0;
    articles.forEach((item) => {
        //console.log(item);
        fs.writeFile('output/' + i + '.md', JSON.stringify(item), function(error) {
            if (error) { console.log('写入失败'); }
        });
        i++;
    })
})


module.exports = {
    crawlerLink,
    crawlerArticle
};