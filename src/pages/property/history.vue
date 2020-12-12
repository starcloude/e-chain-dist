<template>
    <div class="wrapper pt5rem">
        <!-- 历史记录 -->
        <navbar :label="title"></navbar>
        <div class="content ">
            <!-- 筛选条件 -->
            <div class="filtrate">
                <van-dropdown-menu @change="ontime">
                    <van-dropdown-item v-model="stateval" :options="state == 0?states:states1" @change="change()" v-if="state != 1"/>
                    <van-dropdown-item title="时间起" @open="ontime"/>
                    <van-dropdown-item title="时间止"  @open="timedialog = true,time = 2"/>
                </van-dropdown-menu>
            </div>
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了!"
                @load="load"
                offset="5"
                :immediate-check="false"
                v-if="showdata"
                >
                <div class="contbox">
                    <!-- 充币 -->
                    <div class="chargem" v-for="(item,i) in datas" :key="i" @click="$router.push({path:'/property/detailinfo',query:{id:item.id,state:state}})">
                        <div class="ctop" >
                            <p>
                                <span>类型：</span>
                                <span v-show="state == 0" class="chargemtit">充币</span>
                                <span v-show="state == 2" class="chargemtit">提币</span>
                                <span v-show="state == 1" class="chargemtit">划转</span>
                            </p>
                            <p v-if="state != 1">
                                <span>状态：</span>
                                <span v-show="item.state == 0"><span v-show="state == 0">充值中</span><span v-show='state == 2'>提币中</span> </span>
                                <span v-show="item.state == 1">成功</span>
                                <span v-show="item.state == 2">失败</span>
                            </p>
                        </div>
                        <div class="cmil">
                            <p><span>时间：</span><span>{{ item.createTime }}</span></p>
                            <p>
                                <span>数量：</span>
                                <span  v-if="state == 1">{{ item.amount }} USDT</span> 
                                <span  v-else>{{ item.usdt }} USDT</span>
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
            title:'',
            state:0,//0充币1划转2提币
            finished: false,
            loading: false,
            showdata:true,
            datas:[ ],
            startt:'',
            endt:'',
            time:1,//1时间起2时间止
            timedialog:false,
            minDate: new Date(2020, 0, 1),
            maxDate: new Date(2025, 10, 1),
            currentDate: new Date(),
            stateval: '',
            states: [
                { text: '状态', value: '' },
                { text: '充值中', value: '0' },
                { text: '成功', value: '1' },
                { text: '失败', value: '2' },
            ],
            states1: [
                { text: '状态', value: '' },
                { text: '提币中', value: '0' },
                { text: '成功', value: '1' },
                { text: '失败', value: '2' },
            ],
            userinfo:store.get('userinfo'),
            dataListCurrPage: 0, //当前页码
            dataListSize: 6, //一页显示多少条数据
        };
    },
    mounted(){
        //3收益
        this.state= this.$route.query.state
        if(this.state == 0){
            this.title = '充币记录' 
            this.getdata1()
        }else if(this.state == 1){
            this.title = '划转记录'
            this.getdata2()
        }else{
            this.title = '提币记录' 
            this.getdata3()
        }
    },
    methods:{
        // 改变筛选条件
        change(){
            this.dataListCurrPage= 0
            this.finished = false
            this.loading = false
            this.showdata = true
            this.datas = []
            this.load()
        },
        //加载多条数据加载
        load(){
            if(this.state == 0){
                this.getdata1()
            }else if(this.state == 1){
                this.getdata2()
            }else{
                this.getdata3()
            }
        },
        // 获取充值记录
        getdata1(){
            this.loading = true
            this.dataListCurrPage++;
            this.$http.post('/api/business/recharge/query',qs.stringify({
                chain:'',
                address:'',
                state:this.stateval,
                serialNo:'',
                createTime:this.startt,
                createTimeEnd:this.endt,
                pageSize:this.dataListSize,
                pageNo:this.dataListCurrPage,
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
                localStorage.clear();
                this.$router.push({path:'/login'})
                this.finished = true;
                this.loading = false;
            })
        },
        //获取划转记录
        getdata2(){
            this.loading = true
            this.dataListCurrPage++;
            this.$http.post('/api/business/transfer/query',qs.stringify({
                // toUserId:null,
                // toAccount:'',
                createTime:this.startt,
                createTimeEnd:this.endt,
                pageSize:this.dataListSize,
                pageNo:this.dataListCurrPage,
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
                localStorage.clear();
                this.$router.push({path:'/login'})
                this.finished = true;
                this.loading = false;
            })
        },
        // 获取提现记录
        getdata3(){
            this.loading = true
            this.dataListCurrPage++;
            this.$http.post('/api/business/cashOut/query',qs.stringify({
                // chain:'',
                // address:'',
                state:this.stateval,
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
                localStorage.clear();
                this.$router.push({path:'/login'})
                this.finished = true;
                this.loading = false;
            })
        },
        ontime(){
            this.timedialog = true,this.time = 1
        },
        //   时间选择确认
        onConfirm(time){
            if(this.time == 1){
                this.startt = common.getindata(time)
            }else{
                this.endt = common.getindata(time).replace("00:00:00",'23:59:59')
            }
            this.timedialog = false
            this.change()
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