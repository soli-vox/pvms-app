import { useEffect, useState } from "react";
import roleService from "../../services/roleService";
import notify from "../../utils/notify";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";

const RolePage = () => {
  const [roles, setRoles] = useState([]);
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
    const fetchRoles = async () => {
      try {
        const response = await roleService.getAll();
        if (response.success) {
          setRoles(response.data);
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        setError(`Failed to fetch roles: ${err.message || "Unknown error"}`);
        notify.error("Failed to fetch roles");
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  // Check for changes
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
        const response = await roleService.update(editingId, formData);
        if (response.success) {
          const updatedRole = response.data;
          setRoles(
            roles.map((role) => (role.id === editingId ? updatedRole : role))
          );
          setIsEditing(false);
          setEditingId(null);
          notify.success(response.message || "Role updated successfully");
        } else {
          throw new Error(response.message);
        }
      } else {
        const response = await roleService.create(formData);
        if (response.success) {
          const createdRole = response.data;
          setRoles([...roles, createdRole]);
          notify.success(response.message || "Role created successfully");
        } else {
          throw new Error(response.message);
        }
      }
      setFormData({ name: "", description: "" });
      setOriginalData(null);
      setHasChanges(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit role";
      setError(errorMessage);
      notify.error(errorMessage);
    }
  };

  const handleEdit = (role) => {
    if (!role || !role.id) {
      setError("Invalid role selected for editing");
      notify.error("Invalid role selected for editing");
      return;
    }
    setIsEditing(true);
    setEditingId(role.id);
    setFormData({
      name: role.name || "",
      description: role.description || "",
    });
    setOriginalData({
      name: role.name || "",
      description: role.description || "",
    });
    setHasChanges(false);
  };

  const handleDelete = async (id) => {
    if (!id || !confirm("Are you sure you want to delete this role?")) return;
    try {
      await roleService.delete(id);
      setRoles(roles.filter((role) => role.id !== id));
      notify.success("Role deleted successfully");
    } catch (error) {
      setError("Failed to delete role");
      notify.error("Failed to delete role");
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
        Manage Roles
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
            placeholder="Enter role name"
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
            disabled={isEditing && !hasChanges}
          >
            {isEditing ? "Update Role" : "Add Role"}
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
            {roles.length > 0 ? (
              roles.map((role, index) => (
                <tr
                  key={role.id || `role-${index}`}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {role.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {role.description || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(role)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-500">
                  No Roles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolePage;
