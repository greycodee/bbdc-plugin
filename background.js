// chrome.runtime.onInstalled.addListener(()=>{
//     console.log("background.")
//     chrome.cookies.get({"url":"https://juejin.cn/","name":"sessionid"},data => {
//         console.log("cookies===")
//         console.log(data)
//     })
// })

// console.log("background")

// 接收消息

// chrome.tabs.query({active: true, currentWindow: true},function(tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
//         console.log(response);
//     });
//   }); 


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    console.log(request, sender);
    get_cookies();
    sendResponse('我收到你的消息了：'+request.msg);
});


let bbdc_cookie = "";

// 获取 不背单词 cookies
function get_cookies(){
    let url = "https://bbdc.cn/";
    // let url = "https://juejin.cn/";
    // let UM_distinctid = "";
    // chrome.cookies.get({"url":url , "name":"UM_distinctid"},data =>{
    //     console.log(data);
    //     UM_distinctid = data;
    //     bbdc_cookie = ""
    // });
    // let acw_tc = chrome.cookies.get({"url":url , "name":"acw_tc"});
    // let JSESSIONID = chrome.cookies.get({"url":url , "name":"JSESSIONID"});
    // let CNZZDATA1278624702 = chrome.cookies.get({"url":url , "name":"CNZZDATA1278624702"});
    // let Hm_lvt_29659c8bfef38cfbaca18955f0ff8f6f = chrome.cookies.get({"url":url , "name":"Hm_lvt_29659c8bfef38cfbaca18955f0ff8f6f"});
    // let hanhan = chrome.cookies.get({"url":url , "name":"hanhan"});
    // let Hm_lpvt_29659c8bfef38cfbaca18955f0ff8f6f = chrome.cookies.get({"url":url , "name":"Hm_lpvt_29659c8bfef38cfbaca18955f0ff8f6f"});
    // console.log(UM_distinctid)

    // let cookies = "UM_distinctid="+UM_distinctid+
    //     ";acw_tc="+acw_tc+";JSESSIONID="+JSESSIONID+
    //     ";CNZZDATA1278624702="+CNZZDATA1278624702+
    //     ";Hm_lvt_29659c8bfef38cfbaca18955f0ff8f6f="+Hm_lvt_29659c8bfef38cfbaca18955f0ff8f6f+
    //     ";hanhan="+hanhan+
    //     ";Hm_lpvt_29659c8bfef38cfbaca18955f0ff8f6f="+Hm_lpvt_29659c8bfef38cfbaca18955f0ff8f6f;

    // console.log(cookies)

    chrome.cookies.getAll({url:url,path:"/",domain:".bbdc.cn"},data => {
        console.log(data);
        console.log(data.map(c => c.name+"="+c.value).join(';'))
    })
}
