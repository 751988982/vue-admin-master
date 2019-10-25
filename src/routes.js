import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import adminUser from './views/user/adminUser.vue'
import Form from './views/user/Form.vue'
import currency from './views/Finance/currency.vue'  
import capital from './views/Finance/capital.vue' 
import Recharge from './views/Finance/Recharge.vue' 
import withdraw from './views/Finance/withdraw.vue' 
import Commission from './views/Finance/Commission.vue' 
import banker from './views/Finance/banker.vue'
import bei from './views/game/bei.vue' 
import Betdata from './views/game/Betdata.vue' 
import echarts from './views/charts/echarts.vue'

Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '用户管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/adminUser', component: adminUser, name: '管理员设置' },
            // { path: '/form', component: Form, name: 'Form' },
            // { path: '/user', component: user, name: '列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '财务管理',
        iconCls: 'fa fa-id-card-o',
        children: [            
            { path: '/currency', component: currency, name: '币种管理' },
            { path: '/capital', component: capital, name: '资金管理' },
            { path: '/banker', component: banker, name: '奖池管理' },
            { path: '/Recharge', component: Recharge, name: '充值记录' },
            { path: '/withdraw', component: withdraw, name: '提现记录' },
            { path: '/Commission', component: Commission, name: '佣金管理' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '游戏管理',
        iconCls: 'fa fa-address-card',
        children: [
            { path: '/bei', component: bei, name: '爆炸倍数设置' },
            { path: '/Betdata', component: Betdata, name: '游戏数据' },
           
        ]
    },
    {
        path: '/',
        component: Home,
        name: '代理管理',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
    
    
  ]
});