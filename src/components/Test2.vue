<template>
  <div class="container">
    <div class="item">
      <h3>单文件上传</h3>
      <section class="upload_box" id="upload">
        <input type="file" class="upload_inp" style="display: none"></input>
        <div class="upload_button_box">
          <button class="upload_button select">选择文件</button>
          <button class="upload_button upload">上传到服务器</button>
        </div>
        <ul class="upload_list" style="display: none">
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import Upload from '@/js/upload'
export default {
  name: "Test2"
  ,
  mounted() {
    Upload.selectFile()
  }
}
</script>

<style scoped>

</style>
