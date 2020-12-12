<template>
    <div class="wrapper pt5rem">
        <!-- 我的矿场 -->
        <navbar label="我的矿场"></navbar>
        <div class="content ">
           
            <!-- 我的矿机 -->
            <div class="mymill">
                <div class="littit">我的矿机({{length}}台)</div>
                <div class="mymillbox" v-for="(item,i) in mills" :key="i"  >
                        <div class="mmimg" @click="onparent(item)">
                            <img :src="httpUrl+ '/api/file/d/'+item.icon" alt="" v-if="item.icon != undefined">
                            <p v-else class="noimg">暂无图片</p>
                        </div>
                        <div class="mmparameter">
                            <div class="mmtop">
                                <p class="parmtop">
                                    <span class="ptops">[邀请码：{{item.invitedCode}}]</span>
                                    <van-button  color="#ee7f51" @click="oncopy" :class="item.state == 2 || item.state == 3 ? 'clasdisabled copybtn' : 'copybtn' " :disabled="item.state == 2 || item.state == 3" :data-clipboard-text="item.invitedCode">复制</van-button>
                                </p>
                            </div>
                            <div class="mmmid" @click="onparent(item)">
                                <div class="midleft">
                                    <p class="parmfoot">每日产出</p>
                                    <p class="parmnum">{{item.profit}}<span>USDT/24h</span></p>
                                     <p>有效期至：{{item.endTime.slice(0,10)}}</p>
                                </div>
                                <div class="midright">
                                    <van-icon name="arrow" />
                                </div>
                            </div>
                            <div class="mmfoot">
                                <p class="ptops"  @click="onparent(item)">
                                    <span v-if="item.state == 0">待支付0 </span>
                                    <span v-if="item.state == 1">运行中</span>
                                    <span style="color:red;" v-if="item.state == 2">已停止</span>
                                    <span style="color:red;" v-if="item.state == 3">购买失败</span>
                                </p>
                                <van-button :class="item.state == 2 || item.state == 3 ? 'clasdisabled sharebtn' : 'sharebtn' " :disabled="item.state == 2 || item.state == 3" @click="onshare()" type="info" :data-clipboard-text="httpUrl+'/#/index/index?invicode='+item.invitedCode">分享</van-button>
                            </div>
                        </div>
                        
                </div>
            </div>
        </div>
        <!-- 下级弹出框 -->
        <div class="dialog" v-show="diaagency">
            <div class="dialogcont">
                <div class="dtit">
                        [{{parentinvite}}]
                    <span v-if="parentstate == 0">支付中</span>
                    <span v-if="parentstate == 1">运行中</span>
                    <span style="color:red;" v-if="parentstate == 2">已停止</span>
                    (子机数量:{{childnum}} 台)
                </div>
                <div class="dialogli" v-if="subordinates.length > 0">
                    <div class="dmymillbox mymillbox" v-for="(item,i) in subordinates" :key="i" >
                        <div class="mmimg">
                                <img :src="httpUrl+ '/api/file/d/'+item.icon" alt="" v-if="item.icon != undefined">
                                <p v-else class="noimg">暂无图片</p>
                             </div>
                        <div class="dmmparameter mmparameter">
                            <p>
                                {{changenum(item.createPin)}}
                                <span v-if="item.state == 0">支付中</span>
                                <span v-if="item.state == 1">运行中</span>
                                <span style="color:red;" v-if="item.state == 2">已停止</span>
                            </p>
                            <p class="dp2">每日产出:<span class="dpc">{{item.profit}}USDT/24h</span></p>
                            <p :class="comparison(item.endTime) == false? 'dpe' : 'dp2'">有效期至:{{item.endTime.slice(0,10)}}</p>
                        </div>
                        
                    </div>
                </div>
                <div v-else class="nodata">
                        暂无下级数据！
                </div>
                <div class="dbtnbox">
                    <van-button @click="diaagency = false" class="dbtn" color="linear-gradient(to right, #709af8, #547beb)">确认</van-button>
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
import Clipboard from "clipboard";
export default {
    components:{
        navbar
    },
    data(){
        return{
            httpUrl:http.webUrl,
            childnum:'',//子机数量
            parentinvite:"",
            parentstate:"",
            parentid:'',
            length:0,//矿机台数
            diaagency:false,
            subordinates:[],
            mills:[],
            userinfo:store.get('userinfo'),
            nowt:Date.parse(new Date())
        };
    },
    mounted(){
        this.mymachine()
        let n = '17600937279'
        // let n = 'asd2ad'
        this.changenum(n)
    },
    methods:{
        // 修改子机数字长度并隐藏多出部分
        changenum(n){
            if(n.length <= 6){
                return n.substr(0,3)+"***"
            }else{
                return n.substr(0,3)+"****"+n.substr(8,12)
            }
            
        },
        // 分享
        onshare(){
            var clipboard = new Clipboard('.sharebtn')
            clipboard.on('success', e => {
            this.$toast('分享链接生成完成，请到需要分享的位置粘贴即可。')
            // 释放内存
            clipboard.destroy()
            })
        },
        // 复制
        oncopy() {
         var clipboard = new Clipboard('.copybtn')
            clipboard.on('success', e => {
            this.$toast('复制成功！')
            // 释放内存
            clipboard.destroy()
            })
        },
        //比较两个时间大小
        comparison(etime){
            if(this.formDate(etime) > this.nowt){
                return true
            }else{
                return false
            }
        },
        // 转换时间为时间戳
        formDate (time) {
        const thisTime = time.replace(/-/g,'/')
        var nowTime = new Date(thisTime)
        nowTime = nowTime.getTime()
        return nowTime
        },
        // 获取下级
        onparent(item){
            this.diaagency = true
            this.parentid = item.id
            this.parentstate = item.state
            // if(item.state == 0){
            //      this.parentstate = '支付中'
            // }else if(item.state == 1){
            //      this.parentstate = '运行中'
            // }else if(item.state == 2){
            //      this.parentstate = '已停止'
            // }
           
            this.parentinvite = item.invitedCode
            this.$http.post('/api/business/childMachine/query',qs.stringify({
                parentMachineId:this.parentid,
            })).then(res=>{
                if(res.data.code == 0){
                    this.childnum = res.data.result.length
                    this.subordinates = res.data.result
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err => {
            })
        },
        //获取我的矿机
        mymachine(){
           this.$http.post('/api/business/myMachine/query').then(res=>{
                if(res.data.code == 0){
                    this.length = res.data.result.length
                    this.mills = res.data.result
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

.littit{
    color: #000;
    font-size: 1.4rem;
    font-weight: bold;
    line-height: 4rem;
}

/* 我的矿机 */
.mymill{
    margin-bottom: 15px;
}
.mymill > div:nth-child(2){
    margin-top: 0;
}

.mymillbox{
    margin-top: 10px;
    box-shadow: 0 0 5px #ccc;
    padding: 5px;
    display: flex;
    border-radius: 6px;
    align-items: center;
    justify-content: space-between;
}
.mymillbox i{
    font-size: 1.6rem;
}
.mmparameter{
    width: 65%;
}
.mmimg {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30%;
    height: 8rem;
}
.mmimg img{
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.mmmid,.mmfoot{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.mmtop p:first-child {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.mmtop p:first-child button,.sharebtn{
    font-size: 1.25rem;
    color: #fff!important;
    height: 2.2rem;
    padding: 0 10px;
}
.mmparameter .ptops{
    font-size: 1.25rem;
    color: #000;
    font-weight: bold;
}
.mmparameter{
    margin: 2px 0;
    color: #8a8c97;
}
.parmnum{
    font-size: 1.4rem;
    color: #ee7f51;
    font-weight: bold;
}


/* 弹出框 */
.dialogcont{
    margin-top: -4rem;
    padding: 0 15px;
}
.dtit{
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    height: 4rem;
    line-height: 4rem;
    font-size: 1.4rem;
    font-weight: bold;
    color: #000;
    border-bottom: 1px solid #ccc;
    text-align: center;
    background: #ffffff;
    z-index: 100;
}

.dialogli{
    padding-top: 4rem;
    overflow: hidden;
    overflow-y: auto;
    height: calc(100% - 8rem);
}

.dlicont p{
    font-size: 1.25rem;
}
.dlicont p:first-child{
    font-weight: bold;
    font-size: 1.4rem;

}

.dmmparameter p:nth-child(3){
    font-weight: normal;
color: #8a8c97;
}
.dmymillbox{
    border-bottom: 1px solid #eaeaeb;
    box-shadow: none;
    justify-content: start;
    margin-top: 0;
    padding: 10px 0;
}
.dmymillbox .mmimg{
    margin-right: 1.5rem;
    height: 6rem;
} 
.dmymillbox img{
    height: 6rem;
}   
.dmmparameter {
    width: auto;
}
.dmmparameter span{
    float: right;
}
.dp2{
    color: #8a8c97;
}
.dpe{
    color: red!important;
}
.dpc{
    color: #ee7f51;
    font-weight: bold;
}

.dbtnbox{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 5rem;
    background: #fff;
    text-align:center;
    border-radius: 4px;
}
.dbtn{
    margin-top: 0.75rem;
    font-size: 1.35rem;
    height: 3.5rem;
    border-radius:16px ;
    width: 60%;
}
.dcnum{
    width: 50%;
    text-align: right;
}
.nodata{
    margin-top: 50%;
}
/* 停止的矿机按钮变灰 */
.clasdisabled{
    background-color: #8a8c97!important;
    border-color: #8a8c97!important;
}
</style>