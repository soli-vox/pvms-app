const adminMessages = {
  pending:
    "Membership request is pending review due to incomplete information.",
  approved: "Membership request has been approved. Welcome to the system!",
  rejected: "Membership request rejected due to eligibility criteria not met.",
  suspended: "Membership suspended due to policy violation.",
  active: "Membership status set to active after review.",
  inactive: "Membership deactivated due to inactivity.",
};

export const getStatusChangeMessage = (newStatusSlug) => {
  return adminMessages[newStatusSlug.toLowerCase()] || "Status updated.";
};
