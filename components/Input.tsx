import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label?: string;
  type?: string;
  isSelect?: boolean;
  options?: { value: string; label: string }[];
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  type = "text", 
  isSelect = false, 
  options = [], 
  className = "", 
  ...props 
}) => {
  const InputElement = isSelect ? "select" : "input";
  
  return (
    <div className="input-group" style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      {label && <label style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>{label}</label>}
      {isSelect ? (
        <select className={className} {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input type={type} className={className} {...(props as React.InputHTMLAttributes<HTMLInputElement>)} />
      )}
    </div>
  );
};
