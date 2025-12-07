"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { BiMenu } from "react-icons/bi";
import { FaTools } from "react-icons/fa";
import { auth } from "../firebase/firebase.config";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== "admin@gmail.com") {
        router.push("/auth");
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("role");
    router.push("/auth");
  };

  if (loading) return null;

  return (
    <>
      <div className="flex justify-between items-center p-3 border-b">
        <Link href="/" className="text-decoration-none">
          <h1 className="text-2xl font-bold text-green-700! cursor-pointer">
            QuickFix
          </h1>
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex min-h-screen">
        <div
          className={`${
            open ? "w-64" : "w-16"
          } bg-green-800 text-white duration-300`}
        >
          <div className="flex items-center justify-between p-4">
            {open && <h3>Admin Panel</h3>}
            <button onClick={() => setOpen(!open)}>
              <BiMenu size={25} />
            </button>
          </div>

          <nav className="flex flex-col p-2 gap-2">
            <Link
              href="/admin"
              className="hover:bg-green-700 p-2 rounded text-decoration-none text-green-300! flex  gap-2"
            >
              🏠 {open && <h5> Dashboard</h5>}
            </Link>

            <Link
              href="/admin/muammo-add"
              className="hover:bg-green-700 p-2 rounded text-decoration-none text-green-300! flex items-center gap-2"
            >
              <FaTools size={25} className="text-danger" />
              {open && <h5 className="flex ">Problems</h5>}
            </Link>

            <Link
              href="/admin/completed-problem"
              className="hover:bg-green-700 p-2 rounded text-decoration-none text-green-300! flex items-center gap-2"
            >
              ✅ {open && <h5 className="flex ">Completed</h5>}
            </Link>
          </nav>
        </div>

        <div className="flex-1 p-3 overflow-x-auto hide-scrollbar ">{children}</div>
      </div>
    </>
  );
}
