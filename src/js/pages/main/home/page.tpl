<div class="main-content">
    <div class="loading-box" v-if="isLoading">
        加载中...
        <!-- <img src="../../../../imgs/loading.png" alt="" class="loading" ref="loading"> -->
    </div>
    <div :is="headerBar" @getId="getId" :showHeader="showHeader" @closeShowHeader='showHeader=false'></div>
    <div class="course-card-box">
        <img class="banner-img" :src="endCourse&&endBegun ? today_lesson.image : bgImg" alt="">
        <div class="course-card">
            <div class="no-lesson" v-if="!endCourse">本课程已结束</div>
            <div class="no-lesson" v-if="!endBegun">本课程将于{{day}}天后开始</div>
            <div v-if="endBegun&&endCourse">
                <div class="lesson">
                    <!-- <div class="lesson-num">Lesson {{lesson_list.length}}</div> -->
                    <div class="lesson-num">Lesson {{today_lesson.order}}</div>
                    <div class="lesson-time ">{{today_lesson.time}}</div>
                </div>
                <div class="lesson-name">{{today_lesson.name}}</div>
                <div class="desc">{{today_lesson.title}}</div>
            </div>
            <div class="start" @click="goCourse(today_lesson,studyText)">{{studyText}}</div>
        </div>
    </div>
    <div class="history-subject" v-if="lesson_list.length>0">
        <div class="history-title"><img src="../../../../imgs/main-title.png" alt="">历史课程<img src="../../../../imgs/main-title.png" alt=""></div>
        <div class="history-item" @click="goCourse(item)" v-for="(item,index) in lesson_list">
            <div class="lesson">
                <!-- <div class="lesson-num">Lesson {{lesson_list.length - (index+1)}}</div> -->
                <div class="lesson-num">Lesson {{item.order}}</div>
                <div class="time">{{item.time}}</div>
            </div>
            <div class="history-lesson-name">{{item.name}}</div>
        </div>
    </div>
    <!-- 弹框 -->
	<div is="tip" :tipsText="tipsText" :showTips="showTips" @closeModal="showTips = false"></div>
</div>