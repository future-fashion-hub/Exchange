interface ImportMetaEnv {readonly VITE_AUTH_USER_ID: string;
  readonly VITE_USERS_PAGE_SIZE: string;
  // другие переменные
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
