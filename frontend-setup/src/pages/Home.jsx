import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../api/client.js'
import PoseCard from '../components/PoseCard.jsx'

const BENEFITS = [
  {
    emoji: '🫀',
    title: 'Heart Health',
    desc: 'Poses like Bridge Pose and Cobra improve circulation, lower resting heart rate, and support healthy blood pressure over time.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80',
  },
  {
    emoji: '🧠',
    title: 'Mental Clarity',
    desc: 'Breathing exercises (pranayama) and meditation reduce cortisol, ease anxiety, and improve focus and sleep quality.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80',
  },
  {
    emoji: '🩸',
    title: 'Blood Sugar Balance',
    desc: 'Regular practice improves insulin sensitivity and helps regulate blood sugar levels, especially when paired with mindful eating.',
    image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500&q=80',
  },
  {
    emoji: '🦴',
    title: 'Flexibility & Strength',
    desc: 'Consistent stretching and weight-bearing poses build joint mobility, core strength, and better posture.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80',
  },
  {
    emoji: '😴',
    title: 'Better Sleep',
    desc: 'Gentle evening sequences calm the nervous system, making it easier to fall asleep and stay asleep.',
    image: 'https://images.unsplash.com/photo-1506126613408-4e0efab08cae?w=500&q=80',
  },
  {
    emoji: '⚖️',
    title: 'Weight Management',
    desc: 'Active styles like Vinyasa or Power Yoga burn calories while building lean muscle, supporting a healthy weight.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80',
  },
]

const STATS = [
  { number: '4', label: 'Free Health Checks' },
  { number: '15+', label: 'Yoga Poses (Growing)' },
  { number: '2', label: 'Languages Supported' },
  { number: '100%', label: 'Personalized Advice' },
]

const GALLERY = [
  { image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80', caption: 'Morning meditation' },
  { image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80', caption: 'Sunrise flow' },
  { image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80', caption: 'Building strength' },
  { image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=80', caption: 'Mindful breathing' },
  { image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&q=80', caption: 'Group practice' },
  { image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=600&q=80', caption: 'Restorative poses' },
]

const TESTIMONIALS = [
  {
    name: 'Priya S.',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
    quote: 'The heart risk check gave me a wake-up call, and the yoga suggestions actually fit my daily routine.',
  },
  {
    name: 'Arjun M.',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    quote: 'I love that I can switch to Hindi instantly. The chatbot advice feels genuinely personalized.',
  },
  {
    name: 'Sneha R.',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80',
    quote: 'The mental health questionnaire was quick, and the breathing exercises it suggested really helped with my sleep.',
  },
]

export default function Home() {
  const { t } = useTranslation()
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [poses, setPoses] = useState([])
  const [posesLoading, setPosesLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // Pull real poses from the backend for the "Featured Poses" section —
  // shows whatever is actually in your database, not hardcoded content.
  useEffect(() => {
    api
      .get('/api/poses/')
      .then((res) => setPoses(res.data.slice(0, 3)))
      .catch(() => setPoses([]))
      .finally(() => setPosesLoading(false))
  }, [])

  return (
    <div>
      <style>{`
        @keyframes homeFadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes homeFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes homeGradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes homeBlobPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 0.7; }
        }
        .home-hero-bg {
          background: linear-gradient(120deg, #e5ebe0, #d8916a33, #c9d6bf, #e5ebe0);
          background-size: 300% 300%;
          animation: homeGradientShift 14s ease infinite;
        }
        .home-fade-1 { opacity: 0; animation: homeFadeInUp 0.7s ease 0.1s forwards; }
        .home-fade-2 { opacity: 0; animation: homeFadeInUp 0.7s ease 0.3s forwards; }
        .home-float { animation: homeFloat 6s ease-in-out infinite; }
        .home-blob { animation: homeBlobPulse 8s ease-in-out infinite; }

        .home-card {
          opacity: 0;
          animation: homeFadeInUp 0.6s ease forwards;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .home-card:nth-child(1) { animation-delay: 0.6s; }
        .home-card:nth-child(2) { animation-delay: 0.75s; }
        .home-card:nth-child(3) { animation-delay: 0.9s; }
        .home-card:hover { transform: translateY(-8px); box-shadow: 0 20px 35px -15px rgba(0,0,0,0.2); }

        .home-stat {
          opacity: 0;
          animation: homeFadeInUp 0.5s ease forwards;
        }
        .home-stat:nth-child(1) { animation-delay: 0.1s; }
        .home-stat:nth-child(2) { animation-delay: 0.2s; }
        .home-stat:nth-child(3) { animation-delay: 0.3s; }
        .home-stat:nth-child(4) { animation-delay: 0.4s; }

        .pose-card-wrap {
          opacity: 0;
          animation: homeFadeInUp 0.6s ease forwards;
          transition: transform 0.3s ease;
        }
        .pose-card-wrap:nth-child(1) { animation-delay: 0.1s; }
        .pose-card-wrap:nth-child(2) { animation-delay: 0.25s; }
        .pose-card-wrap:nth-child(3) { animation-delay: 0.4s; }
        .pose-card-wrap:hover { transform: translateY(-6px); }

        .flip-card {
          perspective: 1200px;
          height: 260px;
          opacity: 0;
          animation: homeFadeInUp 0.6s ease forwards;
        }
        .flip-card:nth-child(1) { animation-delay: 0.05s; }
        .flip-card:nth-child(2) { animation-delay: 0.15s; }
        .flip-card:nth-child(3) { animation-delay: 0.25s; }
        .flip-card:nth-child(4) { animation-delay: 0.35s; }
        .flip-card:nth-child(5) { animation-delay: 0.45s; }
        .flip-card:nth-child(6) { animation-delay: 0.55s; }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 1rem;
          overflow: hidden;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }

        .testimonial-dot {
          width: 10px; height: 10px; border-radius: 50%;
          transition: all 0.3s ease;
        }
        .testimonial-fade {
          animation: homeFadeInUp 0.5s ease both;
        }

        /* Photo gallery — zoom + caption slide up on hover */
        .gallery-item {
          position: relative;
          overflow: hidden;
          border-radius: 1rem;
          opacity: 0;
          animation: homeFadeInUp 0.6s ease forwards;
        }
        .gallery-item:nth-child(1) { animation-delay: 0.05s; }
        .gallery-item:nth-child(2) { animation-delay: 0.15s; }
        .gallery-item:nth-child(3) { animation-delay: 0.25s; }
        .gallery-item:nth-child(4) { animation-delay: 0.35s; }
        .gallery-item:nth-child(5) { animation-delay: 0.45s; }
        .gallery-item:nth-child(6) { animation-delay: 0.55s; }
        .gallery-item img {
          transition: transform 0.5s ease;
        }
        .gallery-item:hover img {
          transform: scale(1.12);
        }
        .gallery-caption {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.75), transparent);
          color: white;
          padding: 1.5rem 1rem 0.75rem;
          transform: translateY(100%);
          transition: transform 0.35s ease;
        }
        .gallery-item:hover .gallery-caption {
          transform: translateY(0);
        }
      `}</style>

      {/* 1. Hero */}
      <section className="home-hero-bg relative overflow-hidden px-6 py-24">
        <div className="home-blob absolute -top-10 -left-10 w-64 h-64 rounded-full bg-sage-400/30 blur-3xl pointer-events-none" />
        <div className="home-blob absolute bottom-0 right-0 w-72 h-72 rounded-full bg-clay-400/30 blur-3xl pointer-events-none" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="home-fade-1">
            <span className="inline-block bg-white/70 text-sage-700 text-sm font-medium px-4 py-1.5 rounded-full shadow-sm mb-4">
              🌿 Yoga & Wellness, made personal
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink leading-tight">
              {t('home.title')}
            </h1>
            <p className="mt-4 text-lg text-ink/70">{t('home.subtitle')}</p>
            <div className="flex gap-4 mt-8">
              <Link
                to="/predict"
                className="inline-block rounded-full bg-clay-600 text-white px-6 py-3 font-medium hover:bg-clay-400 hover:scale-105 transition-all shadow-lg"
              >
                {t('home.cta')}
              </Link>
              <Link
                to="/poses"
                className="inline-block rounded-full border-2 border-sage-400 text-sage-700 px-6 py-3 font-medium hover:bg-sage-100 hover:scale-105 transition-all"
              >
                {t('nav.poses')}
              </Link>
            </div>
          </div>

          <div className="home-fade-2 relative">
            <img
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
              alt="Person practicing yoga outdoors"
              className="home-float rounded-3xl shadow-2xl w-full h-96 object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl px-5 py-3 home-float" style={{ animationDelay: '1.5s' }}>
              <p className="text-2xl font-display font-semibold text-sage-700">4 Health Checks</p>
              <p className="text-xs text-ink/60">Free AI-powered screenings</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats bar */}
      <section className="bg-sage-700 text-white py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((stat) => (
            <div key={stat.label} className="home-stat">
              <p className="font-display text-3xl md:text-4xl font-semibold">{stat.number}</p>
              <p className="text-sm text-white/70 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Poses — pulled live from the database */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">Featured Poses</h2>
            <p className="mt-2 text-ink/60">A few poses from our growing library.</p>
          </div>
          <Link to="/poses" className="text-sage-700 font-medium hover:underline whitespace-nowrap">
            View all poses →
          </Link>
        </div>

        {posesLoading ? (
          <p className="text-ink/50">Loading poses…</p>
        ) : poses.length === 0 ? (
          <p className="text-ink/50">
            No poses yet — run <code>python seed.py</code> in the backend to add sample poses.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {poses.map((pose) => (
              <Link key={pose.id} to={`/poses/${pose.id}`} className="pose-card-wrap block">
                <PoseCard pose={pose} />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 4. Explore the app — 3 core feature cards */}
      <section className="bg-sage-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">Everything in One Place</h2>
            <p className="mt-3 text-ink/60">Poses, screenings, and a chatbot that ties it all together.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/poses" className="home-card rounded-2xl p-6 bg-gradient-to-br from-sage-100 to-white border border-sage-200 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-sage-500 text-white flex items-center justify-center text-2xl mb-4">🧘</div>
              <h3 className="font-display text-lg font-semibold text-ink">{t('nav.poses')}</h3>
              <p className="text-sm text-ink/60 mt-2">Step-by-step yoga poses with benefits, in Hindi and English.</p>
            </Link>

            <Link to="/predict" className="home-card rounded-2xl p-6 bg-gradient-to-br from-clay-400/20 to-white border border-clay-400/30 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-clay-600 text-white flex items-center justify-center text-2xl mb-4">❤️</div>
              <h3 className="font-display text-lg font-semibold text-ink">{t('nav.predict')}</h3>
              <p className="text-sm text-ink/60 mt-2">Free screenings for heart, mental health, diabetes, and blood pressure.</p>
            </Link>

            <Link to="/chatbot" className="home-card rounded-2xl p-6 bg-gradient-to-br from-sage-200 to-white border border-sage-300 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-sage-700 text-white flex items-center justify-center text-2xl mb-4">💬</div>
              <h3 className="font-display text-lg font-semibold text-ink">{t('nav.chatbot')}</h3>
              <p className="text-sm text-ink/60 mt-2">Personalized yoga, diet, and lifestyle advice from our AI assistant.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Why Yoga — flip cards */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-4">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">
            Why Yoga? The Science of Feeling Better
          </h2>
          <p className="mt-3 text-ink/60">
            Hover over a card to see it in practice.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front bg-white p-6 shadow-sm border border-sage-200 flex flex-col">
                  <div className="text-3xl mb-3">{benefit.emoji}</div>
                  <h3 className="font-display text-lg font-semibold text-ink">{benefit.title}</h3>
                  <p className="text-sm text-ink/60 mt-2">{benefit.desc}</p>
                </div>
                <div className="flip-card-back">
                  <img src={benefit.image} alt={benefit.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                    <p className="text-white font-medium">{benefit.title}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Photo gallery */}
      <section className="bg-sage-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">Yoga in Practice</h2>
            <p className="mt-3 text-ink/60">Hover over any photo to see what it's about.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY.map((item) => (
              <div key={item.caption} className="gallery-item h-48">
                <img src={item.image} alt={item.caption} className="w-full h-full object-cover" />
                <div className="gallery-caption">
                  <p className="font-medium text-sm">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Testimonial carousel */}
      <section className="bg-sage-700 text-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-semibold mb-10">What People Are Saying</h2>

          <div key={activeTestimonial} className="testimonial-fade">
            <img
              src={TESTIMONIALS[activeTestimonial].photo}
              alt={TESTIMONIALS[activeTestimonial].name}
              className="w-20 h-20 rounded-full object-cover mx-auto shadow-lg border-4 border-white/20"
            />
            <p className="text-lg mt-6 text-white/90 italic">"{TESTIMONIALS[activeTestimonial].quote}"</p>
            <p className="mt-4 font-medium text-sage-200">{TESTIMONIALS[activeTestimonial].name}</p>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className="testimonial-dot"
                style={{ background: i === activeTestimonial ? 'white' : 'rgba(255,255,255,0.3)' }}
                aria-label={`Show testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Closing CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-3xl font-semibold text-ink">
          Ready to see where you stand?
        </h2>
        <p className="mt-3 text-ink/60">
          Take a free health check and get personalized yoga, diet, and lifestyle advice in seconds.
        </p>
        <Link
          to="/predict"
          className="inline-block mt-6 rounded-full bg-clay-600 text-white px-8 py-3 font-medium hover:bg-clay-400 hover:scale-105 transition-all shadow-lg"
        >
          Start Your Health Check →
        </Link>
      </section>
    </div>
  )
}