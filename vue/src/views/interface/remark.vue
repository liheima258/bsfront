<template>
  <div>
    <div style="display: flex;height: 100%">
      <el-card style="width: 100%;margin-right: 10px">
        <div style="margin-top:10px;margin-bottom: 20px">
          <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="conditions.remarktime"
              type="date"
              placeholder="留言日期">
          </el-date-picker>
          <el-button  @click="showAll" type="primary" size="small" style="width:120px;margin-left: 20px"  round>搜索</el-button>
        </div>
        <el-table :data="records" :header-cell-style="{textAlign: 'center'}" :cell-style="{ textAlign: 'center' }" border="true">
          <el-table-column label="用户名" prop="uname"></el-table-column>
          <el-table-column label="留言时间" prop="remarktime"></el-table-column>
          <el-table-column label="消息内容" prop="content"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="deleteRemark(scope.row)" type="danger" plain>删除</el-button>
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
  name: 'remark',
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
        remarktime:""
      }
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
      this.$request.post('/remark/selectAll?token=' + this.token + '&size=' + this.size + '&current=' +this.current,this.conditions).then(res => {
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
    deleteRemark(e){
      if (this.nowManager.mstatus === '禁止操作') {
        this.$message.error("无法删除!您没有删除权限!")
      } else {
        this.$confirm('此操作将永久删除该留言', '是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$request.delete('/remark/delete?id=' + e.id + '&token=' + this.token).then(res => {
            this.$message.success("删除成功")
            this.showAll()
          })
        }).catch(() => {
          this.$message.info("已取消删除!");
        });
      }
    }
  }
}
</script>

