
### React+typeScript 缩放、拖拽、旋转组件

props:

    className?: string,                                 //className
    maxZoom?: number,                                   //最大缩放比例  默认3
    minZoom?: number,                                   //最小缩放比例  默认0.2
    originLeft?: number,                                //初始左偏移量  默认0
    originTop?: number,                                 //初始顶部偏移量    默认0
    resetPosition?: boolean,                            //重置位置  
    rotate?: number,                                    //旋转角度  默认0
    onChangePosition?: (item: boolean) => void          //位移位置很小，视为没有移动返回false,主要用于缩放区域带有点击事件的情况，辅助判断点击事件是否生效。     

  

``` 
    <DragAndMove rotate={rotate} resetPosition={resetPostion} >
          <img style={{ height: "200px", width: "200px" }} src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595568348947&di=fb735f71a0c1c71db89d648055baa7c7&imgtype=0&src=http%3A%2F%2Fcdn.feeyo.com%2Fpic%2F20140802%2F201408020129205747.jpg" alt="" />
    </DragAndMove>
```