const ICON_PATHS = {
  home:      'M3 11.5 12 4l9 7.5 M5.5 10v9.5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V10',
  fridge:    'M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M5 10.5h14 M8.5 6.5v2 M8.5 13v3',
  bowl:      'M3.5 11h17 M5 11a7 7 0 0 0 14 0 M9 4.2v2 M12 3.4v2.8 M15 4.2v2',
  basket:    'M5 9h14l-1.2 9.4a2 2 0 0 1-2 1.6H8.2a2 2 0 0 1-2-1.6L5 9z M8.6 9l1.7-4 M15.4 9l-1.7-4 M10 12.5v3.5 M14 12.5v3.5',
  bell:      'M18 16.5v-5a6 6 0 1 0-12 0v5l-1.8 1.8a.6.6 0 0 0 .4 1h14.8a.6.6 0 0 0 .4-1L18 16.5z M10 20a2 2 0 0 0 4 0',
  plus:      'M12 5v14 M5 12h14',
  minus:     'M5 12h14',
  close:     'M6 6l12 12 M18 6 6 18',
  check:     'M5 12.5l4.5 4.5L20 6.5',
  chevR:     'M9.5 5.5 16 12l-6.5 6.5',
  chevL:     'M14.5 5.5 8 12l6.5 6.5',
  chevD:     'M6 9.5 12 15.5 18 9.5',
  chevU:     'M6 14.5 12 8.5 18 14.5',
  edit:      'M16.5 4.5l3 3L8 19l-4 1 1-4L16.5 4.5z M14.5 6.5l3 3',
  trash:     'M5 7h14 M9.2 7V5.2a1 1 0 0 1 1-1h3.6a1 1 0 0 1 1 1V7 M6.8 7l.9 12a1 1 0 0 0 1 1h6.6a1 1 0 0 0 1-1l.9-12 M10.5 10.5v6 M13.5 10.5v6',
  clock:     'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7.5V12l3 2',
  heart:     'M12 20.2l-1.3-1.2C5.4 14.2 2 11.1 2 7.5 2 5 4 3 6.5 3c1.6 0 3.2.8 4.1 2.2l1.4 2 1.4-2C14.3 3.8 15.9 3 17.5 3 20 3 22 5 22 7.5c0 3.6-3.4 6.7-8.7 11.5L12 20.2z',
  scan:      'M4 8.5V6a2 2 0 0 1 2-2h2.5 M15.5 4H18a2 2 0 0 1 2 2v2.5 M20 15.5V18a2 2 0 0 1-2 2h-2.5 M8.5 20H6a2 2 0 0 1-2-2v-2.5 M8 8v8 M11 8v8 M13.5 8v8 M16 8v8',
  leaf:      'M5 19c0-8 6-14 14.5-14 0 8.5-6 14-14.5 14z M5.5 18.5c3.5-3.5 7-5.5 10.5-7',
  snow:      'M12 3.5v17 M4.4 7.75 19.6 16.25 M19.6 7.75 4.4 16.25',
  sliders:   'M4 7h9 M17 7h3 M4 12h3 M11 12h9 M4 17h7 M15 17h5 M15 5.2v3.6 M9 10.2v3.6 M13 15.2v3.6',
  user:      'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M5.5 20a6.5 6.5 0 0 1 13 0',
  calendar:  'M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z M4 10.5h16 M8 4v4 M16 4v4',
  search:    'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M20.5 20.5 16 16',
  flame:     'M12 21c3.3 0 6-2.5 6-5.8 0-3.6-3-5.4-2.4-9.2C13 7 11.5 8.5 11 11c-.4-1-1.2-1.6-1.2-3C8 9.5 6 12 6 15.2 6 18.5 8.7 21 12 21z',
  cart:      'M4 5h2l1.4 10.2a1.5 1.5 0 0 0 1.5 1.3h7.3a1.5 1.5 0 0 0 1.5-1.2L19.5 8H7 M9.5 20.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M16.5 20.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  arrowR:    'M5 12h14 M14 6l6 6-6 6',
  info:      'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 11v5 M12 7.6h.01',
  drop:      'M12 21a6 6 0 0 0 6-6c0-4-6-11-6-11S6 11 6 15a6 6 0 0 0 6 6z',
  egg:       'M12 21c3.3 0 6-2.4 6-6.2C18 9.4 15.3 3 12 3S6 9.4 6 14.8 8.7 21 12 21z',
  shield:    'M12 3.5l7 2.5v5c0 4.6-3 8-7 9.5-4-1.5-7-4.9-7-9.5v-5l7-2.5z',
  logout:    'M15 5h3a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-3 M10 12h9 M15 8l4 4-4 4',
  dot:       null,
};

export function Icon({ name, size = 24, color = 'currentColor', strokeWidth = 1.8, style = {}, fill = false }) {
  const d = ICON_PATHS[name];
  if (name === 'dot') {
    return (
      <span style={{
        display: 'inline-block',
        width: size * 0.4,
        height: size * 0.4,
        borderRadius: 99,
        background: color,
        ...style,
      }} />
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d={d} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        fill={fill ? color : 'none'} />
    </svg>
  );
}

export function GoogleG({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.1 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.7 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7c4.3-4 6.8-9.9 6.8-17.4z"/>
      <path fill="#FBBC05" d="M10.4 28.3c-.5-1.4-.8-2.9-.8-4.3s.3-3 .8-4.3l-7.8-6.1C.9 16.6 0 20.2 0 24s.9 7.4 2.6 10.5l7.8-6.2z"/>
      <path fill="#34A853" d="M24 48c6.1 0 11.3-2 15-5.5l-7.3-5.7c-2 1.4-4.6 2.2-7.7 2.2-6.3 0-11.7-3.7-13.6-9.1l-7.8 6.2C6.5 42.6 14.6 48 24 48z"/>
    </svg>
  );
}
