import { useState } from "react";
import { useTranslation } from "react-i18next";

function TaskForm({ onTaskCreated }) {
  const [taskName, setTaskName] = useState("");

  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const newTask = {
      name: taskName,
      done: false,
    };

    fetch("http://localhost:8000/api.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then((createdTask) => {
        onTaskCreated(createdTask);
        setTaskName("");
      })
      .catch((err) => console.error("Error al crear tarea:", err));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-4 mb-6 w-full max-w-md"
    >
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder={t("newTask")}
        className="flex-grow px-4 py-2 rounded-lg border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Agregar
      </button>
    </form>
  );
}

export default TaskForm;