<template>
    <div class="Area">
        <el-select placeholder="请选择省份" clearable v-model="province">
            <el-option
                v-for="item in areas"
                :key="item.code"
                :label="item.name"
                :value="item.code"
            >
            </el-option>
        </el-select>
        <el-select
            clearable
            :disabled="!province"
            placeholder="请选择城市"
            v-model="city"
        >
            <el-option
                v-for="item in selectCity"
                :key="item.code"
                :label="item.name"
                :value="item.code"
            >
            </el-option>
        </el-select>
        <el-select
            clearable
            :disabled="!province || !city"
            placeholder="请选择区域"
            v-model="area"
        >
            <el-option
                v-for="item in selectArea"
                :key="item.code"
                :label="item.name"
                :value="item.code"
            >
            </el-option>
        </el-select>
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import AllAreas from "../lib/pca-code.json";
import type { AreaItem, Data } from "./type";

// 省
const province = ref<string>("");
// 市
const city = ref<string>("");
// 区县
const area = ref<string>("");

// 获取到的省市区的数据
let areas = ref<AreaItem[]>(AllAreas);

// 城市下拉框的所有的值
let selectCity = ref<AreaItem[]>([]);

// 区域下拉框的所有的值
let selectArea = ref<AreaItem[]>([]);

// 监听选择省省数据拜年话
watch(
    () => province.value,
    (val) => {
        if (val) {
            selectCity.value = areas.value.find(
                (item) => item.code === province.value
            )!.children!;
        }
        city.value = "";
        area.value = "";
    }
);

// 监听选择市数据变化
watch(
    () => city.value,
    (val) => {
        if (val) {
            selectArea.value = selectCity.value.find(
                (item) => item.code === val
            )!.children!;
        }
        area.value = "";
    }
);

// 定义子传父
const emits = defineEmits(["change"]);

// 监听选择区域数据变化
watch(
    () => area.value,
    (val) => {
        if (val) {
            const provinceData: Data = {
                code: province.value,
                name:
                    province.value &&
                    AllAreas.find((item) => item.code === province.value)!.name,
            };
            const cityData: Data = {
                code: city.value,
                name:
                    city.value &&
                    selectCity.value.find((item) => item.code === city.value)!
                        .name,
            };
            const areaData: Data = {
                code: val,
                name:
                    val &&
                    selectArea.value.find((item) => item.code === val)!.name,
            };

            // 将选择省市区子数据传递给父组件
            emits("change", {
                province: provinceData,
                city: cityData,
                area: areaData,
            });
        }
    }
);
</script>
<style lang="scss" scoped>
.Area {
    display: flex;
}
</style>
