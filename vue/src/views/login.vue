<template>
  <div style="height: 100vh;display:flex;align-items: center;justify-content: center;background-color: #2979e7">
    <div style="display: flex;background-color: white;width: 60%;border-radius: 5px;overflow: hidden">
      <div style="flex: 1">
        <img src="@/assets/login.png" style="width: 100%"/>
      </div>
      <div style="flex: 1;display: flex;align-items: center;justify-content: center">
        <el-form :model="manager" style="width: 80%" :rules="rules" ref="loginRef">
          <div style="text-align:center;font-size: 20px;font-weight: bold;margin-bottom: 20px">欢迎登录后台管理系统
          </div>
          <el-form-item prop="mid">
            <el-input prefix-icon="el-icon-user" size="medium" placeholder="请输入账号"
                      v-model="manager.mid"></el-input>
          </el-form-item>
          <el-form-item prop="mpassword">
            <el-input prefix-icon="el-icon-lock" show-password size="medium" placeholder="请输入密码"
                      v-model="manager.mpassword"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <div style="display: flex">
              <el-input prefix-icon="el-icon-s-promotion" size="medium" placeholder="请输入验证码" style="width: 50%"
                        v-model="manager.code"></el-input>
              <div style="flex: 1;height: 36px">
                <valid-code @update:value="getCode"/>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%" @click="login">登 录</el-button>
          </el-form-item>
          <div style="display: flex ">
            <div style="flex: 1">
              还没有账号？请 <span style="color: #0f9876;cursor: pointer;font-weight: bold"
                                  @click="$router.push('/register')">注册</span>
            </div>
            <div style="flex: 1;text-align: right">
              <span style="color: #b2510c;cursor: pointer;font-weight: bold"
                    @click="$router.push('/forget')">忘记密码</span>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>


import ValidCode from "@/components/ValidCode";

export default {
  name: "login.vue",
  components: {
    ValidCode
  },
  data() {
    // 验证码校验
    const validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else if (value.toLowerCase() !== this.code) {
        callback(new Error('验证码错误'))
      } else {
        callback()
      }
    }

    return {
      code: "",
      manager: {
        mid: '',
        mpassword: '',
        code: ''
      },
      rules: {
        mid: [
          {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        mpassword: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
        code: [
          {validator: validateCode, trigger: 'blur'},
        ]
      }
    }
  },
  methods: {
    getCode(code) {
      this.code = code.toLowerCase()
    },
    login() {
      this.$refs['loginRef'].validate((valid) => {
        if (valid) {
          this.$request.post('/login', this.manager).then(res => {
            if (res.code === '200') {
              //存储用户数据
              localStorage.setItem("honey-manager", JSON.stringify(res.data))
              //跳转页面
              this.$router.push('/interface')
              this.$message.success("登录成功")
            } else {
              //反应错误信息
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
  }
}
</script>

<style scoped>

</style>