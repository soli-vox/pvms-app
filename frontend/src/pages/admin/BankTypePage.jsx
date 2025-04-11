import { useEffect, useState } from "react";
import bankTypeService from "../../services/bankTypeService";
import notify from "../../utils/notify";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";

const BankTypePage = () => {
  const [bankTypes, setBankTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: true,
  });
  const [originalData, setOriginalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchBankTypes = async () => {
      try {
        const response = await bankTypeService.getAll();
        console.log("fetchBankTypes response:", response);
        if (response.success) {
          setBankTypes(response.data);
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        console.error("fetchBankTypes error:", err);
        setError(
          `Failed to fetch bank types: ${err.message || "Unknown error"}`
        );
        notify.error("Failed to fetch bank types");
      } finally {
        setLoading(false);
      }
    };
    fetchBankTypes();
  }, []);

  useEffect(() => {
    if (isEditing && originalData) {
      const changesDetected =
        formData.name !== originalData.name ||
        formData.description !== originalData.description ||
        formData.status !== originalData.status;
      setHasChanges(changesDetected);
    }
  }, [formData, originalData, isEditing]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && editingId) {
        const response = await bankTypeService.update(editingId, formData);
        console.log("update response in submit:", response);
        if (!response.success) {
          throw new Error(response.message);
        }
        const updatedBankType = response.data;
        setBankTypes(
          bankTypes.map((bt) => (bt.id === editingId ? updatedBankType : bt))
        );
        setIsEditing(false);
        setEditingId(null);
        notify.success(response.message || "Bank type updated successfully");
      } else {
        console.log("Data to be created is in format ", formData);
        const response = await bankTypeService.create(formData);
        console.log("create response in submit:", response);
        if (!response.success) {
          throw new Error(response.message);
        }
        const createdBankType = response.data;
        setBankTypes([...bankTypes, createdBankType]);
        notify.success(response.message || "Bank type created successfully");
      }
      setFormData({ name: "", description: "", status: true });
      setOriginalData(null);
      setHasChanges(false); // Reset hasChanges after successful submission
    } catch (error) {
      console.error("handleFormSubmit error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit bank type";
      setError(errorMessage);
      notify.error(errorMessage);
    }
  };

  const handleEdit = (bankType) => {
    if (!bankType || !bankType.id) {
      setError("Invalid bank type selected for editing");
      notify.error("Invalid bank type selected for editing");
      return;
    }
    setIsEditing(true);
    setEditingId(bankType.id);
    const newFormData = {
      name: bankType.name || "",
      description: bankType.description || "",
      status: bankType.status !== undefined ? bankType.status : true,
    };
    setFormData(newFormData);
    setOriginalData(newFormData);
    setHasChanges(false);
  };

  const handleDelete = async (id) => {
    if (!id || !confirm("Are you sure you want to delete this bank type?"))
      return;
    try {
      await bankTypeService.delete(id);
      setBankTypes(bankTypes.filter((bt) => bt.id !== id));
      notify.success("Bank type deleted successfully");
    } catch (error) {
      console.error("handleDelete error:", error);
      setError("Failed to delete bank type");
      notify.error("Failed to delete bank type");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: "", description: "", status: true });
    setOriginalData(null);
    setHasChanges(false);
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-3">
      <h1 className="text-xl font-bold mb-4 text-gray-900 bg-gray-100 rounded-lg shadow-lg p-3">
        Manage Bank Types
      </h1>

      <form
        onSubmit={handleFormSubmit}
        className="mb-6 bg-white p-4 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Name"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter bank type name"
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
          <div className="flex items-center">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.checked })
                }
                className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              Active
            </label>
          </div>
        </div>
        <div className="mt-6 flex space-x-4">
          <Button
            type="submit"
            variant="primary"
            disabled={isEditing && !hasChanges}
          >
            {isEditing ? "Update Bank Type" : "Add Bank Type"}
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
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bankTypes.length > 0 ? (
              bankTypes.map((bankType) => (
                <tr key={bankType.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {bankType.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bankType.description || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bankType.status ? "Active" : "Inactive"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(bankType)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bankType.id)}
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
                  No bank types found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BankTypePage;
