import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

const themeClasses = {
  blue: {
    bg: "bg-blue-600",
    hover: "hover:bg-blue-700",
    ring: "focus:ring-blue-400",
  },
  red: {
    bg: "bg-red-600",
    hover: "hover:bg-red-700",
    ring: "focus:ring-red-400",
  },
  green: {
    bg: "bg-green-600",
    hover: "hover:bg-green-700",
    ring: "focus:ring-green-400",
  },
  yellow: {
    bg: "bg-yellow-500",
    hover: "hover:bg-yellow-600",
    ring: "focus:ring-yellow-300",
  },
};

function App() {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem("tasks");
    return stored ? JSON.parse(stored) : [];
  });
  const [filter, setFilter] = useState("all");
  const [themeColor, setThemeColor] = useState(() => {
    return localStorage.getItem("themeColor") || "blue";
  });
  const [editingTask, setEditingTask] = useState(null);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("themeColor", themeColor);
  }, [themeColor]);

  const handleNewTask = (task) => {
    if (editingTask) {
      const updatedTask = { ...editingTask, name: task.name, icon: task.icon };
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
      setEditingTask(null);
      toast.success(t("taskUpdated"));
    } else {
      const newTask = { ...task, id: uuidv4(), done: false, icon: task.icon || "📝" };
      setTasks((prev) => [...prev, newTask]);
      toast.success(t("taskAdded"));
    }
  };

  const startEditing = (task) => {
    if (task.done) {
      toast.error(t("cannotEditCompleted"));
      return;
    }
    setEditingTask(task);
  };

  const toggleTask = (task) => {
    const updatedTask = { ...task, done: !task.done };
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    toast.success(
      updatedTask.done ? t("taskMarkedComplete") : t("taskMarkedIncomplete")
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    toast.success(t("taskDeleted"));
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setEditingTask(null);
    toast.success(t("taskUpdated"));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.done;
    if (filter === "pending") return !task.done;
    return true;
  });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
      }}
      className={`min-h-screen transition-colors duration-500 
        ${
          themeColor === "blue" ? "bg-blue-100"
          : themeColor === "red" ? "bg-red-100"
          : themeColor === "green" ? "bg-green-100"
          : themeColor === "yellow" ? "bg-yellow-100"
          : "bg-blue-100"
        } text-gray-900 p-4 sm:p-8 flex flex-col items-center`}
    >
      <Toaster position="top-right" />

      <motion.h1
        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
        className="text-3xl sm:text-4xl font-bold mb-6"
      >
        {t("title")}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-4 mb-6 w-full max-w-md items-center"
      >
        {/* Filtros */}
        <div className="flex gap-2 flex-wrap justify-center">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded ${filter === "all" ? themeClasses[themeColor].bg + " text-white" : "bg-white border"}`}
          >
            {t("all")}
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 rounded ${filter === "completed" ? themeClasses[themeColor].bg + " text-white" : "bg-white border"}`}
          >
            {t("completed")}
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded ${filter === "pending" ? themeClasses[themeColor].bg + " text-white" : "bg-white border"}`}
          >
            {t("pending")}
          </button>
        </div>

        {/* Idioma y color */}
        <div className="flex gap-2 flex-wrap justify-center">
          <button
            onClick={() => i18n.changeLanguage("es")}
            className="px-3 py-1 border rounded bg-white"
          >
            🇲🇽
          </button>
          <button
            onClick={() => i18n.changeLanguage("en")}
            className="px-3 py-1 border rounded bg-white"
          >
            🇺🇸
          </button>
        </div>

        <div className="flex gap-2">
          {["blue", "red", "green", "yellow"].map((color) => (
            <button
              key={color}
              onClick={() => setThemeColor(color)}
              className={`
                w-6 h-6 rounded-full 
                ${color === "blue" && "bg-blue-500"}
                ${color === "red" && "bg-red-500"}
                ${color === "green" && "bg-green-500"}
                ${color === "yellow" && "bg-yellow-500"}
                ${themeColor === color ? "ring-2 ring-white scale-110" : "opacity-80"}
                transition transform
              `}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
        className="w-full max-w-md px-2 sm:px-0"
      >
        <TaskForm
          onTaskCreated={handleNewTask}
          onTaskUpdated={handleUpdateTask}
          themeColor={themeColor}
          editingTask={editingTask}
          setEditingTask={setEditingTask}
        />
      </motion.div>

      <ul className="space-y-4 w-full max-w-md px-2 sm:px-0">
        {filteredTasks.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 italic mt-4"
          >
            {t("noTasks")} 😌
          </motion.p>
        )}
        <AnimatePresence>
          {filteredTasks.map((task) => (
            <motion.li
              key={task.id}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className={`
                rounded-lg shadow-md hover:shadow-lg transition-all duration-300
                p-4 flex justify-between items-center transform hover:-translate-y-0.5 hover:scale-[1.01]
                ${task.done ? 'bg-green-100 text-green-800' : 'bg-white text-gray-900'}
              `}
            >
              <div className="flex items-center gap-4">
                <button onClick={() => toggleTask(task)} className="hover:scale-110 transition">
                  {task.done ? "✅" : "⏳"}
                </button>
                <span>{task.icon} {task.name}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(task)}
                  className="text-blue-500 hover:text-blue-700 text-xl transition"
                  title={t("edit")}
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 text-xl transition"
                  title={t("delete")}
                >
                  🗑️
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
}

export default App;