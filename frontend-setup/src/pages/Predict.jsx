import { Link } from 'react-router-dom'

const CHECKS = [
  {
    to: '/predict/heart',
    emoji: '❤️',
    title: 'Heart Risk Check',
    desc: 'Assess cardiovascular risk from blood pressure, cholesterol, and more.',
    gradient: 'from-red-100 to-rose-50',
    iconBg: 'bg-red-500',
  },
  {
    to: '/predict/mental-health',
    emoji: '🧠',
    title: 'Mental Health Check',
    desc: 'A short questionnaire to gauge stress, mood, and anxiety levels.',
    gradient: 'from-purple-100 to-indigo-50',
    iconBg: 'bg-purple-500',
  },
  {
    to: '/predict/diabetes',
    emoji: '🩸',
    title: 'Diabetes Risk Check',
    desc: 'Screen for diabetes risk based on glucose, BMI, and family history.',
    gradient: 'from-emerald-100 to-green-50',
    iconBg: 'bg-emerald-500',
  },
  {
    to: '/predict/hypertension',
    emoji: '🩺',
    title: 'Hypertension Risk Check',
    desc: 'Check blood pressure risk from lifestyle and family history factors.',
    gradient: 'from-orange-100 to-amber-50',
    iconBg: 'bg-orange-500',
  },
]

export default function Predict() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink mb-2">Health Checks</h1>
      <p className="text-ink/60 mb-10">
        Pick a free screening below. Each one takes under a minute and gives you tailored
        yoga, diet, and lifestyle advice afterward.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {CHECKS.map((check) => (
          <Link
            key={check.to}
            to={check.to}
            className={`predict-card rounded-2xl p-6 bg-gradient-to-br ${check.gradient} border border-white shadow-sm`}
          >
            <div className={`predict-icon-circle w-14 h-14 rounded-full ${check.iconBg} flex items-center justify-center text-2xl shadow-md`}>
              {check.emoji}
            </div>
            <h3 className="font-display text-xl font-semibold text-ink mt-4">{check.title}</h3>
            <p className="text-sm text-ink/70 mt-2">{check.desc}</p>
            <span className="inline-block mt-4 text-sm font-medium text-ink/80">Start check →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}