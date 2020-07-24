import React, { useState } from 'react';
import './App.css';
import Zoom from './Zoom'
function App() {
  const [resetPostion, setResetPostion] = useState(false)
  const [rotate, setRotate] = useState(0)
  return (
    <div className="App">
      <div style={{ width: "500px", height: "500px", overflow: "hidden", marginLeft: "200px" }}>
        <Zoom rotate={rotate} resetPosition={resetPostion} >
          <img style={{ height: "600px", width: "600px" }} src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595568348947&di=fb735f71a0c1c71db89d648055baa7c7&imgtype=0&src=http%3A%2F%2Fcdn.feeyo.com%2Fpic%2F20140802%2F201408020129205747.jpg" alt="" />
        </Zoom>
      </div>
      <button onClick={() => {
        setResetPostion(!resetPostion)
        setRotate(0)
      }}>还原</button>
      <button onClick={() => {
        setRotate(rotate - 90)
      }}>向左旋转</button>
      <button onClick={() => {
        setRotate(rotate + 90)
      }}>向右旋转</button>
      <button onClick={() => {
        setRotate(rotate + 180)
      }}>旋转180度</button>
    </div>
  );
}

export default App;
