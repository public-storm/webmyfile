<template>
  <div>
    <input type="file" @change="handleFileChange"/>
    <el-button @click="handleUpload">上传</el-button>
  </div>
</template>

<script>
const LENGTH = 10; // 切片数量

export default {
  data: () => ({
    container: {
      file: null,
      data: []
    }
  }),
  methods: {
    request() {
    },
    handleFileChange() {
    },
    // 生成文件切片
    createFileChunk(file, length = LENGTH) {
      const fileChunkList = [];
      const chunkSize = Math.ceil(file.size / length);
      let cur = 0;
      while (cur < file.size) {
        fileChunkList.push({file: file.slice(cur, cur + chunkSize)});
        cur += chunkSize;
      }
      return fileChunkList;
    }
    ,
    // 上传切片
    async uploadChunks() {
      const requestList = this.data.map(({chunk}) => {
            const formData = new FormData();
            formData.append("chunk", chunk);
            formData.append("hash", hash);
            formData.append("filename", this.container.file.name);
            return {formData};
          }).map(async ({formData}) => this.request({
                url: "http://localhost:3000",
                data: formData
          }));
      await Promise.all(requestList); // 并发切片
    }
    ,
    async handleUpload() {
      if (!this.container.file) return;
      const fileChunkList = this.createFileChunk(this.container.file);
      this.data = fileChunkList.map(({file},index) => ({
        chunk: file,
        hash:this.container.file.name + "-" + index // 文件名 + 数组下标
    }));
      await this.uploadChunks();
    }
  }
}
;
</script>
