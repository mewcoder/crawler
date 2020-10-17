const { client, index, type } = require('./connection')

module.exports = {
  /** Query ES index for the provided term */

  /** 获取文档总数 */
  async queryCount() {
    return  client.count({index, type})
  },

  async update(data) {
    const body = {
      content: "data"
    };
    return client.search({ index, type, body });
  },
  
  async index(data){
    let resp;
    try{
        resp=await client.index({
            index,
            type,
            body:{
                content:data
            }
        });
    }catch(e){
        resp=null;
    }
    return resp;
}
}
