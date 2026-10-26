import {ExpandableCard} from '../../../shared/ui/ExpandableCard';
import {Activity, ArrowRight, FileText, Lightbulb, RefreshCw, Users} from 'lucide-react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {isActiveAccount, useIdentity} from '../../identity';
import './community-hub.css';

const sections=[
  {path:'/grupos',title:'community.groupsTitle',description:'community.hubGroupsHelp',icon:Users},
  {path:'/sugerencias',title:'community.suggestionsTitle',description:'community.hubSuggestionsHelp',icon:Lightbulb},
  {path:'/seguimiento',title:'learning.title',description:'community.hubProgressHelp',icon:Activity},
  {path:'/informes',title:'remoteReports.title',description:'community.hubReportsHelp',icon:FileText},
  {path:'/sync',title:'sync.title',description:'community.hubSyncHelp',icon:RefreshCw},
] as const;

export function CommunityHubPage(){
  const {t}=useTranslation();
  const identity=useIdentity();
  const active=isActiveAccount(identity.account);
  return <section className="activity-page community-hub" aria-labelledby="community-hub-title">
    <header className="page-head"><div><p className="eyebrow">{t('community.hubNav')}</p><h1 id="community-hub-title">{t('community.hubTitle')}</h1><p>{t('community.hubIntro')}</p></div></header>
    {!active&&<section className="community-hub-access" aria-label={t('community.hubNav')}>
      <p role={identity.status==='error'?'alert':'status'}>{identity.status==='error'?t('community.hubError'):identity.status==='checking'?t('community.loading'):identity.account?t('community.inactiveAccount'):t('community.hubVisitor')}</p>
      {identity.status==='error'&&<button className="secondary" type="button" onClick={()=>void identity.refresh()}>{t('community.hubRetry')}</button>}
      <div className="community-actions"><Link className="primary" to="/cuenta">{t('community.hubLogin')}</Link><Link className="secondary" to="/cuenta?panel=register">{t('community.hubRegister')}</Link><Link to="/lab">{t('community.hubReturn')}</Link></div>
    </section>}
    <ExpandableCard id="community-options" title={t('community.hubNav')}><nav className="community-hub-grid" aria-label={t('community.hubNav')}>
      {sections.map(({path,title,description,icon:Icon})=><Link className="community-hub-card" to={path} key={path}>
        <Icon aria-hidden="true"/><span><strong>{t(title)}</strong><small>{t(description)}</small></span><ArrowRight aria-hidden="true" className="community-hub-arrow"/>
      </Link>)}
    </nav></ExpandableCard>
  </section>;
}
