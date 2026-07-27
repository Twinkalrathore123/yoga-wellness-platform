import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/client.js';
import PoseCard from '../components/PoseCard.jsx';

export default function Poses() {
  const { t } = useTranslation()
  const [poses, setPoses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .get('/api/poses/')
      .then((res) => setPoses(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="max-w-6xl mx-auto px-6 py-16 text-center text-ink/60">Loading poses…</div>
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center text-clay-600">
        Couldn't load poses: {error}. Make sure your backend is running at{' '}
        <code>http://localhost:8000</code>.
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink mb-8">{t('nav.poses')}</h1>
      {poses.length === 0 ? (
        <p className="text-ink/60">No poses yet — run seed.py in the backend to add sample data.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {poses.map((pose) => (
            <Link key={pose.id} to={`/poses/${pose.id}`}>
              <PoseCard pose={pose} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
