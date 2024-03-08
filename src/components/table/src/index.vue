<template>
    <el-table
        :data="data"
        v-loading="isLoading"
        :element-loading-text="elementLoadingText"
        :element-loading-spinner="elementLoadingSpinner"
        :element-loading-background="elementLoadingBackground"
        :element-loading-svg="elementLoadingSvg"
        :element-loading-svg-view-box="elementLoadingSvgViewBox"
    >
        <!-- template只渲染非操作项的数据 -->
        <template v-for="(item, index) in tableOptions" :key="index">
            <el-table-column
                v-if="item.type === 'selection'"
                type="selection"
            ></el-table-column>
            <el-table-column
                v-else-if="item.type === 'index'"
                type="selection"
            ></el-table-column>
            <el-table-column
                v-else-if="item.type === 'expand'"
                type="selection"
            ></el-table-column>
            <!-- 优化之后的 -->
            <el-table-column
                v-else
                :prop="item.prop"
                :label="item.label"
                :align="item.align"
                :width="item.width"
            >
                <template #default="scope">
                    <!-- 编辑状态 -->
                    <template
                        v-if="currentEdit === scope.$index + scope.column.id"
                    >
                        <div style="display: flex">
                            <el-input
                                v-model="scope.row[item.prop!]"
                            ></el-input>
                            <div>
                                <slot
                                    v-if="$slots.cellEdit"
                                    name="cellEdit"
                                    :scope="scope"
                                ></slot>
                                <div v-else class="action-icon">
                                    <el-icon-check
                                        @click="check(scope)"
                                        class="check"
                                    ></el-icon-check>
                                    <el-icon-close
                                        @click="close(scope)"
                                        class="close"
                                    ></el-icon-close>
                                </div>
                            </div>
                        </div>
                    </template>
                    <!-- 非编辑状态 -->
                    <template v-else>
                        <slot
                            v-if="item.slot"
                            :name="item.slot"
                            :scope="scope"
                        ></slot>
                        <span v-else>{{ scope.row[item.prop!] }}</span>
                        <!-- <el-icon-edit
                @click="clickEdit(scope)"
                class="edit"
                v-if="item.editable"
              ></el-icon-edit> -->
                        <component
                            @click="clickEdit(scope)"
                            class="edit"
                            v-if="item.editable"
                            :is="`el-icon-${toLine(editIcon)}`"
                        ></component>
                    </template>
                </template>
            </el-table-column>

            <!-- 优化之前的 -->
            <!-- <el-table-column
          v-else
          :prop="item.prop"
          :label="item.label"
          :align="item.align"
          :width="item.width"
        >
          <template #default="scope">
            <slot :name="item.slot" :scope="scope"></slot>
          </template>
        </el-table-column> -->
        </template>

        <!-- 操作项 -->
        <el-table-column
            v-if="actionOptions"
            :label="actionOptions!.label"
            :align="actionOptions!.align"
            :width="actionOptions!.width"
        >
            <template #default="scope">
                <slot name="action" :scope="scope"></slot>
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts" setup>
import { computed, ref, type PropType } from "vue";
import type { TableOptions } from "./types";
import { toLine } from "../../../utils";

// 接收父组件传递过来的表单配置项数据
let props = defineProps({
    // 表单配置项数据
    options: {
        type: Array as PropType<TableOptions[]>,
        required: true,
    },
    // 表格数据
    data: {
        type: Array as PropType<any[]>,
        required: true,
    },
    // 加载文案
    elementLoadingText: {
        type: String,
    },
    // 加载图标名
    elementLoadingSpinner: {
        type: String,
    },
    // 加载背景颜色
    elementLoadingBackground: {
        type: String,
    },
    // 加载图标是svg
    elementLoadingSvg: {
        type: String,
    },
    // 加载团是svg的配置
    elementLoadingSvgViewBox: {
        type: String,
    },
    // 自定义编辑图标
    editIcon: {
        type: String,
        default: "edit",
    },
});

//  过滤非操作项配置数据
const tableOptions = computed(() => {
    return props.options.filter((item) => !item.action);
});

// 过滤出操作项的配置数据
const actionOptions = computed(() => {
    return props.options.find((item) => item.action);
});

// 定义loading加载状态
const isLoading = computed(() => {
    return !props.data || !props.data.length;
});

// 声明一个变量, 保存当前点击的单元格的标识
let currentEdit = ref<string>("");

// 点击编辑图标事件
const clickEdit = (scope: any) => {
    currentEdit.value = scope.$index + scope.column.id;
};

// 定义子传父事件
let emits = defineEmits(["confirm", "cancel"]);

// 勾的方法
const check = (scope: any) => {
    emits("confirm", scope);
    currentEdit.value = "";
};
// 叉的方法
const close = (scope: any) => {
    emits("cancel", scope);
    currentEdit.value = "";
};
</script>

<style scoped lang="scss">
.edit {
    width: 1em;
    height: 1em;
    position: relative;
    left: 5px;
    top: 2px;
    cursor: pointer;
}
.action-icon {
    display: flex;
    align-items: center;
    height: 100%;

    svg {
        width: 1em;
        height: 1em;
        margin-left: 8px;
        // position: relative;
        // top: 8px;
        cursor: pointer;
    }

    .check {
        color: red;
    }
    .close {
        color: green;
    }
}
</style>
