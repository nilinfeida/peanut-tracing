<template>
<div>
  <!--搜索-->
  <el-card style="margin-bottom: 10px">
    <div class="pd-10">
      <el-input style="width: 200px;margin-right: 10px" v-model="rolename" suffix-icon="el-icon-search" placeholder="请输入角色名称"  @keyup.enter.native="search"></el-input>
      <el-button class="ml-5" type="primary" round icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="default" @click="resetParam" round>重置</el-button>
    </div>
    <!--新增删除-->
    <div style="margin: 0px 0 0 0;" >
      <el-button type="primary" icon="el-icon-circle-plus-outline" round @click="addRole">新增</el-button>
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
    </div>
  </el-card>



  <!--数据表单-->
  <el-card>
    <el-table :data="tableData" stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column prop="id" label="ID" width="50">
      </el-table-column>
      <el-table-column prop="rolename" label="角色名" width="180">
      </el-table-column>
      <el-table-column prop="description" label="角色描述" >
      </el-table-column>
      <el-table-column  label="操作" width="280">
        <template slot-scope="scope" >
          <el-button type="primary" @click="selectMenu(scope.row)" plain>分配权限<i class="el-icon-menu"></i></el-button>
          <el-button type="primary" icon="el-icon-edit" circle title="编辑" @click="modRole(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle title="删除" @click="deleteRole(scope.row)"></el-button>
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
  <el-dialog title="角色信息" :visible.sync="dialogFormVisible" width="30%" center  @close="resetForm" >
    <el-form :model="form" size="small" label-width="80px"  ref="form" :rules="rules">
      <el-form-item label="角色名称" prop="rolename">
        <el-input v-model="form.rolename" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="description">
        <el-input type="textarea"  v-model="form.description" autocomplete="off" ></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>

  <el-dialog title="权限分配" :visible.sync="menuDialogVis" width="30%">
    <el-tree
        :props="props"
        :data="menuData"
        show-checkbox
        node-key="menuId"
        ref="tree"
        default-expand-all

    >
         <span class="custom-tree-node" slot-scope="{ node, data }">
            <span><i :class="data.icon"></i> {{ data.name }}</span>
         </span>
    </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button @click="menuDialogVis = false">取 消</el-button>
      <el-button type="primary" @click="saveRoleMenu">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: "Role",
  data(){
    let checkDuplicate =(rule,value,callback )=> {
      if (this.form.id) {
        return callback()
      }
      this.request.get("/role/findByName?rolename=" + this.form.rolename).then(res => {
        if (res.code==200) {
          callback(new Error('账号已经存在'))
        } else {
          callback()
        }
      })
    };
    return{
      tableData: [],
      total:0,
      pageNum:1,
      pageSize:10,
      rolename:"",
      dialogFormVisible: false,
      form:{},
      name: "",
      menuDialogVis: false,
      menuData: [],
      props: {
        label: 'name',
      },
      roleId: 0,
      rules:{
        rolename: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
          {validator:checkDuplicate,trigger: 'blur'}
        ],
      },
      multipleSelection: [],
    }
  },
  methods:{
    saveRoleMenu() {
      this.request.post("/role/roleMenu/" + this.roleId, this.$refs.tree.getCheckedKeys()).then(res => {
        if (res.code === '200') {
          this.$message.success("绑定成功")
          this.menuDialogVis = false

          // // 操作管理员角色后需要重新登录
          // if (this.roleFlag === 'ROLE_ADMIN') {
          //   this.$store.commit("logout")
          // }

        } else {
          this.$message.error(res.msg)
        }
      })
    },
    selectMenu(role) {
      this.roleId = role.id
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([])
      })
      this.request.get("/role/roleMenu/" + this.roleId).then(res => {
        // console.log(res.data)
            this.$nextTick(() => {
              this.$refs.tree.setCheckedKeys(res.data)
            })
        this.menuDialogVis = true
      })
    },
    getMenu(){
      // 请求菜单数据
      this.request.get("/menu").then(res => {
        // console.log(res.data)
        this.menuData = res.data

      })
    },
    handleSelectionChange(val){
      this.multipleSelection=val
    },
    deleteBatch(){
      let ids=this.multipleSelection.map(v=>v.id)
      this.request.post("/role/delBatch",ids).then(res => {
        this.$message({
          type: 'success',
          message: "删除成功"
        });
        this.getList();
      });
    },
    deleteRole(role) {
      this.$confirm(`您确定删除用户${role.rolename}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.delete("/role/"+role.id).then(res => {
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
          this.request.post("/role",this.form).then(res=>{
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
    addRole(){
      this.dialogFormVisible = true
      this.$nextTick(()=>{
        this.resetForm()
      })


    },
    modRole(row){
      this.request.get("/role/"+row.id).then(res=>{
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
      this.rolename=""
    },
    search(){
      this.pageNum=1
      this.getList()
    },
    getList(){
      //请求分页查询数据
      this.request.get("/role/page",
          {params:{
              pageNum:this.pageNum,
              pageSize:this.pageSize,
              rolename:this.rolename,
            }}).then(res=>{
        // console.log(res)
        if(res.code==200){
          this.tableData=res.data.records
          this.total=res.data.total
        }else{this.$message.error(res.msg)}

      })
    },
    handleExcelImportSuccess() {
      this.$message.success("导入成功")
      this.getList()
    },
  },
  created() {
    //请求分页查询数据
    this.getList()
    this.getMenu()
  },
}
</script>

<style scoped>

</style>