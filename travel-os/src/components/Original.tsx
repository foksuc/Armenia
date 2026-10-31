import original from "../data/armenia-original.json";
import { External } from "../App";
export default function Original() {
  return (
    <details className="original">
      <summary>Полный оригинал V1 · все разделы без потери сведений</summary>
      <p>
        Снимок main: {original.snapshotCommit.slice(0, 7)}. Все цены и графики —
        на 24.10.2026. Текст ниже перенесён полностью; оформление заменено.
      </p>
      {original.sections.map((s, i) => (
        <article key={i}>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
          <div className="source-links">
            {s.links.map((l, j) => (
              <External key={j} href={l.url}>
                {l.label}
              </External>
            ))}
          </div>
        </article>
      ))}
      <p>{original.footer}</p>
      <External href="https://github.com/foksuc/Armenia/tree/a96b811bb87d0ec2ed200211215fe02a3f3a2e62">
        Проверить неизменяемый исходник
      </External>
      <a
        href="/original/armenia-v1/index.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        Открыть точную копию V1
      </a>
    </details>
  );
}
