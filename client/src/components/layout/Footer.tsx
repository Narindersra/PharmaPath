import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 w-full bg-slate-charcoal text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-slate-800 gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="PharmaPath"
              className="w-8 h-8 rounded-lg object-contain bg-white/10 p-0.5"
            />
            <span className="font-display text-[16px] tracking-tight text-white font-bold">
              PharmaPath
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-emerald-400 font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300">Live Network 99.98% Active</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[11px] text-white uppercase tracking-wider font-semibold">
              Platform
            </span>
            <a className="text-[13px] text-slate-400 hover:text-white transition-colors" href="#">
              Architecture
            </a>
            <a className="text-[13px] text-slate-400 hover:text-white transition-colors" href="#">
              Live Radar
            </a>
            <a className="text-[13px] text-slate-400 hover:text-white transition-colors" href="#">
              Distribution Nodes
            </a>
            <a className="text-[13px] text-slate-400 hover:text-white transition-colors" href="#">
              Security &amp; Trust
            </a>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[11px] text-white uppercase tracking-wider font-semibold">
              Solutions
            </span>
            <a className="text-[13px] text-slate-400 hover:text-white transition-colors" href="#">
              Enterprise BioPharma
            </a>
            <a className="text-[13px] text-slate-400 hover:text-white transition-colors" href="#">
              Clinical Operations
            </a>
            <a className="text-[13px] text-slate-400 hover:text-white transition-colors" href="#">
              Inventory Telemetry
            </a>
            <a className="text-[13px] text-slate-400 hover:text-white transition-colors" href="#">
              Supply Compliance
            </a>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[11px] text-white uppercase tracking-wider font-semibold">
              Resources
            </span>
            <a className="text-[13px] text-slate-400 hover:text-white transition-colors" href="#">
              Documentation
            </a>
            <a className="text-[13px] text-slate-400 hover:text-white transition-colors" href="#">
              API Reference
            </a>
            <a className="text-[13px] text-slate-400 hover:text-white transition-colors" href="#">
              System Status
            </a>
            <a className="text-[13px] text-slate-400 hover:text-white transition-colors" href="#">
              Clinical Whitepapers
            </a>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[11px] text-white uppercase tracking-wider font-semibold">
              Company
            </span>
            <a className="text-[13px] text-slate-400 hover:text-white transition-colors" href="#">
              About Us
            </a>
            <a className="text-[13px] text-slate-400 hover:text-white transition-colors" href="#">
              Careers
            </a>
            <a className="text-[13px] text-slate-400 hover:text-white transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="text-[13px] text-slate-400 hover:text-white transition-colors" href="#">
              Terms of Service
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] font-mono text-slate-500">
          <span>© 2025 PharmaPath Systems Inc. Precision Clinical Logistics.</span>
          <span>Engineered for global biopharma operations.</span>
        </div>
      </div>
    </footer>
  );
};
