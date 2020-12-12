<template>
    <div class="wrapper pb10rem">
        <!-- 会员中心 -->
        <div class="content ">
            <div class="head">
                <p>会员中心</p>
            </div>
            <!-- 会员信息 -->
            <div class="vipinfo">
                <div class="viphead">
                    <div class="headimg"><img src="../../assets/img/head.png" alt=""></div>
                    <div class="vhinfo">
                        <div class="vipname">
                            <p>{{userinfo.nickName}}</p>
                            <p>
                                <img src="../../assets/img/vipicon.png" alt="">
                                <span v-if="userinfo.type == 0 ">VIP会员</span>
                                <span v-else-if="userinfo.type == 1">团队长</span>
                            </p>
                        </div>
                        <p v-if="userinfo.type == 0 ">会员永久有效</p>
                        <p  class="pmoney" v-else-if="userinfo.type == 1">
                            <span>邀请可得提成</span>
                            <van-button type='primary' @click="$router.push({path:'/vipcenter/pushMoney'})">提成收益</van-button>
                        </p>
                    </div>
                </div>
                <div class="invcode">
                    <p>邀 请 码：{{userinfo.id}}</p>
                    <van-button color="#ee7f51" @click="oncopy" class="copybtn" :data-clipboard-text="userinfo.id">复制</van-button>
                    <van-button  v-if="userinfo.type != 0 " @click="onshare" class="sharebtn" :data-clipboard-text="httpUrl+'/#/register?invitedId='+encodeURIComponent(encrid)" type="info">邀请</van-button>
                </div>
            </div>
            <!-- 导航列表 -->
            <div class="navlist">
                <div class="promes">
                    <div class="littit">用户信息</div>
                    <div class="promescont">
                        <div @click="onident(0)">
                            <img src="../../assets/img/myicon1.png" alt="">
                            <p>用户信息</p>
                        </div>
                        <div  @click="$router.push({path:'/vipcenter/walletvindicate'})">
                            <img src="../../assets/img/myicon2.png" alt="">
                            <p>钱包维护</p>
                        </div>
                        <div @click="onident(1)">
                            <img src="../../assets/img/myicon3.png" alt="">
                            <p>认证信息</p>
                        </div>
                        <div  @click="$router.push({path:'/vipcenter/changepassword'})">
                            <img src="../../assets/img/myicon4.png" alt="">
                            <p>修改密码</p>
                        </div>
                    </div>
                </div>
                <div class="cut-off"></div>
                <div class="promes">
                    <div class="littit">资产信息</div>
                    <div class="promescont">
                        <div @click="$router.push({path:'/property/propertdetail'})">
                            <img src="../../assets/img/propert1.png" alt="">
                            <p>资产明细</p>
                        </div>
                        <div @click="$router.push({path:'/property/chargemoney'})">
                            <img src="../../assets/img/propert3.png" alt="">
                            <p>充币</p>
                        </div>
                        <div @click="$router.push({path:'/property/transfer'})">
                            <img src="../../assets/img/propert2.png" alt="">
                            <p>划转</p>
                        </div>
                        <div @click="$router.push({path:'/property/mentionmoney'})"> 
                            <img src="../../assets/img/propert4.png" alt="">
                            <p>提币</p>
                        </div>
                    </div>
                </div>
                <div class="cut-off"></div>
                <div class="promes">
                    <div class="littit">帮助中心</div>
                    <div class="promescont">
                        <!-- <div @click="$router.push({path:'/vipcenter/newguidance'})">
                            <img src="../../assets/img/propert1.png" alt="">
                            <p>新手指导</p>
                        </div> -->
                        <div @click="$router.push({path:'/vipcenter/helpcenter'})">
                            <img src="../../assets/img/myicon5.png" alt="">
                            <p>常见问题</p>
                        </div>
                        <div @click="$router.push({path:'/vipcenter/service'})">
                            <img src="../../assets/img/myicon6.png" alt="">
                            <p>在线客服</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <navfoot type='5'></navfoot>
    </div>
</template>

<script>
import qs from 'qs'
import common from '../../asstic/common'
import navfoot from '../../components/navfoot'
import * as http from "../../asstic/http.js";
import Clipboard from "clipboard";
export default {
    components:{
        navfoot
    },
    data(){
        return{
            httpUrl:http.webUrl,
            ident:true,//是否验证过身份认证true是 false否 
            userinfo:store.get('userinfo'),
            recodings:[],
            encrid:'',
        };
    },
    mounted(){
        this.getident()
        this.onencrid()
    },
    methods:{
        // 加密id
        onencrid(){
            this.$http.post('/api/getCiphertext',qs.stringify({
                    plaintext:this.userinfo.id
                })).then(res=>{
                if(res.data.success == true){
                    this.encrid = res.data.result
                    // this.encrid = 'rK3TwJa+5uhlS9zFAgH6aQ=='
                }
            })
        },
        // 分享按钮
        onshare(){
            var clipboard = new Clipboard('.sharebtn')
            clipboard.on('success', e => {
            this.$toast('分享链接生成完成，请到需要分享的位置粘贴即可。')
            // 释放内存
            clipboard.destroy()
            })
        },
        // 认证信息按钮
        onident(state){
            if(this.ident == true){
                if(state == 0){
                    this.$router.push({path:'/vipcenter/userinfo'})
                }else{  
                    this.$toast('身份认证信息已认证，无需重复认证。')
                }
            }else{
                if(state == 0){
                    this.$toast('身份认证信息未认证，请先认证。')
                }else{
                    this.$router.push({path:'/identity'})
                }
            }
        },
        // 获取认证信息
        getident(){
            this.$http.get(`/api/card/get`).then(res=>{
                if(res.data.result == null){
                    this.ident = false
                }else{
                    this.ident = true
                }
            }).catch(err=>{
                localStorage.clear();
                this.$router.push({path:'/login'})
            })
        },
        oncopy() {
         var clipboard = new Clipboard('.copybtn')
            clipboard.on('success', e => {
            this.$toast('复制成功！')
            // 释放内存
            clipboard.destroy()
            })
        }

    },
}
</script>
<style scoped>
.wrapper{
    background: #f3f3f5;
    background: url('../../assets/img/mybg.png')no-repeat;
    background-position: 0 0;
    background-size: 100% auto;
}
.content{
    padding: 0 ;
}
.cut-off{
    color: #f9f9f9;
    height: 1rem;
}
.head{
    margin: 0 5%;
    width: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 5rem;
}
.head p{
    font-size: 1.6rem;
    font-weight: bold;
}


.littit{
    font-size: 1.4rem;
    font-weight: bold;
    line-height: 4rem;
}
/* 会员信息 */
.vipinfo{
    letter-spacing: 1px;
    padding: 10px 5% 20px 5%;
    background: rgba(0,0,0,0);
}
.viphead{
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 1.2rem;
}
.headimg{
    width: 5rem;
    height: 5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    
}
.headimg img{
    border-radius: 50%;
    width: 100%;
    object-fit: cover;
}
.vhinfo{
        display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 10px;
    height: 5rem;
    width: calc(100% - 5rem);
}
.vipname{
    display: flex;
    align-items: center;
    font-size: 1.25rem;
}
.vhinfo > p{
    font-size: 1.25rem;
    margin-top: 2px;
}
.invcode{
    margin-top: 5px;
    padding-left: calc(5rem + 8px);
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 1.25rem;
    letter-spacing: normal;
}
.invcode p{
    width: 12rem;
}
.pmoney > span:first-child{
    width: 12rem;
    display: inline-block;
}
.invcode button{
    margin-right: 10px;
    font-size: 1.25rem;
    height: 2rem;
    padding: 0 8px;
}
.vipname p:last-child{
    margin-left: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.vipname p:last-child img{
    height: 1.2rem;
}
.vipname p:last-child span{
    margin-top: 2px;
    margin-left: 5px;
    line-height: 1;
    width: 6em;
}
.navlist{
    border-radius: 12px 12px 0 0;
    background: #fff;
    font-size: 1.2rem;
}
.pmoney button{
    margin-left: -5px;
    font-size: 1.25rem;
    height: 2rem;
    padding: 0 8px;
}
/* 资产信息 */
.promes{
    padding: 0  15px 15px;
}
.promescont {
    display: flex;
    align-items: center;
}
.promescont > div{
    width: 18%;
    margin-right: 1.5rem;
    color: #b2b3ba;
    text-align: center;
}
.promescont img{
    height: 3.5rem;
}
.promescont p{
    font-size: 1.25rem;
    margin-top: 5px;
}
.van-button__text {
    line-height: 1;
}
</style>