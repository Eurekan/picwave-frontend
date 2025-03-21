<template>
  <div id="globalSider">
    <a-layout-sider
      v-if="loginUserStore.loginUser.id"
      width="200"
      breakpoint="lg"
      collapsed-width="0"
    >
      <a-menu
        v-model:selectedKeys="current"
        mode="inline"
        :items="menuItems"
        @click="doMenuClick"
      />
    </a-layout-sider>
  </div>
</template>
<script lang="ts" setup>
import { h, ref } from 'vue'
import { PictureOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

const loginUserStore = useLoginUserStore()

// 菜单项
const menuItems = [
  {
    key: '/',
    icon: () => h(PictureOutlined),
    label: '公共图库',
  },
  {
    key: '/my_space',
    label: '我的空间',
    icon: () => h(UserOutlined),
  },
]

const router = useRouter()
// 当前要高亮的菜单项
const current = ref<string[]>([])
// 监听路由变化，更新高亮菜单项
router.afterEach((to, from, next) => {
  current.value = [to.path]
})

// 路由跳转事件
const doMenuClick = ({ key }) => {
  router.push({
    path: key,
  })
}
</script>

<style scoped>
#globalSider .ant-layout-sider {
  background: none;
}
</style>
