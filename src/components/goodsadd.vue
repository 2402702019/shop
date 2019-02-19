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
        <!-- 标签页tabs -->
        <el-form class="form" label-position="top" label-width="80px" :model="form">
            <el-tabs v-model="active" tab-position="left">
                <el-tab-pane label="基本信息" name="1">
                    <el-form-item label="商品名称">
                        <el-input v-model="form.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格">
                        <el-input v-model="form.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量">
                        <el-input v-model="form.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <el-input v-model="form.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        {{selectedOptions}}
                        <el-cascader clearable expand-trigger="hover" :options="options" v-model="selectedOptions" @change="handleChange" :props="defaultProp"></el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="2">商品参数</el-tab-pane>
                <el-tab-pane label="商品属性" name="3">商品属性</el-tab-pane>
                <el-tab-pane label="商品图片" name="4">商品图片</el-tab-pane>
                <el-tab-pane label="商品内容" name="5">商品内容</el-tab-pane>
            </el-tabs>
        </el-form>
    </el-card>
</template>
<script>
export default {
  data() {
    return {
      active: "1",

      // 添加商品请求时的请求体
      // goods_name	商品名称	不能为空
      // goods_price	价格	不能为空
      // goods_number	数量	不能为空
      // goods_weight	重量	不能为空
      // goods_introduce	介绍	可以为空
      form: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      option:[],
      selectedOptions:[],
      defaultProp:{
          label:"",
          value:"",
          children:""
      }
    };
  },
  methods: {
      handleChange(){

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
.form {
    height: 400px;
    overflow:auto
}
</style>


