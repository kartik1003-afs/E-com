import React from 'react';

const Footer = () => {
  return (
    <footer className="backdrop-blur-2xl bg-white/10 border-t border-cyan-400/30 shadow-2xl neon-glow-glass py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="text-center text-white text-lg font-bold bg-gradient-to-r from-blue-700 to-pink-400 drop-shadow-lg font-mono">Cartify</p>
          <p className="text-xs text-cyan-200">&copy; 2024 All rights reserved.</p>
          <p className="text-xs text-cyan-300 mt-1 opacity-80">Built with <span className="animate-pulse text-pink-400">❤️</span> by <span className="font-bold">Kartik</span></p>
        </div>
        <div className="flex items-center gap-6 mt-2 md:mt-0">
          <a href="#" className="hover:text-blue-100 transition-colors neon-icon-glow" aria-label="Twitter"><svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.237-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/></svg></a>
          <a href="#" className="hover:text-blue-100 transition-colors neon-icon-glow" aria-label="Instagram"><svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.497 5.783 2.225 7.149 2.163 8.415 2.105 8.795 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.771.128 4.635.388 3.678 1.345 2.721 2.302 2.461 3.438 2.403 4.719.012 8.332 0 8.741 0 12c0 3.259.012 3.668.07 4.948.058 1.281.318 2.417 1.275 3.374.957.957 2.093 1.217 3.374 1.275C8.332 23.988 8.741 24 12 24s3.668-.012 4.948-.07c1.281-.058 2.417-.318 3.374-1.275.957-.957 1.217-2.093 1.275-3.374.058-1.28.07-1.689.07-4.948s-.012-3.668-.07-4.948c-.058-1.281-.318-2.417-1.275-3.374-.957-.957-2.093-1.217-3.374-1.275C15.668.012 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg></a>
          <a href="#" className="hover:text-blue-100 transition-colors neon-icon-glow" aria-label="Facebook"><svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 