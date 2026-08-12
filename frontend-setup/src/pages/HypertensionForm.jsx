import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client.js'
import RiskResult from '../components/RiskResult.jsx'

const initialForm = {
  age: 45,
  sex: 1, // 1 = male, 0 = female
  bmi: 25,
  resting_bp: 120,
  salt_intake_level: 1, // 0 = low, 1 = moderate, 2 = high
  smoking: 0,
  physical_activity_level: 1, // 0 = low, 1 = moderate, 2 = high
  family_history: 0,
}

export default function HypertensionForm() {
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: Number(e.target.value) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/api/predict/hypertension', form)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setLoading(false)
    }
  }

  const askChatbotAboutResult = () => {
    navigate('/chatbot', { state: { predictionContext: result } })
  }

  return (
    <div className={`max-w-xl mx-auto px-6 py-12 form-wrapper`}>
      <h1 className="font-display text-3xl font-semibold text-ink mb-2">Hypertension Risk Check</h1>
      <p className="text-ink/60 mb-8">
        This is a general wellness screening, not a medical diagnosis. Consult a doctor for medical concerns.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Age" type="number" value={form.age} onChange={handleChange('age')} />

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Sex</label>
          <select
            value={form.sex}
            onChange={handleChange('sex')}
            className="w-full rounded-lg border border-sage-200 px-3 py-2"
          >
            <option value={1}>Male</option>
            <option value={0}>Female</option>
          </select>
        </div>

        <Field label="BMI" type="number" step="0.1" value={form.bmi} onChange={handleChange('bmi')} />
        <Field label="Resting Blood Pressure (mm Hg)" type="number" value={form.resting_bp} onChange={handleChange('resting_bp')} />

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Salt Intake Level</label>
          <select
            value={form.salt_intake_level}
            onChange={handleChange('salt_intake_level')}
            className="w-full rounded-lg border border-sage-200 px-3 py-2"
          >
            <option value={0}>Low</option>
            <option value={1}>Moderate</option>
            <option value={2}>High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Do you smoke?</label>
          <select
            value={form.smoking}
            onChange={handleChange('smoking')}
            className="w-full rounded-lg border border-sage-200 px-3 py-2"
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Physical Activity Level</label>
          <select
            value={form.physical_activity_level}
            onChange={handleChange('physical_activity_level')}
            className="w-full rounded-lg border border-sage-200 px-3 py-2"
          >
            <option value={0}>Low</option>
            <option value={1}>Moderate</option>
            <option value={2}>High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Family History of Hypertension?</label>
          <select
            value={form.family_history}
            onChange={handleChange('family_history')}
            className="w-full rounded-lg border border-sage-200 px-3 py-2"
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>

        <button
  type="submit"
  disabled={loading}
  className="w-full rounded-full bg-clay-600 text-white py-3 font-medium hover:bg-clay-400 transition-colors disabled:opacity-50"
>
  {loading ? 'Checking…' : 'Check My Risk'}
</button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {result && (
        <>
          <RiskResult result={result} />
          <button
            onClick={askChatbotAboutResult}
            className="w-full mt-4 rounded-full border-2 border-sage-400 text-sage-700 py-3 font-medium hover:bg-sage-100 transition-colors"
          >
            Ask the Assistant for Yoga & Diet Advice →
          </button>
        </>
      )}
    </div>
  )
}

function Field({ label, ...inputProps }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink/70 mb-1">{label}</label>
      <input
        {...inputProps}
        className="w-full rounded-lg border border-sage-200 px-3 py-2"
      />
    </div>
  )
}
