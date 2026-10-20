

export function susScore(values:number[]){if(values.length!==10||values.some(v=>!Number.isInteger(v)||v<1||v>5))throw new Error('Invalid SUS responses');return values.reduce((sum,value,i)=>sum+(i%2===0?value-1:5-value),0)*2.5;}

export function validAnswers(values:string[],length:number,max:number,integer=false){return values.length===length&&values.every(v=>v.trim()!==''&&Number.isFinite(Number(v))&&Number(v)>=0&&Number(v)<=max&&(!integer||Number.isInteger(Number(v)))&&(!integer||Number(v)>=1));}
