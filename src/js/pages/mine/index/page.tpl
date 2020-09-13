<div class="mine-index-content">
  <div class="avatar">
    <div>
      <p class="user-name">{{nickName}}</p>
      <p class="openid">ID: {{openId}}<img src="../../../../imgs/copy-num.png" alt="" class="openid-copy" id="btn" :data-clipboard-text="openId" @click="handleClickCopy"></p>
    </div>
    <img :src="profileUrl" alt="" class="avatar-img">
  </div>
  <!-- <div class="mine-item">课程提醒设置 <img src="../../../../imgs/right.png" alt=""></div> -->
  <a href="JavaScript:;" class="mine-item" @click="handleClickScholarship">奖学金 <img src="../../../../imgs/right.png" alt=""></a>
  <a href="JavaScript:;" class="mine-item" @click="handleClickLogistics">物流状态 <img src="../../../../imgs/right.png" alt=""></a>
  <!-- <a href="JavaScript:;" class="mine-item" @click="handleClickBuying">团购订单 <img src="../../../../imgs/right.png" alt=""></a> -->
  <a href="JavaScript:;" class="mine-item" @click="handleClickTicketNum">准考证号 <img src="../../../../imgs/right.png" alt=""></a>
  <a href="https://jinshuju.net/f/yNprSI" class="mine-item">意见反馈 <img src="../../../../imgs/right.png" alt=""></a>
  <!-- 弹框 -->
	<div is="tip" :tipsText="tipsText" :showTips="showTips" @closeModal="showTips=false;"></div>
</div>