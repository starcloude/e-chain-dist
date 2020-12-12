<template>
    <div class="wrapper pt5rem">
        <!-- 身份认证 -->
        <navbar label="身份认证"></navbar>
        <div class="content ">
            <div class="cut-off cut5"></div>
            <!-- 身份证信息 -->
          <div class="idtext">
              <van-cell-group>
                <van-field v-model="name" label="姓名" placeholder="请输入姓名" />
                <van-field v-model="idnum" label="证件号" placeholder="请输入证件号" />
            </van-cell-group>
          </div>
          <div class="cut-off "></div>
          <!-- 身份证图片 -->
          <div class="idcard">
              <div class="cardfrond">
                <van-field name="uploader" label="正面照">
                <template #input>
                    <van-uploader v-model="idfrond" :max-count="1" :after-read="uploadImgbase64" />
                    <div class="cardbg">
                        <img src="../assets/img/idicon.png" alt="">
                        <p>上传</p>
                    </div>
                </template>
                </van-field>
              </div>
              <div class="cardreverse">
                <van-field name="uploader" label="反面照">
                    <template #input>
                        <van-uploader v-model="idreverse" :max-count="1" :after-read="uploadImgbase64" />
                        <div class="cardbg">
                            <img src="../assets/img/idicon.png" alt="">
                             <p>上传</p>
                        </div>
                    </template>
                </van-field>
              </div>
              <van-button color="#03a9e7"  class="confirm" @click="onconfirm">确认</van-button>
          </div>
        </div>
    </div>
</template>

<script>
import qs from 'qs'
import common from '../asstic/common'
import navbar from '../components/navbar'
import * as http from "../asstic/http.js";
export default {
    components:{
        navbar
    },
    data(){
        return{
            name:'',
            idnum:'',
            idfrond:[],
            idreverse:[],
        };
    },
    mounted(){
        
    },
    methods:{
        // 获取认证的图片
        isEmpty(val) {
            return /^\s*$/.test(val);
        },
        
        // 确认按钮
        onconfirm(){
            if(this.isEmpty(this.name)){
                this.$toast('姓名不能为空！')
                return false;
            }
            if(this.isEmpty(this.idnum)){
                this.$toast('证件号不能为空！')
                return false;
            }
            if(!/^[0-9a-zA-Z]*$/g.test(this.idnum)){
                this.$toast('证件号只能为字母或数字！')
                return false;
            }
            if(this.isEmpty(this.idfrond)){
                this.$toast('证件正面不能为空！')
                return false;
            }
            if(this.isEmpty(this.idreverse)){
                this.$toast('证件反面不能为空！')
                return false;
            }
            
            if(this.idfrond[0].url == undefined ){
                this.uploadfile1()
            }else if(this.idreverse[0].url == undefined){
                this.uploadfile2()
            }else{
                this.savedata()
            }
            
        },
        // 上传文件1
        uploadfile1(){
            this.$http.post('/api/file/u64',qs.stringify({
                content:this.idfrond[0].content,
                name:this.idfrond[0].file.name,
            })).then(res=>{
                if(res.data.success == true){
                    this.fileid1 = res.data.result    
                    this.uploadfile2()
                   
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err=>{
            })
        },
        uploadfile2(){
             this.$http.post('/api/file/u64',qs.stringify({
                content:this.idreverse[0].content,
                name:this.idreverse[0].file.name,
            })).then(res=>{
                if(res.data.success == true){
                     this.fileid2 = res.data.result
                    this.savedata()
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err=>{
            })

        },
        //上传文件
        savedata(){
            this.$http.post('/api/card/save',qs.stringify({
                realName:this.name,
                idCardNo:this.idnum,
                idCardImg1:this.fileid1,
                idCardImg2:this.fileid2,
            })).then(res=>{
                if(res.data.code == 0){
                    this.$toast('保存成功。')
                    setTimeout(()=>{
                        this.$router.push({path:'/setingpwquestion'})
                    },500)
                    
                }else{
                    this.$toast(res.data.msg)
                }
            }).catch(err=>{
            })
        },
        uploadImgbase64(file) {
            // 大于330kb的jpeg和png图片都缩小像素上传
            if(file.file.size > 100000) {
                // 创建Canvas对象(画布)
                let canvas =  document.createElement('canvas');
                // 获取对应的CanvasRenderingContext2D对象(画笔)
                let context = canvas.getContext('2d');
                // 创建新的图片对象 
                let img = new Image();
                // 指定图片的DataURL(图片的base64编码数据)
                img.src = file.content;
                // 监听浏览器加载图片完成，然后进行绘制
                img.onload = () => {
                // 指定canvas画布大小，该大小为最后生成图片的大小
                let imgwidth = img.width / 4;
                let imgheight = img.height / 4;
                canvas.width = imgwidth;
                canvas.height = imgheight;
                /* drawImage画布绘制的方法。(0,0)表示以Canvas画布左上角为起点，400，300是将图片按给定的像素进行缩小。*/
                /* 如果不指定缩小的像素，图片将以图片原始大小进行绘制，图片像素如果大于画布将会从左上角开始按画布大小部分绘制图片，最后得到的图片就是张局部图。图片小于画布就会有黑边。*/ 
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                // 将绘制完成的图片重新转化为base64编码，file.file.type为图片类型，0.92为默认压缩质量
                file.content = canvas.toDataURL(file.file.type, 0.5);
                // 最后将base64编码的图片保存到数组中，留待上传。
                return file.content;
                }                       
            }else{
                // 不做处理的jpg和png以及gif直接保存到数组
                return file.content;
            }   
        },
    },
}
</script>
<style scoped>

.content{
    padding: 0;
}
.cut5{
    height: 5px;
}
.idtext{
    margin-top: 5px;
}
.idtext >>>[class*=van-hairline]::after{
    border: none;
}
.idcard >>> .van-cell,.cardreverse >>> .van-cell{
border: none;
}
.idtext .van-cell{
    padding: 10px 20px;
}
.idtext >>> .van-field__body{
    font-size: 1.25rem;
}
.van-cell >>> .van-field__label{
    color: #333;
    width: 3.5em;
    font-size: 1.25rem;
}
.idtext  >>> .van-cell::after{
    left: 10px;
    border-bottom-color:#e9e9e9;
}
/* 身份证照片 */

.idcard{
    padding: 10px 0;
    background: #fff;
}
.idcard >>> .van-uploader__input{
    z-index: 100;
}
.idcard >>> .van-field__value,.idcard >>> .van-uploader__preview,.idcard >>> .van-uploader__preview-image{
    width: 15rem;
    height: 10rem;
    margin: 0;
}
.idcard >>> .van-uploader{
        position: absolute;
    left: 0;
    top: 0;
    height: 10rem;
    z-index: 1000;
}
.idcard >>> .van-uploader__wrapper{
    width: 15rem;
      height: 10rem;
  align-items: center;
    justify-content: center;
}
.idcard >>> .van-uploader__upload{
  margin: 0;
width: 15rem;
    height: 10rem;
  border:none!important;
  background: none!important;
}
/* .idcard >>> .van-uploader__preview-image{
    z-index: 1001;
} */
.idcard >>> .van-image__img{
  width: 100%;

}
.cardbg{
    background: #f5f5f5;
    width: 15rem;
    height: 10rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: absolute;
    font-size: 1.25rem;
    top: 0;
}
.cardbg img{
    width: 2rem;
}

.cardreverse{
    margin-top: 20px;
}



.idcard >>>.van-uploader__upload-icon{
  display: none;
}
/* 确认按钮 */
.confirm{
    width: calc(100% - 32px);
    height: 4rem;
    line-height: 4rem;
    font-size: 1.35rem;
    margin-top: 4rem;
    margin-left: 16px;
    
}
</style>