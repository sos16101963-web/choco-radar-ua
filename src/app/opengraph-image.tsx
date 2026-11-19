import { ImageResponse } from 'next/og';

export const alt = 'CrafoHab — Craft Chocolate, Artisan Cakes & Zefir Ukraine';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(135deg, #24130a 0%, #462b1f 55%, #6a3d24 100%)',
          color: '#fef6e8',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 24px',
              borderRadius: '999px',
              background: 'rgba(227, 152, 81, 0.18)',
              border: '2px solid #e39851',
              color: '#f5c492',
              fontSize: 22,
              fontWeight: 700,
              fontFamily: 'sans-serif',
            }}
          >
            crafohab.com.ua
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              fontWeight: 700,
              color: '#d4c9be',
              fontFamily: 'sans-serif',
            }}
          >
            Україна • Перевірений склад
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 96,
              fontWeight: 900,
              letterSpacing: '-2px',
              color: '#ffffff',
            }}
          >
            Crafo<span style={{ color: '#e39851' }}>Hab</span>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 38,
              fontWeight: 700,
              color: '#f5c492',
              fontFamily: 'sans-serif',
            }}
          >
            Craft Chocolate • Artisan Cakes • Zefir
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.18)',
            paddingTop: '24px',
            fontSize: 24,
            color: '#e5d5c3',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ display: 'flex' }}>Ukraine • Verified Makers • 0% Commission</div>
          <div style={{ display: 'flex', color: '#f5c492', fontWeight: 700 }}>
            Price per 100g • Direct Orders
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
