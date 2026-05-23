import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Card from "../../../shared/components/ui/Card";
import Input from "../../../shared/components/ui/Input";
import Button from "../../../shared/components/ui/Button";
import { useToast } from "../../../shared/hooks/useToast";
import { setupPasswordApi } from "../../../infrastructure/api/auth.api";
import { ROUTES } from "../../../routes/routes";

const SetupPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showToast("ลิงก์ตั้งรหัสผ่านไม่ถูกต้อง", "error");
      return;
    }
    if (!password || password.length < 6) {
      showToast("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร", "error");
      return;
    }
    if (password !== confirmPassword) {
      showToast("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน", "error");
      return;
    }

    try {
      setLoading(true);
      await setupPasswordApi({ token, password });
      showToast("ตั้งรหัสผ่านเรียบร้อยแล้ว กรุณาเข้าสู่ระบบ", "success");
      navigate(ROUTES.LOGIN);
    } catch {
      showToast("ไม่สามารถตั้งรหัสผ่านได้ ลิงก์อาจหมดอายุ", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <h1 className="text-base font-medium text-gray-900">Set up password</h1>
              <p className="mt-0.5 text-sm text-gray-500">Create your password to activate account</p>
            </div>
            <Input
              label="New password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" loading={loading} className="w-full">
              Set password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SetupPasswordPage;
