import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAccountList } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const { signIn } = useAuth();
  const multiAccount = useAccountList();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: err } = await signIn(account.trim(), password);
    setSubmitting(false);
    if (err) {
      setError(err.message || "账号或密码错误");
      return;
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "oklch(0.965 0.004 80)" }}
    >
      <div
        className="w-full max-w-sm rounded-xl border shadow-lg p-6"
        style={{
          background: "oklch(1 0 0)",
          borderColor: "oklch(0.9 0.004 80)",
          fontFamily: "'Noto Sans SC', sans-serif",
        }}
      >
        <h1
          className="text-xl font-bold text-center mb-1"
          style={{ color: "oklch(0.2 0.02 250)", fontFamily: "'Noto Serif SC', serif" }}
        >
          巡察工作手册
        </h1>
        <p className="text-sm text-center mb-6" style={{ color: "oklch(0.5 0.015 250)" }}>
          {multiAccount ? "请输入账号和密码" : "请输入访问密码"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {multiAccount && (
            <div className="space-y-2">
              <Label htmlFor="login-account" style={{ color: "oklch(0.3 0.02 250)" }}>
                账号
              </Label>
              <Input
                id="login-account"
                type="text"
                autoComplete="username"
                placeholder="请输入账号"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                required
                className="w-full"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="login-password" style={{ color: "oklch(0.3 0.02 250)" }}>
              密码
            </Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={submitting}
            style={{
              background: "linear-gradient(135deg, oklch(0.55 0.22 25), oklch(0.45 0.2 25))",
              color: "oklch(0.97 0.01 80)",
            }}
          >
            {submitting ? "验证中…" : "进入"}
          </Button>
        </form>
      </div>
    </div>
  );
}
