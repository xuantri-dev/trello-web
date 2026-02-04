let apiRoot = ''

// console.log('import.meta.env: ', import.meta.env)
// console.log('process.env: ', process.env)

// Môi trường Dev sẽ chạy localhost với port 8017
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}

// Môi trường Product sẽ cần api endpoint chuẩn của cá nhân
if (process.env.BUILD_MODE === 'production') {
  apiRoot = ''
}
// console.log('🚀 ~ apiRoot:', apiRoot)

export const API_ROOT = apiRoot

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEM_PER_PAGE = 12
