"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Plus, Search } from "lucide-react";
import ServiceForm from "../../components/admin/ServiceForm";
import { useGetServiceConfigById, useGetServices } from "../../hooks/useService";

export default function ServiceManagerPage() {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const { data, isLoading, isError, isFetching } = useGetServices({
    page,
    limit,
    search,
  });
  const editingId = editing?._id || "";
  const {
    data: editingService,
    isLoading: isEditingServiceLoading,
    isError: isEditingServiceError,
  } = useGetServiceConfigById(showForm && editingId ? editingId : "");
  const services = data?.items || [];
  const pagination = data?.pagination || data?.meta || {};
  const totalPages = pagination.pages || pagination.totalPages || 1;
  const totalItems = pagination.total || pagination.totalRecords || services.length;

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  if (showForm) {
    if (editingId && isEditingServiceLoading) {
      return (
        <section className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
          <div className="rounded-3xl border border-blue-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="text-sm font-bold text-blue-700">Loading service details...</p>
          </div>
        </section>
      );
    }

    if (editingId && isEditingServiceError) {
      return (
        <section className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-bold text-red-600">Could not load service details.</p>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setShowForm(false);
              }}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white"
            >
              Back to services
            </button>
          </div>
        </section>
      );
    }

    return (
      <ServiceForm
        initialService={editingId ? editingService || editing : null}
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
              onChange={handleSearch}
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-56 animate-pulse rounded-3xl border border-blue-50 bg-white shadow-sm"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center font-semibold text-red-600">
          Could not load services.
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-blue-50 bg-white px-4 py-3 text-sm font-semibold text-gray-500 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {services.length} of {totalItems} services
              {isFetching ? " - refreshing..." : ""}
            </span>
            <select
              value={limit}
              onChange={(event) => {
                setLimit(Number(event.target.value));
                setPage(1);
              }}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 font-bold text-gray-700 outline-none"
            >
              {[12, 24, 48].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>

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
                  {service.heading}
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

          {totalPages > 1 && (
            <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-blue-50 bg-white p-4 shadow-sm sm:flex-row">
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={page <= 1 || isFetching}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-50"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="text-sm font-bold text-gray-600">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                disabled={page >= totalPages || isFetching}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
