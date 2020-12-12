import Vue from 'vue'
import Router from 'vue-router'


import login from '@/pages/login'
import register from '@/pages/register'
import changepwd from '@/pages/changepwd'
import identity from '@/pages/identity'
import setingpwquestion from '@/pages/setingpwquestion'

// 扫码页面
import codeLogin from '@/pages/codeLogin'
import codeDownload from '@/pages/codeDownload'
import codeDownloadindex from '@/pages/codeDownloadindex'
import codeDownloadInfo from '@/pages/codeDownloadInfo'

// 首页
import index from '@/pages/index/index'
import orderinfo from '@/pages/index/orderinfo'

// 资讯
import information from '@/pages/information/information'
import imdetail from '@/pages/information/imdetail'

//矿场
import mine from '@/pages/mine/mine'
import minemy from '@/pages/mine/minemy'

//资产
import property from '@/pages/property/property'
import mentionmoney from '@/pages/property/mentionmoney'
import chargemoney from '@/pages/property/chargemoney'
import propertdetail from '@/pages/property/propertdetail'
import transfer from '@/pages/property/transfer'
import history from '@/pages/property/history'
import detailinfo from '@/pages/property/detailinfo'



// 会员中心
import my from '@/pages/vipcenter/my'
import helpcenter from '@/pages/vipcenter/helpcenter'
import newguidance from '@/pages/vipcenter/newguidance'
import service from '@/pages/vipcenter/service'
import userinfo from '@/pages/vipcenter/userinfo'
import walletvindicate from '@/pages/vipcenter/walletvindicate'
import changepassword from '@/pages/vipcenter/changepassword'
import pushMoney from '@/pages/vipcenter/pushMoney'

Vue.use(Router)
var router = new Router({
  // mode:'history',
  routes: [
    {//初始页
      path: '/',
      redirect: 'login',
    },
    
    {//登陆页
      path: '/login',
      component: login,
    },
    {//注册页
      path: '/register',
      component: register,
    },
    {//修改密码验证密保问题
      path: '/changepwd',
      component: changepwd,
    },
    {//身份认证
      path: '/identity',
      component: identity,
    },
    {//身份认证
      path: '/setingpwquestion',
      component: setingpwquestion,
    },
    
    // ---- 扫码页面 ----
    {//扫码登录
      path: '/codeLogin',
      component: codeLogin,
    },
    {//扫码下载
      path: '/codeDownload',
      component: codeDownload,
    },
    {//扫码iphone说明
      path: '/codeDownloadInfo',
      component: codeDownloadInfo,
    },
    {//扫码下载首页
      path: '/codeDownloadindex',
      component: codeDownloadindex,
    },
    
    //-----首页----
    {
      path: '/index/index',
      component: index,
    },
    {//订单信息
      path: '/index/orderinfo',
      component: orderinfo,
    },
    //----资讯-----
    {
      path: '/information/information',
      component: information,
    },
    {//资讯详情
      path: '/information/imdetail',
      component: imdetail,
    },

    //-----矿场----
    {
      path: '/mine/mine',
      component: mine,
    },
    {//我的矿场
      path: '/mine/minemy',
      component: minemy,
    },

    //----资产----
    {
      path: '/property/property',
      component: property,
    },
    {//提币
      path: '/property/mentionmoney',
      component: mentionmoney,
    },
    {//充币
      path: '/property/chargemoney',
      component: chargemoney,
    },
    {//资产明细
      path: '/property/propertdetail',
      component: propertdetail,
    },
    {//划转
      path: '/property/transfer',
      component: transfer,
    },
    {//历史记录
      path: '/property/history',
      component: history,
    },
    {//明细详情
      path: '/property/detailinfo',
      component: detailinfo,
    },
    

    //------会员中心------
    {
      path: '/vipcenter/my',
      component: my,
    },
    {//帮助中心
      path: '/vipcenter/helpcenter',
      component: helpcenter,
    },
    {//新手指导
      path: '/vipcenter/newguidance',
      component: newguidance,
    },
    {//在线客服
      path: '/vipcenter/service',
      component: service,
    },
    {//用户信息
      path: '/vipcenter/userinfo',
      component: userinfo,
      meta: {
        needAuth: true
      }
    },
    {//钱包维护
      path: '/vipcenter/walletvindicate',
      component: walletvindicate,
    },
    {//修改密码
      path: '/vipcenter/changepassword',
      component: changepassword,
    },
    {//提成收益
      path: '/vipcenter/pushMoney',
      component: pushMoney,
    },
    
    
  ]
})
router.beforeEach((to, from, next) => {
  let needAuth = to.meta.needAuth || false;
  let user = store.get('userinfo');

  if (to.meta.title) {
    document.title = to.meta.title;
  }
  /* 判断是否需要登录 */
  if (needAuth && !user && to.path !== "/login") {
    return next({
      path: "/login",
      query: { redirect: to.fullPath } //返回登录前页面
    });
  }

  next();
});


export default router
