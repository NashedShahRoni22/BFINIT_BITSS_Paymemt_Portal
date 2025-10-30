import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import useAuth from "../../hooks/useAuth";

const BASE_URL = import.meta.env.VITE_Base_Url;

export default function Categories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    sort_description: "",
    image: null,
  });
  const [updateFormData, setUpdateFormData] = useState({
    name: "",
    sort_description: "",
    status: "active",
    image: null,
  });

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/products/product/category/index`
      );
      const data = await response.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  // Handle category creation
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("sort_description", formData.sort_description);
    formDataToSend.append("status", "active");
    if (formData.image) formDataToSend.append("image", formData.image);

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
        fetchCategories();
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

  // Handle category update
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!selectedCategory) return;

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", updateFormData.name);
    formDataToSend.append("sort_description", updateFormData.sort_description);
    formDataToSend.append("status", updateFormData.status);
    if (updateFormData.image) formDataToSend.append("image", updateFormData.image);

    try {
      const response = await fetch(
        `${BASE_URL}/products/product/category/update/${selectedCategory._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user}`,
          },
          body: formDataToSend,
        }
      );

      const data = await response.json();
      if (data.status === "success" || data.success) {
        alert("Category updated successfully!");
        setShowUpdateModal(false);
        setSelectedCategory(null);
        setUpdateFormData({ name: "", sort_description: "", status: "active", image: null });
        fetchCategories();
      } else {
        alert(data.message || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  // Open update modal with category data
  const openUpdateModal = (category) => {
    setSelectedCategory(category);
    setUpdateFormData({
      name: category.name,
      sort_description: category.sort_description || "",
      status: category.status || "active",
      image: null,
    });
    setShowUpdateModal(true);
  };

  // File change handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, image: file });
  };

  const handleUpdateFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setUpdateFormData({ ...updateFormData, image: file });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-end mb-8">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <FaPlus />
          Add Category
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">Loading categories...</p>
        </div>
      )}

      {/* Categories Grid */}
      {!loading && categories.length > 0 && (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition p-4 flex flex-col"
            >
              {/* Image */}
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-40 w-full object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="h-40 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400">
                  No Image
                </div>
              )}

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  {cat.name}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {cat.sort_description || "No description provided"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center mt-4 border-t pt-3 text-sm text-gray-500">
                <span className="capitalize">
                  Status:{" "}
                  <span
                    className={`${
                      cat.status === "active"
                        ? "text-green-600 font-medium"
                        : "text-red-500"
                    }`}
                  >
                    {cat.status}
                  </span>
                </span>
                <div className="flex gap-3">
                  <button 
                    onClick={() => openUpdateModal(cat)}
                    className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                  >
                    <FaEdit />
                  </button>
                  {/* <button className="text-red-600 hover:text-red-800 transition-colors">
                    <FaTrash />
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && categories.length === 0 && (
        <div className="text-center py-20">
          <MdCategory className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            No categories found
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Click "Add Category" to create your first one.
          </p>
        </div>
      )}

      {/* Add Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Add New Category
            </h2>
            <form onSubmit={handleCreateCategory}>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-3 file:border file:border-gray-300 file:rounded-lg file:bg-gray-50 file:text-gray-600 hover:file:bg-gray-100 cursor-pointer"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Category Modal */}
      {showUpdateModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Update Category
            </h2>
            <form onSubmit={handleUpdateCategory}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={updateFormData.name}
                  onChange={(e) =>
                    setUpdateFormData({ ...updateFormData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter category name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={updateFormData.sort_description}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      sort_description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter category description"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={updateFormData.status}
                  onChange={(e) =>
                    setUpdateFormData({ ...updateFormData, status: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Image
                </label>
                {selectedCategory.image ? (
                  <img
                    src={selectedCategory.image}
                    alt={selectedCategory.name}
                    className="h-32 w-full object-cover rounded-lg mb-2"
                  />
                ) : (
                  <div className="h-32 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400 mb-2">
                    No Image
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpdateFileChange}
                  className="w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-3 file:border file:border-gray-300 file:rounded-lg file:bg-gray-50 file:text-gray-600 hover:file:bg-gray-100 cursor-pointer"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedCategory(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}