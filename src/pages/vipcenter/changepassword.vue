<template>
    <div class="wrapper pt5rem">
        <!-- 修改密码 -->
        <navbar label="修改密码"></navbar>
        <div class="content ">
            <div class="selectpwtype">
                <van-field name="radio" label="密码类型">
                    <template #input>
                        <van-radio-group v-model="radio" direction="horizontal">
                        <van-radio name="1">登录密码</van-radio>
                        <van-radio name="2">交易密码</van-radio>
                        </van-radio-group>
                    </template>
                    </van-field>
            </div>
            <div class="loginpwd" v-if="radio == '1'">
                <p>原始密码</p>
                <van-field v-model="oldpwd" placeholder="请输入原始密码" :type="pw" class="input2">
                    <van-button
                            class="verifybtn"
                            slot="button"
                            @click="pwshow(1)"
                            type="default"
                        >
                            <img src="../../assets/img/eyeshow.png" alt="" v-show="pw != 'password'">
                            <img src="../../assets/img/eyehide.png" alt="" v-show="pw == 'password'">
                        </van-button>
                </van-field>
                 <p>新密码</p>
                <van-field v-model="newpwd" placeholder="请输入新密码" :type="pwa" class="input2">
                    <van-button
                            class="verifybtn"
                            slot="button"
                            @click="pwshow(2)"
                            type="default"
                        >
                            <img src="../../assets/img/eyeshow.png" alt="" v-show="pwa != 'password'">
                            <img src="../../assets/img/eyehide.png" alt="" v-show="pwa == 'password'">
                        </van-button>
                </van-field>
                <van-button color="#03a9e7" class="savebtn" @click="savelogin">保存</van-button>
            </div>
            <div class="delpwd" v-else>
                <p>原交易密码</p>
                <van-field v-model="dealpwd" placeholder="请输入原交易密码(没有可不填写)" :type="dealpw" class="input2" maxlength="6">
                    <van-button
                            class="verifybtn"
                            slot="button"
                            @click="pwshow(3)"
                            type="default"
                        >
                            <img src="../../assets/img/eyeshow.png" alt="" v-show="dealpw != 'password'">
                            <img src="../../assets/img/eyehide.png" alt="" v-show="dealpw == 'password'">
                        </van-button>
                </van-field>
                 <p>新交易密码</p>
                <van-field v-model="dealpwda" placeholder="请输入新交易密码" :type="dealpwa" class="input2" maxlength="6">
                    <van-button
                            class="verifybtn"
                            slot="button"
                            @click="pwshow(4)"
                            type="default"
                        >
                            <img src="../../assets/img/eyeshow.png" alt="" v-show="dealpwa != 'password'">
                            <img src="../../assets/img/eyehide.png" alt="" v-show="dealpwa == 'password'">
                        </van-button>
                </van-field>
                <van-button color="#03a9e7" class="savebtn" @click="savedeal">保存</van-button>
            </div>
            
            
    
        </div>
    </div>
</template>

<script>
import qs from 'qs'
import common from '../../asstic/common'
import navbar from '../../components/navbar'
import * as http from "../../asstic/http.js";
export default {
    components:{
        navbar
    },
    data(){
        return{
            radio:'1',
            oldpwd:'',
            newpwd:"",
            pw:'password',
            pwa:'password',
            dealpwd:'',
            dealpwda:'',
            dealpw:'password',
            dealpwa:'password',
            userinfo:store.get('userinfo')
        };
    },
    mounted(){
        if(this.$route.query.state == 1){
            this.radio = '2'
        }

    },
    methods:{

        pwshow(val){
            if(val == 1){
                this.pw == "password"? this.pw = "": this.pw = "password"
            }else if(val == 2){
                 this.pwa == "password"? this.pwa = "": this.pwa = "password"
            }else if(val == 3){
                 this.dealpw == "password"? this.dealpw = "": this.dealpw = "password"
            }else if(val == 4){
                 this.dealpwa == "password"? this.dealpwa = "": this.dealpwa = "password"
            }
        },
        // 保存修改登录密码
        savelogin(){
            if(this.isEmpty(this.oldpwd)){
                this.$toast('原始密码不能为空！')
                return false;
            }
            if(this.isEmpty(this.newpwd)){
                this.$toast('新密码不能为空！')
                return false;
            }
            this.$http.post('/api/updatePwd',qs.stringify({
                account:this.userinfo.account,
                oldPwd:this.oldpwd,
                password:this.newpwd,
            })).then(res=>{
                if(res.data.success == true){
                    this.$toast('修改成功！')
                    setTimeout(()=>{
                        this.$router.push({path:'/vipcenter/my'})
                    },500)
                }else{
                    this.$toast(res.data.msg)
                }
            })
        },
        // 保存修改交易密码
        savedeal(){
            if(this.isEmpty(this.dealpwda)){
                this.$toast('新交易密码不能为空！')
                return false;
            }
            if(!/^[0-9]*$/.test(this.dealpwda)){
                this.$toast('交易密码请输入6位数字！')
                return false;
            }
            this.$http.post('/api/setTradePassword',qs.stringify({
                oldPwd:this.dealpwd,
                tradePassword:this.dealpwda,
            })).then(res=>{
                if(res.data.success == true){
                     this.$toast('修改成功！')
                    setTimeout(()=>{
                        this.$router.push({path:'/vipcenter/my'})
                    },500)
                    
                }else{
                    this.$toast(res.data.msg)
                }
            })
        },
        isEmpty(val) {
            return /^\s*$/.test(val);
        },

    },
}
</script>
<style scoped>
/* 密码类型选择 */
.van-cell{
    padding: 10px 0;
    font-size: 1.4rem;
}
.van-cell::after{
    left: 0;
    right: 0;
}
.selectpwtype >>> .van-radio__icon{
    font-size: 1.4rem;
}
.selectpwtype >>> .van-radio__label{
    line-height: 1.5rem;
}
/* 登录密码 */
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
.loginpwd > p,.delpwd > p{
    font-size: 1.4rem;
    margin-top: 3rem;
}
.savebtn{
    width: 100%;
    height: 4rem;
    line-height: 4rem;
    margin-top: 5rem;
}
</style>