<template>
    <div class="wrapper pt5rem">
        <!-- 登录 -->
        <div class="content ">
          <div class="logintext">登录</div>
          <div class="logininp"> 
              <van-cell-group>
                <van-field v-model="user" placeholder="请输入用户名" />
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
                <van-field v-model="verifycode" placeholder="请输入验证码"  class="input2 input3" >
                    <van-button
                            class="verifybtn"
                            slot="button"
                            type="default"
                             @click="changeverify"
                        >
                            <img :src="verifyimg" alt="">
                        </van-button>
                </van-field>
            </van-cell-group>
            <van-button color="#03a9e7" class="loginbtn" @click="onlogin">登录</van-button>
            <div class="foot">
                <p>没有账号，<span class="cblue" @click="$router.push({path:'/register'})">立即注册</span></p>
                <p class="cblue" @click="$router.push({path:'/changepwd'})">忘记密码</p>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import qs from 'qs'
import common from '../asstic/common'
import * as http from "../asstic/http.js";
export default {
    components:{

    },
    data(){
        return{
            ident:'',//是否设置身份认证 false没有true有
            user:'',
            pwd:'',
            verifycode:'',
            pw:'password',
            verifyimg:'',
            r:Math.random()
        };
    },
    mounted(){
        this.changeverify()
    },
    methods:{
        // 切换验证码
        changeverify(){
            this.r = Math.random()
            this.verifyimg = http.webUrl+'/api/captcha/index?r='+this.r+'&ts='+this.r
        },
        isEmpty(val) {
            return /^\s*$/.test(val);
        },
       pwisshow(){
            if(this.pw == "password"){
                this.pw = ""
            }else{
                this.pw = "password"
            }
        },
        // 登录按钮
        onlogin(){
            if(this.isEmpty(this.user)){
                this.$toast("用户名不能为空！")
                return false;
            }
            if(this.isEmpty(this.pwd)){
                this.$toast("密码不能为空！")
                return false;
            }
            if(this.isEmpty(this.verifycode)){
                this.$toast("验证码不能为空！")
                return false;
            }

            this.$http.post('/api/login',qs.stringify({
                userName:this.user,
                userPwd:this.pwd,
                r:this.r,
                captchaCode:this.verifycode
            })).then(res=>{
                // state等于 0正常登陆 1禁止登陆 2禁止提现
                if(res.data.success == true && res.data.result.state != 1){
                    
                    store.set('userinfo',res.data.result)
                    this.getident()
                }else{
                    this.changeverify()
                    this.verifycode = ''
                    this.$toast(res.data.msg)
                }
            }).catch(err=>{
                this.verifycode = ''
                this.changeverify()
            })
           
        },
        // 获取是否设置身份认证
        getident(){
            this.$http.get(`/api/card/get`).then(res=>{
                if(res.data.result == null){
                    this.$toast('您还未上传身份认证信息，请先上传身份认证信息。')
                    this.$router.push({path:'/identity'})
                }else{
                    this.getquestion()
                }
            })
        },
        //获取用户是否设置密保问题
        getquestion(){
            this.$http.get('/api/question/query').then(res=>{
                if(res.data.result[1] == undefined){
                    this.$toast('您还未设置密保问题，请先设置密保问题')
                    this.$router.push({path:'/setingpwquestion'})
                }else{
                    this.$toast('登录成功！')
                    this.$router.push({path:'/index/index'})
                }
            }).catch(err=>{
            })
        },

    },
}
</script>
<style scoped>

.logintext{
    font-size: 2rem;
    font-weight: bold;
    padding-top: 10px;
}
.van-cell{
    padding: 0;
    height:5rem;
    line-height:5rem;
    border-bottom: 1px solid #eeeeee;
    font-size: 1.25rem;
}


.logininp{
    margin-top: 3rem;
}
.logininp >>> input::placeholder{
 font-size: 1.2rem;
 color: #757575;
}
.input2 img,.verbtn img{
    width: 7%;
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
/* 验证码 */
.input3 >>> .van-field__button{
    height:3rem;
}
.input3 >>> .van-button__text{
    width: 10rem;
}
.input3 button img{
    width: auto;
    height: 3rem;
}
/* 声明 */
.statement{
    margin-top: 15px;
    font-size: 1.2rem;
}

.cblue{
  color: #03a9e7;
}
.statement  >>> .van-checkbox__icon{
    height: 1.25rem;
    font-size: 1.25rem;
}
.loginbtn{
    margin: 20px 0;
    width: 100%;
    font-size: 1.6rem;
}
.foot{
    font-size: 1.2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>