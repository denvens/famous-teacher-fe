<div class="scholar-content">
  <div class="scholar-item" v-for="item in scholarshipList">
    <div class="scholar-title">{{item.name}}</div>
    <div class="scholar-desc">
      <div>按时学习满{{item.returnFeeDay}}天，可申请奖学金</div>
      <div>
        <span class="aleady-time">{{item.alreadyDays}}</span>
        <span>/{{item.returnFeeDay}}</span>
      </div>
    </div>
    <div class="proress"><span class="line" :style="{width:(item.alreadyDays / item.returnFeeDay > 1 ? 84 : item.alreadyDays / item.returnFeeDay * 84) +'vw'}"></span></div>
    <div class="stydy-time">学习时间：{{item.beginClassTime}} - {{item.endClassTime}}</div>
    <div :class="['scholar-btn', item.status !== 1 ? 'scholar-btn-active':'']" v-if="item.status==1||item.status==2||item.status==0" @click="handleClickApply(item)">
      {{ item.status == 0 ? '未完成' : (item.status == 1 ? '立即申请': (item.status == 2 ? '已过期' : ''))}} 
    </div>
    <div class="examine" v-if="item.status == 3">
      <img src="../../../../imgs/hourglass.png" alt="">
      <span>审核中</span>
    </div> 
    <div class="adopt" v-if="item.status == 4">
      <div>
        <img src="../../../../imgs/pass.png" alt="">
        <span>已通过</span>
      </div>
      <img src="../../../../imgs/yifanxian.png" alt="" class="yifanxian">
    </div> 
    <div class="examine" v-if="item.status == 5">
      <div>
        <img src="../../../../imgs/failed.png" alt="">
        <span style="color:#282828">未通过</span>
      </div>
    </div> 
  </div>
  <!-- 弹框 -->
  <div is="tip" :tipsText="tipsText" :showTips="showTips" @closeModal="showTips=false;"></div>
</div>