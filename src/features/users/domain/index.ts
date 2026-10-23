export type UserRole = 'student' | 'teacher' | 'evaluator';
export type UserStatus = 'active' | 'inactive';
export type UserDraft = {name:string; email:string; role:UserRole; status:UserStatus};
export type LabUser = UserDraft & {id:string; createdAt:string};
export type UserErrors = Partial<Record<keyof UserDraft,string>>;
export const emailKey = (value:string) => value.trim().toLowerCase();
export function validateUser(draft:UserDraft, users:readonly LabUser[], editingId?:string):UserErrors {
  const errors:UserErrors = {};
  if (!draft.name.trim()) errors.name='nameRequired';
  if (!draft.email.trim()) errors.email='emailRequired';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) errors.email='emailInvalid';
  else if (users.some(user=>user.id!==editingId && emailKey(user.email)===emailKey(draft.email))) errors.email='emailDuplicate';
  if (!['student','teacher','evaluator'].includes(draft.role)) errors.role='roleInvalid';
  if (!['active','inactive'].includes(draft.status)) errors.status='statusInvalid';
  return errors;
}
export type UserQuery = {search?:string;role?:UserRole|'';status?:UserStatus|'';sort?:'name'|'email'|'newest'|'oldest'};
export function queryUsers(users:readonly LabUser[], query:UserQuery = {}):LabUser[] {
  const search=(query.search||'').trim().toLowerCase();
  return users.filter(user=>(!search || `${user.name} ${user.email}`.toLowerCase().includes(search)) && (!query.role || user.role===query.role) && (!query.status || user.status===query.status)).sort((a,b)=>{
    const order=query.sort==='newest' ? b.createdAt.localeCompare(a.createdAt) : query.sort==='oldest' ? a.createdAt.localeCompare(b.createdAt) : (query.sort==='email'?a.email:a.name).localeCompare(query.sort==='email'?b.email:b.name);
    return order || a.id.localeCompare(b.id);
  });
}
