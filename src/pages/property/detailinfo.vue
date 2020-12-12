<template>
    <div class="wrapper pt5rem">
        <!-- 明细详情 -->
        <navbar label="明细详情"></navbar>
        <div class="content ">
           <div class="lilr">
               <span>类型</span>
               <span v-if="state == 0">充币</span>
               <span v-else-if="state == 1">划转</span>
               <span v-else-if="state == 2">提币</span>
            </div>
            <div class="lilr" v-if="state == 1">
                <span>转出账号</span>
                <span>{{datas.createPin}}</span>
            </div>
            <div class="lilr" v-if="state == 1">
                <span>接收账号</span>
                <span>{{datas.toAccount}}</span>
            </div>
            <div class="lilr" v-if="state != 1">
                <span>状态</span>
                <span v-if="datas.state == 0"><span v-show="state == 0">充值中</span><span v-show="state == 2">提币中</span></span>
                <span v-else-if="datas.state == 1">成功</span>
                <span v-else-if="datas.state == 2">失败</span>
            </div>
            <div class="lilr" v-if="state != 1">
                <span>链名称</span>
                <span>{{datas.chain}}</span>
            </div>
            <div class="litf" v-if="state != 1">
                <p>充币地址</p>
                <p>{{datas.address}}</p>
            </div>
            <div class="litf">
                <p>数量</p>
                <p>
                    <span v-if="state == 1" >{{datas.amount}}</span>
                    <span v-else>{{datas.usdt}}</span> USDT
                </p>
            </div>
            <!-- <div class="litf" v-if="state != 1">
                <p>金额</p>
                <p>{{datas.amount}} 元</p>
            </div> -->
            <div class="litf" v-if="state != 0">
                <p>手续费</p>
                <p>{{datas.fee}}<span> USDT</span></p>
            </div>
            <div class="litf">
                <p>操作时间</p>
                <p>{{datas.createTime}}</p>
            </div>
            <div class="litf" v-if="state == 0">
                <p>流水号</p>
                <p>{{datas.serialNo}}</p>
            </div>
            <div class="fbtn" v-if="datas.state == 2">
                <van-button color="#00acee" @click="appeal">申述</van-button>
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
            state:'',//0充币1划转2提币
            id:'',
            datas:{}
        };
    },
    mounted(){
        this.id = this.$route.query.id
        this.state = this.$route.query.state
        if(this.state == 0){
            //充币详情
            this.getcbdata()
        }else if(this.state == 1){
            //划转详情
            this.gethzdata()
        }else if(this.state == 2){
            //提币详情
            this.gettbdata()
        }
        
    },
    methods:{
        //申诉 
        appeal(){
            if(this.state == 0){
                //充值
                 this.$router.push({path:'/vipcenter/service',query:{type:0,id:this.id}})
            }else if(this.state == 2){
                // 提现
                this.$router.push({path:'/vipcenter/service',query:{type:2,id:this.id}})
            }
           
        },
        // 获取充币详情
        getcbdata(){
            this.$http.get('/api/business/recharge/'+this.id).then(res=>{
                if(res.data.success == true){
                    this.datas = res.data.result
                }else{
                    this.$toast(res.data.msg)
                }
                
            }).catch(err =>{
                this.$toast('服务器错误，请联系管理员！')
            })
        },
        // 获取划转详情
        gethzdata(){
            this.$http.get('/api/business/transfer/'+this.id).then(res=>{
                if(res.data.success == true){
                    this.datas = res.data.result
                }else{
                    this.$toast(res.data.msg)
                }
                
            }).catch(err =>{
                this.$toast('服务器错误，请联系管理员！')
            })
        },
        // 获取提币详情
        gettbdata(){
            this.$http.get('/api/business/cashOut/'+this.id).then(res=>{
                if(res.data.success == true){
                    this.datas = res.data.result
                }else{
                    this.$toast(res.data.msg)
                }
                
            }).catch(err =>{
                this.$toast('服务器错误，请联系管理员！')
            })
        },
    }
}
</script>
<style scoped>

.content{
    padding: 0;

}
.content > div{
    margin: 0 8%;
    margin-top: 15px;

    font-size: 1.25rem;
}
.lilr{
    height: 4rem;
    line-height: 4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* border-bottom: 1px solid #e9e9e9; */
}
.litf{
    height: 6rem;
    line-height: 6rem;
}
.litf p:last-child{
    height: 4rem;
    line-height: 4rem;
    border-bottom: 1px solid #e9e9e9;
}
.lastp{
    border: none!important;
}
.litf p:last-child,.lilr span:last-child{
    color: #999999;
}
/* 申诉 */
.fbtn{
    margin-top: 3rem!important;
    text-align: center;
}
.fbtn button{
    width: 100%;
    height: 4rem;
    line-height: 4rem;
    font-size: 1.35rem;
}
</style>