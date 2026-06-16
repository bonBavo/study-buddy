import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "auth";
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  className = "", 
  variant = "default",
  style
}) => {
  const baseClass = variant === "auth" ? "card auth-card" : "card";
  
  return (
    <div className={`${baseClass} ${className}`} style={style}>
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
};
