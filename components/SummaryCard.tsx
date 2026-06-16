import React from "react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  variant?: "primary" | "success" | "error";
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  value, 
  variant = "primary" 
}) => {
  let amountClass = "";
  switch (variant) {
    case "success":
      amountClass = "income-amount";
      break;
    case "error":
      amountClass = "expense-amount";
      break;
    case "primary":
      amountClass = "balance-amount";
      break;
  }

  return (
    <div className="summary-card">
      <h3>{title}</h3>
      <p className={amountClass}>{value}</p>
    </div>
  );
};
