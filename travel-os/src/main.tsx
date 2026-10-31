import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "@fontsource-variable/manrope";
import "./style.css";
import App from "./App";
class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  componentDidCatch(e: Error, info: ErrorInfo) {
    console.error(e, info);
  }
  render() {
    return this.state.error ? (
      <main className="wrap not-found">
        <h1>Не удалось открыть страницу</h1>
        <p>
          Локальные данные сохранены в браузере. Перезагрузите страницу или
          откройте каталог.
        </p>
        <a href="/">Открыть каталог</a>
      </main>
    ) : (
      this.props.children
    );
  }
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
