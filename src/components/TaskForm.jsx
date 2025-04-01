import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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

function TaskForm({ onTaskCreated, onTaskUpdated, editingTask, themeColor }) {
  const [taskName, setTaskName] = useState("");
  const [icon, setIcon] = useState("📝");
  const [showIcons, setShowIcons] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (editingTask) {
      setTaskName(editingTask.name);
      setIcon(editingTask.icon || "📝");
    } else {
      setTaskName("");
      setIcon("📝");
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const taskData = { name: taskName, icon };
    editingTask
      ? onTaskUpdated({ ...editingTask, ...taskData })
      : onTaskCreated(taskData);

    setTaskName("");
    setIcon("📝");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 mb-6 w-full max-w-md items-center">
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder={t("newTask")}
        className={`flex-grow px-4 py-2 rounded-lg border shadow focus:outline-none transition-all border-gray-300 bg-white text-gray-900 ${themeClasses[themeColor].ring}`}
      />
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowIcons(!showIcons)}
          className="px-3 text-xl"
          title={t("chooseIcon") || "Elegir ícono"}
        >
          {icon}
        </button>
        {showIcons && (
          <div className="absolute z-10 bg-white border border-gray-300 p-4 rounded-lg shadow-lg grid grid-cols-5 gap-3 w-[220px]">
            {["💼", "📚", "🛒", "📝", "🎯", "🚀", "💻", "🧹", "✏️", "🗑️"].map((ic) => (
              <button
                key={ic}
                onClick={() => {
                  setIcon(ic);
                  setShowIcons(false);
                }}
                className="text-2xl hover:scale-110 transition w-10 h-10 flex items-center justify-center"
              >
                {ic}
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        type="submit"
        className={`px-6 py-2 rounded-lg text-white transition ${themeClasses[themeColor].bg} ${themeClasses[themeColor].hover}`}
      >
        {editingTask ? t("update") : t("add")}
      </button>
    </form>
  );
}

export default TaskForm;