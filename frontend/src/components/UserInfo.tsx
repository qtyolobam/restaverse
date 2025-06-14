// src/components/UserInfo.tsx
import { useAuth } from "../context/AuthContext";

export default function UserInfo() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="p-4 border mt-4">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <img
        src={user.image || "https://avatar.iran.liara.run/public/30"}
        alt="Profile"
        className="w-16 h-16 rounded-full"
      />
    </div>
  );
}
