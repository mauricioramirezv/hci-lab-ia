export type ExperimentDisplayContext={font:number;dark:boolean;contrast:boolean;spacing:boolean;alternativeFont:boolean;motion:boolean;width:number;height:number;pixelRatio:number};
export const experimentDisplayFields=['displayFont','displayDark','displayContrast','displaySpacing','displayFontFamily','displayMotion','displayWidth','displayHeight','displayPixelRatio'] as const;
export function experimentDisplayScores(context:ExperimentDisplayContext):Record<string,number>{
 return {displayFont:context.font,displayDark:Number(context.dark),displayContrast:Number(context.contrast),displaySpacing:Number(context.spacing),displayFontFamily:Number(context.alternativeFont),displayMotion:Number(context.motion),displayWidth:context.width,displayHeight:context.height,displayPixelRatio:context.pixelRatio};
}
/** Undefined: legacy context; null: incomplete/invalid context. Never pool either with a known context. */
export function experimentDisplayKey(scores:Record<string,number>):string|undefined|null {
 if(!experimentDisplayFields.some(key=>Object.hasOwn(scores,key)))return undefined;
 if(experimentDisplayFields.some(key=>!Number.isFinite(scores[key])))return null;
 if(scores.displayFont<100||scores.displayFont>200||['displayDark','displayContrast','displaySpacing','displayFontFamily','displayMotion'].some(key=>![0,1].includes(scores[key]))||['displayWidth','displayHeight','displayPixelRatio'].some(key=>scores[key]<=0))return null;
 return experimentDisplayFields.map(key=>scores[key]).join(',');
}
