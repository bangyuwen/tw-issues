const configuredBasePath = (process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? "").replace(/\/$/, "");

export function sitePath(pathname: string): string {
  if (!configuredBasePath || pathname.startsWith("#") || /^https?:\/\//.test(pathname) || pathname.startsWith("//")) {
    return pathname;
  }

  if (pathname === "/") return `${configuredBasePath}/`;
  return `${configuredBasePath}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}
