<template>
  <div>
    <div style="display: flex;height: 100%">
            <el-card style="width: 100%;margin-right: 10px">
              <div style="margin-top:10px;margin-bottom: 20px">
                <el-input style="width:200px;margin-bottom: 20px;margin-right: 20px" v-model="conditions.uname" placeholder="预约者姓名"></el-input>
                <el-input style="width:200px;margin-bottom: 20px;margin-right: 20px" v-model="conditions.uphone" placeholder="预约者电话"></el-input>
                <el-button  @click="showAll" type="primary" size="small" style="width:120px;margin-left: 20px"  round>搜索</el-button>
                <el-button  @click="returnShowAll" type="primary" size="small" style="width:120px;margin-left: 20px"  round>刷新</el-button>
              </div>
              <el-table :data="records" :header-cell-style="{textAlign: 'center'}" :cell-style="{ textAlign: 'center' }" border="true">
                <el-table-column label="用户名" prop="uname">
                  <template slot-scope="scope">
                    <el-tag size="medium">{{scope.row.uname}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="用户电话" prop="uphone"></el-table-column>
                <el-table-column label="所属楼层" prop="fname"></el-table-column>
                <el-table-column label="所属自习室" prop="rname"></el-table-column>
                <el-table-column label="座位号" prop="sname"></el-table-column>
                <el-table-column label="开始时间" prop="starttime"></el-table-column>
                <el-table-column label="结束时间" prop="excepttime"></el-table-column>
                <el-table-column label="审核">
                  <template slot-scope="scope">
                    <el-button @click="allow(scope.row)" type="primary" plain>通过</el-button>
                    <el-button @click="refuse(scope.row)" type="danger" plain>拒绝</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
    <!--      分页-->
    <div class="block" style="margin-left: 380px">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="current"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>


<script>

export default {
  name: 'appointment',
  // 页面内数据
  data() {
    return {
      token: eval("(" + localStorage.getItem("honey-manager") + ")").token,
      nowManager: eval("(" + localStorage.getItem("honey-manager") + ")") || {},
      current: 1,
      size: 5,
      total: 0,
      records:[],
      //查询条件
      conditions:{
        uname:'',
        uphone:''
      },
    }
  },
  //拦截处理
  beforeMount() {
    if(eval ("(" + localStorage.getItem("honey-manager") + ")") === "" || eval ("(" + localStorage.getItem("honey-manager") + ")") === null){
      this.$router.push("/login")
    }
  },
  // 当页面加载好之后，请求数据
  mounted() {
    this.showAll()
  },
  methods:{
    handleSizeChange(size){
      this.size = size
      this.showAll()
    },
    handleCurrentChange(current){
      this.current = current
      this.showAll()
    },
    showAll(){
      this.records = []
      this.$request.post('/appointment/allRequest?token=' + this.token + '&size=' + this.size + '&current=' +this.current,this.conditions).then(res => {
        if (res.code === '200'){
          this.records=res.data.records
          this.size=res.data.size
          this.current=res.data.current
          this.total=res.data.total
        }else {
          this.$message.error(res.msg)
        }
      })
    },
    returnShowAll(){
      this.conditions.uname=""
      this.conditions.uphone=""
      this.showAll()
    },
    allow(e){
      if (this.nowManager.mstatus === '禁止操作') {
        this.$message.error("无法操作!您没有权限!")
      }else {
        this.$confirm('此操作将允许用户使用该座位', '是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.$request.put('/appointment/allow?token=' + this.token, e).then(res => {
            if (res.code === '200') {
              this.$message.success("审核完成，用户开始使用座位!")
              this.returnShowAll();
            } else {
              //反应错误信息
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {
          this.$message.info("已取消操作!");
        });
      }
    },
    refuse(e){
      if (this.nowManager.mstatus === '禁止操作') {
        this.$message.error("无法操作!您没有权限!")
      }else {
        this.$confirm('此操作将拒绝用户使用该座位', '是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.$request.put('/appointment/refuse?token=' + this.token, e).then(res => {
            if (res.code === '200') {
              this.$message.success("审核完成，拒绝用户使用座位!")
              this.returnShowAll();
            } else {
              //反应错误信息
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {
          this.$message.info("已取消操作!");
        });
      }
    }
  }
}
</script>

