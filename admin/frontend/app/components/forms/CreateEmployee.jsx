"use client";
import { useState } from "react";
import { useRegisterEmployee } from "../../hooks/useEmployeeAuthMutations";

const CreateEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const register = useRegisterEmployee();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrorMsg("");

    register.mutate(formData, {
      onSuccess: (data) => {
        alert("Employee created successfully");

        // reset form
        setFormData({
          name: "",
          email: "",
          mobile: "",
          password: "",
          role: "",
        });
      },
      onError: (err) => {
        setErrorMsg(
          err?.response?.data?.message || "Something went wrong"
        );
      },
    });
  };

  const canSubmit =
    formData.name &&
    formData.email &&
    formData.mobile &&
    formData.password;

  return (
    <div className="flex items-center justify-center mt-10 lg:mt-24">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-custom-blue text-white">

        <h1 className="text-3xl font-bold text-center mb-2">
          New Employee
        </h1>
        {/* <p className="text-center text-sm opacity-80 mb-6">
          Create your account
        </p> */}

        <form className="space-y-5" onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-white/50 py-2"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-white/50 py-2"
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile No"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-white/50 py-2"
          />

          {/* <input
            type="text"
            name="role"
            placeholder="Role (admin / employee)"
            value={formData.role}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-white/50 py-2"
          /> */}

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full bg-custom-blue border-b border-white/50 py-2 text-white"
          >
            <option value="">Select Role</option>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-white/50 py-2"
          />

          {/* ERROR */}
          {errorMsg && (
            <p className="text-red-300 text-sm text-center">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || register.isPending}
            className="w-full py-3 mt-4 rounded-full 
            bg-gradient-to-r from-blue-400 to-cyan-400 
            font-semibold disabled:opacity-60"
          >
            {register.isPending ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployee;