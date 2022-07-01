<template>
  <div class="home">
    <vs-sidebar
        absolute
        v-model="active"
        hover-expand
        reduce
        open
        class="left_tab"
    >
      <template #logo>
        <!-- ...img logo -->
      </template>
      <vs-sidebar-item v-for="tab in tab" :key="tab.id" :id="tab.id" :to="tab.path">
        <template #icon>
          <my-icon :id="tab.icon_id"></my-icon>
        </template>
        {{ tab.value }}
      </vs-sidebar-item>
      <template #footer>
        <vs-row justify="space-between">
          <vs-avatar badge-color="danger" badge-position="top-right">
            <my-icon id="icon-shezhi" class="icon"></my-icon>
          </vs-avatar>
          <vs-avatar>
            <img src="@/assets/image/1.jpg" alt="">
          </vs-avatar>
        </vs-row>
      </template>
    </vs-sidebar>
    <div class="right">
      <router-view></router-view>
    </div>
  </div>
</template>


<script>
export default {
  name: "Home2",
  created() {
    this.$router.push({name: 'file'});
  },
  data() {
    return {
      active: 'file',
      tab: [{id: 'file', path: '/file', icon_id: 'icon-file', value: '文件'},
        // {id: 'photo', path: '/photo', icon_id: 'icon-zhaopian_huabanfuben', value: '相册'},
        {id: 'favorite', path: '/favorite', icon_id: 'icon-fitness', value: '收藏夹'},
        // {id: 'safe_box', path: '/safeBox', icon_id: 'icon-line-safebaoxianxiang-02', value: '密码箱'},
        // {id: 'subscription', path: '/subscription', icon_id: 'icon-dingyue', value: '订阅'},
        // {id: 'dustbin', path: '/dustbin', icon_id: 'icon-lajixiang', value: '回收站'},
        // {id: 'transport', path: '/transport', icon_id: 'icon-chuanshujilu-', value: '传输列表'}
      ]
    }
  },
  methods: {

  },
}
</script>

<style scoped lang="less">
.home {
  position: relative;
  width: 100%;
  height: 100%;
  display: -webkit-flex;
  display: flex;
}


.right {
  width: calc(100% - 50px);
  min-width: 950px;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  margin: 0 0;
  padding: 0 50px;
}
</style>
