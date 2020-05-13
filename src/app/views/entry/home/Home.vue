<template>
<!--<div>-->
<!--&lt;!&ndash;  <view-box  >&ndash;&gt;-->
<!--&lt;!&ndash;    <x-header slot="header" title="首页" :left-options="{showBack:false}"></x-header>&ndash;&gt;-->
<!--&lt;!&ndash;    <a href="http://www.runoob.com">点击我</a>&ndash;&gt;-->

<!--&lt;!&ndash;-->
<!--    <div @touchstart="touchstartOut"  @touchend="touchend" @click="clickHandle" @mousedown="mousedownHandle"  @mouseup="mouseupHandle">-->


<!--      <x-input class="xinput1" value="郭" placeholder="这是点位符"></x-input>-->

<!--      <div class="oriInput1">-->
<!--        <input type="text" placeholder="你好">-->
<!--      </div>-->


<!--      <x-input  @touchstart.native="touchstartHadle" class="xinput2" value="郭" placeholder="这是点位符"></x-input>-->

<!--      <div @touchstart="touchstartHadle" class="oriInput2">-->
<!--        <input type="text" placeholder="你好">-->
<!--      </div>-->






<!--    <div class="cont" @touchstart="touchstartHadle" @touchend="touchend" @click="clickHandle" @mousedown="mousedownHandle"  @mouseup="mouseupHandle">-->

<!--    </div>-->

<!--    </div>-->
<!--&ndash;&gt;-->


   <div >


     <x-input class="xinput1" value="郭" placeholder="这是点位符"></x-input>

     <div class="oriInput1">
       <input type="text" placeholder="你好">
     </div>


     <x-input  class="xinput2" value="郭" placeholder="这是点位符"></x-input>

     <div class="oriInput2">
       <input type="text" placeholder="你好">
     </div>





     <div class="gby" >{{mes}}</div>

     <gby></gby>

   </div>


<!--</div>-->
<!--  </view-box>-->
<!-- <div> -->
<!--  <keep-alive>-->
  <!-- <gby dd="dfss"> -->
    <!-- <dyx></dyx> -->
  <!-- </gby> -->
<!--  </keep-alive>-->
  <!-- {{mes}} -->
<!-- </div> -->


</template>


<script>

  import XInput from "vux/src/components/x-input/index";
  import gby from './gby'
  import dyx from './dyx'

  window.Gby = gby
  export default {
    name: "Home",
     /* provide : function () {
          debugger
          return {keepAliveVue:this};
      },*/
    components: {XInput,gby,dyx},
      data:function(){
        return {
            mes:"首页初始信息"
        }
      },
      created(){
        window.home = this;
      },
    methods:{
      touchstartHadle:function (event) {
        debugger;
        console.log("touchstartHadle",event)
      },
      touchstartOut:function (event) {
        debugger;
        console.log("touchstartOut",event)
      },
      clickHandle:function (event) {
        debugger;
        console.log("clickHandle",event)
      },

      mouseupHandle: function (event) {
          debugger;
          console.log("mouseupHandle",event)
        },

      mousedownHandle:function (event) {
        debugger;
        console.log("mousedownHandle",event)
      },
      touchend:function (event) {
        debugger;
        console.log("touchend",event)
      },
    }
  }
</script>


<style >

  .cont {
    height: 100vh;
  }

  input {
    background-color: red !important;

  }


  .xinput {
    background-color: green !important;
  }

  .gby {

    background-color: red;

    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
  }

</style>
