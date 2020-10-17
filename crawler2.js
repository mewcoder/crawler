process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const Crawler = require('crawler');
var toMarkdown = require('to-markdown');
//let util = require('./utils');
let articlesLink = [];
let articles = []


// 获取所有的文章链接
let crawlerMeta = new Crawler({
  maxConnections: 1,
  callback: (error, res, done) => {
    console.log('=========================crawlerMeta start=============================');
    if (error) {
      console.log(error);
    } else {
      console.log( 'referer:'+res.request.headers.referer);
      let $ = res.$;
      // 判断是否重定向, 如果页面数量超标的话则会重定向到其他页面
      if (res.request.headers.referer != undefined) {
         console.log(res.request.uri.href);
        // 获取所有的标题
        $('ul.note-list').find('li').each((i, item) => {
          var $article = $(item);
          let link = $article.find('.title').attr('href');
          console.log(link);
          articlesLink.push(link);
        })
      }
      console.log('=========================crawlerMeta end=============================');
    }
    done();
    
  }
})

console.log('=========================开始=============================');
//遍历页码
var i = 1;
var queue = []
while( i < 2) {
  var uriObject = {
    uri: 'http://www.jianshu.com/u/a8522ac98584?order_by=shared_at&&page=' + i,
    // 只获取对应的数据部分
    // headers: {
    //   'X-INFINITESCROLL': true
    // }
  }
  queue.push(uriObject);
  i ++;
}
console.log('queue:'+queue);

console.log('=========================queue=============================');


crawlerMeta.queue(queue)


let crawlerArticle = new Crawler({
  maxConnections: 1,
  callback: (error, res, done) => {
    console.log('=========================crawlerArticle  start=============================');
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
      $content.find('.image-package').remove();
      $content.find('div').each(function(i, item) {
        var children = $(this).html();
        $(this).replaceWith(children);
      })
      let articleBody = toMarkdown($content.html());
      
      article = {
        //title,
        //date: new Date(date),
        articleBody,
        //anthology
      }

      articles.push(article)
      console.log('=========================crawlerArticle end=============================');
    }
    done();
  }
})



// 第一个爬虫结束之后开启第二个爬虫n
crawlerMeta.on('drain', () => {
  
  console.log('=========================crawlerMeta.on  start=============================');
  console.log(articlesLink.length);
  let linkQueue = []
  articlesLink.forEach((link) => {
    linkQueue.push(`http://www.jianshu.com${link}`);
  });
  console.log(linkQueue);
  crawlerArticle.queue(linkQueue);
  console.log('=========================crawlerMeta.on end=============================');
});


//保存到数据库
crawlerArticle.on('drain', () => {
  console.log('=========================crawlerArticle.on start=============================');
  articles.forEach((item) => {
    console.log(item);
  })
  console.log('=========================crawlerArticle.on end=============================');
})
