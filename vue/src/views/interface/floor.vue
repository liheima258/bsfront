<template>
  <div>

    <div style="display: flex;height: 100%">
      <el-card style="width: 100%;margin-right: 10px">
        <div style="margin-left: 20px;margin-bottom: 30px;margin-top: 10px">
          <el-input style="width:200px;margin-bottom: 20px;margin-right: 15px" v-model="conditions.fname" placeholder="楼层名称"></el-input>
          <el-button @click="showAll" type="primary" size="small" style="width:120px;margin-left: 10px" round>
            搜索
          </el-button>
          <el-button @click="addFloorForm" type="success" size="small" style="width:150px;margin-left: 30px" round>新增楼层</el-button>
        </div>
        <el-table :data="records" :header-cell-style="{textAlign: 'center'}" :cell-style="{ textAlign: 'center' }"
                  border="true">
          <el-table-column label="楼层" prop="fname"></el-table-column>
          <el-table-column label="自习室数量" prop="sumroom"></el-table-column>
          <el-table-column label="当前使用人数" prop="usenumber">
            <template slot-scope="scope">
              <el-tag size="medium">{{scope.row.usenumber}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip content="编辑" placement="bottom" effect="light">
                <el-button @click="updateForm(scope.row)" style="margin-right: 5px" type="primary"
                           icon="el-icon-edit" circle></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="bottom" effect="light">
                <el-button @click="deleteFloor(scope.row)" style="margin-right: 5px" type="danger" icon="el-icon-delete" circle></el-button>
              </el-tooltip>
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
    <!--      添加楼层弹窗-->
    <el-dialog title="请输入信息" :visible.sync="dialogFormVisible_add">
      <el-form :model="newFloor">
        <el-form-item label="楼层名称" label-width="120px" style="margin-left: 50px">
          <el-input v-model="newFloor.fname" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item style="display: flex;align-items: center;justify-content: center">
          <el-button @click="dialogFormVisible_add = false">取 消</el-button>
          <el-button type="primary" @click="addFloor">提 交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--      修改楼层弹窗-->
    <el-dialog title="座位信息" :visible.sync="dialogFormVisible_update">
      <el-form :model="newFloor">
        <el-form-item label="楼层名称" label-width="120px" style="margin-left: 50px">
          <el-input v-model="newFloor.fname" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item style="display: flex;align-items: center;justify-content: center">
          <el-button @click="dialogFormVisible_update = false">取 消</el-button>
          <el-button type="primary" @click="updateFloor">提 交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>


<script>

export default {
  name: 'floor',
  // 页面内数据
  data() {
    return {
      token: eval("(" + localStorage.getItem("honey-manager") + ")").token,
      nowManager: eval("(" + localStorage.getItem("honey-manager") + ")") || {},
      current: 1,
      size: 5,
      total: 0,
      records: [],
      conditions:{
        fname : ""
      },
      newFloor:{
        fname: ""
      },
      oldFloorName:"",
      dialogFormVisible_add:false,
      dialogFormVisible_update:false
    }
  },
  //拦截处理
  beforeMount() {
    if (eval("(" + localStorage.getItem("honey-manager") + ")") === "" || eval("(" + localStorage.getItem("honey-manager") + ")") === null) {
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
    showAll() {
      this.records = []
      this.$request.post('/floor/selectAll?token=' + this.token + '&size=' + this.size + '&current=' +this.current,this.conditions).then(res => {
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
    returnShowAll() {
      this.conditions.fname=""
      this.showAll()
    },
    deleteFloor(e){
      if (this.nowManager.mstatus === '禁止操作') {
        this.$message.error("无法删除!您没有删除权限!")
      }else if(e.sumroom != 0){
        this.$message.error("无法删除!当前楼层仍存在自习室!")
      } else {
        this.$confirm('此操作将永久删除该楼层', '是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$request.delete('/floor/deleteFloor?fname=' + e.fname + '&token=' + this.token).then(res => {
            this.$message.success("删除成功")
            this.showAll()
          })
        }).catch(() => {
          this.$message.info("已取消删除!");
        });
      }
    },
    addFloorForm(){
      if (this.nowManager.mstatus === '禁止操作') {
        this.$message.error("您没有添加权限!")
      } else {
        this.dialogFormVisible_add = true
        this.newFloor={}
      }
    },
    addFloor(){
      this.$request.post('/floor/addFloor?token='+this.token, this.newFloor).then(res => {
        if (res.code === '200') {
          this.$message.success("添加成功")
          this.dialogFormVisible_add = false
          this.returnShowAll()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    updateForm(e){
      if (this.nowManager.mstatus === '禁止操作') {
        this.$message.error("您没有修改权限!")
      } else {
        this.newFloor.fname=e.fname
        this.oldFloorName = e.fname
        this.dialogFormVisible_update = true
      }
    },
    updateFloor(){
      if (this.newFloor.fname === ""){
        this.$message.error("输入不能为空!")
      }else{
        this.$request.put('/floor/updateFloor?token=' + this.token+'&oldFloorName='+this.oldFloorName, this.newFloor).then(res => {
          if (res.code === '200') {
            this.$message.success("修改成功")
            this.dialogFormVisible_update = false
            this.returnShowAll();
          } else {
            //反应错误信息
            this.$message.error(res.msg)
          }
        })
      }
    }
  }
}
</script>

