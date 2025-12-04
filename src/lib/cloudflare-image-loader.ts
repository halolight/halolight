/**
 * Cloudflare Images 自定义 loader
 *
 * 使用方法：
 * 1. 开通 Cloudflare Images 服务
 * 2. 设置环境变量 NEXT_PUBLIC_CF_IMAGES_ACCOUNT_HASH
 * 3. 上传图片到 Cloudflare Images 或使用 URL fetch 功能
 *
 * 文档: https://developers.cloudflare.com/images/transform-images/
 */

interface ImageLoaderParams {
  src: string
  width: number
  quality?: number
}

export default function cloudflareImageLoader({
  src,
  width,
  quality = 75,
}: ImageLoaderParams): string {
  const accountHash = process.env.NEXT_PUBLIC_CF_IMAGES_ACCOUNT_HASH

  // 如果没有配置 account hash，返回原始 URL
  if (!accountHash) {
    return src
  }

  // 构建转换选项
  const options = [
    `width=${width}`,
    `quality=${quality}`,
    "format=auto", // 自动选择最佳格式 (WebP/AVIF)
    "fit=scale-down", // 保持比例缩小
  ].join(",")

  // 处理外部 URL（通过 Cloudflare Images fetch 功能代理）
  // 需要在 Cloudflare Dashboard > Images > Sourcing 中配置允许的源站
  if (src.startsWith("http://") || src.startsWith("https://")) {
    // Cloudflare Images URL 格式: /cdn-cgi/image/{options}/{source_url}
    // 或使用 Image Delivery: https://imagedelivery.net/{account_hash}/fetch/{options}/{url}
    return `https://imagedelivery.net/${accountHash}/fetch/${options}/${src}`
  }

  // 处理已上传到 Cloudflare Images 的图片
  // src 应该是 image ID（上传时返回的 ID）
  const imageId = src.replace(/^\/+/, "")

  // 使用 flexible variants（需要在 Dashboard 中启用）
  // 格式: https://imagedelivery.net/{account_hash}/{image_id}/{variant_or_options}
  return `https://imagedelivery.net/${accountHash}/${imageId}/${options}`
}

/**
 * 如果你的 Cloudflare Images 配置了命名 variants，可以使用这个函数
 * 需要在 Cloudflare Dashboard > Images > Variants 中创建对应的 variants
 */
export function cloudflareImageLoaderWithVariants({
  src,
  width,
}: ImageLoaderParams): string {
  const accountHash = process.env.NEXT_PUBLIC_CF_IMAGES_ACCOUNT_HASH

  if (!accountHash) {
    return src
  }

  const imageId = src.replace(/^\/+/, "")
  const variant = getVariantForWidth(width)

  return `https://imagedelivery.net/${accountHash}/${imageId}/${variant}`
}

function getVariantForWidth(width: number): string {
  // 这些 variant 名称需要在 Cloudflare Dashboard 中预先创建
  if (width <= 320) return "thumbnail" // 320x320
  if (width <= 640) return "small" // 640x640
  if (width <= 1024) return "medium" // 1024x1024
  if (width <= 1920) return "large" // 1920x1920
  return "public" // 原图
}
