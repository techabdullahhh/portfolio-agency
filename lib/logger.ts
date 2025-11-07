export const logError = (message: string, error: unknown) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(message, error);
  }
};

export const logInfo = (message: string, payload?: unknown) => {
  if (process.env.NODE_ENV !== "production") {
    console.info(message, payload);
  }
};

