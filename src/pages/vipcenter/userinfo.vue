<template>
    <div class="wrapper pt5rem">
        <!-- 用户信息 -->
        <navbar label="用户信息"></navbar>
        <div class="content ">
            <div class="cut-off cut5"></div>
            <!-- 身份证信息 -->
          <div class="idtext">
              <van-cell-group>
                <van-field v-model="account" label="用户名" placeholder="请输入用户名" readonly />
                <van-field v-model="name" label="姓名" placeholder="请输入姓名" readonly />
                <van-field v-model="idnum" label="证件号" placeholder="请输入证件号" readonly />
            </van-cell-group>
          </div>
          <div class="cut-off "></div>
          <!-- 身份证图片 -->
          <div class="idcard mt20">
              <div class="cardfrond">
                <van-field name="uploader" label="正面照">
                <template #input>
                    <div class="imgbox">
                        <img :src="img1" >
                    </div>
                </template>
                </van-field>
              </div>
              <div class="cardreverse">
                <van-field name="uploader" label="反面照">
                    <template #input>
                        <div class="imgbox">
                            <img :src="img2"  >
                        </div>
                    </template>
                </van-field>
              </div>
          </div>

          <div class="outbox">
              <van-button @click="out" type="danger"  class="outbtn">退出登录</van-button>
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
            name:'',
            idnum:'',
            idfrond:[],
            idreverse:[],
            account:store.get('userinfo').account,
            img1:'',
            img2:'',
        };
    },
    mounted(){
        this.idfrond = [{url:'',}]
        this.idreverse = [{url:''}]
        this.getident()
    },
    methods:{
        // 退出
        out(){
            this.$http.get('/api/logout').then(res=>{
                if(res.data.success == true){
                    this.$router.push({path:"/login"})
                    localStorage.clear();
                }
            })
            
        },
        // 获取认证信息
        getident(){
            this.$http.get(`/api/card/get`).then(res=>{
                if(res.data.success == true){
                    let datas = res.data.result.data
                    this.img1 = http.webUrl+ '/api/file/d/' + datas.idCardImg1
                    this.img2 = http.webUrl+ '/api/file/d/' + datas.idCardImg2 
                    this.name = datas.realName
                    this.idnum = datas.idCardNo
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err=>{
            })
        },
       
    },
}
</script>
<style scoped>

.content{
    padding: 0;
}
.cut5{
    height: 5px;
}
.idtext{
    margin-top: 5px;
}
.idtext >>>[class*=van-hairline]::after{
    border: none;
}
.idtext .van-cell{
    padding: 10px 20px;
}
.idtext >>> .van-field__body{
    font-size: 1.25rem;
}
.van-cell >>> .van-field__label{
    color: #333;
    width: 3.5em;
    font-size: 1.25rem;
}
.idtext  >>> .van-cell::after{
    left: 10px;
    border-bottom-color:#e9e9e9;
}
/* 身份证照片 */
.imgbox{
    width: 15rem;
    height: 10rem;
}
.imgbox img{
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.cardreverse{
    margin-top: 20px;
}
.van-cell{
    border-bottom: none;
}
.outbox{
    padding-bottom: 2rem;
    margin-top: 2rem;
    text-align: center;
}
.outbox button{
    width: 80%;
    font-size: 1.35rem;
    height: 4rem;
    line-height: 4rem;
}
</style>