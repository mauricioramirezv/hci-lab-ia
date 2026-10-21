/* eslint-disable react-refresh/only-export-components */
import {createContext,useContext,useEffect,useRef,useState} from 'react';
import {useTranslation} from 'react-i18next';
import type {ProjectState} from '../domain/state';
import type {BackupSettings} from '../domain/preferences';
import {uid} from '../domain/state';
import {readProject,commitProject} from '../infrastructure/storage';
import {releaseProjectResources} from '../infrastructure/releaseResources';
import {createProjectServices} from '../infrastructure/projectServices';
import {createManagementOperations} from '../application/management';

type Store=ReturnType<typeof createProjectServices>&ReturnType<typeof createManagementOperations>&{state:ProjectState;epoch:number;storageError:string};
const ProjectContext=createContext<Store|null>(null);
export function ProjectProvider({children}:{children:React.ReactNode}) {
 const [epoch,setEpoch]=useState(0),generation=useRef(0),revision=generation.current,{t}=useTranslation();
 const [initial]=useState(readProject),[state,setState]=useState<ProjectState>(initial.state),currentProject=useRef(state);
 const [errorKey,setErrorKey]=useState(initial.invalid?'manage.storedInvalid':''),storageError=errorKey?t(errorKey):'';
 useEffect(()=>{if(initial.invalid||currentProject.current!==initial.state)return;try{commitProject(initial.state);setErrorKey('');}catch{setErrorKey('manage.storageFailed');}},[initial]);
 const replace=(project:ProjectState,settings?:{preferences:BackupSettings['preferences'];language?:string})=>{
  if(generation.current!==revision)return false;
  try {commitProject(project,settings);}catch{setErrorKey('manage.storageFailed');return false;}
  generation.current++;releaseProjectResources();currentProject.current=project;setState(project);setEpoch(v=>v+1);setErrorKey('');return true;
 };
 const services=createProjectServices({
  read:()=>currentProject.current,isCurrent:()=>generation.current===revision,
  save:project=>{if(initial.invalid&&currentProject.current===initial.state)throw Error('Invalid stored project requires recovery');commitProject(project);currentProject.current=project;setState(project);setErrorKey('');},
  onStorageError:()=>setErrorKey('manage.storageFailed'),
 },uid,()=>new Date());
 const management=createManagementOperations(replace,()=>new Date());
 return <ProjectContext.Provider value={{...services,...management,state,epoch,storageError}}>{children}</ProjectContext.Provider>;
}
export function useProject() {const store=useContext(ProjectContext);if(!store)throw Error('useProject must be used inside ProjectProvider');return store;}
