"use client";

interface Prop {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  className?: string;
  style?: React.CSSProperties;
}

export default function CustomButton({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
  style,
}: Prop) {
  const baseClasses =
    "px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-200 cursor-pointer border";

  const variantClasses = {
    primary: disabled
      ? "bg-gray-400 border-gray-400 text-gray-600 cursor-not-allowed"
      : "bg-blue-500 border-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 shadow-md hover:shadow-lg",
    secondary: disabled
      ? "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-white border-gray-300 text-slate-700 hover:bg-gray-50 active:bg-gray-100 shadow-md hover:shadow-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}>
      {children}
    </button>
  );
}
