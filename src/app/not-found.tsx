import { NotFoundContent } from "@/components/not-found-content"

// Cloudflare Pages 需要 Edge Runtime
export const runtime = "edge"

export default function NotFound() {
  return <NotFoundContent />
}
