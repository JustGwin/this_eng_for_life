import { METHODS, PROBLEMS, TOOLS } from '../data/course.js'

export default function Methods() {
  return (
    <section className="stack">
      <div className="grid">
        {METHODS.map((m) => (
          <article key={m.name} className="dash-card">
            <h3>{m.name}</h3>
            <p>{m.what}</p>
            <p className="example"><strong>ใช้จริง:</strong> {m.example}</p>
          </article>
        ))}
      </div>

      <div className="dash-card">
        <h2>ปัญหาที่พบบ่อยและวิธีแก้</h2>
        <div className="table-scroll">
          <table className="table">
            <thead><tr><th>ปัญหา</th><th>วิธีแก้</th></tr></thead>
            <tbody>{PROBLEMS.map(([p, fix]) => <tr key={p}><td>{p}</td><td>{fix}</td></tr>)}</tbody>
          </table>
        </div>
      </div>

      <div className="dash-card">
        <h2>เครื่องมือฟรีที่ใช้ในคอร์ส</h2>
        <ul className="plain-list">
          {TOOLS.map(([name, url, desc]) => (
            <li key={name}><a href={url} target="_blank" rel="noreferrer">{name} ↗</a><p className="muted small">{desc}</p></li>
          ))}
        </ul>
      </div>
    </section>
  )
}
