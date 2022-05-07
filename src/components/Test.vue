<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="文件" prop="file">
        <div class="upload-content">
          <el-upload
              class="upload-demo"
              accept="file"
              ref="upload"
              multiple
              action=""
              :http-request="upload"
              :auto-upload="true"
              :on-success="handleAvatarSuccess"
              :limit="1">
            <el-button size="small" type="primary">点击上传</el-button>
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
import {upload} from "@/api/myfile";


export default {
  name: 'Test',
  data() {
    return {
      chunkSize: 1024 * 1024 * 100,
      requestNum: 5,
      percentageNum: 0,
      uploadProgress:false
    }
  },
  methods: {
    upload(file) {
      this.uploadProgress = true;
      const f = file.file,
          chunkSize = this.chunkSize,
          identifier = SparkMD5.hash(f.name),
          requestNum = this.requestNum;
      let chunks = [],
          count = 0,
          formDataList = [],
          num = 0;
      while (count < f.size) {
        chunks.push(f.slice(count, count + chunkSize));
        count += chunkSize;
      }
      for (let i = 0; i < chunks.length; i++) {
        let d = this.formData(i, chunkSize, chunks[i], f.name, f.size, '', chunks.length, identifier);
        if (i === 0 || i % requestNum === 0) {
          let ls = [];
          ls.push(d);
          formDataList.push(ls);
          num++;
        } else {
          formDataList[num - 1].push(d);
        }
      }
      this.dataRequest(formDataList, 0, chunks.length);
      this.$refs.upload.clearFiles();
      this.uploadProgress=false;
      this.percentageNum=0;
    },
    dataRequest(formDataList, num, chunksSize) {
      if (num < formDataList.length) {
        let l = formDataList[num];
        let promises = [];
        let that = this;
        l.forEach((data) => {
          promises.push(new Promise((resolve) => {
            upload(data).then(res => {
              if (res.data.code === '100003') {
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
          num++;
          this.dataRequest(formDataList, num, chunksSize);
        }).catch((e) => {
          console.log(e);
        })
      } else {
        this.percentageNum = 100;
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
    },
    handleAvatarSuccess(){
      alert('123')
    }
  }
}

</script>
