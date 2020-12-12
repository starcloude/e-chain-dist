<template>
    <div class="wrapper pt5rem">
        <!-- 订单信息 -->
        <navbar label="订单信息"></navbar>
        <div class="content ">
            <!-- 产品介绍 -->
           <div class="millcont">
                <div class="milltop">
                    <van-button>现货</van-button>
                    <p>{{ data.code }}</p>
                </div>
                <div class="millmid">
                    <div class="ml">
                        <img src="../../assets/img/kuangji1.png" alt="">
                    </div>
                    <div class="mr">
                            <div class="line"></div>
                            <div class="price">
                                <p>价格</p>
                                <p class="millnum">{{ data.price }} USDT</p>
                                <div>有效期：<span class="millnum">{{data.runningDays}} 天</span></div>
                            </div>
                            <div class="output">
                                <p>每日产出</p>
                                <p class="millnum">{{data.profit}}<span>USDT/24h</span></p>
                            </div>
                        
                    </div>
                </div>
            </div>
           <div class="cut-off"></div>
           <!-- 内容标题 -->
           <div class="conttit">
               <p>产品信息</p>
           </div>
           <!-- 支付信息 -->
           <div class="payinfo">
               <div><p>产品型号：</p> <p>G28S-64T</p></div>
               <div><p>数量：</p> <p class="inp"> 1 台</p></div>
               <div><p>价格：</p> <p>{{ data.price }} USDT</p></div>
               <!-- <div><p>USDT汇率：</p> <p>{{ rate }}</p></div>
               <div><p>实扣USDT：</p> <p>{{ Math.floor((data.price/rate) * 10000) / 10000  }} USDT</p></div> -->
           </div>
           <div class="cut-off"></div>
           <!-- 邀请码 --> 
           <div class="invitecode">
            <p>邀请码</p>
            <p><van-field v-model="invitecode" :disabled='disabled' placeholder="请输入邀请码" ></van-field></p>
           </div>
           <div class="cut-off"></div>
           <!-- 当前余额 -->
           <div class="conttit balance">
               <p>当前余额</p>
               <p>{{balance}}USDT</p>
           </div>
           <!-- 顶部按钮 -->
           <div class="footbtn">
                <van-button class="closebtn" color="#e9e9e9" @click="$router.go(-1)">我再想想</van-button>
                <van-button class="confirmbtn" color="#01a535" @click="onpay">确认支付</van-button>
            </div>
            <!-- 交易密码弹出框 -->
            <dialogpwd ref="diapwd" @onpwd='onconfirm' :disabled="btndisabled"></dialogpwd>
           
            <!-- 购买id跟邀请码获取的id不一致提示弹窗 -->
            <div class="dialog" v-show="idnoequally">
                <div class="dialogcont">
                    <p class="dtit">购买提示</p>
                    <div class="diacont">对不起，您使用的邀请码不能购买该型号产品!是否购买邀请码指定产品？</div>
                    <div class="dbtnbox">
                        <van-button @click="$router.go(-1)" class="dbtn" color="#e9e9e9">我再想想</van-button>
                        <van-button @click="needpbuy" class="dbtn" color="#01a535">我要购买</van-button>
                    </div>
                    <img class="dialogclose" src="../../assets/img/closeicon.png" alt="" @click="idnoequally = false">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import qs from 'qs'
import common from '../../asstic/common'
import dialogpwd from '../../components/dialogpwd'
import navbar from '../../components/navbar'
import * as http from "../../asstic/http.js";
import { Dialog } from 'vant';
export default {
    components:{
        navbar,
        dialogpwd
    },
    data(){
        return{
            btndisabled:false,//按钮禁止连点
            idnoequally:false,//id跟邀请码获取的数据id不一致弹窗
            rate:'',//汇率
            balance:'',
            data:{},
            id:'',
            userinfo:store.get('userinfo'),
            invitecode:'',//邀请码
            disabled:false,
            invitedata:'',//邀请码对应的数据
        };
    },
    mounted(){
        if(store.get('invicode')){
            this.disabled = true
            this.invitecode = store.get('invicode')
        }
      this.id = this.$route.query.id
      this.getmining()
      this.getbalance()
      this.getrate()
    },
    
    methods:{
        // 两个id不一致是要购买
        needpbuy(){
            this.data = this.invitedata
            this.id = this.invitedata.id
            this.idnoequally = false
        },
  
        //获取矿机详情
        getmining(){
            this.$http.get('/api/machine/'+this.id).then(res=>{
                if(res.data.success == true){
                   this.data = res.data.result
                }else{
                    this.$toast(res.data.msg)
                }
            })
        },
        //获取当前余额
        getbalance(){
             this.$http.get('/api/userWallet/getAmount').then(res=>{
                if(res.data.success == true){
                   this.balance = res.data.result.usableAmount
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err => {
            })
        },
        isEmpty(val) {
            return /^\s*$/.test(val);
        },
        // 购买按钮
        onpay(){
            if(this.data.price > this.balance){
                this.$toast('余额不足，购买失败！')
                return false;
            }
            if(this.isEmpty(this.invitecode) && this.userinfo.type != 1){
                this.$toast("邀请码不能为空！")
                return false;
            }
            if(this.userinfo.type == 1 && this.invitecode == ''){
                this.$refs.diapwd.diashow = true
            }else{
                this.$http.get('/api/business/getMachineByCode/'+this.invitecode).then(res=>{
                    if(res.data.success == true && res.data.result != null){
                        this.invitedata = res.data.result
                        if(this.id == this.invitedata.id){
                        this.$refs.diapwd.diashow = true
                        }else{
                            this.idnoequally = true
                        }
                    }else if(res.data.result == null){
                        this.$toast('无效的邀请码，请核对后再输入！')
                    }else{
                        this.$toast(res.data.msg)
                    }
                })
            }
             
            
        },
        // 输入密码确认按钮
        onconfirm(pwd){
            if(this.isEmpty(pwd)){
                this.$toast('密码不能为空！')
                return false;
            }
            this.btndisabled = true
            this.$http.post('/api/business/userMachine/add',qs.stringify({
                machineId:this.data.id,
                code:this.data.code,
                tradePassword:pwd,
                invitedCode:this.invitecode,
            })).then(res=>{
                this.btndisabled = false
                this.$refs.diapwd.diashow = false
                if(res.data.code == 0){
                    if(this.disabled == true){
                        store.remove('invicode')
                    }
                    Dialog.alert({
                    message: '购买成功',
                    })
                    .then(() => {
                       this.$router.push({path:'/mine/mine'})
                    })
                }else if(res.data.code == 2000 && res.data.msg == '未设置交易密码，请先设置!'){
                        this.$toast(res.data.msg)
                        setTimeout(()=>{
                            this.$router.push({path:"/vipcenter/changepassword",query:{state:1}})
                        },500)
                        
                }else if(res.data.code == 2000){
                    
                    this.$toast(res.data.msg)
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err => {
                this.btndisabled = false
                this.$refs.diapwd.diashow = false
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
        pwisshow(){
            if(this.pw == "password"){
                this.pw = ""
            }else{
                this.pw = "password"
            }
        },

    },
}
</script>
<style scoped>

.content{
    padding: 0;
    background: #f9f9f9;
}
/* 产品介绍 */
.millcont{
    margin: 5%;
    padding: 10px 15px;
    box-shadow: 0 0 10px #ccc;
    border-radius: 12px;
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
    width: 25%;
    display: flex;
    justify-content: end;
    align-items: center;
}
.ml img{
    width: 95%;
    margin-left: -5px;
}
.mr{
    color: #8a8c97;
    width: 75%;
    display: flex;
    justify-content: space-between;
    position: relative;
}
.line{
    width:0.8px;
    height: 2.5rem;
    position: absolute;
    top: 2px;
    left: 48%;
    background: #ccc;
}

.millnum{
    color: #ee7f51;
    font-size: 1.25rem;
    margin-bottom: 2px;
    font-weight: bold;
}


/* 内容标题 */
.conttit{
    margin: 5px 5%;
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e8e8e8;
    font-size: 1.25rem;
    color: #2e2d3d;
}


/* 支付信息 */
.payinfo{
    margin:15px 5% 30px 5%;
    font-size: 1.25rem;
}
.payinfo > div{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 3rem;
    line-height: 3rem;
    color: #2e2d3d;
}
.payinfo  .van-cell{
    width: 4rem;
    height: 2.5rem;
    line-height: 2.5rem;
    padding:0.5rem;
    margin-right: 15px;
    background: none;
}
.inp{
    display: flex;
    align-items: center;
}
.inp >>> input{
    text-align: center;
}
/* 邀请码 */
.invitecode {
    font-size: 1.25rem;
    margin:15px 5% 30px 5%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.invitecode .van-cell{
    background: none;
    padding: 10px 0;
}
.invitecode >>> .van-field__control{
    text-align: right;
}
.rf{
    color: #ff0000;
    font-size: 1.25rem;
}
/* 当前余额 */
.balance p:last-child{
    color: #dfae5f;
    font-size: 1.25rem;
}

/* 底部按钮 */
.footbtn{
    width: 90%;
    padding:0 5%;
    height: 6rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.closebtn{
    font-size: 1.35rem;
   width: 45%;
   height: 4rem;
    line-height: 4rem;
   color: #2f2e3e!important;
}
.confirmbtn{
    font-size: 1.35rem;
    width: 45%;
    height: 4rem;
    line-height: 4rem;
}

/*  */
.dialogcont{
        height: calc(30% - 30px);
        display: flex;
        flex-direction: column;
        justify-content: space-around;
}

.dbtnbox{
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.dtit{

    text-align: center;
    font-size: 1.35rem;

}
.diacont{
    font-size: 1.35rem;
}
.dbtnbox button:first-child{
    color: #333!important;
    width: 45%;
}
.dbtnbox button{
    width: 45%;
}
</style>