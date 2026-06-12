// a futuro instalar ZOD para validar variables

const LOCAL_API_URL = "http://localhost:3001"

export const API_URL = process.env.NODE_ENV === "development" ? LOCAL_API_URL : process.env.NEXT_PUBLIC_API_URL || LOCAL_API_URL
export const CDN_PRESET = process.env.NEXT_PUBLIC_CLOUD_UPLOAD_PRESET
export const CDN_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME
export const CDN_KEY = process.env.CLOUD_API_KEY
export const CDN_SECRET = process.env.CLOUD_API_SECRET

// WooCommerce
export const WOO_URL = process.env.URL_WOO
export const WOO_KEY = process.env.CLIENT_WOO
export const WOO_SECRET = process.env.SECRET_WOO
