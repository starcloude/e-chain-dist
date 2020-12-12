<template>
    <div class="wrapper">
        <!-- 扫码下载页面 -->
        <div class="logobox">
            <img class="logo" src="../assets/img/logo-sl.png" alt="">
        </div>
        <p class="hint" >GU货币APP   提高你的收益，让您的财产变得更多。</p>
        <div class="btnbox">
            <div class="androidbox">
                <van-button color="#ee7f51"><img class="phoneicon" src="../assets/img/android.png" alt=""><span>安卓下载</span></van-button>
            </div>
            <div class="iosbox">
                <van-button color="#677af6" @click="$router.push({path:'/codeDownloadinfo'})"><img class="phoneicon" src="../assets/img/ios.png" alt=""><span>IOS下载</span></van-button>
            </div>
        </div>
        
        
    </div>
</template>

<script>
import qs from 'qs'
import * as http from "../asstic/http.js";
export default {

    data(){
        return{
    
        };
    },
    mounted(){
    },
    methods:{
    }
}
</script>
<style scoped>
.wrapper{
    background: url('../assets/img/codebg1.jpg')no-repeat;
    background-size:100% 100%;
}
.logobox{
    height: 15%;
    line-height: 15%;
    display: flex;
    align-items: center;
}
.logo{
    margin-left: 5%;
    width: 30%;
}
.hint{
    margin-top: 10%;
    text-indent: 2em;
    margin-left: 10%;
    width: 80%;
    height: 10%;
    font-size: 1.5rem;
    font-weight: bold;
    color: #fff;
}
.btnbox{
     margin-top: 10%;
    margin-left: 5%;
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    }
.androidbox,.iosbox{
    margin-top: 5%;
    width: 100%;
    height: 20%;
    display: flex;
    align-items: center;
     justify-content: space-around;
    flex-direction: column;
   
}
button >>> .van-button__text{
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    font-weight: bold;
    font-size: 1.35rem;
}
button{
    width: 90%;
    margin-top: 15px;
    border-radius: 4px;
}

.phoneicon{
    width: 20%;
}
</style>