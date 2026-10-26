export type PlatformRole = 'participant'|'admin';
export type GlobalRole = 'administrator' | 'participant' | 'teacher' | 'evaluator';
export type AccountStatus = 'pending' | 'active' | 'inactive' | 'locked';
export type IdentityAccount={id:string;email:string;displayName:string;lastName?:string|null;platformRole:PlatformRole;emailVerified:boolean;version:number;status?:AccountStatus;globalRoles?:GlobalRole[];permissions?:string[]};
export type SignInInput = {email:string;password:string};
export const isActiveAccount = (account:IdentityAccount|null) => !!account?.emailVerified && account.status === 'active';
export const canManageAccounts = (account:IdentityAccount|null) => isActiveAccount(account) && !!account?.globalRoles?.includes('administrator') && !!account.permissions?.includes('account:manage');
