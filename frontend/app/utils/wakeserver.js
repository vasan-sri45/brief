export const wakeServer = async () => {
  try {
    await fetch("/api/health", {
      credentials: "include",
      cache: "no-store",
    });
    return true;
  } catch {
    return false;
  }
};
