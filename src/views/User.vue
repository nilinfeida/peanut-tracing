<template>
<div>

  <!--搜索-->
  <el-card style="margin-bottom: 10px">
    <div class="pd-10">
      <el-input style="width: 200px;margin-right: 10px" v-model="username" suffix-icon="el-icon-search" placeholder="请输入用户名称"  @keyup.enter.native="search"></el-input>
      <el-input style="width: 200px" v-model="nickname" suffix-icon="el-icon-search" placeholder="请输入昵称" @keyup.enter.native="search"></el-input>
      <el-button class="ml-5" type="primary" round icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="default" @click="resetParam" round>重置</el-button>
    </div>
    <!--新增删除-->
    <div style="margin: 0px 0 0 0;" >
      <el-button type="primary" icon="el-icon-circle-plus-outline" round @click="addUser">新增</el-button>
      <el-popconfirm
          class="ml-10"
          confirm-button-text='确定'
          cancel-button-text='取消'
          icon="el-icon-info"
          icon-color="red"
          title="您确定批量删除这些数据吗？"
          @confirm="deleteBatch"
      >
        <el-button type="danger" icon="el-icon-remove-outline" slot="reference"  round>批量删除</el-button>
      </el-popconfirm>
      <el-upload action="http://localhost:9090/user/import" accept=".xls,.xlsx" :on-success="handleExcelImportSuccess" :show-file-list="false" style="display: inline-block" >
        <el-button type="primary" icon="el-icon-upload2" class="ml-10"round>导入</el-button>
      </el-upload>
      <el-button type="primary" icon="el-icon-download"  class="ml-5" @click="exp"  round>导出</el-button>
    </div>
  </el-card>


  <!--数据表单-->
  <el-card>
    <el-table :data="tableData" stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column prop="id" label="ID" width="50">
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="150">
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" width="150">
      </el-table-column>
      <el-table-column prop="roleId" label="角色" width="150" :formatter="formatRole">
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="150">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180">
      </el-table-column>
      <el-table-column prop="address" label="地址" >
      </el-table-column>
      <el-table-column  label="操作" width="100">
        <template slot-scope="scope" >
          <el-button type="primary" icon="el-icon-edit" circle title="编辑" @click="modUser(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle title="删除" @click="deleteUser(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>


  <!--分页-->
  <div class="block" style="padding: 10px 0">
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </div>

  <!--弹窗表单-->
  <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="30%" center  @close="resetForm" >
    <el-form :model="form" size="small" label-width="80px"  ref="form" :rules="rules">
      <el-form-item label="用户名称" prop="username">
        <el-input v-model="form.username" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item label="用户密码" prop="password">
        <el-input v-model="form.password" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item label="用户角色" prop="roleId">
        <el-col :span="25">
          <el-select v-model="form.roleId" filterable placeholder="请选择角色" >
            <el-option
                v-for="item in roleData"
                :key="item.id"
                :label="item.rolename"
                :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="form.nickname" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="form.phone" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="form.email" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item label="联系地址" prop="address">
        <el-input v-model="form.address" autocomplete="off" ></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: "User",
  data(){
    const validatePsdReg = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码'))
      }
      if (!/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/.test(value)) {
        callback(new Error('请输入6-20位英文字母、数字或者符号（除空格），且字母、数字和标点符号至少包含两种'))
      } else {
        callback()
      }
    }
    let checkDuplicate =(rule,value,callback )=> {
      if (this.form.id) {
        return callback()
      }
      this.request.get("/user/findOne?username=" + this.form.username).then(res => {
          if (res.code==600) {
            callback(new Error('账号已经存在'))
          } else {
            callback()
          }
      })
    };
    return{
      roleData:[],
      tableData: [],
      total:0,
      pageNum:1,
      pageSize:10,
      username:"",
      nickname:"",
      dialogFormVisible: false,
      form:{

      },
      rules:{
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
          {validator:checkDuplicate,trigger: 'blur'}
        ],
        password: [
          { required: true, message: '请输入初始密码', trigger: 'blur' },
          { validator:validatePsdReg, trigger: 'blur' }
        ],
        nickname: [
          { required: false, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择用户角色', trigger: 'blur' },
        ],
        email: [
          { required: false, message: '请输入电子邮件', trigger: 'blur' },
          // { validator: checkEmail, trigger: 'blur' }
        ],
        phone:[
          {required: false, message: '请输入联系电话', trigger: 'blur'},
          {pattern: /^1[3|4|5|6|7|8|9]\d{9}$/, message:'请输入正确手机号码',trigger: 'blur'},
        ],
        address: [
          { required: false, message: '请输入用户地址', trigger: 'blur' },
          { min: 2, max: 255, message: '长度在 2 到 255 个字符', trigger: 'blur' }
        ],
      },
      multipleSelection: [],
    }
  },
  methods:{
    formatRole(row){
      let temp=this.roleData.find(item=>{
        return item.id==row.roleId
      })
      return temp.rolename
    },
    exp(){
      window.open("http://localhost:9090/user/export")
    },
    handleSelectionChange(val){
      this.multipleSelection=val
    },
    deleteBatch(){
      let ids=this.multipleSelection.map(v=>v.id)
      this.request.post("/user/delBatch",ids).then(res => {
        this.$message({
          type: 'success',
          message: "删除成功"
        });
        this.getList();
      });
    },
    deleteUser(user) {
      this.$confirm(`您确定删除用户${user.username}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.delete("/user/"+user.id).then(res => {
          if(res.code==200){
            this.$message({
              type: 'success',
              message: "删除成功"
            });
            this.getList();
          }else{alert(res.message)}
        });

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    resetForm() {
      this.form={}
      this.$refs.form.clearValidate();
    },
    save(){
      this.$refs.form.validate((valid) => {
        if(valid){
          this.request.post("/user",this.form).then(res=>{
            if(res.code==200){
              // 成功提示
              this.$message({
                message: "用户更新成功",
                type: 'success'
              });
              // 关闭对话框
              this.dialogFormVisible = false;
              // 刷新表格
              this.getList()
            }else{
              this.$message({
                message: res.message,
                type: 'error'
              });
              this.dialogFormVisible=false
            }

          })
        }else{
          console.log("error submit!!");
          return false;
        }
      })
    },
    addUser(){
      this.dialogFormVisible = true
      this.$nextTick(()=>{
        this.resetForm()
      })


    },
    modUser(row){
      this.request.get("/user/findById?id="+row.id).then(res=>{
        console.log(res)
        if(res.code==200){
          res=res.data
          this.dialogFormVisible = true
          this.form=res
          // this.form.password=""
        }else{alert(res.message)}
      })
    },handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize=val
      this.getList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pageNum=val
      this.getList()
    },
    resetParam(){
      this.username=""
      this.nickname=""
    },
    search(){
      this.pageNum=1
      this.getList()
    },
    getList(){
      //请求分页查询数据
      this.request.get("/user/page",
          {params:{
              pageNum:this.pageNum,
              pageSize:this.pageSize,
              username:this.username,
              nickname:this.nickname
            }}).then(res=>{
        // console.log(res)
        if(res.code==200){
          this.tableData=res.data.records
          this.total=res.data.total
        }else{this.$message.error(res.msg)}

      })
    },
    getRoles(){
      //请求查询角色数据
      this.request.get("/role").then(res=>{
        // console.log(res)
        if(res.code==200){
          this.roleData=res.data

        }else{this.$message.error(res.msg)}

      })
    },
    handleExcelImportSuccess() {
      this.$message.success("导入成功")
      this.getList()
    }
  },
  created() {
    //请求分页查询数据
    this.getList()
    this.getRoles()
  },
}
</script>

<style scoped>

</style>