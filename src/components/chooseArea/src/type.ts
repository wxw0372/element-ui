// 定义省市区数据的ts类型
export interface AreaItem {
    code: string;
    namee: string;
    children?: AreaItem[];
}

// 返回给父组件的ts类型
export interface Data {
    name: string;
    code: string;
}
