"use client";

import { X } from "lucide-react";
import { useToast } from "./ToastProvider";
import { useEffect, useState } from "react";

function SingleToast({ data, remove }) {
  const { id, message, color, icon: Icon } = data;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, [id]);

  const colors = {
    green: "bg-green-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500"
  };

  return (
    <div
      className={`
        transition-all duration-300
        ${visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-6 opacity-0"
        }
      `}
    >
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden min-w-[320px]">
        <div className="p-4 flex items-center gap-3">

          {Icon && <Icon size={22} />}

          <div className="text-sm font-medium text-slate-700">
            {message}
          </div>

          <button
            onClick={() => {
              setVisible(false);
              setTimeout(() => remove(id), 200);
            }}
            className="ml-auto text-slate-400 hover:text-slate-600"
          >
            <X size={18}/>
          </button>
        </div>
        <div className={`h-1 ${colors[color] || colors.green}`} />
      </div>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts, remove } = useToast();

  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <SingleToast key={toast.id} data={toast} remove={remove} />
      ))}
    </div>
  );
}
