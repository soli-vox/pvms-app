import React from "react";
import notify from "../../../utils/notify";
import membershipService from "../../../services/membershipService";

const StatusUpdateForm = ({
  newStatusId,
  setNewStatusId,
  message,
  setMessage,
  statuses,
  currentStatusId,
  isSaving,
  setIsSaving,
  onSave,
  onCancel,
  userId,
}) => {
  const handleSubmit = async () => {
    if (!newStatusId) {
      notify.error("Please select a new status");
      return;
    }

    if (newStatusId === String(currentStatusId)) {
      setIsSaving(false);
      onCancel();
      return;
    }

    if (!message.trim()) {
      notify.error("Please provide a reason for the status change");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        status_id: newStatusId,
        message: message,
      };
      console.log("Sending PUT request", payload); // Debug log
      const response = await membershipService.updateStatusWithMessage(
        userId,
        payload
      );
      const newStatus =
        statuses.find((s) => s.id === Number(newStatusId))?.name || "Unknown";
      onSave(userId, newStatusId, message, newStatus);
      notify.success(`Status updated to ${newStatus}`);
      setIsSaving(false);
      onCancel();
    } catch (err) {
      notify.error(err.message || "Failed to update status");
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700">
          Update Status
        </label>
        <select
          value={newStatusId}
          onChange={(e) => setNewStatusId(e.target.value)}
          className="w-full p-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
          disabled={isSaving}
        >
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </select>
      </div>

      {newStatusId && newStatusId !== String(currentStatusId) && (
        <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700">
            Reason for Change <span className="text-red-500">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
            placeholder="Enter reason for status change"
            rows={3}
            disabled={isSaving}
          />
        </div>
      )}

      <div className="flex justify-end space-x-2 mt-2">
        <button
          onClick={() => {
            setIsSaving(false);
            onCancel();
          }}
          className="px-4 py-1 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
};

export default StatusUpdateForm;
