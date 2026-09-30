import { useTranslation } from 'react-i18next';
import type { DeviceContext } from '../../domain';
import { deviceIds } from './constants';
const contexts: Record<string, string[][]> = {
  'es': [
    ['Trabajo sentado', 'Sostenida', 'Teclado / ratón', 'Postura y atajos', 'Fatiga', 'Teclado y zoom'],
    ['Uso en mano', 'Intermitente', 'Táctil / teclado', 'Peso y alcance', 'Precisión táctil', 'Orientación y objetivos amplios'],
    ['Movilidad', 'Interrumpida', 'Táctil / voz', 'Una mano', 'Distracción', 'Texto escalable y foco'],
    ['Consulta breve', 'De un vistazo', 'Táctil / voz', 'Pantalla mínima', 'Omisión de alertas', 'Texto, voz y vibración opcional'],
    ['Conducción simulada', 'Primaria en la vía', 'Voz preferente', 'Distancia de alcance', 'Distracción crítica', 'Bloquear edición en movimiento'],
    ['Sala de estar', 'A distancia', 'Control / teclado', 'Distancia de lectura', 'Foco perdido', 'Foco visible y texto grande'],
    ['Servicio público', 'Limitada por fila', 'Táctil / teclado', 'Altura y alcance', 'Privacidad compartida', 'Alcance y salida clara'],
    ['Hogar conectado', 'Variable', 'Voz / controles', 'Ubicación física', 'Estado incierto', 'Estado textual y control alternativo'],
  ],
  'en': [
    ['Seated work','Sustained','Keyboard / mouse','Posture and shortcuts','Fatigue','Keyboard and zoom'],
    ['Handheld use','Intermittent','Touch / keyboard','Weight and reach','Touch precision','Orientation and large targets'],
    ['On the move','Interrupted','Touch / voice','One hand','Distraction','Scalable text and focus'],
    ['Quick check','At a glance','Touch / voice','Tiny display','Missed alerts','Text, voice and optional vibration'],
    ['Simulated driving','Road first','Voice preferred','Reach distance','Critical distraction','Block editing while moving'],
    ['Living room','At a distance','Remote / keyboard','Reading distance','Lost focus','Visible focus and large text'],
    ['Public service','Queue limited','Touch / keyboard','Height and reach','Shared privacy','Reach and clear exit'],
    ['Connected home','Variable','Voice / controls','Physical location','Uncertain state','Text state and alternative control'],
  ],
  'pt': [
    ['Trabalho sentado','Sustentada','Teclado / mouse','Postura e atalhos','Fadiga','Teclado e zoom'],
    ['Uso na mão','Intermitente','Toque / teclado','Peso e alcance','Precisão','Orientação e alvos amplos'],
    ['Mobilidade','Interrompida','Toque / voz','Uma mão','Distração','Texto escalável e foco'],
    ['Consulta breve','De relance','Toque / voz','Tela mínima','Alertas perdidos','Texto, voz e vibração opcional'],
    ['Condução simulada','Prioridade na via','Voz preferida','Distância de alcance','Distração crítica','Bloquear edição em movimento'],
    ['Sala de estar','À distância','Controle / teclado','Distância de leitura','Foco perdido','Foco visível e texto grande'],
    ['Serviço público','Limitada pela fila','Toque / teclado','Altura e alcance','Privacidade compartilhada','Alcance e saída clara'],
    ['Casa conectada','Variável','Voz / controles','Localização física','Estado incerto','Estado textual e controle alternativo'],
  ],
  'fr': [
    ['Travail assis','Soutenue','Clavier / souris','Posture et raccourcis','Fatigue','Clavier et zoom'],
    ['Utilisation en main','Intermittente','Tactile / clavier','Poids et portée','Précision tactile','Orientation et grandes cibles'],
    ['Mobilité','Interrompue','Tactile / voix','Une main','Distraction','Texte adaptable et focus'],
    ['Consultation brève','En un coup d’œil','Tactile / voix','Écran minuscule','Alertes manquées','Texte, voix et vibration facultative'],
    ['Conduite simulée','Priorité à la route','Voix privilégiée','Distance de portée','Distraction critique','Bloquer la modification en mouvement'],
    ['Salon','À distance','Télécommande / clavier','Distance de lecture','Focus perdu','Focus visible et grand texte'],
    ['Service public','Limitée par la file','Tactile / clavier','Hauteur et portée','Vie privée partagée','Portée et sortie claire'],
    ['Maison connectée','Variable','Voix / commandes','Emplacement physique','État incertain','État textuel et commande alternative'],
  ],
};
export function DeviceComparison({ selected }: { selected: DeviceContext }) {
  const { t, i18n } = useTranslation();
  const rows = contexts[i18n.language.slice(0, 2)] || contexts.es;
  return <section className="panel mm-panel"><h2>{t('multimodal.devices')}</h2><div className="mm-table-scroll" tabIndex={0} role="region" aria-label={t('multimodal.devices')}><table><caption>{t('multimodal.demo')}</caption><thead><tr>{['device','context','attention','input','ergonomics','risk','a11y'].map(k => <th scope="col" key={k}>{t(`multimodal.${k}`)}</th>)}</tr></thead><tbody>{deviceIds.map((id, index) => <tr key={id} data-selected={selected === id}><th scope="row">{t(`multimodal.${id}`)}</th>{rows[index].map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div></section>;
}
