<template>
<div>
  <el-card class="box-card"  v-for="plant in plants" :key="plant.id">
    <div slot="header" class="clearfix">
      <span>种植信息</span>
      <el-button @click="verification" style="float: right; padding: 3px 0;font-size: 16px"  type="text" title="点击进行数据真实性验证">区块链核验</el-button>
    </div>
    <img v-if="plant.picUrl" :src="plant.picUrl" class="image">
    <div  class="text item">
      种植ID：{{plant.id}}
    </div>
    <div  class="text item">
      作物名称：{{plant.cropName}}
    </div>
    <div  class="text item">
      种植基地：{{plant.origin}}
    </div>
    <div  class="text item">
      播种时间：{{plant.sowingTime}}
    </div>
    <div  class="text item">
      收获时间：{{plant.harvestTime}}
    </div>
  </el-card>
</div>
</template>

<script>
export default {
  name: "TracePlant",
  props:{
    traceId:String,
  },
  data(){
    return{
      plants:[],
    }
  },
  methods:{
    getList(){
      if(this.traceId!=null&&this.traceId!="") {
        this.request.get("/plant/trace/" + this.traceId).then(res => {
          if (res.code == 200) {
            this.plants = res.data
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