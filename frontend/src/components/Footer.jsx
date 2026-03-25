function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-slate-500">
        <p>
          Created by <span className="font-medium text-slate-700">srihitha</span>
        </p>
        <p>
          Copyright &copy; {year} CareerTrack. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

