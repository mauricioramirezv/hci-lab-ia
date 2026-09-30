import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import type { AccessibilityMode } from '../../domain';

import { visionModes } from './constants';
// Simple linear RGB teaching approximations, not clinical models.
const matrices = {
  protanopia: '0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0',
  deuteranopia: '0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0',
  tritanopia: '0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0',
  achromatopsia: '0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0',
};
export function ColorBlindSimulator({ mode, setMode, good }: { mode: AccessibilityMode; setMode: (mode: AccessibilityMode) => void; good: boolean }) {
  const { t } = useTranslation();
  const id = useId().replace(/:/g, '');
  return <section className="panel mm-panel">
    <h2>{t('multimodal.colorTitle')}</h2>
    <label>{t('multimodal.vision')}<select value={mode} onChange={e => setMode(e.target.value as AccessibilityMode)}>{visionModes.map(v => <option key={v} value={v}>{t(`multimodal.${v}`)}</option>)}</select></label>
    <svg className="mm-filter-defs" aria-hidden="true"><defs>{Object.entries(matrices).map(([key, values]) => <filter id={`${id}-${key}`} key={key} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={values}/></filter>)}</defs></svg>
    <div className="mm-color-sample" data-vision={mode} style={{ filter: mode === 'normal' ? undefined : `url(#${id}-${mode})` }}>
      {(['error', 'success', 'pending'] as const).map((key, i) => <div key={key} className={`mm-signal ${key}`}><span aria-hidden="true">{good ? ['!', '✓', '…'][i] : '●'}</span>{good && <strong>{t(`multimodal.${key}`)}</strong>}</div>)}
    </div>
    <p>{t('multimodal.colorHelp')}</p><p className="fine-print">{t('multimodal.approx')}</p>
    <a href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color" target="_blank" rel="noreferrer">WCAG 1.4.1</a>
  </section>;
}
