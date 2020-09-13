<div class="success-content">
  <img src="../../../../imgs/success.png" alt="" class="success-bg">
  <div class="success-box">
    <img :src="profileUrl" alt="" class="avatar">
    <div class="name">Hi，{{nickName}}</div>
    <div class="success-title">恭喜你{{already_text}}</div>
    <div class="lesson-title">《{{getLessonName}}》</div>
    <div class="time">
      <div>
        <p>本次学习时长</p>
        <p class="pactive">{{min}}<span>min</span></p>
      </div>
      <div>
        <p>坚持学习天数</p>
        <p class="pactive">{{alreadyDays}}<span>天</span></p>
      </div>
    </div>
  </div>
  <div class="btn">
    <button class="achievement" @click="handleClickAchievement">成就卡</button>
    <button class="gohome" @click="gohome">返回首页</button>
  </div>
  <div class="cavnas-bg" v-show="show_achievement_card">
    <div class="canvas-box">
        <img src="../../../../imgs/close.png" alt="" class="close" @click="handleClickClose">
        <canvas ref="canvas" width="562px" height="1000px" class="canvas" style="display: none"></canvas>
        <img v-if="show_img" :src="img_url" alt="" class="save-img">
        <p class="download">长按图片保存到手机 <img src="../../../../imgs/download.png" alt=""></p>
    </div>
  </div>
</div>