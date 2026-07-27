import { useTranslation } from 'react-i18next'

// `pose` is expected to come from the backend with bilingual fields, e.g.:
// { name_en, name_hi, image_url, benefits_en, benefits_hi }
export default function PoseCard({ pose }) {
  const { i18n } = useTranslation()
  const isHindi = i18n.language === 'hi'

  const name = isHindi ? pose.name_hi : pose.name_en
  const benefit = isHindi ? pose.benefits_hi : pose.benefits_en

  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-sage-200 hover:shadow-md transition-shadow">
      <img
        src={pose.image_url}
        alt={name}
        className="w-full h-44 object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="font-display text-lg text-ink">{name}</h3>
        <p className="text-sm text-ink/70 mt-1 line-clamp-2">{benefit}</p>
      </div>
    </div>
  )
}
