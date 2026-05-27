// Car icon mark extracted from the official AUTODUX logo SVG.
// Renders only the vehicle silhouette (no wordmark — text rendered as HTML by the parent).
// All paths converted to white (#fff) for use on dark backgrounds.

interface LogoAutoduxProps {
  /** Height in pixels. Width is calculated from the natural aspect ratio. */
  size?: number
  color?: string
}

export default function LogoAutodux({ size = 44, color = '#ffffff' }: LogoAutoduxProps) {
  // ViewBox crops to the car icon region of the original 29700×21000 canvas.
  // Car paths span roughly x: 2800–25600, y: 6400–11200.
  const vb = '2800 6400 23000 5200'
  const w = Math.round(size * (23000 / 5200))

  return (
    <svg
      viewBox={vb}
      width={w}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="AUTODUX vehicle icon"
      role="img"
    >
      {/* Right car body + wheel arch */}
      <path
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17223 9509c78,-120 468,-465 605,-586 219,-194 244,-264 370,-264l4108 -3c361,0 679,110 930,353 115,113 946,1307 986,1409 -680,47 -3092,5 -3959,5 -657,0 -1313,-3 -1969,1 -217,1 -220,-28 -330,-137l-741 -778zm298 1579c231,236 93,219 536,217 952,-4 6604,25 6698,-12 51,-20 65,-46 104,-110l486 -810c1,-71 -1437,-1931 -1486,-1987 -724,-821 -1691,-686 -2732,-686 -379,0 -3307,-27 -3406,16 -2,1 -1589,1652 -1651,1793l1451 1579z"
      />
      {/* Left car body + wheel arch */}
      <path
        fill={color}
        d="M4355 7704c799,201 1606,367 2425,563 228,54 1636,390 1827,396 243,9 502,0 746,0l3756 0c295,0 479,-56 648,108l762 738c-36,61 8,-1 -54,74l-342 373c-393,386 -389,545 -684,546 -513,2 -2663,-53 -2804,-21 -111,25 -778,763 -807,821 912,47 2833,-1 3877,3 221,1 297,42 424,-90 254,-265 1558,-1598 1642,-1736l-1240 -1274c-591,-588 -323,-505 -1124,-505l-5783 0c-1072,0 -2205,-36 -3269,4z"
      />
      {/* Roofline / speed streak */}
      <path
        fill={color}
        d="M7672 7066c1296,1 2591,-2 3887,0 1922,3 3615,-784 6201,-608 945,64 1719,638 1649,632l2039 178c-35,-90 -180,-305 -292,-411 -728,-686 -1038,-943 -2056,-1253 -1611,-490 -5977,375 -7774,687l-3654 775z"
      />
    </svg>
  )
}
