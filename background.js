/***
 * 
 * 翻译 API
 */
 const baiduApi = 'https://sp1.baidu.com/5b11fzupBgM18t7jm9iCKT-xh_/sensearch/selecttext'
 const googleApi = 'https://translate.google.cn/translate_a/single'
 const icibaApi = 'https://dict-mobile.iciba.com/interface/index.php'
 
 class Http {
   constructor() {
     this.chineseReg = /^[\u4e00-\u9fa5]+$/
   }

   async fetchFromIciba(word){
        const url = this.getCompleteUrl({baseUrl: icibaApi, params:{
            c: 'word',
            m: 'getsuggest',
            is_need_mean:   '1',
            word: word
        }})
        const response = await fetch(url, {
                method: 'GET'
            })

        return await response.json()
   }

   async fetchFromBaidu(params) {
     !this.baiduApi && (this.baiduApi = baiduApi)
     !params._ && (params._ = Date.now())
     const url = this.getCompleteUrl({ baseUrl: this.baiduApi, params })
     const response = await fetch(url, {
       method: 'GET'
     })
     return await response.json()
   }
 
   async fetchFromGoogle({ word }) {
     if (!this.googleApi) this.googleApi = googleApi
     let [sl, tl] = ['zh-CN', 'en']
     if (!this.chineseReg.test(word.trim())) [sl, tl] = [tl, sl]
     const url = this.getCompleteUrl({ baseUrl: this.googleApi, params: {
       client: 'gtx',
       sl,
       tl,
       hl: 'zh-CN',
       dt: 'at',
       dt: 'bd',
       dt: 'ex',
       dt: 'ld',
       dt: 'md',
       dt: 'qca',
       dt: 'rw',
       dt: 'rm',
       dt: 'ss',
       dt: 't',
       ie: 'UTF-8',
       oe: 'UTF-8',
       source: 'btn',
       ssel: '3',
       tsel: '6',
       kc: '0',
       tk: '984327.619449',
       q: word,
     }})

     console.log(url)
     const response = await fetch(url, {
       method: 'GET'
     })
     return await response.json().catch(() => ({}))
   }
 
   getCompleteUrl({ baseUrl, params }) {
     const url = new URL(baseUrl)
     Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
     return url
   }
 
   async googleRequest(word) {
     const googleResult = await this.fetchFromGoogle({ word }) || []
     let result = 'google翻译结果解析错误'
     try {
       const [resultArray = []] = googleResult
 
       result = resultArray.reduce((pre, cur) => {
         return pre + (cur[0] || '')
       }, "")
 
     } catch(e) {}
 
     return result
    }
 
   async baiduRequest(word, rect, now) {
     const baiduResult = await this.fetchFromBaidu({ q: word})
 
     // if (baiduResult.errno > 0) throw ({msg: baiduResult.error || "请求异常"})
     if (baiduResult.errno > 0) return [{pre: "", cont: baiduResult.error || "请求异常"}]
 
     let resList = baiduResult.data.result;
     if (!Array.isArray(resList)) resList = [{
         pre: "",
         cont: resList
     }]
 
     return resList
    }

    async icibaRequest(word){
        const result = await this.fetchFromIciba(word);
        if (result.status != 1) {
            return "翻译失败"
        }
        return result.message[0];
    }
 
 }
 
 
 
 






/***
 * 
 * 监听事件
 */
 const http = new Http();


chrome.runtime.onInstalled.addListener(function(){
    let words = new Set();
    chrome.storage.sync.set({"words":[...words]}, function(){
        if(!chrome.runtime.lastError){
            console.log("success")
        }else{
            console.log(chrome.runtime.lastError)
        }
    })
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    console.log(request, sender);
    let type = request.type
    console.log(request)
    switch (type) {
        case "add-words":
            addWords(request.msg,sendResponse)
            break;
        case "get-all-words":
            getAllWords(sendResponse)
            get_cookies()
            break;

        case "translate":
            translate(request.msg,sendResponse)
            break;
        default:
            console.log("未匹配")
            break;
    }
   
    return true;
});


// 获取 不背单词 cookies
function get_cookies(){
    let url = "https://bbdc.cn/";
    chrome.cookies.getAll({url:url,path:"/",domain:".bbdc.cn"},data => {
        console.log(data);
        console.log(data.map(c => c.name+"="+c.value).join(';'))
    })
}


function addWords(word,sendResponse) {
    chrome.storage.sync.get("words",data=>{
        if (chrome.runtime.lastError) {
            sendResponse('获取失败：'+chrome.runtime.lastError);
        }else{
            let tmpWords = new Set(data.words);
            tmpWords.add(word);
            chrome.storage.sync.set({"words":[...tmpWords]},function(){
                if(chrome.runtime.lastError){
                    sendResponse('添加失败:'+chrome.runtime.lastError);
                }else{
                    sendResponse('【响应】添加成功：'+word);
                }
            });
        }
    })
}

function getAllWords(sendResponse){
    chrome.storage.sync.get(null,data=>{
        if(chrome.runtime.lastError){
            sendResponse('获取失败:',chrome.runtime.lastError);
        }else {
            sendResponse(data.words);
        }
    })
}

function translate(word,sendResponse){
    Promise.all([http.googleRequest(word),http.baiduRequest(word),http.icibaRequest(word)]).then(([google,baidu,iciba]) => {
        console.log(google)
        console.log(baidu)
        console.log(iciba)
        sendResponse(iciba)
      })
    
}