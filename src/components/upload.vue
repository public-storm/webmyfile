<template>
  <div>
    <el-form label-width="80px">
      <el-form-item  prop="file">
        <div class="upload-content">
          <el-upload
              class="upload-demo"
              accept="file"
              ref="upload"
              multiple
              action=""
              :http-request="upload"
              :auto-upload="true">
            <el-button size="small" type="primary">文件上传</el-button>
            <el-button size="small" type="primary" @click="webkitdirectory">文件夹上传</el-button>
          </el-upload>
          <el-progress v-if="uploadProgress" :text-inside="true" :stroke-width="10" :percentage="percentageNum"
                       status="success"></el-progress>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import SparkMD5 from "spark-md5";
import {upload, checkUpload} from "@/api/myfile";


export default {
  name: 'Test',
  data() {
    return {
      // 分片大小
      chunkSize: 1024 * 100,
      // 同时上传数
      requestNum: 5,
      // 进度条百分比
      percentageNum: 0,
      // 进度条显示
      uploadProgress: false
    }
  },
  methods: {
    upload(file) {
      this.uploadProgress = true;
      // 文件
      const f = file.file,
          // 分片大小
          chunkSize = this.chunkSize,
          // 文件唯一标识
          identifier = SparkMD5.hash(f.name),
          // 同时上传数
          requestNum = this.requestNum,
          relativePath = f.webkitRelativePath.substr(0,f.webkitRelativePath.lastIndexOf("/"));
      // 分片列表
      let chunks = [],
          count = 0,
          // 上传列表
          formDataList = [],
          num = 0;
      // 文件分片
      while (count < f.size) {
        chunks.push(f.slice(count, count + chunkSize));
        count += chunkSize;
      }
      // 检查已上传分片
      let q = {}
      q.identifier = identifier;
      q.filename = f.name;
      q.totalChunks = chunks.length;
      checkUpload(q).then(res => {
        if (res.data.code === '100004') {
          let data = res.data.data;
          // 文件未全部上传
          if (!data.skipUpload) {
            // 已上传分片
            let uploaded = data.uploaded;
            const n = 1 / chunks.length * 100;
            a:for (let i = 0; i < chunks.length; i++) {
              for (let j = 0; j < uploaded.length; j++) {
                // 跳过当前分片、进度条增加
                if (i === uploaded[j]) {
                  this.percentageNum += parseInt(n);
                  continue a;
                }
              }
              // 封装上传对象
              let d = this.formData(i, chunkSize, chunks[i], f.name, f.size, relativePath, chunks.length, identifier);
              // 同时上传分组
              if (i === 0 || i % requestNum === 0) {
                let ls = [];
                ls.push(d);
                formDataList.push(ls);
                num++;
              } else {
                formDataList[num - 1].push(d);
              }
            }
            // 文件上传
            this.dataRequest(formDataList, 0, chunks.length);
          } else {
            // 文件已上传
            this.percentageNum = 100;
            setTimeout(() => {
              this.uploadProgress = false;
              this.percentageNum = 0;
            }, 1000)
          }
          this.$refs.upload.clearFiles();
        }
      })
    },
    webkitdirectory(){
      this.$nextTick(() => {
        this.$refs.upload.$children[0].$refs.input.webkitdirectory = true
      })
    },
    dataRequest(formDataList, num, chunksSize) {
      if (num < formDataList.length) {
        let l = formDataList[num];
        let promises = [];
        let that = this;
        l.forEach((data) => {
          promises.push(new Promise((resolve) => {
            // 上传
            upload(data).then(res => {
              if (res.data.code === '100003') {
                // 进度条增加
                let n = 1 / chunksSize * 100;
                that.percentageNum += parseInt(n);
                resolve(res);
              }
            }).catch((e) => {
              console.log(e)
            })
          }))
        })
        Promise.all(promises).then(() => {
          // 执行下一组上传任务
          num++;
          this.dataRequest(formDataList, num, chunksSize);
        }).catch((e) => {
          console.log(e);
        })
      } else {
        // 分片全部上传完毕
        this.percentageNum = 100;
        setTimeout(() => {
          this.uploadProgress = false;
          this.percentageNum = 0;
        }, 1000)
      }
    },
    formData(num, chunkSize, file, fileName, totalSize, relativePath, totalChunks, identifier) {
      let formData = new FormData();
      formData.append('chunkNumber', num);
      formData.append('chunkSize', chunkSize);
      formData.append('currentChunkSize', file.size);
      formData.append('totalSize', totalSize);
      formData.append('filename', fileName);
      formData.append('relativePath', relativePath);
      formData.append('totalChunks', totalChunks);
      formData.append('file', file);
      formData.append('identifier', identifier);
      return formData;
    }
  }
}

</script>
