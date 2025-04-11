import { useState } from "react";
import FormContainer from "../../components/ui/FormContainer";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import LinkText from "../../components/ui/LinkText";
import { useAuth } from "../../contexts//AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <FormContainer title="Login to PVMS" subtitle="Access your account">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <InputField
            label="Email address"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
          />
          <InputField
            label="Password"
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <Button type="submit" variant="secondary">
          Login
        </Button>
      </form>
      <p className="text-center text-sm text-gray-600">
        Don’t have an account? <LinkText to="/join-us">Join Us</LinkText>
      </p>
    </FormContainer>
  );
};

export default LoginPage;
