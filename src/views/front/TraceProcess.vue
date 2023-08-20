<template>
<div>
  <el-card class="box-card" v-if="process">
    <div slot="header" class="clearfix">
      <span>加工信息</span>
      <el-button @click="verification" style="float: right; padding: 3px 0;font-size: 16px"  type="text" title="点击进行数据真实性验证">区块链核验</el-button>
    </div>
    <img v-if="process.picUrl" :src="process.picUrl" class="image">
    <div  class="text item">
      加工ID：{{process.id}}
    </div>
    <div  class="text item">
      产品名称：{{process.productName}}
    </div>
    <div  class="text item">
      加工单位：{{process.factoryName}}
    </div>
    <div  class="text item">
      加工时间：{{process.processDate}}
    </div>
  </el-card>
</div>
</template>

<script>
export default {
  name: "TraceProcess",
  props:{
    traceId:String,
  },data(){
    return{
      process:null,
    }
  },
  methods:{
    getList(){
      if(this.traceId!=null&&this.traceId!="") {
        this.request.get("/process/trace/" + this.traceId).then(res => {
          if (res.code == 200) {
            this.process = res.data
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    verification(){
      alert("开发中...")
    }
  },
  created() {
    this.getList()
  }

}
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.image {
  width: 350px;
  display: block;
  margin-bottom:18px ;
}
.box-card {
  width: 650px;
  margin: 0 auto 50px auto;
}
</style>