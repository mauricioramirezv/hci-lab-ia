import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
type Recognition = { lang: string; continuous: boolean; interimResults: boolean; start: () => void; abort: () => void; onresult: ((e: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null; onerror: (() => void) | null; onend: (() => void) | null };
type SpeechWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
export function VoiceInteraction({ status, onCommand, onStatus }: { status: string; onCommand: (command: string) => void; onStatus: (message: string) => void }) {
  const { t, i18n } = useTranslation();
  const [command, setCommand] = useState('');
  const [listening, setListening] = useState(false);
  const recognition = useRef<Recognition | null>(null);
  useEffect(() => () => { if (recognition.current) { recognition.current.onend = null; recognition.current.onresult = null; recognition.current.onerror = null; recognition.current.abort(); } if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);
  const speak = () => {
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') { onStatus(t('multimodal.unsupported')); return; }
    try {
      window.speechSynthesis.cancel(); const speech = new SpeechSynthesisUtterance(status); speech.lang = i18n.language;
      speech.onerror = () => onStatus(t('multimodal.speechError'));
      window.speechSynthesis.speak(speech); onStatus(t('multimodal.speechReady'));
    } catch { onStatus(t('multimodal.speechError')); }
  };
  const listen = () => {
    const ctor = (window as SpeechWindow).SpeechRecognition || (window as SpeechWindow).webkitSpeechRecognition;
    if (!ctor) { onStatus(t('multimodal.unsupported')); return; }
    try {
      const r = new ctor(); recognition.current = r; r.lang = i18n.language; r.continuous = false; r.interimResults = false;
      r.onresult = e => { const text = e.results[0][0].transcript; setCommand(text); onCommand(text); };
      r.onerror = () => { setListening(false); onStatus(t('multimodal.micError')); };
      r.onend = () => setListening(false);
      r.start(); setListening(true); onStatus(t('multimodal.listening'));
    } catch { setListening(false); onStatus(t('multimodal.micError')); }
  };
  return <section className="panel mm-panel"><h2>{t('multimodal.voice')}</h2><form onSubmit={e => { e.preventDefault(); onCommand(command); }}><label>{t('multimodal.command')}<input value={command} onChange={e => setCommand(e.target.value)}/></label><button type="submit">{t('multimodal.run')}</button></form><div className="mm-actions"><button className="secondary" onClick={speak}>{t('multimodal.listen')}</button><button className="secondary" disabled={listening} onClick={listen}>{t('multimodal.microphone')}</button><button className="secondary" onClick={() => { recognition.current?.abort(); setListening(false); if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }}>{t('multimodal.stop')}</button></div><p className="fine-print">{t('multimodal.privacy')}</p></section>;
}
