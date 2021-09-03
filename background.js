chrome.runtime.onInstalled.addListener(function(){
    console.log("安装成功");
    let words = new Set();
    chrome.storage.sync.set({words:words},function(){
        console.log(chrome.runtime.lastError)
    })
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    console.log(request, sender);
    let type = request.type
    console.log(request)
    switch (type) {
        case "addWords":
            console.log("添加单词:",request.msg)
            addWords(request.msg)
            break;
    
        default:
            console.log("为匹配")
            break;
    }
    // sendResponse('我收到你的消息了：'+request.msg);
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
    chrome.storage.sync.set({word:word},function(){
        console.log(chrome.runtime.lastError)
    });
    return "添加成功";
}

function getAllWords(){

}