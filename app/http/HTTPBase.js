/**
 * Created by admin on 2017/12/5.
 */
let HTTPBase={};

/**
 * get请求
 * @params url
 * @params params
 * @params header
 * @return {promise}
 *
 */
HTTPBase.get=function(url,params,header){
    if(params) {
        let paramsArray = {};
        //获取 params 所有的 key
        let paramsKeyArray = Object.keys(params);
        //通过 forEach 方法拿到数组中每个元素，将元素与参数的值进行拼接处理，并且放入 paramsArray 中
        paramsKeyArray.forEach(key=>paramsArray.push(key + '=' + params[key]));
        //拼接参数
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&');
        } else {
            url += paramsArray.join('&');
        }
    }
        return new Promise(function(resolve,reject){
            fetch(url,{
                method:'GET',
                header:header,
            }).then((response)=>response.json)
                .then((response)=>{
                    resolve(response);
                }).catch((error)=>{
                reject({status:-1});
            }).done();
        })

}
/**
 * post 请求
 * @params url
 * @params params
 * @params header
 * @return {promise}
 *
 */
HTTPBase.post=function(url,params,header){
    if(params) {
        //初始化formData
        var formData=new FormData();
        //获取 params 所有的 key
        let paramsKeyArray = Object.keys(params);
        //通过 forEach 方法拿到数组中每个元素，将元素与参数的值进行拼接处理，并且放入 paramsArray 中
        paramsKeyArray.forEach(key=>formData.append(key,params[key]));
    }
        return new Promise(function(resolve,reject){
            fetch(url,{
                method:'POST',
                header:header,
                body:formData,
            }).then((response)=>response.json)
                .then((response)=>{
                    resolve(response);
                }).catch((error)=>{
                reject({status:-1});
            }).done();
        })

}

module.exports=HTTPBase;