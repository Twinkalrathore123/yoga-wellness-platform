import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-sage-700 text-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display text-xl font-semibold">Yoga & Wellness</h3>
          <p className="text-sm text-white/70 mt-2">
            Personalized yoga, diet, and lifestyle guidance powered by AI —
            in Hindi and English.
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/poses" className="hover:text-white transition-colors">{t('nav.poses')}</Link></li>
            <li><Link to="/videos" className="hover:text-white transition-colors">{t('nav.videos')}</Link></li>
            <li><Link to="/predict" className="hover:text-white transition-colors">{t('nav.predict')}</Link></li>
            <li><Link to="/chatbot" className="hover:text-white transition-colors">{t('nav.chatbot')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-3">Health Checks</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/predict/heart" className="hover:text-white transition-colors">Heart Risk</Link></li>
            <li><Link to="/predict/mental-health" className="hover:text-white transition-colors">Mental Health</Link></li>
            <li><Link to="/predict/diabetes" className="hover:text-white transition-colors">Diabetes Risk</Link></li>
            <li><Link to="/predict/hypertension" className="hover:text-white transition-colors">Hypertension Risk</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-3">Important</h4>
          <p className="text-sm text-white/70">
            This platform provides general wellness guidance only and is not a
            substitute for professional medical advice. Always consult a doctor
            for medical concerns.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-sm text-white/50">
        © {new Date().getFullYear()} Yoga & Wellness. Built for learning purposes.
      </div>
    </footer>
  )
}