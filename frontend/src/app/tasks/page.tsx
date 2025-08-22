"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { api } from "@/utils/api";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: "pending" | "in-progress" | "completed";
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
};

export default function TasksPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await api.get("/tasks", token);
        console.log('res->',res)
        setTasks(res.tasks ?? res.data?.tasks ?? []);
        setError(null);
      } catch (e: any) {
        setError(e?.response?.data?.error || "Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [isAuthenticated, router, token]);

  const addTask = (task: Task) => setTasks((prev) => [task, ...prev]);
  const updateTask = (updated: Task) =>
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-4">Your Tasks</h1>
        <TaskForm onCreated={addTask} />
      </div>

      <div className="card">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <TaskList tasks={tasks} onUpdated={updateTask} />
        )}
      </div>
    </div>
  );
}
