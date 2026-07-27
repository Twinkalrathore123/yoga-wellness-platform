import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../api/client.js'

export default function PoseDetail() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const [pose, setPose] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get(`/api/poses/${id}`)
      .then((res) => setPose(res.data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="max-w-3xl mx-auto px-6 py-16 text-ink/60">Loading…</div>
  if (!pose) return <div className="max-w-3xl mx-auto px-6 py-16">Pose not found.</div>

  const isHindi = i18n.language === 'hi'
  const name = isHindi ? pose.name_hi : pose.name_en
  const benefits = isHindi ? pose.benefits_hi : pose.benefits_en
  const steps = isHindi ? pose.steps_hi : pose.steps_en
  const precautions = isHindi ? pose.precautions_hi : pose.precautions_en

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link to="/poses" className="text-sm text-sage-600 hover:underline">← {t('nav.poses')}</Link>

      <img src={pose.image_url} alt={name} className="w-full h-64 object-cover rounded-2xl mt-4" />

      <h1 className="font-display text-3xl font-semibold text-ink mt-6">{name}</h1>

      <section className="mt-6">
        <h2 className="font-display text-lg text-sage-700 font-semibold">{t('pose.benefits')}</h2>
        <p className="text-ink/80 mt-1">{benefits}</p>
      </section>

      {steps && steps.length > 0 && (
        <section className="mt-6">
          <h2 className="font-display text-lg text-sage-700 font-semibold">{t('pose.steps')}</h2>
          <ol className="list-decimal list-inside mt-1 space-y-1 text-ink/80">
            {steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      {precautions && (
        <section className="mt-6">
          <h2 className="font-display text-lg text-clay-600 font-semibold">{t('pose.precautions')}</h2>
          <p className="text-ink/80 mt-1">{precautions}</p>
        </section>
      )}
    </div>
  )
}
