"use client";

import React from "react";

import {
  Wallet,
  BadgeIndianRupee,
  CreditCard,
  AlertCircle,
} from "lucide-react";

const PayrollStatsCards = ({
  totalSalary,
  totalDeduction,
  totalPayable,
  pendingSalary,
}) => {

  const cards = [
    {
      title: "Total Salary",
      value: `₹${totalSalary.toLocaleString()}`,
      icon: Wallet,
      bg: "bg-blue-50",
      text: "text-blue-600",
    },

    {
      title: "LOP Deduction",
      value: `₹${totalDeduction.toLocaleString()}`,
      icon: AlertCircle,
      bg: "bg-red-50",
      text: "text-red-500",
    },

    {
      title: "Net Payable",
      value: `₹${totalPayable.toLocaleString()}`,
      icon: BadgeIndianRupee,
      bg: "bg-green-50",
      text: "text-green-600",
    },

    {
      title: "Pending Salary",
      value: pendingSalary,
      icon: CreditCard,
      bg: "bg-yellow-50",
      text: "text-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

      {cards.map((item, index) => {

        const Icon = item.icon;

        return (
          <div
            key={index}
            className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgba(15,23,42,0.08)] p-6"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 font-medium">
                  {item.title}
                </p>

                <h2 className="text-2xl font-bold text-custom-blue mt-2">
                  {item.value}
                </h2>

              </div>

              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.bg}`}
              >
                <Icon
                  className={`${item.text} w-7 h-7`}
                />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PayrollStatsCards;