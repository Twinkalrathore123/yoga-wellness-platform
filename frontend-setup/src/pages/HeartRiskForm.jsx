// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import api from '../api/client.js'
// import RiskResult from '../components/RiskResult.jsx'

// const initialForm = {
//   age: 45,
//   sex: 1, // 1 = male, 0 = female
//   resting_bp: 120,
//   cholesterol: 200,
//   max_heart_rate: 150,
//   fasting_blood_sugar: 0,
//   exercise_angina: 0,
//   st_depression: 0,
// }

// export default function HeartRiskForm() {
//   const [form, setForm] = useState(initialForm)
//   const [result, setResult] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const navigate = useNavigate()

//   const handleChange = (field) => (e) => {
//     const value = e.target.type === 'number' || e.target.tagName === 'SELECT'
//       ? Number(e.target.value)
//       : e.target.value
//     setForm((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)
//     try {
//       const res = await api.post('/api/predict', form)
//       setResult(res.data)
//     } catch (err) {
//       setError(err.response?.data?.detail || err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Sends the prediction result straight into the chatbot for tailored advice —
//   // this is the Phase 6 "connect ML → chatbot" wiring.
//   const askChatbotAboutResult = () => {
//     navigate('/chatbot', { state: { predictionContext: result } })
//   }

//   return (
//     <div className={`max-w-xl mx-auto px-6 py-12 form-wrapper`}>
//       <h1 className="font-display text-3xl font-semibold text-ink mb-2">Heart Risk Check</h1>
//       <p className="text-ink/60 mb-8">
//         This is a general wellness screening, not a medical diagnosis. Consult a doctor for medical concerns.
//       </p>

//       <form onSubmit={handleSubmit} className="space-y-5">
//         <Field label="Age" type="number" value={form.age} onChange={handleChange('age')} />

//         <div>
//           <label className="block text-sm font-medium text-ink/70 mb-1">Sex</label>
//           <select
//             value={form.sex}
//             onChange={handleChange('sex')}
//             className="w-full rounded-lg border border-sage-200 px-3 py-2"
//           >
//             <option value={1}>Male</option>
//             <option value={0}>Female</option>
//           </select>
//         </div>

//         <Field label="Resting Blood Pressure (mm Hg)" type="number" value={form.resting_bp} onChange={handleChange('resting_bp')} />
//         <Field label="Cholesterol (mg/dl)" type="number" value={form.cholesterol} onChange={handleChange('cholesterol')} />
//         <Field label="Max Heart Rate Achieved" type="number" value={form.max_heart_rate} onChange={handleChange('max_heart_rate')} />

//         <div>
//           <label className="block text-sm font-medium text-ink/70 mb-1">Fasting Blood Sugar &gt; 120 mg/dl?</label>
//           <select
//             value={form.fasting_blood_sugar}
//             onChange={handleChange('fasting_blood_sugar')}
//             className="w-full rounded-lg border border-sage-200 px-3 py-2"
//           >
//             <option value={0}>No</option>
//             <option value={1}>Yes</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-ink/70 mb-1">Exercise-Induced Chest Pain (Angina)?</label>
//           <select
//             value={form.exercise_angina}
//             onChange={handleChange('exercise_angina')}
//             className="w-full rounded-lg border border-sage-200 px-3 py-2"
//           >
//             <option value={0}>No</option>
//             <option value={1}>Yes</option>
//           </select>
//         </div>

//         <Field label="ST Depression (oldpeak)" type="number" step="0.1" value={form.st_depression} onChange={handleChange('st_depression')} />

//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full rounded-full text-white py-3 font-medium transition-colors disabled:opacity-50 mental-health-submit-btn`}
//         >
//           {loading ? 'Checking…' : 'Check My Risk'}
//         </button>
//       </form>

//       {error && <p className="text-red-600 mt-4">{error}</p>}

//       {result && (
//         <>
//           <RiskResult result={result} />
//           <button
//             onClick={askChatbotAboutResult}
//             className="w-full mt-4 rounded-full border-2 border-sage-400 text-sage-700 py-3 font-medium hover:bg-sage-100 transition-colors"
//           >
//             Ask the Assistant for Yoga & Diet Advice →
//           </button>
//         </>
//       )}
//     </div>
//   )
// }

// function Field({ label, ...inputProps }) {
//   return (
//     <div>
//       <label className="block text-sm font-medium text-ink/70 mb-1">{label}</label>
//       <input
//         {...inputProps}
//         className="w-full rounded-lg border border-sage-200 px-3 py-2"
//       />
//     </div>
//   )
// }

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client.js'
import RiskResult from '../components/RiskResult.jsx'

const initialForm = {
  age: 45,
  sex: 1, // 1 = male, 0 = female
  resting_bp: 120,
  cholesterol: 200,
  max_heart_rate: 150,
  fasting_blood_sugar: 0,
  exercise_angina: 0,
  st_depression: 0,
}

export default function HeartRiskForm() {
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' || e.target.tagName === 'SELECT'
      ? Number(e.target.value)
      : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/api/predict/heart', form)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setLoading(false)
    }
  }

  // Sends the prediction result straight into the chatbot for tailored advice —
  // this is the Phase 6 "connect ML → chatbot" wiring.
  const askChatbotAboutResult = () => {
    navigate('/chatbot', { state: { predictionContext: result } })
  }

  return (
    <div className={`max-w-xl mx-auto px-6 py-12 form-wrapper`}>
      <h1 className="font-display text-3xl font-semibold text-ink mb-2">Heart Risk Check</h1>
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

        <Field label="Resting Blood Pressure (mm Hg)" type="number" value={form.resting_bp} onChange={handleChange('resting_bp')} />
        <Field label="Cholesterol (mg/dl)" type="number" value={form.cholesterol} onChange={handleChange('cholesterol')} />
        <Field label="Max Heart Rate Achieved" type="number" value={form.max_heart_rate} onChange={handleChange('max_heart_rate')} />

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Fasting Blood Sugar &gt; 120 mg/dl?</label>
          <select
            value={form.fasting_blood_sugar}
            onChange={handleChange('fasting_blood_sugar')}
            className="w-full rounded-lg border border-sage-200 px-3 py-2"
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Exercise-Induced Chest Pain (Angina)?</label>
          <select
            value={form.exercise_angina}
            onChange={handleChange('exercise_angina')}
            className="w-full rounded-lg border border-sage-200 px-3 py-2"
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>

        <Field label="ST Depression (oldpeak)" type="number" step="0.1" value={form.st_depression} onChange={handleChange('st_depression')} />

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