import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {validateUser} from '../domain';
import {userText} from '../locales';
export function UserExample({showTitle=true}:{showTitle?:boolean}){
  const {i18n}=useTranslation(),t=userText(i18n.language);
  const [email,setEmail]=useState('ana@'),[checked,setChecked]=useState(false);
  const invalid=!!validateUser({name:'Example',email,role:'student',status:'active'},[]).email;
  return <section className="card" data-track-area="users-example">{showTitle&&<h2>{t('example')}</h2>}<p>{t('exampleHelp')}</p>
    <label htmlFor="user-example-email">{t('email')}</label><input id="user-example-email" value={email} onChange={event=>{setEmail(event.target.value);setChecked(false);}}/>
    <button type="button" className="secondary" onClick={()=>setChecked(true)}>{t('check')}</button>
    <div className="users-comparison" aria-live="polite"><section><h3>{t('good')}</h3>{checked&&<p>{t(invalid?'emailInvalid':'exampleValid')}</p>}</section><section><h3>{t('bad')}</h3>{checked&&<p>{t(invalid?'badFeedback':'exampleValid')}</p>}</section></div>
  </section>;
}
