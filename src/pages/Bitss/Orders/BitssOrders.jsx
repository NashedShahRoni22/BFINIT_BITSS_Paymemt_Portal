import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import OnlineOrders from "./tabs/OnlineOrders";
import ManualOrders from "./tabs/ManualOrders";
import VwarOrders from "./tabs/VwarOrders";

export default function BitssOrders() {
  const { user } = useAuth();
  const baseUrl = "https://backend.bitss.one/api/v1";

  const [activeTab, setActiveTab] = useState("online");

  // Tab counts for badges
  const [onlineCount, setOnlineCount] = useState(0);
  const [manualCount, setManualCount] = useState(0);
  const [vwarCount, setVwarCount] = useState(0);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const tabs = [
    { key: "online", label: "Online Orders", count: onlineCount },
    { key: "manual", label: "Manual Orders", count: manualCount },
    { key: "vwar", label: "VWAR USB Protection", count: vwarCount },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            BITSS Orders
          </h1>
          <p className="text-gray-600">Manage and track all BITSS orders</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`pb-3 px-4 font-medium text-sm transition-colors relative ${
                  activeTab === tab.key
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.key
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "online" && (
          <OnlineOrders
            user={user}
            baseUrl={baseUrl}
            onCountChange={setOnlineCount}
          />
        )}
        {activeTab === "manual" && (
          <ManualOrders
            user={user}
            baseUrl={baseUrl}
            onCountChange={setManualCount}
          />
        )}
        {activeTab === "vwar" && (
          <VwarOrders
            user={user}
            baseUrl={baseUrl}
            onCountChange={setVwarCount}
          />
        )}
      </div>
    </div>
  );
}
