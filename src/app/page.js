"use client";

import { useState } from "react";
import "./globals.css";

const API_URL = "https://img-definitely-diamond-outlets.trycloudflare.com  ";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const gambar = form.elements.gambar.files[0];

    if (gambar && gambar.size > 5 * 1024 * 1024) {
      setHasil("Gambar maksimal 5 MB.");
      return;
    }

    const data = new FormData(form);

    setLoading(true);
    setHasil("Mengirim...");

    try {
      const response = await fetch(`${API_URL}/api/kirim`, {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.pesan || "Pengiriman gagal.");
      }

      setHasil(result.pesan);
      form.reset();
    } catch (error) {
      setHasil("Gagal mengirim: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Kirim Pesan</h1>
        <p>Kirim teks dan gambar ke server.</p>

        <label htmlFor="nama">Nama Lengkap</label>
        <input id="nama" name="nama" maxLength={100} required />

        <label htmlFor="pesan">Pesan Anda</label>
        <textarea id="pesan" name="pesan" maxLength={3000} rows={5} required />

        <label htmlFor="gambar">Gambar (maks. 5 MB)</label>
        <input
          id="gambar"
          name="gambar"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Mengirim..." : "Kirim"}
        </button>

        <p className="hasil" role="status">
          {hasil}
        </p>
      </form>
    </main>
  );
}
