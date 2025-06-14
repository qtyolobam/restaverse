import LoginForm from "../components/LoginForm";
import { useState } from "react";
import Loader from "../components/Loader";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading && <Loader />}
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm setLoading={setIsLoading} />
          <p className="text-center text-xs text-gray-400 mt-8">
            By signing in, you agree to our{" "}
            <a href="/terms" className="underline hover:text-gray-600">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-gray-600">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
