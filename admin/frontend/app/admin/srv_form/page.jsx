"use client";

import React, { useState } from "react";
import { Pencil, Plus, Search } from "lucide-react";
import ServiceForm from "../../components/admin/ServiceForm";
import { useGetServices } from "../../hooks/useService";

export default function ServiceManagerPage() {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useGetServices({ limit: 100, search });
  const services = data?.items || [];

  if (showForm) {
    return (
      <ServiceForm
        initialService={editing}
        onDone={() => {
          setEditing(null);
          setShowForm(false);
        }}
      />
    );
  }

  return (
    <section className="p-4 md:p-5">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-custom-blue">
            Services
          </h1>
          <p className="text-sm font-medium text-gray-500">
            Create and edit service pages. Admin access only.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search services"
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold outline-none sm:w-72"
            />
          </label>

          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg"
          >
            <Plus size={18} />
            New Service
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border bg-white p-8 text-center font-semibold text-gray-500">
          Loading services...
        </div>
      ) : isError ? (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center font-semibold text-red-600">
          Could not load services.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article
              key={service._id}
              className="rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                {service.subTitle || "Service"}
              </p>
              <h2 className="mt-2 line-clamp-2 text-lg font-bold text-gray-900">
                {service.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-gray-500">
                {service.description || service.heading || "No description added."}
              </p>
              <button
                onClick={() => {
                  setEditing(service);
                  setShowForm(true);
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100"
              >
                <Pencil size={16} />
                Edit
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
