"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { TiTick } from "react-icons/ti";
import { FaStopwatch } from "react-icons/fa";
import { BsFillMenuButtonFill } from "react-icons/bs";
import { RiAdminFill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { Muammo } from "../types";

export default function AdminPage() {
  const router = useRouter();

  const [muammolar, setMuammolar] = useState<Muammo[]>([]);
  const [bajarilgan, setBajarilgan] = useState<Muammo[]>([]);
  const [kutayotgan, setKutayotgan] = useState<Muammo[]>([]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/auth");
    }
  }, [router]);

 useEffect(() => {
  const q = query(collection(db, "muammolar")); 
  const unsub = onSnapshot(q, (snapshot) => {
    const list: any[] = [];
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });

    setMuammolar(list);
    setBajarilgan(list.filter((m) => m.status === "bajarildi"));
    setKutayotgan(list.filter((m) => m.status === "kutilmoqda"));
  });

  return () => unsub();
}, []);

  return (
    <div className="p-6 ">
      <h1 className="text-3xl font-bold mb-5 flex items-center gap-2">
        <RiAdminFill className="text-green-700" size={48} />
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Jami muammolar",
            icon: <BsFillMenuButtonFill size={30} />,
            count: muammolar.length,
            color: "text-green-600",
          },
          {
            title: "Bajarilganlar",
            icon: <TiTick size={30} />,
            count: bajarilgan.length,
            color: "text-blue-500",
          },
          {
            title: "Kutayotganlar",
            icon: <FaStopwatch size={30} />,
            count: kutayotgan.length,
            color: "text-yellow-500",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-5 border-2 border-green-500 border-dashed rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center"
          >
            <div className={`mb-3 ${card.color}`}>{card.icon}</div>
            <h3 className="text-lg font-semibold text-center">{card.title}</h3>
            <p className="text-2xl font-bold mt-1">{card.count} ta</p>
          </div>
        ))}
      </div>
    </div>
  );
}
