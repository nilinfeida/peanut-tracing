<template>
<div>
  <!--搜索-->
  <el-card style="margin-bottom: 10px">
    <div class="pd-10">
      <el-input style="width: 200px;margin-right: 10px" v-model="productName" suffix-icon="el-icon-search" placeholder="请输入产品名称"  @keyup.enter.native="search"></el-input>
      <el-input style="width: 200px;margin-right: 10px" v-model="id" suffix-icon="el-icon-search" placeholder="请输入产品id"  @keyup.enter.native="search"></el-input>
      <el-button class="ml-5" type="primary" round icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="default" @click="resetParam" round>重置</el-button>
    </div>
    <!--新增删除-->
    <div style="margin: 0px 0 0 0;" >
      <el-button type="primary" icon="el-icon-circle-plus-outline" round @click="addData">新增</el-button>
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
      <el-table-column prop="productName" label="产品名" width="180">
      </el-table-column>
      <el-table-column prop="picUrl" label="产品图片" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" alt=""
               style="width: 80px; position: relative; ">
        </template>
      </el-table-column>
      <el-table-column prop="description" label="产品描述" >
      </el-table-column>
      <el-table-column prop="upload" label="区块链" width="75">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.upload == 1 ? 'primary' : 'info'"
              disable-transitions>{{scope.row.upload==0?"未上链":"已上链"}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column  label="操作" width="170">
        <template slot-scope="scope" >
          <el-button type="primary" @click="uploadBlockChain" title="数据上传区块链" plain>上链</el-button>
          <el-button type="primary" icon="el-icon-edit" circle title="编辑" @click="modData(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle title="删除" @click="deleteData(scope.row)"></el-button>
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
  <el-dialog title="产品信息" :visible.sync="dialogFormVisible" width="30%" center  @close="resetForm" >
    <el-form :model="form" size="small" label-width="80px"  ref="form" :rules="rules">
      <el-form-item label="产品图片" prop="picUrl">
        <el-upload
            class="avatar-uploader"
            :action="'http://' + serverIp +':9090/file/upload'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            title="点击上传产品图片"
            accept=".bmp,.jpeg,.jpg,.gif,.png,"
        >
          <img v-if="form.picUrl" :src="form.picUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="form.productName" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item label="产品描述" prop="description">
        <el-input type="textarea"  v-model="form.description" autocomplete="off" ></el-input>
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
import {serverIp} from "../../public/config";
export default {
  name: "Product",
  data(){
    let checkDuplicate =(rule,value,callback )=> {
      if (this.form.id) {
        return callback()
      }
      this.request.get("/product/findByName?productName=" + this.form.productName).then(res => {
        if (res.code==200) {
          callback(new Error('产品已经存在'))
        } else {
          callback()
        }
      })
    };
    return{
      id: null,
      serverIp: serverIp,
      tableData: [],
      total:0,
      pageNum:1,
      pageSize:10,
      productName:"",
      dialogFormVisible: false,
      form:{},
      rules:{
       productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
          {validator:checkDuplicate,trigger: 'blur'}
        ],
      },
      multipleSelection: [],
    }
  },
  methods:{
    uploadBlockChain() {
      alert("开发中...")
    },

    handleSelectionChange(val){
      this.multipleSelection=val
    },
    deleteBatch(){
      let ids=this.multipleSelection.map(v=>v.id)
      this.request.post("/product/delBatch",ids).then(res => {
        this.$message({
          type: 'success',
          message: "删除成功"
        });
        this.getList();
      });
    },
    deleteData(product) {
      this.$confirm(`您确定删除产品${product.productName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.delete("/product/"+product.id).then(res => {
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
          this.request.post("/product",this.form).then(res=>{
            if(res.code==200){
              // 成功提示
              this.$message({
                message: "产品更新成功",
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
    addData(){
      this.dialogFormVisible = true
      this.$nextTick(()=>{
        this.resetForm()
      })


    },
    modData(row){
      this.request.get("/product/"+row.id).then(res=>{
        // console.log(res)
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
      this.productName=""
      this.id=null
    },
    search(){
      this.pageNum=1
      this.getList()
    },
    getList(){
      //请求分页查询数据
      this.request.get("/product/page",
          {params:{
              pageNum:this.pageNum,
              pageSize:this.pageSize,
              productName:this.productName,
              id:this.id,
            }}).then(res=>{
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
    handleAvatarSuccess(res) {
      this.form.picUrl = res
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 3;

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 3MB!');
      }
      return isLt2M;
    }
  },
  created() {
    //请求分页查询数据
    this.getList()

  },
}
</script>

<style scoped>
.avatar-uploader {
  text-align: left;
  padding-bottom: 10px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>