"use client";

import React, { useState } from "react";
import DataTable from "@/components/UI/Datatable/Datatable";
import { Edit, Trash2, Eye } from "lucide-react";

export default function TemplatePage() {
  // Sample data for expenses
  const expensesData = [
    { id: 1, description: "Office Supplies", category: "Supplies", amount: 150.25, date: "2025-04-15", status: "Approved" },
    { id: 2, description: "Client Lunch", category: "Meals", amount: 85.50, date: "2025-04-10", status: "Pending" },
    { id: 3, description: "Software Subscription", category: "Technology", amount: 299.99, date: "2025-04-05", status: "Approved" },
    { id: 4, description: "Travel Expenses", category: "Travel", amount: 420.75, date: "2025-04-02", status: "Approved" },
    { id: 5, description: "Office Rent", category: "Facilities", amount: 1500.00, date: "2025-04-01", status: "Approved" },
    { id: 6, description: "Team Building", category: "Events", amount: 350.00, date: "2025-03-28", status: "Rejected" },
    { id: 7, description: "Training Materials", category: "Education", amount: 210.50, date: "2025-03-25", status: "Approved" },
    { id: 8, description: "Marketing Campaign", category: "Marketing", amount: 750.00, date: "2025-03-20", status: "Pending" },
    { id: 9, description: "Equipment Repair", category: "Maintenance", amount: 180.25, date: "2025-03-18", status: "Approved" },
    { id: 10, description: "Conference Tickets", category: "Professional", amount: 499.99, date: "2025-03-15", status: "Approved" },
    { id: 11, description: "Utility Bills", category: "Utilities", amount: 210.80, date: "2025-03-10", status: "Approved" },
    { id: 12, description: "Office Decorations", category: "Supplies", amount: 125.50, date: "2025-03-05", status: "Rejected" },
  ];

  // Define table columns with formatting
  const columns = [
    {
      header: "Description",
      accessor: "description",
      sortable: true,
      searchable: true
    },
    {
      header: "Category",
      accessor: "category",
      sortable: true,
      searchable: true,
      cell: (row) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">{row.category}</span>
      )
    },
    {
      header: "Amount",
      accessor: "amount",
      sortable: true,
      searchable: true,
      cell: (row) => (
        <span className="font-medium">
          ${row.amount.toFixed(2)}
        </span>
      )
    },
    {
      header: "Date",
      accessor: "date",
      sortable: true,
      searchable: true,
      cell: (row) => {
        const date = new Date(row.date);
        return new Intl.DateTimeFormat('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }).format(date);
      }
    },
    {
      header: "Status",
      accessor: "status",
      sortable: true,
      searchable: true,
      cell: (row) => {
        const statusStyles = {
          "Approved": "bg-green-100 text-green-800",
          "Pending": "bg-yellow-100 text-yellow-800",
          "Rejected": "bg-red-100 text-red-800"
        };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[row.status]}`}>
            {row.status}
          </span>
        );
      }
    }
  ];

  // Row click handler
  const handleRowClick = (row) => {
    console.log("Row clicked:", row);
    // You could implement navigation to a detail page:
    // router.push(`/expenses/${row.id}`);
  };

  // Row actions
  const renderActions = (row) => (
    <div className="flex space-x-2 justify-end">
      <button className="text-primary-600 hover:text-primary-800">
        <Eye size={18} />
      </button>
      <button className="text-green-600 hover:text-green-800">
        <Edit size={18} />
      </button>
      <button className="text-red-600 hover:text-red-800">
        <Trash2 size={18} />
      </button>
    </div>
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Expenses</h2>
        <button className="bg-primary hover:bg-primary-800 text-white px-4 py-2 rounded-md transition-colors">
          Add New Expense
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-primary">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Expenses</div>
          <div className="text-2xl font-bold text-primary-900">$4,782.53</div>
        </div>
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-yellow-400">
          <div className="text-sm font-medium text-gray-500 mb-1">Pending Approval</div>
          <div className="text-2xl font-bold text-yellow-600">$835.50</div>
        </div>
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-green-400">
          <div className="text-sm font-medium text-gray-500 mb-1">This Month</div>
          <div className="text-2xl font-bold text-green-600">$2,456.49</div>
        </div>
      </div>
      
      {/* DataTable */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-primary-900">Expense Transactions</h3>
          <p className="text-sm text-gray-500">View and manage all your expense records</p>
        </div>
        
        <DataTable
          columns={columns}
          data={expensesData}
          pagination={true}
          itemsPerPage={5}
          searchable={true}
          selectable={true}
          actions={renderActions}
          onRowClick={handleRowClick}
        />
      </div>
    </>
  );
}