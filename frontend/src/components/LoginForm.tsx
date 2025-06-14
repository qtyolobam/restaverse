import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { FaBalanceScaleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ setLoading }: { setLoading: (loading: boolean) => void }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (credential: string) => {
    try {
      setLoading(true);
      await login(credential);
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-white shadow-lg">
      <div className="flex justify-center mb-8">
        <FaBalanceScaleRight className="text-4xl text-rose-600" />
      </div>
      <div className="text-center mb-8">
        <h2 className="text-xl font-medium text-gray-800 mb-2">
          Welcome to Comparer
        </h2>
        <p className="text-sm text-gray-500">Sign in to continue</p>
      </div>
      <div className="flex w-full justify-center items-center">
        <GoogleLogin
          onSuccess={(res) => handleLogin(res.credential!)}
          onError={() => alert("Sign in failed")}
          theme="outline"
          shape="rectangular"
          size="large"
          width="100%"
          text="signin_with"
        />
      </div>
    </div>
  );
}
