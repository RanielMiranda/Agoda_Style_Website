"use client";

import { X } from "lucide-react";
import { useToast } from "./ToastProvider";
import { useEffect, useState } from "react";

function SingleToast({ data, remove }) {
  const { id, message, color, icon: Icon, duration = 4000, persistent = false } = data;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!persistent) {
      const frame = requestAnimationFrame(() => setProgress(0));
      return () => cancelAnimationFrame(frame);
    }
    return undefined;
  }, [id, persistent]);

  useEffect(() => {
    if (persistent) return undefined;
    const timer = setTimeout(() => {
      remove(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, id, persistent, remove]);

  const colors = {
    green: "bg-green-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500"
  };

  return (
    <div className="translate-y-0 opacity-100">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden min-w-[320px]">
        <div className="p-4 flex items-center gap-3">

          {Icon && <Icon size={22} />}

          <div className="text-sm font-medium text-slate-700">
            {message}
          </div>

          <button
            onClick={() => {
              remove(id);
            }}
            className="ml-auto text-slate-400 hover:text-slate-600"
          >
            <X size={18}/>
          </button>
        </div>
        <div
          className={`h-1 ${colors[color] || colors.green}`}
          style={
            persistent
              ? undefined
              : {
                  width: `${progress}%`,
                  transitionProperty: "width",
                  transitionTimingFunction: "linear",
                  transitionDuration: `${duration}ms`,
                }
          }
        />
      </div>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts, remove } = useToast();
  const normalToasts = (toasts || []).filter((entry) => !entry.persistent);

  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 max-w-sm">
      {normalToasts.map((toast) => (
        <SingleToast key={toast.id} data={toast} remove={remove} />
      ))}
    </div>
  );
}
