<template>
  <div style="line-height: 60px; display: flex">
    <div style="flex: 1;">
      <span :class="collapseBtnClass" style="cursor: pointer;font-size: 25px" @click="collapse"></span>
      <!--面包屑导航-->
      <el-breadcrumb separator="/" style="display: inline-block; margin-left: 10px">
        <el-breadcrumb-item :to="'/'">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentPathName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-dropdown style="width: 150px;cursor: pointer;text-align: right">
      <div style="display: inline-block">
        <img :src="user.avatarUrl" alt=""
             style="width: 30px; border-radius: 50%; position: relative; top: 10px; right: 5px">
        <span>{{ user.nickname }}</span>
        <i class="el-icon-arrow-down" style="margin-left: 5px"></i>
      </div>

      <el-dropdown-menu slot="dropdown" style="width: 100px; text-align: center">
        <el-dropdown-item  style="font-size: 14px; padding: 5px 0" @click.native="person">个人信息</el-dropdown-item>
        <el-dropdown-item style="font-size: 14px; padding: 5px 0" @click.native="changePassword">修改密码</el-dropdown-item>
        <el-dropdown-item style="font-size: 14px; padding: 5px 0"  @click.native="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    collapseBtnClass: String,
    user: Object
  },
  data(){
    return{
    }
  },
  computed: {
    currentPathName () {
      return this.$store.state.currentPathName;　　//需要监听的数据
    }
  },
  methods: {
    collapse() {
      // this.$parent.$parent.$parent.$parent.collapse()  // 通过4个 $parent 找到父组件，从而调用其折叠方法
      this.$emit("asideCollapse")
    },
    logout() {
      this.$store.commit("logout")
      // this.$router.push("/login")
      this.$message.success("退出成功")
    },
    changePassword(){
      this.$router.push("/password")
    },
    person(){
      this.$router.push("/person")
    },
    getUser() {
      let user = localStorage.getItem("pt-user") ? JSON.parse(localStorage.getItem("pt-user")) : null
      console.log(user)
      this.user=user
    }
  },

}
</script>

<style scoped>

</style>