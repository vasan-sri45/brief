// "use client";

// import { useState, useEffect } from "react";
// import { X } from "lucide-react";

// const PAYMENT_MODES = [
//   "Online",
//   "Cash",
//   "UPI",
//   "Card",
//   "Bank Transfer",
// ];

// const PAYMENT_STATUS = ["created", "paid", "failed", "Pending"];

// const SERVICE_STATUS = [
//   "Pending",
//   "In Progress",
//   "Completed",
//   "Cancelled",
// ];

// export default function TicketDetailsModal({
//   open,
//   onClose,
//   service,
//   employees = [],
//   onUpdate,
//   userRole
// }) {
//   const [editMode, setEditMode] = useState(false);
//   const [form, setForm] = useState({});

//   useEffect(() => {
//     if (service) {
//       setForm(service);
//     }
//   }, [service]);

//   if (!open || !service) return null;

//   const handleChange = (key, value) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSave = () => {
//     onUpdate?.({
//       id: service._id,
//       payload: {
//         assignedTo: form.assignedTo || null,
//         paymentStatus: form.paymentStatus,
//         serviceStatus: form.serviceStatus,
//         totalPayment: Number(form.totalPayment),
//         paymentMode: form.paymentMode,
//       },
//     });

//     setEditMode(false);
//   };

//   console.log(service)
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div
//         className="absolute inset-0 bg-black/40"
//         onClick={onClose}
//       />

//       <div className="relative bg-white w-full max-w-xl rounded-2xl p-6 shadow-xl z-10">

//         {/* HEADER */}
//         <div className="flex justify-between mb-6">
//           <h2 className="text-xl font-semibold text-blue-600">
//             Ticket Details
//           </h2>

//           <div className="flex gap-3">
//             {!editMode && (
//               <button
//                 onClick={() => setEditMode(true)}
//                 className="px-4 py-1 border rounded"
//               >
//                 Edit
//               </button>
//             )}

//             <button onClick={onClose}>
//               <X />
//             </button>
//           </div>
//         </div>

//         {/* DETAILS */}
//         <div className="grid grid-cols-2 gap-4 text-sm">

//           <Detail label="Service No" value={service.serviceNo} />
//           <Detail label="Client Name" value={service.clientName} />
//           <Detail label="Mobile" value={service.mobile} />
//           <Detail label="Email" value={service.email} />
//           <Detail label="Service Title" value={service.serviceTitle} />

//           {/* {userRole === "employee" && 
//             <Detail label="Employee" value={s} />} */}

//           {/* FIXED SERVICE VALUE */}
//           <Detail
//             label="Service"
//             value={
//               typeof service.service === "object"
//                 ? service.service?.heading ||
//                   service.service?.title
//                 : service.service
//             }
//           />

//           {/* AMOUNT */}
//           {editMode ? (
//             <InputField
//               label="Amount"
//               type="number"
//               value={form.totalPayment || ""}
//               onChange={(e) =>
//                 handleChange("totalPayment", e.target.value)
//               }
//             />
//           ) : (
//             <Detail
//               label="Amount"
//               value={`₹ ${service.totalPayment}`}
//             />
//           )}

//           {/* PAYMENT MODE */}
//           {editMode ? (
//             <SelectField
//               label="Payment Mode"
//               value={form.paymentMode || ""}
//               onChange={(e) =>
//                 handleChange("paymentMode", e.target.value)
//               }
//               options={PAYMENT_MODES}
//             />
//           ) : (
//             <Detail
//               label="Payment Mode"
//               value={service.paymentMode}
//             />
//           )}

//           {/* ASSIGN */}
//           {/* {editMode ? (
//             <SelectField
//               label="Assign To"
//               value={form.assignedTo || ""}
//               onChange={(e) =>
//                 handleChange("assignedTo", e.target.value)
//               }
//               options={employees.map((emp) => ({
//                 value: emp._id,
//                 label: emp.name,
//               }))}
//               isObject
//             />
//           ) : (
//             <Detail
//               label="Assigned To"
//               value={
//                 employees.find(
//                   (e) => e._id === service.assignedTo
//                 )?.name || "Unassigned"
//               }
//             />
            
//           )} */}

//           {userRole === "admin" && (
//   editMode ? (
//     <SelectField
//       label="Assign To"
//       value={form.assignedTo || ""}
//       onChange={(e) =>
//         handleChange("assignedTo", e.target.value)
//       }
//       options={employees.map((emp) => ({
//         value: emp._id,
//         label: emp.name,
//       }))}
//       isObject
//     />
//   ) : (
//     <Detail
//       label="Assigned To"
//       value={
//         employees.find(
//           (e) => e._id === service.assignedTo
//         )?.name || "Unassigned"
//       }
//     />
//   )
// )}

//           {/* PAYMENT STATUS */}
//           {editMode ? (
//             <SelectField
//               label="Payment Status"
//               value={form.paymentStatus}
//               onChange={(e) =>
//                 handleChange("paymentStatus", e.target.value)
//               }
//               options={PAYMENT_STATUS}
//             />
//           ) : (
//             <Detail
//               label="Payment Status"
//               value={service.paymentStatus}
//             />
//           )}

//           {/* SERVICE STATUS */}
//           {editMode ? (
//             <SelectField
//               label="Service Status"
//               value={form.serviceStatus}
//               onChange={(e) =>
//                 handleChange("serviceStatus", e.target.value)
//               }
//               options={SERVICE_STATUS}
//             />
//           ) : (
//             <Detail
//               label="Service Status"
//               value={service.serviceStatus}
//             />
//           )}

//           <Detail
//             label="Date"
//             value={new Date(service.createdAt).toLocaleString()}
//           />

//         </div>

//         {/* FOOTER */}
//         <div className="mt-6 text-right">

//           {editMode ? (
//             <>
//               <button
//                 onClick={() => setEditMode(false)}
//                 className="px-4 py-2 border rounded mr-3"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleSave}
//                 className="px-6 py-2 bg-blue-600 text-white rounded"
//               >
//                 Save
//               </button>
//             </>
//           ) : (
//             <button
//               onClick={onClose}
//               className="px-6 py-2 bg-blue-600 text-white rounded"
//             >
//               Close
//             </button>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }

// /* COMPONENTS */

// const Detail = ({ label, value }) => (
//   <div>
//     <p className="text-gray-500">{label}</p>
//     <p className="font-medium">{value || "-"}</p>
//   </div>
// );

// const InputField = ({ label, value, onChange, type = "text" }) => (
//   <div>
//     <p className="text-gray-500 mb-1">{label}</p>
//     <input
//       type={type}
//       className="border px-2 py-1 w-full rounded"
//       value={value}
//       onChange={onChange}
//     />
//   </div>
// );

// const SelectField = ({
//   label,
//   value,
//   onChange,
//   options,
//   isObject = false,
// }) => (
//   <div>
//     <p className="text-gray-500 mb-1">{label}</p>

//     <select
//       className="border px-2 py-1 w-full rounded"
//       value={value || ""}
//       onChange={onChange}
//     >
//       <option value="">Select</option>

//       {isObject
//         ? options.map((opt) => (
//             <option key={opt.value} value={opt.value}>
//               {opt.label}
//             </option>
//           ))
//         : options.map((opt) => (
//             <option key={opt} value={opt}>
//               {opt}
//             </option>
//           ))}
//     </select>
//   </div>
// );


"use client";

import {
  useState,
  useEffect,
} from "react";

import {
  X,
  Pencil,
  Save,
  User,
  Mail,
  Phone,
  IndianRupee,
  CalendarDays,
  BriefcaseBusiness,
  Download,
  Printer,
  Trash2,
  ChevronDown,
} from "lucide-react";
import {
  downloadServiceInvoice,
  printServiceInvoice,
} from "../../config/generateServiceInvoice";
import { useAllServices } from "../../hooks/userServiceList";

const PAYMENT_MODES = [
  "Online",
  "Cash",
  "UPI",
  "Card",
  "Bank Transfer",
];

const PAYMENT_STATUS = [
  "Pending",
  "Paid",
  "Failed",
  "Refunded",
];

const SERVICE_STATUS = [
  "Pending",
  "In Progress",
  "Completed",
  "Cancelled",
];

export default function TicketDetailsModal({
  open,
  onClose,
  service,
  employees = [],
  onUpdate,
  onSoftDelete,
  userRole,
}) {
  const {
    data: servicesData,
  } = useAllServices();

  const [editMode, setEditMode] =
    useState(false);

  const [form, setForm] =
    useState({});

  const [
    progressMessage,
    setProgressMessage,
  ] = useState("");

  useEffect(() => {

    if (service) {
      const serviceId =
        (typeof service.serviceId === "object" ? service.serviceId?._id : service.serviceId) ||
        (typeof service.service === "object" ? service.service?._id : "") ||
        "";
      setForm({
        ...service,
        service: serviceId,
        serviceTitle:
          service.serviceTitle ||
          service.service?.title ||
          service.serviceId?.title ||
          "",
        serviceName:
          service.serviceName ||
          (typeof service.service === "object"
            ? service.service?.heading || service.service?.title
            : service.service) ||
          "",
      });
      setProgressMessage("");
    }

  }, [service]);

  if (!open || !service) return null;

  const handleChange = (
    key,
    value
  ) => {
    if (key === "serviceTitle") {
      setForm((prev) => ({
        ...prev,
        serviceTitle: value,
        service: "",
        serviceName: "",
      }));
      return;
    }

    if (key === "service") {
      const selected = servicesData?.items?.find((item) => item._id === value);
      setForm((prev) => ({
        ...prev,
        service: value,
        serviceName: selected?.heading || selected?.title || "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    const assignedToValue =
      form.assignedTo && typeof form.assignedTo === "object"
        ? form.assignedTo._id
        : form.assignedTo || null;

    onUpdate?.({
      id: service._id,

      payload: {
        assignedTo:
          assignedToValue,

        paymentStatus:
          form.paymentStatus,

        serviceStatus:
          form.serviceStatus,

        totalPayment:
          Number(
            form.totalPayment ??
            service.totalPayment ??
            service.amount ??
            0
          ),

        serviceTitle:
          form.serviceTitle,

        serviceName:
          form.serviceName,

        service:
          form.service,

        paymentMode:
          form.paymentMode,

        progressMessage:
          progressMessage.trim(),
      },
    });

    setEditMode(false);
  };

  const getStatusStyle = (
    status
  ) => {

    switch (status) {

      case "paid":
      case "Paid":
      case "Completed":
        return "bg-green-100 text-green-700";

      case "Pending":
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";

      case "failed":
      case "Failed":
      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const assignedSelectValue =
    form.assignedTo && typeof form.assignedTo === "object"
      ? form.assignedTo._id
      : form.assignedTo || "";

  const isAdmin = userRole === "admin";
  const isEmployee = userRole === "employee";
  const isPaid =
    String(service.paymentStatus || "").toLowerCase() === "paid";
  const canSoftDelete =
    service.serviceStatus === "Completed" &&
    isAdmin;
  const allServices = servicesData?.items || [];
  const uniqueServiceCategories = Array.from(
    new Map(allServices.map((item) => [item.title, item])).values()
  );
  const filteredServices = allServices.filter(
    (item) => item.title === form.serviceTitle
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

      {/* OVERLAY */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative z-10 bg-white w-full max-w-3xl rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.25)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-bold text-white">
              Ticket Details
            </h2>

            <p className="text-blue-100 text-sm mt-1">
              Manage service request information
            </p>
          </div>

          <div className="flex items-center gap-3">

            {!editMode && (
              <button
                onClick={() =>
                  setEditMode(true)
                }
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition"
              >
                <Pencil size={16} />
                Edit
              </button>
            )}

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
            >
              <X size={20} />
            </button>

          </div>
        </div>

        {/* BODY */}
        <div className="p-6 sm:p-7 max-h-[75vh] overflow-y-auto">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            <Detail
              icon={<BriefcaseBusiness size={18} />}
              label="Service No"
              value={service.serviceNo}
            />

            <Detail
              icon={<User size={18} />}
              label="Client Name"
              value={service.clientName || service.customer?.name}
            />

            <Detail
              icon={<Phone size={18} />}
              label="Mobile"
              value={service.mobile || service.customer?.mobile}
            />

            <Detail
              icon={<Mail size={18} />}
              label="Email"
              value={service.email || service.customer?.email}
            />

            {editMode ? (
              <SelectField
                label="Service Title"
                value={
                  form.serviceTitle || ""
                }
                onChange={(e) =>
                  handleChange("serviceTitle", e.target.value)
                }
                placeholder="Select Service Category"
                options={uniqueServiceCategories.map((item) => ({
                  value: item.title,
                  label: item.title,
                }))}
                isObject
              />
            ) : (
              <Detail
                icon={<BriefcaseBusiness size={18} />}
                label="Service Title"
                value={
                  service.serviceTitle ||
                  service.service?.title ||
                  service.serviceId?.title
                }
              />
            )}

            {editMode ? (
              <SelectField
                label="Service"
                value={
                  typeof form.service === "object"
                    ? form.service?._id
                    : form.service || ""
                }
                onChange={(e) =>
                  handleChange("service", e.target.value)
                }
                placeholder="Select Service"
                options={filteredServices.map((item) => ({
                  value: item._id,
                  label: item.heading || item.title,
                }))}
                isObject
              />
            ) : (
              <Detail
                icon={<BriefcaseBusiness size={18} />}
                label="Service"
                value={
                  service.serviceName ||
                  (typeof service.service ===
                  "object"
                    ? service.service?.heading ||
                      service.service?.title
                    : service.service)
                }
              />
            )}

            {/* AMOUNT */}
            {editMode ? (
              <InputField
                label="Amount"
                type="number"
                value={
                  form.totalPayment || ""
                }
                onChange={(e) =>
                  handleChange(
                    "totalPayment",
                    e.target.value
                  )
                }
              />
            ) : (
              <Detail
                icon={
                  <IndianRupee size={18} />
                }
                label="Amount"
                value={`Rs. ${Number(service.totalPayment || service.amount || 0).toLocaleString("en-IN")}`}
              />
            )}

            {/* PAYMENT MODE */}
            {editMode && isAdmin ? (
              <SelectField
                label="Payment Mode"
                value={
                  form.paymentMode || ""
                }
                onChange={(e) =>
                  handleChange(
                    "paymentMode",
                    e.target.value
                  )
                }
                options={PAYMENT_MODES}
              />
            ) : (
              <Detail
                label="Payment Mode"
                value={
                  service.paymentMode
                }
              />
            )}

            {/* ASSIGNED TO */}
            {isAdmin &&
              (editMode ? (
                <SelectField
                  label="Assign To"
                  value={
                    assignedSelectValue
                  }
                  onChange={(e) =>
                    handleChange(
                      "assignedTo",
                      e.target.value
                    )
                  }
                  options={employees.map(
                    (emp) => ({
                      value: emp._id,
                      label: emp.name,
                    })
                  )}
                  isObject
                />
              ) : (
                <Detail
                  label="Assigned To"
                  value={
                    service.assignedToName ||
                    service.assignedTo?.name ||
                    employees.find((e) => e._id === service.assignedTo)?.name ||
                    "Unassigned"
                  }
                />
              ))}

            {/* PAYMENT STATUS */}
            {editMode ? (
              <SelectField
                label="Payment Status"
                value={
                  form.paymentStatus
                }
                onChange={(e) =>
                  handleChange(
                    "paymentStatus",
                    e.target.value
                  )
                }
                options={PAYMENT_STATUS}
              />
            ) : (
              <StatusDetail
                label="Payment Status"
                value={
                  service.paymentStatus
                }
                className={getStatusStyle(
                  service.paymentStatus
                )}
              />
            )}

            {/* SERVICE STATUS */}
            {editMode ? (
              <SelectField
                label="Service Status"
                value={
                  form.serviceStatus
                }
                onChange={(e) =>
                  handleChange(
                    "serviceStatus",
                    e.target.value
                  )
                }
                options={SERVICE_STATUS}
              />
            ) : (
              <StatusDetail
                label="Service Status"
                value={
                  service.serviceStatus
                }
                className={getStatusStyle(
                  service.serviceStatus
                )}
              />
            )}

            <Detail
              icon={
                <CalendarDays size={18} />
              }
              label="Date"
              value={new Date(
                service.createdAt
              ).toLocaleString()}
            />

          </div>

          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
            <h3 className="text-lg font-bold text-custom-blue">
              Work Updates
            </h3>

            <div className="mt-4 space-y-3">
              {service.progressMessages?.length ? (
                service.progressMessages.map((item, index) => (
                  <div
                    key={`${item.createdAt}-${index}`}
                    className="rounded-xl border border-gray-100 bg-white p-4"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-bold text-gray-800">
                        {item.createdBy?.name || "Employee"}
                      </p>
                      <p className="text-xs font-semibold text-gray-400">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString()
                          : ""}
                      </p>
                    </div>
                    <p className="mt-2 whitespace-pre-line text-sm text-gray-600">
                      {item.message}
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-xl bg-white p-4 text-sm font-semibold text-gray-500">
                  No work updates yet.
                </p>
              )}
            </div>

            {editMode && (
              <div className="mt-4">
                <label className="text-sm font-semibold text-gray-600">
                  Add current work message
                </label>
                <textarea
                  value={progressMessage}
                  onChange={(event) =>
                    setProgressMessage(event.target.value)
                  }
                  rows={4}
                  placeholder="Write what is currently happening for this service..."
                  className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">

            {editMode ? (
              <>
                <button
                  onClick={() =>
                    setEditMode(false)
                  }
                  className="px-5 py-3 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </>
            ) : (
              <>
                {isPaid && (
                  <>
                    <button
                      onClick={() => downloadServiceInvoice(service)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-100 px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
                    >
                      <Download size={18} />
                      Invoice
                    </button>

                    <button
                      onClick={() => printServiceInvoice(service)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-100 px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
                    >
                      <Printer size={18} />
                      Print
                    </button>
                  </>
                )}

                {canSoftDelete && (
                  <button
                    onClick={() => onSoftDelete?.(service._id)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                >
                  Close
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   DETAIL
========================================= */

const Detail = ({
  icon,
  label,
  value,
}) => (
  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">

    <div className="flex items-center gap-2 text-gray-500 mb-2">
      {icon}
      <p className="text-sm font-medium">
        {label}
      </p>
    </div>

    <p className="font-semibold text-[#0F172A] break-words">
      {value || "-"}
    </p>

  </div>
);

/* =========================================
   STATUS DETAIL
========================================= */

const StatusDetail = ({
  label,
  value,
  className,
}) => (
  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">

    <p className="text-sm text-gray-500 mb-2">
      {label}
    </p>

    <span
      className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${className}`}
    >
      {value}
    </span>

  </div>
);

/* =========================================
   INPUT
========================================= */

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
}) => (
  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">

    <p className="text-sm text-gray-500 mb-2">
      {label}
    </p>

    <input
      type={type}
      value={value}
      onChange={onChange}
      className="
        w-full
        border border-gray-200
        rounded-xl
        px-4 py-3
        outline-none
        focus:ring-2
        focus:ring-blue-200
      "
    />

  </div>
);

/* =========================================
   SELECT
========================================= */

const SelectField = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select",
  isObject = false,
}) => (
  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">

    <p className="text-sm text-gray-500 mb-2">
      {label}
    </p>

    <div className="relative">
      <select
        value={value || ""}
        onChange={onChange}
        className="
          w-full
          appearance-none
          border border-gray-200
          rounded-xl
          bg-white
          px-4 py-3 pr-10
          outline-none
          focus:ring-2
          focus:ring-blue-200
        "
      >
        <option value="">
          {placeholder}
        </option>

        {isObject
          ? options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
              >
                {opt.label}
              </option>
            ))
          : options.map((opt) => (
              <option
                key={opt}
                value={opt}
              >
                {opt}
              </option>
            ))}
      </select>

      <ChevronDown
        size={18}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>

  </div>
);
