<template>
  <div>
    <div style="display: flex;height: 100%">
      <el-card style="width: 100%;margin-right: 20px">
        <div style="margin-top:10px;margin-bottom: 20px">
          <el-select v-model="conditions.fname" placeholder="所属楼层">
            <el-option
                v-for="item in optionsFloor"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
          <el-input style="width:200px;margin-bottom: 20px;margin-left: 30px" v-model="conditions.rname"
                    placeholder="自习室名称"></el-input>
          <el-button @click="showAll" type="primary" size="small" style="width:120px;margin-left: 30px" round>搜索
          </el-button>
          <el-button @click="addRoomForm" type="success" size="small" style="width:120px;margin-left: 30px" round>
            新增自习室
          </el-button>
        </div>
        <el-table :data="records" :header-cell-style="{textAlign: 'center'}" :cell-style="{ textAlign: 'center' }"
                  border="true">
          <el-table-column label="自习室名称" prop="rname"></el-table-column>
          <el-table-column label="费用 (元/小时)" prop="price">
            <template slot-scope="scope">
              <el-tag size="medium">{{ scope.row.price }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="所属楼层" prop="fname"></el-table-column>
          <el-table-column label="总座位数" prop="sumseat">
            <template slot-scope="scope">
              <el-tag size="medium">{{ scope.row.sumseat }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="剩余座位数" prop="restseat">
            <template slot-scope="scope">
              <el-tag size="medium">{{ scope.row.restseat }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip content="编辑" placement="bottom" effect="light">
                <el-button @click="updateForm(scope.row)" style="margin-right: 5px" type="primary"
                           icon="el-icon-edit" circle></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="bottom" effect="light">
                <el-button @click="deleteRoom(scope.row)" style="margin-right: 5px" type="danger" icon="el-icon-delete"
                           circle></el-button>
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
    <!--      添加自习室弹窗-->
    <el-dialog title="请输入信息" :visible.sync="dialogFormVisible_add">
      <el-form :model="newRoom">
        <el-form-item label="所属楼层" label-width="120px" style="margin-left: 50px">
          <el-select v-model="newRoom.fname" style="margin-left:20px;width: 400px">
            <el-option v-for="item in optionsFloor" v-if="item.value != '全部' " :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="自习室名称" label-width="120px" style="margin-left: 50px">
          <el-input v-model="newRoom.rname" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="自习室价格" label-width="120px" style="margin-left: 50px">
          <el-input v-model="newRoom.price" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item style="display: flex;align-items: center;justify-content: center">
          <el-button @click="dialogFormVisible_add = false">取 消</el-button>
          <el-button type="primary" @click="addRoom">提 交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--      修改自习室弹窗-->
    <el-dialog title="自习室信息" :visible.sync="dialogFormVisible_update">
      <el-form :model="newRoom">
        <el-form-item label="自习室名称" label-width="120px" style="margin-left: 50px">
          <el-input v-model="newRoom.rname" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="自习室价格" label-width="120px" style="margin-left: 50px">
          <el-input v-model="newRoom.price" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item style="display: flex;align-items: center;justify-content: center">
          <el-button @click="dialogFormVisible_update = false">取 消</el-button>
          <el-button type="primary" @click="updateRoom">提 交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>


<script>

export default {
  name: 'room',
  // 页面内数据
  data() {
    return {
      token: eval("(" + localStorage.getItem("honey-manager") + ")").token,
      nowManager: eval("(" + localStorage.getItem("honey-manager") + ")") || {},
      current: 1,
      size: 5,
      total: 0,
      optionsFloor: [],
      records: [],
      //查询条件
      conditions: {
        rname: "",
        fname: "",
      },
      conditionsForFloor: {
        fname: ""
      },
      dialogFormVisible_add: false,
      dialogFormVisible_update: false,
      newRoom: {
        rid:"",
        fname:"",
        rname:"",
        price:""
      },
      oldRoomName: "",
      oldPrice: ""
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
    this.optionsFloor = this.optionsForFloor()
    this.showAll()
  },
  methods: {
    handleSizeChange(size) {
      this.size = size
      this.showAll()
    },
    handleCurrentChange(current) {
      this.current = current
      this.showAll()
    },
    optionsForFloor() {
      this.$request.get('/room/selectFloor?token=' + this.token).then(res => {
        if (res.code === '200') {
          this.optionsFloor = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    showAll() {
      this.records = []
      this.$request.post('/room/selectAll?token=' + this.token + '&size=' + this.size + '&current=' + this.current, this.conditions).then(res => {
        if (res.code === '200') {
          this.records = res.data.records
          this.size = res.data.size
          this.current = res.data.current
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    returnShowAll() {
      this.conditions.fname = ""
      this.conditions.rname = ""
      this.showAll()
    },
    deleteRoom(e) {
      if (this.nowManager.mstatus === '禁止操作') {
        this.$message.error("无法删除!您没有删除权限!")
      } else if (e.sumseat != 0) {
        this.$message.error("无法删除!当前自习室仍存在座位!")
      } else {
        this.$confirm('此操作将永久删除该自习室', '是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$request.delete('/room/deleteRoom?rid=' + e.rid + '&token=' + this.token).then(res => {
            this.$message.success("删除成功")
            this.returnShowAll()
          })
        }).catch(() => {
          this.$message.info("已取消删除!");
        });
      }
    },
    addRoomForm() {
      if (this.nowManager.mstatus === '禁止操作') {
        this.$message.error("您没有添加权限!")
      } else {
        this.dialogFormVisible_add = true
        this.newRoom.rname = ""
        this.newRoom.price = ""
      }
    },
    addRoom() {
      if (this.newRoom.price === "" || this.newRoom.rname === "" || this.newRoom.fname === "") {
        this.$message.error("输入不能为空!")
      } else if (!/^[1-9]\d*$/.test(this.newRoom.price)){
        this.$message.error("价格输入不合法!")
      }else {
        this.$request.post('/room/addRoom?token=' + this.token, this.newRoom).then(res => {
          if (res.code === '200') {
            this.$message.success("添加成功")
            this.dialogFormVisible_add = false
            this.returnShowAll()
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    updateForm(e) {
      if (this.nowManager.mstatus === '禁止操作') {
        this.$message.error("您没有修改权限!")
      } else {
        this.newRoom.rid = e.rid
        this.newRoom.fname = e.fname
        this.newRoom.rname = e.rname
        this.newRoom.price = e.price
        this.oldRoomName = e.rname
        this.oldPrice = e.price
        this.dialogFormVisible_update = true
      }
    },
    updateRoom() {
      if (this.newRoom.price === "" || this.newRoom.rname === "") {
        this.$message.error("输入不能为空!")
      }else if (!/^[1-9]\d*$/.test(this.newRoom.price)){
        this.$message.error("价格输入不合法!")
      }else {
        this.$request.put('/room/updateRoom?token=' + this.token + '&oldRoomName=' + this.oldRoomName + "&oldPrice=" + this.oldPrice, this.newRoom).then(res => {
          if (res.code === '200') {
            this.$message.success("修改成功")
            this.dialogFormVisible_update = false
            this.returnShowAll()
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

