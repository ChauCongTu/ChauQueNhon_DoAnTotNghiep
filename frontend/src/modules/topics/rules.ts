import { message } from "antd";
import { Rule } from "antd/es/form";

export const titleRules: Rule[] = [
    {
        required: true,
        message: "Vui lòng nhập tiêu đề"
    }
];
export const contentRules: Rule[] = [
    {
        required: true,
        message: "Vui lòng nhập nội dung"
    }
];