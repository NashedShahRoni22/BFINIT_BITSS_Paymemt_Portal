import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
const BASE_URL = import.meta.env.VITE_Base_Url;

export default function Categories() {
  const { user } = useAuth();
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sort_description: "",
    image: null,
  });

  // Fetch category-wise products
  const fetchCategoryProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/products/product/category-wise/products`
      );
      const data = await response.json();
      if (data.success) {
        setCategoryProducts(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching category products:", error);
      alert("Failed to fetch category products");
    } finally {
      setLoading(false);
    }
  };

  // Create new category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("sort_description", formData.sort_description);
    formDataToSend.append("status", "active");
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await fetch(
        `${BASE_URL}/products/product/category/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user}`,
          },
          body: formDataToSend,
        }
      );

      const data = await response.json();
      if (data.status === "success" || data.success) {
        alert("Category created successfully!");
        setShowModal(false);
        setFormData({ name: "", sort_description: "", image: null });
        fetchCategoryProducts();
      } else {
        alert(data.message || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  // Load categories on mount
  useEffect(() => {
    fetchCategoryProducts();
  }, []);

  return (
    <>
      {/* Add Category Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <FaPlus />
          Add Category
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading...</p>
        </div>
      )}

      {/* Category Sections */}
      <div className="space-y-8">
        {categoryProducts.map((categoryGroup) => (
          <div
            key={categoryGroup._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="p-3 bg-blue-50 rounded-lg">
                <MdCategory className="text-2xl text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {categoryGroup.categoryName}
                </h2>
                <p className="text-sm text-gray-500">
                  {categoryGroup.products?.length || 0} products
                </p>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryGroup.products?.map((product) => (
                <div
                  key={product._id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xl font-bold text-blue-600">
                        ${product.price}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          product.status === "available"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Features:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {product.product_details
                        ?.slice(0, 3)
                        .map((detail, idx) => (
                          <li key={idx} className="truncate">
                            • {detail}
                          </li>
                        ))}
                      {product.product_details?.length > 3 && (
                        <li className="text-blue-600 font-medium">
                          +{product.product_details.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Subscription Info */}
                  {product.subscription_periods?.length > 0 && (
                    <div className="mb-3 p-2 bg-white rounded border border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 mb-1">
                        Subscription Offers:
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {product.subscription_periods.map((period) => (
                          <span
                            key={period._id}
                            className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded font-medium"
                          >
                            {period.duration}: {period.amount}
                            {period.discount_type === "percent" ? "%" : "$"} off
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-white text-gray-700 rounded border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium">
                      Edit
                    </button>
                    <button className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded border border-red-200 hover:bg-red-100 transition-colors text-sm font-medium">
                      Delete
                    </button>
                  </div> */}
                </div>
              ))}
            </div>

            {/* No Products in Category */}
            {(!categoryGroup.products ||
              categoryGroup.products.length === 0) && (
              <div className="text-center py-8">
                <p className="text-gray-500">No products in this category</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Categories */}
      {!loading && categoryProducts.length === 0 && (
        <div className="text-center py-12">
          <MdCategory className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No categories found</p>
          <p className="text-sm text-gray-500">
            Click &quot;Add Category&quot; to create your first one
          </p>
        </div>
      )}

      {/* Add Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Add New Category
            </h2>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.sort_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sort_description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category description"
                  rows="3"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({
                      name: "",
                      sort_description: "",
                      image: null,
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
