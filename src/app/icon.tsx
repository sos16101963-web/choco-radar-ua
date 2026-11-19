import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #7a4a2b 0%, #3a2113 100%)',
          border: '2px solid #e39851',
          color: '#fef6e8',
          fontSize: 20,
          fontWeight: 900,
          fontFamily: 'serif',
        }}
      >
        C
      </div>
    ),
    {
      ...size,
    }
  );
}
