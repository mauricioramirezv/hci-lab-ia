export type DeviceContext = 'desktop' | 'tablet' | 'mobile' | 'watch' | 'car' | 'tv' | 'kiosk' | 'iot';
export type AccessibilityMode = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
export type MultimodalEvidence = {
  id: string; createdAt: string; device: DeviceContext; practice: 'good' | 'bad';
  vision: AccessibilityMode; notes: string; confidence: number; demoStatus: string; channelStatus: string;
};
