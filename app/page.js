
export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="pill">Minimal exam archive</span>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-slate-900">
            All your past semester papers in one clean, focused space.
          </h1>
          <p className="text-lg text-slate-600">
            StudyVault keeps previous exam papers organized with quick filters,
            so you spend time practicing, not searching.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="/papers" className="button button-primary">
              Explore papers
            </a>
            <a href="/auth" className="button button-ghost">
              Login / Signup
            </a>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center font-semibold">
                8k
              </span>
              Verified papers
            </div>
            <div className="flex items-center gap-2">
              <span className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center font-semibold">
                2m
              </span>
              Study sessions logged
            </div>
          </div>
        </div>
        <div className="card p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-500">Quick peek</p>
              <h3 className="text-xl font-semibold text-slate-900">Recent papers</h3>
            </div>
            <span className="pill">Green, minimal UI</span>
          </div>
          <div className="space-y-4">
            {[
              { title: "Linear Algebra", semester: "Semester 2", time: "2024 - Mid" },
              { title: "Data Structures", semester: "Semester 3", time: "2024 - End" },
              { title: "Operating Systems", semester: "Semester 4", time: "2023 - End" },
            ].map((paper) => (
              <div
                key={paper.title}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-200 hover:shadow-sm transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{paper.title}</p>
                    <p className="text-sm text-slate-500">{paper.semester}</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {paper.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Single hub",
            desc: "Browse every paper without digging through folders or drives.",
          },
          {
            title: "Smart filters",
            desc: "Filter by semester, subject, or year to jump straight to what you need.",
          },
          {
            title: "Study friendly",
            desc: "Minimal layout, light theme, and green accents that keep focus on content.",
          },
        ].map((item) => (
          <div key={item.title} className="card p-6 space-y-2">
            <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
            <p className="text-slate-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </section>

      <section className="card p-10 text-center space-y-4">
        <h2 className="text-3xl font-semibold text-slate-900">Ready to revise smarter?</h2>
        <p className="text-slate-600 text-lg">
          Create your account and start browsing a clean library of past papers.
        </p>
        <div className="flex justify-center gap-3">
          <a href="/auth" className="button button-primary">
            Join StudyVault
          </a>
          <a href="/papers" className="button button-ghost">
            View collection
          </a>
        </div>
      </section>
    </div>
  );
}
