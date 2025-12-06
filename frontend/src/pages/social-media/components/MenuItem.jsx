export function MenuItem({ icon, text, active, badge }) {
  return (
    <div
      className={`flex items-center gap-4 px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-900 transition ${
        active ? "font-bold" : ""
      }`}
    >
      <div className="relative">
        {icon}
        {badge && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
      <span className={active ? "font-semibold" : ""}>{text}</span>
    </div>
  );
}
