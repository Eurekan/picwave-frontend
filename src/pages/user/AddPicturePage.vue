<template>
  <div id="addPicturePage">
    <h2 style="margin-bottom: 16px">创建图片</h2>
    <PictureUpload :picture="picture" :onSuccess="onSuccess" />
    <a-form v-if="picture" layout="vertical" :model="pictureForm" @finish="handleSubmit">
      <a-form-item label="名称" name="name">
        <a-input v-model:value="pictureForm.name" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item label="简介" name="introduction">
        <a-textarea
          v-model:value="pictureForm.introduction"
          placeholder="请输入简介"
          :rows="2"
          autoSize
          allowClear
        />
      </a-form-item>
      <a-form-item label="分类" name="category">
        <a-auto-complete
          v-model:value="pictureForm.category"
          :options="categoryOptions"
          placeholder="请输入分类"
          allowClear
        />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="pictureForm.tags"
          :options="tagOptions"
          mode="tags"
          placeholder="请输入标签"
          allowClear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">创建</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import PictureUpload from '@/components/PictureUpload.vue'
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { editPictureUsingPost, getPictureTagCategoryListUsingGet } from '@/api/pictureController'
import { useRouter } from 'vue-router'

const router = useRouter()

// 图片信息
const picture = ref<API.PictureVO>()
// 表单信息
const pictureForm = reactive<API.PictureEditRequest>({})

// 上传成功
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  pictureForm.name = newPicture.name
}

// 提交表单
const handleSubmit = async (values: any) => {
  const pictureId = picture.value?.id
  if (!pictureId) {
    message.error('请先上传图片')
    return
  }
  const res = await editPictureUsingPost({
    id: pictureId,
    ...values,
  })
  if (res.data.code == 0 && res.data.data) {
    message.success('创建成功')
    // 跳转到图片详情页
    await router.push({
      path: `/picture/${pictureId}`,
    })
  } else {
    message.error('创建失败，' + res.data.message)
  }
}

const categoryOptions = ref<Array<{ value: string; label: string }>>([])
const tagOptions = ref<Array<{ value: string; label: string }>>([])

// 获取标签和分类选项
const getTagCategoryOptions = async () => {
  const res = await getPictureTagCategoryListUsingGet()
  if (res.data.code == 0 && res.data.data) {
    tagOptions.value = (res.data.data.tagList ?? []).map((tag: string) => {
      return {
        value: tag,
        label: tag,
      }
    })
    categoryOptions.value = (res.data.data.categoryList ?? []).map((category: string) => {
      return {
        value: category,
        label: category,
      }
    })
  } else {
    message.error('获取标签和分类选项失败，' + res.data.message)
  }
}

// 页面加载时获取标签和分类选项
onMounted(() => {
  getTagCategoryOptions()
})
</script>

<style>
#addPicturePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
