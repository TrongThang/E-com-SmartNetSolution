"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, X, Check, Filter } from "lucide-react"
import attributeGroupApi from "@/apis/modules/attribute_group.api.ts"

export default function AttributeSelector({ open, onOpenChange, onSave, initialSelected = [] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [attributes, setAttributes] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAttributes = async () => {
    try {
      setLoading(true)
      const response = await attributeGroupApi.list({})
      // Transform API data to match component structure
      const transformedData = response.data.flatMap(group => 
        group.attributes.map(attr => ({
          id: attr.id,
          name: attr.name,
          group: group.name,
          type: attr.datatype,
          required: attr.required,
          is_hide: attr.is_hide,
          selected: initialSelected.includes(attr.id) // Set initial selected state
        }))
      )
      setAttributes(transformedData)
    } catch (error) {
      console.error("Error fetching attributes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttributes()
  }, [])

  // Update selected state when initialSelected changes
  useEffect(() => {
    setAttributes(prevAttributes =>
      prevAttributes.map(attr => ({
        ...attr,
        selected: initialSelected.includes(attr.id)
      }))
    )
  }, [initialSelected])

  // Get unique groups for tabs
  const groups = [...new Set(attributes.map((attr) => attr.group))]

  // Filter attributes based on search and active tab
  const filteredAttributes = attributes.filter((attr) => {
    const matchesSearch = attr.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "all" || attr.group === activeTab
    return matchesSearch && matchesTab
  })

  const handleToggleAttribute = (id) => {
    setAttributes(prevAttributes =>
      prevAttributes.map((attr) =>
        attr.id === id ? { ...attr, selected: !attr.selected } : attr
      )
    )
  }

  const handleSave = () => {
    const selectedAttributes = attributes.filter((attr) => attr.selected)
    onSave(selectedAttributes)
    onOpenChange(false)
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const selectedCount = attributes.filter((attr) => attr.selected).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl font-bold">Chọn danh mục thuộc tính</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4">
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm thuộc tính..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 h-11 border-gray-300 focus:border-black focus:ring-black"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Lọc theo nhóm:</span>
            </div>
            {selectedCount > 0 && (
              <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                Đã chọn: {selectedCount}
              </Badge>
            )}
          </div>

          <div className="mb-4">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn nhóm thuộc tính" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Tất cả</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[320px] pr-4">
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-12 text-gray-500">Đang tải...</div>
              ) : filteredAttributes.length > 0 ? (
                filteredAttributes.map((attribute) => (
                  <div
                    key={attribute.id}
                    className={`flex items-center justify-between border rounded-lg p-4 transition-colors ${attribute.selected ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    onClick={() => handleToggleAttribute(attribute.id)}
                  >
                    <div>
                      <p className="font-medium">{attribute.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {activeTab === "all" && (
                          <Badge variant="secondary" className="text-xs font-normal py-0 h-5">
                            {attribute.group}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs font-normal py-0 h-5 bg-gray-50">
                          {attribute.type}{attribute.required ? " - Bắt buộc" : ""}
                        </Badge>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${attribute.selected ? "bg-black border-black" : "border-gray-300"
                        }`}
                    >
                      {attribute.selected && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">Không tìm thấy thuộc tính phù hợp</div>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="px-6 py-4 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave} className="px-6">
            Lưu ({selectedCount})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 