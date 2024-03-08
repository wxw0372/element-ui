import { ElMessage } from "element-plus";
// 复制文本功能
export const useCopy = (text: string) => {
    // 1.创建文本框
    const input = document.createElement("input");
    // 2.将传进来的文本赋值给文本框
    input.value = text;
    // 3.将文本框渲染到body中
    document.body.appendChild(input);
    // 4.点击文本框
    input.select();
    // 5.执行浏览器赋值命令
    document.execCommand("Copy");
    // 6.移除文本框
    document.body.removeChild(input);
    // 7.弹出提示框
    ElMessage.success("复制成功");
};
