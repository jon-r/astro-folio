/// <reference types="astro/client" />

interface ImportMetaEnv {
  PUBLIC_GTM_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
