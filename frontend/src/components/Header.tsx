import { Upload, Activity, Image } from 'lucide-react';

interface HeaderProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
}

const Header = ({ activeScreen, setActiveScreen }: HeaderProps) => {
  const navItems = [
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'processing', label: 'Processing', icon: Activity },
    { id: 'review', label: 'Review', icon: Image }
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
              R
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">RapidPhotoFlow</h1>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Upload • Process • Review</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
            {navItems.map((nav) => {
              const isActive = activeScreen === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveScreen(nav.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <nav.icon className="h-4 w-4" />
                  <span className="whitespace-nowrap">{nav.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;