export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090d16] px-4 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-[0_0_50px_rgba(0,243,255,0.1)] backdrop-blur-md">
        <div className="mb-6 flex items-center justify-center gap-3 text-center">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.5)]">
            <span className="text-slate-950 font-black text-lg">⚡</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Invoice<span className="text-cyan-400">Tracker</span>
          </span>
        </div>
        {children}
      </div>
    </main>
  );
}
