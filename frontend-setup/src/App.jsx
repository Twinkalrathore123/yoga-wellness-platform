import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Predict from './pages/Predict.jsx'
import Poses from './pages/Poses.jsx'
import PoseDetail from './pages/PoseDetail.jsx'
import Videos from './pages/Videos.jsx'
import HeartRiskForm from './pages/HeartRiskForm.jsx'
import MentalHealthForm from './pages/MentalHealthForm.jsx'
import DiabetesForm from './pages/DiabetesForm.jsx'
import HypertensionForm from './pages/HypertensionForm.jsx'
import Chatbot from './pages/Chatbot.jsx'

// Placeholder for the 3 remaining prediction forms (mental health, diabetes,
// hypertension) — copy HeartRiskForm.jsx as the pattern for each.
function Placeholder({ title }) {
  return <div className="max-w-4xl mx-auto px-6 py-16 text-ink/70">{title} — coming soon</div>
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/poses" element={<Poses />} />
          <Route path="/poses/:id" element={<PoseDetail />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/predict/heart" element={<HeartRiskForm />} />
          <Route path="/predict/mental-health" element={<MentalHealthForm />} />
          <Route path="/predict/diabetes" element={<DiabetesForm />} />
          <Route path="/predict/hypertension" element={<HypertensionForm />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}