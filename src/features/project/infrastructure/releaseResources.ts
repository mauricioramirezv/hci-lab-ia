import { shutdownGazer, getGazer } from '../../tracking/infrastructure';
export function releaseProjectResources() {
 try {shutdownGazer();void getGazer()?.clearData().catch(()=>{});}catch {/* Component cleanup also releases camera. */}
 try {window.speechSynthesis?.cancel();navigator.vibrate?.(0);}catch {/* Optional browser APIs. */}
}
