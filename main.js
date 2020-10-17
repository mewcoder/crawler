const crawler_jianshu = require('./crawler_jianshu');


console.log('=========================开始=============================');
//遍历页码
let i = 1;
let queue = []
while (i < 2) {
    let uriObject = {
        uri: 'http://www.jianshu.com/u/a8522ac98584?order_by=shared_at&&page=' + i
    }
    queue.push(uriObject);
    i++;
}

crawler_jianshu.crawlerLink.queue(queue)