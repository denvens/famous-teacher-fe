<div class="express-content">
  <div class="no-wuliu" v-if="noWuliu">
    <img src="../../../../imgs/wuliu.png" alt="">
    <p>你还没有购买任何课程</p>
    <div class="no-wuliu-btn">看看其它课程</div>
  </div>
  <div v-for="item in wuliuArr" class="item" @click="handleClickDetail(item)">
    <div class="desc">
      <div class="name">{{item.levelName}}</div>
      <div class="material">
        <div class="time">{{item.time}}</div>
        <!-- {{item.material == 1 ? '该课程暂无配套纸质材料' : (item.material == 2 ? '暂未收到物流信息' : '【杭州转运公司】 已发出 下一站 【北京转运公司】')}} -->
        {{item.logistics}}
      </div>
    </div>
    <div class="status" v-if="item.status">{{item.status}}</div>
  </div>
  <!-- 弹框 -->
	<div is="tip" :tipsText="tipsText" :showTips="showTips" @closeModal="showTips=false;"></div>
</div>