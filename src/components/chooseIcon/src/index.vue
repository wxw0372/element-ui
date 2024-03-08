<template>
    <el-button type="primary" @click="handleClick">
        <slot></slot>
    </el-button>

    <div class="m-choose-icon-dialog-body-height">
        <el-dialog v-model="dialogVisible" :title="title">
            <div class="container">
                <div
                    class="item"
                    v-for="(item, index) in Object.keys(ElementPlusIconsVue)"
                    :key="index"
                    @click="clickItem(item)"
                >
                    <div class="text">
                        <component :is="`el-icon-${toLine(item)}`"></component>
                    </div>

                    <div class="icon">{{ item }}</div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";

// 导入所有element-plus icon图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { toLine } from "../../../utils/index";
import { useCopy } from "../../../hooks/useCopy";
// 接受父组件传递的数据
let props = defineProps<{
    // 标题
    title: string;
    // 是否显示弹窗
    visible: boolean;
}>();

const emits = defineEmits(["update:visible"]);

// 拷贝一份父组件传递过来的visible
const dialogVisible = ref<boolean>(props.visible);

// 开启或者关闭弹窗方法
const handleClick = () => {
    emits("update:visible", !props.visible);
};

// 点击复制
const clickItem = (item: string) => {
    console.log("item: " + item);

    // 转化图标名称
    const text = `<el-icon-${toLine(item)}/>`;

    // 点击拷贝
    useCopy(text);
};

// 监听visible的变化, 只能监听第一次的变化
watch(
    () => props.visible,
    (val) => {
        dialogVisible.value = val;
    }
);

// 监听组件内部dialogVisible的变化
watch(
    () => dialogVisible.value,
    (val) => {
        emits("update:visible", val);
    }
);
</script>
<style lang="scss" scoped>
.container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}
.item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    height: 70px;
}
.text {
    font-size: 14px;
}
.icon {
    flex: 1;
}
svg {
    width: 2em;
    height: 2em;
}
</style>
