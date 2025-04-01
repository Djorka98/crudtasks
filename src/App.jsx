import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const { t, i18n } = useTranslation();

  const fetchTasks = () => {
    fetch("http://crudtasks.fwh.is/api.php")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);   

  const handleNewTask = (task) => {
    setTasks((prev) => [...prev, task]);
    toast.success(t("taskAdded"));
  };

  const toggleTask = (task) => {
    const updatedTask = { ...task, done: !task.done };
  
    fetch("http://localhost:8000/api.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => res.json())
      .then(() => {
        setTasks((prev) =>
          prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
        );
        toast.success(
          updatedTask.done
            ? t("taskMarkedComplete")
            : t("taskMarkedIncomplete")
        );
      })
      .catch((err) => console.error("Error al actualizar:", err));
  };  

  const deleteTask = (taskId) => {
    fetch("http://localhost:8000/api.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: taskId }),
    })
      .then((res) => res.json())
      .then(() => {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
        toast.success(t("taskDeleted"));
      })
      .catch((err) => console.error("Error al eliminar:", err));
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
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } }
      }}
      className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-100 to-blue-300 text-gray-900"} p-4 sm:p-8 flex flex-col items-center`}
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
          <button onClick={() => setFilter("all")} className={`px-3 py-1 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-700 border"}`}>
            {t("all")}
          </button>
          <button onClick={() => setFilter("completed")} className={`px-3 py-1 rounded ${filter === "completed" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-700 border"}`}>
            {t("completed")}
          </button>
          <button onClick={() => setFilter("pending")} className={`px-3 py-1 rounded ${filter === "pending" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-700 border"}`}>
            {t("pending")}
          </button>
        </div>

        {/* Modo e idioma */}
        <div className="flex gap-2 flex-wrap justify-center">
          <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-1 rounded border bg-gray-200 dark:bg-gray-500 dark:border-gray-600">
            {darkMode ? t("light") : t("dark")}
          </button>
          <button onClick={() => i18n.changeLanguage("es")} className="px-3 py-1 border rounded bg-gray-200 dark:bg-gray-500 dark:border-gray-600">
            🇲🇽
          </button>
          <button onClick={() => i18n.changeLanguage("en")} className="px-3 py-1 border rounded bg-gray-200 dark:bg-gray-500 dark:border-gray-600">
            🇺🇸
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
        className="w-full max-w-md px-2 sm:px-0"
      >
        <TaskForm onTaskCreated={handleNewTask} />
      </motion.div>

      <ul className="space-y-4 w-full max-w-md px-2 sm:px-0">
        {filteredTasks.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 dark:text-gray-400 italic mt-4"
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
                ${task.done
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                }
              `}
            >          
              <div className="flex items-center gap-4">
                <button onClick={() => toggleTask(task)} className="hover:scale-110 transition">
                  {task.done ? "✅" : "⏳"}
                </button>
                <span>{task.name}</span>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700 text-xl transition"
                title={t("delete")}
              >
                🗑️
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
}

export default App;