/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AI_PROXY_URL?: string;
  readonly VITE_IDENTITY_API_URL?: string;
  readonly VITE_LEARNING_API_URL?: string;
  readonly VITE_COMMUNITY_API_URL?: string;
  readonly VITE_EVIDENCE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
