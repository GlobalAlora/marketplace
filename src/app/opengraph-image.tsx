import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'AUTODUX — Marketplace automotor Patagonia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0D0F14',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Fondo decorativo — degradado radial sutil */}
        <div
          style={{
            position: 'absolute',
            width: '800px',
            height: '800px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(40,47,143,0.3) 0%, transparent 70%)',
            top: '-200px',
            left: '-100px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,193,7,0.06) 0%, transparent 70%)',
            bottom: '-150px',
            right: '-50px',
          }}
        />

        {/* Logo SVG inline del auto */}
        <svg
          viewBox="2800 6400 23000 5200"
          width="200"
          height="45"
          fill="none"
          style={{ marginBottom: '24px' }}
        >
          <path
            fill="#ffffff"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17223 9509c78,-120 468,-465 605,-586 219,-194 244,-264 370,-264l4108 -3c361,0 679,110 930,353 115,113 946,1307 986,1409 -680,47 -3092,5 -3959,5 -657,0 -1313,-3 -1969,1 -217,1 -220,-28 -330,-137l-741 -778zm298 1579c231,236 93,219 536,217 952,-4 6604,25 6698,-12 51,-20 65,-46 104,-110l486 -810c1,-71 -1437,-1931 -1486,-1987 -724,-821 -1691,-686 -2732,-686 -379,0 -3307,-27 -3406,16 -2,1 -1589,1652 -1651,1793l1451 1579z"
          />
          <path
            fill="#ffffff"
            d="M4355 7704c799,201 1606,367 2425,563 228,54 1636,390 1827,396 243,9 502,0 746,0l3756 0c295,0 479,-56 648,108l762 738c-36,61 8,-1 -54,74l-342 373c-393,386 -389,545 -684,546 -513,2 -2663,-53 -2804,-21 -111,25 -778,763 -807,821 912,47 2833,-1 3877,3 221,1 297,42 424,-90 254,-265 1558,-1598 1642,-1736l-1240 -1274c-591,-588 -323,-505 -1124,-505l-5783 0c-1072,0 -2205,-36 -3269,4z"
          />
          <path
            fill="#ffffff"
            d="M7672 7066c1296,1 2591,-2 3887,0 1922,3 3615,-784 6201,-608 945,64 1719,638 1649,632l2039 178c-35,-90 -180,-305 -292,-411 -728,-686 -1038,-943 -2056,-1253 -1611,-490 -5977,375 -7774,687l-3654 775z"
          />
        </svg>

        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '20px' }}>
          <span style={{ fontSize: '72px', fontWeight: 800, color: '#ffffff', letterSpacing: '-2px' }}>
            AUTO
          </span>
          <span style={{ fontSize: '72px', fontWeight: 800, color: '#FFC107', letterSpacing: '-2px' }}>
            DUX
          </span>
        </div>

        {/* Slogan */}
        <p style={{ fontSize: '28px', color: 'rgba(255,255,255,0.6)', fontWeight: 500, margin: '0', textAlign: 'center' }}>
          Conectamos lo que buscás, con lo que se vende
        </p>

        {/* Ubicación */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '28px',
            background: 'rgba(255,255,255,0.07)',
            borderRadius: '100px',
            padding: '8px 20px',
          }}
        >
          <span style={{ color: '#FFC107', fontSize: '18px' }}>📍</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '20px', fontWeight: 500 }}>
            Comodoro Rivadavia · Patagonia Argentina
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
