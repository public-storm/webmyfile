<template>
  <div class="login">
    <div style="text-align: center">
      <el-form ref="form" :model="form" style="margin-left: 42%;margin-right: 42%;margin-top: 15%">
        <el-form-item>
          <el-input v-model="form.name" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round @click="onSubmit">登录</el-button>
          <el-button round>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      form: {
        name: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit() {
      console.log(this.form);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
//.login{
//  background:url("../assets/wallhaven-dpdxmm.jpg");
//  width:100%;
//  height:100%;
//  position:fixed;
//  background-size:100% 100%;
//}
</style>
