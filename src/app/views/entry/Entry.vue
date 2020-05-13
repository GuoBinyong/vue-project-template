<template>
<!--  <keep-alive nav-stack>-->
    <router-view></router-view>
<!--    <nav-stack>-->

<!--    </nav-stack>-->
<!--  </keep-alive>-->
<!--  <view-box>-->
<!--    <router-view></router-view>-->

<!--    <tabbar slot="bottom">-->
<!--      <tabbar-item :link="{name:'Home'}">-->
<!--        <img slot="icon" src="@icon/ic_family_sel@2x.png">-->
<!--        <span slot="label">首页</span>-->
<!--      </tabbar-item>-->
<!--      <tabbar-item :link="{name:'My'}">-->
<!--        <img slot="icon" src="@icon/ic_information_sel@2x.png">-->
<!--        <span slot="label">我的</span>-->
<!--      </tabbar-item>-->
<!--    </tabbar>-->
<!--  </view-box>-->
</template>

<script>
  import {Tabbar, TabbarItem} from 'vux'

  export default {
    name: "Entry",
    components: {
      Tabbar,
      TabbarItem
    }
  }
</script>

<style  scoped>

</style>
