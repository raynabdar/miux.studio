import { ImageResponse } from 'next/og'

export const alt = 'Miux Studio | Creative, Branding, Web Design & Marketing Agency'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#141414',
          color: '#FFFFFF',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
            Miux Studio
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 16,
              color: '#A3A3A3',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 9999,
              padding: '8px 20px',
            }}
          >
            Selective by Design
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: '-0.05em',
              lineHeight: 1.1,
              color: '#FFFFFF',
            }}
          >
            <div>Growth through design,</div>
            <div>not just deliverables.</div>
          </div>
          <div style={{ display: 'flex', fontSize: 22, color: '#A3A3A3', maxWidth: 850, lineHeight: 1.4 }}>
            Brand Identity · Web Design · Web Development · UI/UX Design · Ads & Campaigns
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '28px',
          }}
        >
          <div style={{ display: 'flex', fontSize: 18, color: '#707070' }}>
            Serving Asia and the UAE · miux.studio
          </div>
          <div style={{ display: 'flex', fontSize: 18, color: '#A3A3A3' }}>
            hello@miux.studio
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
