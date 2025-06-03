// src/components/common/blog/BlogPagination.jsx
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PlanPagination({ page, totalPage, onPageChange }) {
    const getPageNumbers = () => {
        const pages = [];

        if (totalPage <= 3) {
            for (let i = 1; i <= totalPage; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (page > 2) {
                pages.push("...");
            }

            if (page !== 1 && page !== totalPage) {
                pages.push(page);
            }

            if (page < totalPage - 1) {
                pages.push("...");
            }

            pages.push(totalPage);
        }

        return pages;
    };

    if (totalPage <= 1) return null;

    return (
        <div className="mt-8">
            <Pagination className="justify-start">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationLink
                            onClick={() => onPageChange(page - 1)}
                            className={page === 1 ? "pointer-events-none opacity-50" : ""}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </PaginationLink>
                    </PaginationItem>

                    {getPageNumbers().map((pageNum, index) => (
                        <PaginationItem key={index}>
                            {pageNum === "..." ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    onClick={() => onPageChange(pageNum)}
                                    isActive={page === pageNum}
                                >
                                    {pageNum}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationLink
                            onClick={() => onPageChange(page + 1)}
                            className={page === totalPage ? "pointer-events-none opacity-50" : ""}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </PaginationLink>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}