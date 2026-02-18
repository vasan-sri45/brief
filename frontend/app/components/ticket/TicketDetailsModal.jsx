

"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function TicketDetailsModal({
  open,
  onClose,
  service,
  employees = [],
  onUpdate,
}) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    if (service) {
      setForm(service);
    }
  }, [service]);

  if (!open || !service) return null;

  const handleSave = () => {
    onUpdate?.({
      id: service._id,
      payload: {
        assignedTo: form.assignedTo || null,
        paymentStatus: form.paymentStatus,
        serviceStatus: form.serviceStatus,
      },
    });

    setEditMode(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white w-full max-w-xl rounded-2xl p-6 shadow-xl z-10">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold text-blue-600">
            Ticket Details
          </h2>

          <div className="flex gap-3">
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-1 border rounded"
              >
                Edit
              </button>
            )}
            <button onClick={onClose}>
              <X />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <Detail label="Service No" value={service.serviceNo} />
          <Detail label="Client Name" value={service.clientName} />
          <Detail label="Mobile" value={service.mobile} />
          <Detail label="Email" value={service.email} />
          <Detail label="Service" value={service.service} />
          <Detail label="Amount" value={`₹ ${service.totalPayment}`} />
          <Detail label="Payment Mode" value={service.paymentMode} />

          {editMode ? (
            <>
              <SelectField
                label="Assign To"
                value={form.assignedTo || ""}
                onChange={(e) =>
                  setForm({ ...form, assignedTo: e.target.value })
                }
                options={employees}
              />

              <SelectField
                label="Payment Status"
                value={form.paymentStatus}
                onChange={(e) =>
                  setForm({ ...form, paymentStatus: e.target.value })
                }
                options={[
                  { _id: "created", name: "created" },
                  { _id: "paid", name: "paid" },
                  { _id: "failed", name: "failed" },
                  { _id: "Pending", name: "Pending" },
                ]}
              />

              <SelectField
                label="Service Status"
                value={form.serviceStatus}
                onChange={(e) =>
                  setForm({ ...form, serviceStatus: e.target.value })
                }
                options={[
                  { _id: "Pending", name: "Pending" },
                  { _id: "In Progress", name: "In Progress" },
                  { _id: "Completed", name: "Completed" },
                  { _id: "Cancelled", name: "Cancelled" },
                ]}
              />
            </>
          ) : (
            <>
              <Detail
                label="Assigned To"
                value={
                  employees.find(
                    (e) => e._id === service.assignedTo
                  )?.name || "Unassigned"
                }
              />
              <Detail
                label="Payment Status"
                value={service.paymentStatus}
              />
              <Detail
                label="Service Status"
                value={service.serviceStatus}
              />
            </>
          )}

          <Detail
            label="Date"
            value={new Date(service.createdAt).toLocaleString()}
          />
        </div>

        <div className="mt-6 text-right">
          {editMode ? (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 border rounded mr-3"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const Detail = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <p className="text-gray-500 mb-1">{label}</p>
    <select
      className="border px-2 py-1 w-full"
      value={value || ""}
      onChange={onChange}
    >
      <option value="">Unassigned</option>
      {options.map((opt) => (
        <option key={opt._id} value={opt._id}>
          {opt.name}
        </option>
      ))}
    </select>
  </div>
);
