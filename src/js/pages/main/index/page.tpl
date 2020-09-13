<div class="all-subject">
    <div class="title">全部课程</div>
    <div class="item-box">
      <div class="more-subject-item" v-for="(item,index) in levelList" :key="index" @click="handleClickBuySite(item.buySite)">
        <img :src="item.image" alt="">
        <div class="name">{{item.name}}</div>
        <div class="desc">{{item.introduction}}</div>
      </div>
    </div>
  </div>