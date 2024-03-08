<template>
    <div>
        <m-choose-icon title="选择图标" v-model:visible="visible"
            >选择图标</m-choose-icon
        >
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

// 弹窗是否显示 true 显示 false 不显示
const visible = ref<boolean>(false);
</script>
<style lang="scss" scoped></style>
