import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const BASE_URL = import.meta.env.VITE_Base_Url;

export default function UpdateProductModal({ product, onClose, onUpdate, categories }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    status: "available",
    category: "",
    product_details: [""],
    subscription_periods: [],
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        status: product.status,
        category: product.category,
        product_details: product.product_details || [""],
        subscription_periods: product.subscription_periods || [],
      });
    }
  }, [product]);

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

  const handleUpdateProduct = async () => {
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
      const response = await fetch(`${BASE_URL}/products/product/update/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      if (data.success) {
        alert("Product updated successfully!");
        onUpdate();
        onClose();
      } else {
        alert(data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Update Product</h2>
          <button
            onClick={onClose}
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
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Product Details / Features <span className="text-red-500">*</span>
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
                        placeholder="e.g., 1 Year"
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
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdateProduct}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}