import {Component} from 'react';
import type {ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
class Boundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}>{
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?this.props.fallback:this.props.children;}
}
export function RouteLoading(){const {t}=useTranslation();return <p role="status" aria-busy="true" className="route-loading">{t('closure.loading')}</p>;}
export function RouteBoundary({children}:{children:ReactNode}){
 const {t}=useTranslation();return <Boundary fallback={<section className="route-error"><h1>{t('closure.loadError')}</h1><p role="alert">{t('closure.loadHelp')}</p><button className="secondary" onClick={()=>window.location.reload()}>{t('closure.reload')}</button></section>}>{children}</Boundary>;
}
