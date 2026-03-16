import { useState } from "react";
import { FaPlus, FaEdit } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { useCategories } from "../../hooks/useCategories";

const BASE_URL = import.meta.env.VITE_NEW_BASE_URL;

const createCategory = async ({ formData, token }) => {
  const formDataToSend = new FormData();
  formDataToSend.append("name", formData.name);
  formDataToSend.append("sort_description", formData.sort_description);
  formDataToSend.append("status", "active");
  if (formData.image) formDataToSend.append("image", formData.image);

  const response = await fetch(`${BASE_URL}/all-categories`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formDataToSend,
  });
  const data = await response.json();
  if (!data.status && !data.success)
    throw new Error(data.message || "Failed to create category");
  return data;
};

const updateCategory = async ({ id, formData, token }) => {
  const formDataToSend = new FormData();
  formDataToSend.append("name", formData.name);
  formDataToSend.append("sort_description", formData.sort_description);
  formDataToSend.append("status", formData.status);
  if (formData.image) formDataToSend.append("image", formData.image);

  const response = await fetch(
    `${BASE_URL}/products/product/category/update/${id}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formDataToSend,
    },
  );
  const data = await response.json();
  if (!data.status && !data.success)
    throw new Error(data.message || "Failed to update category");
  return data;
};

export default function Categories() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

  // ─── GET categories ───────────────────────────────────────────────────────
  const { data: categories = [], isLoading: loading } = useCategories();

  // ─── CREATE mutation ──────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (fd) => createCategory({ formData: fd, token: user }),
    onSuccess: () => {
      alert("Category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setShowModal(false);
      setFormData({ name: "", sort_description: "", image: null });
    },
    onError: (err) => alert(err.message || "Failed to create category"),
  });

  // ─── UPDATE mutation ──────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: (fd) =>
      updateCategory({ id: selectedCategory.id, formData: fd, token: user }),
    onSuccess: () => {
      alert("Category updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setShowUpdateModal(false);
      setSelectedCategory(null);
      setUpdateFormData({
        name: "",
        sort_description: "",
        status: "active",
        image: null,
      });
    },
    onError: (err) => alert(err.message || "Failed to update category"),
  });

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleCreateCategory = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    if (!selectedCategory) return;
    updateMutation.mutate(updateFormData);
  };

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, image: file });
  };

  const handleUpdateFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setUpdateFormData({ ...updateFormData, image: file });
  };

  // ─── Render ───────────────────────────────────────────────────────────────
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
              key={cat.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition p-4 flex flex-col"
            >
              {/* Icon / placeholder — API has icon field (null for now) */}
              {cat.icon ? (
                <img
                  src={cat.icon}
                  alt={cat.name}
                  className="h-40 w-full object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="h-40 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400 mb-4">
                  <MdCategory className="text-4xl text-gray-300" />
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
                <span>
                  <span
                    className={`font-medium ${cat.is_default ? "text-blue-600" : "text-gray-400"}`}
                  >
                    {cat.is_default ? "Default" : "Custom"}
                  </span>
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => openUpdateModal(cat)}
                    className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                  >
                    <FaEdit />
                  </button>
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
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
                    disabled={createMutation.isPending}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                  >
                    {createMutation.isPending ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Update Category Modal */}
      {showUpdateModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
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
                      setUpdateFormData({
                        ...updateFormData,
                        name: e.target.value,
                      })
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
                      setUpdateFormData({
                        ...updateFormData,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Current icon preview */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Image
                  </label>
                  {selectedCategory.icon ? (
                    <img
                      src={selectedCategory.icon}
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
                    disabled={updateMutation.isPending}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                  >
                    {updateMutation.isPending ? "Updating..." : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
