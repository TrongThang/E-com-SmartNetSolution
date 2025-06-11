import { useState, useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GenericTable({
  data = [],
  columns = [],
  showFooter = false,
  footerLabel = "Total",
  totalAmount = "",
  rowsPerPage = 5,
  defaultSortField = null,
  defaultSortOrder = "asc",
}) {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredData = useMemo(() => {
    let result = data;

    // Filter
    if (searchText) {
      result = result.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }

    // Sort
    if (sortField) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue === bValue) return 0;

        const comparison = aValue > bValue ? 1 : -1;
        return sortOrder === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchText, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;

    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Hàm tạo mảng các trang để hiển thị
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Luôn hiển thị trang đầu tiên
      pages.push(1);

      if (currentPage > 2) {
        pages.push("...");
      }

      // Hiển thị trang hiện tại nếu không phải trang đầu hoặc cuối
      if (currentPage !== 1 && currentPage !== totalPages) {
        pages.push(currentPage);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Luôn hiển thị trang cuối cùng
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="">
      <Input
        type="text"
        placeholder="Tìm kiếm..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="w-full max-w-sm"
      />

      <Table className="mt-4 overflow-y-auto">
        <TableHeader>
          <TableRow className="bg-gray-50">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  "text-xs font-medium text-gray-500 uppercase tracking-wider",
                  col.alignRight ? "text-right" : "",
                  col.sortName ? "cursor-pointer hover:bg-gray-100" : ""
                )}
                onClick={() => col.sortName && handleSort(col.sortName)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortName && (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          {currentData.map((row, index) => (
            <TableRow key={index}>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  className={col.alignRight ? "text-right" : ""}
                >
                  {col.render ? col.render(row, index) : row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>

        {showFooter && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length - 1}>{footerLabel}</TableCell>
              <TableCell className="text-right">{totalAmount}</TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>

      {/* Pagination */}
      <Pagination className="justify-center mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              onClick={() => handlePageChange(currentPage - 1)}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "hover:bg-blue-400 hover:text-white"}
            >
              <ChevronLeft className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>

          {getPageNumbers().map((page, index) => (
            <PaginationItem key={index}>
              {page === "..." ? (
                <PaginationEllipsis />
              ) : (
                  <PaginationLink
                  className={currentPage === page ? "bg-blue-600 text-white" : "hover:bg-blue-400 hover:text-white"}
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationLink
              onClick={() => handlePageChange(currentPage + 1)}
              className={
                currentPage === totalPages ? "pointer-events-none opacity-50" : "hover:bg-blue-400 hover:text-white"
              }
            >
              <ChevronRight className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
