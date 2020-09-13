<div class="calendar-container">
    <div :is="headerBar" :showHeader="showHeader" @getId="getId"></div>
    <div class="calendar-top-box">
        {{learnTypeText}}
    </div>
    <div class="calendar-box">
        <div class="calendar-title">
            <img @click="preMonth" class="left-icon" :src="leftIcon" alt="">
            <span>{{monthList[calendarMonth]}}</span> {{calendarYear}}
            <img @click="nextMonth" class="right-icon" :src="rightIcon" alt="">
        </div>
        <div class="calendar-week-list clearfix">
            <div v-for="(item,index) in weeks" class="week-item">{{item}}</div>
        </div>
        <div class="calendar-list clearfix">
            <div v-for="(item,index) in monthDayList" class="day-item" @click="selectDay(item,index)">
                <span v-if="item.status==true" v-bind:class="[item.isSelect?'select-study-share':'study-share',item.isToday?(item.isSelect?'select-today-item':'today-item'):'',]">{{item.isToday?'今':item.day}}</span>
                <span v-else-if="item.status==false" v-bind:class="[item.isSelect?'select-study-no-share':'study-no-share',item.isToday?(item.isSelect?'select-today-item':'today-item'):'',]">{{item.isToday?'今':item.day}}</span>
                <span v-else v-bind:class="[item.isSelect?'select-no-start':'',item.isToday?(item.isSelect?'select-today-item':'today-item'):'',]">{{item.isToday?'今':item.day}}</span>
            </div>
        </div>
    </div>
    <div class="calendar-color-box clearfix">
        <div class="right color-share">
            <span></span>
            已学完
        </div>
        <div class="right color-finish">
            <span></span>
            已补学
        </div>
        <!-- <div></div> -->
    </div>
    <div class="calendar-day-desc-box">
        <div class="day-top" v-bind:class="['day-top-left'+selectWeekIndex]"></div>
        <div class="calendar-day-desc" @click="goLearn">
            <div v-if="isStart">
                <div class="clearfix">
                    <div class="calendar-day-text">Lesson {{dayOrder}}</div>
                    <!-- <div class="calendar-day-type" v-bind:class="[dayType==='未打卡'?'no-share-day-type':'']">{{dayType}}</div> -->
                </div>
                <div class="calendar-day-title">{{dayTitle}}</div>
            </div>
            <div v-else>课程暂未开始，敬请期待</div>
        </div>
    </div>
</div>