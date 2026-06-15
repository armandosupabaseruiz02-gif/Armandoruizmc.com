const DEFAULT_REDIRECT = "/mi-cuenta";

export function getSafeRedirect(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_REDIRECT;
  }

  return value;
}
