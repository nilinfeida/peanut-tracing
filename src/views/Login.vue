<template>
<div class="wrapper">
  <div style="margin: 200px auto; background-color: #fff; width: 350px; height: 320px; padding: 20px; border-radius: 10px">
    <div style="margin: 20px 0; text-align: center; font-size: 24px"><b>溯源管理</b></div>
    <el-form :model="user" :rules="rules" ref="userForm">
      <el-form-item prop="username">
        <el-input size="medium" prefix-icon="el-icon-user" placeholder="请输入用户名" v-model="user.username"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input size="medium" prefix-icon="el-icon-lock" show-password placeholder="请输入密码" v-model="user.password"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <div style="display: flex">
          <el-input size="medium" style="margin-right: 5px;width: 70%;text-align:right" prefix-icon="el-icon-message" placeholder="请输入验证码" v-model="user.code" ></el-input>
          <img :src="this.verificationImg"
               alt="验证码获取失败！" title="看不清？换一张"
               @click="acquireVerification" style="cursor: pointer;width: 150px">
        </div>
      </el-form-item>

        <el-checkbox @change="onChange" v-model="checked" style="margin-bottom:0px;color: #19191a;">  <span > 记住密码 </span></el-checkbox>

      <el-form-item style="margin: 10px 0; text-align: center">
        <el-button type="primary" style="width: 200px" size="large" autocomplete="off" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
// import {setRoutes} from "../router";
import {setRoutes} from "@/router";

export default {
  name: "Login",
  data() {
    const validateCode=(rule, value, callback) => {
        if(value.toLowerCase()!=this.checkCode){
            return callback(new Error("验证码错误，请重试"))
        }else {
          callback()
        }
    }
    const validatePsdReg = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码'))
      }
      if (!/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/.test(value)) {
        callback(new Error('请输入6-20位英文字母、数字或符号，且至少包含两种'))
      } else {
        callback()
      }
    }
    return {
      checked:true,
      verificationImg: '',
      checkCode:"",
      user: {
        username: "",
        password: "",
        code: ""
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          { validator:validatePsdReg, trigger: 'blur' }
        ],
        code:[
          {required: true, message: '请输入验证码', trigger: 'blur'},
          { validator:validateCode, trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    onChange() {
      this.checked = !this.checked
    },
    acquireVerification () {
      // {responseType: 'blob'} ，不加这个返回的就是乱码
      //直接获取
      this.request.get('/checkCode').then((res) => {
        if(res.code==200){
          this.verificationImg='data:image/gif;base64,'+res.data.img
          this.checkCode=res.data.code
        }else{
          this.$message.error(res.msg)
        }
      })
    },
    login(){
      this.$refs['userForm'].validate((valid)=>{
        if(valid){ //表单效验合法
          if (this.checked) {
            // let password = Base64.encode(this.loginForm.password); // base64加密
            localStorage.setItem("pt-username", this.user.username);
            localStorage.setItem("pt-password", this.user.password);
          } else {
            localStorage.removeItem("pt-username");
            localStorage.removeItem("pt-password");
          }
          this.request.post("/user/login",this.user).then(res=>{
            // console.log(res)
            if(res.code==='200'){
              localStorage.setItem("pt-user",JSON.stringify(res.data))       // 存储用户信息到浏览器
              localStorage.setItem("menus", JSON.stringify(res.data.menus))  // 存储用户信息到浏览器
              setRoutes()
              this.$message.success("登录成功")
              this.$router.push("/manage")
            }else{
              this.$message(res.msg)
            }
          })
        }
      })
    }
  },
  created (){
    this.acquireVerification()
    let username = localStorage.getItem("pt-username")
    if (username) {
      this.user.username = localStorage.getItem("pt-username");
      this.user.password = localStorage.getItem("pt-password");// base64解密
      this.checked = true;
    }
  }
}
</script>

<style scoped>
.wrapper {
  height: 100vh;
  background-image: linear-gradient(to bottom right, #36444f, #4c678a);
  overflow: hidden;
  text-align: left;
}
</style>