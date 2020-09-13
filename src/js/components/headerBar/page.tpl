<div>
  <div class="header-bar">
    <div>{{levelName}}</div>
    <div class="change-subject" @click="handleClickChange">切换课程 <span class="horn"></span></div>
  </div>
  <div class="more-content" v-if="show_modal">
    <div :is="headerBar"></div>
    <div class="my-subject" v-if="myClassList.length!==0">
      <div class="title">我的课程</div>
      <div class="my-subject-item" @click="handleStartStudy(item.id)" v-for="(item,index) in showMyClass" :key="index">
        <div class="banner-img-box">
          <img class="banner-img" :src="getFilePath(item.image)" alt="">
          <div>
            <div class="name">{{item.name}}</div>
            <!-- <div class="progress">{{item.progress}}/{{item.length}}</div> -->
          </div>
        </div>
        <img src="../../../imgs/right.png" class="right" alt="">
      </div>
      <div class="expand-all" v-if="show_open" @click="handleClickOpen">展开全部 <img src="../../../imgs/expand-all.png"
          alt=""></div>
    </div>
    <div class="more-subject">
      <div class="title">更多课程</div>
      <div class="item-box">
        <div class="more-subject-item" v-for="item in otherClassList" @click="handleClickBuySite(item.buySite)">
          <img :src="getFilePath(item.image)" alt="">
          <div class="name">{{item.name}}</div>
          <div class="desc">{{item.introduction}}</div>
        </div>
      </div>
    </div>
  </div>
</div>