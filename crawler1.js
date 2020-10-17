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
         console.log("res.request.uri.href:"+res.request.uri.href);
       //  console.log( $('wiki-content').find('p'));
        // 获取所有的标题
        $('.wiki-content').find('p').each((i, item) => {
          console.log( "遍历dom");
         
         // console.log( $(item));
          var $article = $(item);
          let link = $article.find('a').attr('href');
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
var queue = []
var uriObject = {
  uri: 'https://wiki.hikvision.com.cn/login.action?os_destination=%2Fpages%2Fviewpage.action%3FpageId%3D154044768&permissionViolation=true',
  headers : {
    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36',
    'Cookie':'seraph.confluence=147954903%3A66c1fac495d69eee9b8b93fb505fc406edf9caee; experimentation_subject_id=IjE2OTIxNGRlLTA0ODUtNDFiMC1hMWNjLWRhMDlmNzk4NGQwOCI%3D--9ab643c4395969f85d81b2d7f2341ebd7b4fb925; PS_DEVICEFEATURES=width:1920 height:1080 pixelratio:1 touch:0 geolocation:1 websockets:1 webworkers:1 datepicker:1 dtpicker:1 timepicker:1 dnd:1 sessionstorage:1 localstorage:1 history:1 canvas:1 svg:1 postmessage:1 hc:0; doc-sidebar=300px; SignOnDefault=zhaodacheng5; confluence-sidebar.width=520; inproducttranslatemode=false; LtpaToken=AAECAzVGODdBM0JENUY4ODRDN0R6aGFvZGFjaGVuZzXOqc+siAQLvYYrr8GU83uxFFmo1g==; JwtToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiaUJ0N240akpuS2RJV3BxamdXUmhVYUVrMUc2Yzgzd0ZDaEtPMzJTVHV2VlhMR3hkeEtTQ1duTXVVOVFPRFFLdkFSaVF5QmJUcEhHdlE1K2liYVBtOHZ1ME80MjJrVWJVdmFMM1BTNnNxSjZFODRiRUl0L253bFE0dzRyWWlhWVRXbmRqK3R0Y1hZc3FZZThEbVNBPSIsImV4cCI6MTYwMjc2Nzk5NywiaWF0IjoxNjAyNzI0Nzk3fQ.lgDe12g9lI-XDgl4O8KazpOChCPX4cqd4j8-ZVuBxvI; PHPSESSID=rqrp9lnqmu5d1mijfg66k414g2; JSESSIONID=BBAD775AD2077DCE91E9FAB14FAE84FD'
  }

}
queue.push(uriObject);

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
      let $content = $('body');
      //let title = $article.find('.title').text();
      //console.log(title);
      //let date = $article.find('.publish-time').text().replace('*', '');
     // let $content = $article.find('.show-content');

    //  console.log(date);
      //let $footer = $article.find('.show-foot');
     // let anthology = $footer.find('.notebook span').text();

      // 删除图片的标题
     // $content.find('img').remove();
      $content.find('div').each(function(i, item) {
        var children = $(this).html();
        $(this).replaceWith(children);
      })
      let articleBody = toMarkdown($content.html());
      //let articleBody = $content.html();
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
    linkQueue.push(`https://wiki.hikvision.com.cn${link}`);
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
