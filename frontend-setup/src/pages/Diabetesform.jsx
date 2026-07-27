import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client.js'
import RiskResult from '../components/RiskResult.jsx'

const initialForm = {
  pregnancies: 0,
  glucose: 100,
  blood_pressure: 70,
  skin_thickness: 20,
  insulin: 80,
  bmi: 25,
  diabetes_pedigree_function: 0.3,
  age: 30,
}

export default function DiabetesForm() {
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
      const res = await api.post('/api/predict/diabetes', form)
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
      <h1 className="font-display text-3xl font-semibold text-ink mb-2">Diabetes Risk Check</h1>
      <p className="text-ink/60 mb-8">
        This is a general wellness screening, not a medical diagnosis. Consult a doctor for medical concerns.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Number of Pregnancies" type="number" value={form.pregnancies} onChange={handleChange('pregnancies')} />
        <Field label="Glucose Level (mg/dL)" type="number" value={form.glucose} onChange={handleChange('glucose')} />
        <Field label="Blood Pressure (mm Hg)" type="number" value={form.blood_pressure} onChange={handleChange('blood_pressure')} />
        <Field label="Skin Thickness (mm)" type="number" value={form.skin_thickness} onChange={handleChange('skin_thickness')} />
        <Field label="Insulin Level (mu U/ml)" type="number" value={form.insulin} onChange={handleChange('insulin')} />
        <Field label="BMI" type="number" step="0.1" value={form.bmi} onChange={handleChange('bmi')} />
        <Field
          label="Diabetes Pedigree Function (family history score)"
          type="number"
          step="0.01"
          value={form.diabetes_pedigree_function}
          onChange={handleChange('diabetes_pedigree_function')}
        />
        <Field label="Age" type="number" value={form.age} onChange={handleChange('age')} />

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

