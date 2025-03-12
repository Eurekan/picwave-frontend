<template>
  <div class="picture-upload">
    <a-upload
      list-type="picture-card"
      :show-upload-list="false"
      :custom-request="handleUpload"
      :before-upload="beforeUpload"
    >
      <img v-if="picture?.url" :src="picture?.url" alt="avatar" />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">点击或拖拽上传</div>
      </div>
    </a-upload>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { uploadPictureUsingPost } from '@/api/pictureController'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'

// 定义父组件传递的属性
interface Props {
  // 已上传图片信息
  picture?: API.PictureVO
  // 上传成功回调，将新图片信息作为参数传递给父组件
  onSuccess?: (newPicture: API.PictureVO) => void
}

// 获取父组件传递的属性
const props = defineProps<Props>()

// 子组件的属性
const picture = ref<API.PictureVO>()
// 子组件的上传成功回调
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
}

// 上传状态
const loading = ref<any>(false)

// 上传前校验图片格式
const beforeUpload = (file: any) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('不支持上传该格式的图片，推荐 jpg 或 png')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('不能上传超过 2M 的图片')
  }
  return isJpgOrPng && isLt2M
}
// 上传图片
const handleUpload = async ({ file }: any) => {
  loading.value = true
  try {
    const params = props.picture ? { id: props.picture.id } : {}
    const res = await uploadPictureUsingPost(params, {}, file)
    if (res.data.code == 0 && res.data.data) {
      message.success('上传成功')
      // 将上传成功的图片传递给父组件
      props.onSuccess?.(res.data.data)
    } else {
      message.error('图片上传失败，' + res.data.message)
    }
  } catch (error) {
    message.error('图片上传失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.picture-upload :deep(.ant-upload) {
  width: 100% !important;
  height: 100% !important;
  min-height: 152px;
  min-width: 152px;
}

.picture-upload img {
  max-width: 100%;
  max-height: 240%;
}

.ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
