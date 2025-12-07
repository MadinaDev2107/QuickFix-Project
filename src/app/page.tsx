"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import Rodal from "rodal";
import { FaMapMarkerAlt, FaClock, FaImage } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { db } from "./firebase/firebase.config";
import { useRouter } from "next/navigation";
import { Muammo } from "./types";

type User = {
  isLoggedIn: boolean;
  isAdmin: boolean;
  id: string;
};

const currentUser: User = {
  isLoggedIn: true, 
  isAdmin: true, 
  id: "user1",
};

export default function Page() {
  const [muammolar, setMuammolar] = useState<Muammo[]>([]);
  const [descModal, setDescModal] = useState<Muammo | null>(null);
  const [editModal, setEditModal] = useState<Muammo | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<Muammo["status"]>("kutilmoqda");
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(true); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser.isLoggedIn) return toast.error("Login qilishingiz kerak!");
    setLoading(true);
    try {
      await addDoc(collection(db, "muammolar"), {
        title,
        description,
        status,
        imageUrl,
        location,
        ownerId: currentUser.id,
        createdAt: serverTimestamp(),
      });
      toast.success("Muammo qo‘shildi!");
      clearForm();
      setIsFormOpen(false);
    } catch (err) {
      console.log(err);
      toast.error("Xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  // Edit Muammo
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal) return;
    try {
      const docRef = doc(db, "muammolar", editModal.id);
      await updateDoc(docRef, {
        title,
        description,
        status,
        imageUrl,
        location,
      });
      toast.success("Muammo tahrirlandi!");
      setEditModal(null);
    } catch (err) {
      console.log(err);
      toast.error("Xatolik yuz berdi!");
    }
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    router.push("/auth");
  };
  const clearForm = () => {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setLocation("");
    setStatus("kutilmoqda");
  };

  useEffect(() => {
    const q = query(collection(db, "muammolar"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list: Muammo[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Muammo);
      });
      setMuammolar(list);
    });
    return () => unsub();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "kutilmoqda":
        return "bg-yellow-100 text-yellow-800";
      case "tekshirilyapti":
        return "bg-blue-100 text-blue-800";
      case "bajarildi":
        return "bg-green-100 text-green-800";
      default:
        return "";
    }
  };

  const filter = muammolar.filter((m) => {
    const matchesStatus =
      filterStatus === "all" ? true : m.status === filterStatus;

    const matchesType =
      filterType === "all"
        ? true
        : m.title.toLowerCase().includes(filterType) ||
          m.description.toLowerCase().includes(filterType);

    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesType && matchesSearch;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Rostdan o'chirmoqchimisiz?")) return;
    try {
      await deleteDoc(doc(db, "muammolar", id));
      toast.success("Muammo o'chirildi!");
    } catch (err) {
      console.log(err);
      toast.error("Xatolik yuz berdi!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <div className="text-2xl font-bold text-green-700">
          <h3 className="cursor-pointer">QuickFix</h3>
        </div>
        <div className="flex gap-2 flex-1 max-w-[500px]">
          <input
            type="text"
            placeholder="Search muammo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded flex-1 w-50"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border p-2 rounded w-50"
          >
            <option value="all">All Status</option>
            <option value="kutilmoqda">Kutilmoqda</option>
            <option value="tekshirilyapti">Tekshirilyapti</option>
            <option value="bajarildi">Bajarildi</option>
          </select>
        </div>

        {currentUser.isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        ) : (
          <div>
            <a href="/auth" className="text-blue-600 hover:underline mr-2">
              Login
            </a>
            <a href="/auth" className="text-blue-600 hover:underline">
              Register
            </a>
          </div>
        )}
      </div>

      {currentUser.isLoggedIn && (
        <div className="flex items-center gap-3 mb-6">
          <button
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
            onClick={() => setIsFormOpen(true)}
          >
            Yangi muammo qo‘shish
          </button>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border p-2 rounded w-[200px]"
          >
            <option value="all">All Types</option>
            <option value="chiqindi">Chiqindi</option>
            <option value="suv">Suv</option>
            <option value="gaz">Gaz</option>
            <option value="elektr">Elektr</option>
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filter.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded shadow hover:shadow-lg transition p-4 flex flex-col justify-between"
          >
            {m.imageUrl ? (
              <img
                src={m.imageUrl}
                alt={m.title}
                className="w-full h-40 object-cover rounded mb-3"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center mb-3">
                <FaImage size={50} className="text-gray-400" />
              </div>
            )}

            <h3 className="text-xl font-bold mb-2">{m.title}</h3>
            <span
              className={`inline-block px-2 py-1 rounded text-sm font-semibold ${getStatusColor(
                m.status
              )} mb-2`}
            >
              {m.status}
            </span>
            {m.location && (
              <p className="flex items-center gap-1 mb-1 text-gray-600">
                <FaMapMarkerAlt /> {m.location}
              </p>
            )}
            <p className="flex items-center gap-1 mb-2 text-gray-600">
              <FaClock /> {m.createdAt?.toDate?.()?.toLocaleString() || "—"}
            </p>

            <div className="flex gap-2 mt-2">
              <button
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition flex-1 justify-center"
                onClick={() => setDescModal(m)}
              >
                <AiOutlineEye /> Show
              </button>

              {(currentUser.isAdmin || m.ownerId === currentUser.id) && (
                <>
                  <button
                    className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition flex-1 justify-center"
                    onClick={() => {
                      setEditModal(m);
                      setTitle(m.title);
                      setDescription(m.description);
                      setStatus(m.status);
                      setImageUrl(m.imageUrl || "");
                      setLocation(m.location || "");
                    }}
                  >
                    <AiOutlineEdit /> Edit
                  </button>
                  <button
                    className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition flex-1 justify-center"
                    onClick={() => handleDelete(m.id)}
                  >
                    <AiOutlineDelete /> Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <Rodal
        visible={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        width={500}
        height={400}
      >
        <h3 className="text-lg font-bold mb-2">Yangi Muammo</h3>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Muammo nomi"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border p-2 rounded"
          />
          <textarea
            placeholder="Muammo tavsifi"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Rasm URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Joylashuv (aniq ko'rsating)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Muammo["status"])}
            className="border p-2 rounded"
          >
            <option value="kutilmoqda">Kutilmoqda</option>
            <option value="tekshirilyapti">Tekshirilyapti</option>
            <option value="bajarildi">Bajarildi</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white p-2 rounded hover:bg-green-800 transition"
          >
            {loading ? "Loading..." : "Add"}
          </button>
        </form>
      </Rodal>

      <Rodal
        visible={!!editModal}
        onClose={() => setEditModal(null)}
        width={500}
        height={400}
      >
        <h3 className="text-lg font-bold mb-2">Edit Problem</h3>
        <form className="flex flex-col gap-3" onSubmit={handleEdit}>
          <input
            type="text"
            placeholder="Muammo nomi"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border p-2 rounded"
          />
          <textarea
            placeholder="Muammo tavsifi"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Rasm URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Joylashuv"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Muammo["status"])}
            className="border p-2 rounded"
          >
            <option value="kutilmoqda">Kutilmoqda</option>
            <option value="tekshirilyapti">Tekshirilyapti</option>
            <option value="bajarildi">Bajarildi</option>
          </select>
          <button
            type="submit"
            className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition"
          >
            Saqlash
          </button>
        </form>
      </Rodal>

      <Rodal
        visible={!!descModal}
        onClose={() => setDescModal(null)}
        width={400}
        height={250}
      >
        <h3 className="text-lg font-bold mb-2">{descModal?.title}</h3>
        <p>{descModal?.description}</p>
      </Rodal>
    </div>
  );
}
