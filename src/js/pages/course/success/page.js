import './page.scss'
import template from './page.tpl';
import { mapState, mapGetters } from 'vuex';
import tools from '../../../modules/tools';
import local from '../../../modules/localStorage'
import {setShare} from '../../../modules/wechat';
const {
	ajax, getUrlParams
} = tools;
const urlParams = getUrlParams();
export default {
    template,
    data() {
        return {
            img_url: '',
            min: 0,
            alreadyDays: 0,   // 学习天数
            already_text: '完成今日学习',
            show_achievement_card: false,
            show_img: false
        }
    },
    computed: {

    },
    mounted() {
        this.getDay().then(res => {
            this.init()
        })
        if (!urlParams['lessonkey']) {
            this.getShareInfo();
        }
        this.min = isNaN(this.getTime/60) ? 0 : Math.ceil(this.getTime/60);
        local.setStorage(local.getStorage('levelId')+'-'+this.getLessonId,"[]")
        // for (let i = 0;i< this.getLessonsMapIds.length;i++) {
        //     if (this.getLessonsMapIds.indexOf(String(this.getLessonId)) > -1) {
        //         this.already_text = '复习完成';
        //         return;
        //     } else {
        //         if (this.getTodayLesson.id == this.getLessonId) {
        //             this.already_text = '完成今日学习';
        //             return;
        //         } else {
        //             this.already_text = '补学完成';
        //             return;
        //         }
        //     }
        // }
    },
    computed: {
        ...mapState('app',{
            'nickName': (state) => state.nickName,
            'profileUrl': (state) => state.profileUrl,
        }),
        ...mapGetters('question', ["getLevelId","getShareImg","getLevelName","getLessonId","getLessonName","getTime"]),
    },
    methods: {
        handleClickAchievement() {
            this.show_achievement_card = true;
        },
        gohome() {
            this.$router.replace('/main')
        },
        getDay () {
            return new Promise((resolve,resject) => {
                if (urlParams['lessonkey']) {
                    this.alreadyDays = 1;
                    resolve();
                } else {
                    ajax({
                        url: '/subject/get-alreadyDays',
                        withCredentials: true,
                        data: {
                            subjectId: 1000000,
                            levelId: local.getStorage('levelId'),
                        }
                    }).then(res => {
                        if (res.success) {
                            this.alreadyDays = res.data.alreadyDays;
                            resolve()
                        }
                    }).catch(err => {
                        console.log(err);
                        resject()
                    })
                }
            })
        },
        init() {
            let canvas = this.$refs.canvas;
            let ctx = canvas.getContext("2d");
            let imgURI;
            let code = new Image();
            let avatar = new Image();
            let bg = new Image();
            let shareImage = this.getShareImg ? decodeURIComponent(this.getShareImg) : require('../../../../imgs/card.jpg');
            bg.setAttribute("crossOrigin",'Anonymous')
            bg.src = shareImage;
            bg.onload = () => {
                ctx.drawImage(bg, 0, 30, 562, 980);
                this.fillText(ctx, '75px', '#fff', this.alreadyDays, 250, 380, 'center');
                this.fillText(ctx, '25px', '#fff', this.nickName, 130, 100);
                this.fillText(ctx, '20px', 'rgba(255,255,255,.65)', this.getLevelName, 60, 884);
                avatar.setAttribute("crossOrigin",'Anonymous')
                avatar.src = this.profileUrl;
                avatar.onload = () => {
                    this.circleImg(ctx, avatar, 42, 68, 35);
                    code.src = require('../../../../imgs/wx.jpeg');
                    code.onload = () => {
                        ctx.drawImage(code, 400, 850, 140, 140);
                        imgURI = canvas.toDataURL("image/png");
                        this.show_img = true;
                        this.img_url = imgURI;
                    }
                }
            }
        },
        // 画圆头像
        circleImg(ctx, img, x, y, r) {
            ctx.save();
            var d = 2 * r;
            var cx = x + r;
            var cy = y + r;
            ctx.arc(cx, cy, r, 0, 2 * Math.PI);
            ctx.clip();
            ctx.drawImage(img, x, y, d, d);
            ctx.restore();
        },
        // 写字
        fillText(context, size, color, text, x, y, align) {
            context.font = size + " DINPro-Medium,DINPro";
            context.fillStyle = color;
            context.textAlign = align || "left";
            context.textBaseline = "middle";
            context.fillText(text, x, y);
        },
        handleClickClose() {
            this.show_achievement_card = false;
        },
        getShareInfo () {
            ajax({
                url: '/no-need-sign-in/get-share-page',
                data: {
                    levelId: localStorage.getItem('levelId')
                }
            }).then(res => {
                if (res.success) {
                    let res_data = res.data;
                    let defaultUrl = [location.protocol, '//', location.host,location.pathname].join('');
                    res_data.shareUrl = res_data.buySite ? defaultUrl+'?public=true&redirectUrl='+encodeURIComponent(res_data.buySite)+'#/share' : defaultUrl;
                    setShare(res.data);
                }
            })
        }
    }
}