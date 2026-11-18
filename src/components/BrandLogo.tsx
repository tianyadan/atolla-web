type BrandLogoProps = {
  size?: number
  className?: string
}

/**
 * Atolla 官网品牌标：来自产品仓库 web/public/brand-jellyfish-white.png
 */
export default function BrandLogo({ size = 28, className = '' }: BrandLogoProps) {
  return (
    <img
      className={`brand-logo ${className}`.trim()}
      src="/brand-jellyfish-white.png"
      alt="Atolla"
      width={size}
      height={size}
      decoding="async"
    />
  )
}
