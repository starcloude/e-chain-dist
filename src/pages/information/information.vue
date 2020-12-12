<template>
    <div class="wrapper pb10rem">
        <!-- 资讯 -->
           <div class="content ">
                <div class="head">
                    <p>资讯</p>
                </div>
                <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了!"
                @load="change()"
                offset="5"
                :immediate-check="false"
                v-if="showdata"
                >
                <div class="informationbox" v-for="(item,i) in datas" :key="i" @click="$router.push({path:'/information/imdetail',query:{id:item.id}})">
                    <div class="imtit">{{ item.createTime.replace('-','年').replace('-','月').replace(' ','日 ').slice(0,17) }}</div>
                    <div class="imcont"><p>{{item.title}}</p><van-icon name="arrow"></van-icon></div>
                </div>
                </van-list>
                <div class="nodata" v-else>暂无数据！</div>
            </div>
        <navfoot type='2'></navfoot>
    </div>
</template>

<script>
import qs from 'qs'
import common from '../../asstic/common'
import navfoot from '../../components/navfoot'
import * as http from "../../asstic/http.js";
export default {
    components:{
        navfoot
    },
    data(){
        return{
            loading: false,
            showdata:true,
            finished:false,
            datas:[ ],
            dataListCurrPage: 0, //当前页码
            dataListSize: 6, //一页显示多少条数据
        };
    },
    mounted(){
        this.getdata()
    },
    methods:{
        change(){
            this.dataListCurrPage= 0
            this.finished = false
            this.loading = false
            this.showdata = true
            this.datas = []
            this.getdata()
        },
         // 获取充值记录
        getdata(){
            this.loading = true
            this.dataListCurrPage++;
            this.$http.post('/api/newsInfo/query',qs.stringify({
                type:'',
                title:'',
                author:'',
                introduce:'',
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
    },
}
</script>
<style scoped>
.content{
    padding: 0 ;
    
}
.head{
    margin: 0 5%;
    width: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 5rem;
}
.head p{
    line-height: 5rem;
    font-size: 1.6rem;
    font-weight: bold;
}
/* 资讯列表 */
.informationbox{
    width: 90%;
    margin-left: 5%;
    border-bottom: 1px solid #ccc;
    /* box-shadow: 0 0 3px #ccc; */
    padding: 15px 0;
    margin-bottom: 15px;
    font-size: 1.25rem;
}
.informationbox div:first-child{
    font-weight: bold;
}
.imcont{
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #666;


}
.imcont p{
    overflow: hidden;
    text-overflow: ellipsis;
    width: 90%;
    white-space: nowrap;
}
.imcont i{
    width: 5%;
    font-size: 1.8rem;
}
</style>