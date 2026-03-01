import { useEffect, useRef } from "react";

interface NuiMessageData<T = unknown> {
	action: string;
	data: T;
}

type NuiHandlerSignature<T> = (data: T) => void;
type SharedNuiHandler = (data: unknown) => void;

const nuiEventHandlers = new Map<string, Set<SharedNuiHandler>>();
let isMessageListenerAttached = false;

const onMessage = (event: MessageEvent<NuiMessageData<unknown>>) => {
	if (!event.data || typeof event.data.action !== "string") return;

	const handlers = nuiEventHandlers.get(event.data.action);
	if (!handlers || handlers.size === 0) return;

	for (const callback of handlers) {
		callback(event.data.data);
	}
};

const attachMessageListener = () => {
	if (isMessageListenerAttached) return;
	window.addEventListener("message", onMessage);
	isMessageListenerAttached = true;
};

const detachMessageListenerIfUnused = () => {
	if (!isMessageListenerAttached || nuiEventHandlers.size > 0) return;
	window.removeEventListener("message", onMessage);
	isMessageListenerAttached = false;
};

/**
 * A hook that manage events listeners for receiving data from the client scripts
 * @param action The specific `action` that should be listened for.
 * @param handler The callback function that will handle data relayed by this hook
 *
 * @example
 * useNuiEvent<{visibility: true, wasVisible: 'something'}>('setVisible', (data) => {
 *   // whatever logic you want
 * })
 *
 **/

export const useNuiEvent = <T = unknown>(
	action: string,
	handler: (data: T) => void,
) => {
	const savedHandler = useRef<NuiHandlerSignature<T>>(handler);

	// Make sure we handle for a reactive handler
	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	useEffect(() => {
		const subscription: SharedNuiHandler = (data) => {
			savedHandler.current(data as T);
		};

		attachMessageListener();

		const handlersForAction = nuiEventHandlers.get(action) ?? new Set();
		handlersForAction.add(subscription);
		nuiEventHandlers.set(action, handlersForAction);

		return () => {
			const registeredHandlers = nuiEventHandlers.get(action);
			if (!registeredHandlers) return;

			registeredHandlers.delete(subscription);
			if (registeredHandlers.size === 0) {
				nuiEventHandlers.delete(action);
			}

			detachMessageListenerIfUnused();
		};
	}, [action]);
};
