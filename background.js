chrome.runtime.onInstalled.addListener(function(){
    console.log("安装成功");
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
            console.log("添加单词:",request.msg)
            addWords(request.msg)
            getAllWords()
            sendResponse('我收到你的消息了：'+request.msg);
            break;
        case "get-all-words":
           
            chrome.storage.sync.get(null,data=>{
                console.log(data.words)
                if(chrome.runtime.lastError){
                    sendResponse('获取失败:',chrome.runtime.lastError);
                }else {
                    sendResponse(data.words);
                }
            })
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


function addWords(word) {
    chrome.storage.sync.get("words",data=>{
        if (chrome.runtime.lastError) {
            console.log("获取失败：",chrome.runtime.lastError)
        }else{
            let tmpWords = new Set(data.words);
            tmpWords.add(word);
            chrome.storage.sync.set({"words":[...tmpWords]},function(){
                if(chrome.runtime.lastError){
                    console.log("添加失败:",chrome.runtime.lastError)
                }
            });
        }
    })

}

function getAllWords(){
    chrome.storage.sync.get(null,data=>{
        if(chrome.runtime.lastError){
            console.log("添加失败:",chrome.runtime.lastError)
        }
    })
}