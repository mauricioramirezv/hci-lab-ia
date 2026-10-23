import {useTranslation} from 'react-i18next';
export function FormActions({onCancel,onBack}:{onCancel:()=>void;onBack?:()=>void}){
 const {t}=useTranslation();
 return <div className="activity-actions"><button type="submit" className="primary">{t('crud.save')}</button><button type="button" className="secondary" onClick={onCancel}>{t('crud.cancel')}</button>{onBack&&<button type="button" className="secondary" onClick={onBack}>{t('crud.back')}</button>}</div>;
}
export function RequiredFields(){const {t}=useTranslation();return <p className="activity-help">{t('crud.required')}</p>;}
