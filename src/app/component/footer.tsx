"use client";

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white mt-10 p-5">
      <div className="max-w-5xl mx-auto flex flex-col gap-3 text-center">

        <h2 className="text-lg font-semibold">
          QuickFix — Muammolarni tez va qulay hal qilamiz
        </h2>

        <p className="text-gray-300 text-sm">
          Front-end magic, back-end logic. © {new Date().getFullYear()}
        </p>

        <p className="text-gray-400 text-xs">
          Developed by Mushtariy 💛
        </p>

      </div>
    </footer>
  );
}
