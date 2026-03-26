import { FolderSimple, Bell } from "@phosphor-icons/react";

const ArchiveOSHeader: React.FC = () => {
  return (
    <header className="border-b border-[#EAEAEA] bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#111111] rounded-lg flex items-center justify-center">
              <FolderSimple size={16} weight="bold" className="text-white" />
            </div>
            <span className="font-light tracking-tight text-xl uppercase font-mono">
              Archive OS
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium uppercase tracking-[0.15em]">
            <a
              href="#"
              className="text-[#787774] hover:text-[#111111] transition-colors"
            >
              Tổng quan
            </a>
            <a
              href="#"
              className="text-[#787774] hover:text-[#111111] transition-colors"
            >
              Sản phẩm
            </a>
            <a
              href="#"
              className="text-[#111111] border-b-2 border-[#111111] py-5"
            >
              Kho lưu trữ
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block font-mono text-[10px] text-[#787774] border border-[#EAEAEA] px-3 py-1.5 rounded-lg">
            SYS_STATUS: <span className="text-[#346638]">ACTIVE</span>
          </div>
          <button className="w-10 h-10 rounded-full border border-[#EAEAEA] flex items-center justify-center hover:bg-[#F7F6F3] transition-colors">
            <Bell size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default ArchiveOSHeader;
