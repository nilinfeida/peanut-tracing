<template>
<div>
  <el-card class="box-card" v-if="sale">
    <div slot="header" class="clearfix">
      <span>销售信息</span>
      <el-button @click="verification" style="float: right; padding: 3px 0;font-size: 16px"  type="text" title="点击进行数据真实性验证">区块链核验</el-button>
    </div>
    <img v-if="sale.picUrl" :src="sale.picUrl" class="image">
    <div  class="text item">
      销售ID：{{sale.id}}
    </div>
    <div  class="text item">
      经销商：{{sale.dealer}}
    </div>
    <div  class="text item">
      营业执照：{{sale.businessLicense}}
    </div>
    <div  class="text item">
      联系方式：{{sale.phone}}
    </div>
    <div  class="text item">
      联系地址：{{sale.address}}
    </div>
  </el-card>
</div>
</template>

<script>
export default {
  name: "TraceSale",
  props:{
    traceId:String,
  },
  data(){
    return{
      sale:null,
    }
  },
  methods:{
    getList(){
      if(this.traceId!=null&&this.traceId!="") {
        this.request.get("/sale/trace/" + this.traceId).then(res => {
          if (res.code == 200) {
            this.sale = res.data
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