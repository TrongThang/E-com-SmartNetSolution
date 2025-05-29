"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Pagination({ currentPage, totalPages, onPageChange }) {
  const maxVisiblePages = 5 // Số trang tối đa hiển thị
  const halfVisible = Math.floor(maxVisiblePages / 2)
  
  // Tính toán các trang hiển thị
  let startPage = Math.max(1, currentPage - halfVisible)
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
  
  // Điều chỉnh nếu số trang hiển thị ít hơn maxVisiblePages
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)

  return (
    <div className="flex items-center justify-start gap-2 mt-6">
      {/* Nút Trước */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Trước
      </Button>

      {/* Các nút trang */}
      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {/* Nút Sau */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Sau
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div> 
  )
}