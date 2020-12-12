<template>
    <div class="wrapper pt5rem">
        <!-- 资产明细 -->
        <navbar label="资产明细"></navbar>
        <div class="content ">
            <!-- 筛选条件 -->
            <div class="filtrate">
                <van-dropdown-menu >
                    <van-dropdown-item v-model="typeval" :options="types" @change="change"/>
                    <van-dropdown-item title="时间起" @open="ontime"/>
                    <van-dropdown-item title="时间止"  @open="timedialog = true,time = 2"/>
                </van-dropdown-menu>
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
                <div class="contbox">
                    <!-- 资产明细 -->
                    <div class="chargem" v-for="(item,i) in datas" :key="i">
                        <div class="ctop" >
                            <p>
                                <span>类型：</span>
                                <span v-show="item.type == 0" class="chargemtit">收益</span>
                                <span v-show="item.type == 1" class="chargemtit">订单</span>
                                <span v-show="typeval == 2 || item.type == 2" class="chargemtit">划转</span>
                                <span v-show="typeval == 3 || item.type == 3" class="chargemtit">充值</span>
                                <span v-show="typeval == 4 || item.type == 4" class="chargemtit">提现</span>
                                <span v-show="item.type == 5" class="chargemtit">返现</span>
                            </p>
                        </div>
                        <div class="cmil">
                            <p><span>时间：</span><span>{{ item.createTime }}</span></p>
                            <p>
                                <span>数量：</span>
                                <span v-if="typeval == 0 || typeval == 3 || typeval == 5" class="cgreen">+{{ yMinus(item.amount) }} </span>
                                <span v-else-if="typeval == 1 || typeval == 4" class="cred">{{ nMinus(item.amount) }} </span>
                                <span v-else-if="typeval == 2 && item.amount >= 0" class="cgreen">+{{ item.amount }} </span>
                                <span v-else-if="typeval == 2 && item.amount < 0" class="cred">{{ item.amount }} </span>USDT
                            </p>
                        </div>
                        <div class="cright">
                            <van-icon name="arrow"></van-icon>
                        </div>
                    </div>
                </div>
            </van-list>
            <div class="nodata" v-else>暂无数据！</div>
                <!-- 时间选择器 -->
                <van-popup v-model="timedialog" position="bottom">
                    <van-datetime-picker
                        v-model="currentDate"
                        @confirm="onConfirm"
                        @cancel="timedialog = false"
                        type="datetime"
                        :title="time == 1?'选择开始时间':'选择截止时间'"
                        :min-date="minDate"
                        :max-date="maxDate"
                    />
                </van-popup>
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
            finished: false,
            loading: false,
            showdata:true,
            datas:[],
            startt:'',
            endt:'',
            time:1,//1时间起2时间止
            timedialog:false,
            minDate: new Date(2020, 0, 1),
            maxDate: new Date(2025, 10, 1),
            currentDate: new Date(),
            typeval:0,
            types: [
            ],
            userinfo:store.get('userinfo'),
            dataListTotal: 0, //数据总量
            dataListCurrPage: 0, //当前页码
            dataListSize: 6, //一页显示多少条数据
            dataListCurrPage1: 0 //刷新时的页码
        };
    },
    mounted(){
        //0收益
        if(this.$route.query.type){
            this.typeval = Number(this.$route.query.type)
        }
        this.gettype()
        this.getdata()
    },
    methods:{
        // 查询数据带有负号就取消
        yMinus(num){
            if(num < 0){
                let n = num.toString()
                return n.replace('-','')
            }else{
                return num
            }
  
        },
        // 查询数据没有负号就加负号
        nMinus(num){
            if(num > 0){
                return '-'+num
            }else{
                return num
            }

        },
        // 获取资金变动类型
        gettype(){
            this.$http.get('/api/changeType/select').then(res=>{
                if(res.data.success == true){
                    for (let i = 0; i < Object.values(res.data.result).length; i++) {
                        // 不展示提成
                        if(res.data.result[i] != '提成'){
                            var j = {}
                            j.text = res.data.result[i]
                            j.value = i
                            this.types.push(j)
                        }
                    }
                }
            }).catch(err=>{
                localStorage.clear();
                this.$router.push({path:'/login'})
            })
        },
        // 获取缴费明细
        getdata(){
            this.loading = true
            this.dataListCurrPage++;
            this.$http.post('/api/business/walletLog/query',qs.stringify({
                type:this.typeval,
                createTime:this.startt,
                createTimeEnd:this.endt,
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
        ontime(){
            this.timedialog = true,this.time = 1
        },
        change(){
            this.dataListCurrPage= 0
            this.finished = false
            this.loading = false
            this.showdata = true
            this.datas = []
            // if(this.typeval == 2){
            //     //划转
            //     this.getdata2()
            // }else if(this.typeval == 3){
            //     //充值
            //     this.getdata1()
            // }else if(this.typeval == 4){
            //     // 提现
            //     this.getdata3()
            // }else{
            //     this.getdata()
            // }
            this.getdata()
            
        },
        // 获取充值记录
        // getdata1(){
        //     this.loading = true
        //     this.dataListCurrPage++;
        //     this.$http.post('/api/business/recharge/query',qs.stringify({
        //         chain:'',
        //         address:'',
        //         state:1,
        //         serialNo:'',
        //         createTime:this.startt,
        //         createTimeEnd:this.endt,
        //         pageSize:this.dataListSize,
        //         pageNo:this.dataListCurrPage,
        //     })).then(res=>{
        //         this.loading = false;
        //         if(res.data.success == true){
        //             if(res.data.result.length == 0){
        //                 this.showdata = false
        //             }else{
        //                 this.showdata = true
        //                 var count = res.data.total;
        //                 if (this.dataListCurrPage === 1) {
        //                     this.datas = res.data.result;
        //                 } else {
        //                     this.datas = this.datas.concat(res.data.result);
        //                 }
                        
        //                 if (this.dataListCurrPage * this.dataListSize >= count) {
        //                     this.finished = true;
        //                 }
        //             }
        //         }else{
        //             this.$toast(res.data.msg)
        //         }
        //     }).catch(err=>{
        //         localStorage.clear();
        //         this.$router.push({path:'/login'})
        //         this.finished = true;
        //     })
        // },
        //获取划转记录
        // getdata2(){
        //     this.loading = true
        //     this.dataListCurrPage++;
        //     this.$http.post('/api/business/transfer/query',qs.stringify({
        //         // toUserId:null,
        //         // toAccount:'',
        //         createTime:this.startt,
        //         createTimeEnd:this.endt,
        //         pageSize:this.dataListSize,
        //         pageNo:this.dataListCurrPage,
        //     })).then(res=>{
        //         this.loading = false;
        //         if(res.data.success == true){
        //             if(res.data.result.length == 0){
        //                 this.showdata = false
        //             }else{
        //                 this.showdata = true
        //                 var count = res.data.total;
        //                 if (this.dataListCurrPage === 1) {
        //                     this.datas = res.data.result;
        //                 } else {
        //                     this.datas = this.datas.concat(res.data.result);
        //                 }
                        
        //                 if (this.dataListCurrPage * this.dataListSize >= count) {
        //                     this.finished = true;
        //                 }
        //             }
        //         }else{
        //             this.$toast(res.data.msg)
        //         }
        //     }).catch(err=>{
        //         localStorage.clear();
        //         this.$router.push({path:'/login'})
        //         this.finished = true;
        //         this.loading = false;
        //     })
        // },
        // 获取提现记录
        // getdata3(){
        //     this.loading = true
        //     this.dataListCurrPage++;
        //     this.$http.post('/api/business/cashOut/query',qs.stringify({
        //         // chain:'',
        //         // address:'',
        //         state:1,
        //         createTime:this.startt,
        //         createTimeEnd:this.endt,
        //         pageSize:this.dataListSize,
        //         pageNo:this.dataListCurrPage,
        //     })).then(res=>{
        //         if(res.data.success == true){
        //              this.loading = false;
        //             if(res.data.result.length == 0){
        //                 this.showdata = false
        //             }else{
        //                 this.showdata = true
        //                 var count = res.data.total;
        //                 if (this.dataListCurrPage === 1) {
        //                     this.datas = res.data.result;
        //                 } else {
        //                     this.datas = this.datas.concat(res.data.result);
        //                 }
                       
        //                 if (this.dataListCurrPage * this.dataListSize >= count) {
        //                     this.finished = true;
        //                 }
        //             }
        //         }else{
        //             this.$toast(res.data.msg)
        //         }
        //     }).catch(err=>{
        //         localStorage.clear();
        //         this.$router.push({path:'/login'})
        //         this.finished = true;
        //         this.loading = false;
        //     })
        // },
        //   时间选择确认
        onConfirm(time){
            if(this.time == 1){
                this.startt = common.getindata(time)
            }else{
                this.endt = common.getindata(time)
                
            }
            this.change()
            this.timedialog = false
        },


    },
}
</script>
<style scoped>

.content{
    padding: 0;
}
/* 筛选 */
.filtrate{
    border-top: 1px solid #e1e1e1;
    position: fixed;
    width: 100%;
    z-index: 100;
    margin-top: 1px;
}

/* 明细列表 */
.contbox{
    margin-top: 48px;
    background: #fff;
    padding: 0 8%;
}

.contbox > div{
    border-bottom: 1px solid #e1e1e1;
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.contbox > div > div:first-child{
    width: 30%;
    border-right: 1px solid #e1e1e1;
}
p{
    font-size: 1.15rem;
    height: 2.5rem;
    line-height: 2.5rem;
}
i{
    font-size: 1.5rem;
    color: #e1e1e1;
}
p span:first-child{
    color: #b4b4b6;
}

.chargemtit{
    color:#001fd6;
}
.mentionmtit{
    color:#04ad00;
}
.filtrate >>> .van-dropdown-menu__bar{
    padding-right: 5%;
}
.nodata{
    margin-top: 20%;
}

</style>