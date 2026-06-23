import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '80px 20px', gap: '16px',
          textAlign: 'center', color: 'var(--text-secondary)'
        }}>
          <FontAwesomeIcon icon="triangle-exclamation" size="3x" style={{ color: 'var(--danger)' }} />
          <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
            Something went wrong
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 400 }}>
            {this.state.error?.message || 'An unexpected error occurred while loading this page.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '10px 24px', background: 'var(--accent-gradient)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, marginTop: 8
            }}
          >
            <FontAwesomeIcon icon="rotate" style={{ marginRight: 6 }} />
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
