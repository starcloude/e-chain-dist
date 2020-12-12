<template>
    <div class="wrapper pt5rem">
        <!-- 资讯详情 -->
        <navbar label="资讯详情"></navbar>
        <div class="content ">
            <h2>{{data.title}}</h2>
            <p>{{data.createTime}}</p>
            <div class="continfo"  v-html="data.content"></div>
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
            data:{},
            id:'',
        };
    },
    mounted(){
        this.id = this.$route.query.id
        this.getdata()
    },
    methods:{
        // 获取资讯详情
        getdata(){
            this.$http.get('/api/newsInfo/'+this.id).then(res=>{
                if(res.data.success == true){
                   this.data = res.data.result
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err=>{
                localStorage.clear();
                this.$router.push({path:'/login'})
            })
        },
    },
}
</script>
<style scoped>
.content{
    background: #f3f3f5;
    font-size: 1.25rem;
}


h2{
    padding-top: 2rem;
    line-height: 2rem;
    font-weight: bold;
    font-size: 1.4rem;
    color: #000;
    text-align: center;
}
.content p{
    line-height: 4rem;
    text-align: center;
}

.continfo >>> p,.continfo >>> span,.continfo >>> div{
    font-family: "webfont" !important;
    font-size: 1.25rem!important;
    font-weight: 500!important;

}
</style>