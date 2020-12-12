<template lang="">
    <div>
        <van-swipe :autoplay="3000" class="mt10">
        <!-- <van-swipe-item v-for="(slide,index) in swipes" :key="index">
          <p class="imgp" @click="routerPath(slide.linkUrl)">
              <img :src="API_URL + slide.url" />
          </p>
        </van-swipe-item> -->
        <van-swipe-item>
          <img src="../assets/img/banner1.png" alt="">
        </van-swipe-item>
        <van-swipe-item>
          <img src="../assets/img/banner2.png" alt="">
        </van-swipe-item>
      </van-swipe>
    </div>
</template>
<script>
import * as http from "../asstic/http";
export default {
  name: "banner",
  data() {
    return {
      API_URL:http.API_URL,
      swipes: [
        // {
        //   rout: "/aboutUs",
        //   url: require("../assets/img/banner-20190906165957.jpg")
        // },
        // {
        //   rout: "/lottery/lotteryIndex",
        //   url: require("../assets/img/lottery/lotBanner.png")
        // }
      ]
    };
  },
  mounted () {
    // this.getNowLive()
  },
  methods:{
    routerPath(path){
      window.location.href = path
    },
    getNowLive() {
      this.$http
        .get("/resource/getBannerPic")
        .then(res => {
          if (res.data.code == 200) {
            this.swipes = res.data.data;
          } else {
          }
        })
        .catch(err => {
        });
    }
  },

};
</script>
<style scoped>


.van-swipe-item img {
  width: 100%;
}


</style>