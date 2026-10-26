import {useState} from 'react';
import type {ReactNode} from 'react';
import {DisclosureCard} from './DisclosureCard';

export function ExpandableCard({id,title,defaultOpen=true,className,children,headingLevel}:{id:string;title:ReactNode;defaultOpen?:boolean;className?:string;children:ReactNode;headingLevel?:2|3}) {
  const [open,setOpen]=useState(defaultOpen);
  return <DisclosureCard id={id} title={title} open={open} onToggle={()=>setOpen(value=>!value)} className={className} headingLevel={headingLevel}>{children}</DisclosureCard>;
}
