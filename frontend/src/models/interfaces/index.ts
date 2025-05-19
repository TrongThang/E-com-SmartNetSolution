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
    value: string | number | undefined;
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
export interface IProduct {
    id: number;
    name: string;
    code: string;
    price: number;
    quantity: number;
    unit: string;
    description: string;
    created_at: string;
    updated_at: string;
    import_warehouse_id: number | null;
    import_warehouse?: IImportWarehouse | null;
}

export interface IEmployee {
    id: number;
    surname: string;
    lastname: string;
    image: string;
    email: string;
    birthdate: string;
    gender: number;
    phone: string;
    status: number;
    created_at: string;
    updated_at: string;
}

export interface IProductDetail {
    id: number;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    unit: string;
    attributeGroups: IAttributeGroup[];
    description: string;
    created_at: string;
    updated_at: string;
}

export interface IAttributeGroup {
    id: number;
    name: string;
    attributes: IAttribute[];
}

export interface IAttribute {
    id: number;
    name: string;
    value: string;
    created_at: string;
    updated_at: string;
}

export interface IReview {
    id: number;
    product_id: number;
    customer_id: number;
    surname: string;
    lastname: string;
    rating: number;
    comment: string;
    created_at: string;
    updated_at: string;
}

export interface IBlog {
    id: number;
    title: string;
    author: string;
    content: string;
    content_normal?: string;
    image?: string; // base64 string
    score?: number;
    is_hide?: boolean;
    category_name?: string;
    product_name?: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

export interface IContact {
    fullname: string;
    email: string;
    title: string;
    content: string;
}
export interface ICustomer {
    id: string;
    surname: string;
    lastname: string;
    image: string;
    phone: string;
    email: string;
    email_verified: string;
    birthdate: string;
    gender: string;
    created_at: string;
    updated_at: string;
}

export interface IAddressBook {
    id: number;
    city: string;
    district: string;
    ward: string;
    street: string;
    detail: string;
    is_default: string;
    created_at: string;
    updated_at: string;
}

export interface ILiked {
    id: string;
    name: string;
    image: string;
    selling_price: number;
    description: string;
    created_at: string;
    updated_at: string;
}
