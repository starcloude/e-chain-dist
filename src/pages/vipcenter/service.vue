<template>
    <div class="wrapper pt5rem">
        <!-- 在线客服 -->
        <navbar label="在线客服"></navbar>
        <div class="content ">
          <div  class="box100">
            <div class="contbox" id="cbox"> 
              <div class="getmore">
                <van-button  @click="getdata()" v-if="finished">点击加载更多...</van-button>
                <van-button v-else>没有更多了</van-button>
              </div>
                <div class="cont" v-for="(item,i) in qaDatas" :key="i"> 
                    <p class="ctime" v-show="item.createTime"> <span>{{  item.createTime }}</span> </p>
                    <!-- 左侧问题 -->
                    <div class="userl" v-show="item.chatId == item.toUserId">
                        <div class="ubox">
                            <div class="uimg">
                            <img src="../../assets/img/kfhead.png" alt="">
                            </div>
                            <div class="uquestionbox">
                            <div class="utriangle"></div>
                            <div class="uquestion">{{ item.content }}</div>
                            </div>
                        </div>
                    </div>
                    <!-- 右侧答案 -->
                    <div class="nzhr" v-show="item.chatId == item.fromUserId">
                        <div class="nbox">
                        <div class="nquestionbox">
                            <div class="nquestion" v-html="item.content"></div>
                            <div class="ntriangle"></div>
                            </div>
                            <div class="nimg">
                            <img src="../../assets/img/defaulthead.png" alt="">
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
                <div class="subbox">
                    <!-- 输入问题按钮 -->
                    <div class="texta">
                        <van-cell-group>
                        <van-field
                            v-model="message"
                            rows="1"
                            :autosize="{maxHeight: 83}"
                            type="textarea"
                            placeholder='输入你想咨询的问题'
                        />
                        </van-cell-group>
                    </div>
                    <div class="messubBox" @click="subqa">
                        <van-button>提交</van-button>
                    </div>
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
export default {
    components:{
        navbar
    },
    data(){
       return {
        total:"",
        dataListCurrPage: 0, //当前页码
        dataListSize: 10, //一页显示多少条数据
        finished: false,
        // loading: false,
        asize:{
          maxHeight: 103
        },
        flag:true,//防止重复提交
        pjId:'',//评价id
        // loading:true,
        qaDatas:[],
        row:1,
        userinfo:store.get('userinfo'),//用户缓存信息
        message:"",
        currentTime:common.getDate('年',':').slice(0,-3),//当前时间
        // userimg1:require('../../assets/img/dailiicon.png'),
        // userimg1:require('../../assets/img/dailiicon.png'),
        
    };
  },
  mounted() {
    var qdata = this.$route.query
    if(qdata != undefined){
      if(qdata.type == 0){
        //充值
        this.message = '申述：充值订单【'+qdata.id+'】有疑问，请帮忙核查!'
      }else if(qdata.type == 2){
        // 提现
        this.message = '申述：提现订单【'+qdata.id+'】有疑问，请帮忙核查!'
      }
    }
      
      this.gettotal()
    //问答区域滚动到底部
    //判断机型
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    var _self = this;
    //Android
    if (isAndroid) {
      //获取原窗口的高度
      var originalHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      window.onresize = function() {
        //键盘弹起与隐藏都会引起窗口的高度发生变化
        var resizeHeight =
          document.documentElement.clientHeight || document.body.clientHeight;

      };
    }
   
  },
  methods: {
    //获取总条数
    gettotal(){
      this.$http
          .post("/api/business/chatMsg/query",qs.stringify({
          pageNo:1,
          pageSize:10,
        })).then(res => {
            if(res.data.success == true){
              this.total = res.data.total
               if(this.total <= 10){
                  this.dataListCurrPage = 1
                }else{
                  this.dataListCurrPage = parseInt(this.total/this.dataListSize) + 1
                  setTimeout(() => {
                  this.getdata(1)
                }, 1000);
                   
               }
              this.getdata()
            }else{
              this.$toast(res.data.msg)
              }
          })
          .catch(err => {
          });
    },
    //加载更多
    change(){
            this.finished = false
            this.qaDatas = []
            this.gettotal()
        },
    //获取问答明细
    getdata(state){
      this.$http
        .post("/api/business/chatMsg/query",qs.stringify({
          pageNo:this.dataListCurrPage,
          pageSize:this.dataListSize,
        })).then(res => {
          if(res.data.success == true){
            
            this.dataListCurrPage--;
            let data = res.data.result
            // var tdata = res.data.result[0].createTime
            this.qaDatas = data.concat(this.qaDatas)
            var tdata = this.qaDatas[0].createTime
            if(data.length > 1 || this.qaDatas.length > 1){
              this.delettime(tdata,this.qaDatas,0)
            }
            // 初始聊天区域滚动到底部
            if(state == 1 || this.total <= 10){
                this.$nextTick(function(){
                var div = document.getElementById('cbox');
                    div.scrollTop = div.scrollHeight;
                })
            }
            if (this.dataListCurrPage == 0) {
                this.finished = false;
            }else{
              this.finished = true;
            }
            
          }else{
            this.$toast(res.data.msg)
            }
        })
        .catch(err => {
        });
    },

    delettime(tdata,data,inum){
      for (let i = inum+1; i < data.length; i++) {
        if(this.CompareDate(data[i].createTime,tdata) <= 30){
          delete data[i].createTime
          if(i == data.length-1){
            this.qaDatas = data
          }
        }else{
            tdata = data[i].createTime
            if(i == data.length-1){
              this.qaDatas = data
            }else{
              this.delettime(tdata,data,i)
            }
        }
      }
    },
    // 比较两个时间是否大于三十分钟
    CompareDate(t1,t2){
      if(t1 == undefined || t2 == undefined){
        return 10
      }else{
        let count = this.formDate(t1) - this.formDate(t2)
        return parseInt(count / 1000 / 60)  
      }
    },
    //提交问题
    subqa(){
      if(this.flag == true){
        if(!this.message){
          this.$toast('问题不能为空！')
          return false;
        }
        this.flag = false
        this.$http.post("/api/business/chatMsg/add",
        qs.stringify({
              toUserId:100001,
              toUserNick:'客服小姐姐',
              content:this.message,
            })
            )
            .then(res => {
              this.flag = true
              if(res.data.success == true){
                this.message = ''
                this.change()
              }
            })
            .catch(err => {
              this.flag = true
            })
      }
    },
    // 转换时间为时间戳
    formDate (time) {
      const thisTime = time.replace(/-/g,'/')
      var nowTime = new Date(thisTime)
      nowTime = nowTime.getTime()
      return nowTime
    },
 
  },
};
</script>
<style scoped>
.wrapper{
    background: #ECECEC;
}
.box100{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.content{
    padding: 0 2%;

}
.contbox{
      margin: 0% 2%;
  width: 96%;
  /* max-height: calc(78% - 20px); */
  overflow: hidden;
  overflow-y: auto;
  padding: 10px 0;
  height: 100%;
}
.cont{
    margin: 3% 0;
}
.ctime{
    margin: 15px 0;
  text-align: center;
}
.ctime span{
  border-radius:6px;
  padding: 3px 15px;
  background: rgba(216,216,216,1);
}

/* 左侧聊天 */
.nzhr{
margin: 8px 0;
}
.ubox,.nbox{
  display: flex;
  align-items: flex-start;
      align-items: center;
}
.nbox{
  justify-content: flex-end;
}
.uimg,.nimg{
  width: 3.5rem;
  height: 3.5rem;
}

.uimg img, .nimg img{
    width: 100%;
    object-fit: cover;
    height: 100%;
}
.utriangle{
    width: 0;
    height: 0;
    border: 8px solid;
    border-color: #ECECEC #04E57B #ECECEC #ECECEC;
    margin: auto 0;
}
.ntriangle{
      width: 0;
    height: 0;
    border: 8px solid;
    border-color:  #ECECEC   #ECECEC  #ECECEC #fff;
   margin: auto 0;
}
.uquestionbox,.nquestionbox{
  max-width: 85%;
  display: flex;
  align-items: flex-start;
}
.uquestion,.nquestion{
  border-radius: 4px;
  padding: 5px 15px;
  line-height: 1.8;
  background: #04E57B;
  /* overflow:hidden;
  text-overflow:ellipsis;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:4; */
}
.nquestion{
  background: #fff;
}
/* --- */
.subbox{
  max-width: 540px;
  width: 100%;
  padding: 15px 2%;
    display: flex;
    align-items: center;
}
.texta{
  width: 68%;
}
.texta >>> .van-cell{
  height: auto;
}
.texta >>> .van-cell-group{
     margin: 0 auto;
}
.texta >>> .van-cell-group >>> .van-cell ,.van-cell-group{
  border-radius: 6px;
}

.texta  >>> .van-field__control::placeholder{
  color:#434343;
  text-align: center;
}
.messubBox{
  width: 28%;
  text-align: right; 
}
.messubBox button{
  width: 80%;
}
.van-list{
      height: inherit;
}
/* 加载更多 */
.getmore{
  text-align: center;
}
.getmore button{
  color: #666;
  background-color: rgba(0,0,0,0);
}
</style>