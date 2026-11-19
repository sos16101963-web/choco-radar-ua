import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '36px',
          background: 'linear-gradient(135deg, #7a4a2b 0%, #2e190d 100%)',
          border: '6px solid #e39851',
          color: '#fef6e8',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 78,
            fontWeight: 900,
            letterSpacing: '-2px',
            color: '#f5c492',
          }}
        >
          CH
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '2px',
            color: '#fef6e8',
            marginTop: 4,
          }}
        >
          UA
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
