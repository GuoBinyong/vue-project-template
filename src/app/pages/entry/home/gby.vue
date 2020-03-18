<template>
  <div>
    郭斌勇页面：
    <p>{{mes}}</p>

    <p id="slot父">

    </p>

    <slot></slot>
  </div>


</template>

<script>
    export default {
        name: "gby",
        props:{
            dd:[Boolean,String]
        },
        data:function () {
            return {
                mes:"初始信息",
                // deactivateActions:"destory"
            }
        },
        created() {
            debugger
            window.gby = this;
            console.log("-----created--gby----")
        },

        beforeMount() {
            debugger
            console.log("-----beforeMount--gby----")
        },

        mounted() {
            console.log("-----mounted--gby----")
        },

        updated() {
            console.log("-----updated--gby----")
        },

        beforeDestroy() {
            console.log("-----beforeDestroy--gby----")
        },
        activated() {
            console.log("-----activated--gby----")
        },

        destroyed() {
            console.log("-----destroyed--gby----")
        },



    }
</script>

<style scoped>

</style>
