<template>
    <div class="wrapper pb10rem">
        <!-- 首页 -->
        <div class="content ">
            <div class="head">
                <img  class="logo" src="../../assets/img/logo.png" alt="">
                <img class="message" src="../../assets/img/message.png" alt="" style="display:none;">
            </div>
            <!-- 轮播图 -->
            <banner></banner>
            <!-- 平台规则 -->
            <!-- <div class="pfrule">
                <img src="../../assets/img/ruleicon.png" alt="">
                <p class="ruletext">平台规则</p>
                <van-notice-bar background="#f3fafd"  :scrollable="false">
                <van-swipe
                    vertical
                    class="notice-swipe"
                    :autoplay="3000"
                    :show-indicators="false"
                >
                    <van-swipe-item v-for='(item,i) in messages' :key="i"><p class="messagep" @click="onmessage(item.id)">{{item.content}}</p></van-swipe-item>
                </van-swipe>
                </van-notice-bar>
            </div> -->
            <!-- 我的收益 -->
            <div class="earnings" @click="onearn()">
                <div class="littit">我的收益</div>
                <div class="earnbox">
                    <img src="../../assets/img/shouyibg.png" alt="">
                    <div class="earncont">
                        <div class="earntop">
                            <p>总收益(USDT)</p>
                            <p>收益记录<van-icon name="arrow"></van-icon></p>
                        </div>
                        <div class="alleari">{{ aeari }} USDT</div>
                        <div class="earnfoot">
                            <p>今日收益：<span class="footnum">{{dayearni}} USDT</span></p>
                            <div class="efoot">
                                <p>日化收益：<span class="footnum">{{daye}}</span> </p>
                                <div>
                                    <img src="../../assets/img/shouyiicon.png" alt="">
                                    <p class="footmid">我的矿机</p>
                                    <p class="footnum">{{length}} 台</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 共享矿机 -->
            <div class="sharemill">
                <div class="littit">共享矿机</div>
                <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了!"
                @load="getmining"
                offset="5"
                :immediate-check="false"
                v-if="showdata"
                >
                <div class="millcont " v-for="(item,i) in datas" :key="i">
                    <div class="milltop">
                        <van-button>现货</van-button>
                        <p>{{ item.code }}</p>
                    </div>
                    <div class="millmid">
                        <div class="ml">
                            <img :src="httpUrl+ '/api/file/d/'+item.icon" alt="" v-if="item.icon != undefined">
                            <p v-else class="noimg">暂无图片</p>
                        </div>
                        <div class="mr">
                                <div class="line"></div>
                                <div class="price">
                                    <p>价格</p>
                                    <p class="millnum">{{item.price}} USDT</p>
                                    <div  >有效期：<span class="millnum">{{item.runningDays}} 天</span></div>
                                </div>
                                <div class="output">
                                    <p>每日产出</p>
                                    <p class="millnum">{{item.profit}}<span>USDT/24h</span></p>
                                </div>
                            
                        </div>
                    </div>
                    <div class="millfoot">
                        <van-button @click="onbuy(item.id)">购&nbsp;买</van-button>
                    </div>
                </div>
                </van-list>
                 <div class="nodata" v-else>暂无数据！</div>
            </div>
        </div>
        <navfoot type='1'></navfoot>
    </div>
</template>

<script>
import qs from 'qs'
import common from '../../asstic/common'
import banner from '../../components/banner'
import navfoot from '../../components/navfoot'
import * as http from "../../asstic/http.js";
export default {
    components:{
        banner,
        navfoot
    },
    data(){
        return{
            httpUrl:http.webUrl,
            rate:"",
            length:'',
            aeari:'0',//总收益
            dayearni:'0',//当日收益
            datas:[],
            // messages:[
            //     {id:1,content:"1关于调整包币交易区普通用户单笔最高限额的公告"},
            //     {id:2,content:"2关于调整包币交易区普通用户单笔最高限额的公告"},
            //     {id:3,content:"3关于调整包币交易区普通用户单笔最高限额的公告"},
            // ],
            finished: false,
            loading: false,
            showdata:true,
            dataListCurrPage: 0, //当前页码
            dataListSize: 6, //一页显示多少条数据
            userinfo:store.get('userinfo'),
            ident:false,//是否认证true认证false未认证
            tradepwd:true,//是否有交易密码true有false没有
            daye:'',//日化收益
        };
    },
    mounted(){
        if(this.$route.query.invicode){
            store.set('invicode',this.$route.query.invicode)
        }
        this.getmining()
        if(store.get('userinfo')){
            this.getdayearni()
            this.getallearni()
            this.mymachine()
            this.getident()
            this.getrate()
            this.getbalance()
            this.getdaye()
        }
        
    },
    methods:{
        // 获取日化收益
        getdaye(){
            this.$http.get('/api/business/getDailyProfitPoint').then(res=>{
                    if(res.data.success == true){
                        this.daye = res.data.result
                    }
                })
            
        },
        //我的收益跳转
        onearn(){
            if(store.get('userinfo')){
                this. $router.push({path:'/property/propertdetail',query:{type:0}})
            }else{
                this.$router.push({path:'/login'})
            }
        },
        //获取用户是否有交易密码
        getbalance(){
            this.$http.get('/api/userWallet/getAmount').then(res=>{
                if(res.data.success == true){
                    if(res.data.result.tradePassword == '' || res.data.result.tradePassword == undefined ){
                        this.tradepwd = false
                    }else{
                        this.tradepwd = true
                    }
                    
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
        // 获取认证信息
        getident(){
            this.$http.get(`/api/card/get`).then(res=>{
                if(res.data.result == null){
                    this.ident = false
                }else{
                    this.ident = true
                }
            }).catch(err=>{
            })
        },
        // 获取我的矿机详情
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
        change(){
            this.dataListCurrPage= 0
            this.finished = false
            this.loading = false
            this.showdata = true
            this.datas = []
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
        // 购买按钮
        onbuy(id){
            if(store.get('userinfo')){
                if(this.ident == false){
                    this.$toast('请先完善认证信息！')
                    this.$router.push({path:"/identity"})
                    
                }else if(this.tradepwd == false){
                    this.$toast('请先设置交易密码！')
                    this.$router.push({path:"/vipcenter/changepassword",query:{state:1}})
                }else{
                    this.$router.push({path:'/index/orderinfo',query:{id:id}})
                }
            }else{
                this.$router.push({path:'/login'})
            }
        },
        // 获取可购买的矿机
        getmining(){
            this.loading = true
            this.dataListCurrPage++;
            this.$http.post('/api/machine/query',qs.stringify({
                yn:0,//1有效0无效
                runningDays:'',
                pageNo:this.dataListCurrPage,
                pageSize:this.dataListSize
            })).then(res=>{
                 this.loading = false;
                if(res.data.success == true){
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
                this.$toast('服务器错误，请联系管理员！')
            })
            
        },

    // onmessage(id){
    //     if(!store.get('userinfo')){
    //         this.$router.push({path:'/login'})
    //     }else{
    //     }
    // },

    },
}
</script>
<style scoped>

.head{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 6rem;
}
.logo{
    height: 4rem;
}
.message{
    height: 2.5rem;
}
/* 平台规则 */
/* .pfrule{
    padding-left: 10px;
    margin: 10px 0;
    background: #f3fafd;
    height: 3rem;
    font-size: 1.25rem;
    color: #b4c1cb;
    display: flex;
    align-items: center;
}
.ruletext{
    margin:0 5px;
    color: #5f6162;
    font-size: 1.25rem;
    width: 5em;
}
.messagep{
    color: #b1bfc8;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    white-space: nowrap;
    font-size: 1;
    line-height: 3rem;
}
.pfrule img{
    height: 1.6rem;
}
 .notice-swipe{
    height: 3rem!important;
    line-height: 3rem;
  }
.van-notice-bar{
    padding: 0;
    height: 3rem;
    line-height: 3rem;
    width: calc(100% - 3rem);
} */
/* 我的收益 */
.littit{
    color: #000;
    font-size: 1.4rem;
    font-weight: bold;
    line-height: 4rem;
}
.earnbox {
    position: relative;
    line-height: normal;
    border-radius: 14px;
}
.earnbox > img{
    width: 100%;
    border-radius: 14px;
    box-shadow: -5px 5px 5px #ccc;
}
.earncont{
    padding: 5px 10px;
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 20px);
    height: calc(100% - 10px);
    color: #fff;
}
.earntop{
    height: 22%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.earntop p:last-child{
    display: flex;
    align-items: center;
}
.earntop .van-icon{
    margin-left: 3px;
    font-size: 1.25rem;
}
.alleari{
    height: 22%;
    font-weight: bold;
    font-size: 1.35rem;
}
.earnfoot{
    height: 48%;
}
.earnfoot > p{
    line-height: 2.2em;
    border-bottom: 1px solid #ffffff;
}
.earnfoot img{
    width: auto;
    height: 1.1rem;
}
.efoot{
    padding-top: 2%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.efoot > div{
    display: flex;
    align-items: flex-end;
}
.footmid{
    margin: 0 5px;
    line-height: 1;
}
.footnum{
    font-size: 1.35rem;
    font-weight: bold;
    line-height: 1;
}
/* 共享矿机 */
.millcont{
    padding: 8px;
    box-shadow: 0 0 10px #ccc;
    border-radius: 12px;
    margin-bottom: 15px;
}
.milltop{
    display: flex;
    align-items: center;
}
.milltop button{
    background: #677af6;
    height: 1.8rem;
    color: #fff;
    padding: 0px 5px;
}
.milltop p{
    margin-left: 5px;
    color: #000;
    font-size: 1.5rem;
    font-weight: bold;
}
.millmid{
    display: flex;
        margin-top: 8px;
}
.ml{
    height: 6rem;
    width: 25%;
    display: flex;
    justify-content: end;
    align-items: center;
}
.ml img{
    height: 100%;
    object-fit: cover;
    width: 100%;
    /* margin-left: -5px; */
}
.mr{
    margin-left: 3%;
    color: #8a8c97;
    width: 72%;
    display: flex;
    justify-content: space-between;
    position: relative;
}
.rf{
    color: #ff0000;
    font-size: 1.25rem;
}
.line{
    width:0.8px;
    height: 2.5rem;
    position: absolute;
    top: 2px;
    left: 48%;
    background: #ccc;
}
.millfoot{
    text-align: right;
}
.millnum{
    color: #ee7f51;
    font-size: 1.35rem;
    margin-bottom: 2px;
    font-weight: bold;
}

.millfoot button{
    color: #fff;
    background: #ee7f51;
    height: 2.2rem;
    padding: 0 10px;
    border-radius: 4px;
    font-size: 1.25rem;
}
</style>