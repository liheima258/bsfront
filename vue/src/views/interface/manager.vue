<template>
  <div>
    <div style="display: flex;height: 100%">
      <el-card style="width: 100%;margin-right: 10px">
        <div style="margin-top:10px;margin-bottom: 20px">
          <el-input style="width:200px;margin-bottom: 20px;margin-right: 30px" v-model="conditions.mname"
                    placeholder="管理员姓名"></el-input>
          <el-select v-model="conditions.mstatus" placeholder="管理员状态">
            <el-option
                v-for="item in optionsByStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
          <el-button @click="showAll" type="primary" size="small" style="width:120px;margin-left: 30px" round>
            搜索
          </el-button>
          <el-button @click="addManagerForm" type="success" size="small" style="width:120px;margin-left: 30px" round>
            新增
          </el-button>
        </div>
        <el-table :data="records" :header-cell-style="{textAlign: 'center'}" :cell-style="{ textAlign: 'center' }"
                  border="true">
          <el-table-column label="账号" prop="mid"></el-table-column>
          <el-table-column label="姓名" prop="mname"></el-table-column>
          <el-table-column label="状态" prop="mstatus">
            <template slot-scope="scope">
              <el-tag size="medium">{{ scope.row.mstatus }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="身份" prop="mauthority">
            <template slot-scope="scope">
              <el-tag size="medium">{{ scope.row.mauthority }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip content="详细信息" placement="bottom" effect="light">
                <el-button @click="managerDetail(scope.row)" style="margin-right: 5px" type="success"
                           icon="el-icon-more" circle></el-button>
              </el-tooltip>
              <el-tooltip content="编辑" placement="bottom" effect="light">
                <el-button @click="managerDetail_update(scope.row)" style="margin-right: 5px" type="primary"
                           icon="el-icon-edit" circle></el-button>
              </el-tooltip>
              <el-tooltip v-if="scope.row.mstatus ==='正常'?true:false" content="拉黑" placement="bottom"
                          effect="light">
                <el-button @click="blockManager(scope.row)" style="margin-right: 5px" type="info"
                           icon="el-icon-folder-delete" circle></el-button>
              </el-tooltip>
              <el-tooltip v-else content="取消拉黑" placement="bottom" effect="light">
                <el-button @click="removeBlockManager(scope.row)" style="margin-right: 5px" type="info"
                           icon="el-icon-folder-checked" circle></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="bottom" effect="light">
                <el-button @click="deleteManager(scope.row)" style="margin-right: 5px" type="danger"
                           icon="el-icon-delete" circle></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!--      详细信息弹窗-->
    <el-dialog title="详细信息" :visible.sync="dialogFormVisible_detail">
      <el-form :model="oneManager">
        <el-form-item label="账号" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneManager.mid" autocomplete="off" :readonly="true"
                    style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneManager.mname" autocomplete="off" :readonly="true"
                    style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneManager.msex" autocomplete="off" :readonly="true"
                    style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="地址" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneManager.maddr" autocomplete="off" :readonly="true"
                    style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneManager.mphone" autocomplete="off" :readonly="true"
                    style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneManager.memail" autocomplete="off" :readonly="true"
                    style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="微信" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneManager.mvx" autocomplete="off" :readonly="true"
                    style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneManager.mstatus" autocomplete="off" :readonly="true"
                    style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="权限" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneManager.mauthority" autocomplete="off" :readonly="true"
                    style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--      编辑信息弹窗-->
    <el-dialog title="详细信息" :visible.sync="dialogFormVisible_update">
      <el-form :model="oneManager" :rules="rules" ref="formRef">
        <el-form-item label="账号" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneManager.mid" autocomplete="off" style="margin-left:20px;width: 400px"
                    :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="120px" style="margin-left: 50px" prop="mname">
          <el-input v-model="oneManager.mname" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="120px" style="margin-left: 50px">
          <el-select v-model="oneManager.msex" style="margin-left:20px;width: 400px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址" label-width="120px" style="margin-left: 50px" prop="maddr">
          <el-input v-model="oneManager.maddr" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px" style="margin-left: 50px" prop="mphone">
          <el-input v-model="oneManager.mphone" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" style="margin-left: 50px" prop="memail">
          <el-input v-model="oneManager.memail" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="微信" label-width="120px" style="margin-left: 50px" prop="mvx">
          <el-input v-model="oneManager.mvx" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneManager.mstatus" autocomplete="off" style="margin-left:20px;width: 400px"
                    :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="权限" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneManager.mauthority" autocomplete="off" style="margin-left:20px;width: 400px"
                    :readonly="true"></el-input>
        </el-form-item>
        <el-form-item style="display: flex;align-items: center;justify-content: center">
          <el-button @click="dialogFormVisible_update = false">取 消</el-button>
          <el-button type="primary" @click="updateManager">提 交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--      添加信息弹窗-->
    <el-dialog title="请输入信息" :visible.sync="dialogFormVisible_add">
      <el-form :model="oneManager" :rules="rules" ref="formRef">
        <el-form-item label="账号" label-width="120px" style="margin-left: 50px" prop="mid">
          <el-input v-model="oneManager.mid" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px" style="margin-left: 50px" prop="mpassword">
          <el-input v-model="oneManager.mpassword" show-password autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" label-width="120px" style="margin-left: 50px" prop="mdpassword">
          <el-input v-model="oneManager.mdpassword" show-password autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="120px" style="margin-left: 50px" prop="mname">
          <el-input v-model="oneManager.mname" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="120px" style="margin-left: 50px" prop="msex">
          <el-select v-model="oneManager.msex" style="margin-left:20px;width: 400px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址" label-width="120px" style="margin-left: 50px" prop="maddr">
          <el-input v-model="oneManager.maddr" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px" style="margin-left: 50px" prop="mphone">
          <el-input v-model="oneManager.mphone" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" style="margin-left: 50px" prop="memail">
          <el-input v-model="oneManager.memail" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="微信" label-width="120px" style="margin-left: 50px" prop="mvx">
          <el-input v-model="oneManager.mvx" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item style="display: flex;align-items: center;justify-content: center">
          <el-button @click="dialogFormVisible_add = false">取 消</el-button>
          <el-button type="primary" @click="addManager">提 交</el-button>
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
  name: 'manager',
  // 页面内数据
  data() {
    //确认密码验证
    const vaildatePassword = (rule, mdpassword, callback) => {
      if (mdpassword === '') {
        callback(new Error("请确认密码"))
      } else if (mdpassword !== this.oneManager.mpassword) {
        callback(new Error("两次输入的密码不一致"))
      } else {
        callback()
      }
    }
    return {
      rules: {
        mid: [
          {required: true, message: '请输入账号', trigger: 'blur'},
          {required: true, pattern: /\D/g, message: '用户名不能全是数字', trigger: 'blur'},
          {required: true, pattern: /^.{1,20}$/, message: '长度在 1 到 20 个字符', trigger: 'blur'}
        ],
        mname: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
          {required: true, pattern: /^.{1,20}$/, message: '长度在 1 到 20 个字符', trigger: 'blur'},
        ],
        msex: [
          {required: true, message: '请选择性别', trigger: 'blur'},
        ],
        maddr: [
          {required: true, message: '请输入地址', trigger: 'blur'},
        ],
        mphone: [
          {required: true, message: '请输入电话', trigger: 'blur'},
          {
            required: true,
            pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,
            message: '电话输入不合法',
            trigger: 'blur'
          },
        ],
        mvx: [
          {required: true, message: '请输入微信', trigger: 'blur'},
          {required: true, pattern: /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/, message: '微信输入不合法', trigger: 'blur'},
        ],
        memail: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {
            required: true,
            pattern: /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/,
            message: '邮箱输入不合法',
            trigger: 'blur'
          }
        ],
        mpassword: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {
            required: true,
            pattern: /^[a-zA-Z]\w{5,17}$/,
            message: '以字母开头，长度在6~18之间，只能包含字母、数字和下划线',
            trigger: 'blur'
          }
        ],
        mdpassword: [
          {validator: vaildatePassword, trigger: 'blur'},
        ],
      },
      token: eval("(" + localStorage.getItem("honey-manager") + ")").token,
      nowManager: eval("(" + localStorage.getItem("honey-manager") + ")") || {},
      dialogFormVisible_detail: false,
      dialogFormVisible_update: false,
      dialogFormVisible_add: false,
      oneManager: {},
      optionsByStatus: [
        {
          value: '全部',
          label: '全部'
        },
        {
          value: '正常',
          label: '正常'
        }, {
          value: '禁止操作',
          label: '禁止操作'
        }
      ],
      options: [{
        value: '男',
        label: '男'
      }, {
        value: '女',
        label: '女'
      }],
      current: 1,
      size: 5,
      total: 0,
      records: [],
      //查询条件
      conditions: {
        mname: "",
        mstatus: ""
      }
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
  methods: {
    handleSizeChange(size) {
      this.size = size
      this.showAll()
    },
    handleCurrentChange(current) {
      this.current = current
      this.showAll()
    },
    returnShowAll() {
      this.conditions.mname = ""
      this.conditions.mstatus = ""
      this.showAll()
    },
    showAll() {
      this.records = []
      this.$request.post('/manager/selectAll?token=' + this.token + '&size=' + this.size + '&current=' + this.current, this.conditions).then(res => {
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
    deleteManager(e) {
      if (this.nowManager.mauthority === '普通管理员') {
        this.$message.error("无法删除!您没有删除权限!")
      } else {
        this.$confirm('此操作将永久删除该管理员', '是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$request.delete('/manager/deleteManager?mid=' + e.mid + '&token=' + this.token).then(res => {
            this.$message.success("删除成功")
            this.returnShowAll()
          })
        }).catch(() => {
          this.$message.info("已取消删除!");
        });
      }
    },
    managerDetail(e) {
      this.$request.get('/manager/selectOne?mid=' + e.mid + '&token=' + this.token).then(res => {
        this.oneManager = res.data
        this.dialogFormVisible_detail = true
      })
    },
    managerDetail_update(e) {
      if (this.nowManager.mauthority === '普通管理员' && this.nowManager.mid != e.mid) {
        this.$message.error("您没有编辑权限!")
      } else {
        this.$request.get('/manager/selectOne?mid=' + e.mid + '&token=' + this.token).then(res => {
          this.oneManager = res.data
          this.dialogFormVisible_update = true
        })
      }
    },
    blockManager(e) {
      if (this.nowManager.mauthority === '普通管理员') {
        this.$message.error("拉黑失败!您没有拉黑权限!")
      } else {
        this.$confirm('此操作将拉黑该管理员', '是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$request.put('/manager/blockManager?mid=' + e.mid + '&token=' + this.token).then(res => {
            this.$message.success("拉黑成功")
            this.returnShowAll()
          })
        }).catch(() => {
          this.$message.info("已取消拉黑!");
        });
      }
    },
    removeBlockManager(e) {
      if (this.nowManager.mauthority === '普通管理员') {
        this.$message.error("释放失败!您没有释放权限!")
      } else {
        this.$confirm('此操作将释放该管理员', '是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$request.put('/manager/removeBlockManager?mid=' + e.mid + '&token=' + this.token).then(res => {
            this.$message.success("释放成功")
            this.returnShowAll()
          })
        }).catch(() => {
          this.$message.info("已取消释放!");
        });
      }
    },
    updateManager() {
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          this.$request.put('/manager/updateManager?token=' + this.token, this.oneManager).then(res => {
            if (res.code === '200') {
              this.$message.success("修改成功")
              this.dialogFormVisible_update = false
            } else {
              //反应错误信息
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    addManagerForm() {
      if (this.nowManager.mauthority === '普通管理员') {
        this.$message.error("您没有添加权限!")
      } else {
        this.dialogFormVisible_add = true
        this.oneManager = {}
      }
    },
    addManager() {
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          this.$request.post('/manager/addManager?token=' + this.token, this.oneManager).then(res => {
            if (res.code === '200') {
              this.$message.success("添加成功")
              this.dialogFormVisible_add = false
              this.returnShowAll()
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
  }
}
</script>