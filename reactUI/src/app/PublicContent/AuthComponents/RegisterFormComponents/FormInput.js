import React from "react";

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  ...props
}) => {
  return (
    <>
      <label htmlFor={name} className="form-label">
        <strong>{label}</strong>
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="form-control"
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      />
    </>
  );
};

export default FormInput;
