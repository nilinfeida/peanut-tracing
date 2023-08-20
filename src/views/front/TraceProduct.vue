<template>
<div>
  <el-card class="box-card" v-if="product">
    <div slot="header" class="clearfix">
      <span>产品信息</span>
      <el-button @click="verification" style="float: right; padding: 3px 0;font-size: 16px"  type="text" title="点击进行数据真实性验证">区块链核验</el-button>
    </div>
    <img v-if="product.picUrl" :src="product.picUrl" class="image">
    <div  class="text item">
      产品ID：{{product.id}}
    </div>
    <div  class="text item">
      产品名称：{{product.productName}}
    </div>
    <div  class="text item">
      产品描述：{{product.description}}
    </div>
  </el-card>
</div>
</template>

<script>
export default {
  name: "TraceProduct",
  props:{
    traceId:String,
  },
  data(){
    return{
      product:null,
    }
  },
  methods:{
    getList(){
      if(this.traceId!=null&&this.traceId!=""){
        this.request.get("/product/trace/"+this.traceId).then(res=>{
          if(res.code==200){
            this.product=res.data
          }else{
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