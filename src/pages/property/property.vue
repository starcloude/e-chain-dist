<template>
    <div class="wrapper pb10rem">
        <!-- 资产 -->
        <div class="content ">
            <div class="head">
                <p></p>
                <p>资产</p>
                <img class="message" src="../../assets/img/message.png" alt="" style="display:none;">
            </div>
            <!-- 收益 -->
            <div class="earningbox">
                <img src="../../assets/img/shouyibg.png" alt="">
                <div class="earningcont">
                    <div class="earntop">
                        <p><span>可用金额</span> <span>不可提现</span></p>
                        <p class="numbold"><span>{{ balances.usableAmount }} USDT</span><span>{{ nwithdraw }} USDT</span>  </p>
                    </div>
                    <div class="earnmid">
                        <div class="etl">
                            <p>今日收益</p>
                            <p class="numbold">{{dayearni}} USDT </p>
                        </div>
                        <div class="etr">
                            <p>累计收益</p>
                            <p class="numbold">{{aeari}} USDT </p>
                        </div>
                    </div>
                    <div class="earnfoot">
                        <img src="../../assets/img/shouyiicon.png" alt="">
                        &nbsp;<span>我的矿机</span>
                        &nbsp;<span class="numbold">{{length}} 台</span>
                    </div>
                </div>
            </div>
            <!-- 收益记录 -->
            <div class="recode">
                <div class="littit">收益记录</div>
                <div class="recodetit">
                    <p>时间</p>
                    <p>收益/收益提升</p>
                </div>
                <van-loading v-show="loading"/>
                <div v-show="!loading">
                    <div class="recodeli" v-if="recodings.length != 0">
                        <p v-for="(item,i) in recodings.slice(0,3)" :key="i">
                            <span>{{item.createTime.slice(0,10)}} </span> 
                            <span><span class="cgreen">+{{item.amount}}  USDT</span></span>
                        </p>
                        <div class="morebtn">
                            <van-button plain type="info" v-show="recodings.length > 3" @click="$router.push({path:'/property/propertdetail',query:{type:0}})">查看更多>>></van-button>
                        </div>
                        
                    </div>
                    <div class="norecode" v-else>
                        <img src="../../assets/img/norecoding.png" alt="">
                        <p>暂无数据</p>
                    </div>
                </div>
                
            </div>
            <!-- 资产信息 -->
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
        </div>
        <navfoot type='4'></navfoot>
    </div>
</template>

<script>
import qs from 'qs'
import common from '../../asstic/common'
import navfoot from '../../components/navfoot'
import * as http from "../../asstic/http.js";
export default {
    components:{
        navfoot
    },
    data(){
        return{
            nwithdraw:'',//不可提现
            balances:'',//余额
            rate:'',
            length:'',
            loading:true,//加载中
            dayearni:0,
            aeari:0,
            recodings:[],
            userinfo:store.get('userinfo'),
        };
    },
    mounted(){
        this.getdata()
        this.getdayearni()
        this.getallearni()
        this.mymachine()
        this.getrate()
        this.getbalance()
        this.onnwithdraw()
    },
    methods:{
        // 获取当前用户不可提现金额
        onnwithdraw(){
            this.$http.get('/api/business/getFrozenCashOut').then(res=>{
                if(res.data.success == true){
                    this.nwithdraw = res.data.result
                }else{
                    // this.$toast(res.data.msg)
                }
            })
            
        },
        //获取余额
        getbalance(){
            this.$http.get('/api/userWallet/getAmount').then(res=>{
                if(res.data.success == true){
                    this.balances = res.data.result
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err=>{
            })
        },
        // 获取汇率
        getrate(){
            this.$http.get('/api/exchangeRate/get').then(res=>{
                if(res.data.success == true){
                    this.rate = res.data.result
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err=>{
            })
        },
        mymachine(){
           this.$http.post('/api/business/myMachine/query').then(res=>{
                if(res.data.code == 0){
                    this.length = res.data.result.length
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err => {
            })
       },
        // 获取收益记录
        getdata(){
            this.$http.post('/api/business/walletLog/query',qs.stringify({
                type:0,
                createTime:'',
                createTimeEnd:'',
                pageSize:6,
                pageNo:1,
            })).then(res=>{
                this.loading = false
                if(res.data.code == 0){
                    if (this.dataListCurrPage === 1) {
                        this.recodings = res.data.result;
                    } else {
                        this.recodings = this.recodings.concat(res.data.result);
                    }
                    
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err=>{
                 this.loading = false
                localStorage.clear();
                this.$router.push({path:'/login'})
            })
        },
       // 获取当日收益
        getdayearni(){
            this.$http.get('/api/business/getUserMachineDailyProfit').then(res=>{
                if(res.data.success == true){
                    var re = /([0-9]+\.[0-9]{4})[0-9]*/;
                    this.dayearni = res.data.result.replace(re,"$1")
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err=>{
            })
        },
        // 获取总收益
        getallearni(){
            this.$http.get('/api/business/getUserMachineProfit',qs.stringify({
                userId:this.userinfo.id,
            })).then(res=>{
                if(res.data.success == true){
                    var re = /([0-9]+\.[0-9]{4})[0-9]*/;
                    this.aeari = res.data.result.replace(re,"$1")
                }
            }).catch(err=>{
            })
        },

    },
}
</script>
<style scoped>
.wrapper{
    background: #f3f3f5;
}
.content{
     background: #f3f3f5;
}
.head{
    margin: 0 5%;
    width: 90%;
    text-align: center;
    height: 5rem;
    line-height: 5rem;
}
.head p{
    font-size: 1.6rem;
    font-weight: bold;
    line-height: 5rem;
}

.message{
    height: 2.5rem;
}
.littit{
    font-size: 1.4rem;
    font-weight: bold;
    line-height: 4rem;
}
/* 收益 */
.earningbox{
   position: relative;
    border-radius: 14px;
    line-height: 1;
    background: none;
}
.earningbox > img{
    box-shadow: -5px 5px 5px #ccc;
    width: 100%;
    height: 11rem;
    border-radius: 14px;
}
.earningcont{
   color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
    margin: 0.5rem 0;
    height: 10rem;
    line-height: 1;
}
.earnmid{
    margin-top: 0.8rem;
    display: flex;
    justify-content: space-around;
    height: 3rem;
}
.earnmid > div{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.numbold{
    font-size: 1.25rem;
    font-weight: bold;
}
.earntop {
    margin: 0 5%;
    border-bottom: 1px solid #dbdbdb;
    height: 4rem;
}
.earntop p{
    display: flex;
    align-items: center;
    justify-content: space-around;
}
.earnfoot{
    margin-top: 4px;
    height: 2.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
}
.earnfoot img{
    height: 1rem;
}
/* 收益记录 */
.recode{
    padding: 0  15px 15px;
    border-radius: 6px;
    margin-top: 20px;
    background: #fff;
    font-size: 1.25rem;
}
.recodetit{
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #b2b3ba;
}
.recodeli{
    padding-top: 15px;
}
.recodeli p{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 3rem;
    line-height: 3rem;
    color: #666;
    border-bottom: 1px solid #efefef;
}
.morebtn{
    padding-top: 15px;
    width: 100%;
    text-align: center;
}
.morebtn button{
    height: 2.5rem;
    line-height: 2.5rem;
    border-radius: 4px;
    width: 12rem;
}
.norecode{
    margin: 20px 0;
    text-align: center;
    color: #e0bd82;

}
.norecode img{
    margin-bottom: 15px;
    height: 4.5rem;
}
/* 资产信息 */
.promes{
    padding: 0  15px 15px;
    border-radius: 6px;
    margin: 20px 0;
    background: #fff;
    font-size: 1.25rem;
}
.promescont {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.promescont > div{
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
</style>