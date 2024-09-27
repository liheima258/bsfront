<template>
  <div>
    <el-container>
      <el-aside :width="asideWidth" style="height:100vh;background-color:#001529">
        <div
            style="background-color:#001529;height: 60px;color: white;display: flex;align-items: center;justify-content: center;">
          <img src="@/assets/logo.png" style="width: 40px;height: 40px">
        </div>
        <el-menu router="true" :collapse="isCollapse" :collapse-transition="false" background-color="#001529"
                 text-color="rgba(255,255,255,0.65)" active-text-color="#fff" style="border: none"
                 :default-active="$route.path">
          <el-menu-item index="/index"><i class="el-icon-s-home"/><span slot="title">首页</span></el-menu-item>
          <el-menu-item index="/manager"><i class="el-icon-user-solid"/><span slot="title">管理员列表</span>
          </el-menu-item>
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-s-tools"/><span slot="title">位置管理</span></template>
            <el-menu-item index="/floor"><i class="el-icon-place"/><span slot="title">楼层管理</span></el-menu-item>
            <el-menu-item index="/room"><i class="el-icon-s-grid"/><span slot="title">自习室管理</span></el-menu-item>
            <el-menu-item index="/seat"><i class="el-icon-coordinate"/><span slot="title">座位管理</span></el-menu-item>
          </el-submenu>
          <el-menu-item index="/appointment"><i class="el-icon-circle-plus-outline"/><span slot="title">预约管理</span>
          </el-menu-item>
          <el-menu-item index="/user"><i class="el-icon-user"/><span slot="title">用户列表</span></el-menu-item>
          <el-menu-item index="/notice"><i class="el-icon-s-order"/><span slot="title">公告管理</span></el-menu-item>
          <el-menu-item index="/remark"><i class="el-icon-edit"/><span slot="title">留言管理</span></el-menu-item>
        </el-menu>
      </el-aside>


      <el-container>
        <el-header>
          <i :class="collapseIcon" style="font-size: 26px;margin-right: 20px" @click="handleCollapse"></i>

          <div
              style="flex: 1;width: 40px;display: flex;height: 40px;align-items: center;justify-content: flex-end;font-size: 25px">
            <el-tooltip content="全屏" placement="bottom" effect="light"><i class="el-icon-full-screen"
                                                                            @click="handleFull"
                                                                            style="margin-right: 25px"></i></el-tooltip>
            <el-dropdown placement="bottom">
              <div style="display: flex;align-items: center;cursor: default">
                <img src="@/assets/管理员.png" style="width: 40px;margin: 0"/>
                <span style="margin-left: 10px">{{ managerName }}</span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="detail">个人信息</el-dropdown-item>
                  <el-dropdown-item @click.native="updateForm">修改密码</el-dropdown-item>
                  <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </div>
            </el-dropdown>
          </div>
        </el-header>

        <el-main :collapse-transition="false">
          <router-view style="height: 98%"/>
        </el-main>
      </el-container>
    </el-container>

    <!--      修改密码弹窗-->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
      <el-form :model="managerPassword" :rules="rules" ref="updateRef">
        <el-form-item prop="mpassword" label="旧密码" label-width="120px" style="margin-left: 50px">
          <el-input v-model="managerPassword.mpassword" placeholder="请输入旧密码" autocomplete="off"
                    style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item prop="newPassword" label="新密码" label-width="120px" style="margin-left: 50px">
          <el-input show-password placeholder="请输入新密码" v-model="managerPassword.newPassword" autocomplete="off"
                    style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item prop="confirm" label="确认新密码" label-width="120px" style="margin-left: 50px">
          <el-input show-password placeholder="请确认新密码" v-model="managerPassword.confirm" autocomplete="off"
                    style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item style="display: flex;align-items: center;justify-content: center">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updatePassword">提 交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--      个人信息弹窗-->
    <el-dialog title="详细信息" :visible.sync="dialogFormVisible_update">
      <el-form :model="oneManager">
        <el-form-item label="账号" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneManager.mid" autocomplete="off" style="margin-left:20px;width: 400px"
                    :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneManager.mname" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="120px" style="margin-left: 50px">
          <el-select v-model="oneManager.msex" style="margin-left:20px;width: 400px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneManager.maddr" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneManager.mphone" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" style="margin-left: 50px">
          <el-input v-model="oneManager.memail" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="微信" label-width="120px" style="margin-left: 50px">
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
  </div>
</template>


<script>

export default {
  name: 'interface',
  // 页面内数据
  data() {
    //确认密码验证
    const vaildatePassword = (rule, confirm, callback) => {
      if (confirm === '') {
        callback(new Error("请确认密码"))
      } else if (confirm !== this.managerPassword.newPassword) {
        callback(new Error("两次输入的密码不一致"))
      } else {
        callback()
      }
    }

    return {
      isCollapse: false,
      asideWidth: '200px',
      collapseIcon: 'el-icon-s-fold',
      managerName: "欢迎：" + eval("(" + localStorage.getItem("honey-manager") + ")").mname,
      token: eval("(" + localStorage.getItem("honey-manager") + ")").token,
      nowManager: eval("(" + localStorage.getItem("honey-manager") + ")") || {},
      managerPassword: {
        mid: "",
        mpassword: "",
        newPassword: "",
        confirm: ""
      },
      rules: {
        newPassword: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
          {
            required: true,
            pattern: /^[a-zA-Z]\w{5,17}$/,
            message: '以字母开头，长度在6~18之间，只能包含字母、数字和下划线',
            trigger: 'blur'
          }
        ],
        mpassword: [
          {required: true, message: '请输入旧密码', trigger: 'blur'},
        ],
        confirm: [
          {validator: vaildatePassword, trigger: 'blur'},
        ]
      },
      oneManager: {},
      options: [{
        value: '男',
        label: '男'
      }, {
        value: '女',
        label: '女'
      }],
      dialogFormVisible_update: false,
      dialogFormVisible: false
    }
  },
  //拦截处理
  beforeMount() {
    if (eval("(" + localStorage.getItem("honey-manager") + ")") === "" || eval("(" + localStorage.getItem("honey-manager") + ")") === null) {
      this.$router.push("/login")
    }
  },
  // 页面内方法
  methods: {
    logout() {
      this.$confirm('是否退出登录', '是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        localStorage.removeItem("honey-manager")  //清除当前的token和管理员数据
        this.$router.push("/login")
      }).catch(() => {
        this.$message.info("已取消操作!");
      });
    },
    updateForm() {
      this.managerPassword.mid = this.nowManager.mid
      this.managerPassword.mpassword = ""
      this.managerPassword.newPassword = ""
      this.managerPassword.confirm = ""
      this.dialogFormVisible = true
    },
    updatePassword() {
      this.$refs['updateRef'].validate((valid) => {
        if (valid) {
          this.$request.put('/manager/updatePassword?token=' + this.token, this.managerPassword).then(res => {
            if (res.code === '200') {
              localStorage.removeItem("honey-manager")  //清除当前的token和管理员数据
              //跳转页面
              this.$router.push('/login')
              this.$message.success("修改成功")
            } else {
              //反应错误信息
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    detail(){
      this.$request.get('/manager/selectOne?mid=' + this.nowManager.mid + '&token=' + this.token).then(res => {
        this.oneManager = res.data
        this.dialogFormVisible_update = true
      })
    },
    updateManager(){
      this.$request.put('/manager/updateManager?token=' + this.token, this.oneManager).then(res => {
        if (res.code === '200') {
          this.$message.success("修改成功")
          this.dialogFormVisible_update = false
        } else {
          //反应错误信息
          this.$message.error(res.msg)
        }
      })
    },
    handleCollapse() {
      this.isCollapse = !this.isCollapse
      this.asideWidth = this.isCollapse ? '60px' : '200px'
      this.collapseIcon = this.isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'
    },
    handleFull() {
      document.documentElement.requestFullscreen()
    }
  }
}
</script>

<style>
.el-menu-item:hover, .el-submenu__title:hover {
  color: #fff !important;
}

.el-menu-item.is-active {
  background-color: #1890ff !important;
  border-radius: 5px !important;
  margin: 4px !important;
}

.el-aside {
  transition: width .3s;
}

.el-header {
  box-shadow: 2px 0 6px rgba(0, 21, 41, 35);
  height: 60px;
  display: flex;
  align-items: center;
}
</style>