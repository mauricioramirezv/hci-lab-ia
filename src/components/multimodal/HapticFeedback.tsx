import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
export function HapticFeedback({ onStatus }: { onStatus: (message: string) => void }) {
  const { t } = useTranslation();
  const audio = useRef<AudioContext | null>(null);
  useEffect(() => () => { if (audio.current) void audio.current.close().catch(() => {}); if (typeof navigator.vibrate === 'function') navigator.vibrate(0); }, []);
  const vibrate = () => {
    try { onStatus(t(typeof navigator.vibrate === 'function' && navigator.vibrate([150, 80, 150]) ? 'multimodal.vibrationRequested' : 'multimodal.unsupported')); }
    catch { onStatus(t('multimodal.unsupported')); }
  };
  const sound = async () => {
    try {
      if (typeof AudioContext === 'undefined') { onStatus(t('multimodal.unsupported')); return; }
      audio.current ??= new AudioContext();
      await audio.current.resume();
      const oscillator = audio.current.createOscillator();
      const gain = audio.current.createGain();
      oscillator.connect(gain); gain.connect(audio.current.destination);
      oscillator.frequency.value = 660; gain.gain.value = 0.04;
      gain.gain.exponentialRampToValueAtTime(0.001, audio.current.currentTime + 0.2);
      oscillator.start(); oscillator.stop(audio.current.currentTime + 0.22);
      onStatus(t('multimodal.soundRequested'));
    } catch { onStatus(t('multimodal.soundError')); }
  };
  return <section className="panel mm-panel"><h2>{t('multimodal.channels')}</h2><p className="mm-visual-alert">{t('multimodal.alert')}</p><div className="mm-actions"><button className="secondary" onClick={vibrate}>{t('multimodal.vibrate')}</button><button className="secondary" onClick={() => void sound()}>{t('multimodal.sound')}</button></div></section>;
}
