<template>
  <div style="height: 100vh;display:flex;align-items: center;justify-content: center;background-color: #8A2BE2">
    <div style="display: flex;background-color: white;width: 60%;border-radius: 5px;overflow: hidden">
      <div style="flex: 1">
        <img src="@/assets/login.png" style="width: 100%"/>
      </div>
      <div style="flex: 1;display: flex;align-items: center;justify-content: center">
        <el-form :model="manager" style="width: 80%" :rules="rules" ref="forgetRef">
          <div style="text-align:center;font-size: 20px;font-weight: bold;margin-bottom: 20px">忘记密码
          </div>
          <el-form-item prop="mid">
            <el-input prefix-icon="el-icon-user" size="medium" placeholder="请输入账号"
                      v-model="manager.mid"></el-input>
          </el-form-item>
          <el-form-item prop="memail">
            <el-input prefix-icon="el-icon-message" size="medium" placeholder="请输入邮箱"
                      v-model="manager.memail"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input prefix-icon="el-icon-s-promotion" size="medium" placeholder="请输入验证码" style="width: 50%"
                      v-model="manager.code"></el-input>
            <el-button type="primary" style="margin-left:25px;width: 30%" @click="sendEmailCode">获取验证码</el-button>
          </el-form-item>
          <el-form-item prop="newPassword">
            <el-input show-password prefix-icon="el-icon-lock" size="medium" placeholder="请输入新密码"
                      v-model="manager.newPassword"></el-input>
          </el-form-item>
          <el-form-item prop="confirmPass">
            <el-input show-password prefix-icon="el-icon-lock" size="medium" placeholder="请确认新密码"
                      v-model="manager.confirmPass"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" style="width: 100%" @click="reset">重置密码</el-button>
          </el-form-item>
          <div>
             <span style="color: #4ca2ab;cursor: pointer;font-weight: bold" @click="$router.push('/login')">返回登录界面</span>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  name: "register.vue",
  data() {
    //确认密码验证
    const vaildatePassword=(rule,confirmPass,callback)=>{
      if(confirmPass === ''){
        callback(new Error("请确认密码"))
      }else if(confirmPass !== this.manager.newPassword){
        callback(new Error("两次输入的密码不一致"))
      }else{
        callback()
      }
    }
    return {
      manager: {
        mid: '',
        memail:'',
        code:'',
        newPassword: '',
        confirmPass:''
      },
      rules: {
        mid: [
          {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        memail: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur'},
        ],
        newPassword: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {required: true, pattern: /^[a-zA-Z]\w{5,17}$/,message: '以字母开头，长度在6~18之间，只能包含字母、数字和下划线',trigger: 'blur'}
        ],
        confirmPass: [
          {validator: vaildatePassword, trigger: 'blur'},
        ]
      }
    }
  },
  methods: {
    sendEmailCode(){
      if (!/^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/.test(this.manager.memail)){
        this.$message.error("邮箱输入不合法")
      }else{
        this.$request.get('/sendEmailCode?memail='+this.manager.memail+'&mid='+this.manager.mid).then(res => {
          if (res.code === '200') {
            this.$message.success("发送成功")
          } else {
            //反应错误信息
            this.$message.error(res.msg)
          }
        })
      }
    },
    reset() {
      this.$refs['forgetRef'].validate((valid) => {
        if (valid) {
          this.$request.put('/reset?code='+this.manager.code, this.manager).then(res => {
            if (res.code === '200') {
              //跳转页面
              this.$router.push('/login')
              this.$message.success("重置成功")
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