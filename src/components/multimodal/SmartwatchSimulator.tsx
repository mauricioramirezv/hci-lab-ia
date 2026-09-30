import { useTranslation } from 'react-i18next';
export function SmartwatchSimulator({ good, onAction }: { good: boolean; onAction: (action: 'confirm' | 'cancel') => void }) {
  const { t } = useTranslation();
  return <div className={`mm-device mm-watch ${good ? '' : 'mm-dense'}`}><span className="mm-clock">10:30</span><p>{t('multimodal.appointment')}</p>{!good && <p className="mm-clutter">UX · 12 · 08 · 45 · 07 · INFO · 23 · 61</p>}<div className="mm-actions"><button onClick={() => onAction('confirm')}>{good ? t('multimodal.confirm') : 'OK'}</button><button className="secondary" onClick={() => onAction('cancel')}>{good ? t('multimodal.cancel') : 'X'}</button></div></div>;
}
