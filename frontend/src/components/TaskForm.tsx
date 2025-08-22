"use client";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/utils/api";
import { useState } from "react";
import type { Task } from "@/app/tasks/page";

export default function TaskForm({
  onCreated
}: {
  onCreated: (t: Task) => void;
}) {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await api.post(
        "/tasks",
        { title, description },
        token || undefined
      );
      const task: Task = res.task ?? res.data?.task;
      onCreated(task);
      setTitle("");
      setDescription("");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex gap-3">
        <input
          className="input"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button disabled={loading} className="btn btn-primary" type="submit">
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
      <textarea
        className="input"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
}
