/**
 * 
 * 划词事件
 * 定义划词后要处理的事件
 */

const tip = new Tip();

const DURATION = 100;

const [mouseupListener, immediatelyStop] = debounce(async () => {

  // 获取选中文字 以及位置、宽高等信息
  let { rect, seleStr = "" } = getSelectPos();
  if (!seleStr.trim()) return tip.hide();

  // 英语单词正则
  let regx = /^[A-Za-z]+$/
  if (!regx.test(seleStr)) return tip.hide();

  chrome.runtime.sendMessage({type: "translate",msg:seleStr}, function(response) {
    console.log(response);
    const now = Date.now();
    tip.showEmptyView(rect, now);
    tip.showFromGoogleApi({ result: response, rect, now });
  });

});

// 监听鼠标抬起 显示tip
document.body.addEventListener("mouseup", mouseupListener);
document.body.addEventListener("mousedown", () => {
	immediatelyStop()
	tip.hide()
});
// 当滑动时隐藏tip
document.addEventListener("scroll", () => {
  tip.hide();
});

function getSelectPos() {
  let selection = window.getSelection();
  if (!selection.rangeCount) return {};
  let range = selection.getRangeAt(0);
  return {
    rect: range.getBoundingClientRect(),
    seleStr: range.toString()
  };
}
function debounce(fun) {
    let timer = null;
    return [
      function() {
          clearTimeout(timer);
          timer = setTimeout(function() {
              fun.call();
          }, DURATION);
      }, 
      function () { 
          clearTimeout(timer) 
      }
    ] 
}

function sendMsg(msg){
    chrome.runtime.sendMessage({type: "add-words",msg:msg}, function(response) {
        console.log(response);
      });
}

  // 添加单词
$('#add-words').on('click', function(){
    let { rect, seleStr = "" } = getSelectPos();
    sendMsg(seleStr);
    tip.hide();
})


