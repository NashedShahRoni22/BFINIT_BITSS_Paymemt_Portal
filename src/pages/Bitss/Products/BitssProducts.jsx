import { useState } from "react";
import { Package, LayoutGrid, Globe, Landmark } from "lucide-react";
import Categories from "../../../components/categories/Categories";
import Products from "../../../components/products/Products";
import Countries from "../../../components/countries/Countries";
import BankInformation from "../BankInformation/BankInformation";

const TABS = [
  {
    id: "products",
    label: "Products",
    icon: <Package size={16} />,
    component: <Products />,
  },
  {
    id: "categories",
    label: "Categories",
    icon: <LayoutGrid size={16} />,
    component: <Categories />,
  },
  {
    id: "countries",
    label: "Countries",
    icon: <Globe size={16} />,
    component: <Countries />,
  },
  {
    id: "bank",
    label: "Bank Information",
    icon: <Landmark size={16} />,
    component: <BankInformation />,
  },
];

export default function BitssProducts() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const activeComponent = TABS.find((tab) => tab.id === activeTab)?.component;

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
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === id
                ? "border-primary text-primary"
                : "border-transparent text-neutral-600 hover:cursor-pointer hover:text-neutral-800"
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {activeComponent}
    </div>
  );
}
