import React from "react";
import { motion } from "framer-motion";

const OrderTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <nav className="flex gap-2 p-1.5 bg-white/70 backdrop-blur-md rounded-2xl border border-zinc-100 mb-10 overflow-x-auto no-scrollbar shadow-sm sticky top-4 z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`relative px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap z-10 ${
            activeTab === tab.id
              ? "text-white"
              : "text-zinc-400 hover:text-pink-500 hover:bg-pink-50"
          }`}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="active-tab"
              className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-pink-600 rounded-xl -z-10 shadow-lg shadow-pink-500/10"
              initial={false}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default OrderTabs;
