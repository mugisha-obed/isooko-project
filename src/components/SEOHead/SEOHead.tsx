import { Helmet } from 'react-helmet-async'

interface SEOHeadProps {
  title?: string
  description?: string
  ogImage?: string
  ogUrl?: string
}

export default function SEOHead({ title, description, ogImage, ogUrl }: SEOHeadProps) {
  const siteName = 'Isôoko Community Development'
  const defaultDesc = 'Empowering youth and women in Masoro, Rwanda through literacy, health access, and entrepreneurship.'
  const defaultImg = '/og-image.jpg'

  return (
    <Helmet>
      <title>{title ?? siteName}</title>
      <meta name="description" content={description ?? defaultDesc} />
      <meta property="og:title" content={title ?? siteName} />
      <meta property="og:description" content={description ?? defaultDesc} />
      <meta property="og:image" content={ogImage ?? defaultImg} />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:type" content="website" />
    </Helmet>
  )
}
