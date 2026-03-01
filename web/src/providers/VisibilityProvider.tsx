import type React from "react";
import {
	type Context,
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { fetchNui } from "../utils/fetchNui";
import { isEnvBrowser } from "../utils/misc";

const VisibilityCtx = createContext<VisibilityProviderValue | null>(null);

interface VisibilityProviderValue {
	setVisible: (visible: boolean) => void;
	visible: boolean;
}

const VISIBLE_STYLE: React.CSSProperties = {
	visibility: "visible",
	height: "100%",
};

const HIDDEN_STYLE: React.CSSProperties = {
	visibility: "hidden",
	height: "100%",
};

// This should be mounted at the top level of your application, it is currently set to
// apply a CSS visibility value. If this is non-performant, this should be customized.
export const VisibilityProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [visible, setVisible] = useState(false);
	const contextValue = useMemo(() => ({ visible, setVisible }), [visible]);

	useNuiEvent<boolean>("setVisible", setVisible);

	// Handle pressing escape/backspace
	useEffect(() => {
		// Only attach listener when we are visible
		if (!visible) return;

		const keyHandler = (e: KeyboardEvent) => {
			if (e.code === "Backspace" || e.code === "Escape") {
				if (!isEnvBrowser()) fetchNui("hideFrame");
				else setVisible(false);
			}
		};

		window.addEventListener("keydown", keyHandler);

		return () => window.removeEventListener("keydown", keyHandler);
	}, [visible]);

	return (
		<VisibilityCtx.Provider value={contextValue}>
			<div style={visible ? VISIBLE_STYLE : HIDDEN_STYLE}>
				{children}
			</div>
		</VisibilityCtx.Provider>
	);
};

export const useVisibility = () =>
	useContext<VisibilityProviderValue>(
		VisibilityCtx as Context<VisibilityProviderValue>,
	);
