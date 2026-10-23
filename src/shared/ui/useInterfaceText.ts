import {useTranslation} from 'react-i18next';

/** Static source-text keys, used only for interface copy, never project data. */
export function useInterfaceText(){
 const {t}=useTranslation('interface');
 return (key:string,values:Record<string,string|number>={})=>t(key,{...values,keySeparator:false,nsSeparator:false});
}
