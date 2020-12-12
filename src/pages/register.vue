<template>
    <div class="wrapper pt5rem">
        <!-- 注册 -->
        <navbar label="注册"></navbar>
        <div class="content ">
          <div class="logintext">注册</div>
          <div class="logininp"> 
              <van-cell-group>
                <van-field v-model="userName" placeholder="请输入用户名" />
                <van-field v-model="nickName" placeholder="请输入昵称" />
                <van-field v-model="verifycode" placeholder="验证码"  class="input3">
                    <van-button
                            class="verifybtn"
                            slot="button"
                            @click="changeverify"
                            type="default"
                        >
                        <img :src="verifyimg" alt="">
                        </van-button>
                </van-field>
                <van-field v-model="pwd" placeholder="登录密码(最小6位数字或字符)" :type="pw" class="input2">
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
                <van-field v-model="pwda" placeholder="确认密码" :type="pwa" class="input2">
                    <van-button
                            class="verifybtn"
                            slot="button"
                            @click="pwaisshow"
                            type="default"
                        >
                            <img src="../assets/img/eyeshow.png" alt="" v-show="pwa != 'password'">
                            <img src="../assets/img/eyehide.png" alt="" v-show="pwa == 'password'">
                        </van-button>
                </van-field>
                <van-field v-model="invitecode" placeholder="请输入邀请码" :disabled="disabled"/>
            </van-cell-group>
            <div class="agreement">
                <van-checkbox v-model="checked" class="statement" checked-color="#03a9e7">
                    同意 <span class="cblue" @click="$refs.agrdialog.agrshow = true">《服务协议》</span>
                </van-checkbox>
            </div>
            <van-button color="#03a9e7" class="loginbtn" @click="onregister">注册</van-button>
            <div class="foot">
                <p>已有账号，<span class="cblue" @click="$router.push({path:'/login'})">立即登录</span></p>
            </div>
          </div>
        </div>
        <agreement ref="agrdialog"></agreement>
    </div>
</template>

<script>
import qs from 'qs'
import common from '../asstic/common'
import navbar from '../components/navbar'
import agreement from '../components/agreement'
import * as http from "../asstic/http.js";
export default {
    components:{
        navbar,
        agreement
    },
    data(){
        return{
            disabled:false,
           userName:'',
           nickName:'',
           verifycode:"",
           pwd:'',
           pwda:'',
           invitecode:'',//邀请码
           pw:'password',
           pwa:'password',
           checked:false,
           verifyimg:"",
           r:Math.random()
        };
    },
    mounted(){
        if(this.$route.query.invitedId){
            store.set('invitedId',this.$route.query.invitedId)
            this.decode(this.$route.query.invitedId)
        }else if(store.get('invitedId')){
            this.decode(store.get('invitedId'))
        }
        this.changeverify()
    },
    methods:{
        // 解密
        decode(code){
            
            console.log(code)
            this.$http.post('/api/getPlaintext',qs.stringify({
                    ciphertext:decodeURIComponent(code)
                })).then(res=>{
                if(res.data.success == true){
                    this.invitecode = res.data.result
                    this.disabled = true
                }
            })
        },
        // 切换验证码
        changeverify(){
            this.r = Math.random()
            this.verifyimg = http.webUrl+'/api/captcha/index?r='+this.r+'&ts='+this.r
        },
       pwisshow(){
            if(this.pw == "password"){
                this.pw = ""
            }else{
                this.pw = "password"
            }
        },
        pwaisshow(){
            if(this.pwa == "password"){
                this.pwa = ""
            }else{
                this.pwa = "password"
            }
        },
        isEmpty(val) {
            return /^\s*$/.test(val);
        },
        // 注册
        onregister(){
            if(this.isEmpty(this.userName)){
                this.$toast('用户名不能为空！')
                return false;
            }
            if(this.isEmpty(this.nickName)){
                this.$toast('昵称不能为空！')
                return false;
            }
            if(this.isEmpty(this.verifycode)){
                this.$toast("验证码不能为空！")
                return false;
            }
            if(this.isEmpty(this.invitecode)){
                this.$toast("邀请码不能为空！")
                return false;
            }
            if(this.isEmpty(this.pwd)){
                this.$toast("密码不能为空！")
                return false;
            }
            if(this.isEmpty(this.pwda)){
                this.$toast("确认密码不能为空！")
                return false;
            }
             if(this.pwda != this.pwd){
                this.$toast("两次输入的密码不一致！")
                return false;
            }
            if(this.checked == false){
                this.$toast("请阅读并同意服务协议！")
                return false;
            }
            this.$http.post('/api/register',qs.stringify({
                account:this.userName,
                password:this.pwd,
                nickName:this.nickName,
                invitedId:this.invitecode,
                r:this.r,
                captchaCode:this.verifycode,
            })).then(res=>{
                if(res.data.success == true){
                    store.set('userinfo',res.data.result)
                    this.$toast('注册成功！')
                    setTimeout(()=>{
                        this.$router.push({path:'/identity'})
                    },500)
                    
                }else{
                    this.changeverify()
                    this.verifycode = ''
                    this.$toast(res.data.msg)
                }
            }).catch(err => {
                this.verifycode = ''
                this.changeverify()
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
    padding: 15px 0;
}
.van-cell{
    border-bottom: 1px solid #eeeeee;
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
.input2 button,.input2 button::before,.input3 button,.input3 button::before{
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
    margin: 15px 0;
    width: 100%;
    font-size: 1.6rem;
}
.foot{
    margin-bottom: 15px;
    font-size: 1.2rem;
    text-align: center;
}
</style>