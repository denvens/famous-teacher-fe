<div class="audio">
    <!-- 此处的ref属性，可以很方便的在vue组件中通过 this.$refs.audio获取该dom元素 -->
    <audio ref="audio" @pause="onPause" @play="onPlay" @timeupdate="onTimeupdate" @loadedmetadata="onLoadedmetadata" :src="src"
        controls="controls" style="display:none;"></audio>

    <!-- 音频播放控件 -->
    <!-- TODO   短音频    audio-box-short -->
    <div class="audio-box audio-box-short">
        <span class="triangle"></span>
        <div class="player-btn">
            <img src="../../../imgs/play.png" alt="" v-if="!playing" @click="startPlayOrPause">
            <img src="../../../imgs/pause.png" alt="" v-else @click="startPlayOrPause">
        </div>
        <div class="slider" @touchstart="handleTouchStart">
            <div class="slider-track"></div>
            <div class="slider-fill" :style="'width:'+sliderTime+'%'"></div>
            <div class="slider-thumb" :style="'left:'+sliderTime+'%'" @touchstart="show_thumb_modal=true" @touchend="show_thumb_modal=false">
                <div v-if="show_thumb_modal">
                    <div class="thumb-modal">{{audio.currentTime | formatSecond}}</div>
                    <span class="thumb-triangle"></span>
                </div>
            </div>
        </div>
        <span class="audio-time">{{audio.surplusTime | formatSecond}}"</span>
    </div>
</div>