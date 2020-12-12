<template>
    <div class="wrapper pt5rem">
        <!-- 提成收益 -->
        <navbar label="提成收益"></navbar>
        <div class="content ">
            <!-- 收益 -->
            <div class="earningbox">
                <img src="../../assets/img/shouyibg.png" alt="">
                <div class="earningcont">
                    <div class="earnmid">
                        <div class="etl">
                            <p>可用余额</p>
                            <p class="numbold">{{balances.usableAmount}} USDT </p>
                        </div>
                        <div class="etr">
                            <p>提成收益</p>
                            <p class="numbold">{{allpmoney}} USDT </p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 提成收益记录 -->
            
            <div class="recode">
                <div class="littit">提成收益记录</div>
                <div class="recodetit">
                    <p>时间</p>
                    <p>收益/收益提升</p>
                </div>
                <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了!"
                @load="getdata()"
                offset="5"
                :immediate-check="false"
                v-if="showdata"
                >
                    <div class="recodeli" >
                        <p v-for="(item,i) in datas" :key="i">
                            <span>{{item.createTime.slice(0,10)}} </span> 
                            <span><span class="cgreen">+{{item.amount}}  USDT</span></span>

                        </p>
                    </div>
                </van-list>
                <div class="norecode" v-else>
                        <img src="../../assets/img/norecoding.png" alt="">
                        <p>暂无数据</p>
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
             dataListTotal: 0, //数据总量
            dataListCurrPage: 0, //当前页码
            dataListSize: 6, //一页显示多少条数据
            dataListCurrPage1: 0, //刷新时的页码
            finished: false,
            loading: false,
            showdata:true,
            balances:'',//余额
            rate:'',
            datas:[],
            userinfo:store.get('userinfo'),
            allpmoney:'',
        };
    },
    mounted(){
        this.getdata()
        this.getallpmoney()
        this.getrate()
        this.getbalance()
    },
    methods:{
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

        // 获取提成收益记录
        getdata(){
            this.loading = true
            this.dataListCurrPage++;
            this.$http.post('/api/business/walletLog/query',qs.stringify({
                type:6,
                createTime:'',
                createTimeEnd:'',
                pageSize:this.dataListSize,
                pageNo:this.dataListCurrPage,
            })).then(res=>{
                if(res.data.success == true){
                    this.loading = false;
                    if(res.data.result.length == 0){
                        this.showdata = false
                    }else{
                        this.showdata = true
                        var count = res.data.total;
                        if (this.dataListCurrPage === 1) {
                            this.datas = res.data.result;
                        } else {
                            this.datas = this.datas.concat(res.data.result);
                        }
                        if (this.dataListCurrPage * this.dataListSize >= count) {
                            this.finished = true;
                        }
                    }
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err=>{
                this.finished = true;
                this.loading = false;
            })
        },

        // 获取提成总收益
        getallpmoney(){
            this.$http.get('/api/business/getAgentProfit').then(res=>{
                if(res.data.success == true){
                    var re = /([0-9]+\.[0-9]{4})[0-9]*/;
                    this.allpmoney = res.data.result.replace(re,"$1")
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
.wrapper{
    background: #f3f3f5;
}
.content{
     background: #f3f3f5;
}

.littit{
    font-size: 1.4rem;
    font-weight: bold;
    line-height: 4rem;
}
/* 收益 */
.earningbox{
    margin-top:15px;
    position: relative;
    border-radius: 14px;
    line-height: 1;
    background: none;
}
.earningbox > img{
    box-shadow: -5px 5px 5px #ccc;
    width: 100%;
    height: 7rem;
    border-radius: 14px;
}
.earningcont{
   color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
    margin: 1.5rem 0;
    height: 4rem;
    line-height: 1;
}
.earnmid{
    display: flex;
    justify-content: space-around;
    height: 4rem;
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

/* 提成收益记录 */
.recode{
    padding: 0  15px ;
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
.norecode{
    padding: 20px 0;
    text-align: center;
    color: #e0bd82;

}
.norecode img{
    margin-bottom: 15px;
    height: 4.5rem;
}
</style>