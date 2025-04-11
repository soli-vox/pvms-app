export const fieldConfig = [
  {
    key: "bankType",
    label: "Bank Type",
    transform: (bankType) => bankType?.name || "N/A",
  },
  { key: "name", label: "Name", default: "N/A" },
  { key: "email", label: "Email", default: "N/A" },
  { key: "role", label: "Role", transform: (role) => role?.name || "N/A" },
  {
    key: "status",
    label: "Current Status",
    transform: (status) => status?.name || "N/A",
  },
  { key: "created_at", label: "Applied On", default: "N/A" },
  { key: "message", label: "Message", default: "N/A", isLong: true },
];
