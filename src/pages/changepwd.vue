<template>
    <div class="wrapper pt5rem">
        <!-- 忘记密码验证密保问题 -->
        <navbar label="忘记密码"></navbar>
        <div class="content ">
            <h3>问题找回</h3>
            <div class="libox mt15">
                <p>用户名</p>
                <van-field class="lir" v-model="userid" placeholder="用户名" />
            </div>
            <div class="libox mt15">
                <p>问题一</p>
                 <div class="lir">{{questions1}}</div>
            </div>
            <div class="libox">
                <p>答案</p>
                <van-field class="lir" v-model="answer1" placeholder="答案" />
            </div>
            <div class="libox mt15">
                <p>问题二</p>
                 <div class="lir">{{questions2}}</div>
     
            </div>
            <div class="libox">
                <p>答案</p>
                <van-field class="lir" v-model="answer2" placeholder="答案" />
            </div>
            <div class="libox mt15">
                <p>问题三</p>
                <div class="lir">{{questions3}}</div>

            </div>
            <div class="libox">
                <p>答案</p>
                <van-field class="lir" v-model="answer3" placeholder="答案" />
            </div>

            <div class="libox mt15">
                <p>新密码</p>
                <van-field v-model="pwd" placeholder="新密码" :type="pw" class="input2 lir">
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
            </div>
             <div class="libox mt15">
                <p>确认密码</p>
                <van-field v-model="pwda" placeholder="请输入密码" :type="pwa" class="input2 lir">
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
            </div>
                
            <van-button color="#03a9e7" class="setbtn" @click="onnext">下一步</van-button>
        </div>
    </div>
</template>

<script>
import qs from 'qs'
import common from '../asstic/common'
import navbar from '../components/navbar'
import * as http from "../asstic/http.js";
export default {
    components:{
        navbar,
    },
    data(){
        return{
          userid:'',
          question1:1,
          questions1:'',
          answer1:"",
          question2:2,
          questions2:'',
          answer2:"",
          question3:3,
          questions3:'',
          answer3:"",
          pwd:'',
            pwda:"",
            pw:'password',
            pwa:'password',
        };
    },
    mounted(){
        this.getquestion()
    },
    methods:{
        getquestion(){
            this.$http.get('/api/question/query').then(res=>{
                if(res.data.success == true){
                    var a = []
                    var b = []
                    for(var key in res.data.result){
                        a.push(key)
                        b.push(res.data.result[key])
                    }
                    this.questions1 = b[0]
                    this.questions2 = b[1]
                    this.questions3 = b[2]
                    this.question1 = a[0]
                    this.question2 = a[1]
                    this.question3 = a[2]
                    
                }else{
                    this.$taost(res.data.msg)
                }
            }).catch(err=>{
            })
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
        onnext(){
            if(this.isEmpty(this.userid)){
                this.$toast('用户名不能为空！')
                return false;
            }
            if(this.isEmpty(this.answer1)){
                this.$toast('问题一答案不能为空！')
                return false;
            }
            if(this.isEmpty(this.answer2)){
                this.$toast('问题二答案不能为空！')
                return false;
            }
            if(this.isEmpty(this.answer3)){
                this.$toast('问题三答案不能为空！')
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
            if(this.pwd != this.pwda){
                this.$toast('两次输入的密码不一致！')
                return false;
            }
            let datas = {
                account:this.userid,
                questionId:[this.question1,this.question2,this.question3],
                answer:[this.answer1,this.answer2,this.answer3],
                password:this.pwd,
            }
            this.$http.post('/api/forgetPwd',JSON.stringify(datas),{headers:{'Content-Type':'application/json'}}).then(res=>{
                if(res.data.success == true){
                     this.$toast('修改成功！')
                    setTimeout(()=>{
                        this.$router.push({path:'/login'})
                    },500)
                    
                }else{
                    this.$toast(res.data.msg)
                }
            })
            
        },



    },
}
</script>
<style scoped>
h3{
    font-weight: bold;
    font-size: 1.4rem;
    padding: 0 10px;
}

.libox{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    height: 4rem;
    line-height: 4rem;
    font-size: 1.25rem;
    
}

.libox > p{
    width: 7rem;
}
.van-cell{
    padding:10px 0;
    border-bottom: 1px solid #eeeeee;
}
.lir{
    width: calc(100% - 10rem);
    
}
.lir >>> .van-dropdown-menu__bar{
    height: 4rem;
    box-shadow: none;
    background: none;
}
.lir >>> .van-dropdown-menu__title{
    width: 100%;
    padding: 10px 0;
    font-size: 1.25rem;
}
.setbtn{
    margin-top: 5rem;
    margin-bottom: 3rem;
    height: 4rem;
    line-height: 4rem;
    width: 100%;
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
.input3 .van-button__text{
    color: #03a9e7;
}
.input2 button img{
    width: 60%;
}
</style>