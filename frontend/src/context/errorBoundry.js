import React, { useState } from 'react';

function ErrorBoundary(props) {
  const [error, setError] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  if (errorInfo) {
    // You can render any custom fallback UI
    return (
      <div>
        <h2>Something went wrong.</h2>
        <details style={{ whiteSpace: 'pre-wrap' }}>
          {error && error.toString()}
          <br />
          {errorInfo.componentStack}
        </details>
      </div>
    );
  }

  // If there's no error, render children as usual
  return props.children;
}

export default ErrorBoundary;
