<template>
  <a-layout-content class="add-content">
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <a-card title="Tạo nội dung">
          <a-button type="primary" @click="showDrawer">
            <template #icon><PlusOutlined /></template>
            Tạo nội dung mới
          </a-button>
        </a-card>
      </a-col>
    </a-row>

    <a-drawer
      title="Tạo nội dung mới"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="onClose"
      width="720"
    >
      <a-form :model="formState" layout="vertical">
        <a-form-item label="Loại content">
          <a-select
            v-model:value="selectedCategory"
            placeholder="Chọn loại content"
          >
            <a-select-option
              v-for="content_category in content_categories"
              :key="content_category.id"
              :value="content_category.id"
            >
              {{ content_category.name }}({{ content_category.sector }})
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Tiêu đề nội dung">
          <a-input v-model:value="title" placeholder="Tiêu đề nội dung" />
        </a-form-item>

        <a-form-item label="Hashtag">
          <a-input v-model:value="hashtag" placeholder="Hashtag" />
        </a-form-item>

        <a-form-item label="Nội dung chi tiết">
          <div class="editor-container">
            <div class="editor-container__editor-wrapper">
              <div class="editor-container__editor">
                <div>
                  <ckeditor
                    v-if="editor && config"
                    :modelValue="config.initialData"
                    :editor="editor"
                    :config="config"
                    v-model="content"
                  />
                </div>
              </div>
            </div>
          </div>
        </a-form-item>

        <a-form-item label="Thêm Media">
          <a-space direction="vertical" style="width: 100%">
            <a-input v-model:value="newMedia.title" placeholder="Nhập tiêu đề media" />
            <a-select v-model:value="newMedia.kind" style="width: 100%">
              <a-select-option value="image">Ảnh</a-select-option>
              <a-select-option value="video">Video</a-select-option>
            </a-select>
            <a-input
              v-model:value="newMedia.link"
              :placeholder="newMedia.kind === 'image' ? 'Nhập URL ảnh' : 'Nhập URL hoặc ID video YouTube'"
            />
            <a-button type="primary" @click="addMedia">Thêm</a-button>
          </a-space>

          <a-list :dataSource="mediaList" style="margin-top: 16px">
            <template #renderItem="{ item, index }">
              <a-list-item>
                <a-space direction="vertical" style="width: 100%">
                  <div>
                    <strong>{{ item.title }}</strong> ({{ item.kind }})
                    <a-button type="link" danger @click="removeMedia(index)">Xóa</a-button>
                  </div>
                  <div v-if="item.kind === 'image'">
                    <img :src="item.link" alt="Image Preview" style="max-width: 200px; height: auto;" />
                  </div>
                  <div v-else-if="item.kind === 'video'">
                    <iframe
                      :src="`https://www.youtube.com/embed/${item.link}`"
                      frameborder="0"
                      allowfullscreen
                      style="width: 100%; height: 200px;"
                    ></iframe>
                  </div>
                </a-space>
              </a-list-item>
            </template>
          </a-list>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" @click="createContent" block>Tạo nội dung</a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </a-layout-content>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { Ckeditor } from '@ckeditor/ckeditor5-vue'
import { message } from 'ant-design-vue'
import '../assets/style.css'

import {
  DecoupledEditor,
  Alignment,
  AutoLink,
  Autosave,
  BalloonToolbar,
  Bold,
  Code,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  HorizontalLine,
  ImageEditing,
  ImageUtils,
  Indent,
  IndentBlock,
  Italic,
  Link,
  Paragraph,
  RemoveFormat,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextPartLanguage,
  Title,
  Underline,
  WordCount
} from 'ckeditor5'

import 'ckeditor5/ckeditor5.css'

const CONST_HOST = "https://api.slmglobal.vn"
const visible = ref(false)
const showDrawer = () => {
  visible.value = true
}
const onClose = () => {
  visible.value = false
}

const isLayoutReady = ref(false)

const editor = DecoupledEditor

const config = computed(() => {
  if (!isLayoutReady.value) {
    return null
  }

  return {
    toolbar: {
      items: [
        'textPartLanguage',
        '|',
        'heading',
        '|',
        'fontSize',
        'fontFamily',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'subscript',
        'superscript',
        'code',
        'removeFormat',
        '|',
        'horizontalLine',
        'link',
        'insertTable',
        '|',
        'alignment',
        '|',
        'outdent',
        'indent'
      ],
      shouldNotGroupWhenFull: false
    },
    plugins: [
      Alignment,
      AutoLink,
      Autosave,
      BalloonToolbar,
      Bold,
      Code,
      Essentials,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      Heading,
      HorizontalLine,
      ImageEditing,
      ImageUtils,
      Indent,
      IndentBlock,
      Italic,
      Link,
      Paragraph,
      RemoveFormat,
      Strikethrough,
      Subscript,
      Superscript,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextPartLanguage,
      Title,
      Underline,
      WordCount
    ],
    balloonToolbar: ['bold', 'italic', '|', 'link'],
    fontFamily: {
      supportAllValues: true
    },
    fontSize: {
      options: [10, 12, 14, 'default', 18, 20, 22],
      supportAllValues: true
    },
    heading: {
      options: [
        {
          model: 'paragraph',
          title: 'Paragraph',
          class: 'ck-heading_paragraph'
        },
        {
          model: 'heading1',
          view: 'h1',
          title: 'Heading 1',
          class: 'ck-heading_heading1'
        }
      ]
    }
  }
})

const content_categories = ref([])
const selectedCategory = ref(null)
const title = ref('')
const hashtag = ref('')
const content = ref('')
const mediaList = ref([])
const newMedia = ref({
  title: '',
  kind: 'image',
  link: ''
})

const addMedia = () => {
  if (newMedia.value.title && newMedia.value.link) {
    mediaList.value.push({ ...newMedia.value })
    newMedia.value = {
      title: '',
      kind: 'image',
      link: ''
    }
  }
}

const removeMedia = (index) => {
  mediaList.value.splice(index, 1)
}

const createContent = async () => {
  const payload = {
    content_category_id: selectedCategory.value,
    title: title.value,
    hashtag: hashtag.value,
    content: content.value,
    media_list: mediaList.value
  }

  try {
    const response = await fetch(`${CONST_HOST}/api/contents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      message.success('Tạo nội dung thành công')
      onClose()
    } else {
      message.error('Tạo nội dung thất bại')
    }
  } catch (error) {
    message.error('Có lỗi xảy ra')
    console.error('Error:', error)
  }
}

const loadContentCategories = async () => {
  try {
    const response = await fetch(CONST_HOST + '/api/content-categories')
    if (response.ok) {
      const data = await response.json()
      content_categories.value = data
    } else {
      message.error('Tải danh sách loại nội dung thất bại')
    }
  } catch (error) {
    message.error('Có lỗi xảy ra')
    console.error('Error:', error)
  }
}

onMounted(async () => {
  loadContentCategories()
})
</script>

<style scoped>
.add-content {
  padding: 24px;
}

.editor-container {
  border: 1px solid #d9d9d9;
  border-radius: 2px;
}

.editor-container__editor-wrapper {
  padding: 8px;
}

.editor-container__editor {
  min-height: 200px;
}
</style>