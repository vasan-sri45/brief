
const FloatingInput = ({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}) => {
  return (
    <div className={`w-full shadow-[0_6px_12px_rgba(0,0,0,0.18)] bg-white rounded-md ${className}`}>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          h-14
          px-5
          text-[16px]
          text-gray-700
          placeholder:text-[#7B94C8]
          bg-transparent
          outline-none
        "
      />
    </div>
  );
};

export default FloatingInput;
