const adminMenu = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: "🏠",
  },
  {
    title: "System Management",
    icon: "👥",
    subItems: [
      { title: "Roles", path: "/admin/dashboard/roles" },
      { title: "Status", path: "/admin/dashboard/status" },
      { title: "Bank Types", path: "/admin/dashboard/bank-types" },
      { title: "Membership Requests", path: "/admin/dashboard/memberships" },
    ],
  },
];

export default adminMenu;
