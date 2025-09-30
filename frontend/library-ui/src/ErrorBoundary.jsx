import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, fontFamily: 'monospace', maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ color: '#ef4444' }}>⚠️ Lỗi ứng dụng</h1>
          <h2>Chi tiết lỗi:</h2>
          <pre style={{ 
            background: '#f3f4f6', 
            padding: 16, 
            borderRadius: 8, 
            overflow: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          
          <details style={{ marginTop: 16 }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Stack trace</summary>
            <pre style={{ 
              background: '#f3f4f6', 
              padding: 16, 
              borderRadius: 8, 
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              marginTop: 8
            }}>
              {this.state.errorInfo.componentStack}
            </pre>
          </details>
          
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: 16,
              padding: '8px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            Tải lại trang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
