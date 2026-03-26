/**
 * LoadingSpinner Component
 * A centered loading spinner animation
 */
export const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 border-2",
    md: "w-12 h-12 border-3",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-gray-300 border-t-black rounded-full animate-spin`}
      />
    </div>
  );
};

export default LoadingSpinner;
