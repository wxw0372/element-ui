<template>
    <m-table
        :data="tableData"
        :options="options"
        elementLoadingText="加载中..."
        elementLoadingBackground="rgba(0,0,0,.8)"
        :element-loading-svg="svg"
        element-loading-svg-view-box="-10, -10, 50, 50"
        @confirm="check"
        @cancel="close"
    >
        <template #date="{ scope }">
            <!--  时间图标 -->
            <el-icon-timer></el-icon-timer>
            <!-- 时间 -->
            {{ scope.row.date }}
        </template>

        <template #name="{ scope }">
            <el-popover
                placement="top-start"
                title="Title"
                :width="200"
                trigger="hover"
                content="this is content, this is content, this is content"
            >
                <template #reference>
                    <el-tag>{{ scope.row.name }}</el-tag>
                </template>
            </el-popover>
        </template>
        <!-- 勾和叉换成确定和取消按钮 -->
        <!-- <template #cellEdit="{ scope }">
            <div
                style="
                    display: flex;

                    height: 100%;
                    align-items: center;
                "
            >
                <el-button size="small" type="primary">确定</el-button>
                <el-button size="small" style="margin-left: 0">取消</el-button>
            </div>
        </template> -->
        <template #action="{ scope }">
            <el-button type="primary" size="small" @click="edit(scope)"
                >编辑</el-button
            >
            <el-button type="danger" size="small" @click="remove(scope)"
                >删除</el-button
            >
        </template>
    </m-table>
</template>
<script setup lang="ts">
import { ref } from "vue";
import type { TableOptions } from "../../components/table/src/types";

// svg
let svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>`;

// 表格数据
interface TableData {
    date: string;
    name: string;
    address: string;
}
// 表格数据

let tableData = ref<TableData[]>([
    {
        date: "2016-05-03",
        name: "Tom",
        address: "No. 189, Grove St, Los Angeles",
    },
    {
        date: "2016-05-02",
        name: "Tom",
        address: "No. 189, Grove St, Los Angeles",
    },
    {
        date: "2016-05-04",
        name: "Tom",
        address: "No. 189, Grove St, Los Angeles",
    },
    {
        date: "2016-05-01",
        name: "Tom",
        address: "No. 189, Grove St, Los Angeles",
    },
]);
// 表格配置项数据
let options: TableOptions[] = [
    {
        label: "日期",
        prop: "date",
        align: "center",
        slot: "date",
        editable: true,
    },
    {
        label: "姓名",
        prop: "name",
        align: "center",
        slot: "name",
    },
    {
        label: "地址",
        prop: "address",
        align: "center",
        editable: true,
    },
    {
        label: "操作",
        align: "center",
        action: true,
    },
];

// 编辑
const edit = (scope: any) => {
    console.log(scope);
};

// 删除
const remove = (scope: any) => {
    console.log(scope);
};
// 监听点击了正确图标
let check = (scope: any) => {
    console.log("父组件", scope);
};
// 监听点击了错误图标
let close = (scope: any) => {
    console.log("父组件", scope);
};
</script>
<style lang="scss" scoped>
svg {
    width: 1em;
    height: 1em;
}
</style>
