"use client"

import { useEffect, useState } from "react"
import { Search, Plus, Barcode, Scan } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axiosPublic from "@/apis/clients/public.client"
import { formatCurrency } from "@/utils/format"
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"
import axiosIOTPublic from "@/apis/clients/iot.private.client"
// import { BarcodeScanner } from "@/components/common/warehouse/BarcodeScanner"

export function ProductSelector({ open, onOpenChange, onProductSelect }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedPlanning, setSelectedPlanning] = useState("")
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [plannings, setPlannings] = useState([])
    const [batches, setBatches] = useState([])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                const response = await axiosPublic.get('/product')
                if (response.status_code === 200) {
                    setProducts(response.data.data)
                } else {
                    setError('Failed to fetch products')
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        const fetchPlannings = async () => {
            try {
                const response = await axiosIOTPublic.get('/planning/plannings-by-batch-production-status-is-completed')
                setPlannings(response)
            } catch (err) {
                setError(err.message)
            }
        }
    
        if (open) {
            fetchProducts()
            fetchPlannings()
        }
    }, [open])

    useEffect(() => {
        const fetchBatchesByPlaning = async () => {
            try {
                const response = await axiosIOTPublic.get(`/planning/list-batches-completed/${selectedPlanning}`)
                setBatches(response.data.data)
            } catch (err) {
                setError(err.message)
            }
        }

        if (selectedPlanning) {
            fetchBatchesByPlaning()
        }

    }, [selectedPlanning])

    // Filter products based on search term and category
    const filteredProducts = products.filter(
        (product) =>
            (product.name.toLowerCase().includes(searchTerm.toLowerCase())
                ) &&
            (selectedPlanning === "all" || product.categories.toLowerCase() === selectedPlanning.toLowerCase()),
    )

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Thêm lô sản xuất</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 ">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Tìm kiếm lô sản xuất theo tên hoặc mã"
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <Select
                                onValueChange={(value) => setSelectedPlanning(value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Tất cả" />
                                </SelectTrigger>
                                <SelectContent>
                                    {plannings.map((planning) => (
                                        <SelectItem key={planning.planning_id} value={planning.planning_id}>
                                            {planning.planning_id}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <ScrollArea className="h-[400px]">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {batches.map((batch) => (
                                    <Card
                                        key={batch.production_batch_id}
                                        className="hover:bg-muted transition-colors cursor-pointer"
                                        onClick={() => {
                                            onProductSelect(batch)
                                            onOpenChange(false)
                                        }}
                                    >
                                        <CardContent className="flex items-start">
                                            <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                                <img
                                                    src={batch.product_image || "/placeholder.svg"}
                                                    alt={batch.product_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium line-clamp-2">{batch.product_name}</h4>
                                                <div className="flex items-center gap-2 mt-1 rounded-md bg-blue-500 text-white">
                                                    <Badge variant="secondary" className="capitalize">
                                                        {batch.production_batch_id}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Button size="sm" className="flex-shrink-0">
                                                <Plus className="h-4 w-4"/>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
