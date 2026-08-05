"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Optional fallback renderer — defaults to a branded error card. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * App-level error boundary. Catches render errors in the tree below,
 * logs them, and offers a reset instead of a blank screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[LEA Labs] uncaught error:", error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }
      return (
        <div
          role="alert"
          className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center"
        >
          <div className="text-4xl">⚠️</div>
          <h2 className="text-lg font-medium">Something went wrong</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            An unexpected error occurred while rendering this page. Your data is
            safe — try reloading.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
