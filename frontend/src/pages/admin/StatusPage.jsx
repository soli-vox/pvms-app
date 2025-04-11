import { useEffect, useState } from "react";
import statusService from "../../services/statusService";
import notify from "../../utils/notify";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";

const StatusPage = () => {
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await statusService.getAll();
        if (response.success) {
          setStatus(response.data);
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        setError(`Failed to fetch status: ${err.message || "Unknown error"}`);
        notify.error("Failed to fetch status");
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  // Check for changes whenever formData or originalData changes
  useEffect(() => {
    if (isEditing && originalData) {
      const changesDetected =
        formData.name !== originalData.name ||
        formData.description !== originalData.description;
      setHasChanges(changesDetected);
    }
  }, [formData, originalData, isEditing]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && editingId) {
        console.log("EditingID", editingId);
        const response = await statusService.update(editingId, formData);
        const updatedStatus = response.data.data || response.data;
        setStatus(
          status.map((bt) => (bt.id === editingId ? updatedStatus : bt))
        );
        setIsEditing(false);
        setEditingId(null);
        notify.success("Status updated successfully");
      } else {
        const response = await statusService.create(formData);
        const createdStatus = response.data.data || response.data;
        setStatus([...status, createdStatus]);
        notify.success("Status created successfully");
      }
      setFormData({ name: "", description: "" });
      setOriginalData(null);
      setHasChanges(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit status";
      setError(errorMessage);
      notify.error(errorMessage);
    }
  };

  const handleEdit = (status) => {
    if (!status || !status.id) {
      setError("Invalid status selected for editing");
      notify.error("Invalid status selected for editing");
      return;
    }
    setIsEditing(true);
    setEditingId(status.id);
    const newFormData = {
      name: status.name || "",
      description: status.description || "",
    };
    setFormData(newFormData);
    setOriginalData(newFormData);
    setHasChanges(false);
  };

  const handleDelete = async (id) => {
    if (!id || !confirm("Are you sure you want to delete this status?")) return;
    try {
      await statusService.delete(id);
      setStatus(status.filter((bt) => bt.id !== id));
      setFormData({ name: "", description: "" });
      notify.success("Status deleted successfully");
    } catch (error) {
      setError("Failed to delete status");
      notify.error("Failed to delete status");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: "", description: "" });
    setOriginalData(null);
    setHasChanges(false);
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-3">
      <h1 className="text-xl font-bold mb-4 text-gray-900 bg-gray-100 rounded-lg shadow-lg p-3">
        Manage Status
      </h1>

      <form
        onSubmit={handleFormSubmit}
        className="mb-6 bg-white p-4 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Name"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter Status Type"
            required
          />
          <InputField
            label="Description"
            id="description"
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter description"
          />
        </div>
        <div className="mt-6 flex space-x-4">
          <Button
            type="submit"
            variant="primary"
            disabled={isEditing && !hasChanges} // Disable when editing and no changes
          >
            {isEditing ? "Update Status" : "Add Status"}
          </Button>
          {isEditing && (
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {status.length > 0 ? (
              status.map((status, index) => (
                <tr
                  key={status.id || `status-${index}`}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {status.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {status.description || "N/A"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(status)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(status.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No Status found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatusPage;
