<template>
  <div id="userProfilePage">
    <div class="profile-container">
      <h2 class="page-title">个人信息编辑</h2>

      <a-form :model="formState" layout="vertical" ref="formRef" @finish="handleSubmit">
        <!-- 头像上传 -->
        <div class="avatar-container">
          <a-upload name="avatar" list-type="picture-circle" class="avatar-uploader" :show-upload-list="false"
            :before-upload="beforeUpload" :customRequest="handleUpload">
            <img v-if="formState.userAvatar" :src="formState.userAvatar" alt="头像" class="avatar-image" />
            <div v-else>
              <loading-outlined v-if="uploading" />
              <plus-outlined v-else />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </div>

        <!-- 用户账号 -->
        <a-form-item label="账号" name="userAccount">
          <a-input v-model:value="formState.userAccount" placeholder="账号" disabled />
        </a-form-item>

        <!-- 用户名 -->
        <a-form-item label="用户名" name="userName" :rules="[{ required: true, message: '请输入用户名' }]">
          <a-input v-model:value="formState.userName" placeholder="请输入用户名" />
        </a-form-item>

        <!-- 个人简介 -->
        <a-form-item label="个人简介" name="userProfile">
          <a-textarea v-model:value="formState.userProfile" placeholder="请输入个人简介" autoSize allowClear :rows="5"
            :maxlength="200" show-count />
        </a-form-item>

        <!-- 提交按钮 -->
        <a-form-item>
          <div class="button-container">
            <a-button type="primary" html-type="submit" :loading="submitLoading">保存修改</a-button>
            <a-button @click="resetForm" style="margin-left: 16px">重置</a-button>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { editUserUsingPost } from '@/api/userController'
import { uploadPictureUsingPost } from '@/api/pictureController'
import type { FormInstance } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

// 表单引用
const formRef = ref<FormInstance>()
// 按钮加载状态
const submitLoading = ref(false)
// 头像上传状态
const uploading = ref(false)
// 用户状态存储
const loginUserStore = useLoginUserStore()

// 表单数据
const formState = reactive({
  id: undefined as number | undefined,
  userAccount: '',
  userName: '',
  userProfile: '',
  userAvatar: '',
})

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    // 使用 store 方法获取登录用户信息
    await loginUserStore.fetchLoginUser()
    const loginUser = loginUserStore.loginUser

    if (loginUser.id) {
      // 更新表单数据
      formState.id = loginUser.id
      formState.userAccount = loginUser.userAccount || ''
      formState.userName = loginUser.userName || ''
      formState.userProfile = loginUser.userProfile || ''
      formState.userAvatar = loginUser.userAvatar || ''
    } else {
      message.error('获取用户信息失败：用户未登录')
    }
  } catch (error: any) {
    message.error('获取用户信息失败：' + (error.message || '未知错误'))
  }
}

// 上传前验证
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件！')
    return false
  }

  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片必须小于 2MB！')
    return false
  }

  return isImage && isLt2M
}

// 处理上传
const handleUpload = async (options: any) => {
  const { file, onSuccess, onError } = options
  uploading.value = true

  try {
    const res = await uploadPictureUsingPost(
      {
        fileUrl: '',
        picName: file.name,
      },
      {},
      file,
    )

    if (res.data?.code === 0 && res.data.data?.url) {
      formState.userAvatar = res.data.data.url
      onSuccess(res.data.data)
      message.success('头像上传成功')
    } else {
      onError(new Error(res.data?.message || '上传失败'))
      message.error(res.data?.message || '头像上传失败')
    }
  } catch (error: any) {
    onError(error)
    message.error(error.message || '头像上传出错')
  } finally {
    uploading.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formState.id) {
    message.error('用户未登录')
    return
  }

  submitLoading.value = true
  try {
    const res = await editUserUsingPost({
      id: formState.id,
      userName: formState.userName,
      userProfile: formState.userProfile,
      userAvatar: formState.userAvatar,
    })

    if (res.data?.code === 0 && res.data.data) {
      message.success('个人信息更新成功')
      // 手动更新存储的用户信息
      loginUserStore.setLoginUser({
        ...loginUserStore.loginUser,
        userName: formState.userName,
        userProfile: formState.userProfile,
        userAvatar: formState.userAvatar,
      })
    } else {
      message.error('更新失败：' + (res.data?.message || '未知错误'))
    }
  } catch (error: any) {
    message.error('更新失败：' + (error.message || '未知错误'))
  } finally {
    submitLoading.value = false
  }
}

// 重置表单
const resetForm = () => {
  fetchUserInfo()
}

// 页面加载时获取用户信息
onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.page-title {
  text-align: center;
  margin-bottom: 24px;
  color: #333;
}

.avatar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.avatar-uploader {
  display: flex;
  justify-content: center;
}

:deep(.ant-upload-select) {
  width: 120px !important;
  height: 120px !important;
  border-radius: 50% !important;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
