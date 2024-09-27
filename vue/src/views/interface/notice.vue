<template>
  <div>

    <div style="display: flex;height: 100%">
      <el-card style="width: 100%;margin-right: 10px">
        <div style="margin-left: 20px;margin-bottom: 30px;margin-top: 10px">
          <el-input style="width:200px;margin-bottom: 20px;margin-right: 15px" v-model="conditions.outline" placeholder="公告标题"></el-input>
          <el-button @click="showAll" type="primary" size="small" style="width:120px;margin-left: 10px" round>
            搜索
          </el-button>
          <el-button @click="addNoticeForm" type="success" size="small" style="width:150px;margin-left: 30px" round>新增公告</el-button>
        </div>
        <el-table :data="records" :header-cell-style="{textAlign: 'center'}" :cell-style="{ textAlign: 'center' }"
                  border="true">
          <el-table-column label="大标题" prop="outline"></el-table-column>
          <el-table-column label="小标题" prop="title"></el-table-column>
          <el-table-column label="内容" type="textarea" prop="content"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip content="编辑" placement="bottom" effect="light">
                <el-button @click="updateForm(scope.row)" style="margin-right: 5px" type="primary"
                           icon="el-icon-edit" circle></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="bottom" effect="light">
                <el-button @click="deleteNotice(scope.row)" style="margin-right: 5px" type="danger" icon="el-icon-delete" circle></el-button>
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
    <!--      添加公告弹窗-->
    <el-dialog title="请输入信息" :visible.sync="dialogFormVisible_add">
      <el-form :model="newNotice" >
        <el-form-item label="大标题" label-width="120px" style="margin-left: 50px">
          <el-input v-model="newNotice.outline" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="小标题" label-width="120px" style="margin-left: 50px">
          <el-input v-model="newNotice.title" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="内容" label-width="120px" style="margin-left: 50px">
          <el-input v-model="newNotice.content"  type="textarea"  autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item style="display: flex;align-items: center;justify-content: center">
          <el-button @click="dialogFormVisible_add = false">取 消</el-button>
          <el-button type="primary" @click="addNotice">提 交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--      修改公告弹窗-->
    <el-dialog title="座位信息" :visible.sync="dialogFormVisible_update">
      <el-form :model="newNotice">
        <el-form-item label="大标题" label-width="120px" style="margin-left: 50px">
          <el-input v-model="newNotice.outline" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="小标题" label-width="120px" style="margin-left: 50px">
          <el-input v-model="newNotice.title" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="内容" label-width="120px" style="margin-left: 50px">
            <el-input type="textarea" v-model="newNotice.content" autocomplete="off" style="margin-left:20px;width: 400px"></el-input>
        </el-form-item>
        <el-form-item style="display: flex;align-items: center;justify-content: center">
          <el-button @click="dialogFormVisible_update = false">取 消</el-button>
          <el-button type="primary" @click="updateNotice">提 交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>


<script>

export default {
  name: 'notice',
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
        outline:""
      },
      dialogFormVisible_add : false,
      dialogFormVisible_update : false,
      newNotice : {
        id :"",
        outline:"",
        title:"",
        content:""
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
      this.$request.post('/notice/selectAll?token=' + this.token + '&size=' + this.size + '&current=' +this.current,this.conditions).then(res => {
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
    deleteNotice(e){
      if (this.nowManager.mstatus === '禁止操作') {
        this.$message.error("无法删除!您没有删除权限!")
      }else {
        this.$confirm('此操作将永久删除该公告', '是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$request.delete('/notice/deleteNotice?id=' + e.id + '&token=' + this.token).then(res => {
            this.$message.success("删除成功")
            this.showAll()
          })
        }).catch(() => {
          this.$message.info("已取消删除!");
        });
      }
    },
    addNoticeForm(){
      if (this.nowManager.mstatus === '禁止操作') {
        this.$message.error("您没有添加权限!")
      } else {
        this.dialogFormVisible_add = true
        this.newNotice={}
      }
    },
    addNotice(){
      this.$request.post('/notice/addNotice?token='+this.token, this.newNotice).then(res => {
        if (res.code === '200') {
          this.$message.success("添加成功")
          this.dialogFormVisible_add = false
          this.showAll()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    updateForm(e){
      if (this.nowManager.mstatus === '禁止操作') {
        this.$message.error("您没有修改权限!")
      } else {
        this.newNotice.id = e.id
        this.newNotice.outline=e.outline
        this.newNotice.title=e.title
        this.newNotice.content= e.content
        this.dialogFormVisible_update = true
      }
    },
    updateNotice(){
      if (this.newNotice.outline === "" || this.newNotice.title ==="" || this.newNotice.content === ""){
        this.$message.error("输入不能为空!")
      }else{
        this.$request.put('/notice/updateNotice?token=' + this.token, this.newNotice).then(res => {
          if (res.code === '200') {
            this.$message.success("修改成功")
            this.dialogFormVisible_update = false
            this.showAll();
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

