<template>
<div>
  <el-card class="box-card" v-if="logistics">
    <div slot="header" class="clearfix">
      <span>物流信息</span>
      <el-button @click="verification" style="float: right; padding: 3px 0;font-size: 16px"  type="text" title="点击进行数据真实性验证">区块链核验</el-button>
    </div>
    <img v-if="logistics.picUrl" :src="logistics.picUrl" class="image">
    <div  class="text item">
      物流ID：{{logistics.id}}
    </div>
    <div  class="text item">
      物流公司：{{logistics.companyName}}
    </div>
    <div  class="text item">
      发货地点：{{logistics.shipAddress}}
    </div>
    <div  class="text item">
      收货地点：{{logistics.destination}}
    </div>
    <div  class="text item">
      发货时间：{{logistics.startTime}}
    </div>
    <div  class="text item">
      收货时间：{{logistics.endTime}}
    </div>
  </el-card>
</div>
</template>

<script>
export default {
  name: "TraceLogistics",
  props:{
    traceId:String,
  },data(){
    return{
      logistics:null,
    }
  },
  methods:{
    getList(){
      if(this.traceId!=null&&this.traceId!="") {
        this.request.get("/logistics/trace/" + this.traceId).then(res => {
          if (res.code == 200) {
            this.logistics = res.data
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