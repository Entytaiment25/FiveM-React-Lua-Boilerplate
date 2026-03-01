import { isEnvBrowser } from "./misc";

const FETCH_HEADERS = {
	"Content-Type": "application/json; charset=UTF-8",
};

const isBrowserEnv = isEnvBrowser();

let cachedResourceName: string | null = null;
let cachedBaseUrl: string | null = null;

interface WindowWithResourceName extends Window {
	GetParentResourceName?: () => string;
}

const getResourceName = (): string => {
	if (cachedResourceName) return cachedResourceName;

	const resourceName = (window as WindowWithResourceName).GetParentResourceName
		? (window as WindowWithResourceName).GetParentResourceName?.()
		: "nui-frame-app";

	cachedResourceName = resourceName ?? "nui-frame-app";
	return cachedResourceName;
};

const getBaseUrl = (): string => {
	if (cachedBaseUrl) return cachedBaseUrl;
	cachedBaseUrl = `https://${getResourceName()}`;
	return cachedBaseUrl;
};

/**
 * Simple wrapper around fetch API tailored for CEF/NUI use. This abstraction
 * can be extended to include AbortController if needed or if the response isn't
 * JSON. Tailor it to your needs.
 *
 * @param eventName - The endpoint eventname to target
 * @param data - Data you wish to send in the NUI Callback
 * @param mockData - Mock data to be returned if in the browser
 *
 * @return returnData - A promise for the data sent back by the NuiCallbacks CB argument
 */

export async function fetchNui<T = unknown>(
	eventName: string,
	data?: unknown,
	mockData?: T,
): Promise<T> {
	if (isBrowserEnv && mockData !== undefined) return mockData;

	const body = data === undefined ? undefined : JSON.stringify(data);

	const resp = await fetch(`${getBaseUrl()}/${eventName}`, {
		method: "post",
		headers: FETCH_HEADERS,
		body,
	});

	const respFormatted = await resp.json();

	return respFormatted;
}
