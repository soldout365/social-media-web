import React from "react";
import { Button } from "@/components/ui/button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-2">
              Đã xảy ra lỗi
            </h2>
            <p className="text-gray-400 mb-4">
              {this.state.error?.message || "Có lỗi không mong muốn xảy ra"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={this.handleReset}>Thử lại</Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Tải lại trang
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
