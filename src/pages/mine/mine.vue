<template>
    <div class="wrapper pb10rem">
        <!-- 矿场 -->
        <div class="content ">
            <div class="head">
                <p></p>
                <p>矿场</p>
                <img class="message" src="../../assets/img/message.png" alt="" style="display:none;">
            </div>
            <!-- 轮播图 -->
            <banner></banner>
            <!-- 理财收益 -->
            <div class="earnings" @click="$router.push({path:'/property/propertdetail',query:{type:0}})">
                <div class="littit">我的收益</div>
                <div class="earnbox">
                    <img src="../../assets/img/shouyibg.png" alt="">
                    <div class="earncont">
                        <div class="earntop">
                            <p>总收益(USDT)</p>
                            <p>收益记录<van-icon name="arrow"></van-icon></p>
                            
                        </div>
                        <div class="alleari">{{ aeari }} USDT </div>
                        <div class="earnfoot">
                            <p>今日收益：<span class="footnum">{{dayearni}} USDT</span></p>
                            <div class="efoot">
                                <p>日化收益：<span class="footnum">{{daye}}</span></p>
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
            <div class="cut-off90"></div>
            <!-- 我的矿机 -->
            <div class="mymill">
                <div class="littit">
                    <span>我的矿机</span>
                    <span @click="$router.push({path:'/mine/minemy'})">全部<van-icon name="arrow" /></span>
                </div>
                <div class="mymillbox"  @click="$router.push({path:'/mine/minemy'})">
                    <img src="../../assets/img/millbg.png" alt="">
                    <div class="mymillcont">
                        <div class="mmimg">
                            <img src="../../assets/img/kuangji1.png" alt="">
                        </div>
                        <div class="mmparameter">
                            <div class="parmtop">M21S-56T</div>
                            <div class="parmfoot">
                                <p>矿机数量：{{length}} 台</p>
                                <p>今日收益：{{dayearni}} USDT</p>
                            </div>
                            <div class="mmf">详情</div>
                        </div>
                    </div>
                    <div class="mmhint">
                        <img src="../../assets/img/safety.png" alt="">
                        <p>保障中</p>
                    </div>
                </div>
            </div>
            <div class="cut-off90"></div>
            <!-- 收益增长规则 -->
            <div>
                <div class="littit">收益和奖励规则</div>
                <div class="ruled millcont">
                    <p>1. 四种不同算力的云储存矿机，原则上价格不同自身算力也不相同！每种云储存矿机它的计算周期，每日算力都不相同。计算周期到期，机器将自动停止运算服务，只能再次激活后开启！</p>
                    <p>2.平台为增大云储存矿机的算力服务，推出：推广奖励活动，自身开机的同类型云储存矿机推广满7台，次日平台将奖励同类型开机费用！（310U开启一台云储存矿机，推广邀请满7台同类型云储存矿机，次日平台奖励310U）</p>
                </div>
            </div>
        </div>
        <navfoot type='3'></navfoot>
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
            daye:'',//日化收益
             rate:"",
            aeari:'0',//总收益
            dayearni:"0",//当日收益
            milltype:'',
            length:'',//矿机数量
            userinfo:store.get('userinfo'),
        };
    },
    mounted(){
        this.mymachine()
        this.getdayearni()
        this.getallearni()
        this.getrate()
        this.getdaye()
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
        // 获取汇率
        getrate(){
            this.$http.get('/api/exchangeRate/get').then(res=>{
                if(res.data.success == true){
                    this.rate = res.data.result
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err=>{
                localStorage.clear();
                this.$router.push({path:'/login'})
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
        // 获取我的矿机详情
        mymachine(){
           this.$http.post('/api/business/myMachine/query').then(res=>{
                if(res.data.code == 0){
                    this.length = res.data.result.length
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err => {
                localStorage.clear();
                this.$router.push({path:'/login'})
            })
       },

    },
}
</script>
<style scoped>

.head{
    margin: 0 5%;
    width: 90%;
    text-align: center;
    height: 5rem;
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
    color: #000;
    font-size: 1.4rem;
    font-weight: bold;
    line-height: 4rem;
}

/* 理财收益 */
.littit{
    color: #000;
    font-size: 1.4rem;
    font-weight: bold;
    line-height: 4rem;
}
.earnbox {
    position: relative;
    line-height: normal;
    border-radius: 12px;
}
.earnbox > img{
    width: 100%;
    border-radius: 12px;
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


/* 我的矿机 */
.millcont{
    padding: 10px 15px;
    box-shadow: 0 0 10px #ccc;
    border-radius: 12px;
    margin-bottom: 15px;
}
.mymill{
    margin-bottom: 15px;
}
.mymill .littit{
    height: 4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.littit span:last-child{
    font-weight: lighter;
    font-size: 1.2rem;
    color: #666;
    display: inline-flex;
    align-items: center;
}
.mymillbox{
    position: relative;
    line-height: normal;
}
.mymillbox > img{
    width: 100%;
}
.mymillcont{
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    position: absolute;
    z-index: 10;
    padding-top: 10px 0 5px 20px;
    display: flex;
}
.mmhint{
    position: absolute;
    top: 0.8rem;
    right: 0;
    height: 1.8rem;
    border-radius: 20px 0 0 20px;
    background: #6e7179;
    display: flex;
    align-items: center;
    padding:2px 8px;
    color: #fff;
    z-index: 100;
}
.mmhint img{
    height: 1.2rem;
    margin-right: 5px;
}

.mmimg {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40%;
}
.mmimg img{
    width: 90%;
}
.mmparameter{
    width: 60%;
    color: #fff;
}
.parmtop{
    font-size: 1.6rem;
    height: 40%;
    display: flex;
    align-items: center;
}
.parmfoot{
    height: 30%;
    color: #a1a2a7;
}
.parmfoot p{
    line-height: 1.7;
}
.mmf{
    height: 25%;
    color: #a1a2a7;
    font-size: 1.35rem;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding-right: 10px;
}

/* 收益增长规则 */
.ruled{
    min-height: 8rem;
}
.ruled p{
    text-indent: -1em;
    margin-left: 2em;
    margin-bottom: 10px;
}
.ruled p:last-child{
    margin-bottom: 0;
}
</style>