import { useState } from "react"
import { Button } from "@/components/ui/button"
import ProductGrid from "@/components/common/product/ProductGrid.jsx"
import productApi from "@/apis/modules/product.api.ts"
import categoryApi from "@/apis/modules/categories.api.ts"
import { useEffect } from "react"
import CategoryGrid from "./categoryGird.page"
import Slideshow from "./slideshow.component"
import { useNavigate } from "react-router-dom"

export default function HomePage() {
	const [newArrivals, setNewArrivals] = useState([])
	const [featuredProducts, setFeaturedProducts] = useState([])
	const [categories, setCategories] = useState([])
	const navigate = useNavigate()

	const fecthProducts = async () => {
		try {
			const filter = [
				{
					logic: 'OR',
					filters: [
						{
							field: 'product.status',
							condition: '=',
							value: 3,
						},
						{
							field: 'product.status',
							condition: '=',
							value: 4,
						}
					]
				},
			]
			const res = await productApi.search({
				limit: 10,
				filters: filter
			})

			if (res.status_code === 200) {
				const filterFeatured = (res.data.data || []).filter(item => item.status === 3)

				const filteredNewArrivals = (res.data.data || []).filter(item => item.status === 4)

				setFeaturedProducts(filterFeatured)
				setNewArrivals(filteredNewArrivals)
			}
		} catch (error) {
			console.error("Failed to fetch products:", error)
		}
	}
	const fetchCategories = async () => {
		try {
			const filters = [
				{
					logic: 'AND',
					filters: [
						{
							field: 'categories.is_hide',
							condition: '=',
							value: false
						},
						{
							field: 'categories.parent_id',
							condition: 'is',
							value: null
						}
					]
				}
			];
			
			const res = await categoryApi.list({ limit: 6, filters: filters });
			if (res.status_code === 200) {	
				setCategories(res.data?.categories || []);
			}
		} catch (error) {
			console.error("Failed to fetch categories:", error)
		}
	}
	useEffect(() => {
		fetchCategories()
		fecthProducts()
	}, [])

	return (
		<div className="flex min-h-screen flex-col bg-blue-50">
			<main className="flex-1">
				{/* Hero Banner Section - Full Width */}
				<Slideshow />

				{/* Categories Section */}
				<section className="py-12 bg-white">
					<div className="mx-auto max-w-5xl px-4">
						<div className="mb-8 flex items-center justify-between">
							<h2 className="text-2xl font-bold text-gray-800">Danh mục sản phẩm</h2>
						</div>
						<CategoryGrid categories={categories} columns={6} />
					</div>
				</section>

				{/* Banner Promotion */}
				<section className="py-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
					<div className="mx-auto max-w-5xl px-4">
						<div className="flex flex-col md:flex-row items-center justify-between">
							<div className="mb-6 md:mb-0">
								<h2 className="text-2xl md:text-3xl font-bold mb-2">Vận chuyển nhanh chóng</h2>
								<p className="text-white/90"></p>
							</div>
							<Button className="bg-white hover:bg-gray-100 text-blue-700" size="lg" onClick={() => navigate('/search')}>
								Tìm kiếm ngay
							</Button>
						</div>
					</div>
				</section>

				{/* Featured Products Section */}
				<section className="py-12 bg-blue-50">
					<div className="mx-auto max-w-5xl px-4">
						<div className="mb-8 flex items-center justify-between">
							<h2 className="text-2xl font-bold text-gray-800">Thiết bị nổi bật</h2>
						</div>
						<ProductGrid products={featuredProducts} columns={5} />
					</div>
				</section>

				{/* New Devices Section */}
				<section className="py-12 bg-blue-50">
					<div className="mx-auto max-w-5xl px-4">
						<div className="mb-8 flex items-center justify-between">
							<h2 className="text-2xl font-bold text-gray-800">Thiết bị mới</h2>
						</div>
						<ProductGrid products={newArrivals} columns={5} />
					</div>
				</section>

			</main>		
		</div>
	)
}
