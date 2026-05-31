export const validatePhone = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  if (!value.trim()) return "Phone number is required";
  if (digits.length < 3 || digits.length > 13) return "Please enter valid phone format";
  return "";
};

export const isPhoneEnabled = (value: string): boolean => {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 4 && digits.length <= 13;
};
