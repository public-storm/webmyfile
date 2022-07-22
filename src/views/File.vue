<template>
  <div class="container">
    <div class="top">
      <div class="top_default" @click="toPath('-1')">Home</div>
      <div class="top_path" v-for="item in path">
        <div class="top_ic">
          <my-icon id="icon-next01"/>
        </div>
        <div class="top_value" @click="toPath(item.id)">{{ item.name }}</div>
      </div>
    </div>
    <div class="table_header">
      <div class="table_btn">
        <vs-button circle icon floating color="#433f67" @click="add=!add">
          <my-icon id="icon-chuangjian"></my-icon>
        </vs-button>
        <vs-button circle icon floating color="#433f67" @click="$refs.up_file.click()">
          <my-icon id="icon-upload03"></my-icon>
        </vs-button>
        <vs-button circle icon floating color="#433f67">
          <my-icon id="icon-wenjianshangchuan"></my-icon>
        </vs-button>
        <vs-button circle icon floating color="#433f67" @click="active = !active">
          <my-icon id="icon-chuanshujilu-"></my-icon>
        </vs-button>
        <input ref="up_file" type="file" style="display: none" @change="addUpload"></input>
      </div>
      <div class="table_search">
        <div class="select_box">
          <input type="text" v-model="searchValue" class="select_text" placeholder="文件名">
          <div class="d_icon" @click="list(favorite_active)">
            <my-icon id="icon-sousuo" class="icon" size="30"></my-icon>
          </div>
        </div>
      </div>
    </div>
    <div class="table center">
      <vs-table v-model="selected">
        <template #thead>
          <vs-tr>
            <vs-th class="th_select">
              <vs-checkbox :indeterminate="selected.length === files.length" v-model="allCheck"
                           @change="selected = $vs.checkAll(selected, files)"/>
            </vs-th>
            <vs-th class="th_name">文件</vs-th>
            <vs-th class="th_favorite">
              收藏
              <span>
                <vs-switch success class="favorite_switch" v-model="favorite_active"/>
              </span>
            </vs-th>
            <vs-th class="th_time">创建时间</vs-th>
            <vs-th>大小</vs-th>
          </vs-tr>
        </template>
        <template #tbody>
          <vs-tr :key="id" v-for="(tr, id) in files" :data="tr" :is-selected="!!selected.includes(tr)"
                 not-click-selected>
            <vs-td checkbox>
              <vs-checkbox :val="tr" v-model="selected"/>
            </vs-td>
            <vs-td class="td_name" @click="choosePath(tr)">
              <div class="name_pic">
                <my-icon id="icon-files" v-if="tr.file===0"/>
              </div>
              <div class="name_value">{{ tr.name }}</div>
            </vs-td>
            <vs-td @click="upFavorites(tr.id,tr.favorite===0?1:0)">
              <div class="favorites_1" v-if="tr.favorite===0">
                <my-icon id="icon-Favorite" size="15"></my-icon>
              </div>
              <div class="favorites_2" v-if="tr.favorite===1">
                <my-icon id="icon-favorites" size="13"></my-icon>
              </div>
            </vs-td>
            <vs-td>{{ tr.createTime }}</vs-td>
            <vs-td>
              <div v-if="tr.file === 1 || tr.superId === '-1'">
                {{ (tr.size / (1024 * 1024 * 1024)).toFixed(4) }}GB
              </div>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </div>
    <div class="up_box" v-if="active">
      <div class="cancel" @click="active = false">
        <my-icon id="icon-quxiao" size="35"></my-icon>
      </div>
      <div class="up_list">
        <template v-for="(item) in upList">
          <div class="file">
            <my-icon id="icon-file" :size="30"></my-icon>
            <div class="file_value">{{ item.name }}</div>
          </div>
          <div class="progress">
            <progress-par v-model="item.num"></progress-par>
          </div>
        </template>
      </div>
    </div>
    <div class="select_op" v-if="select_operation">
      <div class="select_xiazai" @click="downloadFile">
        <my-icon id="icon-xiazai" color="#fff"></my-icon>
      </div>
      <div class="select_shoucang">
        <my-icon id="icon-shoucang" color="#fff" size="21"></my-icon>
      </div>
      <div class="select_lajixiang" @click="delete_file=true">
        <my-icon id="icon-lajixiang" color="#fff" size="17"></my-icon>
      </div>
      <div class="select_quxiao" @click="select_operation = false;selected=[]">
        <my-icon id="icon-quxiao1" color="#fff" size="26"></my-icon>
      </div>
    </div>
    <vs-dialog v-model="add" @close="dirName=''">
      <template #header>
        <h4 class="not-margin">
          <b>创建文件夹</b>
        </h4>
      </template>
      <input v-model="dirName" class="add_input" placeholder="文件夹名"></input>
      <template #footer>
        <div class="footer-dialog">
          <vs-button block :loading="createDirLoading" @click="createDir">创建</vs-button>
        </div>
      </template>
    </vs-dialog>
    <vs-dialog v-model="delete_file">
      <template #header>
        <h4 class="not-margin">
          <b style="font-size: 20px">删除文件</b>
        </h4>
      </template>
      <div style="text-align: center">文件将永久删除</div>
      <template #footer>
        <div class="footer_btn">
          <vs-button danger class="footer_btn_1" @click="deleteFile" :loading="delete_file_loading">确认删除</vs-button>
          <vs-button dark shadow class="footer_btn_2" @click="delete_file=false">取消</vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
import {checkUpload, createFile, deleteFile, fileList, upload, download, favorites} from "@/api/myfile";

export default {
  name: "File",
  data() {
    return {
      // 文件查看路径
      path: [],
      // 搜索值
      searchValue: '',
      // 表格全选
      allCheck: false,
      // 表格选择
      selected: [],
      // 创建文件夹
      add: false,
      // 文件夹名
      dirName: '',
      // 上传弹框
      active: false,
      // 文件最大并发上传数
      requestNum: 5,
      // 创建文件夹loading
      createDirLoading: false,
      // 上传列表
      upList: [],
      // 当前上传对象
      fileData: null,
      // 上级文件夹id
      pathId: '-1',
      // 表格数据
      files: [],
      // 分片大小
      chunkSize: 1024 * 1024 * 50,
      // 检查文件合并定时器
      checkMargeTime: null,
      // 检查文件合并定时周期
      time: 0,
      tag: 0,
      select_operation: false,
      delete_file: false,
      delete_file_loading: false,
      favorite_active: false
    }
  },
  created() {
    this.list(this.favorite_active);
  },
  watch: {
    fileData(newValue) {
      let re = {filename: newValue.name, superId: newValue.pathId}
      checkUpload(re).then(res => {
        let data = res.data;
        if (data.code === '100004') {
          let d = data.data;
          if (d.status === 1) {
            // 删除上传
            this.deleteUpload();
            this.success(newValue.name + ' 已上传');
          } else {
            if (d.chunkStatus === 1) {
              // 删除上传
              this.deleteUpload();
              this.info(newValue.name + ' 等待合并');
            } else {
              newValue.chunks = d.chunks;
              this.upload(newValue);
            }
          }
        } else {
          this.error(data.code, data.msg);
        }
      })
    },
    selected(newValue) {
      if (newValue.length > 0 && this.select_operation === false) {
        this.select_operation = true;
      }
      if (newValue.length === 0) {
        this.select_operation = false;
      }
    },
    favorite_active(newValue) {
      this.list(newValue);
    }
  },
  methods: {
    test(id) {
      alert(id);
    },
    // 文件列表
    list(favorite) {
      let r = {id: this.pathId, name: this.searchValue}
      if (favorite) {
        r.favorite = 1;
      }
      fileList(r).then((res) => {
        if (res.data.code === '100006') {
          this.files = res.data.data;
        } else {
          this.error(res.data.code, res.data.msg);
        }
      })
    },
    error(code, msg) {
      this.$vs.notification({
        color: 'danger',
        position: 'top-center',
        title: code,
        text: msg
      })
    },
    success(title) {
      this.$vs.notification({
        color: 'success',
        position: 'top-center',
        title: title
      })
    },
    info(title) {
      this.$vs.notification({
        color: 'primary',
        position: 'top-center',
        title: title
      })
    },
    deleteUpload() {
      this.upList.splice(0, 1);
      if (this.upList.length === 0) {
        this.active = false;
        this.tag = 0;
      }
    },
    // 创建文件夹
    createDir() {
      this.createDirLoading = true;
      let r = {name: this.dirName, id: this.pathId};
      createFile(r).then((res) => {
        if (res.data.code === '100005') {
          this.list(this.favorite_active);
          this.createDirLoading = false;
          this.add = false;
          this.dirName = '';
        } else {
          this.error(res.data.code, res.data.msg);
        }
      })
    },
    downloadFile() {
      const downloadFiles = this.selected;
      if (downloadFiles.length > 0) {
        let isFile = true;
        downloadFiles.forEach(dto => {
          if (dto.file === 0) {
            isFile = false;
          }
        })
        if (isFile) {
          downloadFiles.forEach(dto => {
            download({id: dto.id}).then(res => {
              console.log('res ' + res.data)
              let data = res.data;
              if (data) {
                let url = window.URL.createObjectURL(new Blob([data]))
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', dto.name)
                document.body.appendChild(link)
                link.click()
                // 释放URL对象所占资源
                window.URL.revokeObjectURL(url)
                // 用完即删
                document.body.removeChild(link)
              }
            })
          });
        } else {
          this.info('下载内容包含文件夹，请使用客户端下载');
        }
        this.selected = [];
      }
    },
    choosePath(tr) {
      if (tr.file === 0) {
        this.pathId = tr.id;
        this.list(this.favorite_active);
        this.path.push({id: tr.id, name: tr.name});
      }
    },
    toPath(id) {
      this.pathId = id;
      this.list(this.favorite_active);
      let arr = this.path;
      let index = -1;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
          index = i;
          break;
        }
      }
      this.path.splice(index + 1, this.path.length - index - 1);
    },
    deleteFile() {
      this.delete_file_loading = true;
      const file = this.selected;
      let promises = [];
      file.forEach(dto => {
        let query = {id: dto.id}
        promises.push(new Promise((resolve) => {
          deleteFile(query).then(res => {
            let r = {name: dto.name, code: res.code}
            resolve(r);
          })
        }))
      })
      Promise.all(promises).then((rs) => {
        let k = false;
        rs.forEach(res => {
          if (res.code === 500) {
            if (!k) {
              k = true;
            }
            this.error(res.code, res.name + " 删除失败");
            if (this.delete_file) {
              this.delete_file = false;
            }
            if (this.selected.length > 0) {
              this.selected = [];
            }
          }
        })
        if (!k) {
          this.success("删除成功");
          this.delete_file = false;
          this.selected = [];
        }
        this.list(this.favorite_active);
        this.delete_file_loading = false;
      })
    },
    addUpload(event) {
      const pathId = this.pathId;
      let files = event.target.files;
      let file = files[0];
      this.upList.push({name: file.name, num: 0, file: file, pathId: pathId});
      // 首次上传
      if (this.tag === 0) {
        this.active = true;
        this.fileData = this.upList[0];
        this.tag = 1;
      }
    },
    upload(fileData) {
      let param = this.findParam(fileData);
      this.uploadRequest(param.formDataList, 0, param.chunkSize, param.filename, param.fileSize);
    },
    findParam(fileData) {
      let result = {};
      // 分片大小
      const file = fileData.file,
          pathId = fileData.pathId,
          uploads = fileData.chunks,
          chunkSize = this.chunkSize,
          requestNum = this.requestNum;
      // 分片列表
      let chunks = [],
          count = 0,
          // 上传列表
          formDataList = [],
          num = 0;
      // 文件分片
      while (count < file.size) {
        chunks.push(file.slice(count, count + chunkSize));
        count += chunkSize;
      }
      // 已上传分片
      a:for (let i = 0; i < chunks.length; i++) {
        for (let j = 0; j < uploads.length; j++) {
          // 跳过当前分片、进度条增加
          if (i === uploads[j]) {
            let s = chunks.length;
            let n = 1 / s * 100;
            this.upList[0].num += n;
            console.log('跳过片 ' + i + ' num ' + this.upList[0].num + ' n ' + n)
            continue a;
          }
        }
        // 封装上传对象
        let d = this.formData(i, chunkSize, chunks[i], file.name, file.size, pathId, chunks.length);
        // 同时上传分组
        if (num === 0 || i % requestNum === 0) {
          let ls = [];
          ls.push(d);
          formDataList.push(ls);
          num++;
        } else {
          formDataList[num - 1].push(d);
        }
      }
      result.formDataList = formDataList;
      result.chunkSize = chunks.length;
      result.filename = file.name;
      result.fileSize = file.size;
      return result;
    },
    uploadRequest(formDataList, num, chunksSize, filename, fileSize) {
      // 子任务上传
      if (num < formDataList.length) {
        let l = formDataList[num];
        let promises = [];
        let that = this;
        l.forEach((data) => {
          promises.push(new Promise((resolve) => {
            // 上传
            upload(data).then(res => {
              let d = res.data;
              if (d.code === '100003') {
                // 进度条增加
                let n = 1 / chunksSize * 100;
                that.upList[0].num += n;
                resolve(res);
              } else {
                this.error(d.code, d.msg);
              }
            })
          }))
        })
        Promise.all(promises).then(() => {
          // 执行下一组上传任务
          num++;
          this.uploadRequest(formDataList, num, chunksSize, filename, fileSize);
        })
      } else {
        this.checkMarge(fileSize, filename);
      }
    },
    checkMarge(fileSize, fileName) {
      // 上传完毕 检查合并
      this.calculateTime(fileSize)
      this.checkMargeTime = setInterval(() => {
        let q = {filename: fileName, superId: this.pathId}
        checkUpload(q).then(res => {
          let data = res.data;
          if (data.code === '100004') {
            let d = data.data;
            if (d.status === 1) {
              this.success(fileName + '上传成功');
              // 上传列表移除成功文件
              this.deleteUpload();
              // 全部上传完毕关闭上传弹框
              if (this.upList.length > 0) {
                // 执行下个文件上传
                this.fileData = this.upList[0];
              }
              // 关闭定时器
              clearInterval(this.checkMargeTime);
              this.list(this.favorite_active);
            }
          } else {
            this.error(data.code, data.msg);
            // 关闭定时器
            clearInterval(this.checkMargeTime);
          }
        })
      }, this.time)
    },
    formData(num, chunkSize, file, fileName, totalSize, superId, totalChunks) {
      let formData = new FormData();
      formData.append('chunkNumber', num);
      formData.append('chunkSize', chunkSize);
      formData.append('currentChunkSize', file.size);
      formData.append('totalSize', totalSize);
      formData.append('filename', fileName);
      formData.append('superId', superId);
      formData.append('totalChunks', totalChunks);
      formData.append('file', file);
      return formData;
    },
    // 计算检查合并轮询时间
    calculateTime(totalSize) {
      // 文件大小梯度
      let grade = [0, 1024 * 1024 * 500, 1024 * 1024 * 1024, 1024 * 1024 * 1024 * 2];
      // 文件梯度轮询时间
      let time = [1000 * 2, 1000 * 3, 1000 * 5, 1000 * 10];
      if (totalSize > grade[grade.length - 1]) {
        this.time = time[time.length - 1];
      } else {
        for (let i = 0; i < grade.length - 1; i++) {
          if (grade[i] < totalSize && totalSize <= grade[i + 1]) {
            this.time = time[i];
            break;
          }
        }
      }
    },
    upFavorites(id, tag) {
      favorites({id: id, favorite: tag}).then(res => {
        let data = res.data;
        if (data.code === '100011') {
          this.list(this.favorite_active);
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  //border: black solid;
  position: relative;
}

.top {
  //border: black solid;
  width: 100%;
  height: 80px;
  position: absolute;
  top: 0;
  right: 0;
  padding: 20px 20px 20px 44px;
  display: -webkit-flex;
  display: flex;
}

.table_header {
  //border: black solid;
  width: 100%;
  height: 70px;
  position: absolute;
  top: 80px;
  right: 0;
}

.table_btn {
  //border: dodgerblue solid;
  width: 50%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding: 14px 45px;
  display: -webkit-flex;
  display: flex;
}

.table_search {
  //border: red solid;
  //width: 50%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px 0;
}

.select_box {
  height: 100%;
  //border: rgba(20, 59, 92, 1) solid;
  border: 2px solid #433f67;
  display: flex;
  border-radius: 25px;
  padding: 0px 5px;
  caret-color: transparent;

  .select_text {
    width: 0;
    border: none;
    background: none;
    outline: none;
    transition: .4s;
    color: #000000;
    caret-color: #000000;
  }

  .d_icon {
    width: 42px;
    height: 100%;
    text-align: center;
    caret-color: transparent;

    .icon {
      margin: 3.5px 0;
      color: #000000;
    }
  }
}

.select_box:hover .select_text {
  width: 300px;
  margin: 0 10px;
}

.search_d {
  border: dodgerblue solid;
  height: 100%;
  width: 400px;
  position: absolute;
  top: 0;
  right: 0;
  padding-top: 12px;
  padding-right: 50px;
}


.table {
  //border: black solid;
  width: 100%;
  height: 750px;
  overflow-y: auto;
  position: absolute;
  top: 180px;
  right: 0;
  padding: 0 30px
}

.add_tab.vs-input {
  width: 368px;
}

.up_box {
  //border: cornflowerblue solid;
  width: 450px;
  height: 600px;
  position: absolute;
  right: 80px;
  bottom: 0;
  background-color: white;
  border-radius: 15px;
  padding: 0 10px;
}

.cancel {
  position: absolute;
  right: 5px;
  top: 0;
  caret-color: transparent;
}

.up_list {
  width: 100%;
  height: 530px;
  //border: red solid;
  position: absolute;
  bottom: 10px;
  right: 0;
  overflow-y: auto;
  padding: 10px 20px;
}

.file {
  display: -webkit-flex;
  display: flex;
}

.file_value {
  padding: 10px 0;
}

.progress {
  padding: 2px 4px;
}

.add_input {
  width: 100%;
  height: 40px;
  padding: 5px 10px;
  border-radius: 10px;
}

.th_select {
  width: 40px !important;
}


.th_name {
  width: 40% !important;
}

.th_favorite {
  width: 20% !important;
}

.th_time {
  width: 25% !important;
}

.td_name:hover {
  color: cornflowerblue;
}

.td_name {
  display: -webkit-flex;
  display: flex;
}

.name_value {
  margin-left: 10px;
  padding: 3px 0;
}

.select_op {
  display: -webkit-flex;
  display: flex;
  width: 250px;
  height: 50px;
  position: absolute;
  right: 45%;
  top: 100px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 15px;
  padding: 0 10px;
}

.select_xiazai {
  width: 35px;
  height: 35px;
  text-align: center;
  margin-top: 8px;
  margin-left: 15px;
  border-radius: 5px;
  padding-top: 3px;
}

.select_xiazai:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.select_shoucang {
  width: 35px;
  height: 35px;
  text-align: center;
  margin-top: 8px;
  margin-left: 5px;
  border-radius: 5px;
  padding-top: 2px;
}

.select_shoucang:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.select_lajixiang {
  width: 35px;
  height: 35px;
  text-align: center;
  margin-top: 8px;
  margin-left: 5px;
  border-radius: 5px;
  padding-top: 5px;
}

.select_lajixiang:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.select_quxiao {
  width: 35px;
  height: 35px;
  text-align: center;
  margin-top: 8px;
  position: absolute;
  right: 18px;
  border-radius: 5px;
  padding-top: 0;
}

.select_quxiao:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.footer_btn {
}

.footer_btn_1 {
  margin-top: 10px;
  width: 100%;
}

.footer_btn_2 {
  margin-top: 10px;
  width: 100%;
}

.top_path {
  display: -webkit-flex;
  display: flex;
}

.top_value:hover {
  color: cornflowerblue;
}

.top_default:hover {
  color: cornflowerblue;
}

.top_default {
  margin-top: 5px;
  font-size: 20px;
}

.top_value {
  margin-top: 10px;
}

.top_ic {
  margin-top: 8px;
}

.favorites_2 {
  padding-left: 5px;
  padding-top: 2px;
}

.favorites_1 {
  padding-left: 4px;
}

.favorites_2:hover {
  color: cornflowerblue;
}

.favorites_1:hover {
  color: cornflowerblue;
}

.favorite_switch {
  margin-left: 40px;
}


</style>
