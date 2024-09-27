<template>
  <div style="height: 100vh;display:flex;align-items: center;justify-content: center;background-color: #0f9876">
    <div style="display: flex;background-color: white;width: 60%;border-radius: 5px;overflow: hidden">
      <div style="flex: 1">
        <img src="@/assets/register.png" style="width: 100%"/>
      </div>
      <div style="flex: 1;display: flex;align-items: center;justify-content: center">
        <el-form :model="manager" style="width: 80%" :rules="rules" ref="registerRef">
          <div style="text-align:center;font-size: 20px;font-weight: bold;margin-bottom: 20px">欢迎注册后台管理系统
          </div>
          <el-form-item prop="mid">
            <el-input prefix-icon="el-icon-user" size="medium" placeholder="请输入账号"
                      v-model="manager.mid"></el-input>
          </el-form-item>
          <el-form-item prop="memail">
            <el-input prefix-icon="el-icon-message" size="medium" placeholder="请输入邮箱"
                      v-model="manager.memail"></el-input>
          </el-form-item>
          <el-form-item prop="mpassword">
            <el-input show-password prefix-icon="el-icon-lock" size="medium" placeholder="请输入密码"
                      v-model="manager.mpassword"></el-input>
          </el-form-item>
          <el-form-item prop="confirmPass">
            <el-input show-password prefix-icon="el-icon-lock" size="medium" placeholder="请确认密码"
                      v-model="manager.confirmPass"></el-input>
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
            <el-button type="success" style="width: 100%" @click="register">注册</el-button>
          </el-form-item>
          <div>
              已经有账号？请 <span style="color: #4ca2ab;cursor: pointer;font-weight: bold" @click="$router.push('/login')">登录</span>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>


import ValidCode from "@/components/ValidCode";

export default {
  name: "register.vue",
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

    //确认密码验证
    const vaildatePassword=(rule,confirmPass,callback)=>{
      if(confirmPass === ''){
        callback(new Error("请确认密码"))
      }else if(confirmPass !== this.manager.mpassword){
        callback(new Error("两次输入的密码不一致"))
      }else{
        callback()
      }
    }
    return {
      code: "",
      manager: {
        mid: '',
        memail:'',
        mpassword: '',
        confirmPass:'',
        code:''
      },
      rules: {
        mid: [
          {required: true, message: '请输入账号', trigger: 'blur'},
          {required: true, pattern:/\D/g,message: '用户名不能全是数字',trigger: 'blur'},
          {required: true, pattern:/^.{1,20}$/,message: '长度在 1 到 20 个字符',trigger: 'blur'}
        ],
        memail: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {required: true, pattern: /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/,message: '邮箱输入不合法',trigger: 'blur'}
        ],
        mpassword: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {required: true, pattern: /^[a-zA-Z]\w{5,17}$/,message: '以字母开头，长度在6~18之间，只能包含字母、数字和下划线',trigger: 'blur'}
        ],
        confirmPass: [
          {validator: vaildatePassword, trigger: 'blur'},
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
    register() {
      this.$refs['registerRef'].validate((valid) => {
        if (valid) {
          this.$request.post('/register', this.manager).then(res => {
            if (res.code === '200') {
              //跳转页面
              this.$router.push('/login')
              this.$message.success("注册成功")
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