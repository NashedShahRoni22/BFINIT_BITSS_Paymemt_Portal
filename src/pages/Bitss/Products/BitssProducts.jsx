import { useState } from "react";
import { FaBox } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import Categories from "../../../components/categories/Categories";
import Products from "../../../components/products/Products";

export default function BitssProducts() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">
          Product & Category Management
        </h1>
        <p className="text-neutral-600">
          Manage products, categories, and inventory
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
            activeTab === "products"
              ? "border-primary text-primary"
              : "border-transparent text-neutral-600 hover:text-neutral-800"
          }`}
        >
          <FaBox />
          Products
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
            activeTab === "categories"
              ? "border-primary text-primary"
              : "border-transparent text-neutral-600 hover:text-neutral-800"
          }`}
        >
          <MdCategory />
          Categories
        </button>
      </div>

      {activeTab === "products" ? <Products /> : <Categories />}
    </div>
  );
}
