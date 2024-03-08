<template>
    <div>
        <m-choose-area @change="getData"></m-choose-area>
    </div>
</template>
<script setup lang="ts">
import { DAta } from "../../components/chooseArea/src/type";

const getData = (data: DAta) => {
    console.log(data);
};
</script>
<style lang="scss" scoped></style>
