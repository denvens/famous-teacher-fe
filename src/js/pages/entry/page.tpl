<div>
    <router-view></router-view>
    <div v-if="routerList.indexOf($route.path)>-1" class="tab-bar clearfix">
        <div class="tab-item" v-for="(item,index) in tabMenuList" v-bind:style="{width:(1/tabMenuList.length*100).toFixed(2)+'%'}" @click="clickTab(item)">
            <div class="tab-item-line"><img :src="$route.path===item.path?item.activeIcon:item.icon" alt=""></div>
            <div v-bind:class="[$route.path===item.path?'active-text':'']" class="tab-item-line">{{item.text}}</div>
        </div>
    </div>
</div>
    