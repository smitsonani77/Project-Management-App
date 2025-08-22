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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Task List</h2>

      {tasks.length === 0 ? (
        <p className="text-sm text-gray-600">No tasks yet. Add one above.</p>
      ) : (
        <ul className="divide-y">
          {tasks.map((t) => (
            <li
              key={t.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
            >
              {editId === t.id ? (
                // ✏️ Edit Mode
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    type="text"
                    className="border rounded px-2 py-1"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    className="border rounded px-2 py-1"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <select
                    className="border rounded px-2 py-1"
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
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                      disabled={busyId === t.id}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-3 py-1 bg-gray-300 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // 👀 View Mode
                <>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-medium">{t.title}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${getStatusClasses(
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
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
