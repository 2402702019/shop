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
      <el-tabs v-model="active" tab-position="left" @tab-click="changeTab()">
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
        <el-tab-pane label="商品参数" name="2">
          <el-form-item :label="item1.attr_name" v-for="(item1) in arrDy" :key="item1.attr_id">
            <!-- {{ checkList}} -->
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="3">
          <el-form-item :label="item.attr_name" v-for="(item) in arrStatic" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="4">
          <el-form-item label="添加图片">
            <!-- header可以设置请求头 -->
            <el-upload :headers="headers" action="http://localhost:8888/api/private/v1/upload" :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="5">
          <el-form-item>
            <el-button @click="addGoods()">添加商品</el-button>

            <quill-editor v-model="form.goods_introduce" class="quill"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
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
        // 获取动态数据
      },
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id"
        // children: "children"
      },
      //   checkList:[],
      // 动态参数的数组
      arrDy: [],
      // 静态参数的数组
      arrStatic: [],
      headers: {
        Authorization: localStorage.getItem("token")
      },
      flag: true
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    async addGoods() {
      // goods_cat	以为','分割的分类列表[1,3,6]	不能为空
      this.form.goods_cat = this.selectedOptions.join(",");

      // pics	上传的图片临时路径（对象）{pic:?临时路径}	可以为空
      // this.pics

      // attrs	商品的参数（数组）	可以为空 [{attr_id:?,attr_value:?}]来源于arrDy和arrStatic

      // 处理动态
      // 1. 遍历 forEach for forin map filter findIndex
      // 2. return 不是条件 "abc"
      // 3. 返回数组

      const arr1 = this.arrDy.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      const arr2 = this.arrStatic.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      this.form.attrs = [...arr1, ...arr2];
      // console.log(this.form);

      // 发送请求
      const res = await this.$http.post(`goods`, this.form);
      console.log(res);
      const { meta: { msg, status } } = res.data;
      if (status === 201) {
        // 列表
        this.$router.push({
          name: "goods"
        });
      } else {
        this.$message.error(msg);
      }
    },
    handleRemove(file, fileList) {
      //   console.log("remove-----");
      //   console.log(file);
      // 图片上传的临时路径->在api-server/tmp_uploads临时路径
      //   file.response.data.tmp_path
      const Index = this.form.pics.findIndex(item => {
        return item.pic === file.response.data.tmp_path;
      });

      this.form.pics.splice(Index, 1);
    },
    handleSuccess(res, file, fileList) {
      //   console.log("success-----");
      // 图片上传的临时路径->在api-server/tmp_uploads临时路径
      // res.data.tmp_path
      //   console.log(res);
      const tmpPath = res.data.tmp_path;
      this.form.pics.push({
        pic: tmpPath
      });
    },
    //   点击任何tab触发
    async changeTab() {
      // 如果点击第二个
      // 如果分类是三级
      if (this.active === "2" || this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          // 提示
          this.$message.error("请先选择三级分类!");
          // 清空
          if (this.active === "2") {
            this.arrDy = [];
          } else {
            this.arrStatic = [];
          }
          return;
        }

        if (this.active === "2" && this.flag === true) {
          // 获取动态数据
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          //   console.log(res);
          const { meta: { msg, status }, data } = res.data;
          if (status === 200) {
            this.arrDy = data;
            console.log("动态数据----");

            // 处理this.arrDy中的每个元素的attr_vals)
            // split ->字符串变数组
            // trim() ->指的是空字符串
            this.arrDy.forEach(item => {
              item.attr_vals =
                item.attr_vals.trim().length === 0
                  ? []
                  : item.attr_vals.trim().split(",");
            });
            console.log(this.arrDy);
            this.flag = false;
          }
        }

        if (this.active === "3") {
          // 获取静态数据
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          // console.log(res);
          const { meta: { msg, status }, data } = res.data;
          if (status === 200) {
            this.arrStatic = data;
            // console.log("静态数据----");
            console.log(this.arrStatic);
          }
        }
      }
    },
    // 获取三级分类的数据
    async getGoodsCate() {
      // type的值[1,2,3]
      const res = await this.$http.get(`categories?type=3`);
      const { meta: { msg, status }, data } = res.data;

      if (status === 200) {
        this.options = data;
        // console.log(this.options);
      }
    },
    handleChange() {}
    // handlePreview(){}
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
  overflow: auto;
}
.ql-editor,
.ql {
  min-height: 200px;
}
</style>
