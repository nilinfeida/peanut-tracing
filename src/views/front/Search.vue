<template>
  <div class="wrapper">
    <!--导航-->
    <el-menu class="el-menu-demo" mode="horizontal"  background-color="#4f8559"  router>
      <el-menu-item index="/search">首页</el-menu-item>
      <el-menu-item index="/manage" >溯源管理</el-menu-item>
      <el-menu-item index="/login" >登录</el-menu-item>
      <el-menu-item ><a href="https://baidu.com" target="_blank">关于</a></el-menu-item>
    </el-menu>

<div style="position: absolute;left: 0;right: 0;top:61px;bottom:0;overflow-y: auto;">
  <!--搜索-->
  <div style="margin: 50px 20px 0 0; text-align: center; font-size: 55px;color: white"><b>百信溯源</b></div>
  <div class="pd-10" style="text-align: center;">
    <el-input type="number" placeholder="请输入溯源ID" v-model="traceId" class="s2"  style="width: 650px"  clearable @keyup.enter.native="trace" >
      <el-button  slot="append" icon="el-icon-search" type="primary" style="font-size: 20px" @click="trace">溯源</el-button>
    </el-input>
  </div>
  <!--标签-->
  <div style="text-align:center;margin-bottom: 20px">
    <el-button type="info" size="medium" icon="el-icon-s-home" @click="toProduct" plain>产品</el-button>
    <el-button type="info" size="medium" icon="el-icon-sunrise" @click="toPlant" plain>种植</el-button>
    <el-button type="info" size="medium" icon="el-icon-office-building" @click="toProcess" plain>加工</el-button>
    <el-button type="info" size="medium" icon="el-icon-truck" @click="toLogistics" plain>物流</el-button>
    <el-button type="info" size="medium" icon="el-icon-shopping-cart-2" @click="toSale" plain>销售</el-button>
  </div>

  <div>
    <router-view :traceId="traceId" ref="child"></router-view>
  </div>
</div>



  </div>
</template>

<script>
export default {
  name: "Search",
  data(){
    return {
      traceId:null,
    }
  },
  methods:{
    trace(){
      if(this.traceId==null||this.traceId==""){
        this.$router.push("/search")
      }else{
        this.$router.push("/search/product")
        this.$refs.child.getList()
      }
    },
    toProduct(){
      this.$router.push("/search/product")
    },
    toPlant(){
      this.$router.push("/search/plant")
    },
    toProcess(){
      this.$router.push("/search/process")
    },
    toLogistics(){
      this.$router.push("/search/logistics")
    },
    toSale(){
      this.$router.push("/search/sale")
    },
  },


}
</script>

<style scoped>
.wrapper {
  height: 100vh;
  background-image: linear-gradient(to bottom right, #4f8559, #6dbd80);
  overflow: hidden;
  text-align: left;
}

/deep/ .el-input__inner{
  height: 45px;    /*调整inner的高度*/
  }
</style>