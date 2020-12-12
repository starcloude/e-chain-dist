<template>
    <div class="wrapper">
        <!-- iphone扫码下载说明页面 -->
       <div class="logobox">
            <img class="logo" src="../assets/img/logo-sl.png" alt="">
        </div>
        <p class="hint" >iphoneGU货币APP下载说明</p>
        <div class="cont">
            <h4 class="tit">安装步骤</h4>
            <p><span class="ind">1</span><span>先前往AppStore应用商店安装TestFlight软件，已安装请直接到第②步。</span> </p>
            <div class="btnbox">
                <van-button color="#ef8300"><img class="btnicon" src="../assets/img/testflight.png" alt="">下载TestFlight</van-button>
            </div>
            <p><span class="ind">2</span>安装第一步之后，在TestFlight中搜索GU并下载。</p>
        </div>
    </div>
</template>

<script>
import qs from 'qs'
import common from '../asstic/common'
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
    color: #FFF;
    
}
.cont{
    font-size: 1.25rem;
    width: calc(90% - 30px);
    border-radius: 4px;
    margin-left: 5%;
    background: #fcfcfc;
    padding: 15px;

}
.cont p{
    display: flex;
    align-items: center;
    justify-content: space-evenly;
}
.cont h4{
    height: 4rem;
    line-height: 4rem;
    font-weight: bold;
    font-size: 1.4rem;
    text-align: center;
}
.ind{
    border-radius: 50%;
    background: #7db8ae;
    height: 2rem;
    width: 2rem;
    margin-right: 5px;
    color: #fff;
    line-height: 2rem;
    display: inline-table;
    text-align: center;

}
.btnicon{
    width: 15%;
}
.btnbox{
    text-align: center;
    margin: 15px 0;
}
button{
    border-radius: 20px;
}
button >>> .van-button__text{
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    font-weight: bold;
    font-size: 1.35rem;
}
</style>