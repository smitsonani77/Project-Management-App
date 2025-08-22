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
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        ➕ Add a New Task
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Title + Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 placeholder-gray-400 shadow-sm"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <button
            disabled={loading}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg shadow transition-colors"
            type="submit"
          >
            {loading ? "Adding..." : "Add Task"}
          </button>
        </div>

        {/* Description */}
        <textarea
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 placeholder-gray-400 shadow-sm min-h-[80px]"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Error Message */}
        {error && (
          <p className="text-red-600 text-sm font-medium bg-red-50 p-2 rounded-lg border border-red-200">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
