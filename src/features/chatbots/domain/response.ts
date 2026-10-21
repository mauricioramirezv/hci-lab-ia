export const rubricDimensions=['clarity','control','tone','transparency'] as const;
export function responseFrame(text:string,wordCount:number,progressive:boolean) {
 const words=text.split(' '),complete=wordCount>=words.length;
 return {text:complete?text:progressive?words.slice(0,wordCount).join(' '):'',complete};
}
