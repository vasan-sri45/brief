"use client";

import { useMemo, useState } from "react";
import { Pencil, Search, UsersRound, X } from "lucide-react";
import {
  useGetEmployees,
  useUpdateEmployee,
} from "../../hooks/useEmployeeAuthMutations";

const employeeFields = [
  { name: "name", label: "Full Name" },
  { name: "email", label: "Email" },
  { name: "mobile", label: "Phone Number" },
  { name: "department", label: "Department" },
  { name: "designation", label: "Designation" },
  { name: "dateOfJoining", label: "Date of Joining", type: "date" },
  { name: "panNumber", label: "PAN Number" },
  { name: "bankAccountNumber", label: "Bank Account Number" },
  { name: "ifscCode", label: "IFSC Code" },
];

const statutoryFields = [
  { name: "hasExistingUan", label: "Has Existing UAN", type: "selectBoolean" },
  { name: "uanNumber", label: "UAN Number" },
  { name: "hasExistingEsi", label: "Has Existing ESI", type: "selectBoolean" },
  { name: "esiNumber", label: "ESI Number" },
];

const salaryFields = [
  { name: "salaryPerMonth", label: "Gross Salary", type: "number" },
  { name: "basicSalary", label: "Basic Salary", type: "number" },
  { name: "hra", label: "HRA", type: "number" },
  { name: "conveyanceAllowance", label: "Conveyance", type: "number" },
  { name: "medicalAllowance", label: "Medical", type: "number" },
  { name: "specialAllowance", label: "Special Allowance", type: "number" },
  { name: "annualCtc", label: "Annual CTC", type: "number" },
];

const toInputDate = (value) => {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
};

export default function AdminEmployeesContent() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [uanChangeReason, setUanChangeReason] = useState("");
  const [esiChangeReason, setEsiChangeReason] = useState("");
  const [editError, setEditError] = useState("");

  const filters = useMemo(
    () => ({
      search: search.trim() || undefined,
      status: status === "All" ? undefined : status,
      limit: 100,
      sort: "desc",
    }),
    [search, status]
  );

  const { data, isLoading, isError, error, isFetching } =
    useGetEmployees(filters);
  const updateEmployee = useUpdateEmployee();

  const employees = data?.users || [];

  const openEdit = (employee) => {
    setEditingEmployee(employee);
    setEditError("");
    setUanChangeReason("");
    setEsiChangeReason("");
    setEditForm({
      ...employee,
      dateOfJoining: toInputDate(employee.dateOfJoining),
    });
  };

  const handleEditChange = (event) => {
    setEditForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleEditSave = () => {
    setEditError("");
    const oldUan = editingEmployee?.uanNumber || "";
    const newUan = editForm.uanNumber || "";
    const uanChanged = oldUan !== newUan;

    if (newUan && !/^\d{12}$/.test(newUan)) {
      setEditError("UAN number must be a 12-digit numeric value");
      return;
    }

    if (uanChanged && !uanChangeReason.trim()) {
      setEditError("Reason for UAN change is required");
      return;
    }

    const oldEsi = editingEmployee?.esiNumber || "";
    const newEsi = editForm.esiNumber || "";
    const esiChanged = oldEsi !== newEsi;

    if (newEsi && !/^\d+$/.test(newEsi)) {
      setEditError("ESI number must contain only digits");
      return;
    }

    if (esiChanged && !esiChangeReason.trim()) {
      setEditError("Reason for ESI change is required");
      return;
    }

    updateEmployee.mutate(
      {
        id: editingEmployee._id || editingEmployee.id,
        payload: {
          ...editForm,
          ...(uanChanged ? { uanChangeReason: uanChangeReason.trim() } : {}),
          ...(esiChanged ? { esiChangeReason: esiChangeReason.trim() } : {}),
        },
      },
      {
        onSuccess: () => {
          setEditingEmployee(null);
          setEditForm({});
        },
        onError: (err) => {
          setEditError(
            err?.response?.data?.message || "Could not update employee"
          );
        },
      }
    );
  };

  const renderField = (field) => (
    <label key={field.name} className="block">
      <span className="mb-2 block text-sm font-bold text-gray-600">
        {field.label}
      </span>
      {field.type === "selectBoolean" ? (
        <select
          name={field.name}
          value={String(Boolean(editForm[field.name]))}
          onChange={(event) =>
            setEditForm((prev) => ({
              ...prev,
              [field.name]: event.target.value === "true",
            }))
          }
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      ) : (
        <input
          type={field.type || "text"}
          name={field.name}
          value={editForm[field.name] ?? ""}
          maxLength={field.name === "uanNumber" ? 12 : undefined}
          onChange={handleEditChange}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
        />
      )}
    </label>
  );

  return (
    <section className="p-4 md:p-5">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50">
            <UsersRound className="text-blue-600" size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-custom-blue">
              Employees
            </h1>
            <p className="text-sm font-medium text-gray-500">
              Search, filter, and review employee records.
            </p>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[1fr_170px] lg:w-[520px]">
          <label className="relative block">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, phone, code"
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center font-semibold text-gray-500">
          Loading employees...
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center font-semibold text-red-600">
          {String(error?.response?.data?.message || error?.message || "Could not load employees")}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
          <div className="mb-4 flex items-center justify-between px-2 text-sm font-semibold text-gray-500">
            <span>{employees.length} employees found</span>
            {isFetching && <span>Refreshing...</span>}
          </div>

          <table className="w-full min-w-[1180px]">
            <thead>
              <tr className="bg-blue-50 text-left text-sm text-gray-600">
                <th className="rounded-l-xl p-4">Employee</th>
                <th className="p-4">Code</th>
                <th className="p-4">Department</th>
                <th className="p-4">Designation</th>
                <th className="p-4">Type</th>
                <th className="p-4">UAN</th>
                <th className="p-4">ESI</th>
                <th className="p-4">Salary</th>
                <th className="p-4">Email</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Status</th>
                <th className="rounded-r-xl p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <tr
                    key={employee._id || employee.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="p-4 font-bold text-gray-800">
                      {employee.name || "Employee"}
                    </td>
                    <td className="p-4 font-semibold text-gray-600">
                      {employee.employee_id || "--"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {employee.department || "--"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {employee.designation || "--"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          employee.employmentType === "on-role"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {employee.employmentType === "on-role"
                          ? "On-role"
                          : "Off-role"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      {employee.uanNumber || "--"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {employee.esiNumber || "--"}
                    </td>
                    <td className="p-4 font-semibold text-blue-600">
                      Rs. {employee.salaryPerMonth || 0}
                    </td>
                    <td className="p-4 text-gray-600">
                      {employee.email || "--"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {employee.mobile || "--"}
                    </td>
                    <td className="p-4 text-gray-600">
                        {employee.createdAt
                        ? new Date(
                            employee.dateOfJoining || employee.createdAt
                          ).toLocaleDateString()
                        : "--"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          employee.status === "Inactive"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {employee.status || "Active"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => openEdit(employee)}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="12"
                    className="p-8 text-center font-semibold text-gray-500"
                  >
                    No employees match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-2xl font-bold text-custom-blue">
                  Edit Employee
                </h2>
                <p className="text-sm font-semibold text-gray-500">
                  Update statutory, bank, role, and salary details.
                </p>
              </div>
              <button
                onClick={() => setEditingEmployee(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[72vh] overflow-y-auto p-6">
              <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                <h3 className="text-lg font-bold text-custom-blue">
                  Employee Details
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {employeeFields.map(renderField)}

                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-gray-600">
                      Status
                    </span>
                    <select
                      name="status"
                      value={editForm.status || "Active"}
                      onChange={handleEditChange}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-custom-blue">
                      Admin Statutory Update
                    </h3>
                    <p className="text-sm font-semibold text-gray-500">
                      Admin can add or correct UAN and ESI after employee creation.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {statutoryFields.map(renderField)}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-indigo-100 bg-white p-4">
                <h3 className="text-lg font-bold text-custom-blue">
                  Employment Type
                </h3>
                <p className="mt-1 text-sm font-semibold text-gray-500">
                  Admin can convert an employee from Off-role to On-role here.
                </p>

                <label className="mt-4 block">
                  <span className="mb-2 block text-sm font-bold text-gray-600">
                    Employee Type
                  </span>
                  <select
                    name="employmentType"
                    value={editForm.employmentType || "off-role"}
                    onChange={handleEditChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="off-role">Off-role Employee</option>
                    <option value="on-role">On-role Employee</option>
                  </select>
                </label>

                {editForm.employmentType === "on-role" && (
                  <p className="mt-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
                    On-role payroll will calculate PF, ESI, Professional Tax,
                    and TDS where applicable.
                  </p>
                )}
              </div>

              <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                <h3 className="text-lg font-bold text-custom-blue">
                  Salary Structure
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {salaryFields.map(renderField)}
                </div>
              </div>

              {(editingEmployee?.uanNumber || "") !==
                (editForm.uanNumber || "") && (
                <label className="mt-5 block">
                  <span className="mb-2 block text-sm font-bold text-gray-600">
                    Reason for UAN Change
                  </span>
                  <textarea
                    value={uanChangeReason}
                    onChange={(event) => setUanChangeReason(event.target.value)}
                    rows={3}
                    placeholder="Example: UAN correction as per EPFO records"
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </label>
              )}

              {(editingEmployee?.esiNumber || "") !==
                (editForm.esiNumber || "") && (
                <label className="mt-5 block">
                  <span className="mb-2 block text-sm font-bold text-gray-600">
                    Reason for ESI Change
                  </span>
                  <textarea
                    value={esiChangeReason}
                    onChange={(event) => setEsiChangeReason(event.target.value)}
                    rows={3}
                    placeholder="Example: ESI number added after ESIC registration"
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </label>
              )}

              {editError && (
                <p className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                  {editError}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-5">
              <button
                onClick={() => setEditingEmployee(null)}
                className="rounded-xl border border-gray-200 px-5 py-3 font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={updateEmployee.isPending}
                className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg disabled:opacity-60"
              >
                {updateEmployee.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
