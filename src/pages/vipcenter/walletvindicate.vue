<template>
    <div class="wrapper pt5rem">
        <!-- 钱包维护 -->
        <navbar label="钱包维护"></navbar>
        <div class="content ">
           <h3 class="lname">链名称</h3>
            <div class="lname lbtn">
                <van-button v-for="(item,i) in btns" :key="i" :class="{active:activebtn == i}" @click="activebtn = i,getadress()">{{item}}</van-button>
            </div>
            <!-- 钱包地址 -->
            <h3 class="lname">钱包地址</h3>
             <van-field v-model="walletaddress" placeholder="请输入钱包地址" class="lbtn"/>

             <van-button color="#03a9e7"  class="savbtn" @click="onsave">保存</van-button>
        </div>
        <dialogpwd ref="diapwd" @onpwd='savebtn'></dialogpwd>
    </div>
</template>

<script>
import qs from 'qs'
import common from '../../asstic/common'
import navbar from '../../components/navbar'
import dialogpwd from '../../components/dialogpwd'
import * as http from "../../asstic/http.js";
export default {
    components:{
        navbar,
        dialogpwd
    },
    data(){
        return{
            activebtn:0,
            // btns:['ERC20','TRC20','OMNI'],
            btns:['ERC20'],
            walletaddress:"",
            userinfo:store.get('userinfo')
        };
    },
    mounted(){
        this.getadress()
    },
    methods:{
        // 获取钱包地址
        getadress(){
            this.walletaddress = ''
            this.$http.get('api/business/usdtWallet/get?chain='+this.btns[this.activebtn]).then(res=>{
                if(res.data.success == true){
                    this.walletaddress = res.data.result[0].address
                }else{
                    this.$toast(res.data.msg)
                }
            })
        },
        onsave(){
            if(this.isEmpty(this.walletaddress)){
                this.$toast('钱包地址不能为空！')
                return false;
            }
            this.$refs.diapwd.diashow = true
        },
        //保存钱包地址
       savebtn(pwd){
           if(this.isEmpty(pwd)){
                this.$toast('交易密码不能为空！')
                return false;
            }
            this.$http.post('/api/business/usdtWallet/save',qs.stringify({
                chain:this.btns[this.activebtn],
                address:this.walletaddress,
                tradePassword:pwd,
            })).then(res=>{
                 this.$refs.diapwd.diashow = false
                if(res.data.success == true){

                    this.$toast('保存成功！')
                    setTimeout(()=>{
                        this.$router.push({path:'/vipcenter/my'})
                    },500)
                    
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err=>{
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


.lname{
    height: 4rem;
    line-height: 4rem;
    
}
.lbtn{
    border-bottom: 1px solid #e9e9e9;
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
.savbtn{
    margin-top: 5rem;
    height: 4rem;
    line-height: 4rem;
    width: 100%;
    font-size: 1.35rem;
}
</style>