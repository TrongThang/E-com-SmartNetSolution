import { ChevronRight, Folder } from "lucide-react";

const CategoriesTable = ({ 
    categories, 
    expandedCategories, 
    selectedCategory, 
    searchTerm, 
    onToggleCategory, 
    onSelectCategory 
}) => {
    // Hàm đệ quy để render cây danh mục
    const renderCategoryTree = (categoryList, parentId = null, level = 0) => {
        return categoryList
            .filter(cat => cat.parent_id === parentId)
            .map(category => (
                <div key={category.category_id}>
                    <div className="flex items-start">
                        <div
                            className={`flex items-center py-1 px-2 rounded-md flex-1 cursor-pointer hover:bg-gray-50 ${selectedCategory?.category_id === category.category_id ? "bg-gray-100" : ""}`}
                            onClick={() => {
                                onSelectCategory(category);
                                if (category.children?.length > 0) {
                                    onToggleCategory(category.category_id);
                                }
                            }}
                        >
                            <Folder size={16} className="mr-2 text-gray-500" />
                            <span className="text-sm flex-1">
                                {category.name}
                                {searchTerm && category.name.toLowerCase().includes(searchTerm.toLowerCase()) && (
                                    <span className="ml-1 text-xs text-blue-500">(match)</span>
                                )}
                            </span>
                            {category.children?.length > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleCategory(category.category_id);
                                    }}
                                    className={`p-1 transition-transform duration-200 ${expandedCategories.includes(category.category_id) ? "rotate-90" : ""}`}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {expandedCategories.includes(category.category_id) && category.children?.length > 0 && (
                        <div className="ml-6">
                            {renderCategoryTree(category.children, category.category_id, level + 1)}
                        </div>
                    )}
                </div>
            ));
    };

    return (
        <div className="space-y-1">
            {renderCategoryTree(categories)}
        </div>
    );
};

export default CategoriesTable;