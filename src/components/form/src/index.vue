<template>
    <el-form
        ref="form"
        v-if="model"
        :validate-on-rule-change="false"
        :model="model"
        :rules="rules"
        v-bind="$attrs"
    >
        <template v-for="(item, index) in options">
            <!-- 没有children -->
            <el-form-item
                :key="index"
                v-if="!item.children || !item.children!.length"
                :prop="item.prop"
                :label="item.label"
            >
                <!-- 如果type 不是 upload, 则使用component 加载对应的组件 -->
                <component
                    v-if="item.type !== 'upload' && item.type !== 'editor'"
                    v-bind="item.attrs"
                    :placeholder="item.placeholder"
                    v-model="model[item.prop!]"
                    :is="`el-${item.type}`"
                ></component>
                <!-- 如果type 是 upload, 则使用el-upload组件 -->
                <el-upload
                    v-bind="item.uploadAttrs"
                    v-if="item.type === 'upload'"
                    :on-preview="onPreview"
                    :on-remove="onRemove"
                    :on-success="onSuccess"
                    :on-error="onError"
                    :on-progress="onProgress"
                    :on-change="onChange"
                    :before-upload="beforeUpload"
                    :before-remove="beforeRemove"
                    :on-exceed="onExceed"
                    :http-request="httpRequest"
                >
                    <slot name="uploadArea"></slot>
                    <slot name="uploadTip"></slot>
                </el-upload>
                <!-- 渲染wangeditor插件 -->
                <div
                    id="editor"
                    v-if="item.type === 'editor'"
                    style="border: 1px solid #ccc"
                >
                    <Toolbar
                        style="border-bottom: 1px solid #ccc"
                        :editor="editorRef"
                        :defaultConfig="toolbarConfig"
                        mode="default"
                    />
                    <Editor
                        style="height: 500px; overflow-y: hidden"
                        v-model="model[item.prop!]"
                        :defaultConfig="{
                            placeholder: item.placeholder,
                            ...item.attrs,
                        }"
                        mode="default"
                        @onCreated="handleCreated"
                    />
                </div>
            </el-form-item>
            <!-- 有children -->
            <el-form-item
                v-if="item.children && item.children.length"
                :prop="item.prop"
                :label="item.label"
            >
                <component
                    v-bind="item.attrs"
                    v-model="model[item.prop!]"
                    :placeholder="item.placeholder"
                    :is="`el-${item.type}`"
                >
                    <component
                        v-for="(child, i) in item.children"
                        :key="i"
                        :is="`el-${child.type}`"
                        :label="child.label"
                        :value="child.value"
                    ></component>
                </component>
            </el-form-item>
        </template>
        <el-form-item>
            <slot name="action" :form="form" :model="model"></slot>
        </el-form-item>
    </el-form>
</template>
<script setup lang="ts">
import {
    ref,
    type PropType,
    onMounted,
    watch,
    shallowRef,
    onBeforeUnmount,
} from "vue";
import type { FormOptions, FormInstance } from "./types/types";
import { cloneDeep } from "lodash";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
let props = defineProps({
    options: {
        type: Array as PropType<FormOptions[]>,
        required: true,
    },

    // 用户自定义上传方法
    httpRequest: {
        type: Function,
    },
});

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
// const valueHtml = ref("<p>hello</p>");

// 模拟 ajax 异步获取内容
// onMounted(() => {
//     setTimeout(() => {
//         valueHtml.value = "<p>模拟 Ajax 异步设置内容</p>";
//     }, 1500);
// });

const toolbarConfig = {};
// const editorConfig = { placeholder: "请输入内容..." };

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});

const handleCreated = (editor) => {
    editorRef.value = editor; // 记录 editor 实例，重要！
};

// 定义表单的实例
const form = ref<FormInstance | null>();
// 表单数据
let model = ref<any>({});
// 表单校验规则
let rules = ref<any>({});

// 初始化表单数据与校验规则方法
let initForm = () => {
    // 判断表单配置项的数据是否存在
    if (props.options && props.options.length) {
        // 保存的是表单配置项中表单的数据
        let m: any = {};
        // 保存的是表单配置项中表单的校验规则
        let r: any = {};

        // 遍历表单配置项的数据
        props.options.forEach((item) => {
            m[item.prop!] = item.value;
            r[item.prop!] = item.rules;
        });

        // 将表单的数据进行深拷贝,赋值给model
        model.value = cloneDeep(m);
        // 将表单的校验规则进行深拷贝, 赋值给rules
        rules.value = cloneDeep(r);
        model.value.desc = "";
    }

    console.log("rules", rules.value);
};

// 子传父
let emits = defineEmits([
    "on-preview",
    "on-remove",
    "on-success",
    "on-error",
    "on-progress",
    "on-change",
    "before-upload",
    "before-remove",
    "on-exceed",
]);

// 点击文件列表中已上传的文件时的钩子
let onPreview = (file: File) => {
    emits("on-preview", file);
};
// 文件列表移除文件时的钩子
let onRemove = (file: File, fileList: FileList) => {
    emits("on-remove", { file, fileList });
};
// 文件上传成功时的钩子
let onSuccess = (response: any, file: File, fileList: FileList) => {
    // 上传图片成功 给表单上传项赋值
    let uploadItem = props.options.find((item) => item.type === "upload")!;
    model.value[uploadItem.prop!] = { response, file, fileList };
    emits("on-success", { response, file, fileList });
};
// 文件上传失败时的钩子
let onError = (err: any, file: File, fileList: FileList) => {
    emits("on-error", { err, file, fileList });
};
// 文件上传时的钩子
let onProgress = (event: any, file: File, fileList: FileList) => {
    emits("on-progress", { event, file, fileList });
};
// 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
let onChange = (file: File, fileList: FileList) => {
    emits("on-change", { file, fileList });
};
// 上传文件之前的钩子，参数为上传的文件， 若返回false或者返回 Promise 且被 reject，则停止上传。
let beforeUpload = (file: File) => {
    emits("before-upload", file);
};
// 删除文件之前的钩子，参数为上传的文件和文件列表， 若返回 false 或者返回 Promise 且被 reject，则停止删除。
let beforeRemove = (file: File, fileList: FileList) => {
    emits("before-remove", { file, fileList });
};
// 当超出限制时，执行的钩子函数
let onExceed = (files: File, fileList: FileList) => {
    emits("on-exceed", { files, fileList });
};
// 自定义上上传
let httpRequest = () => {
    console.log("val");
};

// dom加载时
onMounted(() => {
    initForm();
});
// 监听父组件传递过来的options变化
watch(
    () => props.options,
    () => {
        initForm();
    },
    {
        deep: true,
    }
);
</script>
<style lang="scss" scoped></style>
