import { JSX } from "react";
import { ESortOrderValue } from "../enums/option";

export interface IPagination {
    currentPage: number;
    totalPage: number;
}

export interface IApiResponse<T = undefined> {
    success: boolean;
    error: number;
    message: string;
    data?: {
        data: T;
        total_page?: number;
    };
}

export interface FilterOption {
    id: string;
    label: string;
    icon: JSX.Element;
}

export interface FilterSearch {
    field: string;
    condition: string;
    value: string | undefined;
}

export interface ISortOrder<T = undefined> {
    sort: keyof T | "";
    order: ESortOrderValue;
}

// export interface Column<T> {
//     key: keyof T;
//     label: string;
//     sortName?: keyof T;
//     searchCondition?: "number" | "text" | "money" | undefined;
//     render?: (row: T) => React.ReactNode;
//     minW?: string;
// }
export interface IApiResponse<T = undefined> {
    success: boolean;
    error: number;
    message: string;
    data?: {
        data: T;
        total_page?: number;
    };
}

export interface IImportWarehouse {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface ICategories {
    category_id: number;
    name: string;
    slug: string;
    description: string;
    parent_id: number | null;
    image: string;
    is_hide: boolean;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
    attribute_groups: any[]; // hoặc: AttributeGroup[] nếu bạn có định nghĩa interface riêng
    children: ICategories[]; // để hỗ trợ cây phân cấp danh mục
}
