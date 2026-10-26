/* eslint-disable react-refresh/only-export-components */
import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import type {ReactNode} from 'react';
import {HttpError, setCsrfToken} from '../../../shared/http';
import type {IdentityAccount, SignInInput} from '../domain/types';
import {identityClient} from '../infrastructure/client';

export type IdentityState = {
  account:IdentityAccount|null;
  status:'checking'|'authenticated'|'visitor'|'error';
  refresh():Promise<IdentityAccount|null>;
  signIn(input:SignInInput):Promise<void>;
  signOut():Promise<void>;
  error:string;
};
const IdentityContext = createContext<IdentityState|null>(null);
const errorCode = (error:unknown) => error instanceof HttpError ? error.code : 'REQUEST_FAILED';
export function IdentityProvider({children}:{children:ReactNode}) {
  const [account,setAccount] = useState<IdentityAccount|null>(null);
  const [status,setStatus] = useState<IdentityState['status']>('checking');
  const [error,setError] = useState('');
  const generation = useRef(0);
  const refresh = useCallback(async() => {
    const current = ++generation.current;
    setStatus('checking');setError('');
    try {
      const result = await identityClient.me();
      if(current !== generation.current)return null;
      setAccount(result.account);setStatus('authenticated');
      return result.account;
    } catch(failure) {
      if(current === generation.current){setAccount(null);if(failure instanceof HttpError && failure.status === 401){setStatus('visitor');setError('');setCsrfToken('');}else{setStatus('error');setError(errorCode(failure));}}
      return null;
    }
  },[]);
  useEffect(()=>{const requests=generation;void refresh();return()=>{requests.current++;};},[refresh]);
  const signIn = useCallback(async(input:SignInInput) => {
    const current = ++generation.current;
    setStatus('checking');setError('');
    try {
      const result = await identityClient.login(input);
      if(current === generation.current){setAccount(result.account);setStatus('authenticated');}
    } catch(failure) {
      if(current === generation.current){setAccount(null);setStatus('visitor');setError(errorCode(failure));}
      throw failure;
    }
  },[]);
  const signOut = useCallback(async() => {
    const current=++generation.current;setError('');
    try {await identityClient.logout();if(current===generation.current){setAccount(null);setStatus('visitor');}}
    catch(failure){if(current===generation.current)setError(errorCode(failure));throw failure;}
  },[]);
  return <IdentityContext.Provider value={{account,status,refresh,signIn,signOut,error}}>{children}</IdentityContext.Provider>;
}
export function useIdentity(){const state=useContext(IdentityContext);if(!state)throw new Error('useIdentity requires IdentityProvider');return state;}
