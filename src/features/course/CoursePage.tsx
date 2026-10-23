import {useInterfaceText} from '../../shared/ui/useInterfaceText';
import { course } from './content';
import { PageHead, StatusPill } from '../../shared/ui/Page';

export function CoursePage() {
  const tx=useInterfaceText();
  return <><PageHead eyebrow={tx("8 CLASSES")} title={tx("Evolución del curso")} intro={tx("Cada taller agrega evidencia al mismo sistema; las entregas consolidan, corrigen y justifican lo construido.")}/><div className="timeline">{course.map(([number, title, description, evidence]) => <article key={number}><span>{number}</span><div><div className="card-top"><h2>{tx(title)}</h2><StatusPill>{tx(evidence)}</StatusPill></div><p>{tx(description)}</p></div></article>)}</div><section className="panel traceability"><h2 id="course-traceability">{tx("Trazabilidad conceptual")}</h2><div className="table-wrap" tabIndex={0} role="region" aria-labelledby="course-traceability"><table><thead><tr><th>{tx("Artefacto")}</th><th>{tx("Decisión")}</th><th>{tx("Evidencia posterior")}</th></tr></thead><tbody><tr><td>{tx("Persona + empatía")}</td><td>{tx("Prioridad y contexto")}</td><td>{tx("Escenario y criterio de éxito")}</td></tr><tr><td>{tx("Flujo multiformato")}</td><td>{tx("Jerarquía por dispositivo")}</td><td>{tx("Prototipo y prueba E2E")}</td></tr><tr><td>{tx("Hallazgo heurístico")}</td><td>{tx("Corrección priorizada")}</td><td>{tx("Versión corregida y nueva prueba")}</td></tr><tr><td>{tx("Sesión de usuario")}</td><td>{tx("Valida o refuta hipótesis")}</td><td>{tx("Métricas y reflexión final")}</td></tr></tbody></table></div></section></>;
}
