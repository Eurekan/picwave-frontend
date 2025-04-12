<template>
  <a-modal
    v-model:visible="visible"
    title="分享图片"
    :footer="false"
    @cancel="closeModal"
    width="480px"
  >
    <div class="share-modal-content">
      <!-- 链接分享部分 -->
      <div class="share-section">
        <div class="section-header">
          <LinkOutlined />
          <h4>复制分享链接</h4>
        </div>
        <div class="link-container">
          <a-input :value="link" :bordered="false" readonly class="link-input" />
          <a-tooltip title="复制链接">
            <a-button type="primary" shape="circle" @click="copyLink" class="copy-button">
              <template #icon>
                <CopyOutlined />
              </template>
            </a-button>
          </a-tooltip>
        </div>
        <div class="divider-container">
          <a-divider>或者</a-divider>
        </div>
      </div>

      <!-- 二维码部分 -->
      <div class="share-section">
        <div class="section-header">
          <QrcodeOutlined />
          <h4>手机扫码查看</h4>
        </div>
        <div class="qrcode-container">
          <a-qrcode :value="link" :size="200" bordered />
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { defineProps, ref, withDefaults } from 'vue'
import { defineExpose } from 'vue'
import { message } from 'ant-design-vue'
import { LinkOutlined, QrcodeOutlined, CopyOutlined } from '@ant-design/icons-vue'

/**
 * 定义组件属性类型
 */
interface Props {
  title: string
  link: string
}

/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {
  title: () => '分享',
  link: () => 'https://laoyujianli.com/share/yupi',
})

// 是否可见
const visible = ref(false)

// 打开弹窗
const openModal = () => {
  visible.value = true
}

// 关闭弹窗
const closeModal = () => {
  visible.value = false
}

// 复制链接
const copyLink = () => {
  navigator.clipboard
    .writeText(props.link)
    .then(() => {
      message.success('链接已复制到剪贴板')
    })
    .catch(() => {
      message.error('复制失败，请手动复制')
    })
}

// 暴露函数给父组件
defineExpose({
  openModal,
})
</script>

<style scoped>
.share-modal-content {
  padding: 0 16px;
}

.share-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h4 {
  margin: 0 0 0 8px;
  font-size: 16px;
  color: #333;
}

.link-container {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 4px 8px;
  margin-bottom: 8px;
}

.link-input {
  flex: 1;
  background-color: transparent;
}

.copy-button {
  margin-left: 8px;
  background-color: #1890ff;
}

.divider-container {
  margin: 16px 0;
}

.qrcode-container {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}
</style>
