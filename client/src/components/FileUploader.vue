<template>
  <div>
    <!-- 上传区域 -->
    <div class="upload-area">
      <label class="upload-btn">
        <span>{{ label }}</span>
        <input
          type="file"
          accept="image/*"
          :multiple="allowMultiple"
          @change="onFileChange"
          hidden
        />
      </label>
    </div>

    <!-- 预览列表 -->
    <div v-if="previews.length" class="preview-grid">
      <div v-for="(url, idx) in previews" :key="idx" class="preview-item">
        <img :src="url" class="preview-image" alt="Preview" />
        <button class="remove-btn" @click="removeFile(idx)">×</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

// 接收父组件 v-model: modelValue、allowMultiple、label
const props = defineProps<{
  modelValue: File[];
  allowMultiple: boolean;
  label: string;
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: File[]): void;
}>()

// 本地文件列表，初始化为父传入的 modelValue
const internalFiles = ref<File[]>([...props.modelValue])

// 监听外部 modelValue 变化
watch(() => props.modelValue, (newVal) => {
  internalFiles.value = [...newVal]
})

// 预览 URL 列表
const previews = computed(() =>
  internalFiles.value.map(file => URL.createObjectURL(file))
)

// 处理文件选择
function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files) return

  // 单文件模式时先清空
  if (!props.allowMultiple) {
    internalFiles.value = []
  }

  Array.from(input.files).forEach(file => {
    if (!file.type.startsWith('image/')) {
      alert('只能上传图片')
      return
    }
    internalFiles.value.push(file)
  })

  // 向父组件同步文件列表
  emit('update:modelValue', [...internalFiles.value])

  // 清空 input，让同一文件可重选
  input.value = ''
}

// 删除预览及文件
function removeFile(idx: number) {
  internalFiles.value.splice(idx, 1)
  emit('update:modelValue', [...internalFiles.value])
}
</script>

<style scoped>
.upload-area {
  border: 2px dashed #ccc;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
}
.upload-btn span {
  font-size: 1.2rem;
}
.preview-grid {
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}
.preview-item {
  position: relative;
  margin: 0.25rem;
}
.preview-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}
.remove-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  background: white;
  border: none;
  font-weight: bold;
  cursor: pointer;
}
</style>