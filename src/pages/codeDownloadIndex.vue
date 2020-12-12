<template>
    <div class="wrapper">
        <!-- 扫码下载首页 -->
       <div class="logobox">
            <img class="logo" src="../assets/img/logo-sl.png" alt="">
        </div>
        <p class="hint" >GU货币APP ，请扫描下方二维码下载APP。</p>
        <div class="qrcodebox">
            <img src="../assets/img/codedownload.png" alt="">
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
    background: url('../assets/img/codebg2.jpg')no-repeat;
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
    color: #333;
}
.qrcodebox{
    margin-top: 15%;
    text-align: center;
}
.qrcodebox img{
    width: 30%;
}
.phonebg{
    width: 40%;
}
</style>