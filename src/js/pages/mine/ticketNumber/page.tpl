<div class="ticket-content">
  <div v-if="hasTicket">
    <div class="add-ticket" @click="handleClickAdd">添加准考证</div>
    <p class="ticket-desc">成绩发布后，可以在此查询成绩</p>
  </div>
  <div class="fill-in" v-if="is_fill">
    <p class="fill-title">准考证类型</p>
    <div class="fill-select">
      <div class="select-title" @click="handleClickSelect">{{fill_text}}
        <img src="../../../../imgs/learn_next.png" alt="" class="select-img">
      </div>
    </div>
    <div class="select-box-modal" v-if="is_select" @click="handleClickCloseModal"></div>
    <div :class="['select-box',is_select ? 'select-box-active' : '']" v-if="is_select">
      <div class="select-modal-title" @click="handleClickReady">完成</div>
      <div class="cet1">
        <input type="radio" id="cjon" name="cet" v-model="cet" value="1"/>
        <label for="cjon" class="onlable">大学英语四级考试（CET-4）</label>
      </div>
      <div class="cet1">
        <input type="radio" id="cjoff" name="cet" v-model="cet" value="2"/>
        <label for="cjoff" class="offlable">大学英语六级考试（CET-6）</label>
      </div>
    </div>
    <p class="fill-title-num">准考证号</p>
    <div class="fill-input">
      <input type="number" placeholder="请输入您的准考证号" @input="handleChangeInput" v-model="num">
    </div>
    <p class="fill-err" v-if="fill_err">准考证号格式有误</p>
    <div class="btn">
      <div class="close" @click="handleClose">取消</div>
      <div :class="[is_save?'save-active':'save']" @click="handleClickSave">保存</div>
    </div>
  </div>
  <div v-if="show_num">
    <div class="my-num">
      <div class="title">
        <span>我的准考证号</span>
        <img src="../../../../imgs/CET4.png" alt="" v-if="cet==4">
        <img src="../../../../imgs/CET6.png" alt="" v-if="cet==6">
      </div>
      <p class="number">{{num}}</p>
      <div class="num-btn">
        <div class="btn-img" id="btn" :data-clipboard-text="num" @click="handleClickCopy"><img src="../../../../imgs/copy.png" alt=""></div>
        <div class="btn-img" @click="handleClickEdit"><img src="../../../../imgs/edit.png" alt=""></div>
      </div>
    </div>
    <p class="check-result-desc">成绩发布后，可以在此查询成绩</p>
    <div class="check-btn">查询四六级成绩</div>
  </div>
  <!-- 弹框 -->
	<div is="tip" :tipsText="tipsText" :showTips="showTips" @closeModal="showTips=false;"></div>
</div>