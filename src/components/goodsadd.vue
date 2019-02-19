<template>
    <el-card class="box">
        <cus-Bread level1='商品管理' level2='商品列表'></cus-Bread>
        <el-alert class="alert" title="消息提示的文案" type="info" center show-icon>
        </el-alert>
        <!-- active*1 ->*1这是字符串变数值的方法  -->
        <el-steps :active="active*1" align-center>
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>
</el-steps>
    </el-card>
</template>
<script>
export default {
    data() {
        return {
            active:"1"
        }
    }
};
</script>
<style>
.box {
  height: 100%;
}
.alert {
    margin-top: 20px;
}
</style>


