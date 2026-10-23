import {useDraftGuard} from '../../../shared/ui/useDraftGuard';
import {FormActions,RequiredFields} from '../../../shared/ui/FormActions';
import {useEffect,useRef,useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useProject} from '../../project/presentation';
import {PageHead} from '../../../shared/ui/Page';
import {Confirmation,Field} from '../../../shared/ui/Forms';
import type {LabUser,UserDraft,UserErrors,UserQuery} from '../domain';
import type {UserResult} from '../application';
import {userText} from '../locales';
import {UserExample} from './UserExample';
import '../../../shared/styles/forms.css';
import '../styles.css';
const blank=():UserDraft=>({name:'',email:'',role:'student',status:'active'});
export function UsersPage(){
  const {users}=useProject(),{i18n,t:translate}=useTranslation(),t=userText(i18n.language);
  const [view,setView]=useState<'list'|'form'|'detail'>('list'),[editing,setEditing]=useState(''),[draft,setDraft]=useState(blank),[errors,setErrors]=useState<UserErrors>({});
  const [query,setQuery]=useState<UserQuery>({sort:'name'}),[deleting,setDeleting]=useState<LabUser|null>(null),[deleted,setDeleted]=useState<LabUser|null>(null),[notice,setNotice]=useState({key:'',sequence:0}),[failed,setFailed]=useState(false);
  const baseline=useRef(JSON.stringify(blank()));
  const guard=useDraftGuard(view==='form'&&JSON.stringify(draft)!==baseline.current);
  const heading=useRef<HTMLHeadingElement>(null),message=useRef<HTMLParagraphElement>(null),initial=useRef(true);
  useEffect(()=>{if(initial.current){initial.current=false;return;}heading.current?.focus();},[view,editing]);
  useEffect(()=>{if(notice.key)message.current?.focus();},[notice]);
  const notify=(key:string,error=false)=>{setFailed(error);setNotice(value=>({key,sequence:value.sequence+1}));};
  const result=(value:UserResult,key:string)=>{if(!value.ok){setErrors(value.errors);notify(value.reason||'required',true);requestAnimationFrame(()=>document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());return false;}setErrors({});notify(key);return true;};
  const open=(user?:LabUser,detail=false)=>{const next=user?{name:user.name,email:user.email,role:user.role,status:user.status}:blank();baseline.current=JSON.stringify(next);setDraft(next);setEditing(user?.id||'');setErrors({});setNotice({key:'',sequence:0});setView(detail?'detail':'form');};
  const leave=()=>{setView('list');setEditing('');setErrors({});setNotice({key:'',sequence:0});};
  const back=()=>guard.request(leave);
  const records=users.list(query),selected=users.get(editing);
  const attrs=(key:keyof UserDraft)=>({id:`user-${key}`,name:key,required:true,'aria-invalid':errors[key]?true:undefined,'aria-describedby':errors[key]?`user-${key}-error`:undefined});
  const save=()=>{if(result(users.save(draft,editing||undefined),'saved')){setView('list');setEditing('');}};
  return <div className="users-page" data-track-area="users"><PageHead eyebrow="HCI Lab" title={t('title')} intro={t('intro')}/>
    {notice.key&&<p ref={message} key={notice.sequence} tabIndex={-1} data-outcome={failed?'error':'success'} aria-label={t('title')} role={failed?'alert':'status'}>{t(notice.key)}</p>}
    <h2 ref={heading} tabIndex={-1}>{view==='form'&&editing?translate('crud.editUser'):t(view==='list'?'list':view==='detail'?'detail':'create')}</h2>
    {view==='list'?<>
      <button className="primary" onClick={()=>open()}>{t('create')}</button>
      {deleted&&<button className="secondary" onClick={()=>{if(result(users.restore(deleted),'restored'))setDeleted(null);}}>{t('undo')}</button>}
      <div className="users-filters">
        <div><label htmlFor="users-filter-search">{t('search')}</label><input id="users-filter-search" type="search" value={query.search||''} onChange={event=>setQuery({...query,search:event.target.value})}/></div>
        <div><label htmlFor="users-filter-role">{t('role')}</label><select id="users-filter-role" value={query.role||''} onChange={event=>setQuery({...query,role:event.target.value as UserQuery['role']})}><option value="">{t('all')}</option>{['student','teacher','evaluator'].map(role=><option key={role} value={role}>{t(role)}</option>)}</select></div>
        <div><label htmlFor="users-filter-status">{t('status')}</label><select id="users-filter-status" value={query.status||''} onChange={event=>setQuery({...query,status:event.target.value as UserQuery['status']})}><option value="">{t('all')}</option>{['active','inactive'].map(status=><option key={status} value={status}>{t(status)}</option>)}</select></div>
        <div><label htmlFor="users-filter-sort">{t('sort')}</label><select id="users-filter-sort" value={query.sort} onChange={event=>setQuery({...query,sort:event.target.value as UserQuery['sort']})}>{['name','email','newest','oldest'].map(sort=><option key={sort} value={sort}>{t(sort)}</option>)}</select></div>
      </div>
      {!records.length?<p>{t(users.list().length?'noResults':'empty')}</p>:<ul className="users-list">{records.map(user=><li className="card" key={user.id}><h3>{user.name}</h3><p>{user.email}</p><p>{t(user.role)} · {t(user.status)}</p><div className="activity-actions"><button className="secondary" onClick={()=>open(user,true)} aria-label={`${t('detail')}: ${user.name}`}>{t('detail')}</button><button className="secondary" onClick={()=>open(user)} aria-label={`${t('edit')}: ${user.name}`}>{t('edit')}</button><button className="secondary" onClick={()=>result(users.setStatus(user.id,user.status==='active'?'inactive':'active'),'changed')} aria-label={`${t(user.status==='active'?'deactivate':'activate')}: ${user.name}`}>{t(user.status==='active'?'deactivate':'activate')}</button><button className="secondary" onClick={()=>setDeleting(user)} aria-label={`${t('delete')}: ${user.name}`}>{t('delete')}</button></div></li>)}</ul>}
      <p>{translate('crud.statusHelp')}</p><UserExample/>
    </>:view==='form'?<form noValidate onSubmit={event=>{event.preventDefault();save();}} className="card users-form"><RequiredFields/>
      <Field name="user-name" label={t('name')} error={errors.name&&t(errors.name)}><input {...attrs('name')} value={draft.name} onChange={event=>setDraft({...draft,name:event.target.value})}/></Field>
      <Field name="user-email" label={t('email')} error={errors.email&&t(errors.email)}><input {...attrs('email')} type="email" value={draft.email} onChange={event=>setDraft({...draft,email:event.target.value})}/></Field>
      <Field name="user-role" label={t('role')} error={errors.role&&t(errors.role)}><select {...attrs('role')} value={draft.role} onChange={event=>setDraft({...draft,role:event.target.value as UserDraft['role']})}>{['student','teacher','evaluator'].map(role=><option key={role} value={role}>{t(role)}</option>)}</select></Field>
      <Field name="user-status" label={t('status')} error={errors.status&&t(errors.status)}><select {...attrs('status')} value={draft.status} onChange={event=>setDraft({...draft,status:event.target.value as UserDraft['status']})}>{['active','inactive'].map(status=><option key={status} value={status}>{t(status)}</option>)}</select></Field>
      <FormActions onCancel={back} onBack={back}/>
    </form>:<section className="card">{selected?<><dl>{(['name','email','role','status','createdAt'] as const).map(key=><div key={key}><dt>{t(key)}</dt><dd>{key==='role'||key==='status'?t(selected[key]):key==='createdAt'?new Date(selected[key]).toLocaleString(i18n.language):selected[key]}</dd></div>)}<div><dt>ID</dt><dd>{selected.id}</dd></div></dl><button className="primary" onClick={()=>open(selected)}>{t('edit')}</button></>:<p>{t('notFound')}</p>}<button className="secondary" onClick={back}>{t('back')}</button></section>}
    {deleting&&<Confirmation title={t('delete')} text={`${deleting.name}: ${t('deleteQuestion')} ${translate('crud.deleteHelp')}`} confirm={t('delete')} onCancel={()=>{setDeleting(null);setNotice({key:'',sequence:0});}} onConfirm={()=>{const value=users.remove(deleting.id);if(result(value,'deleted')&&value.ok){setDeleted(value.user);setDeleting(null);}}}>{failed&&notice.key&&<p role="alert">{t(notice.key)}</p>}</Confirmation>}
    {guard.dialog}
  </div>;
}
