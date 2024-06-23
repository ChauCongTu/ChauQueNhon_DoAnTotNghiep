import { message } from "antd";
import { Rule } from "antd/es/form";

export const titleRules: Rule[] = [
    {
        required: true,
        message: "Vui lòng nhập tiêu đề"
    },
    {
        min: 5,
        message: "Tiêu đề tối thiểu 5 ký tự"
    },
    {
        max: 255,
        message: "Tiêu đề tối đa 255 ký tự"
    }
];
export const contentRules: Rule[] = [
    {
        required: true,
        message: "Vui lòng nhập nội dung"
    }
];