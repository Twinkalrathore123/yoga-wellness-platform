import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../api/client.js'

// Pulls the YouTube video ID out of a full watch URL so we can embed it
function getYoutubeEmbedUrl(youtubeUrl) {
  try {
    const url = new URL(youtubeUrl)
    const videoId = url.searchParams.get('v')
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null
  } catch {
    return null
  }
}

export default function Videos() {
  const { t, i18n } = useTranslation()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/api/videos/')
      .then((res) => setVideos(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="max-w-6xl mx-auto px-6 py-16 text-center text-ink/60">Loading videos…</div>
  }

  // Group videos by condition so the page reads like sections: Heart, Stress, Diabetes...
  const grouped = videos.reduce((acc, video) => {
    acc[video.condition] = acc[video.condition] || []
    acc[video.condition].push(video)
    return acc
  }, {})

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink mb-8">{t('nav.videos')}</h1>

      {Object.entries(grouped).map(([condition, list]) => (
        <section key={condition} className="mb-10">
          <h2 className="font-display text-xl font-semibold text-sage-700 mb-4 capitalize">
            {condition.replace('_', ' ')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {list.map((video) => {
              const embedUrl = getYoutubeEmbedUrl(video.youtube_url)
              const title = i18n.language === 'hi' ? video.title_hi : video.title_en
              return (
                <div key={video.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-sage-200">
                  {embedUrl ? (
                    <div className="aspect-video">
                      <iframe
                        className="w-full h-full"
                        src={embedUrl}
                        title={title}
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <a href={video.youtube_url} target="_blank" rel="noreferrer" className="block p-6 text-sage-600 underline">
                      Watch on YouTube
                    </a>
                  )}
                  <div className="p-4">
                    <h3 className="font-medium text-ink">{title}</h3>
                    <p className="text-sm text-ink/60 mt-1">
                      {video.difficulty_level} · {video.duration_min} min
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
