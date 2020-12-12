<template>
  <!-- 交易密码弹出框 -->
  <div class="dialog" v-show="diashow">
      <div class="dialogcont">
          <p class="dtit">交易密码</p>
          <van-cell-group>
              <van-field v-model="pwd" placeholder="请输入密码" :type="pw" class="input2">
                  <van-button
                          class="verifybtn"
                          slot="button"
                          @click="pwisshow"
                          type="default"
                      >
                          <img src="../assets/img/eyeshow.png" alt="" v-show="pw != 'password'">
                          <img src="../assets/img/eyehide.png" alt="" v-show="pw == 'password'">
                      </van-button>
              </van-field>
          </van-cell-group>
          <div class="dbtnbox">
              <van-button @click="confirm" :disabled="disabled" class="dbtn" color="linear-gradient(to right, #709af8, #547beb)">确认</van-button>
          </div>
          <img class="dialogclose" src="../assets/img/closeicon.png" alt="" @click="diashow = false">
      </div>
  </div>
</template>

<script>
export default {
  name: 'dialogpwd',
  data () {
    return {
      diashow:false,
      pwd:'',
      pw:'password',
    }
  },
  props:['disabled'],
  mounted(){
    
  },
  methods:{
    confirm(){
      this.$emit('onpwd',this.pwd)
    },
   pwisshow(){
            if(this.pw == "password"){
                this.pw = ""
            }else{
                this.pw = "password"
            }
        },
  }
}
</script>

<style scoped>
.dtit{
    font-size: 1.5rem;
    font-weight: bold;
    color: #000;
    line-height:4rem;
    height: 30%;
}
.dialogcont{
        height: calc(40% - 30px);
}
.input2{
    border-bottom: 1px solid #e8e8e8;
}
.input2 img,.verbtn img{
    width: 7%;
}
.input2 >>> [class*=van-hairline]::after{
    border: none;
}
.input2 button,.input2 button::before{
    border: none;
    background: none;
    height: auto;
    padding: 0;
}
.input2 .van-button__text{
    width: 2.5rem;
}
.input2 button img{
    width: 60%;
}
.dialogcont >>> .van-cell-group{
    height: 50%;
}
.dbtnbox{
    height: 20%;
    text-align: center;
}
.dbtnbox button{
    height: 4rem;
    line-height: 4rem;
    width: 80%;
    border-radius: 20px;
    font-size: 1.35rem;
}
</style>
