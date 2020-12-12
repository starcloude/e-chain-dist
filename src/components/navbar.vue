<template>
  <div class="navbar">
    <div class="limg" @click="$router.go(-1)">
     <van-icon name="arrow-left" />
    </div>
    <div class="tit">{{label}}</div>
    <div class="right" v-show="right == 'true'" @click="$router.push({path:'/property/history',query:{state:state}})">历史记录</div>
  </div>
</template>

<script>
export default {
  name: 'navbar',
  data () {
    return {
    }
  },
  props:["label","right",'state'],
  mounted(){
    
  },
  methods:{
   
  }
}
</script>

<style scoped>
.navbar{
  display: flex;
  align-items: center;
  max-width: 540px;
  width: 90%;
  position: fixed;
  top: 0;
  padding: 0 5%;
  height: 5rem;
  z-index: 102;
  background: #fff;
}
.limg{
  width: 15%;
}
.limg i{
  font-size: 1.8rem;
}
.tit{
  color: #000;
  font-size: 1.6rem;
  width: 60%;
  text-align: center;
}
.right{
  padding-right: 3px;
  width: 25%;
  text-align: right;
  font-size: 1.25rem;
}
</style>
