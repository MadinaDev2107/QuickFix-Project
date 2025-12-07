"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase.config";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";
import { Muammo } from "@/app/types";

export default function CompletedProblemPage() {
  const [completed, setCompleted] = useState<Muammo[]>([]);

  useEffect(() => {
    const q = query(collection(db, "muammolar"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const list: Muammo[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as Muammo;

        if (data.status === "bajarildi") {
          list.push({
            ...data,
            id: doc.id,
          });
        }
      });

      setCompleted(list);
    });

    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "muammolar", id));
    toast.success("Bajarilgan muammo o'chirildi ✅");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 overflow-x-auto hide-scrollbar">
      <h1 className="text-2xl font-bold mb-5 text-green-700 flex items-center">
        <TiTick className="text-green-700" size={48} />
        Completed Problems
      </h1>

      <div className=" overflow-x-auto hide-scrollbar">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">description</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {completed.map((m) => (
              <tr key={m.id} className="text-center">
                <td className="border p-2">{m.title}</td>
                <td className="border p-2">{m.description}</td>
                <td className="border p-2">
                  {m.createdAt?.toDate?.()?.toLocaleString() || "—"}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    O'chirish
                  </button>
                </td>
              </tr>
            ))}

            {completed.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  Hali bajarilgan muammo yo'q
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
