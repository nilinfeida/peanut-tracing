<template>
<div>
  <!--搜索-->
  <el-card style="margin-bottom: 10px">
    <div class="pd-10">
      <el-input style="width: 200px;margin-right: 10px" v-model="productName" suffix-icon="el-icon-search" placeholder="请输入加工产品名称"  @keyup.enter.native="search"></el-input>
      <el-input style="width: 200px;margin-right: 10px" v-model="id" suffix-icon="el-icon-search" placeholder="请输入加工id"  @keyup.enter.native="search"></el-input>
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
      <el-table-column prop="productName" label="产品名称" width="150" >
      </el-table-column>
      <el-table-column prop="factoryName" label="加工单位" width="150">
      </el-table-column>
      <el-table-column prop="processDate" label="加工日期" width="150">
      </el-table-column>
      <el-table-column  label="绑定原料" width="80">
        <template slot-scope="scope">
          <el-button type="success" @click="plantBinding(scope.row)" title="加工原料绑定" plain>原料</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="material" label="原料来源" width="150">
      </el-table-column>
      <el-table-column prop="traceIds" label="所属溯源链" >
      </el-table-column>
      <el-table-column prop="upload" label="区块链" width="75">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.upload == 1 ? 'primary' : 'info'"
              disable-transitions>{{scope.row.upload==0?"未上链":"已上链"}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column  label="操作" width="230">
        <template slot-scope="scope" >
          <el-button type="primary" @click="uploadBlockChain(scope.row)" title="数据上传区块链" plain>上链</el-button>
          <el-button type="success" @click="traceBinding(scope.row)" title="相关溯源链绑定" plain>溯源</el-button>
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
  <el-dialog title="加工信息" :visible.sync="dialogFormVisible" width="30%" center  @close="resetForm" >
    <el-form :model="form" size="small" label-width="80px"  ref="form" :rules="rules">
      <el-form-item label="产品名称" prop="productName">
        <el-select v-model="form.productName" filterable placeholder="请选择或输入产品名称" >
          <el-option
              v-for="item in productData"
              :key="item.id"
              :label="item.productName"
              :value="item.productName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="加工单位" prop="factoryName">
        <el-input   v-model="form.factoryName" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item label="加工日期" prop="processDate">
        <div class="block">
          <el-date-picker
              v-model="form.processDate"
              type="date"
              placeholder="选择日期时间" value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>

  <!--溯源绑定弹窗表-->
  <el-dialog title="溯源绑定" :visible.sync="dialogTableVisible" width="50%" center   >
    <!--搜索-->
    <el-card style="margin-bottom: 10px">
      <div class="pd-10">
        <el-input style="width: 200px;margin-right: 7px" v-model="dProductName" suffix-icon="el-icon-search" placeholder="请输入产品名称"  @keyup.enter.native="dSearch"></el-input>
        <el-input style="width: 200px;margin-right: 7px" v-model="dId" suffix-icon="el-icon-search" placeholder="请输入溯源链id"  @keyup.enter.native="dSearch"></el-input>
        <el-button class="ml-5" type="primary" round icon="el-icon-search" @click="dSearch">搜索</el-button>
        <el-button type="default" @click="dResetParam" round>重置</el-button>
      </div>
    </el-card>

    <!--数据表单-->
    <el-card>
      <el-table :data="dTableData" stripe @selection-change="dHandleSelectionChange">
        <el-table-column type="selection" width="50">
        </el-table-column>
        <el-table-column prop="id" label="溯源链ID" width="100">
        </el-table-column>
        <el-table-column prop="productName" label="产品名" >
        </el-table-column>
        <el-table-column prop="processId" label="加工ID" width="100">
        </el-table-column>
        <el-table-column prop="upload" label="区块链" width="75">
          <template slot-scope="scope">
            <el-tag
                :type="scope.row.upload == 1 ? 'primary' : 'info'"
                disable-transitions>{{scope.row.upload==0?"未上链":"已上链"}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--分页-->
    <div class="block" style="padding: 10px 0">
      <el-pagination
          @size-change="dHandleSizeChange"
          @current-change="dHandleCurrentChange"
          :current-page="dPageNum"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="dPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="dTotal">
      </el-pagination>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogTableVisible = false">取 消</el-button>
      <el-button type="primary" @click="traceSave">确 定</el-button>
    </div>
  </el-dialog>

  <!--原料绑定弹窗表-->
  <el-dialog title="原料绑定" :visible.sync="dialogPlantVisible" width="60%" center   >
    <!--搜索-->
    <el-card style="margin-bottom: 10px">
      <div class="pd-10">
        <el-input style="width: 200px;margin-right: 7px" v-model="cropName" suffix-icon="el-icon-search" placeholder="请输入作物名称"  @keyup.enter.native="pSearch"></el-input>
        <el-input style="width: 200px;margin-right: 7px" v-model="pId" suffix-icon="el-icon-search" placeholder="请输入作物id"  @keyup.enter.native="pSearch"></el-input>
        <el-button class="ml-5" type="primary" round icon="el-icon-search" @click="pSearch">搜索</el-button>
        <el-button type="default" @click="pResetParam" round>重置</el-button>
      </div>
    </el-card>

    <!--数据表单-->
    <el-card>
      <el-table :data="pTableData" stripe @selection-change="pHandleSelectionChange">
        <el-table-column type="selection" width="50">
        </el-table-column>
        <el-table-column prop="id" label="种植ID" width="100">
        </el-table-column>
        <el-table-column prop="cropName" label="作物名称" width="100" >
        </el-table-column>
        <el-table-column prop="origin" label="作物产地" >
        </el-table-column>
        <el-table-column prop="sowingTime" label="播种时间" width="100">
        </el-table-column>
        <el-table-column prop="harvestTime" label="收获时间" width="100">
        </el-table-column>
        <el-table-column prop="upload" label="区块链" width="75">
          <template slot-scope="scope">
            <el-tag
                :type="scope.row.upload == 1 ? 'primary' : 'info'"
                disable-transitions>{{scope.row.upload==0?"未上链":"已上链"}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--分页-->
    <div class="block" style="padding: 10px 0">
      <el-pagination
          @size-change="pHandleSizeChange"
          @current-change="pHandleCurrentChange"
          :current-page="pPageNum"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pTotal">
      </el-pagination>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogPlantVisible = false">取 消</el-button>
      <el-button type="primary" @click="plantSave">确 定</el-button>
    </div>
  </el-dialog>

</div>
</template>

<script>
import {serverIp} from "../../public/config";
export default {
  name: "Process",
  data(){
    return{
      pTableData:[],
      pTotal :0,
      pPageNum: 1,
      pPageSize: 10,
      cropName: "",
      pId:null,
      tId:null,
      productData:[],
      rId:null,
      productName:"",
      dId:null,
      id:null,
      serverIp: serverIp,
      tableData: [],
      dTableData:[],
      total:0,
      dTotal:0,
      pageNum:1,
      dPageNum:1,
      pageSize:10,
      dPageSize:10,
      dProductName:"",
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogPlantVisible: false,
      form:{},
      rules:{
        productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
        ],
      },
      multipleSelection: [],
      dMultipleSelection: [],
      pMultipleSelection: [],
    }
  },
  methods: {
    getProduct(){
      //请求查询角色数据
      this.request.get("/product").then(res=>{
        // console.log(res)
        if(res.code==200){
          this.productData=res.data

        }else{this.$message.error(res.msg)}

      })
    },
    uploadBlockChain(row) {
      alert("开发中...")
    },
    plantBinding(row){
      this.tId=row.id
      this.getPlantList()
      this.dialogPlantVisible=true
    },
    traceBinding(row) {
      this.rId=row.id
      this.getDialList()
      this.dialogTableVisible=true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    dHandleSelectionChange(val) {
      this.dMultipleSelection = val
    },
    pHandleSelectionChange(val) {
      this.pMultipleSelection = val
    },
    deleteBatch() {
      let ids = this.multipleSelection.map(v => v.id)
      this.request.post("/process/delBatch", ids).then(res => {
        this.$message({
          type: 'success',
          message: "删除成功"
        });
        this.getList();
      });
    },
    deleteData(process) {
      this.$confirm(`您确定删除该条物流信息?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.delete("/process/" + process.id).then(res => {
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: "删除成功"
            });
            this.getList();
          } else {
            alert(res.message)
          }
        });

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    resetForm() {
      this.form = {}
      this.$refs.form.clearValidate();
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.request.post("/process", this.form).then(res => {
            if (res.code == 200) {
              // 成功提示
              this.$message({
                message: "加工信息更新成功",
                type: 'success'
              });
              // 关闭对话框
              this.dialogFormVisible = false;
              // 刷新表格
              this.getList()
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              });
              this.dialogFormVisible = false
            }

          })
        } else {
          console.log("error submit!!");
          return false;
        }
      })
    },
    traceSave(){
      let ids = this.dMultipleSelection.map(v => v.id)
      this.request.post("/process/trace/"+this.rId, ids).then(res => {
        if (res.code == 200) {
          // 成功提示
          this.$message({
            message: "溯源信息绑定成功",
            type: 'success'
          });
          // 关闭对话框
          this.dialogTableVisible = false;
          this.getList()
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          });
          this.dialogTableVisible = false
        }

      })

    },
    plantSave(){
      let ids = this.pMultipleSelection.map(v => v.id)
      console.log(this.tId)
      console.log(ids)
      this.request.post("/process/plant/"+this.tId, ids).then(res => {
        if (res.code == 200) {
          // 成功提示
          this.$message({
            message: "原料信息绑定成功",
            type: 'success'
          });
          // 关闭对话框
          this.dialogPlantVisible = false;
          this.getList()
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          });
          this.dialogPlantVisible = false
        }

      })

    },
    addData() {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.resetForm()
      })


    },
    modData(row) {
      this.request.get("/process/" + row.id).then(res => {
        if (res.code == 200) {
          res = res.data
          this.dialogFormVisible = true
          this.form = res
          // this.form.password=""
        } else {
          alert(res.message)
        }
      })
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getList()
    },
    pHandleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pPageSize = val
      this.getPlantList()
    },
    dHandleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.dPageSize = val
      this.getDialList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pageNum = val
      this.getList()
    },
    dHandleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.dPageNum = val
      this.getDialList()
    },
    pHandleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pPageNum = val
      this.getPlantList()
    },
    resetParam() {
      this.companyName = ""
      this.id = null
    },
    dResetParam() {
      this.productName = ""
      this.dId = null
    },
    pResetParam() {
      this.cropName = ""
      this.pId = null
    },
    search() {
      this.pageNum = 1
      this.getList()
    },
    dSearch() {
      this.dPageNum = 1
      this.getDialList()
    },
    pSearch() {
      this.pPageNum = 1
      this.getPlantList()
    },
    getList() {
      //请求分页查询数据
      this.request.get("/process/page",
          {
            params: {
              pageNum: this.pageNum,
              pageSize: this.pageSize,
              productName: this.productName,
              id: this.id,
            }
          }).then(res => {
        // console.log(res)
        if (res.code == 200) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }

      })
    },
    getDialList(){
      this.request.get("/process/dialog",
          {
            params: {
              dPageNum: this.dPageNum,
              dPageSize: this.dPageSize,
              dProductName: this.dProductName,
              dId:this.dId,
              rId:this.rId,
            }
          }).then(res => {
        if (res.code == 200) {
          this.dTableData=res.data.records
          this.dTotal = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
  getPlantList(){
    this.request.get("/process/plant",
        {
          params: {
            pPageNum: this.pPageNum,
            pPageSize: this.pPageSize,
            cropName: this.cropName,
            pId:this.pId,
          }
        }).then(res => {
      if (res.code == 200) {
        this.pTableData=res.data.records
        this.pTotal = res.data.total
      } else {
        this.$message.error(res.msg)
      }
    })
  },
  },
  created() {
    //请求分页查询数据
    this.getList()
    this.getProduct()
  },
}
</script>

<style scoped>

</style>