<template>
    <div class="wrapper pt5rem">
        <!-- 划转 -->
        <navbar label="划转" right="true" state="1"></navbar>
        <div class="content ">
           <h3>币种</h3> 
           <van-dropdown-menu>
               <van-icon class="selecticon" name="arrow-down" />
                <van-dropdown-item v-model="value1" :options="option1" />
            </van-dropdown-menu>

            <h3>划转账号</h3>
            <div class="address lname">
                <van-field v-model="transferuser" placeholder="请输入划转账号" />
            </div>
            <h3 class="counth3">划转数量</h3>
            <div class="address lname ">
                <van-field
                    v-model="transfernum"
                    :placeholder="'最小划转数量'+scharges.minTransferCount"
                    @blur="changefee"
                    >
                    <template #button>
                        <van-button @click="changefee(1)">全部</van-button>
                    </template>
                    </van-field>
            </div>
            <p class="amount">可划转：{{allamount}}USDT</p>
            <h3>手续费 {{fee}}USDT</h3>
            <!-- <div class="scharge">
                <p>注意事项：</p>
                <li><span></span>支持金额</li>
                <li><span></span>提现限制</li>
                <li><span></span>其他说明</li>
            </div> -->
            <van-button class="confirm" color="#00acee" @click="changefee(2)" >确认</van-button>
        </div>
        <dialogpwd ref="diapwd" @onpwd='onconfirm' :disabled="btndisabled" ></dialogpwd>
    </div>
</template>

<script>
import qs from 'qs'
import common from '../../asstic/common'
import navbar from '../../components/navbar'
import * as http from "../../asstic/http.js";
import dialogpwd from '../../components/dialogpwd'
export default {
    components:{
        navbar,
        dialogpwd
    },
    data(){
        return{
            btndisabled:false,//提交按钮禁止连点
            rate:'',//汇率
            scharges:'',//手续费率、上下限等、最小划转数量
            allamount:'',
            fee:'',//手续费
            transferuser:'',
            transfernum:'',
            value1: 0,
            option1: [
                { text: 'USDT', value: 0 },
                { text: 'USDT2', value: 1 },
                { text: 'USDT3', value: 2 },
            ],
            userinfo:store.get('userinfo')
        };
    },
    mounted(){
        this.getservicecharge()
        this.getrate()
    },
    methods:{
        //输入数量计算手续费
        changefee(num){
            if(num == 1){
                this.transfernum = this.allamount 
            }
            if (!/^\d+(?:\.\d{1,4})?$/.test(this.transfernum)) {
                this.transfernum = ''
                this.$toast('划转数量请输入数字且只支持4位小数！')
                return false;
        　　}
            if(Number(this.transfernum) < Number(this.scharges.minTransferCount)){
                this.transfernum = ''
                this.$toast('划转数量不能小于'+this.scharges.minTransferCount)
                return false;
            }else if(common.floatAdd(this.transfernum,this.fee) >= this.allamount){
                this.fee =  Math.floor(common.floatMul(this.allamount,Number(this.scharges.transferRate))* 10000) / 10000
                if(this.fee < this.scharges.minTransferAmount){
                    this.fee = this.scharges.minTransferAmount
                    this.transfernum = Math.floor(common.floatSub(this.allamount,this.fee) * 10000) / 10000
                }else if(this.fee > this.scharges.maxTransferAmount){
                    this.fee = this.scharges.maxTransferAmount
                    this.transfernum = Math.floor(common.floatSub(this.allamount,this.scharges.minTransferAmount)  * 10000) / 10000
                }else{
                    this.transfernum = Math.floor(common.floatSub(this.allamount,this.fee)  * 10000) / 10000
                }
                if(num != 1){ this.$toast('划转数量不能大于可划转数量！')}
            }else{
                this.fee = Math.floor(common.floatMul(this.transfernum,this.scharges.transferRate) * 10000) / 10000
                if(this.fee < this.scharges.minTransferAmount){
                    this.fee = this.scharges.minTransferAmount
                }else if(this.fee > this.scharges.maxTransferAmount){
                    this.fee = this.scharges.maxTransferAmount
                }
            }
            if(num==2){
                this.onconf()
               
            }
            
            
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
        //获取当前余额
        getbalance(){
             this.$http.get('/api/userWallet/getAmount').then(res=>{
                if(res.data.success == true){
                   this.allamount = res.data.result.usableAmount
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err => {
            })
        },
        // 获取划转手续费
        getservicecharge(){
            this.$http.get('/api/transferFee/get').then(res=>{
                if(res.data.success == true){
                    this.fee = res.data.result.minTransferAmount
                    this.scharges = res.data.result
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err=>{
            })
        },
        onconf(){
            if(this.isEmpty(this.transferuser)){
                this.$toast('划转账号不能为空！')
                return false;
            }
            if(this.isEmpty(this.transfernum)){
                this.$toast('划转数量不能为空！')
                return false;
            }
            setTimeout(() => {
               this.$refs.diapwd.diashow = true      
            }, 1000);
            
        },
       // 确认按钮
        onconfirm(pwd){
            // 划转确认按钮
            if(this.isEmpty(pwd)){
                this.$toast('密码不能不能为空！')
                return false;
            }
            this.btndisabled = true
            this.$http.post('/api/business/transfer/add',qs.stringify({
                tradePassword:pwd,
                amount:this.transfernum,
                fee:this.fee,
                toAccount:this.transferuser,
                memo:'',
            })).then(res=>{
                this.btndisabled = false
                this.$refs.diapwd.diashow = false
                if(res.data.success == true){
                    this.$toast('划转成功。')
                    setTimeout(()=>{
                        this.$router.go(-1)
                    },500)
                   
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err=>{
                this.btndisabled = false
                this.$refs.diapwd.diashow = false
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
    padding-bottom: calc(4rem + 20px);
    height: calc(100% - 4rem - 20px);
    min-height: calc(100% - 4rem - 20px);
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
.lname{
    height: 4rem;
    line-height: 4rem;
    border-bottom: 1px solid #e9e9e9;
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

/* 数量 */
.counth3{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.counth3 > span:last-child{
    color: #999;
}

.amount{
    color: #999999;
    height: 3rem;
    line-height: 3rem;
}
/* 手续费 */
.scharge{
    color: #999;
    font-size: 1.25rem;
}

.scharge span{
    margin-right: 5px;
    width: 5px;
    height: 5px;
    background: #999;
    border-radius: 50%;
    display: inline-block;
}
.confirm{
    position: fixed;
    left: 5%;
    margin: 10px 0;
    width: 90%;
    height: 4rem;
    line-height: 4rem;
    font-size: 1.35rem;
    bottom: 0;
}
</style>