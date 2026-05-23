import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useStore } from "../../../shared/hooks/useStore";
import { useToast } from "../../../shared/hooks/useToast";
import Card from "../../../shared/components/ui/Card";
import Input from "../../../shared/components/ui/Input";
import Button from "../../../shared/components/ui/Button";
import UserTable from "../components/UserTable";

const UsersPage = observer(() => {
  const { userStore, authStore } = useStore();
  const { showToast } = useToast();
  const [searchInput, setSearchInput] = useState(userStore.search);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [createEmail, setCreateEmail] = useState("");
  const [createFirstName, setCreateFirstName] = useState("");
  const [createLastName, setCreateLastName] = useState("");
  const [createRole, setCreateRole] = useState<"MANAGER" | "TEAMLEADER" | "FLOORSTAFF">("FLOORSTAFF");

  useEffect(() => {
    userStore.fetchUsers().catch(() => {
      showToast("ไม่สามารถโหลดรายชื่อพนักงานได้", "error");
    });
  }, [userStore.page, userStore.limit, userStore.role]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    userStore.setSearch(searchInput.trim());
    userStore.fetchUsers().catch(() => {
      showToast("ไม่สามารถค้นหารายชื่อพนักงานได้", "error");
    });
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createEmail.trim() || !createFirstName.trim() || !createLastName.trim()) {
      showToast("กรุณากรอกข้อมูลผู้ใช้งานให้ครบ", "error");
      return;
    }

    try {
      await userStore.createUser({
        email: createEmail.trim(),
        firstName: createFirstName.trim(),
        lastName: createLastName.trim(),
        role: createRole,
      });
      showToast("สร้างบัญชีพนักงานเรียบร้อย ระบบส่งอีเมลตั้งรหัสผ่านแล้ว", "success");
      setShowCreateUserModal(false);
      setCreateEmail("");
      setCreateFirstName("");
      setCreateLastName("");
      setCreateRole("FLOORSTAFF");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const status = axiosError?.response?.status;
      const message = axiosError?.response?.data?.message;
      if (status === 403 || message === "Forbidden") {
        showToast("คุณไม่มีสิทธิ์สร้างบัญชีพนักงาน", "error");
        return;
      }
      showToast(message || "ไม่สามารถสร้างบัญชีพนักงานได้", "error");
    }
  };

  const role = authStore.user?.role?.toUpperCase() ?? "";
  const isManager = role === "MANAGER";

  if (!isManager) {
    return (
      <DashboardLayout>
        <Card>
          <p className="text-sm text-gray-700">หน้านี้สำหรับ MANAGER เท่านั้น</p>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="mt-1 text-gray-500">Manage staff directory</p>
          </div>
          <Button type="button" onClick={() => setShowCreateUserModal(true)}>
            + Create User
          </Button>
        </div>
      </div>
      {showCreateUserModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Create User</h3>
              <button
                type="button"
                onClick={() => setShowCreateUserModal(false)}
                className="rounded-lg border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              ระบบจะส่งอีเมลให้พนักงานเพื่อยืนยันตัวตนและตั้งรหัสผ่านด้วยตนเอง
            </p>
            <form onSubmit={handleCreateUserSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input
                  label="Email"
                  type="email"
                  placeholder="staff@test.com"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  required
                />
              </div>
              <Input
                label="First Name"
                placeholder="John"
                value={createFirstName}
                onChange={(e) => setCreateFirstName(e.target.value)}
                required
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                value={createLastName}
                onChange={(e) => setCreateLastName(e.target.value)}
                required
              />
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Role</label>
                <select
                  value={createRole}
                  onChange={(e) => setCreateRole(e.target.value as "MANAGER" | "TEAMLEADER" | "FLOORSTAFF")}
                  className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-gray-400"
                >
                  <option value="MANAGER">MANAGER</option>
                  <option value="TEAMLEADER">TEAMLEADER</option>
                  <option value="FLOORSTAFF">FLOORSTAFF</option>
                </select>
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button type="submit" loading={userStore.loading}>
                  Create account
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowCreateUserModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Card className="mb-6">
        <form onSubmit={handleSearchSubmit} className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <Input
              label="Search user"
              placeholder="Search by name or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Role</label>
            <select
              value={userStore.role}
              onChange={(e) => userStore.setRole(e.target.value)}
              className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-gray-400"
            >
              <option value="">All roles</option>
              <option value="MANAGER">MANAGER</option>
              <option value="TEAMLEADER">TEAMLEADER</option>
              <option value="FLOORSTAFF">FLOORSTAFF</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Per page</label>
            <select
              value={userStore.limit}
              onChange={(e) => userStore.setLimit(Number(e.target.value))}
              className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-gray-400"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="md:col-span-4 flex gap-2">
            <Button type="submit" loading={userStore.loading}>
              Search
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setSearchInput("");
                userStore.setSearch("");
                userStore.setRole("");
                userStore.fetchUsers().catch(() => {
                  showToast("ไม่สามารถโหลดรายชื่อพนักงานได้", "error");
                });
              }}
            >
              Clear
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <UserTable users={userStore.users} />
      </Card>

      {userStore.users.length === 0 && !userStore.loading && (
        <p className="mt-6 text-sm text-gray-500">No users found.</p>
      )}

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Page {userStore.page} of {userStore.totalPages} ({userStore.total} items)
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            disabled={userStore.page <= 1 || userStore.loading}
            onClick={() => userStore.setPage(userStore.page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            disabled={userStore.page >= userStore.totalPages || userStore.loading}
            onClick={() => userStore.setPage(userStore.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
});

export default UsersPage;
