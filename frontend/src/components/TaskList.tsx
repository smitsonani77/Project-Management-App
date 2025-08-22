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
  const { token, logout } = useAuth();
  const [busyId, setBusyId] = useState<number | null>(null);

  const updateStatus = async (task: Task, status: Task["status"]) => {
    try {
      setBusyId(task.id);
      const res = await api.put(
        `/tasks/${task.id}`,
        { status },
        token || undefined
      );
      const updated: Task = res.task ?? res.data?.task ?? { ...task, status };
      onUpdated(updated);
    } catch (e: any) {
      alert(e?.response?.data?.error || "Failed to update");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Task List</h2>
        <button className="btn btn-secondary" onClick={logout}>
          Logout
        </button>
      </div>
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-600">No tasks yet. Add one above.</p>
      ) : (
        <ul className="divide-y">
          {tasks.map((t) => (
            <li
              key={t.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
            >
              <div>
                <p className="font-medium">{t.title}</p>
                {t.description && (
                  <p className="text-sm text-gray-600">{t.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full border">
                  {t.status}
                </span>
                <select
                  className="input max-w-xs"
                  value={t.status}
                  onChange={(e) =>
                    updateStatus(t, e.target.value as Task["status"])
                  }
                  disabled={busyId === t.id}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
