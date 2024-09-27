<template>
  <div>
    <div style="display: flex;height: 100%">
      <el-card style="width: 100%;margin-right: 10px">
        <div style="margin-top:10px;margin-bottom: 20px">
          <el-input style="width:200px;margin-bottom: 20px;margin-right: 20px" v-model="conditions.uid"
                    placeholder="用户账号"></el-input>
          <el-input style="width:200px;margin-bottom: 20px;margin-right: 20px" v-model="conditions.uname"
                    placeholder="用户姓名"></el-input>
          <el-select v-model="conditions.ustatus" placeholder="用户状态">
            <el-option
                v-for="item in optionsByStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
          <el-button @click="showAll" type="primary" size="small" style="width:120px;margin-left: 20px" round>搜索
          </el-button>
          <el-button @click="addUserForm" type="success" size="small" style="width:120px;margin-left: 20px" round>新增
          </el-button>
        </div>
        <el-table :data="records" :header-cell-style="{textAlign: 'center'}" :cell-style="{ textAlign: 'center' }"
                  border="true">
          <el-table-column label="账号" prop="uid"></el-table-column>
          <el-table-column label="姓名" prop="uname"></el-table-column>
          <el-table-column label="余额" prop="balance">
            <template slot-scope="scope">
              <el-tag size="medium">{{ scope.row.balance }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="ustatus">
            <template slot-scope="scope">
              <el-tag size="medium">{{ scope.row.ustatus }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="权限" prop="uauthority">
            <template slot-scope="scope">
              <el-tag size="medium">{{ scope.row.uauthority }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip content="详细信息" placement="bottom" effect="light">
                <el-button @click="userDetail(scope.row)" style="margin-right: 5px" type="success"
                           icon="el-icon-more" circle></el-button>
              </el-tooltip>
              <el-tooltip content="编辑" placement="bottom" effect="light">
                <el-button @click="userDetail_update(scope.row)" style="margin-right: 5px" type="primary"
                           icon="el-icon-edit" circle></el-button>
              </el-tooltip>
              <el-tooltip v-if="scope.row.uauthority ==='允许预约'?true:false" content="拉黑" placement="bottom"
                          effect="light">
                <el-button @click="blockUser(scope.row)" style="margin-right: 5px" type="info"
                           icon="el-icon-folder-delete" circle></el-button>
              </el-tooltip>
              <el-tooltip v-else content="取消拉黑" placement="bottom" effect="light">
                <el-button @click="removeBlockUser(scope.row)" style="margin-right: 5px" type="info"
                           icon="el-icon-folder-checked" circle></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="bottom" effect="light">
                <el-button @click="deleteUser(scope.row)" style="margin-right: 5px" type="danger"
                           icon="el-icon-delete" circle></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!--      详细信息弹窗-->
    <el-dialog title="详细信息" :visible.sync="dialogFormVisible_detail">
      <el-form :model="oneUser">
        <el-form-item label="账号" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneUser.uid" autocomplete="off" :readonly="true"
                    style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneUser.uname" autocomplete="off" :readonly="true"
                    style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneUser.usex" autocomplete="off" :readonly="true"
                    style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="地址" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneUser.uaddr" autocomplete="off" :readonly="true"
                    style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneUser.uphone" autocomplete="off" :readonly="true"
                    style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneUser.uemail" autocomplete="off" :readonly="true"
                    style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="微信" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneUser.uvx" autocomplete="off" :readonly="true"
                    style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneUser.ustatus" autocomplete="off" :readonly="true"
                    style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="余额" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneUser.balance" autocomplete="off" :readonly="true"
                    style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="权限" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneUser.uauthority" autocomplete="off" :readonly="true"
                    style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--      编辑信息弹窗-->
    <el-dialog title="详细信息" :visible.sync="dialogFormVisible_update">
      <el-form :model="oneUser" :rules="rules" ref="formRef">
        <el-form-item label="账号" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneUser.uid" autocomplete="off" style="margin-left:20px;width: 400px"
                    :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="120px" style="margin-left: 50px" prop="uname">
          <el-input v-model="oneUser.uname" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="120px" style="margin-left: 50px">
          <el-select v-model="oneUser.usex" style="margin-left:20px;width: 400px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址" label-width="120px" style="margin-left: 50px" prop="uaddr">
          <el-input v-model="oneUser.uaddr" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px" style="margin-left: 50px" prop="uphone">
          <el-input v-model="oneUser.uphone" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" style="margin-left: 50px" prop="uemail">
          <el-input v-model="oneUser.uemail" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="微信" label-width="120px" style="margin-left: 50px" prop="uvx">
          <el-input v-model="oneUser.uvx" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneUser.ustatus" autocomplete="off" style="margin-left:20px;width: 400px"
                    :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="余额" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneUser.balance" autocomplete="off" style="margin-left:20px;width: 400px"
                    :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="权限" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneUser.uauthority" autocomplete="off" style="margin-left:20px;width: 400px"
                    :readonly="true"></el-input>
        </el-form-item>
        <el-form-item style="display: flex;align-items: center;justify-content: center">
          <el-button @click="dialogFormVisible_update = false">取 消</el-button>
          <el-button type="primary" @click="updateUser">提 交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--      添加信息弹窗-->
    <el-dialog title="请输入信息" :visible.sync="dialogFormVisible_add">
      <el-form :model="oneUser" :rules="rules" ref="formRef">
        <el-form-item label="账号" label-width="120px" style="margin-left: 50px" prop="uid">
          <el-input v-model="oneUser.uid" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px" style="margin-left: 50px" prop="upassword">
          <el-input v-model="oneUser.upassword" show-password autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" label-width="120px" style="margin-left: 50px" prop="udpassword">
          <el-input v-model="oneUser.udpassword" show-password autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="120px" style="margin-left: 50px" prop="uname">
          <el-input v-model="oneUser.uname" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="120px" style="margin-left: 50px" prop="usex">
          <el-select v-model="oneUser.usex" style="margin-left:20px;width: 400px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址" label-width="120px" style="margin-left: 50px" prop="uaddr">
          <el-input v-model="oneUser.uaddr" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px" style="margin-left: 50px" prop="uphone">
          <el-input v-model="oneUser.uphone" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" style="margin-left: 50px" prop="uemail">
          <el-input v-model="oneUser.uemail" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="微信" label-width="120px" style="margin-left: 50px" prop="uvx">
          <el-input v-model="oneUser.uvx" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item style="display: flex;align-items: center;justify-content: center">
          <el-button @click="dialogFormVisible_add = false">取 消</el-button>
          <el-button type="primary" @click="addUser">提 交</el-button>
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
  name: 'user',
  // 页面内数据
  data() {

    //确认密码验证
    const vaildatePassword = (rule, udpassword, callback) => {
      if (udpassword === '') {
        callback(new Error("请确认密码"))
      } else if (udpassword !== this.oneUser.upassword) {
        callback(new Error("两次输入的密码不一致"))
      } else {
        callback()
      }
    }

    return {
      rules: {
        uid: [
          {required: true, message: '请输入账号', trigger: 'blur'},
          {required: true, pattern: /\D/g, message: '用户名不能全是数字', trigger: 'blur'},
          {required: true, pattern: /^.{1,20}$/, message: '长度在 1 到 20 个字符', trigger: 'blur'}
        ],
        uname: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
          {required: true, pattern: /^.{1,20}$/, message: '长度在 1 到 20 个字符', trigger: 'blur'},
        ],
        usex: [
          {required: true, message: '请选择性别', trigger: 'blur'},
        ],
        uaddr: [
          {required: true, message: '请输入地址', trigger: 'blur'},
        ],
        uphone: [
          {required: true, message: '请输入电话', trigger: 'blur'},
          {
            required: true,
            pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,
            message: '电话输入不合法',
            trigger: 'blur'
          },
        ],
        uvx: [
          {required: true, message: '请输入微信', trigger: 'blur'},
          {required: true, pattern: /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/, message: '微信输入不合法', trigger: 'blur'},
        ],
        uemail: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {
            required: true,
            pattern: /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/,
            message: '邮箱输入不合法',
            trigger: 'blur'
          }
        ],
        upassword: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {
            required: true,
            pattern: /^[a-zA-Z]\w{5,17}$/,
            message: '以字母开头，长度在6~18之间，只能包含字母、数字和下划线',
            trigger: 'blur'
          }
        ],
        udpassword: [
          {validator: vaildatePassword, trigger: 'blur'},
        ],
      },
      token: eval("(" + localStorage.getItem("honey-manager") + ")").token,
      nowManager: eval("(" + localStorage.getItem("honey-manager") + ")") || {},
      nowUser: {},
      dialogFormVisible_detail: false,
      dialogFormVisible_update: false,
      dialogFormVisible_add: false,
      oneUser: {},
      optionsByStatus: [
        {
          value: '全部',
          label: '全部'
        },
        {
          value: '未使用',
          label: '未使用'
        }, {
          value: '预约中',
          label: '预约中'
        },
        {
          value: '待签到',
          label: '待签到'
        },
        {
          value: '使用中',
          label: '使用中'
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
        uid: '',
        uname: '',
        ustatus: ''
      },
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
      this.conditions.uid = ""
      this.conditions.uname = ""
      this.conditions.ustatus = ""
      this.showAll()
    },
    showAll() {
      this.records = []
      this.$request.post('/user/selectAll?token=' + this.token + '&size=' + this.size + '&current=' + this.current, this.conditions).then(res => {
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
    deleteUser(e) {
      if (this.nowManager.mstatus === '禁止操作') {
        this.$message.error("无法删除!您没有删除权限!")
      } else {
        this.$confirm('此操作将永久删除该用户', '是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$request.delete('/user/deleteUser?uid=' + e.uid + '&token=' + this.token).then(res => {
            this.$message.success("删除成功")
            this.returnShowAll()
          })
        }).catch(() => {
          this.$message.info("已取消删除!");
        });
      }
    },
    userDetail(e) {
      this.oneUser = e
      this.dialogFormVisible_detail = true
    },
    userDetail_update(e) {
      if (this.nowManager.mstatus === '禁止操作') {
        this.$message.error("您没有编辑权限!")
      } else {
        this.oneUser = e
        this.dialogFormVisible_update = true
      }
    },
    blockUser(e) {
      if (this.nowManager.mstatus === '禁止操作') {
        this.$message.error("拉黑失败!您没有拉黑权限!")
      } else {
        this.$confirm('此操作将拉黑该用户', '是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$request.put('/user/blockUser?uid=' + e.uid + '&token=' + this.token).then(res => {
            this.$message.success("拉黑成功")
            this.returnShowAll()
          })
        }).catch(() => {
          this.$message.info("已取消拉黑!");
        });
      }
    },
    removeBlockUser(e) {
      if (this.nowManager.mstatus === '禁止操作') {
        this.$message.error("释放失败!您没有释放权限!")
      } else {
        this.$confirm('此操作将释放该管理员', '是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$request.put('/user/removeBlockUser?uid=' + e.uid + '&token=' + this.token).then(res => {
            this.$message.success("释放成功")
            this.returnShowAll()
          })
        }).catch(() => {
          this.$message.info("已取消释放!");
        });
      }
    },
    updateUser() {
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          this.$request.put('/user/updateUser?token=' + this.token, this.oneUser).then(res => {
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
    addUserForm() {
      if (this.nowManager.mstatus === '禁止操作') {
        this.$message.error("您没有添加权限!")
      } else {
        this.dialogFormVisible_add = true
        this.oneUser = {}
      }
    },
    addUser() {
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          this.$request.post('/user/addUser?token=' + this.token, this.oneUser).then(res => {
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