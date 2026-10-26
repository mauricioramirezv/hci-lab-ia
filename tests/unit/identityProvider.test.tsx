import {act,cleanup,render,waitFor} from '@testing-library/react';
import {afterEach,describe,expect,it,vi} from 'vitest';
import {IdentityProvider,useIdentity} from '../../src/features/identity';
import type {IdentityAccount,IdentityState} from '../../src/features/identity';
import {canManageAccounts,isActiveAccount} from '../../src/features/identity/domain';
import {identityClient} from '../../src/features/identity/infrastructure/client';
import {HttpError} from '../../src/shared/http';

const account:IdentityAccount={id:'fixture',email:'synthetic@example.invalid',displayName:'Synthetic',platformRole:'participant',emailVerified:true,status:'active',globalRoles:['participant','teacher'],permissions:[],version:1};
let identity:IdentityState;
function Probe(){identity=useIdentity();return <span>{identity.status}</span>;}
afterEach(()=>{cleanup();vi.restoreAllMocks();});
describe('shared identity state',()=>{
  it('checks once with a read and preserves visitor status without any automatic write',async()=>{
    const me=vi.spyOn(identityClient,'me').mockRejectedValue(new HttpError('UNAUTHENTICATED',401));const login=vi.spyOn(identityClient,'login'),logout=vi.spyOn(identityClient,'logout');
    render(<IdentityProvider><Probe/></IdentityProvider>);await waitFor(()=>expect(identity.status).toBe('visitor'));expect(identity.account).toBeNull();expect(identity.error).toBe('');expect(me).toHaveBeenCalledOnce();expect(login).not.toHaveBeenCalled();expect(logout).not.toHaveBeenCalled();
  });
  it('shares a successful explicit sign-in and sign-out without storing access tokens',async()=>{
    vi.spyOn(identityClient,'me').mockRejectedValue(new HttpError('UNAUTHENTICATED',401));vi.spyOn(identityClient,'login').mockResolvedValue({account,csrfToken:'fixture-csrf'});vi.spyOn(identityClient,'logout').mockResolvedValue();const storage=vi.spyOn(Storage.prototype,'setItem');
    render(<IdentityProvider><Probe/></IdentityProvider>);await waitFor(()=>expect(identity.status).toBe('visitor'));
    await act(async()=>{await identity.signIn({email:account.email,password:'synthetic-password'});});expect(identity.account).toEqual(account);expect(identity.status).toBe('authenticated');expect(canManageAccounts(identity.account)).toBe(false);expect(isActiveAccount(identity.account)).toBe(true);
    await act(async()=>{await identity.signOut();});expect(identity.account).toBeNull();expect(identity.status).toBe('visitor');expect(storage).not.toHaveBeenCalled();
  });
  it('distinguishes service failure from a visitor and allows an explicit refresh',async()=>{
    vi.spyOn(identityClient,'me').mockRejectedValueOnce(new HttpError('NETWORK_ERROR')).mockResolvedValueOnce({account,csrfToken:'fixture'});
    render(<IdentityProvider><Probe/></IdentityProvider>);await waitFor(()=>expect(identity.status).toBe('error'));expect(identity.error).toBe('NETWORK_ERROR');
    await act(async()=>{await identity.refresh();});expect(identity.account).toEqual(account);expect(identity.status).toBe('authenticated');expect(identity.error).toBe('');
  });
  it('does not let a stale anonymous check replace a new signed-in session',async()=>{
    let rejectCheck!:(error:unknown)=>void;vi.spyOn(identityClient,'me').mockImplementation(()=>new Promise((_resolve,reject)=>{rejectCheck=reject;}));vi.spyOn(identityClient,'login').mockResolvedValue({account,csrfToken:'fixture'});
    render(<IdentityProvider><Probe/></IdentityProvider>);await act(async()=>{await identity.signIn({email:account.email,password:'synthetic-password'});});await act(async()=>{rejectCheck(new HttpError('UNAUTHENTICATED',401));});expect(identity.status).toBe('authenticated');expect(identity.account).toEqual(account);
  });
  it('does not treat teacher or a group responsibility as global administration',()=>{
    expect(canManageAccounts(account)).toBe(false);expect(canManageAccounts({...account,platformRole:'admin'})).toBe(false);expect(canManageAccounts({...account,globalRoles:['administrator'],permissions:['account:manage']})).toBe(true);expect(isActiveAccount({...account,status:'inactive'})).toBe(false);
    expect(isActiveAccount({...account,status:undefined})).toBe(false);expect(canManageAccounts({...account,platformRole:'admin',globalRoles:undefined,permissions:undefined})).toBe(false);
  });
});
