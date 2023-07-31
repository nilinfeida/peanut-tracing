<template>
    <el-container style="min-height: 100vh">
      <el-aside :width="sideWidth+'px'" style="background-color: rgb(238, 241, 246);height: 100%;box-shadow:2px 0 10px #4c678a ">
        <Aside :isCollapse="isCollapse" :logoTextShow="logoTextShow" />
      </el-aside>

      <el-container>
        <el-header style=" font-size: 12px;border-bottom:1px solid #ccc;" >
          <Header :collapseBtnClass="collapseBtnClass" @asideCollapse="collapse" :user="user"/>
        </el-header>

        <el-main :style="{left:isCollapse==true?'64px':'200px'}" >
          <!--        表示当前页面的子路由会在 <router-view /> 里面展示-->
          <router-view  @refreshUser="getUser" />
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import Aside from '@/components/Aside';
import Header from "@/components/Header";

export default {
  name:"HomeView",
  components:{
    Header,
    Aside,
  },
  data() {
    return {
      sideWidth:200,
      mainMarginLeft:"200px",
      isCollapse:false,
      logoTextShow:true,
      collapseBtnClass:'el-icon-s-fold',
      user:{},
    }
    },
  methods:{
    collapse(){
      this.isCollapse = !this.isCollapse
      if(this.isCollapse){
        this.sideWidth=64
        this.collapseBtnClass="el-icon-s-unfold"
        this.logoTextShow=false
      }else{
        this.sideWidth=200
        this.collapseBtnClass="el-icon-s-fold"
        this.logoTextShow=true
      }
    },
    getUser() {
      let username = localStorage.getItem("pt-user") ? JSON.parse(localStorage.getItem("pt-user")).username : ""
      if (username) {
        // 从后台获取User数据
        this.request.get("/user/username/" + username).then(res => {
          // 重新赋值后台的最新User数据
          this.user = res.data
        })
      }
    }
  },
  created() {
    // 从后台获取最新的User数据
    this.getUser()
  },

}
</script>

<style>
.el-main {
  position: absolute;
  /*left: 200px;*/
  right: 0;
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
}
</style>
