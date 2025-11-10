import { useEffect, useState } from "react";
import {
  FaTimes,
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaImage,
  FaLink,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaUndo,
  FaRedo,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import { Underline } from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";

const BASE_URL = import.meta.env.VITE_Base_Url;

// Menu Bar Component
const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target.result;
          editor.chain().focus().setImage({ src: base64 }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const addLink = () => {
    const url = window.prompt("Enter URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border-b border-gray-300 p-2 flex flex-wrap gap-1 bg-gray-50">
      {/* Text Formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("bold") ? "bg-gray-300" : ""
        }`}
        type="button"
        title="Bold"
      >
        <FaBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("italic") ? "bg-gray-300" : ""
        }`}
        type="button"
        title="Italic"
      >
        <FaItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("underline") ? "bg-gray-300" : ""
        }`}
        type="button"
        title="Underline"
      >
        <FaUnderline />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("strike") ? "bg-gray-300" : ""
        }`}
        type="button"
        title="Strikethrough"
      >
        <FaStrikethrough />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Headings */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-200 text-sm font-bold ${
          editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : ""
        }`}
        type="button"
        title="Heading 1"
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-200 text-sm font-bold ${
          editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : ""
        }`}
        type="button"
        title="Heading 2"
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-gray-200 text-sm font-bold ${
          editor.isActive("heading", { level: 3 }) ? "bg-gray-300" : ""
        }`}
        type="button"
        title="Heading 3"
      >
        H3
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("bulletList") ? "bg-gray-300" : ""
        }`}
        type="button"
        title="Bullet List"
      >
        <FaListUl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("orderedList") ? "bg-gray-300" : ""
        }`}
        type="button"
        title="Numbered List"
      >
        <FaListOl />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Alignment */}
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive({ textAlign: "left" }) ? "bg-gray-300" : ""
        }`}
        type="button"
        title="Align Left"
      >
        <FaAlignLeft />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive({ textAlign: "center" }) ? "bg-gray-300" : ""
        }`}
        type="button"
        title="Align Center"
      >
        <FaAlignCenter />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive({ textAlign: "right" }) ? "bg-gray-300" : ""
        }`}
        type="button"
        title="Align Right"
      >
        <FaAlignRight />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive({ textAlign: "justify" }) ? "bg-gray-300" : ""
        }`}
        type="button"
        title="Justify"
      >
        <FaAlignJustify />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Media */}
      <button
        onClick={addImage}
        className="p-2 rounded hover:bg-gray-200"
        type="button"
        title="Add Image"
      >
        <FaImage />
      </button>
      <button
        onClick={addLink}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("link") ? "bg-gray-300" : ""
        }`}
        type="button"
        title="Add Link"
      >
        <FaLink />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Undo/Redo */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 rounded hover:bg-gray-200"
        type="button"
        title="Undo"
      >
        <FaUndo />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 rounded hover:bg-gray-200"
        type="button"
        title="Redo"
      >
        <FaRedo />
      </button>
    </div>
  );
};

export default function AddProductModal({ onClose, onAdd, categories }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    status: "available",
    category: "",
    type: "single",
    combo_products: [],
    product_details: [""],
    subscription_periods: [],
  });

  useEffect(() => {
    if (formData.type === "combo") {
      fetchProducts();
    }
  }, [formData.type]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/products/product/all`, {
        headers: { Authorization: `Bearer ${user}` },
      });
      const data = await res.json();
      setAllProducts(data.data || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  // Initialize TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight,
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[250px] max-h-[400px] overflow-y-auto p-4",
      },
    },
  });

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

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      status: "available",
      category: "",
      product_details: [""],
      subscription_periods: [],
    });
    editor?.commands.setContent("");
  };

  // Create product
  const handleCreateProduct = async () => {
    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      !formData.product_details.length ||
      !formData.subscription_periods.length
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const filteredDetails = formData.product_details.filter(
      (x) => x.trim() !== ""
    );

    const payload = {
      name: formData.name,
      price: parseFloat(formData.price),
      status: formData.status,
      category: formData.category,
      description: editor?.getHTML() || "",
      product_details: filteredDetails,
      subscription_periods: formData.subscription_periods,
      type: formData.type,
      combo_products: formData.type === "combo" ? formData.combo_products : [],
    };

    console.log("Payload: ", payload);

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/products/product/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        alert("Product created successfully!");
        onAdd();
        onClose();
      } else alert(data.message || "Failed to create product");
    } catch (err) {
      console.error(err);
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="single">Single</option>
              <option value="combo">Combo</option>
            </select>
          </div>

          {formData.type === "combo" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Products
              </label>
              <div className="border border-gray-300 px-4 py-2 rounded-lg max-h-40 overflow-y-auto space-y-2">
                {allProducts.map((p) => (
                  <label
                    key={p._id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={formData.combo_products.includes(p._id)}
                      onChange={() => {
                        const exists = formData.combo_products.includes(p._id);
                        setFormData({
                          ...formData,
                          combo_products: exists
                            ? formData.combo_products.filter(
                                (id) => id !== p._id
                              )
                            : [...formData.combo_products, p._id],
                        });
                      }}
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>
          )}

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
                placeholder="00.00 per month"
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

          {/* Rich Text Description Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Description
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
              <MenuBar editor={editor} />
              <EditorContent editor={editor} />
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
                        Duration (Month)
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
                        placeholder="12/24/36"
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
                onClose();
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
  );
}
