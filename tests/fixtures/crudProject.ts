import {representativeProject} from './representativeProject';
export function crudProject(){
 const project=representativeProject();
 project.personas[0]={...project.personas[0],basis:'assumed',assumptions:'RAW assumption',emotionSource:'declared'};
 project.scenarios[0]={...project.scenarios[0],personaId:project.personas[0].id};
 project.appointments[0]={...project.appointments[0],date:'2099-10-15'};
 project.findings[0]={...project.findings[0],task:'RAW task',heuristicId:'h1'};
 project.users=[{id:'user-ana',createdAt:'2026-10-09T15:00:00.000Z',name:'RAW user',email:'raw@example.test',role:'student',status:'active'}];
 return project;
}
