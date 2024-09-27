<template>
  <div>
          <div style="display: flex;height: 100%">
            <el-card style="width: 100%;margin-right: 10px">
              <div style="margin-top:10px;margin-bottom: 20px">
                <el-input style="width:200px;margin-bottom: 20px;margin-right: 20px" v-model="conditions.rname" placeholder="自习室名称"></el-input>
                <el-input style="width:200px;margin-bottom: 20px;margin-right: 20px" v-model="conditions.sname" placeholder="座位号"></el-input>
                <el-select v-model="conditions.status" placeholder="座位状态">
                  <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
                <el-button  @click="showAll" type="primary" size="small" style="width:120px;margin-left: 20px"  round>搜索</el-button>
                <el-button  @click="addSeatForm" type="success" size="small" style="width:120px;margin-left: 20px"  round>新增座位</el-button>
              </div>
              <el-table :data="records" :header-cell-style="{textAlign: 'center'}" :cell-style="{ textAlign: 'center' }" border="true" >
                <el-table-column label="所属楼层" prop="fname"></el-table-column>
                <el-table-column label="所属自习室" prop="rname"></el-table-column>
                <el-table-column label="座位号" prop="sname"></el-table-column>
                <el-table-column label="座位状态" prop="status">
                  <template slot-scope="scope">
                    <el-tag size="medium">{{scope.row.status}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-tooltip content="编辑" placement="bottom" effect="light">
                      <el-button @click="updateForm(scope.row)" style="margin-right: 5px" type="primary"
                                 icon="el-icon-edit" circle></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="bottom" effect="light">
                      <el-button @click="deleteSeat(scope.row)" style="margin-right: 5px" type="danger" icon="el-icon-delete" circle></el-button>
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
    <!--      修改座位弹窗-->
    <el-dialog title="座位信息" :visible.sync="dialogFormVisible_update">
      <el-form :model="newSeat">
        <el-form-item label="座位名称" label-width="120px" style="margin-left: 50px">
          <el-input v-model="newSeat.sname" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item style="display: flex;align-items: center;justify-content: center">
          <el-button @click="dialogFormVisible_update = false">取 消</el-button>
          <el-button type="primary" @click="updateSeat">提 交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--      添加座位弹窗-->
    <el-dialog title="请输入信息" :visible.sync="dialogFormVisible_add">
      <el-form :model="newSeat">
        <el-form-item label="所属楼层" label-width="120px" style="margin-left: 50px">
          <el-select @change="optionsForRoom" v-model="newSeat.fname" style="margin-left:20px;width: 400px">
            <el-option v-for="item in optionsFloor" v-if="item.value != '全部'" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属自习室" label-width="120px" style="margin-left: 50px">
          <el-select v-model="newSeat.rname" style="margin-left:20px;width: 400px">
            <el-option v-for="item in optionsRoom"  :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="座位名称" label-width="120px" style="margin-left: 50px">
          <el-input v-model="newSeat.sname" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item style="display: flex;align-items: center;justify-content: center">
          <el-button @click="dialogFormVisible_add = false">取 消</el-button>
          <el-button type="primary" @click="addSeat">提 交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>


<script>

export default {
  name: 'seat',
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
        rname:"",
        sname:"",
        status:""
      },
      options: [{
        value: '全部',
        label: '全部'
      }, {
        value: '空闲',
        label: '空闲'
      },{
        value: '使用中',
        label: '使用中'
      }],
      dialogFormVisible_add:false,
      dialogFormVisible_update : false,
      newSeat: {
        sid:"",
        fname:"",
        rname:"",
        sname:"",
        status:""
      },
      oldSeatName:"",
      optionsFloor:[],
      optionsRoom:[]
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
    optionsForFloor(){
      this.$request.get('/room/selectFloor?token=' + this.token).then(res => {
        if (res.code === '200'){
          this.optionsFloor=res.data
        }else {
          this.$message.error(res.msg)
        }
      })
    },
    optionsForRoom(){
      this.newSeat.rname=""
      this.$request.get('/seat/selectRoom?token=' + this.token+'&fname='+this.newSeat.fname).then(res => {
        if (res.code === '200'){
          this.optionsRoom=res.data
        }else {
          this.$message.error(res.msg)
        }
      })
    },
    showAll() {
      this.records = []
      this.$request.post('/seat/selectAll?token=' + this.token + '&size=' + this.size + '&current=' +this.current,this.conditions).then(res => {
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
      this.conditions.rname=""
      this.conditions.sname=""
      this.conditions.status=""
      this.showAll()
    },
    deleteSeat(e){
      if (this.nowManager.mstatus === '禁止操作') {
        this.$message.error("无法删除!您没有删除权限!")
      }else if(e.status === "使用中"){
        this.$message.error("无法删除!当前座位在使用中!")
      } else {
        this.$confirm('此操作将永久删除该座位', '是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$request.delete('/seat/deleteSeat?sid=' + e.sid +'&token=' + this.token).then(res => {
            this.$message.success("删除成功")
            this.returnShowAll()
          })
        }).catch(() => {
          this.$message.info("已取消删除!");
        });
      }
    },
    addSeatForm(){
      if (this.nowManager.mstatus === '禁止操作') {
        this.$message.error("您没有添加权限!")
      } else {
        this.optionsForFloor()
        this.dialogFormVisible_add = true
        this.newSeat.fname=""
        this.newSeat.rname=""
        this.newSeat.sname=""
      }
    },
    addSeat(){
      this.$request.post('/seat/addSeat?token='+this.token, this.newSeat).then(res => {
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
        this.newSeat.sid=e.sid
        this.newSeat.fname=e.fname
        this.newSeat.rname= e.rname
        this.newSeat.sname=e.sname
        this.newSeat.status = e.status
        this.oldSeatName = e.sname
        this.dialogFormVisible_update = true
      }
    },
    updateSeat(){
      if (this.newSeat.sname === ""){
        this.$message.error("输入不能为空!")
      }else{
        this.$request.put('/seat/updateSeat?token=' + this.token+'&oldSeatName='+this.oldSeatName, this.newSeat).then(res => {
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

