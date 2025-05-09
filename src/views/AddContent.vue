<template>
    <div>
        <form action="#" width="100%">
            <table border="solid">
                <tbody>
                    <tr>
                        <td colspan="2">
                            <h1 style="display: flex; flex-direction: column; align-items: center;color: aliceblue;">Tạo nội dung
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td>Loại content</td>
                        <td>
                            <select name="selectedCategory" id="selectedCategory" v-model="selectedCategory">
                                <option :value="content_category.id" v-for="content_category in content_categories">{{
                                    content_category.name }}({{ content_category.sector }})</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Tiêu đề nội dung</td>
                        <td><input type="text" name="title" id="title" v-model="title"></td>
                    </tr>
                    <tr>
                        <td>Hashtag</td>
                        <td><input type="text" name="hashtag" id="hashtag" v-model="hashtag"></td>
                    </tr>
                    <tr>
                        <td>Nội dung chi tiết</td>
                        <td style="color: black;">
                            <div class="editor-container editor-container_document-editor editor-container_include-word-count"
                                ref="editorContainerElement">
                                <div class="editor-container__menu-bar" ref="editorMenuBarElement"></div>
                                <div class="editor-container__toolbar" ref="editorToolbarElement"></div>
                                <div class="editor-container__editor-wrapper">
                                    <div class="editor-container__editor">
                                        <div ref="editorElement">
                                            <ckeditor v-if="editor && config" :modelValue="config.initialData"
                                                :editor="editor" :config="config" @ready="onReady" v-model="content"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="editor_container__word-count" ref="editorWordCountElement"></div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Thêm Media</td>
                        <td>
                            <div>
                                <input type="text" v-model="newMedia.title" placeholder="Nhập tiêu đề media" /><br>
                                <select v-model="newMedia.kind">
                                    <option value="image">Ảnh</option>
                                    <option value="video">Video</option>
                                </select><br>
                                <input type="text" v-model="newMedia.link"
                                    :placeholder="newMedia.kind === 'image' ? 'Nhập URL ảnh' : 'Nhập URL hoặc ID video YouTube'" />
                                <br>
                                <button type="button" @click="addMedia">Thêm</button>
                            </div>
                            <ul>
                                <li v-for="(media, index) in mediaList" :key="index" style="margin-top: 10px;">
                                    <div>
                                        <strong>{{ media.title }}</strong> ({{ media.kind }})
                                        <button type="button" @click="removeMedia(index)"
                                            style="margin-left: 10px;">Xóa</button>
                                    </div>
                                    <div v-if="media.kind === 'image'" style="margin-top: 5px;">
                                        <img :src="media.link" alt="Image Preview"
                                            style="width: 100px; height: auto;" />
                                    </div>
                                    <div v-else-if="media.kind === 'video'" style="margin-top: 5px;">
                                        <iframe :src="`https://www.youtube.com/embed/${media.link}`" frameborder="0"
                                            allowfullscreen style="width: 200px; height: 150px;"></iframe>
                                    </div>
                                </li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <td>Thêm nội dung</td>
                        <td>
                            <button type="button" @click="createContent()">Tạo nội dung</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, useTemplateRef,computed } from 'vue'
import { useRoute } from 'vue-router'
import { Ckeditor } from '@ckeditor/ckeditor5-vue';
// import '../assets/style.css';
// const CONST_HOST = "http://localhost:8080"
const CONST_HOST = "https://api.slmglobal.vn"

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
} from 'ckeditor5';

import translations from 'ckeditor5/translations/vi.js';

import 'ckeditor5/ckeditor5.css';

const LICENSE_KEY =
	'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDQ4NDc5OTksImp0aSI6IjRkNWRlZmY3LTc4OWMtNDNlNC1hZTBmLWMzYjk4NjgwYTM5YyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjAyMWVhOGUxIn0.Q6Igx3cWrL7tETWI-rEwu2eWYTj7OOcKf8PZhn0PqPEkJDtzGGD71ReRvx21-Dm2F0C0qr-c2TrhHhblYQbPCA';

const editorToolbar = useTemplateRef('editorToolbarElement');
const editorMenuBar = useTemplateRef('editorMenuBarElement');
const editorWordCount = useTemplateRef('editorWordCountElement');
const isLayoutReady = ref(false);

const editor = DecoupledEditor;

const config = computed(() => {
	if (!isLayoutReady.value) {
		return null;
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
				},
				{
					model: 'heading2',
					view: 'h2',
					title: 'Heading 2',
					class: 'ck-heading_heading2'
				},
				{
					model: 'heading3',
					view: 'h3',
					title: 'Heading 3',
					class: 'ck-heading_heading3'
				},
				{
					model: 'heading4',
					view: 'h4',
					title: 'Heading 4',
					class: 'ck-heading_heading4'
				},
				{
					model: 'heading5',
					view: 'h5',
					title: 'Heading 5',
					class: 'ck-heading_heading5'
				},
				{
					model: 'heading6',
					view: 'h6',
					title: 'Heading 6',
					class: 'ck-heading_heading6'
				}
			]
		},
		initialData:
			'',
		language: 'vi',
		licenseKey: LICENSE_KEY,
		link: {
			addTargetToExternalLinks: true,
			defaultProtocol: 'https://',
			decorators: {
				toggleDownloadable: {
					mode: 'manual',
					label: 'Downloadable',
					attributes: {
						download: 'file'
					}
				}
			}
		},
		menuBar: {
			isVisible: true
		},
		placeholder: 'Type or paste your content here!',
		table: {
			contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
		},
		translations: [translations]
	};
});

onMounted(() => {
	isLayoutReady.value = true;
});

function onReady(editor) {
	[...editorWordCount.value.children].forEach(child => child.remove());
	[...editorToolbar.value.children].forEach(child => child.remove());
	[...editorMenuBar.value.children].forEach(child => child.remove());

	const wordCount = editor.plugins.get('WordCount');
	editorWordCount.value.appendChild(wordCount.wordCountContainer);
	editorToolbar.value.appendChild(editor.ui.view.toolbar.element);
	editorMenuBar.value.appendChild(editor.ui.view.menuBarView.element);
}


const content_categories = ref([])
const title = ref('')
const hashtag = ref('')
const content = ref('')
const selectedCategory = ref(0)
const mediaList = ref([]); // Mảng lưu trữ danh sách media
const newMedia = ref({
    title: '',
    kind: 'image', // Mặc định là ảnh
    link: ''
}); // Biến lưu thông tin media mới

// Hàm thêm media vào danh sách
const addMedia = () => {
    if (newMedia.value.title.trim() !== '' && newMedia.value.link.trim() !== '') {
        // Nếu là video, kiểm tra xem link có phải là ID hợp lệ
        if (newMedia.value.kind === 'video') {
            const youtubeIdRegex = /^[a-zA-Z0-9_-]{11}$/; // Regex kiểm tra ID video YouTube
            if (!youtubeIdRegex.test(newMedia.value.link)) {
                alert('Vui lòng nhập một ID video YouTube hợp lệ (11 ký tự)!');
                return;
            }
        }

        // Thêm media vào danh sách
        mediaList.value.push({ ...newMedia.value });
        newMedia.value = { title: '', kind: 'image', link: '' }; // Reset form
    } else {
        alert('Vui lòng nhập đầy đủ thông tin media!');
    }
};

// Hàm xóa media khỏi danh sách
const removeMedia = (index) => {
    mediaList.value.splice(index, 1);
};

// Hàm lấy dữ liệu từ API
const fetchContentCategories = async () => {
    try {
        const response = await fetch(`${CONST_HOST}/api/content_category`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            content_categories.value = data; // Gán dữ liệu vào biến content_categories
        } else {
            console.error('Failed to fetch content categories');
        }
    } catch (error) {
        console.error('Error fetching content categories:', error);
    }
};

const createContent = async () => {
    const payload = {
        content_category_id: selectedCategory.value,
        title: title.value,
        hashtag: hashtag.value,
        content: content.value,
        media_contents: mediaList.value // Gửi danh sách media
    };

    try {
        const response = await fetch(`${CONST_HOST}/api/content`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('Content đã được thêm thành công!');
        } else {
            console.error('Failed to submit content');
        }
    } catch (error) {
        console.error('Error submitting content:', error);
    }
};


// Gọi hàm fetchContentCategories khi component được mount
onMounted(() => {
    fetchContentCategories();
});

</script>

<style lang="css" scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap');

/* Global styles for width */
body, html {
	width: 100%;
	margin: 0;
	padding: 0;
	overflow-x: hidden !important;
}

#app {
	width: 100% !important;
	max-width: 100% !important;
	padding: 0;
	margin: 0;
}

.ant-layout {
	width: 100% !important;
	max-width: 100% !important;
	padding: 0 !important;
	margin: 0 !important;
}

.ant-layout-content {
	width: 100% !important;
	max-width: 100% !important;
	padding: 0 !important;
}

.ant-layout-content > div {
	width: 100% !important;
	max-width: 100% !important;
	padding: 0 !important;
}

.ant-layout-sider {
	padding: 0 !important;
	border-right: none !important;
}

.ant-layout-header {
	padding-left: 16px !important;
	padding-right: 16px !important;
}

.ant-layout-footer {
	padding-left: 0 !important;
	padding-right: 0 !important;
}

.ant-row {
	width: 100% !important;
	margin-left: 0 !important;
	margin-right: 0 !important;
}

.ant-col {
	width: 100%;
	padding-left: 0 !important;
	padding-right: 0 !important;
}

.ant-card {
	width: 100% !important;
	margin-bottom: 16px !important;
}

.ant-card-body {
	width: 100% !important;
	padding: 16px !important;
}

.ant-table-wrapper {
	width: 100% !important;
	padding: 0 !important;
}

.ant-table {
	width: 100% !important;
}

/* Fix for Ant Design Table */
.ant-table-container {
	width: 100% !important;
}

.ant-table-content {
	width: 100% !important;
}

.ant-form {
	width: 100% !important;
}

.table-responsive {
	width: 100% !important;
	overflow-x: auto;
}

/* Views specific styles */
.add-battery, .add-cable, .add-cabinet, .add-aluminum-frame,
.add-grounding-system, .add-installation, .add-inverter,
.add-pin-pv, .add-content {
	padding: 16px !important;
	width: 100% !important;
}

@media print {
	body {
		margin: 0 !important;
	}
}

.main-container {
	--ckeditor5-preview-height: 700px;
	font-family: 'Lato';
	width: fit-content;
	margin-left: auto;
	margin-right: auto;
}

.ck-content {
	font-family: 'Lato';
	line-height: 1.6;
	word-break: break-word;
}

.editor-container__editor-wrapper {
	display: flex;
	width: fit-content;
}

.editor-container_document-editor {
	border: 1px solid var(--ck-color-base-border);
}

.editor-container_document-editor .editor-container__toolbar {
	display: flex;
	position: relative;
	box-shadow: 0 2px 3px hsla(0, 0%, 0%, 0.078);
}

.editor-container_document-editor .editor-container__toolbar > .ck.ck-toolbar {
	flex-grow: 1;
	width: 0;
	border-bottom-right-radius: 0;
	border-bottom-left-radius: 0;
	border-top: 0;
	border-left: 0;
	border-right: 0;
}

.editor-container_document-editor .editor-container__menu-bar > .ck.ck-menu-bar {
	border-bottom-right-radius: 0;
	border-bottom-left-radius: 0;
	border-top: 0;
	border-left: 0;
	border-right: 0;
}

.editor-container_document-editor .editor-container__editor-wrapper {
	max-height: var(--ckeditor5-preview-height);
	min-height: var(--ckeditor5-preview-height);
	overflow-y: scroll;
	background: var(--ck-color-base-foreground);
}

.editor-container_document-editor .editor-container__editor {
	margin-top: 28px;
	margin-bottom: 28px;
	height: 100%;
}

.editor-container_document-editor .editor-container__editor .ck.ck-editor__editable {
	box-sizing: border-box;
	min-width: calc(210mm + 2px);
	max-width: calc(210mm + 2px);
	min-height: 297mm;
	height: fit-content;
	padding: 20mm 12mm;
	border: 1px hsl(0, 0%, 82.7%) solid;
	background: hsl(0, 0%, 100%);
	box-shadow: 0 2px 3px hsla(0, 0%, 0%, 0.078);
	flex: 1 1 auto;
	margin-left: 72px;
	margin-right: 72px;
}

.editor_container__word-count .ck-word-count {
	color: var(--ck-color-text);
	display: flex;
	height: 20px;
	gap: var(--ck-spacing-small);
	justify-content: flex-end;
	font-size: var(--ck-font-size-base);
	line-height: var(--ck-line-height-base);
	font-family: var(--ck-font-face);
	padding: var(--ck-spacing-small) var(--ck-spacing-standard);
}

.editor-container_include-word-count.editor-container_document-editor .editor_container__word-count {
	border-top: 1px solid var(--ck-color-base-border);
}

/* Main styling for the table */
table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  margin-bottom: 30px;
  background-color: #fff;
}

/* Header styling */
table h1 {
  margin: 0;
  padding: 15px 0;
  color: #2c3e50;
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  width: 100%;
}

/* Table cells */
td {
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  vertical-align: middle;
  font-size: 14px;
}

/* Alternating row colors */
tr:nth-child(even) {
  background-color: #f8f9fa;
}

/* First column (labels) */
tr td:first-child {
  width: 180px;
  font-weight: 600;
  color: #2c3e50;
  background-color: #f1f8ff;
}

/* Input fields and selects */
input, select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input:focus, select:focus {
  border-color: #4f9de9;
  outline: none;
  box-shadow: 0 0 0 2px rgba(79, 157, 233, 0.2);
}

/* Number input fields specific styling */
input[type="number"] {
  max-width: 120px;
}

/* Button styling */
button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s, transform 0.2s;
  margin: 5px;
}

/* Primary action buttons */
button[type="button"] {
  background-color: #4f9de9;
  color: white;
}

button[type="button"]:hover {
  background-color: #3a8ad8;
  transform: translateY(-2px);
}

/* Remove buttons */
button[type="button"][onclick*="remove"] {
  background-color: #e74c3c;
  color: white;
  padding: 6px 12px;
  font-size: 12px;
}

button[type="button"][onclick*="remove"]:hover {
  background-color: #c0392b;
}

/* Add buttons */
button[type="button"][onclick*="add"] {
  background-color: #2ecc71;
  color: white;
}

button[type="button"][onclick*="add"]:hover {
  background-color: #27ae60;
}

/* Calculate buttons */
button[type="button"][onclick*="calculate"] {
  background-color: #f39c12;
  color: white;
}

button[type="button"][onclick*="calculate"]:hover {
  background-color: #e67e22;
}

/* Create combo button - make it stand out */
button[type="button"][onclick*="createCombo"] {
  background-color: #8e44ad;
  color: white;
  font-weight: 600;
  padding: 10px 20px;
}

button[type="button"][onclick*="createCombo"]:hover {
  background-color: #7d3c98;
  transform: translateY(-2px);
}

/* Item groups styling (for inverters, batteries, etc.) */
div[style="margin-bottom: 10px;"] {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 15px !important;
  background-color: #fafafa;
}

/* Header cells (first row) */
tr:first-child td {
  background-color: #34495e;
  color: white;
  border: none;
}

/* Total price and GM row highlighting */
tr:nth-last-child(3) td, 
tr:nth-last-child(2) td {
  background-color: #ecf0f1;
  font-weight: 600;
}

/* Make the fields in these rows stand out */
tr:nth-last-child(3) input, 
tr:nth-last-child(2) input {
  font-weight: bold;
  font-size: 16px;
  color: #2980b9;
  background-color: #f8f9fa;
}

/* Row hover effect */
tr:hover {
  background-color: #f5f7fa;
}


/* Đảm bảo bảng có thể cuộn khi nội dung dài */
form {
  min-height: 100%;
}

/* Fix lỗi không cuộn được trên một số trình duyệt */
@media screen and (max-width: 100%) {
  body {
    -webkit-overflow-scrolling: touch;
  }
}
</style>