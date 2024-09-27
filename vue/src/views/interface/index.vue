<template>
  <div>
    <div style="display: flex;height: 100%">
      <el-card style="width: 100%;margin-right: 10px">
        <div style="margin-top:10px;margin-bottom: 40px">
          <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="conditions.applytime"
              type="date"
              placeholder="预约日期">
          </el-date-picker>
          <el-select v-model="conditions.status" placeholder="当前预约状态" style="margin-left: 30px">
            <el-option
                v-for="item in optionsByStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
          <el-button @click="showAll" type="primary" size="small" style="width:120px;margin-left: 30px" round>搜索
          </el-button>
        </div>
        <el-table :data="records" :header-cell-style="{textAlign: 'center'}" :cell-style="{ textAlign: 'center' }"
                  border="true">
          <el-table-column label="所属楼层" prop="fname"></el-table-column>
          <el-table-column label="所属自习室" prop="rname"></el-table-column>
          <el-table-column label="座位号" prop="sname"></el-table-column>
          <el-table-column label="申请时间" prop="applytime"></el-table-column>
          <el-table-column label="审核时间" prop="audittime"></el-table-column>
          <el-table-column label="预约开始时间" prop="starttime"></el-table-column>
          <el-table-column label="预约结束时间" prop="excepttime"></el-table-column>
          <el-table-column label="实际结束时间" prop="endtime"></el-table-column>
          <el-table-column label="当前状态" prop="status">
            <template slot-scope="scope">
              <el-tag size="medium">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="更多">
            <template slot-scope="scope">
              <el-tooltip content="用户信息" placement="bottom" effect="light">
                <el-button @click="userDetail(scope.row)" style="margin-right: 5px" type="success"
                           icon="el-icon-more-outline" circle></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="bottom" effect="light">
                <el-button @click="deleteLog(scope.row)" style="margin-right: 5px" type="danger"
                           icon="el-icon-delete" circle></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!--      用户信息弹窗-->
    <el-dialog title="详细信息" :visible.sync="dialogFormVisible_detail">
      <el-form :model="oneUser">
        <el-form-item label="账号" label-width="120px" style="margin-left: 130px">
          <el-input v-model="oneUser.uid" autocomplete="off" :readonly="true"
                    style="margin-left:50px;width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="120px" style="margin-left: 130px">
          <el-input v-model="oneUser.uname" autocomplete="off" :readonly="true"
                    style="margin-left:50px;width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px" style="margin-left: 130px">
          <el-input v-model="oneUser.uphone" autocomplete="off" :readonly="true"
                    style="margin-left:50px;width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="支付金额 (单位:金币)" label-width="150px" style="margin-left: 130px">
          <el-input v-model="oneUser.payment" autocomplete="off" :readonly="true"
                    style="margin-left:20px;width: 200px"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
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
  name: 'index',
  // 页面内数据
  data() {
    return {
      token: eval("(" + localStorage.getItem("honey-manager") + ")").token,
      nowManager: eval("(" + localStorage.getItem("honey-manager") + ")") || {},
      current: 1,
      size: 5,
      total: 0,
      records: [],
      //查询条件
      conditions: {
        applytime: '',
        status: ''
      },
      optionsByStatus: [
        {
          value: '全部',
          label: '全部'
        },
        {
          value: '等待审核',
          label: '等待审核'
        },
        {
          value: '等待签到',
          label: '等待签到'
        }, {
          value: '用户取消预约',
          label: '用户取消预约'
        },
        {
          value: '使用中',
          label: '使用中'
        },
        {
          value: '审核不通过',
          label: '审核不通过'
        },
        {
          value: '使用结束',
          label: '使用结束'
        },
      ],
      oneUser: {},
      dialogFormVisible_detail: false
    }
  },
  // 当页面加载好之后，请求数据
  mounted() {
    this.showAll()
  },
  //拦截处理
  beforeMount() {
    if (eval("(" + localStorage.getItem("honey-manager") + ")") === "" || eval("(" + localStorage.getItem("honey-manager") + ")") === null) {
      this.$router.push("/login")
    }
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
    showAll() {
      this.records = []
      this.$request.post('/appointment/selectAll?token=' + this.token + '&size=' + this.size + '&current=' + this.current, this.conditions).then(res => {
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
      this.conditions.applytime = ""
      this.conditions.status = ""
      this.showAll()
    },
    userDetail(e) {
      this.oneUser = e
      this.dialogFormVisible_detail = true
    },
    deleteLog(e){
      if (this.nowManager.mstatus === '禁止操作') {
        this.$message.error("无法删除!您没有删除权限!")
      } else {
        this.$confirm('此操作将永久删除该记录', '是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$request.delete('/appointment/deleteLog?token=' + this.token + '&id=' + e.id).then(res => {
            if (res.code === '200') {
              this.$message.error("删除成功")
              this.returnShowAll()
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {
          this.$message.info("已取消删除!");
        });
      }
    }
  }
}
</script>
