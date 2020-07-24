import React, { useRef, useState, useEffect, useCallback } from 'react'
interface IProps {
    className?: string,                                 //className
    maxZoom?: number,                                   //最大缩放比例  默认3
    minZoom?: number,                                   //最小缩放比例  默认0.2
    originLeft?: number,                                //初始左偏移量  默认0
    originTop?: number,                                 //初始顶部偏移量    默认0
    resetPosition?: boolean,                            //重置位置  
    rotate?: number,                                    //旋转角度  默认0
    onChangePosition?: (item: boolean) => void          //位移位置很小，视为没有移动返回false,主要用于缩放区域带有点击事件的情况，辅助判断点击事件是否生效。
}
interface paramsType {
    zoomVal: number,                               //放大比例
    left: any,                                     //左边偏移
    top: any,                                      //顶部偏移
    currentX: number,                              //相较于窗口左边距离
    currentY: number,                              //相较于窗口顶部距离
    originLeft: number,                            //初始左偏移量
    originTop: number,                             //初始顶部偏移量
    rotate: number,                                //旋转角度
    flag: boolean
}
let params: paramsType = {
    zoomVal: 1,
    rotate: 0,
    left: 0,
    top: 0,
    originLeft: 0,
    originTop: 0,
    currentX: 0,
    currentY: 0,
    flag: false
};
const Zoom: React.FC<IProps> = (({ children, className, maxZoom = 3, rotate, minZoom = 0.2, resetPosition, onChangePosition }): JSX.Element => {
    const [roateChange, setRoateChange] = useState(false)
    const currentDom = useRef<HTMLDivElement>(null)
    const warpNode = useRef<HTMLDivElement>(null)
    /**
     * 获取某个CSS属性
     * @param    {HTMLDivElement}   dom   //dom元素
     * @param    {String}           key   //属性key
     * @return   {String | Number}        //属性值
    */
    const getCss = useCallback((dom: any, key: any) => {
        return dom.currentStyle ? dom.currentStyle[key] : window.getComputedStyle(dom)[key].replace(/px/ig, "");
    }, [])
    /**
     * 鼠标滑轮放大缩小事件
     * @param    {HTMLDivElement}   currentDiv           //需要放大缩小的DOM元素
     * @return      {void}
    */
    const windowAddMouseWheel = useCallback((currentDiv: any) => {
        const scrollFunc = function (e: any) {
            e.stopPropagation();
            e.preventDefault();
            e = e || window.event;
            params.zoomVal += e.wheelDelta ? e.wheelDelta / 1200 : (e.detail * 40) / 1200;
            params.zoomVal = params.zoomVal > minZoom ? params.zoomVal > maxZoom ? maxZoom : params.zoomVal : minZoom
            currentDiv.style.transform = "scale(" + params.zoomVal + ")";
            return false
        };
        currentDiv.removeEventListener && currentDiv.removeEventListener('DOMMouseScroll', scrollFunc);
        currentDiv.addEventListener && currentDiv.addEventListener('DOMMouseScroll', scrollFunc, false); //给页面绑定滑轮滚动事件
        currentDiv.onmousewheel = scrollFunc;//滚动滑轮触发scrollFunc方法
    }, [minZoom, maxZoom])
    /**
     * 重置组件到初始位置
     * @return   {void}
    */
    const onResetPosition = useCallback(() => {
        const currentDiv: any = currentDom.current
        if (currentDiv) {
            currentDiv.style.left = params.originLeft + "px";
            currentDiv.style.top = params.originTop + "px";
            currentDiv.style.transform = "scale(1) rotate(0deg)"
            params.left = params.originLeft;
            params.top = params.originTop;
            params.currentX = 0
            params.currentY = 0
            params.zoomVal = 1
        }
    }, [])
    /**
    * 响应旋转操作
    */
    useEffect(() => {
        const currentDiv: any = currentDom.current
        if (currentDiv) {
            setRoateChange(true)
            currentDiv.style.transform = `rotate(${rotate}deg)`
            setTimeout(() => {
                setRoateChange(false)
            }, 100);
        }
    }, [rotate])
    /**
     * 响应还原操作，获取初始位置，卸载监听滑轮事件
    */
    useEffect(() => {
        onResetPosition()
    }, [resetPosition, onResetPosition])
    /**
     * 拖拽实现
     * @param    {HTMLDivElement}   target           //Dom元素
     * @return   {void}
    */
    const startDrag = useCallback((target: any) => {
        params.left = getCss(target, "left") !== "auto" ? getCss(target, "left") : params.left
        params.top = getCss(target, "top") !== "auto" ? getCss(target, "top") : params.top
        target.onmousedown = (event: any) => {
            params.flag = true;
            if (!event) {
                event = window.event;
                target.onselectstart = () => {
                    return false;
                };
            }
            params.currentX = event.clientX;
            params.currentY = event.clientY;
        };
        document.onmouseup = (event) => {
            onChangePosition && onChangePosition(!(Math.abs(params.currentX - event.clientX) < 5 && Math.abs(params.currentY - event.clientY) < 5))
            params.flag = false;
            params.left = getCss(target, "left") !== "auto" ? getCss(target, "left") : params.left
            params.top = getCss(target, "top") !== "auto" ? getCss(target, "top") : params.top
        };
        document.onmousemove = event => {
            const e: any = event ? event : window.event;
            if (params.flag) {
                const nowX = e.clientX, nowY = e.clientY;
                const disX = nowX - params.currentX, disY = nowY - params.currentY;
                target.style.left = parseInt(params.left, 10) + disX + "px";
                target.style.top = parseInt(params.top, 10) + disY + "px";
                event.preventDefault && event.preventDefault();
                return false;
            }
        };
    }, [onChangePosition, getCss])
    /**
     * 注册两个事件初始化位置,放大缩小和拖拽
    */
    useEffect(() => {
        if (currentDom.current) {
            params.originLeft = (getCss(warpNode.current, 'width') - getCss(currentDom.current, 'width')) / 2
            params.originTop = (getCss(warpNode.current, 'height') - getCss(currentDom.current, 'height')) / 2
            params.left = params.originLeft
            params.top = params.originTop
            currentDom.current.style.left = params.originLeft + "px"
            currentDom.current.style.top = params.originTop + "px"
            windowAddMouseWheel(currentDom.current)
            startDrag(currentDom.current);
        }
        return () => {
            const currentDiv: any = currentDom
            currentDiv.current.onmousewheel = null
        }
    }, [windowAddMouseWheel, startDrag, getCss])
    return <div ref={warpNode} className={className} style={{ overflow: "hidden", height: "100%", position: "relative", width: "100%" }}>
        <div ref={currentDom} style={{ position: "absolute", cursor: "move", transition: `${roateChange ? 'all 0.2s' : ''}` }} >
            {React.Children.map(children, (item) => {
                return item
            })}
        </div>
    </div>
})
export default Zoom
