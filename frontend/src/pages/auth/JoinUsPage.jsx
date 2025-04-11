import { useState, useEffect } from "react";
import FormContainer from "../../components/ui/FormContainer";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import LinkText from "../../components/ui/LinkText";
import SelectField from "../../components/ui/SelectField";
import publicRouteService from "../../services/publicRouteService";
import notify from "../../utils/notify";

const JoinUsPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bankTypeId, setBankTypeId] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([
    { value: "", label: "Select your role" },
  ]);
  const [bankTypes, setBankTypes] = useState([
    { value: "", label: "Select a Bank Type" },
  ]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Fetch roles and bankTypes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [rolesResponse, bankTypesResponse] = await Promise.all([
          publicRouteService.getAllRoles(),
          publicRouteService.getAllBankTypes(),
        ]);

        // Handle roles
        if (rolesResponse.success) {
          const roleOptions = [
            { value: "", label: "Select your role" },
            ...rolesResponse.data.map((item) => ({
              value: item.slug,
              label: item.name,
            })),
          ];
          setRoles(roleOptions);
        } else {
          throw new Error(rolesResponse.message || "Failed to fetch roles");
        }

        // Handle bankTypes
        if (bankTypesResponse.success) {
          const bankTypeOptions = [
            { value: "", label: "Select a Bank Type" },
            ...bankTypesResponse.data.map((item) => ({
              value: String(item.id),
              label: item.name,
            })),
          ];
          setBankTypes(bankTypeOptions);
        } else {
          throw new Error(
            bankTypesResponse.message || "Failed to fetch bank types"
          );
        }
      } catch (err) {
        const errorMessage = err.message || "Failed to fetch options";
        setFetchError(errorMessage);
        notify.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch bankTypes again if role changes to "bank"
  useEffect(() => {
    if (role === "bank") {
      const fetchBankTypes = async () => {
        setLoading(true);
        try {
          const bankTypesResponse = await publicRouteService.getAllBankTypes();
          if (bankTypesResponse.success) {
            const bankTypeOptions = [
              { value: "", label: "Select a Bank Type" },
              ...bankTypesResponse.data.map((item) => ({
                value: String(item.id),
                label: item.name,
              })),
            ];
            setBankTypes(bankTypeOptions);
          } else {
            throw new Error(
              bankTypesResponse.message || "Failed to fetch bank types"
            );
          }
        } catch (err) {
          const errorMessage = err.message || "Failed to fetch bank types";
          setFetchError(errorMessage);
          notify.error(errorMessage);
        } finally {
          setLoading(false);
        }
      };

      fetchBankTypes();
    }
  }, [role]); // Refetch when role changes to "bank"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const payload = {
        email,
        name,
        role,
        ...(role === "bank" &&
          bankTypeId &&
          bankTypeId !== "" && {
            bank_type_id: parseInt(bankTypeId, 10),
          }),
        message,
      };
      console.log("Backend Data:", payload);
      const response = await publicRouteService.store(payload);
      if (response.success) {
        notify.success(
          "Registration request submitted successfully. You will receive your password once approved."
        );
        setEmail("");
        setName("");
        setRole("");
        setBankTypeId("");
        setMessage("");
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      const errorDetails = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(", ")
        : null;
      const userFriendlyMessage = errorDetails || errorMessage;
      notify.error(userFriendlyMessage);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
      console.log("Error Details:", {
        status: err.response?.status,
        message: errorMessage,
        errors: err.response?.data?.errors,
      });
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (fetchError)
    return <div className="p-6 text-center text-red-500">{fetchError}</div>;

  return (
    <FormContainer
      title="Join PVMS"
      subtitle="Sign up to manage property valuations with AI"
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <SelectField
            label="Role"
            id="role"
            name="role"
            value={role}
            onChange={(e) => {
              console.log("Selected role:", e.target.value);
              setRole(e.target.value);
            }}
            options={roles}
            required
            disabled={loading}
          />
          {role === "bank" && (
            <SelectField
              label="Bank Type"
              id="bank_type"
              name="bank_type"
              value={bankTypeId}
              onChange={(e) => {
                console.log("Selected bankTypeId:", e.target.value);
                setBankTypeId(e.target.value);
              }}
              options={bankTypes}
              disabled={loading || bankTypes.length === 1} // Only default option means no data
            />
          )}
          <InputField
            label="Organization Name"
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Organization Name"
            required
            error={errors.name && errors.name[0]}
            disabled={loading}
          />
          <InputField
            label="Email address"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            error={errors.email && errors.email[0]}
            disabled={loading}
          />
          <InputField
            label="Reason for Joining"
            id="message"
            name="message"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Why would you like to join this system?"
            required
            error={errors.message && errors.message[0]}
            disabled={loading}
          />
        </div>

        <Button type="submit" variant="secondary" disabled={loading}>
          {loading ? "Submitting..." : "Join Now"}
        </Button>
      </form>
      <p className="text-center text-sm text-gray-600">
        Already have an account? <LinkText to="/login">Login</LinkText>
      </p>
    </FormContainer>
  );
};

export default JoinUsPage;
