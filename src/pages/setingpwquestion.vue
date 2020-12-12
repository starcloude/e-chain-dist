<template>
    <div class="wrapper pt5rem">
        <!-- 设置密码问题 -->
        <navbar label="设置密码问题"></navbar>
        <div class="content ">
            <div class="libox">
                <p>用户名</p>
                <van-field class="lir accountclass"  v-model="account" placeholder="用户名" disabled/>
            </div>
            <div class="libox mt15">
                <p>问题一</p>
                <van-dropdown-menu class="lir">
                    <van-dropdown-item v-model="question1" :options="questions1" @change="changequestion()"/>
                </van-dropdown-menu>
            </div>
            <div class="libox">
                <p>答案</p>
                <van-field class="lir" v-model="answer1" placeholder="答案" />
            </div>
            <div class="libox mt15">
                <p>问题二</p>
                <van-dropdown-menu class="lir">
                    <van-dropdown-item v-model="question2" :options="questions2"  @change="changequestion()"/>
                </van-dropdown-menu>
            </div>
            <div class="libox">
                <p>答案</p>
                <van-field class="lir" v-model="answer2" placeholder="答案" />
            </div>
            <div class="libox mt15">
                <p>问题三</p>
                <van-dropdown-menu class="lir">
                    <van-dropdown-item v-model="question3" :options="questions3"  @change="changequestion()"/>
                </van-dropdown-menu>
            </div>
            <div class="libox">
                <p>答案</p>
                <van-field class="lir" v-model="answer3" placeholder="答案" />
            </div>

            <van-button @click="setbtn" color="#03a9e7" class="setbtn" >设置密码问题</van-button>
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
          account:store.get('userinfo').account,
          question1:1,
          questions1:[],
          answer1:'',
          question2:2,
          questions2:[],
          answer2:"",
          question3:3,
          questions3:[],
          answer3:"",
        };
    },
    mounted(){
        this.getquestion()
    },
    methods:{
        // 改变密保问题
        changequestion(){
            if(this.question1 == this.question2 || this.question1 == this.question3 || this.question2 == this.question3){
                this.question1 = 1
                this.question2 = 2
                this.question3 = 3
                this.$toast('不能选择相同的密保问题！')
            }
        },
        
        isEmpty(val) {
            return /^\s*$/.test(val);
        },
        // 获取问题
        getquestion(){
            var t = []
            this.$http.get('/api/question/select').then(res=>{
                for (let i = 1; i < Object.values(res.data.result).length; i++) {
                    var j = {}
                    j.text = res.data.result[i]
                    j.value = i
                    this.questions1.push(j)
                    this.questions2.push(j)
                    this.questions3.push(j)
                }
            }).catch(err=>{
            })
        },
        // 设置密保问题
      setbtn(){
           if(this.question1 == this.question2 || this.question1 == this.question3 || this.question2 == this.question3){
                this.$toast('不能选择相同的密保问题！')
                return false;
            }
          if(this.isEmpty(this.account)){
              this.$toast('用户名不能为空！')
              return false;
          }
          if(this.question1 == this.question2 || this.question1 == this.question3 || this.question2 == this.question3){
              this.$toast('请选择不同的密保问题！')
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
          let datas = {
              questionId:[this.question1,this.question2,this.question3],
              answer:[this.answer1,this.answer2,this.answer3],
          }
          this.$http.post('/api/question/add',JSON.stringify(datas),{headers:{'Content-Type':'application/json'}}).then(res=>{
              if(res.data.success == true){
                   this.$toast('设置成功！')
                    setTimeout(()=>{
                        this.$router.push({path:'/login'})
                    },500)
              }else{
                  this.$toast(res.data.msg)
              }
          }).catch(err => {
          })
         
      }

    },
}
</script>
<style scoped>
.accountclass >>> input{
    color: #000;
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
.van-cell{
    padding:10px 0;
    border-bottom: 1px solid #eeeeee;
}
/* .libox:nth-child(1),.libox:nth-child(3),.libox:nth-child(5){
    border-bottom: 1px solid #e9e9e9;
} */
.libox > p{
    width: 6rem;
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
    height: 4rem;
    line-height: 4rem;
    width: 100%;
}
</style>