import { useTranslation } from 'react-i18next';
export function InfotainmentSimulator({ moving, setMoving, good, onAction }: { moving: boolean; setMoving: (value: boolean) => void; good: boolean; onAction: (action: 'navigate' | 'call' | 'message') => void }) {
  const { t } = useTranslation();
  return <><label className="check-row"><input type="checkbox" checked={moving} onChange={e => setMoving(e.target.checked)}/>{t('multimodal.driving')}</label><div className={`mm-device mm-car ${good ? '' : 'mm-dense'}`}><h3>{t('multimodal.destination')}</h3><div className="mm-actions">{(['navigate','call','message'] as const).map(k => <button disabled={good && moving} key={k} onClick={() => onAction(k)}>{t(`multimodal.${k}`)}</button>)}</div>{!good && <p className="mm-clutter">12 · 45 · 23 · 07 · INFO · MENU · MEDIA</p>}</div><p>{moving && good ? t('multimodal.blocked') : t('multimodal.carHelp')}</p></>;
}
