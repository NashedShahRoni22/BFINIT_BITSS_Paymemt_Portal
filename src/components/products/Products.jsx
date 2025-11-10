import { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import AddProductModal from "./AddProductModal";
import UpdateProductModal from "./UpdateProductModal";

const BASE_URL = import.meta.env.VITE_Base_Url;

export default function Products() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/products/product/all`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/products/product/category/index`,
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Load products and categories on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Filter products based on search
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-700";
      case "unavailable":
        return "bg-red-100 text-red-700";
      case "low stock":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowUpdateModal(true);
  };

  return (
    <>
      {/* Search and Add Product */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <FaPlus />
            Add Product
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading products...</p>
        </div>
      )}

      {/* Products Table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Features
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Subscriptions
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      {searchTerm
                        ? "No products found matching your search"
                        : "No products available"}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {product._id.slice(-8)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                        €{(product.price * 12).toFixed(2)} <span className="text-xs">/ year</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStockColor(
                            product.status
                          )}`}
                        >
                          {formatStatus(product.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {product.product_details &&
                        product.product_details.length > 0 ? (
                          <div className="text-xs text-gray-600">
                            <div className="truncate max-w-xs">
                              {product.product_details[0]}
                            </div>
                            {product.product_details.length > 1 && (
                              <div className="text-blue-600 font-medium mt-1">
                                +{product.product_details.length - 1} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            No features
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {product.subscription_periods &&
                        product.subscription_periods.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {product.subscription_periods
                              .slice(0, 2)
                              .map((sub) => (
                                <span
                                  key={sub._id}
                                  className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded"
                                >
                                  {sub.duration / 12} yr
                                </span>
                              ))}
                            {product.subscription_periods.length > 2 && (
                              <span className="text-xs text-blue-600">
                                +{product.subscription_periods.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit product"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Count */}
          {filteredProducts.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={fetchProducts}
          categories={categories}
        />
      )}

      {/* Update Product Modal */}
      {showUpdateModal && selectedProduct && (
        <UpdateProductModal
          product={selectedProduct}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedProduct(null);
          }}
          onUpdate={fetchProducts}
          categories={categories}
        />
      )}
    </>
  );
}