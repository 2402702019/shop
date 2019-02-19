<template>
    <el-card class="box">
        <!-- 面包屑 -->
        <cus-bread level1="权限管理" level2="角色列表"></cus-bread>
        <el-button class="btn" type="primary">添加角色</el-button>
        <!-- 表格 -->
        <el-table :data="roles" style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <!-- 行列 -->
                    <!--  el-row>(el-col>el-tag+el-col>el-row>(el-col>el-tag+el-col>el-tag))-->
                    <el-row class="level1" v-for="(item1,i) in scope.row.children" :key="item1.id">
                        <el-col :span="4">
                            <el-tag @close="deleRights(scope.row,item1)" closable type="danger">{{item1.authName}}</el-tag>
                            <i class="el-icon-arrow-right"></i>
                        </el-col>
                        <el-col :span="20">
                            <el-row class="level2" v-for="(item2,i) in item1.children" :key="item2.id">
                                <el-col :span="4">
                                    <el-tag @close="deleRights(scope.row,item2)" closable type="info">{{item2.authName}}</el-tag>
                                    <i class="el-icon-arrow-right"></i>
                                </el-col>
                                <el-col :span="20">
                                    <el-tag @close="deleRights(scope.row,item3)" closable v-for="(item3,i) in item2.children" :key="item3.id" type="warning">{{item3.authName}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-row v-if="scope.row.children.length===0">
                        <el-col>
                            <span>未分配权限</span>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="160">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称" width="200">
            </el-table-column>
            <el-table-column prop="roleDesc" label="角色描述 " width="200">
            </el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
                    <el-button @click="showDiaSetRights(scope.row)" icon="el-icon-check" circle size="mini" plain></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 对话框-分配权限 -->
        <el-dialog title="分配权限" :visible.sync="dialogFormVisible">
            <!-- node-key  是每个节点的唯一标识，都来源于treedata中的key 名 -->
            <el-tree ref="treeDom" :data="treedata" show-checkbox node-key="id" default-expand-all :default-checked-keys="arrCheck" :props="defaultProps">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible  = false">取 消</el-button>
                <el-button type="primary" @click="setRights()">确 定</el-button>
            </div>
        </el-dialog>

    </el-card>
</template>
<script>
export default {
  data () {
    return {
      roles: [],
      dialogFormVisible: false,
      //   树形结构所绑定的数据
      treedata: [],
      //   默认展开的数据（被展开的节点的id）
      //   arrExpand: [],
      //   默认选中的数据（被选中的节点的id）
      arrCheck: [],
      //   配置选项
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      //   当前角色id
      currRoleId: -1
    }
  },
  created () {
    this.getRoles()
  },
  methods: {
    //   分配权限
    async setRights () {
      const arr1 = this.$refs.treeDom.getCheckedKeys()
      //   console.log(arr1);

      const arr2 = this.$refs.treeDom.getHalfCheckedKeys()
      //   console.log(arr2);

      const arr = [...arr1, ...arr2]
      //  发送请求
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(',')
      })
      console.log(res)
      if (res.data.meta.status === 200) {
        this.dialogFormVisible = false
      }

    //   console.log(this.arrCheck);
    },
    //   取消权限
    async deleRights (role, rights) {
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${rights.id}`
      )
      // console.log(res)
      const { meta: { msg, status }, data } = res.data
      if (status === 200) {
        // 提示
        this.$message.success(msg)
        // 更新
        // this.getRoles();
        role.children = data
      }
    },
    async showDiaSetRights (role) {
      this.currRoleId = role.id
      const res = await this.$http.get(`rights/tree`)
      //   console.log(res);
      const { meta: { msg, status }, data } = res.data
      if (status === 200) {
        this.treedata = data

        //   取出每一层节点的id->arrExpand

        // const arr1 = this.$refs.ref.getCheckedKeys();
        // const arr2 = this.$refs.ref.getHalfCheckedKeys();
        // this.arrCheck = [...arr1,...arr2]
        // console.log(this.arrCheck);
      }

      const temp = []
      role.children.forEach(item1 => {
        //   temp.push(item1.id);
        item1.children.forEach(item2 => {
          // temp.push(item2.id);
          item2.children.forEach(item3 => {
            temp.push(item3.id)
          })
        })
      })
      console.log(temp)
      this.arrCheck = temp

      // 获取当前角色有的权限
      const res2 = await this.$http.get(`roles`)
      console.log(res2.data.data)

      this.dialogFormVisible = true
    },
    async getRoles () {
      const res = await this.$http.get(`roles`)
      this.roles = res.data.data
      console.log(this.roles)
    }
  }
}
</script>
<style>
.box {
  height: 100%;
}
.btn {
  margin-top: 20px;
}
.level1,
level2 {
  margin-bottom: 10px;
}
</style>
