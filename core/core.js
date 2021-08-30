//监听鼠标的释放事件
class Panel {
    constructor() {
    }
    test(){
        console.log("测试")
    }
    // 初始化浮动窗口
    init() {
        let container = document.createElement('div')
        container.innerHTML = "浮动窗口"
        container.classList.add('text')
        document.body.appendChild(container)
        this.container = container

    }
    //设置浮动窗口坐标
    pos(pos) {
        //翻译面板用absolute定位，通过传入的鼠标光标位置参数设置面板在网页中显示的位置
        //设置翻译面板的top属性
        this.container.style.top = pos.y + 'px'
        //设置翻译面板的left属性
        this.container.style.left = pos.x + 'px'
    }
}

console.log("start")
let panel = new Panel();
panel.test()
panel.init()

window.onmouseup = function (e) {
    let x = e.clientX
    let y = e.clientY

    

    //获取到用户选中的内容
    let raw = window.getSelection()
    if (raw != "") {
        console.log({x: x, y: y})
        panel.container.innerHTML=raw.toString().trim()
        console.log({"起点:":raw.anchorOffset,"终点:":raw.focusOffset})
        panel.pos({x: x, y: y-5})
    }
}
