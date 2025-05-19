// src/components/common/blog/BlogSearch.jsx
import { Input } from "@/components/ui/input";

export default function BlogSearch({ search, onSearchChange }) {
    return (
        <div className="flex justify-center mb-8">
            <Input
                className="max-w-md"
                placeholder="Tìm kiếm theo tiêu đề"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </div>
    );
}