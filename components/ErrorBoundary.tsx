import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    resetKeys?: Array<string | number>;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors in child component tree and displays fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    componentDidUpdate(prevProps: Props) {
        // Reset error boundary when resetKeys change
        if (this.state.hasError && this.props.resetKeys) {
            const hasChanged = this.props.resetKeys.some(
                (key, index) => key !== prevProps.resetKeys?.[index]
            );

            if (hasChanged) {
                this.resetErrorBoundary();
            }
        }
    }

    resetErrorBoundary = () => {
        this.setState({
            hasError: false,
            error: null
        });
    };

    render() {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-[400px] flex items-center justify-center p-8 animate-fade-in">
                    <div className="glass-card p-8 md:p-12 rounded-3xl max-w-2xl w-full text-center border-2 border-red-500/20">
                        {/* Error Icon */}
                        <div className="mb-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-20 w-20 mx-auto text-red-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>

                        {/* Error Message */}
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 font-sora">
                            Algo correu mal
                        </h2>
                        <p className="text-slate-300 mb-2">
                            Ocorreu um erro inesperado nesta secção da aplicação.
                        </p>
                        <p className="text-slate-400 text-sm mb-6">
                            Não se preocupe, os seus dados estão seguros. Tente atualizar a página.
                        </p>

                        {/* Error Details (Dev Mode) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="text-left mb-6 glass-card p-4 rounded-xl">
                                <summary className="cursor-pointer text-sm font-semibold text-red-400 mb-2">
                                    Detalhes técnicos (apenas em desenvolvimento)
                                </summary>
                                <pre className="text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap">
                                    {this.state.error.toString()}
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.resetErrorBoundary}
                                className="btn-primary text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                Tentar Novamente
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="btn-secondary text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                Recarregar Página
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
