<template>
  <div id="userProfilePage">
    <h2 class="title">个人信息设置</h2>

    <!-- 添加头像上传组件 -->
    <div class="avatar-upload-container">
      <a-upload name="avatar" list-type="picture-circle" class="avatar-uploader" :show-upload-list="false"
        :before-upload="beforeUpload" @change="handleAvatarChange">
        <div v-if="formState.avatarUrl" class="avatar-preview">
          <img :src="formState.avatarUrl" alt="头像" />
        </div>
        <div v-else>
          <loading-outlined v-if="uploading" />
          <plus-outlined v-else />
          <div class="ant-upload-text">上传头像</div>
        </div>
      </a-upload>
    </div>

    <a-form :model="formState" name="userProfileForm" autocomplete="off" @finish="handleSubmit" class="profile-form">
      <a-form-item label="用户名" name="username">
        <a-input v-model:value="formState.username" disabled />
      </a-form-item>

      <a-form-item label="昵称" name="nickname" :rules="[{ required: true, message: '请输入昵称' }]">
        <a-input v-model:value="formState.nickname" />
      </a-form-item>

      <a-form-item label="个人简介" name="profile">
        <a-textarea v-model:value="formState.profile" :rows="4" placeholder="请输入个人简介" />
      </a-form-item>

      <a-form-item label="性别" name="gender">
        <a-radio-group v-model:value="formState.gender">
          <a-radio value="male">男</a-radio>
          <a-radio value="female">女</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="电话" name="phone" :rules="[{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]">
        <a-input v-model:value="formState.phone" />
      </a-form-item>

      <a-form-item label="邮箱" name="email" :rules="[{ type: 'email', message: '请输入正确的邮箱格式' }]">
        <a-input v-model:value="formState.email" />
      </a-form-item>

      <a-form-item class="submit-buttons">
        <a-button type="primary" html-type="submit">保存修改</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'

// 获取用户登录状态管理器实例
const loginUserStore = useLoginUserStore()
const uploading = ref<boolean>(false)

// 定义用户信息表单的数据类型接口
interface UserProfileForm {
  username: string // 用户账号
  nickname: string // 用户昵称
  profile: string // 个人简介
  gender: 'male' | 'female' // 性别,只能是男或女
  phone: string // 手机号
  email: string // 邮箱
  avatarUrl: string // 头像URL
}

// 创建响应式的表单状态对象,初始值从登录用户信息中获取
const formState = reactive<UserProfileForm>({
  username: loginUserStore.loginUser?.userAccount || '', // 用户账号,从登录用户信息获取,如果没有则为空字符串
  nickname: loginUserStore.loginUser?.userName || '', // 用户昵称,从登录用户信息获取,如果没有则为空字符串
  profile: '', // 个人简介,默认为空
  gender: 'male', // 性别默认为男性
  phone: '', // 手机号,默认为空
  email: '', // 邮箱,默认为空
  avatarUrl: loginUserStore.loginUser?.userAvatar || '', // 头像URL,从登录用户信息获取,如果没有则为空字符串
})

// 上传前检查文件类型和大小
const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传JPG或PNG格式的图片!')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过2MB!')
    return false
  }
  return isJpgOrPng && isLt2M
}

// 处理头像变更
const handleAvatarChange = (info: any) => {
  if (info.file.status === 'uploading') {
    uploading.value = true
    return
  }

  if (info.file.status === 'done') {
    // 获取服务器返回的图片URL
    // 注意: 这里假设服务器返回的数据格式为 { data: { url: 'xxx' } }
    // 根据实际API调整这里的逻辑
    formState.avatarUrl = info.file.response.data.url
    uploading.value = false
  } else if (info.file.status === 'error') {
    uploading.value = false
    message.error('头像上传失败')
  }
}

// 提交表单时的处理函数
const handleSubmit = async (values: UserProfileForm) => {
  try {
    // TODO: 调用更新用户信息的 API
    message.success('个人信息更新成功')
  } catch (error) {
    message.error('更新失败，请重试')
  }
}

// 重置表单数据的函数
const resetForm = () => {
  // 将所有字段重置为初始值
  formState.username = loginUserStore.loginUser?.userAccount || ''
  formState.nickname = loginUserStore.loginUser?.userName || ''
  formState.profile = ''
  formState.gender = 'male'
  formState.phone = ''
  formState.email = ''
  formState.avatarUrl = loginUserStore.loginUser?.userAvatar || ''
}
</script>

<style scoped>
#userProfilePage {
  max-width: 600px;
  margin: 20px auto;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.title {
  text-align: center;
  margin-bottom: 32px;
  color: #333;
}

.profile-form {
  max-width: 460px;
  margin: 0 auto;
}

.submit-buttons {
  text-align: center;
  margin-top: 24px;
}

:deep(.ant-form-item-label) {
  width: 80px;
  text-align: right;
}

/* 头像上传相关样式 */
.avatar-upload-container {
  text-align: center;
  margin-bottom: 24px;
}

.avatar-uploader {
  display: inline-block;
}

.avatar-uploader :deep(.ant-upload) {
  width: 128px;
  height: 128px;
  border-radius: 50%;
}

.avatar-preview {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
