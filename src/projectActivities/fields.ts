export function focusErrors(errors:Record<string,string>) {document.getElementById(Object.keys(errors)[0])?.focus();}
export const fieldAttributes=(id:string,errors:Record<string,string>,help=false,required=false)=>({id,'aria-required':required||undefined,'aria-invalid':!!errors[id],'aria-describedby':[help?`${id}-help`:'',errors[id]?`${id}-error`:''].filter(Boolean).join(' ')||undefined});
