export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-4 md:px-8 mt-16">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-luffy-faint">
        <div className="flex items-center gap-2">
          <span className="text-luffy-red font-display text-lg">LUFFY</span>
          <span>— Anime Streaming</span>
        </div>
        <p>Powered by Jikan API & Consumet API. Not affiliated with any studio.</p>
      </div>
    </footer>
  );
}
