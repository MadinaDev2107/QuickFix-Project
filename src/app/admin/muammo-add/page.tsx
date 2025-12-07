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
import { db } from "../../firebase/firebase.config";
import toast from "react-hot-toast";
import Rodal from "rodal";
import { FaTools, FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { Muammo } from "@/app/types";

export default function MuammoAddPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Muammo["status"]>("kutilmoqda");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [muammolar, setMuammolar] = useState<Muammo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [descOpen, setdescOpen] = useState(false);
  const [descContent, setDescContent] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setStatus("kutilmoqda");
    setImageUrl("");
    setLocation("");
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editId) {
        await updateDoc(doc(db, "muammolar", editId), {
          title,
          description,
          imageUrl: imageUrl || null,
          location: location || null,
        });
        toast.success("Muammo yangilandi");
      } else {
        await addDoc(collection(db, "muammolar"), {
          title,
          description,
          status,
          createdAt: serverTimestamp(),
          imageUrl: imageUrl || null,
          location: location || null,
        });
        toast.success("Problem added successfully");
      }

      clearForm();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
      toast.error("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
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

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "muammolar", id));
    toast.success("Problem deleted successfully");
  };

  const changeStatus = async (id: string, newStatus: Muammo["status"]) => {
    await updateDoc(doc(db, "muammolar", id), { status: newStatus });
    toast.success("Problem status updated");
  };

  const handleEdit = (m: Muammo) => {
    setEditId(m.id);
    setTitle(m.title);
    setDescription(m.description);
    setImageUrl(m.imageUrl || "");
    setLocation(m.location || "");
    setIsModalOpen(true);
  };

  const showButton = (desc: string) => {
    setDescContent(desc);
    setdescOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 overflow-x-auto hide-scrollbar">
      <div className="flex items-center justify-content-between mb-3">
        <h1 className="text-2xl font-bold mb-4 text-green-700 flex items-center gap-3 ">
          <FaTools className="text-green-700" size={35} />
          Problems Management
        </h1>

        <button
          className="mb-4 bg-green-700 text-white p-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Add new problem
        </button>
      </div>

      <div className="overflow-x-auto hide-scrollbar">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="border p-2">Photo</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Location</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Date </th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {muammolar
              .filter((m) => m.status !== "bajarildi")
              .map((m) => (
                <tr key={m.id} className="text-center">
                  <td className="border p-2">
                    {m.imageUrl ? (
                      <img
                        src={m.imageUrl}
                        alt="rasm"
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="border p-2">{m.title}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => showButton(m.description)}
                      className="bg-green-700 text-white px-2 py-1 rounded w-[70px]"
                    >
                      Show
                    </button>
                  </td>
                  <td className="border p-2">{m.location || "—"}</td>
                  <td className="p-2">
                    <select
                      value={m.status}
                      onChange={(e) =>
                        changeStatus(m.id, e.target.value as Muammo["status"])
                      }
                      className={`p-1 rounded ${
                        m.status === "kutilmoqda"
                          ? "bg-red-100 text-red-700"
                          : m.status === "tekshirilyapti"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      <option value="kutilmoqda">Kutilmoqda</option>
                      <option value="tekshirilyapti">Tekshirilyapti</option>
                      <option value="bajarildi">Bajarildi</option>
                    </select>
                  </td>
                  <td className="border p-2">
                    {m.createdAt?.toDate?.()?.toLocaleString() || "—"}
                  </td>
                  <td className="p-2 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(m)}
                      className="btn btn-outline-warning btn-sm w-[50px] mt-4"
                    >
                      <MdEdit size={20} className="mx-auto" />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="btn btn-outline-danger btn-sm w-[50px] mt-4"
                    >
                      <FaTrash className="mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Rodal
        visible={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          clearForm();
        }}
        customStyles={{ height: "max-content" }}
      >
        <h2 className="text-xl font-bold mb-3">
          {editId ? "Edit problem" : "New problem"}
        </h2>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Muammo nomi"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-control"
          />
          <textarea
            placeholder="Muammo tavsifi"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form-control"
          />
          <input
            type="text"
            placeholder="Rasm URL sini kiriting"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="form-control"
          />
          <input
            type="text"
            placeholder="Location (manzilni aniq ko'rsating)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="form-control"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white p-2 rounded"
          >
            {loading ? "Loading..." : editId ? "Update" : "Add"}
          </button>
        </form>
      </Rodal>

      <Rodal
        visible={descOpen}
        onClose={() => setdescOpen(false)}
        width={400}
        height={300}
      >
        <h2 className="text-xl font-bold mb-3">Tavsif</h2>
        <p>{descContent}</p>
        <p className="mt-3 text-danger">Tezroq chora ko'rilsin!</p>
      </Rodal>
    </div>
  );
}
