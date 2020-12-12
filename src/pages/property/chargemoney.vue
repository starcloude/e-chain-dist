<template>
    <div class="wrapper pt5rem">
        <!-- 充币 -->
        <navbar label="充币" right="true" state='0'></navbar>
        <div class="content ">
           <h3>币种</h3> 
           <van-dropdown-menu>
               <van-icon class="selecticon" name="arrow-down" />
                <van-dropdown-item v-model="value1" :options="option1" />
            </van-dropdown-menu>
            <h3 class="lname">链名称</h3>
            <div class="lname lbtn">
                <van-button v-for="(item,i) in btns" :key="i" :class="{active:activebtn == i}" @click="activebtn = i,getadress()">{{item}}</van-button>
            </div>
            <h3>数量</h3>
            <div class="address lname">
                <van-field
                    v-model="cbnum"
                    placeholder="充币数量"
                    
                    >
                    </van-field>
            </div>
            <h3>交易流水号</h3>
            <div class="address lname">
                <van-field
                    v-model="serialnum"
                    placeholder="输入流水号"
                    >
                    </van-field>
            </div>
    
            <p class="cbaddress"><span>充币地址：</span> <span> {{cbaddr}}</span></p>
            <van-button class="copybtn" color="#00acee" :data-clipboard-text="cbaddr" @click="oncopy">复制充币地址</van-button>
            <!-- <div class="scharge">
                <p>注意事项：</p>
                <li><span></span>需要12个网络确认才能到账，任何非ERC20_USDT资产充值到ERC20_USDT地址后不可找回。</li>
                <p>其他说明</p>
            </div> -->
            <div class="footbtn">
                <van-button class="closebtn" color="#e9e9e9" @click="$router.go(-1)">取消充币</van-button>
                <van-button class="confirmbtn" color="#01a535" :disabled="btndisabled" @click="onconfirm">我已支付，请确认</van-button>
            </div>
            
        </div>
    </div>
</template>

<script>
import qs from 'qs'
import common from '../../asstic/common'
import navbar from '../../components/navbar'
import * as http from "../../asstic/http.js";
import Clipboard from "clipboard";
export default {
    components:{
        navbar
    },
    data(){
        return{
            btndisabled:false,//提交按钮禁止连点
            rate:"",//汇率
            activebtn:0,
            // btns:['ERC20','TRC20','OMNI'],
            btns:['ERC20'],
            addresslink:'',
            cbnum:'',
            serialnum:'',
            value1: 0,
            cbaddr:'',
            option1: [
                { text: 'USDT', value: 0 },
                { text: 'USDT2', value: 1 },
                { text: 'USDT3', value: 2 },
            ],
            userinfo:store.get('userinfo')
        };
    },
    mounted(){
        this.getrate()
        this.getadress()
    },
    methods:{

        isEmpty(val) {
            return /^\s*$/.test(val);
        },
        // 获取充币地址
        getadress(){
            this.cbaddr = ''
            this.$http.get('/api/usdtWallet/getBase?chain='+this.btns[this.activebtn]).then(res=>{
                if(res.data.success == true){
                    this.cbaddr = res.data.result
                }else{
                    this.$toast(res.data.msg)
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
        // 充币确认按钮
        onconfirm(){
            if(this.isEmpty(this.cbnum)){
                this.$toast('数量不能为空！')
                return false;
            }
            if (!/^\d+(?:\.\d{1,4})?$/.test(this.cbnum)) {
                this.$toast('数量请输入数字且只支持4位小数！')
                return false;
        　　}
            if(this.isEmpty(this.serialnum)){
                this.$toast('交易流水号不能为空！')
                return false;
            }
            this.btndisabled = true
            this.$http.post('/api/business/recharge/add',qs.stringify({
                usdt:this.cbnum,
                chain:this.btns[this.activebtn],
                address:this.cbaddr,
                serialNo:this.serialnum,
                memo:'',
            })).then(res=>{
                this.btndisabled = false
                if(res.data.success == true){
                    this.$toast('提交成功！')
                    setTimeout(()=>{
                        this.$router.go(-1)
                    },500)
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err=>{
                this.btndisabled = false
            })
        },
        oncopy(){
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

.content{
    min-height: calc(100% - 5rem - 20px)!important;
    height: calc(100% - 5rem - 20px)!important;
    padding: 0 8%;
    padding-bottom: calc(5rem + 20px);
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
.active{
     background: #e9e9e9!important;
    border: 1px solid #333!important;
    color: #333!important;
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
/* 充币地址 */
.cbaddress span:first-child{
    width: 6rem;
}
.cbaddress span:last-child{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: calc(100% - 6rem);
}
.cbaddress{
    width: 90%;
    margin-left: 5%;
    height: 4rem;
    line-height: 4rem;
    display: flex;
    align-items: center;
}
.copybtn{
    width: 90%;
    margin-left: 5%;
    height: 4rem;
    line-height: 4rem;
    font-size: 1.35rem;
    color: #fff;
    border-radius: 2px;
}
/* 手续费 */
.scharge{
    margin-top: 15px;
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
/* 底部按钮 */
.footbtn{
    background: #fff;
    padding: 10px 0;
    position: fixed;
    bottom: 0;
    width: 90%;
    left: 5%;
    height: 5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
}
.closebtn{
    font-size: 1.35rem;
   width: 37%;
  height: 4rem;
    line-height: 4rem;
   color: #2f2e3e!important;
}
.confirmbtn{
    font-size: 1.35rem;
    width: 60%;
    height: 4rem;
    line-height: 4rem;
}
</style>