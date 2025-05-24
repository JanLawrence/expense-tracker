"use client";

import React from "react";

export default function ExpensesPage() {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Expenses</h2>
        <button className="bg-primary hover:bg-primary-800 text-white px-4 py-2 rounded-md transition-colors">
          Add New Expense
        </button>
      </div>
    </>
  );
}