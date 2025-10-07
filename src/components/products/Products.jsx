import { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const BASE_URL = import.meta.env.VITE_Base_Url;

export default function Products() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    status: "available",
    category: "",
    product_details: [""],
    subscription_periods: [],
  });

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
        `${BASE_URL}/products/product/category-wise/products`,
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

  // Handle product detail changes
  const handleProductDetailChange = (index, value) => {
    const newDetails = [...formData.product_details];
    newDetails[index] = value;
    setFormData({ ...formData, product_details: newDetails });
  };

  const addProductDetail = () => {
    setFormData({
      ...formData,
      product_details: [...formData.product_details, ""],
    });
  };

  const removeProductDetail = (index) => {
    const newDetails = formData.product_details.filter((_, i) => i !== index);
    setFormData({ ...formData, product_details: newDetails });
  };

  // Handle subscription period changes
  const handleSubscriptionChange = (index, field, value) => {
    const newSubscriptions = [...formData.subscription_periods];
    newSubscriptions[index] = {
      ...newSubscriptions[index],
      [field]: field === "amount" ? parseFloat(value) || 0 : value,
    };
    setFormData({ ...formData, subscription_periods: newSubscriptions });
  };

  const addSubscriptionPeriod = () => {
    setFormData({
      ...formData,
      subscription_periods: [
        ...formData.subscription_periods,
        { duration: "", discount_type: "percent", amount: 0, status: "active" },
      ],
    });
  };

  const removeSubscriptionPeriod = (index) => {
    const newSubscriptions = formData.subscription_periods.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, subscription_periods: newSubscriptions });
  };

  // Create product
  const handleCreateProduct = async () => {
    // Validation
    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      !formData.product_details.length > 0 ||
      !formData.subscription_periods.length > 0
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const filteredDetails = formData.product_details.filter(
      (detail) => detail.trim() !== ""
    );

    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      status: formData.status,
      category: formData.category,
      product_details: filteredDetails,
      subscription_periods: formData.subscription_periods,
    };

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/products/product/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      if (data.success) {
        alert("Product created successfully!");
        setShowAddModal(false);
        resetForm();
        fetchProducts();
      } else {
        alert(data.message || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      status: "available",
      category: "",
      product_details: [""],
      subscription_periods: [],
    });
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(
        `${BASE_URL}/products/product/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("Product deleted successfully!");
        fetchProducts();
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
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
                        ${product.price.toFixed(2)}
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
                                  {sub.duration}
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Add New Product
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Details */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Details / Features{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <button
                    onClick={addProductDetail}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.product_details.map((detail, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={detail}
                        onChange={(e) =>
                          handleProductDetailChange(index, e.target.value)
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter feature or detail"
                      />
                      {formData.product_details.length > 1 && (
                        <button
                          onClick={() => removeProductDetail(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Subscription Periods */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Subscription Periods <span className="text-red-500">*</span>
                  </label>
                  <button
                    onClick={addSubscriptionPeriod}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add Subscription
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.subscription_periods.map((sub, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={sub.duration}
                            onChange={(e) =>
                              handleSubscriptionChange(
                                index,
                                "duration",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 1 Month"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Discount Type
                          </label>
                          <select
                            value={sub.discount_type}
                            onChange={(e) =>
                              handleSubscriptionChange(
                                index,
                                "discount_type",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="percent">Percent (%)</option>
                            <option value="flat">Flat ($)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Amount
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={sub.amount}
                            onChange={(e) =>
                              handleSubscriptionChange(
                                index,
                                "amount",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={() => removeSubscriptionPeriod(index)}
                            className="w-full px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.subscription_periods.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No subscription periods added yet
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateProduct}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
