var comFunc = {
  //是否微信环境
    is_WeiXin(){
        let isWeiXin = () => {
            return (
              navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1
            );
          };
          if (isWeiXin()) {
            return true
          } else {
            return false
          }
    },
  // 是否ios端
  isIos(){
      var browser = {
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return { //移动终端浏览器版本信息
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
            };

        }(),
    }
      if(browser.versions.iPad || browser.versions.ios){
        return true
      }else{
        return false
      }
    },
    //获取传入时间年月日
    getindata(time){
      var y = time.getFullYear()
      var m = time.getMonth()+1
      var d = time.getDate()
      var h = time.getHours()
      var m2 = time.getMinutes()
      if (m >= 1 && m <= 9) {m = "0" + m;}
      if (d >= 0 && d <= 9) {d = "0" + d;}
      if (h >= 0 && h <= 9) {h = "0" + h;}
      if (m2 >= 0 && m2 <= 9) {m2 = "0" + m2;}
      var callback = y + "-" + m + "-" + d + ' ' + h + ":" + m2  + ':00'
      return callback
    },
    //获取当前时间
    getDate(mark1,mark2){
            var timeStr = mark1;
            var curDate = new Date();
            var curYear =curDate.getFullYear();  //获取完整的年份(4位,1970-????)
            var curMonth = curDate.getMonth()+1;  //获取当前月份(0-11,0代表1月)
            var curDay = curDate.getDate();       //获取当前日(1-31)
            if (curMonth >= 1 && curMonth <= 9) {
                curMonth = "0" + curMonth;
            }
            if (curDay >= 0 && curDay <= 9) {
                curDay = "0" + curDay;
            }
            var hmsstr = mark2
            var h  =  curDate.getHours()
            if (h >= 1 && h <= 9) {h = "0" + h;}
            var m  =  curDate.getMinutes()
            if (m >= 1 && m <= 9) {m = "0" + m; }
            var s  =  curDate.getSeconds()
            if (s >= 1 && s <= 9) { s = "0" + s;}
            var Current= curYear+timeStr+curMonth+timeStr+curDay+  `\xa0\xa0\xa0` + h + hmsstr + m + hmsstr + s;
            return Current
    },

    // 将base64转换为file文件
    dataURLtoFile(dataurl, filename) {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    
    //获取当前时间年月日时分秒 
    detailtime(){
            var timeStr = '-';
            var curDate = new Date();
            var curYear =curDate.getFullYear();  //获取完整的年份(4位,1970-????)
            var curMonth = curDate.getMonth()+1;  //获取当前月份(0-11,0代表1月)
            var curDay = curDate.getDate();       //获取当前日(1-31)
            if (curMonth >= 1 && curMonth <= 9) {
                curMonth = "0" + curMonth;
            }
            if (curDay >= 0 && curDay <= 9) {
                curDay = "0" + curDay;
            }
            var hmsstr = ":"
            var h  =  curDate.getHours()
            if (h >= 1 && h <= 9) {h = "0" + h;}
            var m  =  curDate.getMinutes()
            if (m >= 1 && m <= 9) {m = "0" + m; }
            var s  =  curDate.getSeconds()
            if (s >= 1 && s <= 9) { s = "0" + s;}
            var Current= curYear+timeStr+curMonth+timeStr+curDay+' '+ h + hmsstr + m + hmsstr + s;
            return Current
      },
      //计算结束时间减去开始时间剩余天数
      counttime(et,st){
         let d = this.formDate(et) - this.formDate(st)
         return parseInt(d / 1000 / 60 / 24) 
      } ,
      // 转换时间为时间戳
      formDate(time) {
        const ttime = time.replace(/-/g,'/')
        var nowTime = new Date(ttime)
        nowTime = nowTime.getTime()
        return nowTime
      },
    //获取当前时间年月日
  gettime(){
      var timeStr = '-';
      var curDate = new Date();
      var curYear =curDate.getFullYear();  //获取完整的年份(4位,1970-????)
      var curMonth = curDate.getMonth()+1;  //获取当前月份(0-11,0代表1月)
      var curDay = curDate.getDate();       //获取当前日(1-31)
    if (curMonth >= 1 && curMonth <= 9) {
        curMonth = "0" + curMonth;
    }
    if (curDay >= 0 && curDay <= 9) {
        curDay = "0" + curDay;
    }
    var Current= curYear+timeStr+curMonth+timeStr+curDay
    return Current
  },
  //开始时间减去结束时间返回剩余天数
  residueday(ot,st){
    let sTime = new Date(st.replace(/-/g,'/')).getTime()
    let eTime = new Date(ot.replace(/-/g,'/')).getTime()
    var dateInterval = eTime - sTime; //获取时间差毫秒
    //计算出相差天数
    var day = parseInt(dateInterval / (24 * 60 * 60 * 1000));
    return day
  },
  //开始时间减去当前时间返回已经开始的时间分钟 当前时间减去结束时间等于已结束时间
  createtime(nt,ct){
    let nTime = new Date(nt.replace(/-/g,'/')).getTime()
    let cTime = new Date(ct.replace(/-/g,'/')).getTime()
    var dateInterval = nTime - cTime; //获取时间差毫秒
    //计算分钟数
    var minutesLevel = dateInterval / (60 * 1000);
    var minutes = parseInt(minutesLevel);
    return minutes
  },
  // 小数点加
  floatAdd(arg1,arg2){    
    var r1,r2,m;    
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}    
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}    
    m=Math.pow(10,Math.max(r1,r2));    
    return (arg1*m+arg2*m)/m;    
  },
      
  // 小数点减    
  floatSub(arg1,arg2){    
      var r1,r2,m,n;    
      try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}    
      try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}    
      m=Math.pow(10,Math.max(r1,r2));    
      //动态控制精度长度    
      n=(r1>=r2)?r1:r2;    
      return ((arg1*m-arg2*m)/m).toFixed(n);    
  }, 
   // 小数点乘
  floatMul(arg1,arg2)   {     
    var m=0,s1=arg1.toString(),s2=arg2.toString();   
    try{m+=s1.split(".")[1].length}catch(e){}   
    try{m+=s2.split(".")[1].length}catch(e){}   
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)      
  } ,
  // 小数点除以
  floatDiv(arg1,arg2){   
    var t1=0,t2=0,r1,r2;   
    try{t1=arg1.toString().split(".")[1].length}catch(e){}   
    try{t2=arg2.toString().split(".")[1].length}catch(e){}   
      r1=Number(arg1.toString().replace(".",""))   
      r2=Number(arg2.toString().replace(".",""))   
      console.log(t2)
      console.log(t1)
      return (r1/r2)*Math.pow(10,t2-t1);   
     
  }

}
export default comFunc;