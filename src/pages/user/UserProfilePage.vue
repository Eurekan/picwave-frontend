<template>
  <div id="userProfilePage">
    <h2 class="title">图潮云图库 - 用户中心</h2>
    <div class="desc">企业级智能协同云图库</div>
    <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit">
      <a-form-item name="userName" :rules="[{ required: true, message: '请输入用户名称' }]">
        <a-input v-model:value="formState.userName" placeholder="请输入用户名称" />
      </a-form-item>
      <a-form-item label="简介" name="introduction">
        <a-textarea
          v-model:value="formState.userProfile"
          placeholder="请输入简介"
          :rows="2"
          autoSize
          allowClear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { userLoginUsingPost } from '@/api/userController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { message } from 'ant-design-vue'
import router from '@/router'

const loginUserStore = useLoginUserStore()

const formState = reactive<API.UserEditRequest>({
  id: 0,
  userName: '',
  userProfile: '',
  userAvatar: '',
})
const handleSubmit = async (values: any) => {
  // 发起请求
  const res = await userLoginUsingPost(values)
  // 判断是否登录成功
  if (res.data.code === 0 && res.data.data) {
    // 成功，存储用户信息
    await loginUserStore.fetchLoginUser()
    message.success('登录成功')
    // 跳转首页
    await router.push({
      path: '/',
      replace: true,
    })
  } else {
    // 失败，打印错误信息
    message.error('登录失败' + res.data.message)
  }
}
</script>

<style scoped>
#userProfilePage {
  max-width: 360px;
  margin: 0 auto;
}

.title {
  text-align: center;
  margin-bottom: 16px;
}

.desc {
  text-align: center;
  color: #bbb;
  margin-bottom: 16px;
}
</style>
