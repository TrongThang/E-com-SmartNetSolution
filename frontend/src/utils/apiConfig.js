export const API_CONFIG = {
    BASE_URL: process.env.UMI_APP_API_URL ?? 'http://localhost:8080/api/v1',
    GHN_BASE_URL:
      process.env.UMI_APP_GHN_API_URL ?? 'https://online-gateway.ghn.vn/shiip/public-api/master-data',
    GHN_TOKEN: process.env.UMI_APP_GHN_TOKEN ?? '5f25e7e8-0ab9-11f0-9508-868a25fe0fcd',
  };
  