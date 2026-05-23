import { useState } from "react";
import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import Card from "../../../shared/components/ui/Card";
import Badge from "../../../shared/components/ui/Badge.tsx";

interface Props {
  loading?: boolean;
  onSubmit: (email: string, password: string) => Promise<void>;
}

const LoginForm = ({ loading, onSubmit }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <h1 className="text-base font-medium text-gray-900">Sign in</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Movie database management system
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Input
            label="Email address"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Sign in
        </Button>

        <div className="border-t border-gray-100 pt-4 flex items-center gap-2 flex-wrap">
          <Badge variant="success">System online</Badge>
        </div>
      </form>
    </Card>
  );
};

export default LoginForm;
