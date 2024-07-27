/// <reference types="astro/client" />

interface ImportMetaEnv {
  PUBLIC_GTM_ID: string;
  PUBLIC_STATIC_ASSET_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
