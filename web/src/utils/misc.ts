// Will return whether the current environment is in a regular browser
// and not CEF
export const isEnvBrowser = (): boolean => !("invokeNative" in window);

// Basic no operation function
export const noop = () => {};
