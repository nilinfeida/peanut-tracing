<template>
    <el-menu :default-openeds="['1', '3']" style="min-height: 100vh; overflow-x: hidden"
             background-color="rgb(48,65,86)" text-color="#fff" active-text-color="#398eef"
             :collapse-transition="false"
             :collapse="isCollapse"
             router
    >
      <div style="height: 60px;line-height: 60px;text-align: center">
        <img src="../assets/logo.png" alt="" style="width: 20px;position: relative;top: 5px;margin-right: 5px">
        <b style="color: white;font-size: 20px" v-show="logoTextShow">溯源管理</b>
      </div>
      <el-menu-item index="/">
        <i class="el-icon-s-home"></i><span slot="title">主页</span>
      </el-menu-item>

      <div v-for="item in menus" :key="item.menuId">
        <div v-if="item.path">
          <el-menu-item :index="item.path">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </div>
      </div>

      <el-menu-item index="/test">
        <i class="el-icon-setting"></i><span slot="title">测试</span>
      </el-menu-item>
    </el-menu>

</template>

<script>
export default {
  name: "Aside",
  data(){
    return{
      menus: localStorage.getItem("menus") ? JSON.parse(localStorage.getItem("menus")) : [],
    }
  },
  props:{
    isCollapse:Boolean,
    logoTextShow:Boolean
  },

}
</script>

<style scoped>
.el-menu-item {
  font-size: 16px;
}
</style>