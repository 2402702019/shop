<template>
    <div>
        <el-card class="box">
            <!-- 面包屑 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 搜索框 -->
            <el-row class="searchBox">
                <el-col>
                    <el-input @clear="getAllUsers()" clearable class="searchInput" placeholder="请输入内容" v-model="query">
                        <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                    <el-button type="primary" @click="showDiaAddUser()">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <el-table :data="list" style="width: 100%">
                <el-table-column prop="id" label="#" width="80">
                </el-table-column>
                <el-table-column prop="username" label="姓名" width="100">
                </el-table-column>
                <el-table-column prop="email" label="邮箱" width="140">
                </el-table-column>
                <el-table-column prop="mobile" label="电话" width="140">
                </el-table-column>
                <el-table-column label="创建日期" width="200">
                    <template slot-scope="scope">
                        {{scope.row.create_time|fmtdate}}
                    </template>
                </el-table-column>
                <el-table-column label="用户状态" width="120">
                    <template slot-scope="scope">
                        <!-- 内容 -->
                        <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
                        <el-button @click="showMsgBox(scope.row)" type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
                        <el-button type="success" icon="el-icon-check" circle size="mini" plain></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

            <el-dialog title="收货地址" :visible.sync="dialogFormVisibleAdd">
                <el-form label-position="left" label-width="80px" :model="formdata">
                    <el-form-item label="用户名">
                        <el-input v-model="formdata.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="formdata.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input v-model="formdata.email"></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input v-model="formdata.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
                    <el-button type="primary" @click="addUser()">确 定</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 2,
      total: -1,
      list: [],
      dialogFormVisibleAdd: false,
      // 表单数据
      formdata: {
        // username	用户名称	不能为空
        // password	用户密码	不能为空
        // email	邮箱	可以为空
        // mobile	手机号	可以为空
        username: "",
        password: "",
        email: "",
        mobile: ""
      }
    };
  },
  created() {
    this.getTableDate();
  },
  methods: {
    //   删除-弹出确认框
    showMsgBox(user) {
      // console.log(user)

      this.$confirm("是否把我删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发送请求
          const res = await this.$http.delete(`users/${user.id}`);
          console.log(res);
          const { meta: { mag, status } } = res.data;
          if (status === 200) {
            // 提示框
            this.$message.success("删除成功!")
            // 更新表格
            this.pagenum = 1
            this.getTableDate()
          }
        })
        .catch(() => {
          this.$message.info("已取消删除")
        });
    },
    //   添加用户-发送请求
    async addUser() {
      // 获取表单数据，发送请求
      const res = this.$http.post(`users`, this.formdata)
      console.log(res);
      // 关闭对话框
      this.dialogFormVisibleAdd = false
      // 更新表格
      this.getTableDate();
    },
    //   添加用户-显示对话框
    showDiaAddUser() {
      this.formdata = {}
      this.dialogFormVisibleAdd = true
    },
    //   清空时获取所有用户
    getAllUsers() {
      this.getTableDate()
    },
    //   搜索用户
    searchUser() {
      this.pagenum = 1
      this.getTableDate()
    },
    //   分页相关的方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableDate();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getTableDate();
    },
    async getTableDate() {
      const AUTH_TOKEN = localStorage.getItem("token");
      console.log(AUTH_TOKEN);

      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      // query	查询参数	可以为空
      // pagenum	当前页码	不能为空
      // pagesize	每页显示条数	不能为空
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      console.log(res);
      const { data, meta: { status, msg } } = res.data;
      if (status === 200) {
        this.total = data.total;
        this.list = data.users;
        // console.log(this.list);
      }
    }
  }
};
</script>
<style>
.searchBox {
  margin-top: 20px;
}
.searchInput {
  width: 400px;
}
</style>
