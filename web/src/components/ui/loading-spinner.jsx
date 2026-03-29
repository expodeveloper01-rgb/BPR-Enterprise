/**
 * LoadingSpinner Component
 * A centered loading spinner animation
 */
export const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-2",
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
