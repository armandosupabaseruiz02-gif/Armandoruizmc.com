export function getSafeEmail(value: string | null | undefined) {
  const email = value?.trim().toLowerCase() ?? "";

  if (!email || email.length > 254 || !email.includes("@")) {
    return "";
  }

  return email;
}

