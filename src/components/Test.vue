<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="文件" prop="file">
        <div class="upload-content">
          <el-upload
              class="upload-demo"
              accept="file"
              ref="upload"
              multiple
              action=""
              :http-request="myFileUpload"
              :before-upload="beforeUpload"
              :before-remove="beforeRemove"
              :file-list="fileList"
              :auto-upload="true"
              :limit="1">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <!--我还给他写了一个及其简陋的上传loading，这个可以略过-->
          <el-progress v-if="uploadProgress"
                       :percentage="(fileDataUploadList.length && fileDataList.length) ? ((fileDataUploadList.length / fileDataList.length)*100) : 0"
                       :status="(fileDataUploadList.length / fileDataList.length)===1 ? 'success':'exception'"></el-progress>
        </div>
      </el-form-item>
      <div style="text-align:center" v-if="upDataBtnShow">
        <el-button type="primary" @click="onSubmit(form)">确定更新</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
// 这个是他们的一个初始化上传的接口，上传之前请求这个接口会返回一个上传文件的地址 'uploadUrl'，一个请求合并文件的地址 'completeMultipartUrl'
// import {initFileUpload} from "@/api/xxx"
import axios from 'axios'

import SparkMD5 from "spark-md5";

export default {
  name: 'Test',
  data() {
    return {
      form: {},
      // 文件上传的地址
      uploadUrl: '',
      // 上传完成请求后台合并文件的地址
      completeMultipartUrl: '',
      // 文件分割以后的总列表数据
      fileDataList: [],
      // 文件上传成功以后的数据，上传多少个块push多少
      fileDataUploadList: [],
      // 这个是为了等文件全部上传以后我才显示下一步操作按钮
      upDataBtnShow: false,
      // 开始隐藏上传进度条
      uploadProgress: false,
      // 自定义上传请求头
      uploadHeaders: {
        'Accept': 'application/json',
        'Authorization': localStorage.getItem("token"),
      },
      // 文件列表
      fileList: [],

      chunkSize: 1024 * 1024


    }
  },
  methods: {
    // 上传前
    beforeUpload(file) {
      // 显示进度条
      this.uploadProgress = true
      // 获取分片数据
      this.fileList = this.createFileChunk(file, this.chunkSize)
    },
    // 自定义文件上传的模式，方法
    myFileUpload(params) {
      console.log(this.fileList.length)

      // /** 这里采用了循环请求，等全部循环上传请求完成以后再去执行合并请求的操作  Promise.all
      //  * 参数既有url参数也有body参数
      //  */
      // let promiseAll = this.fileDataList.map(item => {
        // console.log("item " + item)
        // let formData = new URLSearchParams()
        // formData.append('partNumber', item.partNumber)
        // return new Promise((resolve, reject) => {
        //   axios({
        //     method: 'post',
        //     headers: {
        //       'Authorization': localStorage.getItem("token"),
        //     },
        //     params: formData,
        //     url: `${this.uploadUrl}`,
        //     data: item.file,
        //   })
        //       .then(res => {
        //         this.fileDataUploadList.push(res.data.data)
        //         resolve(res.data.data)
        //       })
        //       .catch(err => {
        //         reject(err)
        //       })
        // })
      // })
    },
    // 初始化上传接口的函数，再上面上传之前调用的
    fileUpLoad(reslove, reject) {
      const paramsData = {
        multipartUpload: true, // 是否是文件分步，分块上传
        name: this.fileData.name,
        size: this.fileData.size,
      }
      initFileUpload(paramsData).then(res => {
        const uploadUrl = res.data.data.uploadUrl
        const completeMultipartUrl = res.data.data.completeMultipartUrl
        // 文件上传的请求地址
        this.uploadUrl = uploadUrl
        // 合并文件上传的请求地址
        this.completeMultipartUrl = completeMultipartUrl
        reslove();
      }).catch((err) => {
        reject(err)
      })
    },


    // 文件分割的方法
    createFileChunk(file, chunkSize) {
      let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
          // 总片数
          chunks = Math.ceil(file.size / chunkSize),
          // 当前片数
          currentChunk = 0,
          // md5类
          spark = new SparkMD5.ArrayBuffer(),
          // fileReader 读取文件二进制
          fileReader = new FileReader(),
          // 返回分片数据
          listFile = [],
          // 文件唯一标识
          identifier;

      // fileReader读取结束触发
      fileReader.onload = function (e) {
        spark.append(e.target.result);
        currentChunk++;
        if (currentChunk < chunks) {
          loadNext();
        } else {
          const identifier = spark.end();
          for (let i = 0; i < listFile.length; i++) {
            listFile[i].identifier = identifier;
          }
        }
      };
      // fileReader 读取异常
      fileReader.onerror = function () {
        console.warn('oops, something went wrong.');
      };
      // 文件分片
      function loadNext() {
        let start = currentChunk * chunkSize,
            end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
        // 当前分片
        let tf = file.slice(start, end);
        let f = {};
        // 当前为第几分片
        f.chunkNumber = currentChunk + 1;
        // 每个分块的大小
        f.chunkSize = chunkSize;
        // 当前分块大小
        f.currentChunkSize = tf.size;
        // 文件总大小
        f.totalSize = file.size;
        // 文件名
        f.filename = file.name;
        // 文件上传相对路径（预留）
        f.relativePath = '';
        // 分片总数
        f.totalChunks = chunks;
        // 当前文件
        f.file = tf;
        listFile.push(f);
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }
      loadNext();
      return listFile
    },


    // 移除已上传的文件
    beforeRemove(file, fileList) {
      alert("beforeRemove")
      // return this.$confirm(`确定移除 ${file.name}？`);
    },
  }
}

</script>
