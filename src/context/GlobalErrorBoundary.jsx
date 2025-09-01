import React from "react";

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Global Error Caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
          <h1 className="text-6xl font-extrabold text-theme mb-4">500</h1>
          <h2 className="text-2xl font-bold mb-2">Internal Server Error</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            Oops! Something went wrong on our end. Please try refreshing the
            page or come back later.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
