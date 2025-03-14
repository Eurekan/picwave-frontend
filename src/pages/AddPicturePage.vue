<template>
  <div id="addPicturePage">
    <h2 style="margin-bottom: 16px">
      {{ route.query?.id ? '编辑图片' : '创建图片' }}
    </h2>
    <!--  图片上传组件  -->
    <PictureUpload :picture="picture" :onSuccess="onSuccess" />
    <!--  图片信息表单  -->
    <a-form
      v-if="picture"
      layout="vertical"
      :model="pictureForm"
      @finish="handleSubmit"
    >
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
import {
  editPictureUsingPost,
  getPictureTagCategoryListUsingGet,
  getPictureVoByIdUsingGet
} from '@/api/pictureController'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 图片信息
const picture = ref<API.PictureVO>()
// 表单信息
const pictureForm = reactive<API.PictureEditRequest>({})

/**
 * 图片上传成功
 * @param newPicture
 */
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  pictureForm.name = newPicture.name
}

/**
 * 提交表单
 * @param values
 */
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

// 分类选项
const categoryOptions = ref<Array<{ value: string; label: string }>>([])
// 标签选项
const tagOptions = ref<Array<{ value: string; label: string }>>([])

/**
 * 获取标签和分类选项
 */
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

/**
 * 获取旧图片信息
 */
const getOldPicture = async () => {
  const id = route.query?.id
  if (id) {
    const res = await getPictureVoByIdUsingGet({
      id : id,
    })
    if (res.data.code == 0 && res.data.data) {
      picture.value = res.data.data
      pictureForm.name = res.data.data.name
      pictureForm.introduction = res.data.data.introduction
      pictureForm.category = res.data.data.category
      pictureForm.tags = res.data.data.tags
    } else {
      message.error('获取图片失败，' + res.data.message)
    }
  }

}

/**
 * 初始化
 */
onMounted(() => {
  getTagCategoryOptions()
  getOldPicture()
})
</script>

<style>
#addPicturePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
