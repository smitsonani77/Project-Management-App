"use client";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/utils/api";
import type { Task } from "@/app/tasks/page";
import { useState } from "react";

const statuses: Task["status"][] = ["pending", "in-progress", "completed"];

export default function TaskList({
  tasks,
  onUpdated
}: {
  tasks: Task[];
  onUpdated: (t: Task) => void;
}) {
  const { token } = useAuth();
  const [busyId, setBusyId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState<Task["status"]>("pending");

  const startEdit = (task: Task) => {
    setEditId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditStatus(task.status);
  };

  const getStatusClasses = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const saveEdit = async (task: Task) => {
    try {
      setBusyId(task.id);
      const res = await api.put(
        `/tasks/${task.id}`,
        { title: editTitle, description: editDescription, status: editStatus },
        token || undefined
      );
      const updated: Task = res.task ??
        res.data?.task ?? {
          ...task,
          title: editTitle,
          description: editDescription,
          status: editStatus
        };
      onUpdated(updated);
      setEditId(null);
    } catch (e: any) {
      alert(e?.response?.data?.error || "Failed to update");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📋 Task List</h2>

      {tasks.length === 0 ? (
        <p className="text-sm text-gray-600 italic">
          No tasks yet. Add one above ✨
        </p>
      ) : (
        <ul className="grid gap-4">
          {tasks.map((t) => (
            <li
              key={t.id}
              className="bg-white shadow-sm hover:shadow-md transition rounded-xl border p-4"
            >
              {editId === t.id ? (
                // ✏️ Edit Mode
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <select
                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    value={editStatus}
                    onChange={(e) =>
                      setEditStatus(e.target.value as Task["status"])
                    }
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(t)}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                      disabled={busyId === t.id}
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                    >
                      ✖ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // 👀 View Mode
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-lg font-semibold text-gray-900">
                        {t.title}
                      </p>
                      <span
                        className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusClasses(
                          t.status
                        )}`}
                      >
                        {t.status}
                      </span>
                    </div>
                    {t.description && (
                      <p className="text-sm text-gray-600">{t.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(t)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    >
                      ✏️ Edit
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
