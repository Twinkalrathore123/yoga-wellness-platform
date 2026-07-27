import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client.js'
import RiskResult from '../components/RiskResult.jsx'

const initialForm = {
  little_interest_pleasure: 0,
  feeling_down_depressed: 0,
  trouble_sleeping: 0,
  feeling_tired: 0,
  poor_appetite_overeating: 0,
  trouble_concentrating: 0,
  feeling_nervous_anxious: 0,
  not_control_worrying: 0,
  age: 30,
}

// Each questionnaire field is scored on this same 0-3 scale
const FREQUENCY_OPTIONS = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
]

const QUESTIONS = [
  { field: 'little_interest_pleasure', label: 'Little interest or pleasure in doing things' },
  { field: 'feeling_down_depressed', label: 'Feeling down, depressed, or hopeless' },
  { field: 'trouble_sleeping', label: 'Trouble falling/staying asleep, or sleeping too much' },
  { field: 'feeling_tired', label: 'Feeling tired or having little energy' },
  { field: 'poor_appetite_overeating', label: 'Poor appetite or overeating' },
  { field: 'trouble_concentrating', label: 'Trouble concentrating on things' },
  { field: 'feeling_nervous_anxious', label: 'Feeling nervous, anxious, or on edge' },
  { field: 'not_control_worrying', label: 'Not being able to stop or control worrying' },
]

export default function MentalHealthForm() {
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
      const res = await api.post('/api/predict/mental-health', form)
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
      <h1 className="font-display text-3xl font-semibold text-ink mb-2">Mental Health Check</h1>
      <p className="text-ink/60 mb-8">
        Over the last 2 weeks, how often have you been bothered by each of the following?
        This is a general wellness screening, not a medical diagnosis. Consult a doctor or
        mental health professional for medical concerns.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {QUESTIONS.map(({ field, label }) => (
          <div key={field}>
            <label className="block text-sm font-medium text-ink/70 mb-1">{label}</label>
            <select
              value={form[field]}
              onChange={handleChange(field)}
              className="w-full rounded-lg border border-sage-200 px-3 py-2"
            >
              {FREQUENCY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Age</label>
          <input
            type="number"
            value={form.age}
            onChange={handleChange('age')}
            className="w-full rounded-lg border border-sage-200 px-3 py-2"
          />
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