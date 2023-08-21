export const getUrl = (protocol: string, host: string, path: string): string =>
  `${protocol}//${host}${path}`;
