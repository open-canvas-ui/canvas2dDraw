/* 此模块用于实现签名绘图功能 */

// 需要用到的变量定义
let clickX = new Array();
let clickY = new Array();
let clickDrag = new Array();
let paint;
let point = {notFirst:false};

let canvasDiv =  null; // 初始化画布父盒子
let canvas = document.createElement('canvas'); // 创建画板
let context = canvas.getContext("2d"); // 创建2d画布
let canvasWidth = 0; // 初始化画布宽度
let canvasHeight = 0; // 初始化画布高度

// 可导出图片的标识
let _exportable = false;

/* ------------ 需要用到的一些功能函数  ------------ */
function addClick(x, y, dragging) {
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function draw(){
  _exportable = true;
  while (clickX.length > 0 ) {
    point.bx = point.x;
    point.by = point.y;
    point.x = clickX.pop();
    point.y = clickY.pop();
    point.drag = clickDrag.pop();
    context.beginPath();
    if (point.drag && point.notFirst) {
      context.moveTo(point.bx, point.by);
    } else {
      point.notFirst = true;
      context.moveTo(point.x - 1, point.y);
    }
     context.lineTo(point.x, point.y);
     context.closePath();
     context.stroke();
  }
}

/* 创建画布背景和画笔 */
function create() {
  // 以下是创建画布背景
  context.rect(0, 0, canvasWidth, canvasHeight); 
  context.fillStyle="#f2f2f2"; // 图片北京色是灰色，此处去除会变黑色
  context.fill();
  // 设置画笔属性
  context.strokeStyle = "#666";
  context.lineJoin = "round";
  context.lineWidth = 2;
  // 默认值清理
  clickX = new Array();
  clickY = new Array();
  clickDrag = new Array();
  _exportable = false;
}

export default {
  /* 初始化 */
  init(canvasDivDom, classname) {
    canvasDiv = canvasDivDom; // 传入画布父盒子
    canvasWidth = canvasDiv.clientWidth; // 获取父盒子宽度
    canvasHeight = canvasDiv.clientHeight; // 获取父盒子高度
    // 设置属性并追加元素
    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);
    canvasDiv.appendChild(canvas);
    // 创建画布背景和画笔
    create();
    // 开始监控画图
    this.listen(classname); 
  },

  /* 画图时的监控 */
  listen(classname) {
    // 获取盒子需要的参数
    let left = canvas.getBoundingClientRect().left;
    let top = canvas.getBoundingClientRect().top;
    // 支持 移动端
    canvasDiv.addEventListener("touchstart", function(e){
      paint = true;
      classname && (this.className = classname);
      (e.touches) && (e = e.touches[0]);
      addClick(e.pageX - left, e.pageY - top);
      draw();
    });
    
    canvasDiv.addEventListener("touchmove", function(e){
      if(!paint) {
        return;
      }
      (e.touches) && (e = e.touches[0]);
      addClick(e.pageX - left, e.pageY - top, true);
      draw();
    });

    canvasDiv.addEventListener("touchend", function(e){
      paint = false;
    });
    
    // 支持 PC 端
    canvasDiv.addEventListener("mousedown", function(e){
      paint = true;
      classname && (this.className = classname);
      addClick(e.pageX - left, e.pageY - top);
      draw();
    });
    
    canvasDiv.addEventListener("mousemove", function(e){
      if(!paint) {
        return;
      }
      addClick(e.pageX - left, e.pageY - top, true);
      draw();
    });
    
    canvasDiv.addEventListener("mouseup", function(e){
      paint = false;
    });
    
    canvasDiv.addEventListener("mouseleave", function(e){
      paint = false;
    });
  },

  /* 清理 */
  clear() {
    // 使用此方式来清理画布
    canvas.width = canvas.width; 
    canvas.height = canvas.height;
    create(); // 重新创建画布背景和画笔
    _exportable = false; // 清理之后无法导出
  },

  /* 导出图片 */
  exportImg() {
    if(!_exportable) {
      return -1;  // 说明此处无法导出图片
    }
    return canvas.toDataURL("image/png");
  }
}