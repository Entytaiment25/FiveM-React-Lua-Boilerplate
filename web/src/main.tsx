import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { VisibilityProvider } from "./providers/VisibilityProvider";
import "./index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<React.StrictMode>
			<VisibilityProvider>
				<App />
			</VisibilityProvider>
		</React.StrictMode>,
	);
}
