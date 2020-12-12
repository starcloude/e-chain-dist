<template>
    <div class="wrapper pt5rem">
        <navbar label="帮助中心"></navbar>
        <!-- 帮助中心 -->
        <div class="content">
            <!-- 搜索框 -->
            <!-- <div class="serachbox">
                <img src="../../assets/img/helpcenterbg.png" alt="">
                <div class="serachcontent">
                    <div class="input">
                        <input type="text" v-model.trim="searchVal"  placeholder="输入你要查找的问题">
                        <img src="../../assets/img/serachicon.png" alt="" @click="onserach">
                    </div>
                    <div class="serachhint">
                        <p>热门问题：</p>
                        <div class="questionli">
                            <van-button v-for="(item,i) in questionlis" :key="i" color="#333c54">{{item}}</van-button>
                        </div>
                    </div>
                </div>
            </div>   -->
            <!--问题列表  -->
            <div class="questions">
                <p class="littit">常见问题</p>
                <div class="questioncont">
                    <div class="questionbox">
                        <div class="qtit">1、如何充币？</div>
                        <div class="qanswer">登录->我的->充币。输入充币数量与流水号（前往交易所复制交易流水号），请仔细核对充币地址。</div>
                        <div class="qimg"><img src="../../assets/img/problem1.png" alt=""></div>
                    </div>
                    <div class="questionbox">
                        <div class="qtit">2、如何划转？</div>
                        <div class="qanswer">登录->我的->划转。输入对方用户名，输入划转数量</div>
                        <div class="qimg"><img src="../../assets/img/problem2.png" alt=""></div>
                    </div>
                    <div class="questionbox">
                        <div class="qtit">3、如何提币？</div>
                        <div class="qanswer">登录->我的->提币。选择您设置的提币地址，输入提币数量</div>
                        <div class="qimg"><img src="../../assets/img/problem3.png" alt=""></div>
                    </div>
                    <div class="questionbox">
                        <div class="qtit">4、忘记登录密码，如何找回？</div>
                        <div class="qanswer">如果您的登录密码忘记了，您可在登录页面点击忘记密码，通过问题设置新的密码</div>
                    </div>
                    <div class="questionbox">
                        <div class="qtit">5、交易密码是什么？</div>
                        <div class="qanswer">交易密码为6位数的纯数字，为了您的账号安全，划转，提币等相关操作需要验证交易密码，交易密码建议不要和登录密码相同。这样账号会更加安全</div>
                    </div>

                </div>
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

        };
    },
    mounted(){

    },
    methods:{
       onserach(){ 

       },

    },
}
</script>
<style scoped>

.content{
    margin-top: 1px;
    border-top: 1px solid #e1e1e1;
}
/* 搜索框 */
/* .serachbox {
    position: relative;
}
.serachbox > img{
    width: 100%;
}
.serachcontent{
    position: absolute;
    left: 0;
    top: 0;
    width: 90%;
    height: 80%;
    color: #fff;
    padding: 5%;
}
.input{
    position: relative;

}
.input input{
    padding-left: 3px;
    width: 100%;
    height: 2.5rem;
    border-radius: 2px;
    background: rgba(0, 0, 0, 0);
    border: 1px solid #ccc;
    font-size: 1.2rem;
    color: #fff;
}
.input input::placeholder{
    color: #fff;
}
.input img{
    position: absolute;
    height: 1.6rem;
    right: 10px;
    top: 0.6rem;
}
.serachhint p{
margin-top: 10px;
}
.questionli{
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
}
.questionli button{
    margin-top:10px;
margin-right: 15px;
height: 2.5rem;
line-height: 2.5rem;
padding: 0 10px;
} */
/* 问题列表 */
.questions{
    margin-bottom: 15px;
}
.littit{
    margin-top: 15px;
    color: #000;
    font-size: 1.4rem;
    font-weight: bold;
    line-height: 4rem;
}
.questioncont{
    font-size: 1.25rem;
    color: #333;
}
.qanswer{
    text-indent: 2em;
}
.qtit{
    font-weight: bold;
    font-size: 1.35rem;
    /* display: inline-block; */
    height: 3rem;
    line-height: 3rem;
    /* border-bottom:2px solid #ee7f51 ; */
}

.qimg img{
    width: 100%;
}
</style>