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
      ? "bg-gray-400  text-gray-600 cursor-not-allowed"
      : "text-white  shadow-md hover:shadow-lg",
    secondary: disabled
      ? "bg-gray-200  text-gray-500 cursor-not-allowed"
      : "bg-white  text-slate-700 hover:bg-gray-50 active:bg-gray-100 shadow-md hover:shadow-lg",
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
