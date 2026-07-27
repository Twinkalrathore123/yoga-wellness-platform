import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../api/client.js'

export default function Chatbot() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const predictionContext = location.state?.predictionContext || null

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // If we arrived here from a prediction form, auto-send a message describing
  // the result so the user doesn't have to re-explain their situation.
  useEffect(() => {
    if (predictionContext) {
      const autoMessage = `Based on my ${predictionContext.model.replace('_', ' ')} assessment (${predictionContext.risk_level} risk, factors: ${predictionContext.key_factors.join(', ')}), what yoga and lifestyle changes do you suggest?`
      sendMessage(autoMessage, predictionContext)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sendMessage = async (text, context = null) => {
    if (!text.trim()) return
    const userMessage = { role: 'user', text }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await api.post('/api/chat/', {
        message: text,
        language: i18n.language,
        prediction_context: context,
      })
      setMessages((prev) => [...prev, { role: 'assistant', ...res.data }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', advice_text: `Sorry, something went wrong: ${err.response?.data?.detail || err.message}` },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col h-[calc(100vh-80px)]">
      <h1 className="font-display text-2xl font-semibold text-ink mb-4">{t('nav.chatbot')}</h1>

      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <p className="text-ink/50 text-sm">
            Ask about yoga for a condition, or complete a health check first for tailored advice.
          </p>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            {msg.role === 'user' ? (
              <span className="inline-block bg-sage-600 text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-[80%]">
                {msg.text}
              </span>
            ) : (
              <div className="inline-block bg-white border border-sage-200 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[85%] text-left">
                <p className="text-ink">{msg.advice_text}</p>

                {msg.diet_tips?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-sage-700">Diet tips:</p>
                    <ul className="text-sm text-ink/70 list-disc list-inside">
                      {msg.diet_tips.map((tip, j) => (
                        <li key={j}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {(msg.recommended_pose_ids?.length > 0 || msg.recommended_video_ids?.length > 0) && (
                  <p className="text-xs text-sage-600 mt-3">
                    See recommended poses/videos in the Poses and Videos tabs.
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && <p className="text-ink/40 text-sm">Thinking…</p>}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 pt-2 border-t border-sage-200">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about yoga for stress, diet tips, etc."
          className="flex-1 rounded-full border border-sage-200 px-4 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-sage-600 text-white px-5 py-2 font-medium hover:bg-sage-700 transition-colors disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}
