<template>
    <div class="wrapper pt5rem">
        <!-- 提币 -->
        <navbar label="提币" right="true" state='2'></navbar>
        <div class="content ">
           <h3>币种</h3> 
           <van-dropdown-menu>
               <van-icon class="selecticon" name="arrow-down" />
                <van-dropdown-item v-model="value1" :options="option1" />
            </van-dropdown-menu>
            <h3 class="lname">链名称</h3>
            <div class="lname lbtn">
                <van-button v-for="(item,i) in btns" :key="i" :class="{active:activebtn == i}" @click="getadress(i)">{{item}}</van-button>
            </div>
            <h3>提币地址</h3>
            <div class="address lname">
                <van-field
                    v-model="addresslink"
                    placeholder="长按粘贴或手动输入"
                    disabled
                    >
                    </van-field>
            </div>
            <h3 class="counth3"><span>数量</span><span>余额：<span class="yenum">{{balance}} USDT</span></span></h3>
            <div class="address lname ">
                <van-field
                    v-model="tbnum"
                    :placeholder="'最小提币数量'+scharges.minCashOutCount"
                    @blur="changerate"
                    >
                    <template #button>
                        <van-button @click="changerate(1)">全部</van-button>
                    </template>
                    </van-field>
            </div>
            <p class="amount">可提币：{{ balance }}USDT</p>
            <h3>手续费 {{ fee }} USDT</h3>
            <van-button class="confirm" color="#00acee" @click="changerate(2)" :disabled="btndisabled1">确认</van-button>
        </div>
        <!-- 提示弹窗 -->
        <div class="dialog" v-show="dialog">
            <div class="dialogcont">
                <div class="diacont">由于您的活跃度不足，本次提现只能到账提现数量的一半，冻结另一半。当您有至少一台机器挂满子机后系统会自动解冻，解冻后方可全部提现。是否继续本次提现？</div>
                <div class="dbtnbox">
                    <van-button @click="$router.go(-1)" class="dbtn" color="#e9e9e9">我再想想</van-button>
                    <van-button @click="changerate(3)" class="dbtn" color="#01a535" :disabled="btndisabled2">继续提现</van-button>
                </div>
                <img class="dialogclose" src="../../assets/img/closeicon.png" alt="" @click="dialog = false">
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
            btndisabled1:false,//提交按钮禁止连点
            btndisabled2:false,//提交按钮禁止连点
            dialog:false,//当前用户没有挂满子机的主机有弹窗
            balance:'',//全部金额
            fee:'',//手续费
            rate:'',//汇率
            scharges:'',//手续费率
            activebtn:0,
            // btns:['ERC20','TRC20','OMNI'],
            btns:['ERC20'],
            addresslink:'',
            tbnum:'',
            value1: 0,
            option1: [
                { text: 'USDT', value: 0 },
                { text: 'USDT2', value: 1 },
                { text: 'USDT3', value: 2 },
            ],
            userinfo:store.get('userinfo'),
        };
    },
    mounted(){
        this.getrate()
        this.getservicecharge()
        this.getadress(this.activebtn)
    },
    methods:{
        // 获取当前用户是否挂满子机
        getsubcomp(){
            this.$http.get('/api/business/getIsMachineReturned').then(res=>{
                if(res.data.success == true){
                    let d = res.data.result
                    if(d <= 0){
                        this.dialog = true
                    }else if(d >= 1){
                        this.changerate(3)
                    }
                }else{
                    this.$toast(res.data.msg)
                }
            })
        },
        // 获取钱包地址
        getadress(i){
            this.activebtn = i
            this.addresslink = ''
            this.$http.get('api/business/usdtWallet/get?chain='+this.btns[this.activebtn]).then(res=>{
                if(res.data.success == true){
                    if(res.data.result == ''){
                        this.$router.push({path:'/vipcenter/walletvindicate'})
                        this.$toast('无法获取到您的'+ this.btns[this.activebtn] +'钱包地址，请先设置钱包地址！')
                    }
                    this.addresslink = res.data.result[0].address
                }else{
                    this.$toast(res.data.msg)
                }
            })
        },
        // 获取提现手续费
        getservicecharge(){
            this.$http.get('/api/cashOutFee/get').then(res=>{
                if(res.data.success == true){
                    this.fee = res.data.result.minCashOutAmount
                    this.scharges = res.data.result
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
                    this.getbalance()
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err=>{
                localStorage.clear();
                this.$router.push({path:'/login'})
            })
        },
        // 输入数量计算金额及手续费
        changerate(num){
            if(num == 1){
                this.tbnum = this.balance
            }

            if (!/^\d+(?:\.\d{1,4})?$/.test(this.tbnum)) {
                this.$toast('提币数量请输入数字且只支持4位小数！')
                return false;
        　　}
            if(Number(this.tbnum) < Number(this.scharges.minCashOutCount)){
                this.tbnum = ''
                this.$toast('提币数量不能小于'+this.scharges.minCashOutCount+'!')
                return false;
            }else if(common.floatAdd(this.tbnum,this.fee) >= this.balance){
                this.fee =  Math.floor(common.floatMul(this.balance,this.scharges.cashOutRate)* 10000) / 10000
                if(this.fee < this.scharges.minCashOutAmount){
                    this.fee = this.scharges.minCashOutAmount
                    this.tbnum = Math.floor(common.floatSub(this.balance,this.fee) * 10000) / 10000
                }else if(this.fee > this.scharges.maxCashOutAmount){
                    this.fee = this.scharges.maxCashOutAmount
                    this.tbnum = Math.floor(common.floatSub(this.balance,this.scharges.minCashOutAmount)  * 10000) / 10000
                }else{
                    this.tbnum = Math.floor(common.floatSub(this.balance,this.fee)  * 10000) / 10000
                }
                if(num != 1){
                    this.$toast('提币数量不能大于余额！')
                }
            }else{
                this.fee = Math.floor(common.floatMul(this.tbnum,this.scharges.cashOutRate) * 10000) / 10000
                if(this.fee < this.scharges.minCashOutAmount){
                    this.fee = this.scharges.minCashOutAmount
                }else if(this.fee > this.scharges.maxCashOutAmount){
                    this.fee = this.scharges.maxCashOutAmount
                }
            }
            if(num == 2){
                if(this.isEmpty(this.addresslink)){
                    this.$toast('提币地址不能为空！')
                    return false;
                }
                if(this.isEmpty(this.tbnum)){
                    this.$toast('提币数量不能为空！')
                    return false;
                }
                this.btndisabled1 = true
                setTimeout(()=>{
                    this.getsubcomp()
                },1000)
            }
            if(num == 3){
                this.btndisabled2 = true
                 setTimeout(()=>{
                    this.onconfirm()
                },1000)
            }
            
        },
     
        //获取余额
        getbalance(){
            this.$http.get('/api/userWallet/getAmount').then(res=>{
                if(res.data.success == true){
                    this.balance = res.data.result.usableAmount
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err=>{
            })
        },
        // 提币确认按钮
         onconfirm(){
            // 提币确认按钮
            this.$http.post('/api/business/cashOut/add',qs.stringify({
                usdt:this.tbnum,
                fee:this.fee,
                chain:this.btns[this.activebtn],
                address:this.addresslink,
                memo:'',
            })).then(res=>{
                this.btndisabled1 = false
                this.btndisabled2 = false
                if(res.data.success == true){
                    this.$toast('提币申请成功，请耐心等待平台审核!')
                    setTimeout(()=>{
                         this.$router.go(-1)
                    },500)
                   
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err=>{
                this.btndisabled1 = false
                this.btndisabled2 = false
            })
           
        },
        isEmpty(val) {
            return /^\s*$/.test(val);
        },

    },
}
</script>
<style scoped>

.content{
    padding: 0 8%;
    padding-bottom:calc(4rem + 20px) ;
    height: calc(100% - 4rem - 20px)!important;
    min-height: calc(100% - 4rem - 20px)!important;
}

h3{
    height: 4rem;
    line-height: 4rem;
    font-size: 1.25rem;
}
/* 下拉框 */

.van-dropdown-menu {
    width: 100%;
    background: rgba(0, 0, 0, 0);
    position: relative;
}
.van-dropdown-menu >>> .van-cell::after{
    left: 0;
    right: 0;
}
.van-dropdown-menu >>> .van-dropdown-item__content{
    width: 84%;
    padding: 0 8%;
}
.van-dropdown-menu >>> .van-cell{
    padding: 10px 0;
}
.van-dropdown-menu >>> .van-cell__title , .van-dropdown-menu >>> .van-ellipsis{
    font-size: 1.25rem;
}
.van-dropdown-menu >>> .van-dropdown-menu__title{
    padding: 0 ;
}
.van-dropdown-menu >>> .van-dropdown-menu__bar{
    background: rgba(0, 0, 0, 0);
    box-shadow:none;
    height: 5rem;
    line-height: 5rem;
}
.van-dropdown-menu >>> .van-dropdown-menu__item{
    justify-content: space-between;
    border-bottom: 1px solid #e9e9e9;
}
.van-dropdown-menu >>> .van-dropdown-menu__title::after{
    display: none;
}
.van-dropdown-menu >>> .van-dropdown-menu__title--active,.van-dropdown-menu >>> .van-dropdown-item__option--active{
    color: #333;
}
.van-dropdown-menu >>> .van-cell__value{
    display: none;
}
.selecticon{
    color: #999;
    font-size: 1.5rem;
    height: 2rem;
    position: absolute;
    right: 10px;
    top: 1.5rem;
}
/* 链名称 */
.lname{
    height: 4rem;
    line-height: 4rem;
    border-bottom: 1px solid #e9e9e9;
}
.lbtn{
    padding: 5px 0;
}
.lbtn button{
    color: #e9e9e9;
    background: #fff;
    border: 1px solid #e9e9e9;
    border-radius:20px;
    margin-right: 10px;
    height: 2.5rem;
    line-height: 2.5rem;
}
.address .van-cell{
    height: 4rem;
    line-height: 4rem;
    padding: 10px 0;
}
.address button{
    border: none;
    height: 2rem;
    border-left: 1px solid #e9e9e9;
}
.address img{
    height: 2rem;
}
.active{
     background: #e9e9e9!important;
    border: 1px solid #333!important;
    color: #333!important;
}
/* 数量 */
.counth3{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.counth3 > span:last-child{
    color: #999;
}
.yenum{
    color:#d7b16c;
}
.amount{
    color: #999999;
    height: 3rem;
    line-height: 3rem;
}
.confirm{
    position: fixed;
    margin: 10px 0;
    width: 90%;
    left: 5%;
    bottom: 0;
    height: 4rem;
    line-height: 4rem;
    font-size: 1.35rem;
}
/* 弹窗 */
.dialogcont{
        height: auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
}

.dbtnbox{
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.diacont{
    text-indent: 2em;
    margin-top: 10;
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