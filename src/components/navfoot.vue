<template>
  <div class="navfoot">
    <div class="listbox" v-if='type == 1'>
      <img src="../assets/img/nav1.png" alt="">
      <p class="co">首页</p>
    </div>
    <div v-else class="listbox" @click="$router.push({path:'/index/index'})">
      <img src="../assets/img/nav11.png" alt="">
      <p>首页</p>
    </div>
    <div class="listbox" v-if='type == 2'>
      <img src="../assets/img/nav2.png" alt="">
      <p class="co">资讯</p>
    </div>
    <div v-else class="listbox" @click="onrouter(1)">
      <img src="../assets/img/nav22.png" alt="">
      <p>资讯</p>
    </div>
    <div class="listbox li3" v-if='type == 3'>
      <img src="../assets/img/nav3.png" alt="">
      <p class="co">矿场</p>
    </div>
    <div v-else class="listbox li3"  @click="onrouter(2)">
      <img src="../assets/img/nav33.png" alt="">
      <p>矿场</p>
    </div>
    <div class="listbox" v-if='type == 4'>
      <img src="../assets/img/nav4.png" alt="">
      <p class="co">资产</p>
    </div>
    <div v-else class="listbox"  @click="onrouter(3)">
      <img src="../assets/img/nav44.png" alt="">
      <p>资产</p>
    </div>
    <div class="listbox li5" v-if='type == 5'>
      <img src="../assets/img/nav5.png" alt="">
      <p class="co">我的</p>
    </div>
    <div v-else class="listbox li5" @click="onrouter(4)">
      <img src="../assets/img/nav55.png" alt="">
      <p>我的</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'navbar',
  data () {
    return {
    }
  },
  props:["type"],
  mounted(){
    this.getsession()
  },
  methods:{
    // 跳转判断是否登录
    onrouter(state){
      if(store.get('userinfo')){
        if(state == 1){
          // 资讯
          this.$router.push({path:'/information/information'})
        }else if(state == 2){
          // 矿场
          this.$router.push({path:'/mine/mine'})
        }else if(state == 3){
          // 资产
          this.$router.push({path:'/property/property'})
        }else if(state == 4){
          // 我的
          this.$router.push({path:'/vipcenter/my'})
        }
      }else{
        this.$router.push({path:'/login'})
      }
      
     
    },
    // 获取session
    getsession(){
      this.$http.get('/api/session').then(res=>{
        if(res.data.success == true){
            store.set('userinfo',res.data.result.user)
        }else{
          this.out()
        }
      })
    },
    // 退出登录
    out(){
      this.$http.get('/api/logout').then(res=>{
        if(res.data.success == true ){
          localStorage.clear();
          this.$router.push({path:'/login'})
        }else{
          this.$toast(res.data.msg)
        }
      })
    }

  }
}
</script>

<style scoped>
.navfoot{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  max-width: 540px;
  width: 100%;
  position: fixed;
  bottom: 0;
  height: 7rem;
  z-index: 102;
  background: #303039;
}
.listbox{
  font-size: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;

}
.listbox img{
  height: 2.1rem;
}
.listbox p{
  margin-top: 5px;
}

.co{
  color: #f19601;
}
</style>
