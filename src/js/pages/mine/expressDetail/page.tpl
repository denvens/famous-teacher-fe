<div class="express-detail" v-if="showAll">
  <div class="detail">
     <img src="../../../../imgs/express-box.png" alt="" class="express-box">
     <div>
       <div class="status">{{status_text}}</div>
       <div class="num">物流单号：{{add_num}}  <img src="../../../../imgs/copy-num.png" alt="" id="btn" :data-clipboard-text="add_num" @click="handleClickCopy"></div>
     </div>
  </div>
  <div class="express-list" v-if="shipped">
    <div class="address" v-for="(item,index) in logistics_list">
      <div class="time">
        <p>{{item.time.substr(5,5)}}</p>
        <p>{{item.time.substr(11,5)}}</p>
      </div>
      <div class="address-line" v-if="(item.status=='签收'||item.status=='派件'||item.status=='揽收'||item.status=='已发货' || item.status=='在途')&&!item.dian">
        <img src="../../../../imgs/qianshou.png" alt="" class="active" v-if="item.status=='签收'">{{item.dian}}
        <img src="../../../../imgs/paisong.png" alt="" v-if="item.status=='派件'&&index!==0">
        <img src="../../../../imgs/paisong-active.png" class="active" alt="" v-if="item.status=='派件'&&index==0">
        <img src="../../../../imgs/transport.png" alt="" v-if="item.status=='在途'&&index!==0">
        <img src="../../../../imgs/transport-active.png" class="active" alt="" v-if="item.status=='在途'&&index==0">
        <img src="../../../../imgs/lanjian.png" alt="" v-if="item.status=='揽收'&&index!==0">
        <img src="../../../../imgs/lanjian-active.png" alt="" class="active" v-if="item.status=='揽收'&&index==0">
        <img src="../../../../imgs/deliver.png" alt="" v-if="item.status=='已发货'&&index!==0">
        <img src="../../../../imgs/deliver-active.png" alt="" class="active" v-if="item.status=='已发货'&&index==0">
        <div class="line" v-if="index!=logistics_list.length-1"></div>
      </div>
      <div class="address-line address-dian" v-else>
        <div class="dian"><img src="../../../../imgs/yuandian.png" alt=""></div>
        <div class="line" v-if="index!=logistics_list.length-1"></div>
      </div>
      <div>
        <div :class="['title',index==0?'active':'']" v-if="!item.dian">{{item.status}}</div>
        <div :class="['address-detail',index==0?'active':'']">{{item.context}}</div>
      </div>
    </div>
  </div>
   <!-- 弹框 -->
	<div is="tip" :tipsText="tipsText" :showTips="showTips" @closeModal="showTips=false;"></div>
</div>