<template>
<div>
  <!--搜索-->
  <el-card style="margin-bottom: 10px">
    <div class="pd-10">
      <el-input style="width: 200px;margin-right: 10px" v-model="name" suffix-icon="el-icon-search" placeholder="请输入文件名称"  @keyup.enter.native="search"></el-input>
      <el-button class="ml-5" type="primary" round icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="default" @click="resetParam" round>重置</el-button>
    </div>
    <!--新增删除-->
    <div style="margin: 0px 0 0 0;" >
      <el-upload :action="'http://' + serverIp + ':9090/file/upload'" :show-file-list="false"
                 :on-success="handleFileUploadSuccess" style="display: inline-block">
        <el-button type="primary" icon="el-icon-upload2" round >文件上传</el-button>
      </el-upload>
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
      <el-table-column prop="name" label="文件名称" width="180">
      </el-table-column>
      <el-table-column prop="type" label="文件类型" width="180">
      </el-table-column>
      <el-table-column prop="size" label="文件大小(kb)" width="180">
      </el-table-column>
      <el-table-column prop="createTime" label="上传时间" >
      </el-table-column>
      <el-table-column  label="操作" width="100">
        <template slot-scope="scope" >
          <el-button type="primary" icon="el-icon-download" circle title="下载" @click="download(scope.row.url)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle title="删除" @click="deleteFile(scope.row)"></el-button>
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
</div>
</template>

<script>
import {serverIp} from "../../public/config";

export default {
  name: "File",
  data(){

    return{
      serverIp: serverIp,
      tableData: [],
      total:0,
      pageNum:1,
      pageSize:10,
      name:"",
      dialogFormVisible: false,
      multipleSelection: [],
    }
  },
  methods:{
    handleFileUploadSuccess() {
      this.$message.success("导入成功")
      this.getList()
    },
    download(url) {
      window.open(url)
    },
    handleSelectionChange(val){
      this.multipleSelection=val
    },
    deleteBatch(){
      let ids=this.multipleSelection.map(v=>v.id)
      this.request.post("/file/delBatch",ids).then(res => {
        this.$message({
          type: 'success',
          message: "删除成功"
        });
        this.getList();
      });
    },
    deleteFile(file) {
      this.$confirm(`您确定删除用户${file.name}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.delete("/file/"+file.id).then(res => {
          if(res.code==200){
            this.$message({
              type: 'success',
              message: "删除成功"
            });
            this.getList();
          }else{this.$message.error(res.msg)}
        });

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    handleSizeChange(val) {
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
      this.name=""
    },
    search(){
      this.pageNum=1
      this.getList()
    },
    getList(){
      //请求分页查询数据
      this.request.get("/file/page",
          {params:{
              pageNum:this.pageNum,
              pageSize:this.pageSize,
              name:this.name,
            }}).then(res=>{
        // console.log(res)
        if(res.code==200){
          this.tableData=res.data.records
          this.total=res.data.total
        }else{this.$message.error(res.msg)}

      })
    },

  },
  created() {
    //请求分页查询数据
    this.getList()
  },
}
</script>

<style scoped>

</style>