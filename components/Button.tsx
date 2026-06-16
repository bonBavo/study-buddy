import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tab" | "logout" | "delete";
  active?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  active,
  children,
  className = "",
  ...props
}) => {
  let baseClass = "";
  
  switch (variant) {
    case "primary":
      baseClass = "primary";
      break;
    case "tab":
      baseClass = `tab-button ${active ? "active" : ""}`;
      break;
    case "logout":
      baseClass = "logout-btn";
      break;
    case "delete":
      baseClass = "delete-btn";
      break;
    default:
      baseClass = "";
  }

  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {children}
    </button>
  );
};
