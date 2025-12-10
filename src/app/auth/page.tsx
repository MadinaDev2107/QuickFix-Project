"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";

export default function LoginPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const ADMIN_EMAIL = "admin@gmail.com";
  const ADMIN_PASSWORD = "qwerty";

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem("role", "admin");
        router.push("/admin");
      } else {
        localStorage.setItem("role", "user");
        router.push("/");
      }
    } catch (err) {
      alert("Xatolik: login yoki parol noto‘g‘ri!");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-[350px]"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="bg-green-600 text-white w-full py-2 rounded">
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="mt-3 text-blue-600 text-center cursor-pointer"
        >
          {isLogin ? "Akkaunt yo‘qmi? Register" : "Akkaunting bormi? Login"}
        </p>
      </form>
    </div>
  );
}
