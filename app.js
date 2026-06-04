const {
  useState,
  useMemo,
  useEffect
} = React;
(function () {
  try {
    if (typeof window !== "undefined" && !window.storage && typeof localStorage !== "undefined") {
      window.storage = {
        get: function (k) {
          return Promise.resolve().then(function () {
            var v = localStorage.getItem(k);
            return v == null ? null : {
              key: k,
              value: v
            };
          });
        },
        set: function (k, v) {
          return Promise.resolve().then(function () {
            localStorage.setItem(k, String(v));
            return {
              key: k,
              value: String(v)
            };
          });
        },
        delete: function (k) {
          return Promise.resolve().then(function () {
            localStorage.removeItem(k);
            return {
              key: k,
              deleted: true
            };
          });
        },
        list: function () {
          return Promise.resolve().then(function () {
            return {
              keys: Object.keys(localStorage)
            };
          });
        }
      };
    }
  } catch (e) {}
})();
function mkI(inner) {
  return function (props) {
    props = props || {};
    var size = props.size == null ? 24 : props.size;
    var o = {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: props.color || "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      dangerouslySetInnerHTML: {
        __html: inner
      }
    };
    for (var k in props) {
      if (k !== "size" && k !== "color" && k !== "children") o[k] = props[k];
    }
    return React.createElement("svg", o);
  };
}
const MapPin = mkI("<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\" /> <circle cx=\"12\" cy=\"10\" r=\"3\" />");
const Search = mkI("<path d=\"m21 21-4.34-4.34\" /> <circle cx=\"11\" cy=\"11\" r=\"8\" />");
const Droplets = mkI("<path d=\"M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z\" /> <path d=\"M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97\" />");
const Sun = mkI("<circle cx=\"12\" cy=\"12\" r=\"4\" /> <path d=\"M12 2v2\" /> <path d=\"M12 20v2\" /> <path d=\"m4.93 4.93 1.41 1.41\" /> <path d=\"m17.66 17.66 1.41 1.41\" /> <path d=\"M2 12h2\" /> <path d=\"M20 12h2\" /> <path d=\"m6.34 17.66-1.41 1.41\" /> <path d=\"m19.07 4.93-1.41 1.41\" />");
const Thermometer = mkI("<path d=\"M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z\" />");
const Sprout = mkI("<path d=\"M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3\" /> <path d=\"M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4\" /> <path d=\"M5 21h14\" />");
const Compass = mkI("<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z\" />");
const Plus = mkI("<path d=\"M5 12h14\" /> <path d=\"M12 5v14\" />");
const Trash2 = mkI("<path d=\"M10 11v6\" /> <path d=\"M14 11v6\" /> <path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6\" /> <path d=\"M3 6h18\" /> <path d=\"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\" />");
const CalendarDays = mkI("<path d=\"M8 2v4\" /> <path d=\"M16 2v4\" /> <rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" /> <path d=\"M3 10h18\" /> <path d=\"M8 14h.01\" /> <path d=\"M12 14h.01\" /> <path d=\"M16 14h.01\" /> <path d=\"M8 18h.01\" /> <path d=\"M12 18h.01\" /> <path d=\"M16 18h.01\" />");
const ChevronLeft = mkI("<path d=\"m15 18-6-6 6-6\" />");
const ChevronRight = mkI("<path d=\"m9 18 6-6-6-6\" />");
const ArrowRight = mkI("<path d=\"M5 12h14\" /> <path d=\"m12 5 7 7-7 7\" />");
const Check = mkI("<path d=\"M20 6 9 17l-5-5\" />");
const FlaskConical = mkI("<path d=\"M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2\" /> <path d=\"M6.453 15h11.094\" /> <path d=\"M8.5 2h7\" />");
const X = mkI("<path d=\"M18 6 6 18\" /> <path d=\"m6 6 12 12\" />");
const AlertTriangle = mkI("<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\" /> <path d=\"M12 9v4\" /> <path d=\"M12 17h.01\" />");
const Info = mkI("<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M12 16v-4\" /> <path d=\"M12 8h.01\" />");

/* ------------------------------------------------------------------ */
/*  Plot — a location-aware fruit & vegetable growing guide (prototype) */
/*  Sample data is illustrative, for layout only.                       */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Hanken+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

.plot * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
.plot {
  --paper:#F2EAD7; --paper2:#EADFC6; --card:#F8F2E4; --card2:#F4ECDA;
  --ink:#1E342A; --ink2:#3D5145; --muted:#7C8377;
  --moss:#4E7A4C; --clay:#BD5736; --ochre:#BE8E2C; --soil:#5A4632;
  --line:rgba(30,52,42,0.14); --line2:rgba(30,52,42,0.30);
  font-family:'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif;
  color:var(--ink); line-height:1.45;
}
.fr  { font-family:'Fraunces', Georgia, 'Times New Roman', serif; }
.mono{ font-family:'Space Mono', ui-monospace, SFMono-Regular, monospace; }

.backdrop{
  position:fixed; inset:0; z-index:0;
  background:
    radial-gradient(120% 80% at 50% -10%, #3a5142 0%, #2c3f33 45%, #233329 100%);
}
.grain{
  position:fixed; inset:0; z-index:1; pointer-events:none; opacity:.05;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.stage{
  position:relative; z-index:2; min-height:100vh;
  display:flex; justify-content:center; padding:26px 14px 40px;
}
.app{
  width:100%; max-width:430px; background:var(--paper);
  border-radius:30px; overflow:hidden; position:relative;
  box-shadow:0 30px 70px -24px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.06);
  min-height:768px; display:flex; flex-direction:column;
}
.statusbar{
  display:flex; align-items:center; justify-content:space-between;
  padding:12px 22px 4px; font-size:13px; font-weight:700; color:var(--ink);
}
.dots{ display:flex; gap:4px; align-items:center; }
.dot{ width:5px; height:5px; border-radius:50%; background:var(--ink); opacity:.55; }

.screen{ animation:fade .5s ease both; flex:1; display:flex; flex-direction:column; }
@keyframes fade{ from{opacity:0} to{opacity:1} }
@keyframes rise{ from{opacity:0; transform:translateY(12px)} to{opacity:1; transform:none} }
@keyframes draw{ from{transform:scaleX(0)} to{transform:scaleX(1)} }
@keyframes pop{ from{opacity:0; transform:scale(.6)} to{opacity:1; transform:scale(1)} }
@keyframes nowpulse{ 0%{ box-shadow:0 0 0 2px var(--clay), 0 0 0 0 rgba(189,87,54,.45) } 70%{ box-shadow:0 0 0 2px var(--clay), 0 0 0 13px rgba(189,87,54,0) } 100%{ box-shadow:0 0 0 2px var(--clay), 0 0 0 13px rgba(189,87,54,0) } }
@keyframes readypulse{ 0%{ box-shadow:0 0 0 2px var(--ochre), 0 0 0 0 rgba(190,142,44,.5) } 70%{ box-shadow:0 0 0 2px var(--ochre), 0 0 0 13px rgba(190,142,44,0) } 100%{ box-shadow:0 0 0 2px var(--ochre), 0 0 0 13px rgba(190,142,44,0) } }
.nowdot{ animation:nowpulse 2.2s ease-out infinite }
.readydot{ animation:readypulse 2.2s ease-out infinite }
.rise{ animation:rise .55s cubic-bezier(.2,.7,.3,1) both; }

.label{ font-family:'Space Mono', monospace; font-size:10.5px; letter-spacing:.18em;
  text-transform:uppercase; color:var(--muted); }
.hr{ height:1px; background:var(--line); border:0; }

.card{ background:var(--card); border:1px solid var(--line); border-radius:18px; }
.btn{ border:0; cursor:pointer; font-family:inherit; font-weight:600; }
.btn-primary{ background:var(--clay); color:#FBF3E6; border-radius:14px;
  padding:15px 18px; font-size:15.5px; letter-spacing:.01em; width:100%;
  display:flex; align-items:center; justify-content:center; gap:9px;
  box-shadow:0 10px 22px -10px rgba(189,87,54,.7); transition:transform .2s, box-shadow .2s; }
.btn-primary:active{ transform:translateY(1px); box-shadow:0 6px 16px -10px rgba(189,87,54,.7); }

.input{ width:100%; background:var(--card); border:1.5px solid var(--line2);
  border-radius:15px; padding:15px 15px 15px 46px; font-size:16px; font-family:inherit;
  color:var(--ink); outline:none; transition:border-color .2s, box-shadow .2s; }
.input:focus{ border-color:var(--moss); box-shadow:0 0 0 4px rgba(78,122,76,.14); }
.input::placeholder{ color:var(--muted); }

.sugg{ background:var(--card); border:1px solid var(--line); border-radius:15px;
  overflow:hidden; margin-top:8px; box-shadow:0 16px 30px -18px rgba(0,0,0,.3); }
.sugg-row{ display:flex; align-items:center; gap:12px; padding:13px 15px; cursor:pointer;
  border-bottom:1px solid var(--line); transition:background .15s; }
.sugg-row:last-child{ border-bottom:0; }
.sugg-row:hover{ background:var(--card2); }

.chip{ border:1px solid var(--line2); background:transparent; color:var(--ink2);
  border-radius:999px; padding:7px 14px; font-size:13px; font-weight:600; cursor:pointer;
  white-space:nowrap; transition:all .18s; font-family:inherit; }
.chip.on{ background:var(--ink); color:var(--paper); border-color:var(--ink); }

.packet{ background:var(--card); border:1px solid var(--line); border-radius:18px;
  overflow:hidden; cursor:pointer; transition:transform .22s, box-shadow .22s;
  display:flex; flex-direction:column; }
.packet:active{ transform:translateY(2px); }
.packet:hover{ box-shadow:0 16px 32px -20px rgba(30,52,42,.45); transform:translateY(-3px); }
.band{ height:6px; }
.tag{ font-family:'Space Mono', monospace; font-size:9.5px; letter-spacing:.16em;
  text-transform:uppercase; padding:3px 8px; border-radius:6px; display:inline-block; }

.statusbadge{ display:inline-flex; align-items:center; gap:6px; border-radius:999px;
  padding:6px 12px; font-size:12.5px; font-weight:700; font-family:inherit; }
.warnbadge{ display:inline-flex; align-items:center; gap:6px; border-radius:999px;
  padding:6px 12px; font-size:12.5px; font-weight:700; font-family:inherit;
  background:rgba(189,87,54,.14); color:#9A3D22; }
.warnbadge.amber{ background:rgba(190,142,44,.18); color:#8A6716; }
.packet.unfit{ opacity:.62; }
.packet.unfit .band{ filter:grayscale(.55); }

.spec{ background:var(--card); border:1px solid var(--line); border-radius:16px; padding:14px; }

.drop{ width:13px; height:17px; }

.cell{ flex:1; aspect-ratio:1; border-radius:7px; display:flex; align-items:center;
  justify-content:center; font-family:'Space Mono', monospace; font-size:11px;
  background:var(--card2); color:var(--muted); position:relative; border:1px solid transparent; }

.scrollx::-webkit-scrollbar{ display:none; }
.scrollx{ -ms-overflow-style:none; scrollbar-width:none; }

.navbar{ position:fixed; left:50%; bottom:18px; transform:translateX(-50%); z-index:60;
  display:flex; gap:4px; background:var(--paper); border:1px solid var(--line2);
  border-radius:999px; padding:5px; box-shadow:0 16px 34px -10px rgba(0,0,0,.5);
  max-width:calc(100vw - 16px); box-sizing:border-box; }
.navtab{ border:0; background:transparent; cursor:pointer; font-family:inherit; font-weight:600;
  font-size:12.5px; color:var(--muted); border-radius:999px; padding:9px 12px; white-space:nowrap; flex-shrink:0;
  display:flex; align-items:center; gap:5px; transition:all .2s; }
.navtab.on{ background:var(--ink); color:var(--paper); }
.navcount{ background:var(--clay); color:#FBF3E6; font-size:11px; font-weight:700;
  min-width:18px; height:18px; border-radius:999px; display:inline-flex; align-items:center;
  justify-content:center; padding:0 5px; font-family:'Space Mono', monospace; }

.prow{ display:flex; align-items:center; gap:13px; padding:14px 4px; cursor:pointer;
  border-bottom:1px solid var(--line); transition:background .15s; }
.prow:last-child{ border-bottom:0; }
.iconbtn{ border:0; background:transparent; cursor:pointer; padding:8px; border-radius:10px;
  color:var(--muted); display:flex; transition:all .15s; }
.iconbtn:hover{ background:var(--card2); color:var(--clay); }
`;

/* ----------------------------- data ------------------------------ */
const CITIES = [{
  id: "london",
  city: "London",
  country: "United Kingdom",
  zone: "9a",
  climate: "Temperate maritime",
  hemi: "N",
  season: "Mar – Oct",
  frost: "Nov – Mar",
  len: "~210 days",
  tier: 1,
  chillWinter: true
}, {
  id: "phoenix",
  city: "Phoenix",
  country: "United States",
  zone: "9b",
  climate: "Hot desert",
  hemi: "N",
  season: "Feb – Nov",
  frost: "rare",
  len: "~300 days",
  tier: 3,
  chillWinter: true
}, {
  id: "sydney",
  city: "Sydney",
  country: "Australia",
  zone: "10b",
  climate: "Humid subtropical",
  hemi: "S",
  season: "Sep – May",
  frost: "none",
  len: "~330 days",
  tier: 3,
  chillWinter: false
}, {
  id: "oslo",
  city: "Oslo",
  country: "Norway",
  zone: "5b",
  climate: "Cold continental",
  hemi: "N",
  season: "May – Sep",
  frost: "Oct – Apr",
  len: "~150 days",
  tier: 0,
  chillWinter: true
}, {
  id: "nairobi",
  city: "Nairobi",
  country: "Kenya",
  zone: "—",
  climate: "Tropical highland",
  hemi: "EQ",
  season: "Year-round",
  frost: "none",
  len: "365 days",
  tier: 4,
  chillWinter: false
}, {
  id: "sp",
  city: "São Paulo",
  country: "Brazil",
  zone: "—",
  climate: "Humid subtropical",
  hemi: "S",
  season: "Aug – May",
  frost: "rare",
  len: "~300 days",
  tier: 3,
  chillWinter: false
}, {
  id: "madrid",
  city: "Madrid",
  country: "Spain",
  zone: "9a",
  climate: "Hot-summer Mediterranean",
  hemi: "N",
  season: "Mar – Nov",
  frost: "Dec – Feb",
  len: "~250 days",
  tier: 2,
  chillWinter: true
}, {
  id: "barcelona",
  city: "Barcelona",
  country: "Spain",
  zone: "10a",
  climate: "Mediterranean",
  hemi: "N",
  season: "Mar – Nov",
  frost: "rare",
  len: "~270 days",
  tier: 2,
  chillWinter: true
}, {
  id: "seville",
  city: "Seville",
  country: "Spain",
  zone: "10b",
  climate: "Hot Mediterranean",
  hemi: "N",
  season: "Feb – Nov",
  frost: "rare",
  len: "~300 days",
  tier: 3,
  chillWinter: false
}, {
  id: "paris",
  city: "Paris",
  country: "France",
  zone: "8b",
  climate: "Temperate oceanic",
  hemi: "N",
  season: "Apr – Oct",
  frost: "Nov – Mar",
  len: "~200 days",
  tier: 1,
  chillWinter: true
}, {
  id: "rome",
  city: "Rome",
  country: "Italy",
  zone: "9b",
  climate: "Mediterranean",
  hemi: "N",
  season: "Mar – Nov",
  frost: "Dec – Feb",
  len: "~260 days",
  tier: 2,
  chillWinter: true
}, {
  id: "berlin",
  city: "Berlin",
  country: "Germany",
  zone: "7b",
  climate: "Humid continental",
  hemi: "N",
  season: "Apr – Oct",
  frost: "Nov – Mar",
  len: "~180 days",
  tier: 1,
  chillWinter: true
}, {
  id: "lisbon",
  city: "Lisbon",
  country: "Portugal",
  zone: "10a",
  climate: "Mediterranean",
  hemi: "N",
  season: "Mar – Nov",
  frost: "rare",
  len: "~280 days",
  tier: 2,
  chillWinter: true
}, {
  id: "stockholm",
  city: "Stockholm",
  country: "Sweden",
  zone: "6a",
  climate: "Humid continental",
  hemi: "N",
  season: "May – Sep",
  frost: "Oct – Apr",
  len: "~160 days",
  tier: 0,
  chillWinter: true
}, {
  id: "moscow",
  city: "Moscow",
  country: "Russia",
  zone: "4b",
  climate: "Humid continental",
  hemi: "N",
  season: "May – Sep",
  frost: "Oct – Apr",
  len: "~135 days",
  tier: 0,
  chillWinter: true
}, {
  id: "newyork",
  city: "New York",
  country: "United States",
  zone: "7b",
  climate: "Humid continental",
  hemi: "N",
  season: "Apr – Oct",
  frost: "Nov – Mar",
  len: "~190 days",
  tier: 2,
  chillWinter: true
}, {
  id: "losangeles",
  city: "Los Angeles",
  country: "United States",
  zone: "10b",
  climate: "Mediterranean",
  hemi: "N",
  season: "Year-round",
  frost: "rare",
  len: "~330 days",
  tier: 3,
  chillWinter: false
}, {
  id: "toronto",
  city: "Toronto",
  country: "Canada",
  zone: "6a",
  climate: "Humid continental",
  hemi: "N",
  season: "May – Oct",
  frost: "Nov – Apr",
  len: "~160 days",
  tier: 0,
  chillWinter: true
}, {
  id: "mexicocity",
  city: "Mexico City",
  country: "Mexico",
  zone: "11a",
  climate: "Subtropical highland",
  hemi: "N",
  season: "Year-round",
  frost: "rare",
  len: "~330 days",
  tier: 3,
  chillWinter: false
}, {
  id: "buenosaires",
  city: "Buenos Aires",
  country: "Argentina",
  zone: "10a",
  climate: "Humid subtropical",
  hemi: "S",
  season: "Sep – May",
  frost: "rare",
  len: "~290 days",
  tier: 2,
  chillWinter: true
}, {
  id: "santiago",
  city: "Santiago",
  country: "Chile",
  zone: "9b",
  climate: "Mediterranean",
  hemi: "S",
  season: "Sep – May",
  frost: "Jun – Aug",
  len: "~250 days",
  tier: 2,
  chillWinter: true
}, {
  id: "rio",
  city: "Rio de Janeiro",
  country: "Brazil",
  zone: "—",
  climate: "Tropical",
  hemi: "S",
  season: "Year-round",
  frost: "none",
  len: "365 days",
  tier: 4,
  chillWinter: false
}, {
  id: "capetown",
  city: "Cape Town",
  country: "South Africa",
  zone: "10a",
  climate: "Mediterranean",
  hemi: "S",
  season: "Sep – May",
  frost: "rare",
  len: "~290 days",
  tier: 2,
  chillWinter: true
}, {
  id: "cairo",
  city: "Cairo",
  country: "Egypt",
  zone: "10b",
  climate: "Hot desert",
  hemi: "N",
  season: "Feb – Nov",
  frost: "none",
  len: "~320 days",
  tier: 3,
  chillWinter: false
}, {
  id: "lagos",
  city: "Lagos",
  country: "Nigeria",
  zone: "—",
  climate: "Tropical",
  hemi: "EQ",
  season: "Year-round",
  frost: "none",
  len: "365 days",
  tier: 4,
  chillWinter: false
}, {
  id: "tokyo",
  city: "Tokyo",
  country: "Japan",
  zone: "9b",
  climate: "Humid subtropical",
  hemi: "N",
  season: "Mar – Nov",
  frost: "Dec – Feb",
  len: "~250 days",
  tier: 2,
  chillWinter: true
}, {
  id: "beijing",
  city: "Beijing",
  country: "China",
  zone: "6b",
  climate: "Continental monsoon",
  hemi: "N",
  season: "Apr – Oct",
  frost: "Nov – Mar",
  len: "~190 days",
  tier: 2,
  chillWinter: true
}, {
  id: "delhi",
  city: "Delhi",
  country: "India",
  zone: "11a",
  climate: "Hot semi-arid",
  hemi: "N",
  season: "Year-round",
  frost: "none",
  len: "~320 days",
  tier: 3,
  chillWinter: false
}, {
  id: "singapore",
  city: "Singapore",
  country: "Singapore",
  zone: "—",
  climate: "Tropical rainforest",
  hemi: "EQ",
  season: "Year-round",
  frost: "none",
  len: "365 days",
  tier: 4,
  chillWinter: false
}, {
  id: "bangkok",
  city: "Bangkok",
  country: "Thailand",
  zone: "—",
  climate: "Tropical savanna",
  hemi: "EQ",
  season: "Year-round",
  frost: "none",
  len: "365 days",
  tier: 4,
  chillWinter: false
}, {
  id: "mumbai",
  city: "Mumbai",
  country: "India",
  zone: "—",
  climate: "Tropical",
  hemi: "EQ",
  season: "Year-round",
  frost: "none",
  len: "365 days",
  tier: 4,
  chillWinter: false
}, {
  id: "dubai",
  city: "Dubai",
  country: "United Arab Emirates",
  zone: "11b",
  climate: "Hot desert",
  hemi: "N",
  season: "Oct – May",
  frost: "none",
  len: "~330 days",
  tier: 3,
  chillWinter: false
}, {
  id: "melbourne",
  city: "Melbourne",
  country: "Australia",
  zone: "10a",
  climate: "Temperate oceanic",
  hemi: "S",
  season: "Sep – May",
  frost: "rare",
  len: "~270 days",
  tier: 2,
  chillWinter: true
}, {
  id: "auckland",
  city: "Auckland",
  country: "New Zealand",
  zone: "10b",
  climate: "Temperate oceanic",
  hemi: "S",
  season: "Sep – May",
  frost: "rare",
  len: "~290 days",
  tier: 2,
  chillWinter: true
}, {
  id: "dublin",
  city: "Dublin",
  country: "Ireland",
  zone: "9a",
  climate: "Temperate oceanic",
  hemi: "N",
  season: "Apr – Oct",
  frost: "Nov – Mar",
  len: "~200 days",
  tier: 1,
  chillWinter: true
}, {
  id: "amsterdam",
  city: "Amsterdam",
  country: "Netherlands",
  zone: "8b",
  climate: "Temperate oceanic",
  hemi: "N",
  season: "Apr – Oct",
  frost: "Nov – Mar",
  len: "~195 days",
  tier: 1,
  chillWinter: true
}, {
  id: "copenhagen",
  city: "Copenhagen",
  country: "Denmark",
  zone: "8a",
  climate: "Temperate oceanic",
  hemi: "N",
  season: "Apr – Oct",
  frost: "Nov – Mar",
  len: "~190 days",
  tier: 1,
  chillWinter: true
}, {
  id: "vienna",
  city: "Vienna",
  country: "Austria",
  zone: "8a",
  climate: "Humid continental",
  hemi: "N",
  season: "Apr – Oct",
  frost: "Nov – Mar",
  len: "~190 days",
  tier: 1,
  chillWinter: true
}, {
  id: "warsaw",
  city: "Warsaw",
  country: "Poland",
  zone: "6b",
  climate: "Humid continental",
  hemi: "N",
  season: "Apr – Oct",
  frost: "Nov – Mar",
  len: "~180 days",
  tier: 0,
  chillWinter: true
}, {
  id: "athens",
  city: "Athens",
  country: "Greece",
  zone: "10a",
  climate: "Mediterranean",
  hemi: "N",
  season: "Mar – Nov",
  frost: "rare",
  len: "~280 days",
  tier: 2,
  chillWinter: true
}, {
  id: "istanbul",
  city: "Istanbul",
  country: "Turkey",
  zone: "9a",
  climate: "Mediterranean",
  hemi: "N",
  season: "Mar – Nov",
  frost: "Dec – Feb",
  len: "~250 days",
  tier: 2,
  chillWinter: true
}, {
  id: "helsinki",
  city: "Helsinki",
  country: "Finland",
  zone: "5b",
  climate: "Humid continental",
  hemi: "N",
  season: "May – Sep",
  frost: "Oct – Apr",
  len: "~155 days",
  tier: 0,
  chillWinter: true
}, {
  id: "zurich",
  city: "Zurich",
  country: "Switzerland",
  zone: "8a",
  climate: "Humid continental",
  hemi: "N",
  season: "Apr – Oct",
  frost: "Nov – Mar",
  len: "~185 days",
  tier: 1,
  chillWinter: true
}, {
  id: "kyiv",
  city: "Kyiv",
  country: "Ukraine",
  zone: "6a",
  climate: "Humid continental",
  hemi: "N",
  season: "Apr – Oct",
  frost: "Nov – Mar",
  len: "~170 days",
  tier: 0,
  chillWinter: true
}, {
  id: "chicago",
  city: "Chicago",
  country: "United States",
  zone: "6a",
  climate: "Humid continental",
  hemi: "N",
  season: "Apr – Oct",
  frost: "Nov – Mar",
  len: "~175 days",
  tier: 1,
  chillWinter: true
}, {
  id: "seattle",
  city: "Seattle",
  country: "United States",
  zone: "8b",
  climate: "Temperate oceanic",
  hemi: "N",
  season: "Apr – Oct",
  frost: "Nov – Mar",
  len: "~200 days",
  tier: 1,
  chillWinter: true
}, {
  id: "houston",
  city: "Houston",
  country: "United States",
  zone: "9a",
  climate: "Humid subtropical",
  hemi: "N",
  season: "Feb – Nov",
  frost: "rare",
  len: "~290 days",
  tier: 3,
  chillWinter: false
}, {
  id: "miami",
  city: "Miami",
  country: "United States",
  zone: "11a",
  climate: "Tropical monsoon",
  hemi: "N",
  season: "Year-round",
  frost: "none",
  len: "365 days",
  tier: 4,
  chillWinter: false
}, {
  id: "vancouver",
  city: "Vancouver",
  country: "Canada",
  zone: "8b",
  climate: "Temperate oceanic",
  hemi: "N",
  season: "Apr – Oct",
  frost: "Nov – Mar",
  len: "~200 days",
  tier: 1,
  chillWinter: true
}, {
  id: "montreal",
  city: "Montreal",
  country: "Canada",
  zone: "5a",
  climate: "Humid continental",
  hemi: "N",
  season: "May – Sep",
  frost: "Oct – Apr",
  len: "~150 days",
  tier: 0,
  chillWinter: true
}, {
  id: "havana",
  city: "Havana",
  country: "Cuba",
  zone: "11b",
  climate: "Tropical",
  hemi: "N",
  season: "Year-round",
  frost: "none",
  len: "365 days",
  tier: 4,
  chillWinter: false
}, {
  id: "lima",
  city: "Lima",
  country: "Peru",
  zone: "11a",
  climate: "Mild desert",
  hemi: "S",
  season: "Year-round",
  frost: "none",
  len: "~330 days",
  tier: 3,
  chillWinter: false
}, {
  id: "bogota",
  city: "Bogotá",
  country: "Colombia",
  zone: "—",
  climate: "Subtropical highland",
  hemi: "EQ",
  season: "Year-round",
  frost: "rare",
  len: "~330 days",
  tier: 2,
  chillWinter: false
}, {
  id: "caracas",
  city: "Caracas",
  country: "Venezuela",
  zone: "—",
  climate: "Tropical savanna",
  hemi: "EQ",
  season: "Year-round",
  frost: "none",
  len: "365 days",
  tier: 4,
  chillWinter: false
}, {
  id: "casablanca",
  city: "Casablanca",
  country: "Morocco",
  zone: "10b",
  climate: "Mediterranean",
  hemi: "N",
  season: "Feb – Nov",
  frost: "rare",
  len: "~300 days",
  tier: 2,
  chillWinter: false
}, {
  id: "marrakech",
  city: "Marrakech",
  country: "Morocco",
  zone: "10a",
  climate: "Hot semi-arid",
  hemi: "N",
  season: "Feb – Nov",
  frost: "rare",
  len: "~300 days",
  tier: 3,
  chillWinter: false
}, {
  id: "johannesburg",
  city: "Johannesburg",
  country: "South Africa",
  zone: "9b",
  climate: "Subtropical highland",
  hemi: "S",
  season: "Sep – Apr",
  frost: "Jun – Aug",
  len: "~250 days",
  tier: 2,
  chillWinter: true
}, {
  id: "accra",
  city: "Accra",
  country: "Ghana",
  zone: "—",
  climate: "Tropical savanna",
  hemi: "EQ",
  season: "Year-round",
  frost: "none",
  len: "365 days",
  tier: 4,
  chillWinter: false
}, {
  id: "addisababa",
  city: "Addis Ababa",
  country: "Ethiopia",
  zone: "—",
  climate: "Subtropical highland",
  hemi: "EQ",
  season: "Year-round",
  frost: "rare",
  len: "~330 days",
  tier: 2,
  chillWinter: false
}, {
  id: "telaviv",
  city: "Tel Aviv",
  country: "Israel",
  zone: "10b",
  climate: "Mediterranean",
  hemi: "N",
  season: "Feb – Nov",
  frost: "rare",
  len: "~310 days",
  tier: 3,
  chillWinter: false
}, {
  id: "tehran",
  city: "Tehran",
  country: "Iran",
  zone: "8b",
  climate: "Cold semi-arid",
  hemi: "N",
  season: "Mar – Nov",
  frost: "Dec – Feb",
  len: "~240 days",
  tier: 2,
  chillWinter: true
}, {
  id: "riyadh",
  city: "Riyadh",
  country: "Saudi Arabia",
  zone: "11a",
  climate: "Hot desert",
  hemi: "N",
  season: "Oct – May",
  frost: "none",
  len: "~330 days",
  tier: 3,
  chillWinter: false
}, {
  id: "tashkent",
  city: "Tashkent",
  country: "Uzbekistan",
  zone: "7a",
  climate: "Continental",
  hemi: "N",
  season: "Apr – Oct",
  frost: "Nov – Mar",
  len: "~200 days",
  tier: 2,
  chillWinter: true
}, {
  id: "seoul",
  city: "Seoul",
  country: "South Korea",
  zone: "7a",
  climate: "Humid continental",
  hemi: "N",
  season: "Apr – Oct",
  frost: "Nov – Mar",
  len: "~190 days",
  tier: 2,
  chillWinter: true
}, {
  id: "hanoi",
  city: "Hanoi",
  country: "Vietnam",
  zone: "—",
  climate: "Humid subtropical",
  hemi: "N",
  season: "Year-round",
  frost: "rare",
  len: "~320 days",
  tier: 3,
  chillWinter: false
}, {
  id: "hongkong",
  city: "Hong Kong",
  country: "Hong Kong",
  zone: "11a",
  climate: "Humid subtropical",
  hemi: "N",
  season: "Year-round",
  frost: "rare",
  len: "~330 days",
  tier: 3,
  chillWinter: false
}, {
  id: "jakarta",
  city: "Jakarta",
  country: "Indonesia",
  zone: "—",
  climate: "Tropical rainforest",
  hemi: "EQ",
  season: "Year-round",
  frost: "none",
  len: "365 days",
  tier: 4,
  chillWinter: false
}, {
  id: "manila",
  city: "Manila",
  country: "Philippines",
  zone: "—",
  climate: "Tropical",
  hemi: "EQ",
  season: "Year-round",
  frost: "none",
  len: "365 days",
  tier: 4,
  chillWinter: false
}, {
  id: "kualalumpur",
  city: "Kuala Lumpur",
  country: "Malaysia",
  zone: "—",
  climate: "Tropical rainforest",
  hemi: "EQ",
  season: "Year-round",
  frost: "none",
  len: "365 days",
  tier: 4,
  chillWinter: false
}, {
  id: "perth",
  city: "Perth",
  country: "Australia",
  zone: "10b",
  climate: "Mediterranean",
  hemi: "S",
  season: "Sep – May",
  frost: "rare",
  len: "~300 days",
  tier: 3,
  chillWinter: false
}, {
  id: "wellington",
  city: "Wellington",
  country: "New Zealand",
  zone: "10a",
  climate: "Temperate oceanic",
  hemi: "S",
  season: "Sep – May",
  frost: "rare",
  len: "~270 days",
  tier: 1,
  chillWinter: true
}];
const CROPS = [{
  id: "tomato",
  name: "Tomato",
  latin: "Solanum lycopersicum",
  type: "Fruit",
  color: "#BD5736",
  sun: "Full sun",
  water: 2,
  soil: "Rich loam",
  ph: [6.0, 6.8],
  temp: [18, 29],
  germ: "6–8",
  maturity: 75,
  sow: [2, 3, 4],
  stages: [["Sow", 0], ["Sprout", 7], ["Seedling", 24], ["Grow", 45], ["Flower", 58], ["Harvest", 75]],
  note: "A warm-season favourite. Needs steady heat and consistent moisture — shelter from frost on both ends of the season."
}, {
  id: "carrot",
  name: "Carrot",
  latin: "Daucus carota",
  type: "Vegetable",
  color: "#BE8E2C",
  sun: "Full sun",
  water: 2,
  soil: "Loose & sandy",
  ph: [6.0, 6.8],
  temp: [16, 21],
  germ: "14–21",
  maturity: 70,
  sow: [3, 4, 5, 6],
  stages: [["Sow", 0], ["Sprout", 17], ["Seedling", 30], ["Root", 55], ["Harvest", 70]],
  note: "A cool-tolerant root. Sow direct into deep, stone-free soil and thin the seedlings so roots size up evenly."
}, {
  id: "strawberry",
  name: "Strawberry",
  latin: "Fragaria × ananassa",
  type: "Fruit",
  color: "#C44A3C",
  sun: "Full sun",
  water: 2,
  soil: "Fertile loam",
  ph: [5.5, 6.8],
  temp: [15, 26],
  germ: "from plants",
  maturity: 75,
  sow: [2, 3, 4],
  stages: [["Plant", 0], ["Root", 21], ["Flower", 45], ["Fruit", 60], ["Harvest", 75]],
  note: "Usually grown from young plants or runners. Mulch underneath to keep fruit clean and crops perennially each year."
}, {
  id: "lettuce",
  name: "Lettuce",
  latin: "Lactuca sativa",
  type: "Vegetable",
  color: "#4E7A4C",
  sun: "Part – full sun",
  water: 3,
  soil: "Moist loam",
  ph: [6.0, 7.0],
  temp: [10, 20],
  germ: "7–10",
  maturity: 50,
  sow: [2, 3, 7, 8],
  stages: [["Sow", 0], ["Sprout", 8], ["Seedling", 20], ["Leaf", 38], ["Harvest", 50]],
  note: "A quick cool-season crop that bolts in heat. Sow a little every few weeks for a steady supply of leaves."
}, {
  id: "pepper",
  name: "Bell Pepper",
  latin: "Capsicum annuum",
  type: "Fruit",
  color: "#C25A2E",
  sun: "Full sun",
  water: 2,
  soil: "Rich loam",
  ph: [6.0, 6.8],
  temp: [21, 29],
  germ: "7–14",
  maturity: 85,
  sow: [2, 3],
  stages: [["Sow", 0], ["Sprout", 10], ["Seedling", 30], ["Grow", 52], ["Flower", 66], ["Harvest", 85]],
  note: "Heat-loving and slow to start, so sow early indoors. Let fruit ripen on the plant for deeper colour and sweetness."
}, {
  id: "basil",
  name: "Basil",
  latin: "Ocimum basilicum",
  type: "Herb",
  color: "#5C8A3F",
  sun: "Full sun",
  water: 2,
  soil: "Moist loam",
  ph: [6.0, 7.0],
  temp: [18, 30],
  germ: "5–10",
  maturity: 55,
  sow: [3, 4, 5],
  stages: [["Sow", 0], ["Sprout", 7], ["Seedling", 22], ["Leaf", 42], ["Harvest", 55]],
  note: "A tender, frost-shy herb. Pinch out the growing tips often to keep plants bushy and delay flowering."
}, {
  id: "cucumber",
  name: "Cucumber",
  latin: "Cucumis sativus",
  type: "Fruit",
  color: "#4F7A3A",
  sun: "Full sun",
  water: 3,
  soil: "Rich, moist",
  ph: [6.0, 7.0],
  temp: [18, 30],
  germ: "7–10",
  maturity: 60,
  sow: [3, 4, 5],
  stages: [["Sow", 0], ["Sprout", 8], ["Seedling", 22], ["Vine", 40], ["Flower", 50], ["Harvest", 60]],
  note: "A thirsty, warm-season climber. Train it up a support to save space and pick often to keep new fruit coming."
}, {
  id: "eggplant",
  name: "Eggplant",
  latin: "Solanum melongena",
  type: "Fruit",
  color: "#7A5290",
  sun: "Full sun",
  water: 2,
  soil: "Rich loam",
  ph: [5.5, 6.8],
  temp: [21, 30],
  germ: "7–14",
  maturity: 80,
  sow: [2, 3],
  stages: [["Sow", 0], ["Sprout", 12], ["Seedling", 32], ["Grow", 55], ["Flower", 66], ["Harvest", 80]],
  note: "A heat-lover like pepper — slow to start, so sow early indoors. Harvest while the skin is still glossy and firm."
}, {
  id: "pumpkin",
  name: "Pumpkin",
  latin: "Cucurbita pepo",
  type: "Fruit",
  color: "#C56A1E",
  sun: "Full sun",
  water: 2,
  soil: "Rich, deep",
  ph: [6.0, 6.8],
  temp: [20, 30],
  germ: "7–10",
  maturity: 110,
  sow: [4, 5],
  stages: [["Sow", 0], ["Sprout", 9], ["Vine", 35], ["Flower", 60], ["Fruit", 85], ["Harvest", 110]],
  note: "A sprawling, hungry crop that needs room to roam. Let fruit cure in the sun before storing it for the winter."
}, {
  id: "blueberry",
  name: "Blueberry",
  latin: "Vaccinium corymbosum",
  type: "Fruit",
  color: "#5E6FA8",
  sun: "Full – part sun",
  water: 2,
  soil: "Acidic, peaty",
  ph: [4.5, 5.5],
  temp: [15, 27],
  germ: "from plants",
  maturity: 90,
  sow: [2, 3],
  stages: [["Plant", 0], ["Root", 25], ["Flower", 50], ["Fruit", 75], ["Harvest", 90]],
  note: "A perennial bush that crops more each year. It needs acidic soil — grow in ericaceous compost if your ground is limey."
}, {
  id: "potato",
  name: "Potato",
  latin: "Solanum tuberosum",
  type: "Vegetable",
  color: "#C49A66",
  sun: "Full sun",
  water: 2,
  soil: "Loose, fertile",
  ph: [5.0, 6.0],
  temp: [15, 20],
  germ: "from tubers",
  maturity: 90,
  sow: [2, 3, 4],
  stages: [["Plant", 0], ["Sprout", 18], ["Foliage", 40], ["Flower", 60], ["Harvest", 90]],
  note: "Grown from seed potatoes, not seed. Mound soil over the stems as they grow to stop the tubers greening in the light."
}, {
  id: "onion",
  name: "Onion",
  latin: "Allium cepa",
  type: "Vegetable",
  color: "#C9824C",
  sun: "Full sun",
  water: 2,
  soil: "Firm, fertile",
  ph: [6.0, 7.0],
  temp: [13, 24],
  germ: "from sets",
  maturity: 100,
  sow: [2, 3],
  stages: [["Plant", 0], ["Root", 20], ["Leaf", 45], ["Bulb", 75], ["Harvest", 100]],
  note: "Easiest from sets — small bulbs planted in spring. Ease off the watering once the tops flop over and start to yellow."
}, {
  id: "spinach",
  name: "Spinach",
  latin: "Spinacia oleracea",
  type: "Vegetable",
  color: "#3F7140",
  sun: "Part – full sun",
  water: 3,
  soil: "Moist, rich",
  ph: [6.0, 7.0],
  temp: [10, 20],
  germ: "7–14",
  maturity: 45,
  sow: [2, 3, 7, 8],
  stages: [["Sow", 0], ["Sprout", 10], ["Seedling", 22], ["Leaf", 36], ["Harvest", 45]],
  note: "A fast, cool-season leaf that bolts in summer heat. Sow in spring and again in autumn for the most tender crops."
}, {
  id: "pea",
  name: "Pea",
  latin: "Pisum sativum",
  type: "Vegetable",
  color: "#6FA03F",
  sun: "Full sun",
  water: 2,
  soil: "Well-drained loam",
  ph: [6.0, 7.0],
  temp: [13, 18],
  germ: "7–14",
  maturity: 65,
  sow: [2, 3, 4],
  stages: [["Sow", 0], ["Sprout", 10], ["Seedling", 24], ["Climb", 40], ["Flower", 52], ["Harvest", 65]],
  note: "A cool-season climber — give it netting or twigs to scramble up. Pick the pods young and often for the sweetest peas."
}, {
  id: "radish",
  name: "Radish",
  latin: "Raphanus sativus",
  type: "Vegetable",
  color: "#C24A60",
  sun: "Full – part sun",
  water: 2,
  soil: "Light, moist",
  ph: [6.0, 7.0],
  temp: [10, 18],
  germ: "4–7",
  maturity: 25,
  sow: [2, 3, 4, 5, 6, 7, 8],
  stages: [["Sow", 0], ["Sprout", 5], ["Seedling", 12], ["Root", 20], ["Harvest", 25]],
  note: "The quickest crop you can grow — ready in about a month. Sow a short row every couple of weeks for a steady supply."
}, {
  id: "mint",
  name: "Mint",
  latin: "Mentha spicata",
  type: "Herb",
  color: "#5FA05A",
  sun: "Part – full sun",
  water: 3,
  soil: "Moist, rich",
  ph: [6.0, 7.0],
  temp: [15, 25],
  germ: "from plants",
  maturity: 60,
  sow: [3, 4, 5],
  stages: [["Plant", 0], ["Root", 20], ["Spread", 40], ["Leaf", 50], ["Harvest", 60]],
  note: "Vigorous to the point of invasive — grow it in a sunken pot to keep the runners from taking over your beds."
}, {
  id: "apple",
  name: "Apple",
  latin: "Malus domestica",
  type: "Tree",
  color: "#C0413E",
  perennial: true,
  clim: {
    chill: true
  },
  sun: "Full sun",
  water: 2,
  soil: "Loam, well-drained",
  ph: [6.0, 7.0],
  temp: [15, 24],
  germ: "from a young tree",
  years: "2–4",
  sow: [10, 11, 0, 1, 2],
  harvest: [7, 8, 9],
  arc: [["Plant", "Yr 0"], ["Establish", "Yr 1"], ["First fruit", "Yr 2–4"], ["Full crop", "Yr 5+"]],
  note: "A temperate tree that needs a cold winter to fruit well — not one for the tropics. Most kinds want a second variety nearby to pollinate."
}, {
  id: "banana",
  name: "Banana",
  latin: "Musa acuminata",
  type: "Tree",
  color: "#E6B62E",
  perennial: true,
  clim: {
    warmth: 3
  },
  sun: "Full sun",
  water: 3,
  soil: "Rich, moist",
  ph: [5.5, 7.0],
  temp: [20, 30],
  germ: "from a sucker",
  years: "1–2",
  sow: [3, 4, 5],
  harvest: [6, 7, 8, 9],
  arc: [["Plant", "Yr 0"], ["Grow", "~6 mo"], ["Flower", "~12 mo"], ["First fruit", "1–2 yr"]],
  note: "A fast tropical perennial that loves heat and humidity — but a single frost will kill it. If you have no real winter, you're in business."
}, {
  id: "lemon",
  name: "Lemon",
  latin: "Citrus limon",
  type: "Tree",
  color: "#D9CF3A",
  perennial: true,
  clim: {
    warmth: 2
  },
  sun: "Full sun",
  water: 2,
  soil: "Loam, well-drained",
  ph: [6.0, 7.0],
  temp: [13, 29],
  germ: "from a young tree",
  years: "2–3",
  sow: [2, 3, 4],
  harvest: [10, 11, 0, 1],
  arc: [["Plant", "Yr 0"], ["Establish", "Yr 1"], ["First fruit", "Yr 2–3"], ["Full crop", "Yr 4+"]],
  note: "A subtropical evergreen that hates frost — keep it in a pot you can move under cover where winters bite. It loves a sunny, sheltered spot."
}, {
  id: "orange",
  name: "Orange",
  latin: "Citrus sinensis",
  type: "Tree",
  color: "#E58A2A",
  perennial: true,
  clim: {
    warmth: 2
  },
  sun: "Full sun",
  water: 2,
  soil: "Loam, well-drained",
  ph: [6.0, 7.5],
  temp: [15, 29],
  germ: "from a young tree",
  years: "3–4",
  sow: [2, 3, 4],
  harvest: [11, 0, 1, 2],
  arc: [["Plant", "Yr 0"], ["Establish", "Yr 1"], ["First fruit", "Yr 3–4"], ["Full crop", "Yr 5+"]],
  note: "A subtropical citrus that sweetens in warm sun and mild winters. Frost-tender while young, so shelter it through any cold snaps."
}, {
  id: "cherry",
  name: "Cherry",
  latin: "Prunus avium",
  type: "Tree",
  color: "#A8324A",
  perennial: true,
  clim: {
    chill: true
  },
  sun: "Full sun",
  water: 2,
  soil: "Loam, well-drained",
  ph: [6.0, 7.0],
  temp: [15, 24],
  germ: "from a young tree",
  years: "3–5",
  sow: [10, 11, 0, 1, 2],
  harvest: [5, 6],
  arc: [["Plant", "Yr 0"], ["Establish", "Yr 1–2"], ["First fruit", "Yr 3–5"], ["Full crop", "Yr 6+"]],
  note: "A temperate tree that needs winter cold to set fruit. Be quick at harvest — and net it, or the birds will beat you to every cherry."
}, {
  id: "mango",
  name: "Mango",
  latin: "Mangifera indica",
  type: "Tree",
  color: "#DD6E3A",
  perennial: true,
  clim: {
    warmth: 3
  },
  sun: "Full sun",
  water: 2,
  soil: "Rich, well-drained",
  ph: [5.5, 7.5],
  temp: [21, 35],
  germ: "from a young tree",
  years: "3–5",
  sow: [3, 4, 5],
  harvest: [5, 6, 7],
  arc: [["Plant", "Yr 0"], ["Establish", "Yr 1–2"], ["First fruit", "Yr 3–5"], ["Full crop", "Yr 6+"]],
  note: "A true tropical that wants long, hot summers and no frost at all. In a cool climate it's a greenhouse-only dream."
}, {
  id: "watermelon",
  name: "Watermelon",
  latin: "Citrullus lanatus",
  type: "Fruit",
  color: "#5AA152",
  sun: "Full sun",
  water: 3,
  soil: "Rich, well-drained",
  ph: [6.0, 6.8],
  temp: [21, 35],
  germ: "7–10",
  maturity: 90,
  sow: [3, 4, 5],
  stages: [["Sow", 0], ["Sprout", 8], ["Vine", 30], ["Flower", 50], ["Fruit", 70], ["Harvest", 90]],
  note: "Needs a long, hot summer and plenty of room to ramble. Tap a ripe one and it sounds hollow — that's your cue."
}, {
  id: "melon",
  name: "Melon",
  latin: "Cucumis melo",
  type: "Fruit",
  color: "#D7B06A",
  sun: "Full sun",
  water: 2,
  soil: "Rich, well-drained",
  ph: [6.0, 6.8],
  temp: [18, 30],
  germ: "7–10",
  maturity: 85,
  sow: [3, 4, 5],
  stages: [["Sow", 0], ["Sprout", 8], ["Vine", 28], ["Flower", 48], ["Fruit", 68], ["Harvest", 85]],
  note: "A heat-lover — the more warmth, the sweeter the fruit. A ripe melon slips easily from the vine and smells fragrant."
}, {
  id: "sweetcorn",
  name: "Sweetcorn",
  latin: "Zea mays",
  type: "Vegetable",
  color: "#D8A93A",
  sun: "Full sun",
  water: 2,
  soil: "Rich, fertile",
  ph: [6.0, 6.8],
  temp: [18, 32],
  germ: "7–10",
  maturity: 80,
  sow: [3, 4, 5],
  stages: [["Sow", 0], ["Sprout", 9], ["Knee-high", 30], ["Tassel", 55], ["Silk", 65], ["Harvest", 80]],
  note: "Plant it in a block rather than a row so the wind can pollinate it. Pick when the kernels run milky if you nick one."
}, {
  id: "sweetpotato",
  name: "Sweet Potato",
  latin: "Ipomoea batatas",
  type: "Vegetable",
  color: "#C2703C",
  sun: "Full sun",
  water: 2,
  soil: "Loose, sandy",
  ph: [5.5, 6.5],
  temp: [21, 30],
  germ: "from slips",
  maturity: 110,
  sow: [4, 5],
  stages: [["Plant", 0], ["Root", 20], ["Vine", 50], ["Tuber", 80], ["Harvest", 110]],
  note: "Grown from rooted cuttings called slips. It needs a long, hot, frost-free season — genuinely tricky in cool climates."
}, {
  id: "butternut",
  name: "Butternut Squash",
  latin: "Cucurbita moschata",
  type: "Fruit",
  color: "#D2A862",
  sun: "Full sun",
  water: 2,
  soil: "Rich, deep",
  ph: [6.0, 6.8],
  temp: [18, 30],
  germ: "7–10",
  maturity: 100,
  sow: [4, 5],
  stages: [["Sow", 0], ["Sprout", 9], ["Vine", 35], ["Flower", 58], ["Fruit", 80], ["Harvest", 100]],
  note: "Like pumpkin, it sprawls and feeds heavily over a long warm season. Let the skin harden and cure it before storing."
}, {
  id: "okra",
  name: "Okra",
  latin: "Abelmoschus esculentus",
  type: "Vegetable",
  color: "#5E8C3F",
  sun: "Full sun",
  water: 2,
  soil: "Rich loam",
  ph: [6.0, 6.8],
  temp: [24, 35],
  germ: "7–14",
  maturity: 60,
  sow: [4, 5],
  stages: [["Sow", 0], ["Sprout", 10], ["Seedling", 28], ["Flower", 45], ["Pod", 55], ["Harvest", 60]],
  note: "Thrives in real heat and sulks when it's cool. Pick the pods young and often, or they turn tough and stringy."
}, {
  id: "parsley",
  name: "Parsley",
  latin: "Petroselinum crispum",
  type: "Herb",
  color: "#4A8A48",
  sun: "Part – full sun",
  water: 2,
  soil: "Moist, rich",
  ph: [6.0, 7.0],
  temp: [10, 21],
  germ: "14–28",
  maturity: 75,
  sow: [2, 3, 4, 7, 8],
  stages: [["Sow", 0], ["Sprout", 21], ["Seedling", 40], ["Leaf", 60], ["Harvest", 75]],
  note: "Slow to germinate, so be patient. It's a cut-and-come-again leaf that runs to seed in its second year."
}, {
  id: "cilantro",
  name: "Cilantro",
  latin: "Coriandrum sativum",
  type: "Herb",
  color: "#5FA050",
  sun: "Part – full sun",
  water: 2,
  soil: "Light, moist",
  ph: [6.0, 6.8],
  temp: [10, 24],
  germ: "7–14",
  maturity: 45,
  sow: [2, 3, 7, 8, 9],
  stages: [["Sow", 0], ["Sprout", 10], ["Seedling", 22], ["Leaf", 36], ["Harvest", 45]],
  note: "Bolts fast in summer heat — sow in the cool of spring and autumn. Let some flower to harvest coriander seed."
}, {
  id: "rosemary",
  name: "Rosemary",
  latin: "Salvia rosmarinus",
  type: "Herb",
  color: "#6F8F72",
  sun: "Full sun",
  water: 1,
  soil: "Light, well-drained",
  ph: [6.0, 7.5],
  temp: [15, 30],
  germ: "from plants",
  maturity: 90,
  sow: [3, 4, 5],
  stages: [["Plant", 0], ["Root", 25], ["Grow", 55], ["Bush", 75], ["Harvest", 90]],
  note: "A woody Mediterranean perennial that loves sun and sharp drainage and hates soggy soil. Hardy to a light frost."
}, {
  id: "thyme",
  name: "Thyme",
  latin: "Thymus vulgaris",
  type: "Herb",
  color: "#6B8E5A",
  sun: "Full sun",
  water: 1,
  soil: "Light, well-drained",
  ph: [6.0, 8.0],
  temp: [13, 28],
  germ: "from plants",
  maturity: 80,
  sow: [3, 4, 5],
  stages: [["Plant", 0], ["Root", 25], ["Spread", 50], ["Harvest", 80]],
  note: "A low, creeping perennial that thrives on neglect and good drainage. Trim it back after it flowers to stay bushy."
}, {
  id: "sage",
  name: "Sage",
  latin: "Salvia officinalis",
  type: "Herb",
  color: "#8AA07E",
  sun: "Full sun",
  water: 1,
  soil: "Well-drained loam",
  ph: [6.0, 7.0],
  temp: [15, 28],
  germ: "from plants",
  maturity: 90,
  sow: [3, 4, 5],
  stages: [["Plant", 0], ["Root", 25], ["Grow", 55], ["Bush", 75], ["Harvest", 90]],
  note: "A hardy, silvery perennial — give it sun and good drainage. Replace the woody old plants every few years."
}, {
  id: "oregano",
  name: "Oregano",
  latin: "Origanum vulgare",
  type: "Herb",
  color: "#5E8C4E",
  sun: "Full sun",
  water: 1,
  soil: "Light, well-drained",
  ph: [6.0, 8.0],
  temp: [15, 28],
  germ: "7–14",
  maturity: 80,
  sow: [3, 4, 5],
  stages: [["Sow", 0], ["Sprout", 12], ["Seedling", 30], ["Leaf", 55], ["Harvest", 80]],
  note: "A tough Mediterranean perennial whose flavour deepens in poor, dry soil and full sun. Easy and long-lived."
}, {
  id: "chives",
  name: "Chives",
  latin: "Allium schoenoprasum",
  type: "Herb",
  color: "#5A9A5E",
  sun: "Part – full sun",
  water: 2,
  soil: "Moist, rich",
  ph: [6.0, 7.0],
  temp: [10, 24],
  germ: "14–21",
  maturity: 75,
  sow: [2, 3, 4],
  stages: [["Sow", 0], ["Sprout", 18], ["Grass", 40], ["Clump", 60], ["Harvest", 75]],
  note: "A hardy perennial onion relative — snip the grassy leaves often, and the purple pompom flowers are edible too."
}, {
  id: "dill",
  name: "Dill",
  latin: "Anethum graveolens",
  type: "Herb",
  color: "#69A24A",
  sun: "Full sun",
  water: 2,
  soil: "Light, well-drained",
  ph: [5.5, 6.5],
  temp: [13, 24],
  germ: "7–14",
  maturity: 55,
  sow: [3, 4, 5, 6],
  stages: [["Sow", 0], ["Sprout", 12], ["Seedling", 28], ["Feather", 42], ["Harvest", 55]],
  note: "A feathery annual that bolts to seed quickly — sow a little and often, and harvest both the leaf and the seed."
}, {
  id: "lavender",
  name: "Lavender",
  latin: "Lavandula angustifolia",
  type: "Herb",
  color: "#9488BE",
  sun: "Full sun",
  water: 1,
  soil: "Light, well-drained",
  ph: [6.5, 8.0],
  temp: [15, 30],
  germ: "from plants",
  maturity: 120,
  sow: [3, 4, 5],
  stages: [["Plant", 0], ["Root", 30], ["Grow", 70], ["Flower", 100], ["Harvest", 120]],
  note: "A sun-loving Mediterranean perennial grown for its fragrant flowers. It needs sharp drainage and hates wet feet."
}, {
  id: "lemongrass",
  name: "Lemongrass",
  latin: "Cymbopogon citratus",
  type: "Herb",
  color: "#8AAE5A",
  clim: {
    warmth: 3
  },
  sun: "Full sun",
  water: 3,
  soil: "Rich, moist",
  ph: [6.0, 7.5],
  temp: [20, 33],
  germ: "from plants",
  maturity: 90,
  sow: [4, 5],
  stages: [["Plant", 0], ["Root", 25], ["Grass", 55], ["Clump", 75], ["Harvest", 90]],
  note: "A tropical grass that loves heat and humidity and is killed by frost. In cool climates, grow it in a pot to overwinter indoors."
}];
const MS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const MFULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const STAGE_INFO = {
  "Sow": "Seeds go into the soil or trays. Keep them warm and moist until they sprout.",
  "Plant": "A young plant, set, or tree goes into its final spot in the ground.",
  "Sprout": "The seed germinates and the first tiny shoots push through the soil.",
  "Seedling": "A small young plant with its first true leaves, finding its feet.",
  "Grow": "Leafy growth — the plant builds size and strength before it flowers or crops.",
  "Root": "The plant pours its energy into roots below ground.",
  "Leaf": "Leafy growth you can begin picking from.",
  "Climb": "The plant sends out shoots that need a support to scramble up.",
  "Vine": "Long trailing stems spread out and need room or a frame.",
  "Flower": "The plant blossoms — these flowers will set into fruit.",
  "Fruit": "Fruit forms and swells after the flowers fade.",
  "Foliage": "Leafy top growth fills out above ground.",
  "Tuber": "Tubers swell underground — the part you'll dig up to eat.",
  "Bulb": "The bulb fattens and ripens under the soil.",
  "Knee-high": "Plants are well established and shooting up fast — about knee height.",
  "Tassel": "Feathery flowers form at the top and shed pollen.",
  "Silk": "Silken threads catch the pollen so the cobs fill with kernels.",
  "Pod": "Pods form and fill — pick them while young and tender.",
  "Feather": "Soft, feathery leaves are ready to snip and use.",
  "Spread": "The plant spreads out to fill its space (and may need reining in).",
  "Bush": "The plant bushes out into a full, leafy shape.",
  "Grass": "Grassy blades grow up in a clump.",
  "Clump": "The clump thickens and is ready to harvest from.",
  "Harvest": "Ripe and ready to pick and eat.",
  "Establish": "The young tree settles in, growing roots and branches — no fruit yet.",
  "First fruit": "The tree is finally mature enough to bear its first real crop.",
  "Full crop": "The tree reaches full size and gives its biggest harvests every year."
};
const NOW = new Date().getMonth();
const shift = (a, n) => a.map(m => (m + n + 12) % 12);
function sowMonths(crop, loc) {
  if (!loc) return crop.sow;
  if (loc.hemi === "EQ") return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  if (loc.hemi === "S") return shift(crop.sow, 6);
  return crop.sow;
}
function harvestMonths(crop, loc) {
  if (loc && loc.hemi === "EQ") return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  if (crop.harvest) return loc && loc.hemi === "S" ? shift(crop.harvest, 6) : crop.harvest;
  const base = sowMonths(crop, loc);
  const off = Math.round(crop.maturity / 30);
  return base.map(m => (m + off) % 12);
}
function status(crop, loc) {
  if (!loc) return {
    kind: "none"
  };
  if (loc.hemi === "EQ") return {
    kind: "year"
  };
  const sm = sowMonths(crop, loc);
  if (sm.includes(NOW)) return {
    kind: "now"
  };
  const sorted = [...sm].sort((a, b) => a - b);
  const next = sorted.find(m => m > NOW);
  return {
    kind: "wait",
    month: next !== undefined ? next : sorted[0]
  };
}
function suitability(crop, loc) {
  if (!loc) return {
    ok: true,
    level: "fit"
  };
  // hard limits for perennials: climate survival / chill
  if (crop.clim) {
    const tier = loc.tier == null ? 2 : loc.tier;
    if (crop.clim.warmth != null && tier < crop.clim.warmth) return {
      ok: false,
      level: "unfit",
      short: "Too cool here",
      reason: `${crop.name} needs a warmer climate than ${loc.city} — it won't survive the cold or ripen fruit outdoors.`
    };
    if (crop.clim.chill && loc.chillWinter === false) return {
      ok: false,
      level: "unfit",
      short: "No winter chill",
      reason: `${crop.name} needs a cold winter to fruit, and ${loc.city} stays too warm year-round.`
    };
  }
  // soft warning for warm-season annuals: growing season may be too short to ripen outdoors
  if (!crop.perennial && crop.maturity && crop.temp && crop.temp[0] >= 17) {
    const days = parseInt((String(loc.len).match(/\d+/) || ["999"])[0], 10);
    if (days - crop.maturity < 50) return {
      ok: true,
      level: "marginal",
      short: "Short season",
      reason: `${loc.city}'s warm season is short for ${crop.name}, which needs about ${crop.maturity} days to mature. Start it indoors for a head start, or it may not ripen before the cold returns.`
    };
  }
  return {
    ok: true,
    level: "fit"
  };
}

/* --------------------------- crop glyphs -------------------------- */
function Glyph({
  id,
  size = 46
}) {
  const ink = "#1E342A";
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: ink,
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  if (id === "tomato") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "29",
    r: "12.5",
    fill: "#D9714F"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 16.5 24 12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 16.5c-2-3-5-3.5-7-3 1 3 3 4.5 7 4.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 16.5c2-3 5-3.5 7-3-1 3-3 4.5-7 4.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 27c1-2 3-3 5-3",
    stroke: "#FBF3E6"
  }));
  if (id === "carrot") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M24 41 16 19c5-3 11-3 16 0L24 41Z",
    fill: "#E0973A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 27h6M20 33h5",
    stroke: "#FBF3E6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 18 24 9M24 12c-3-2-6-2-8-1m8 4c3-2 6-2 8-1",
    stroke: "#4E7A4C"
  }));
  if (id === "strawberry") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M24 41c-7-2-11-8-11-14 0-3 5-5 11-5s11 2 11 5c0 6-4 12-11 14Z",
    fill: "#D64A41"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 22c-3-3-6-3.5-9-3 1 3.5 4 5 9 5 5 0 8-1.5 9-5-3-.5-6 0-9 3Z",
    fill: "#4E7A4C",
    stroke: "#4E7A4C"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "20",
    cy: "30",
    r: "0.9",
    fill: "#FBF3E6",
    stroke: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "27",
    cy: "31",
    r: "0.9",
    fill: "#FBF3E6",
    stroke: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "35",
    r: "0.9",
    fill: "#FBF3E6",
    stroke: "none"
  }));
  if (id === "lettuce") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M24 40c-9 0-14-5-14-11 3-2 6-1 8 1 1-4 4-6 6-6s5 2 6 6c2-2 5-3 8-1 0 6-5 11-14 11Z",
    fill: "#7FA86A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 24v16M16 31c3 2 5 5 5 9M32 31c-3 2-5 5-5 9",
    stroke: "#3C5E3A"
  }));
  if (id === "pepper") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M16 24c0 9 4 15 8 15s8-6 8-15c-3 1.5-5 1.5-8 1.5S19 25.5 16 24Z",
    fill: "#D9603A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 25.5V14M24 14c0-2 2-3 4-3M24 14c0-2-2-3-4-3",
    stroke: "#4E7A4C"
  }));
  if (id === "basil") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M24 41V19",
    stroke: "#4E7A4C"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 22c-3-4-8-4.5-11-3 .5 4 4 6.5 11 6.5Z",
    fill: "#7FA86A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 22c3-4 8-4.5 11-3-.5 4-4 6.5-11 6.5Z",
    fill: "#7FA86A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 31c-2.5-3-6-3.5-8.5-2.5.5 3 3 5 8.5 5Z",
    fill: "#8FB87A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 31c2.5-3 6-3.5 8.5-2.5-.5 3-3 5-8.5 5Z",
    fill: "#8FB87A"
  }));
  if (id === "cucumber") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("g", {
    transform: "rotate(12 24 24)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "18",
    y: "9",
    width: "12",
    height: "31",
    rx: "6",
    fill: "#7FA86A"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "22",
    cy: "16",
    r: "0.9",
    fill: "#3C5E3A",
    stroke: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "26",
    cy: "22",
    r: "0.9",
    fill: "#3C5E3A",
    stroke: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "22",
    cy: "28",
    r: "0.9",
    fill: "#3C5E3A",
    stroke: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "26",
    cy: "34",
    r: "0.9",
    fill: "#3C5E3A",
    stroke: "none"
  })), /*#__PURE__*/React.createElement("path", {
    d: "M22 8c0-2 1-3 3-3",
    stroke: "#4E7A4C"
  }));
  if (id === "eggplant") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M24 41c-5.5 0-9.5-4.5-9.5-10.5 0-7 4-13 9.5-15.5 5.5 2.5 9.5 8.5 9.5 15.5C33.5 36.5 29.5 41 24 41Z",
    fill: "#7A5290"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 15V9M24 14c-2 0-4-1-5-3M24 14c2 0 4-1 5-3",
    stroke: "#4E7A4C"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 26c1-2 3-3 5-3",
    stroke: "#FBF3E6"
  }));
  if (id === "pumpkin") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("ellipse", {
    cx: "24",
    cy: "29",
    rx: "14",
    ry: "11",
    fill: "#D9813A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18.5 19c-2 4-2 16 0 20M29.5 19c2 4 2 16 0 20M24 18v22",
    stroke: "#A85A1E"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 18c0-3-1-5 1-7",
    stroke: "#4E7A4C"
  }));
  if (id === "blueberry") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M27 19c4-4 8-4 11-3-1 4-4 7-9 7",
    fill: "#7FA86A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M23 23c0-4 2-7 5-9",
    stroke: "#4E7A4C"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "29",
    r: "6",
    fill: "#5E6FA8"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "30",
    cy: "31",
    r: "5.5",
    fill: "#48578C"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "36",
    r: "5.5",
    fill: "#5E6FA8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 26.5v2.5M17.5 27.5l1.5 1M20.5 27.5l-1.5 1",
    stroke: "#2E3A6A",
    strokeWidth: "1"
  }));
  if (id === "potato") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M13 27c-1-7 5-12 13-11 7 1 10 5 9 12s-7 9-14 8-7-3-8-9Z",
    fill: "#C49A66"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 25l1.5 1.5M27 23l1.5 1.5M25 31l1.5 1.5",
    stroke: "#7A5A30",
    strokeWidth: "1.4"
  }));
  if (id === "onion") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M24 41c-7 0-11-5-11-11 0-6 5-11 11-11s11 5 11 11c0 6-4 11-11 11Z",
    fill: "#C9824C"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 21c1 6 1 13 0 18M24 19v22M29 21c-1 6-1 13 0 18",
    stroke: "#9A5A2E"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 19c0-4-2-7-4-9M24 19c0-4 2-7 4-9M24 19v-9",
    stroke: "#4E7A4C"
  }));
  if (id === "spinach") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M24 41c-9-3-12-12-9-22 2-6 6-8 9-8s7 2 9 8c3 10 0 19-9 22Z",
    fill: "#4E7A4C"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 12v28M24 21c-3 1-5 3-6 6M24 21c3 1 5 3 6 6M24 31c-3 1-5 3-6 6M24 31c3 1 5 3 6 6",
    stroke: "#2E4A2E"
  }));
  if (id === "pea") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("g", {
    transform: "rotate(32 24 25)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "20",
    width: "20",
    height: "10",
    rx: "5",
    fill: "#7FA86A"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "25",
    r: "2.3",
    fill: "#4E7A4C",
    stroke: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "25",
    r: "2.3",
    fill: "#4E7A4C",
    stroke: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "29",
    cy: "25",
    r: "2.3",
    fill: "#4E7A4C",
    stroke: "none"
  })), /*#__PURE__*/React.createElement("path", {
    d: "M16 17c-3-1-5-4-4-8",
    stroke: "#4E7A4C"
  }));
  if (id === "radish") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M14 25c0-5 4-9 10-9s10 4 10 9c0 4-2 7-5 9l-5 9-5-9c-3-2-5-5-5-9Z",
    fill: "#C24A60"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 40l3 5 3-5",
    fill: "#F2EAD7",
    stroke: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 16c0-4-2-7-5-9M24 16c0-4 2-7 5-9M24 16V7",
    stroke: "#4E7A4C"
  }));
  if (id === "mint") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M24 41V13",
    stroke: "#4E7A4C"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 13c-2-2-2-5 0-7 2 2 2 5 0 7Z",
    fill: "#7FA86A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 21c-3-3-7-3.5-10-2 .5 3.5 4 6.5 10 6.5Z",
    fill: "#7FA86A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 21c3-3 7-3.5 10-2-.5 3.5-4 6.5-10 6.5Z",
    fill: "#7FA86A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 31c-2.5-3-6-3.5-8.5-2 .5 3 3 5.5 8.5 5.5Z",
    fill: "#8FB87A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 31c2.5-3 6-3.5 8.5-2-.5 3-3 5.5-8.5 5.5Z",
    fill: "#8FB87A"
  }));
  if (id === "apple") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M24 18c-3-3-8-3-10 0-3 4-2 12 2 17 2 3 4 4 8 4s6-1 8-4c4-5 5-13 2-17-3-3-7-3-10 0Z",
    fill: "#C0413E"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 18v-6",
    stroke: "#5A4632"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 13c2-3 6-4 9-3-1 4-5 5-9 4Z",
    fill: "#7FA86A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 25c1-2 3-3 5-3",
    stroke: "#FBF3E6"
  }));
  if (id === "banana") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M16 13c-1 0-2 1-1 3 3 12 11 19 21 19 2 0 3-2 1-4-1-1-3-1-5-2-7-3-12-9-13-16 0-2-1-3-3-3Z",
    fill: "#E6B62E"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 14c1 9 8 16 17 18",
    stroke: "#B98E1E"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M37 35c1 1 1 2 0 3",
    stroke: "#5A4632"
  }));
  if (id === "lemon") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("g", {
    transform: "rotate(-26 24 27)"
  }, /*#__PURE__*/React.createElement("ellipse", {
    cx: "24",
    cy: "27",
    rx: "13",
    ry: "9",
    fill: "#D9CF3A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11 27h-2.5M37 27h2.5",
    stroke: "#B0A81E"
  })), /*#__PURE__*/React.createElement("path", {
    d: "M30 16c3-3 7-3 9-2-1 4-5 5-9 3Z",
    fill: "#7FA86A"
  }));
  if (id === "orange") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("circle", {
    cx: "23",
    cy: "28",
    r: "13",
    fill: "#E58A2A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M23 15v-4",
    stroke: "#5A4632"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M23 12c2-3 6-3 8-2-1 4-5 4-8 2Z",
    fill: "#7FA86A"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "23",
    cy: "15",
    r: "1",
    fill: "#B86A1E",
    stroke: "none"
  }));
  if (id === "cherry") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M20 17c4 4 4 9 0 16M28 15c-2 6 0 11 4 14",
    stroke: "#5A4632"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 15c2-3 6-3 8-1-1 3-5 4-8 1Z",
    fill: "#7FA86A"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "35",
    r: "6",
    fill: "#A8324A"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "31",
    cy: "33",
    r: "6",
    fill: "#B23A52"
  }));
  if (id === "mango") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M30 15c5 2 8 7 7 14-1 7-7 11-14 10-6-1-10-6-9-13 1-8 9-13 16-11Z",
    fill: "#DD6E3A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M30 15c-1-1-1-3 1-4",
    stroke: "#5A4632"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M22 24c2-2 5-2 7-1",
    stroke: "#F2C84A"
  }));
  if (id === "watermelon") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("ellipse", {
    cx: "24",
    cy: "26",
    rx: "14",
    ry: "12",
    fill: "#5AA152"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 19c-1 5-1 10 0 15M20 16c-1 7-1 13 0 20M28 16c1 7 1 13 0 20M34 19c1 5 1 10 0 15",
    stroke: "#2E5E33"
  }));
  if (id === "melon") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "26",
    r: "13",
    fill: "#D7B06A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13 22h22M12 28h24M16 18c-2 6-2 11 0 17M24 14v24M32 18c2 6 2 11 0 17",
    stroke: "#A9824A",
    strokeWidth: "1.2"
  }));
  if (id === "sweetcorn") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M24 9c5 0 8 6 8 15s-3 15-8 15-8-6-8-15 3-15 8-15Z",
    fill: "#E0B83E"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 16v22M24 14v26M28 16v22M17 20h14M16 26h16M17 32h14",
    stroke: "#B58E1E",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 33c-4 2-7 6-8 11 5-1 9-4 11-9Z",
    fill: "#7FA86A"
  }));
  if (id === "sweetpotato") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M12 30c-2-6 3-12 11-13 6-1 13 2 13 8 0 7-8 12-16 11-5-1-7-2-8-6Z",
    fill: "#C2703C"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 26l1.2 1.6M27 24l1.2 1.6",
    stroke: "#8A4E26",
    strokeWidth: "1.3"
  }));
  if (id === "butternut") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M24 8c-2 0-3 2-3 5v10c0 3-3 4-4 7-2 4-1 9 1 11 2 3 10 3 12 0 2-2 3-7 1-11-1-3-4-4-4-7V13c0-3-1-5-3-5Z",
    fill: "#D2A862"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 8c0-2 2-3 4-2",
    stroke: "#5A4632"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 33c4 2 8 2 12 0",
    stroke: "#A9824A",
    strokeWidth: "1.1"
  }));
  if (id === "okra") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M24 8c-2 4-3 10-3 16 0 8 1 14 3 16 2-2 3-8 3-16 0-6-1-12-3-16Z",
    fill: "#5E8C3F"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 14v26M20 20c0 8 0 13 1 17M28 20c0 8 0 13-1 17",
    stroke: "#3C6E2E",
    strokeWidth: "1.1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 9c-2-1-4-1-5 1M24 9c2-1 4-1 5 1",
    stroke: "#4E7A4C"
  }));
  if (id === "parsley") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M24 41V24",
    stroke: "#4E7A4C"
  }), /*#__PURE__*/React.createElement("g", {
    fill: "#4A8A48"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "13",
    r: "5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "16",
    cy: "19",
    r: "5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "32",
    cy: "19",
    r: "5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "20",
    cy: "25",
    r: "4.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "28",
    cy: "25",
    r: "4.5"
  })));
  if (id === "cilantro") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M24 41V20",
    stroke: "#4E7A4C"
  }), /*#__PURE__*/React.createElement("g", {
    fill: "#5FA050"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M24 20c-2-4-6-6-10-6 0 5 4 8 10 8Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 20c2-4 6-6 10-6 0 5-4 8-10 8Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 14c-2-3-5-4-8-4 0 4 3 6 8 6Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 14c2-3 5-4 8-4 0 4-3 6-8 6Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 9c-1-2-3-3-5-3 0 3 2 4 5 4Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 9c1-2 3-3 5-3 0 3-2 4-5 4Z"
  })));
  if (id === "rosemary") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M24 41V8",
    stroke: "#6F8F72"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 14l-5-3M24 14l5-3M24 20l-6-2M24 20l6-2M24 26l-6-2M24 26l6-2M24 32l-5-2M24 32l5-2",
    stroke: "#6F8F72",
    strokeWidth: "1.6"
  }));
  if (id === "thyme") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M24 41V16",
    stroke: "#6B8E5A"
  }), /*#__PURE__*/React.createElement("g", {
    fill: "#7FA86A",
    stroke: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "15",
    cy: "30",
    r: "1.7"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "33",
    cy: "30",
    r: "1.7"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "16",
    cy: "24",
    r: "1.6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "32",
    cy: "24",
    r: "1.6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "18",
    r: "1.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "30",
    cy: "18",
    r: "1.5"
  })));
  if (id === "sage") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M24 41V18",
    stroke: "#8AA07E"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "17",
    cy: "22",
    rx: "6",
    ry: "3",
    fill: "#9CB090",
    transform: "rotate(-25 17 22)"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "31",
    cy: "20",
    rx: "6",
    ry: "3",
    fill: "#9CB090",
    transform: "rotate(25 31 20)"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "24",
    cy: "13",
    rx: "3.5",
    ry: "6",
    fill: "#9CB090"
  }));
  if (id === "oregano") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M24 41V12",
    stroke: "#5E8C4E"
  }), /*#__PURE__*/React.createElement("g", {
    fill: "#7FA86A"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "30",
    r: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "30",
    cy: "30",
    r: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "22",
    r: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "30",
    cy: "22",
    r: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "20",
    cy: "15",
    r: "2.6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "28",
    cy: "15",
    r: "2.6"
  })));
  if (id === "chives") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M20 41C16 30 16 20 18 11M24 41C23 28 23 18 24 9M28 41C32 30 32 20 30 13",
    stroke: "#5A9A5E"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "9",
    r: "3.5",
    fill: "#9488BE"
  }));
  if (id === "dill") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M24 41V18",
    stroke: "#69A24A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 18C18 16 13 12 11 6M24 18c6-2 11-6 13-12M24 24c-5-1-9-4-11-9M24 24c5-1 9-4 11-9M24 30c-4-1-7-3-9-7M24 30c4-1 7-3 9-7",
    stroke: "#69A24A",
    strokeWidth: "1.3"
  }));
  if (id === "lavender") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M16 41C15 30 15 22 16 16M24 41V12M32 41c1-11 1-19 0-25",
    stroke: "#7E9A6E"
  }), /*#__PURE__*/React.createElement("g", {
    fill: "#9488BE",
    stroke: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "13.5",
    y: "9",
    width: "5",
    height: "9",
    rx: "2.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "21.5",
    y: "5",
    width: "5",
    height: "9",
    rx: "2.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "29.5",
    y: "9",
    width: "5",
    height: "9",
    rx: "2.5"
  })));
  if (id === "lemongrass") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M24 41C20 30 16 20 10 13M24 41C22 29 20 18 18 10M24 41V8M24 41c2-12 4-23 6-31M24 41c4-11 8-21 14-28",
    stroke: "#8AAE5A"
  }));
  return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M24 41V23",
    stroke: "#4E7A4C"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 27c-4-4-9-4-12-2 1 4 5 6 12 6Z",
    fill: "#7FA86A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24 25c3-3 7-3 10-1-1 3-4 5-10 5Z",
    fill: "#7FA86A"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "19",
    r: "3.5",
    fill: "#BD5736"
  }));
}

/* ----------------------- small UI fragments ---------------------- */
const tint = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
};
function WaterDots({
  level
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      gap: 4
    }
  }, [1, 2, 3].map(i => /*#__PURE__*/React.createElement("svg", {
    key: i,
    className: "drop",
    viewBox: "0 0 13 17"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6.5 0C6.5 0 1 6.5 1 11a5.5 5.5 0 0 0 11 0C12 6.5 6.5 0 6.5 0Z",
    fill: i <= level ? "var(--moss)" : "none",
    stroke: "var(--moss)",
    strokeWidth: "1.4"
  }))));
}

/* days elapsed since sowing -> current stage + position, for annual crops */
function progressFor(crop, sownAt) {
  if (!sownAt || !crop.stages) return null;
  const total = crop.stages[crop.stages.length - 1][1] || 1;
  const days = Math.max(0, Math.floor((Date.now() - sownAt) / 86400000));
  let idx = 0;
  for (let i = 0; i < crop.stages.length; i++) {
    if (crop.stages[i][1] <= days) idx = i;
  }
  const done = days >= total;
  return {
    days,
    total,
    idx,
    done,
    stage: crop.stages[idx][0],
    pct: Math.min(100, days / total * 100)
  };
}

/* control on the detail screen to set/clear when a crop was sown */
function SowControl({
  crop,
  sownAt,
  onSet
}) {
  const todayStr = new Date().toISOString().slice(0, 10);
  if (sownAt) {
    const dateStr = new Date(sownAt).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
    const p = crop.perennial ? null : progressFor(crop, sownAt);
    const ready = p ? p.done : false;
    let line;
    if (crop.perennial) {
      const days = Math.max(0, Math.floor((Date.now() - sownAt) / 86400000));
      const months = Math.floor(days / 30);
      line = months >= 1 ? `Planted ${dateStr} · about ${months} ${months === 1 ? "month" : "months"} in` : `Planted ${dateStr} · ${days} ${days === 1 ? "day" : "days"} in`;
    } else {
      line = ready ? `Sown ${dateStr}` : `Sown ${dateStr} · day ${p.days}, ${p.stage.toLowerCase()}`;
    }
    const bg = ready ? tint("#BE8E2C", .16) : tint("#4E7A4C", .10);
    const bd = ready ? tint("#BE8E2C", .45) : tint("#4E7A4C", .3);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12,
        background: bg,
        border: `1px solid ${bd}`,
        borderRadius: 14,
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, ready ? /*#__PURE__*/React.createElement(Check, {
      size: 18,
      color: "var(--ochre)"
    }) : /*#__PURE__*/React.createElement(Sprout, {
      size: 18,
      color: "var(--moss)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 14,
        color: "var(--ink)"
      }
    }, ready && /*#__PURE__*/React.createElement("b", {
      style: {
        display: "block",
        fontSize: 14.5,
        color: "#8A6716"
      }
    }, "Ready to harvest"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: ready ? 500 : 600,
        color: ready ? "var(--ink2)" : "var(--ink)",
        fontSize: ready ? 12.5 : 14
      }
    }, line)), /*#__PURE__*/React.createElement("button", {
      className: "iconbtn",
      onClick: () => onSet(null),
      "aria-label": "Clear date"
    }, /*#__PURE__*/React.createElement(X, {
      size: 16
    })));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      background: "var(--card2)",
      border: "1px solid var(--line)",
      borderRadius: 14,
      padding: "12px 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: "var(--ink2)",
      marginBottom: 10
    }
  }, "Track its growth \u2014 when did you ", crop.perennial ? "plant" : "sow", " it?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "chip on",
    onClick: () => onSet(Date.now()),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Sprout, {
    size: 14
  }), " ", crop.perennial ? "Planted" : "Sown", " today"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--muted)"
    }
  }, "or pick a date"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    max: todayStr,
    onChange: e => {
      if (e.target.value) onSet(new Date(e.target.value).getTime());
    },
    style: {
      fontFamily: "inherit",
      fontSize: 13,
      padding: "7px 10px",
      borderRadius: 9,
      border: "1px solid var(--line)",
      background: "var(--paper)",
      color: "var(--ink)"
    }
  })));
}
function StatusBadge({
  st,
  perennial
}) {
  const [open, setOpen] = useState(false);
  if (st.kind !== "now" && st.kind !== "year" && st.kind !== "wait") return null;
  const verb = perennial ? "plant" : "sow";
  const Verb = perennial ? "Plant" : "Sow";
  const wait = st.kind === "wait";
  const bg = wait ? tint("#BE8E2C", .18) : tint("#4E7A4C", .16);
  const col = wait ? "#8A6716" : "#3C5E3A";
  const accent = wait ? "var(--ochre)" : "var(--moss)";
  let label, info;
  if (st.kind === "now") {
    label = `Good to ${verb} now`;
    info = `The current month falls inside this crop's ${verb}ing window for your city, so now's a good time to ${verb} it.`;
  } else if (st.kind === "year") {
    label = `${Verb} year-round`;
    info = `Your climate is mild enough to ${verb} this in any month — there's no cold season to wait out.`;
  } else {
    label = `Best ${perennial ? "planted" : "sown"} in ${MFULL[st.month]}`;
    info = `Now isn't the ideal time. This crop's ${verb}ing window for your city opens in ${MFULL[st.month]} — ${verb} it then so it grows in the right conditions.`;
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-block"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "statusbadge",
    onClick: e => {
      e.stopPropagation();
      setOpen(o => !o);
    },
    style: {
      background: bg,
      color: col,
      cursor: "pointer"
    }
  }, wait ? /*#__PURE__*/React.createElement(CalendarDays, {
    size: 14
  }) : /*#__PURE__*/React.createElement(Sprout, {
    size: 14
  }), " ", label, " ", /*#__PURE__*/React.createElement(Info, {
    size: 12,
    style: {
      opacity: .55
    }
  })), open && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      background: "var(--card)",
      border: "1px solid var(--line)",
      borderLeft: `3px solid ${accent}`,
      borderRadius: 12,
      padding: "10px 13px",
      maxWidth: 330,
      animation: "fade .25s ease both"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      color: "var(--ink2)",
      lineHeight: 1.45
    }
  }, info)));
}

/* ----------------------- growth timeline ------------------------- */
function Timeline({
  crop,
  sownAt
}) {
  const total = crop.stages[crop.stages.length - 1][1] || 1;
  const [sel, setSel] = useState(null);
  const prog = sownAt ? progressFor(crop, sownAt) : null;
  const ppct = prog ? prog.pct : 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "6px 4px 2px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 4,
      borderRadius: 4,
      background: "var(--line)",
      marginTop: prog ? 44 : 30
    }
  }, prog ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: `${ppct}%`,
      borderRadius: 4,
      background: "linear-gradient(90deg,var(--moss),var(--ochre) 80%,var(--clay))",
      transition: "width .6s ease"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: 4,
      transformOrigin: "left",
      background: "linear-gradient(90deg,var(--moss),var(--ochre) 60%,var(--clay))",
      animation: "draw 1.1s .15s cubic-bezier(.2,.7,.3,1) both"
    }
  }), prog && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: `${ppct}%`,
      top: "50%",
      transform: "translate(-50%,-50%)",
      zIndex: 3
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: prog.done ? "readydot" : "nowdot",
    style: {
      width: 18,
      height: 18,
      borderRadius: "50%",
      background: prog.done ? "var(--ochre)" : "var(--clay)",
      border: "3px solid var(--paper)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      top: -30,
      whiteSpace: "nowrap",
      background: prog.done ? "var(--ochre)" : "var(--clay)",
      color: "#fff",
      fontSize: 10,
      fontWeight: 700,
      padding: "3px 7px",
      borderRadius: 7
    }
  }, prog.done ? "READY" : `DAY ${prog.days}`)), crop.stages.map(([lbl, day], i) => {
    const pct = day / total * 100;
    const tx = i === 0 ? "0" : i === crop.stages.length - 1 ? "-100%" : "-50%";
    const align = i === 0 ? "left" : i === crop.stages.length - 1 ? "right" : "center";
    const on = sel === i;
    const reached = prog ? day <= prog.days : false;
    const cur = prog ? i === prog.idx && !prog.done : false;
    const dotBg = on ? "var(--clay)" : reached ? "var(--moss)" : "var(--paper)";
    const dotBorder = on ? "var(--clay)" : reached ? "var(--moss)" : "var(--ink)";
    return /*#__PURE__*/React.createElement("div", {
      key: lbl,
      onClick: e => {
        e.stopPropagation();
        setSel(on ? null : i);
      },
      style: {
        position: "absolute",
        left: `${pct}%`,
        top: "50%",
        transform: "translate(-50%,-50%)",
        cursor: "pointer",
        zIndex: cur ? 2 : 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: -18,
        top: -18,
        width: 36,
        height: 36
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: on ? 15 : 13,
        height: on ? 15 : 13,
        borderRadius: "50%",
        background: dotBg,
        border: `3px solid ${dotBorder}`,
        animation: prog ? "none" : `pop .4s ${.3 + i * 0.12}s both`,
        transition: "all .15s"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 0,
        transform: `translateX(${tx})`,
        top: -26,
        whiteSpace: "nowrap",
        textAlign: align
      },
      className: "mono"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: "var(--ink)"
      }
    }, day)), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 0,
        transform: `translateX(${tx})`,
        top: 18,
        whiteSpace: "nowrap",
        textAlign: align,
        fontSize: 10.5,
        color: on ? "var(--clay)" : cur ? "var(--ink)" : "var(--muted)",
        fontWeight: on || cur ? 700 : 600
      }
    }, lbl));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 26
    }
  }), /*#__PURE__*/React.createElement(StageHelper, {
    sel: sel,
    label: sel !== null ? crop.stages[sel][0] : null,
    extra: sel !== null ? `Around day ${crop.stages[sel][1]}` : null,
    onClose: () => setSel(null)
  }));
}

/* helper card shown when a timeline stage is tapped */
function StageHelper({
  sel,
  label,
  extra,
  onClose
}) {
  if (sel === null) return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      color: "var(--muted)",
      fontSize: 12,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(Info, {
    size: 13
  }), " ", /*#__PURE__*/React.createElement("span", null, "Tap a stage to see what it means"));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      background: "var(--card)",
      border: "1px solid var(--line)",
      borderLeft: "3px solid var(--clay)",
      borderRadius: 12,
      padding: "11px 13px",
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      animation: "fade .25s ease both"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "fr",
    style: {
      fontSize: 15,
      fontWeight: 600
    }
  }, label), extra && /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10,
      color: "var(--muted)"
    }
  }, extra)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "4px 0 0",
      fontSize: 13,
      color: "var(--ink2)",
      lineHeight: 1.45
    }
  }, STAGE_INFO[label] || "A stage in this crop's growth.")), /*#__PURE__*/React.createElement("button", {
    className: "iconbtn",
    onClick: e => {
      e.stopPropagation();
      onClose();
    },
    "aria-label": "Close",
    style: {
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(X, {
    size: 15
  })));
}

/* --------------------- perennial (tree) timeline ----------------- */
/* parse an arc time sublabel ("Yr 2–4", "~6 mo", "1–2 yr") into years */
function subYears(s) {
  s = String(s).toLowerCase();
  const mo = s.match(/(\d+)\s*mo/);
  if (mo) return +mo[1] / 12;
  const yb = s.match(/yr\s*(\d+)/);
  if (yb) return +yb[1];
  const ya = s.match(/(\d+)\s*(?:–|-)?\s*\d*\s*yr/);
  if (ya) return +ya[1];
  return 0;
}
function perennialProgress(crop, sownAt) {
  if (!sownAt || !crop.arc) return null;
  const a = crop.arc,
    n = a.length;
  const thr = a.map(x => subYears(x[1]));
  const years = (Date.now() - sownAt) / (86400000 * 365.25);
  if (years >= thr[n - 1]) return {
    pos: 100,
    idx: n - 1,
    done: true,
    years
  };
  let i = 0;
  while (i < n - 1 && years >= thr[i + 1]) i++;
  const span = thr[i + 1] - thr[i] || 1;
  const frac = Math.max(0, Math.min(1, (years - thr[i]) / span));
  return {
    pos: (i + frac) / (n - 1) * 100,
    idx: i,
    done: false,
    years
  };
}
function PerennialTimeline({
  crop,
  sownAt
}) {
  const a = crop.arc;
  const n = a.length;
  const [sel, setSel] = useState(null);
  const prog = sownAt ? perennialProgress(crop, sownAt) : null;
  const ppct = prog ? prog.pos : 0;
  const thr = a.map(x => subYears(x[1]));
  const markLbl = prog ? prog.done ? "CROPPING" : prog.years < 2 ? `${Math.max(0, Math.round(prog.years * 12))} MO` : `YR ${Math.round(prog.years)}` : "";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "6px 4px 2px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 4,
      borderRadius: 4,
      background: "var(--line)",
      marginTop: prog ? 44 : 30
    }
  }, prog ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: `${ppct}%`,
      borderRadius: 4,
      background: "linear-gradient(90deg,var(--moss),var(--ochre) 80%,var(--clay))",
      transition: "width .6s ease"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: 4,
      transformOrigin: "left",
      background: "linear-gradient(90deg,var(--moss),var(--ochre) 60%,var(--clay))",
      animation: "draw 1.1s .15s cubic-bezier(.2,.7,.3,1) both"
    }
  }), prog && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: `${ppct}%`,
      top: "50%",
      transform: "translate(-50%,-50%)",
      zIndex: 3
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: prog.done ? "readydot" : "nowdot",
    style: {
      width: 18,
      height: 18,
      borderRadius: "50%",
      background: prog.done ? "var(--ochre)" : "var(--clay)",
      border: "3px solid var(--paper)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      top: -30,
      whiteSpace: "nowrap",
      background: prog.done ? "var(--ochre)" : "var(--clay)",
      color: "#fff",
      fontSize: 10,
      fontWeight: 700,
      padding: "3px 7px",
      borderRadius: 7
    }
  }, markLbl)), a.map(([lbl, sub], i) => {
    const pct = n === 1 ? 0 : i / (n - 1) * 100;
    const tx = i === 0 ? "0" : i === n - 1 ? "-100%" : "-50%";
    const align = i === 0 ? "left" : i === n - 1 ? "right" : "center";
    const on = sel === i;
    const reached = prog ? prog.years >= thr[i] : false;
    const cur = prog ? i === prog.idx && !prog.done : false;
    const dotBg = on ? "var(--clay)" : reached ? "var(--moss)" : "var(--paper)";
    const dotBorder = on ? "var(--clay)" : reached ? "var(--moss)" : "var(--ink)";
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: e => {
        e.stopPropagation();
        setSel(on ? null : i);
      },
      style: {
        position: "absolute",
        left: `${pct}%`,
        top: "50%",
        transform: "translate(-50%,-50%)",
        cursor: "pointer",
        zIndex: cur ? 2 : 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: -18,
        top: -18,
        width: 36,
        height: 36
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: on ? 15 : 13,
        height: on ? 15 : 13,
        borderRadius: "50%",
        background: dotBg,
        border: `3px solid ${dotBorder}`,
        animation: prog ? "none" : `pop .4s ${.3 + i * 0.12}s both`,
        transition: "all .15s"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 0,
        transform: `translateX(${tx})`,
        top: -24,
        whiteSpace: "nowrap",
        textAlign: align,
        fontSize: 11,
        fontWeight: 700,
        color: on ? "var(--clay)" : cur ? "var(--ink)" : "var(--ink)"
      }
    }, lbl), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 0,
        transform: `translateX(${tx})`,
        top: 18,
        whiteSpace: "nowrap",
        textAlign: align,
        fontSize: 10,
        color: "var(--muted)",
        fontWeight: 600
      },
      className: "mono"
    }, sub));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 26
    }
  }), /*#__PURE__*/React.createElement(StageHelper, {
    sel: sel,
    label: sel !== null ? a[sel][0] : null,
    extra: sel !== null ? a[sel][1] : null,
    onClose: () => setSel(null)
  }));
}
function PhBar({
  range
}) {
  const lo = 4,
    hi = 9;
  const left = (range[0] - lo) / (hi - lo) * 100;
  const w = (range[1] - range[0]) / (hi - lo) * 100;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 8,
      borderRadius: 6,
      background: "linear-gradient(90deg,#C25A2E,#BE8E2C,#4E7A4C,#3a6f8a)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: -3,
      height: 14,
      left: `${left}%`,
      width: `${w}%`,
      border: "2px solid var(--ink)",
      borderRadius: 6,
      background: tint("#1E342A", .06)
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 9.5,
      color: "var(--muted)",
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", null, "acidic 4"), /*#__PURE__*/React.createElement("span", null, "7 neutral"), /*#__PURE__*/React.createElement("span", null, "9 alkaline")));
}
function SoilSpec({
  crop
}) {
  const [open, setOpen] = useState(false);
  const mid = (crop.ph[0] + crop.ph[1]) / 2;
  const desc = mid < 5.5 ? "acidic" : mid < 6.5 ? "slightly acidic" : mid <= 7.2 ? "near-neutral" : "slightly alkaline";
  return /*#__PURE__*/React.createElement("div", {
    className: "spec",
    style: {
      gridColumn: "1 / -1",
      cursor: "pointer"
    },
    onClick: () => setOpen(o => !o)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(FlaskConical, {
    size: 16,
    color: "var(--clay)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "Soil \xB7 ", crop.soil)), /*#__PURE__*/React.createElement(Info, {
    size: 14,
    color: "var(--muted)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      marginTop: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 15
    }
  }, "pH ", crop.ph[0].toFixed(1), " \u2013 ", crop.ph[1].toFixed(1)), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10.5,
      color: "var(--muted)"
    }
  }, desc)), /*#__PURE__*/React.createElement(PhBar, {
    range: crop.ph
  }), open && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      paddingTop: 12,
      borderTop: "1px solid var(--line)",
      animation: "fade .25s ease both"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      color: "var(--ink2)",
      lineHeight: 1.5
    }
  }, "Soil pH measures acidity on a 0\u201314 scale: under 7 is acidic, 7 is neutral, over 7 is alkaline. ", crop.name, " prefers ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--ink)"
    }
  }, desc), " soil (pH ", crop.ph[0].toFixed(1), "\u2013", crop.ph[1].toFixed(1), ")", mid < 5.5 ? " — it needs genuinely acidic ground, so use ericaceous (lime-free) compost if your soil is neutral or chalky" : "", "."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 0",
      fontSize: 13,
      color: "var(--ink2)",
      lineHeight: 1.5
    }
  }, "A cheap test kit tells you where your soil sits. Add garden lime to raise the pH, or sulphur and ericaceous compost to lower it. The \"", crop.soil, "\" note describes the texture it likes \u2014 loam is the balanced ideal, sandy soil drains fast, and \"rich\" means plenty of compost dug in.")));
}
function SunSpec({
  crop
}) {
  const [open, setOpen] = useState(false);
  const part = /part/i.test(crop.sun);
  const advice = part ? "It'll take a few hours of shade — handy in hot climates, where a little afternoon shade stops leafy crops scorching and running to seed." : "Give it the sunniest spot you have. Too little light and it grows leggy and pale, with few flowers or fruit.";
  return /*#__PURE__*/React.createElement("div", {
    className: "spec",
    style: {
      gridColumn: "1 / -1",
      cursor: "pointer"
    },
    onClick: () => setOpen(o => !o)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Sun, {
    size: 16,
    color: "var(--ochre)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "Sunlight")), /*#__PURE__*/React.createElement(Info, {
    size: 14,
    color: "var(--muted)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15,
      marginTop: 7
    }
  }, crop.sun), open && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      paddingTop: 12,
      borderTop: "1px solid var(--line)",
      animation: "fade .25s ease both"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      color: "var(--ink2)",
      lineHeight: 1.5
    }
  }, "Full sun means at least six hours of direct sun a day; part shade is roughly three to six hours, or dappled light. ", crop.name, " wants ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--ink)"
    }
  }, crop.sun.toLowerCase()), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 0",
      fontSize: 13,
      color: "var(--ink2)",
      lineHeight: 1.5
    }
  }, advice)));
}
function CalendarLegend({
  plantLabel = "Sow"
}) {
  const [sel, setSel] = useState(null);
  const items = [{
    key: "plant",
    label: plantLabel,
    swatch: "var(--clay)",
    info: `The months to ${plantLabel.toLowerCase().replace(' / plant', '/plant')} this crop where you live. Get it in within this window and it has time to grow before the cold returns.`
  }, {
    key: "harvest",
    label: "Harvest",
    swatch: tint("#BE8E2C", .85),
    info: "When the crop is usually ready to pick in your area. For trees, this is the season once the plant is mature."
  }, {
    key: "now",
    label: "This month",
    outline: true,
    info: "The outlined column is the current month, so you can see at a glance what needs doing right now."
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      marginTop: 10,
      fontSize: 11.5,
      color: "var(--ink2)",
      flexWrap: "wrap"
    }
  }, items.map((it, i) => {
    const on = sel === i;
    return /*#__PURE__*/React.createElement("span", {
      key: it.key,
      onClick: () => setSel(on ? null : i),
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        fontWeight: on ? 700 : 400,
        color: on ? "var(--ink)" : "var(--ink2)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 11,
        height: 11,
        borderRadius: 3,
        background: it.outline ? "transparent" : it.swatch,
        border: it.outline ? "2px solid var(--ink)" : "none"
      }
    }), " ", it.label);
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      color: "var(--muted)"
    }
  }, /*#__PURE__*/React.createElement(Info, {
    size: 12
  }))), sel !== null && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      background: "var(--card)",
      border: "1px solid var(--line)",
      borderLeft: "3px solid var(--clay)",
      borderRadius: 12,
      padding: "10px 13px",
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      animation: "fade .25s ease both"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      flex: 1,
      fontSize: 13,
      color: "var(--ink2)",
      lineHeight: 1.45
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--ink)"
    }
  }, items[sel].label, "."), " ", items[sel].info), /*#__PURE__*/React.createElement("button", {
    className: "iconbtn",
    onClick: () => setSel(null),
    "aria-label": "Close",
    style: {
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(X, {
    size: 15
  }))));
}
function WaterSpec({
  crop
}) {
  const [open, setOpen] = useState(false);
  const level = crop.water;
  const name = ["", "Low", "Moderate", "High"][level];
  const advice = level === 1 ? "Let the soil dry out between waterings — these plants resent soggy roots. A deep soak now and then beats little-and-often." : level === 2 ? "Keep the soil evenly moist but never waterlogged. Water when the top couple of centimetres feel dry, more often in hot, dry spells." : "A thirsty crop that wants consistently moist soil. Water often, especially in heat, and mulch to lock moisture in.";
  return /*#__PURE__*/React.createElement("div", {
    className: "spec",
    style: {
      gridColumn: "1 / -1",
      cursor: "pointer"
    },
    onClick: () => setOpen(o => !o)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Droplets, {
    size: 16,
    color: "var(--moss)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "Water")), /*#__PURE__*/React.createElement(Info, {
    size: 14,
    color: "var(--muted)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15,
      margin: "7px 0 8px"
    }
  }, name), /*#__PURE__*/React.createElement(WaterDots, {
    level: level
  }), open && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      paddingTop: 12,
      borderTop: "1px solid var(--line)",
      animation: "fade .25s ease both"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      color: "var(--ink2)",
      lineHeight: 1.5
    }
  }, "The drops show how much water a crop wants \u2014 one is low, three is high. ", crop.name, " is ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--ink)"
    }
  }, name.toLowerCase()), ". ", advice), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 0",
      fontSize: 13,
      color: "var(--ink2)",
      lineHeight: 1.5
    }
  }, "Pots and sandy soil dry out fastest, so check those more often. Water in the morning and aim at the roots rather than the leaves.")));
}
function TempSpec({
  crop
}) {
  const [open, setOpen] = useState(false);
  const f = c => Math.round(c * 9 / 5 + 32);
  const warm = crop.temp[0] >= 17;
  const cool = !warm && crop.temp[0] <= 16 && crop.temp[1] <= 24;
  const note = warm ? "This is a warm-season crop — cold checks its growth and frost will kill it, so wait until your nights are reliably mild before planting out." : cool ? "This is a cool-season crop — it shrugs off chilly weather but tends to bolt (run to seed) and turn bitter in summer heat." : "It copes with a fairly wide band, but still wants shelter from hard frost and scorching heat.";
  return /*#__PURE__*/React.createElement("div", {
    className: "spec",
    style: {
      gridColumn: "1 / -1",
      cursor: "pointer"
    },
    onClick: () => setOpen(o => !o)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Thermometer, {
    size: 16,
    color: "var(--clay)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "Ideal temperature")), /*#__PURE__*/React.createElement(Info, {
    size: 14,
    color: "var(--muted)"
  })), /*#__PURE__*/React.createElement(TempBar, {
    range: crop.temp
  }), open && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      paddingTop: 12,
      borderTop: "1px solid var(--line)",
      animation: "fade .25s ease both"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      color: "var(--ink2)",
      lineHeight: 1.5
    }
  }, "This is the air-temperature band ", crop.name, " grows best in \u2014 ", crop.temp[0], "\u2013", crop.temp[1], "\xB0C (", f(crop.temp[0]), "\u2013", f(crop.temp[1]), "\xB0F). Growth slows when it's colder and stalls or suffers when it's much hotter."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 0",
      fontSize: 13,
      color: "var(--ink2)",
      lineHeight: 1.5
    }
  }, note, " It's often why a crop gets flagged \"not suited\" to a city \u2014 the climate sits outside this range.")));
}
function TempBar({
  range
}) {
  const lo = 0,
    hi = 40;
  const left = range[0] / hi * 100;
  const w = (range[1] - range[0]) / hi * 100;
  const f = c => Math.round(c * 9 / 5 + 32);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 8,
      borderRadius: 6,
      background: "linear-gradient(90deg,#6f93b8,#7FA86A,#BE8E2C,#BD5736)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: -3,
      height: 14,
      left: `${left}%`,
      width: `${w}%`,
      border: "2px solid var(--ink)",
      borderRadius: 6,
      background: tint("#1E342A", .06)
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      fontWeight: 700,
      marginTop: 6
    }
  }, range[0], "\u2013", range[1], "\xB0C ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--muted)",
      fontWeight: 400
    }
  }, "\xB7 ", f(range[0]), "\u2013", f(range[1]), "\xB0F")));
}

/* --------------------------- my plot ----------------------------- */
function PlotScreen({
  loc,
  saved,
  sownDates = {},
  setScreen,
  goCrop,
  toggleSave
}) {
  const [jobsHelp, setJobsHelp] = useState(false);
  const crops = CROPS.filter(c => saved.includes(c.id));
  const unfit = crops.filter(c => suitability(c, loc).level === "unfit");
  const marginal = crops.filter(c => suitability(c, loc).level === "marginal");
  const sowNow = crops.filter(c => {
    if (!suitability(c, loc).ok) return false;
    const s = status(c, loc);
    return s.kind === "now" || s.kind === "year";
  });
  const jobs = [];
  crops.forEach(c => {
    if (!suitability(c, loc).ok) return;
    const s = status(c, loc);
    if (s.kind === "now" || s.kind === "year") jobs.push({
      verb: c.perennial ? "Plant" : "Sow",
      harvest: false,
      c
    });
    if (loc.hemi !== "EQ" && harvestMonths(c, loc).includes(NOW)) jobs.push({
      verb: "Harvest",
      harvest: true,
      c
    });
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "screen"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "4px 22px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    className: "fr",
    style: {
      fontSize: 27,
      fontWeight: 600,
      margin: 0,
      letterSpacing: "-.02em"
    }
  }, "My Plot"), /*#__PURE__*/React.createElement("button", {
    className: "chip",
    onClick: () => setScreen("location"),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(MapPin, {
    size: 14,
    color: "var(--clay)"
  }), " ", loc.city)), crops.length > 0 && /*#__PURE__*/React.createElement("p", {
    className: "mono",
    style: {
      fontSize: 12,
      color: "var(--muted)",
      margin: "8px 0 0",
      letterSpacing: ".04em"
    }
  }, crops.length, " ", crops.length === 1 ? "CROP" : "CROPS", " \xB7 ", sowNow.length, " TO SOW NOW", unfit.length > 0 ? ` · ${unfit.length} NOT SUITED` : "", marginal.length > 0 ? ` · ${marginal.length} SHORT SEASON` : "")), crops.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "40px 34px 120px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 78,
      height: 78,
      borderRadius: "50%",
      background: "var(--card2)",
      border: "1px solid var(--line)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Sprout, {
    size: 34,
    color: "var(--moss)"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "fr",
    style: {
      fontSize: 21,
      fontWeight: 600,
      margin: "20px 0 6px"
    }
  }, "Your plot is empty"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--muted)",
      fontSize: 14.5,
      margin: "0 0 22px",
      maxWidth: 260
    }
  }, "Add crops from Discover and we'll plan their sowing and harvest around ", loc.city, "."), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    style: {
      width: "auto",
      padding: "14px 24px"
    },
    onClick: () => {
      setScreen("list");
      window.scrollTo(0, 0);
    }
  }, /*#__PURE__*/React.createElement(Compass, {
    size: 18
  }), " Browse crops")) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 22px 120px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 16,
      background: "var(--card2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "Jobs this month \xB7 ", MFULL[NOW]), /*#__PURE__*/React.createElement(Info, {
    size: 14,
    color: "var(--muted)",
    style: {
      cursor: "pointer"
    },
    onClick: () => setJobsHelp(h => !h)
  })), jobsHelp && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 12px",
      fontSize: 13,
      color: "var(--ink2)",
      lineHeight: 1.5,
      background: "var(--card)",
      border: "1px solid var(--line)",
      borderLeft: "3px solid var(--moss)",
      borderRadius: 12,
      padding: "10px 13px",
      animation: "fade .25s ease both"
    }
  }, "The tasks due in ", loc.city, " right now, worked out from each crop's calendar and today's date. A ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "#3C5E3A"
    }
  }, "green"), " dot means sow or plant; ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "#8A6716"
    }
  }, "amber"), " means harvest. Crops that aren't suited to your climate are left off. Tap any job to open the crop."), jobs.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: "var(--ink2)"
    }
  }, "Nothing urgent \u2014 your crops are busy growing.") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 11
    }
  }, jobs.map((j, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    onClick: () => goCrop(j.c.id, "plot"),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: "50%",
      background: j.harvest ? "var(--ochre)" : "var(--moss)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14.5,
      fontWeight: 600,
      flex: 1
    }
  }, j.verb, " ", /*#__PURE__*/React.createElement("span", {
    className: "fr",
    style: {
      fontWeight: 600
    }
  }, j.c.name)), /*#__PURE__*/React.createElement(ChevronRight, {
    size: 15,
    color: "var(--muted)"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "label",
    style: {
      margin: "24px 0 6px"
    }
  }, "Your crops"), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: "4px 16px"
    }
  }, crops.map(c => {
    const s = status(c, loc);
    const fit = suitability(c, loc);
    const sa = sownDates[c.id];
    const p = sa && !c.perennial ? progressFor(c, sa) : null;
    const months = sa && c.perennial ? Math.floor((Date.now() - sa) / 86400000 / 30) : 0;
    return /*#__PURE__*/React.createElement("div", {
      key: c.id,
      className: "prow",
      onClick: () => goCrop(c.id, "plot"),
      style: {
        opacity: fit.ok ? 1 : .6
      }
    }, /*#__PURE__*/React.createElement(Glyph, {
      id: c.id,
      size: 40
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "fr",
      style: {
        fontSize: 17,
        fontWeight: 600,
        lineHeight: 1.1
      }
    }, c.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: "var(--muted)"
      }
    }, c.type, " \xB7 ", c.perennial ? `${c.years} yr to fruit` : `~${c.maturity} days`)), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, fit.level === "unfit" ? /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11,
        fontWeight: 700,
        color: "#9A3D22"
      }
    }, /*#__PURE__*/React.createElement(AlertTriangle, {
      size: 12
    }), " ", fit.short) : fit.level === "marginal" ? /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11,
        fontWeight: 700,
        color: "#8A6716"
      }
    }, /*#__PURE__*/React.createElement(AlertTriangle, {
      size: 12
    }), " ", fit.short) : sa ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        fontWeight: 700,
        color: "var(--clay)"
      }
    }, c.perennial ? months >= 1 ? `${months}mo in` : "planted" : p.done ? "ready" : `day ${p.days}`), !c.perennial && !p.done && /*#__PURE__*/React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 9,
        color: "var(--muted)",
        letterSpacing: ".03em"
      }
    }, p.stage.toUpperCase())) : s.kind === "now" || s.kind === "year" ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11.5,
        fontWeight: 700,
        color: "#3C5E3A"
      }
    }, c.perennial ? "plant now" : "sow now") : /*#__PURE__*/React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 11,
        color: "var(--muted)"
      }
    }, MS[s.month])), /*#__PURE__*/React.createElement("button", {
      className: "iconbtn",
      onClick: e => {
        e.stopPropagation();
        toggleSave(c.id);
      },
      "aria-label": "Remove"
    }, /*#__PURE__*/React.createElement(Trash2, {
      size: 16
    })));
  }))));
}

/* ----------------------- year-at-a-glance ------------------------ */
function CalendarScreen({
  loc,
  saved,
  sownDates = {},
  setScreen,
  goCrop
}) {
  const crops = CROPS.filter(c => saved.includes(c.id));
  let sowCt = 0,
    harCt = 0;
  crops.forEach(c => {
    if (!suitability(c, loc).ok) return;
    const s = status(c, loc);
    if (s.kind === "now" || s.kind === "year") sowCt++;
    if (loc.hemi !== "EQ" && harvestMonths(c, loc).includes(NOW)) harCt++;
  });
  const anyUnfit = crops.some(c => suitability(c, loc).level === "unfit");
  const NAMECOL = 70;
  return /*#__PURE__*/React.createElement("div", {
    className: "screen"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "4px 22px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    className: "fr",
    style: {
      fontSize: 27,
      fontWeight: 600,
      margin: 0,
      letterSpacing: "-.02em"
    }
  }, "Your Year"), /*#__PURE__*/React.createElement("button", {
    className: "chip",
    onClick: () => setScreen("location"),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(MapPin, {
    size: 14,
    color: "var(--clay)"
  }), " ", loc.city)), crops.length > 0 && /*#__PURE__*/React.createElement("p", {
    className: "mono",
    style: {
      fontSize: 12,
      color: "var(--muted)",
      margin: "8px 0 0",
      letterSpacing: ".04em"
    }
  }, MFULL[NOW].toUpperCase(), " \xB7 ", sowCt, " TO SOW \xB7 ", harCt, " TO HARVEST")), crops.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "40px 34px 120px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 78,
      height: 78,
      borderRadius: "50%",
      background: "var(--card2)",
      border: "1px solid var(--line)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(CalendarDays, {
    size: 32,
    color: "var(--moss)"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "fr",
    style: {
      fontSize: 21,
      fontWeight: 600,
      margin: "20px 0 6px"
    }
  }, "No crops to chart yet"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--muted)",
      fontSize: 14.5,
      margin: "0 0 22px",
      maxWidth: 260
    }
  }, "Add a few crops and your whole growing year \u2014 sowing to harvest \u2014 will line up here, month by month."), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    style: {
      width: "auto",
      padding: "14px 24px"
    },
    onClick: () => {
      setScreen("list");
      window.scrollTo(0, 0);
    }
  }, /*#__PURE__*/React.createElement(Compass, {
    size: 18
  }), " Browse crops")) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 18px 120px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: "14px 14px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 3,
      marginBottom: 8,
      paddingLeft: NAMECOL
    }
  }, MS.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      textAlign: "center",
      fontSize: 10,
      fontWeight: i === NOW ? 700 : 500,
      color: i === NOW ? "var(--clay)" : "var(--muted)",
      fontFamily: "'Space Mono', monospace"
    }
  }, m))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7
    }
  }, crops.map(c => {
    const fit = suitability(c, loc);
    const sm = sowMonths(c, loc);
    const hm = harvestMonths(c, loc);
    const dim = fit.level === "unfit";
    const nameCol = dim ? "#9A3D22" : fit.level === "marginal" ? "#8A6716" : "var(--ink)";
    const sa = sownDates[c.id];
    const pp = sa && !dim ? c.perennial ? perennialProgress(c, sa) : progressFor(c, sa) : null;
    const ppct = pp ? c.perennial ? pp.pos : pp.pct : 0;
    return /*#__PURE__*/React.createElement("div", {
      key: c.id,
      onClick: () => goCrop(c.id, "calendar"),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 0,
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: NAMECOL,
        flexShrink: 0,
        paddingRight: 6,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        opacity: dim ? .5 : 1
      }
    }, /*#__PURE__*/React.createElement(Glyph, {
      id: c.id,
      size: 20
    })), /*#__PURE__*/React.createElement("span", {
      className: "fr",
      style: {
        fontSize: 11.5,
        fontWeight: 600,
        color: nameCol,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, c.name)), pp && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 3,
        height: 3,
        borderRadius: 3,
        background: "var(--line)",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100%",
        width: `${Math.max(4, ppct)}%`,
        background: "var(--clay)",
        borderRadius: 3
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: "flex",
        gap: 3
      }
    }, MS.map((m, i) => {
      const sow = !dim && sm.includes(i);
      const har = !dim && hm.includes(i);
      const isNow = i === NOW;
      let bg = "var(--card2)";
      if (sow) bg = "var(--clay)";else if (har) bg = tint("#BE8E2C", .85);
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          flex: 1,
          height: 18,
          borderRadius: 4,
          background: bg,
          border: isNow ? "1.5px solid var(--ink)" : "1px solid transparent",
          opacity: dim ? .4 : 1
        }
      });
    })));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingLeft: 4
    }
  }, /*#__PURE__*/React.createElement(CalendarLegend, {
    plantLabel: "Sow / plant"
  })), anyUnfit && /*#__PURE__*/React.createElement("p", {
    className: "mono",
    style: {
      fontSize: 10,
      color: "var(--muted)",
      marginTop: 10,
      letterSpacing: ".03em",
      paddingLeft: 4
    }
  }, "Greyed rows aren't suited to ", loc.city, "'s climate."), loc.hemi === "S" && /*#__PURE__*/React.createElement("p", {
    className: "mono",
    style: {
      fontSize: 10,
      color: "var(--muted)",
      marginTop: 6,
      letterSpacing: ".03em",
      paddingLeft: 4
    }
  }, "Calendar shifted for the southern hemisphere.")));
}

/* =============================== APP ============================== */
function PlotApp() {
  const [screen, setScreen] = useState("location");
  const [loc, setLoc] = useState(null);
  const [query, setQuery] = useState("");
  const [cropId, setCropId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [cropQuery, setCropQuery] = useState("");
  const [saved, setSaved] = useState([]);
  const [sownDates, setSownDates] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [back, setBack] = useState("list");

  // load saved plot from persistent storage once
  useEffect(() => {
    let off = false;
    (async () => {
      try {
        if (typeof window !== "undefined" && window.storage) {
          try {
            const r = await window.storage.get("plot:saved");
            if (!off && r && r.value) setSaved(JSON.parse(r.value));
          } catch (e) {}
          try {
            const r = await window.storage.get("plot:sownDates");
            if (!off && r && r.value) setSownDates(JSON.parse(r.value));
          } catch (e) {}
        }
      } catch (e) {}
      if (!off) setLoaded(true);
    })();
    return () => {
      off = true;
    };
  }, []);
  // persist on change (after first load)
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        if (window.storage) await window.storage.set("plot:saved", JSON.stringify(saved));
      } catch (e) {}
    })();
  }, [saved, loaded]);
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        if (window.storage) await window.storage.set("plot:sownDates", JSON.stringify(sownDates));
      } catch (e) {}
    })();
  }, [sownDates, loaded]);
  const isSaved = id => saved.includes(id);
  const toggleSave = id => setSaved(s => {
    if (s.includes(id)) {
      setSownDates(d => {
        const n = {
          ...d
        };
        delete n[id];
        return n;
      });
      return s.filter(x => x !== id);
    }
    return [...s, id];
  });
  const setSown = (id, ts) => {
    setSownDates(d => {
      const n = {
        ...d
      };
      if (ts == null) delete n[id];else n[id] = ts;
      return n;
    });
    if (ts != null) setSaved(s => s.includes(id) ? s : [...s, id]);
  };
  const now = useMemo(() => new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  }), []);
  const crop = CROPS.find(c => c.id === cropId);
  const matches = CITIES.filter(c => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return c.city.toLowerCase().includes(q) || c.country.toLowerCase().includes(q);
  });
  const cq = cropQuery.trim().toLowerCase();
  const list = (cq ? CROPS.filter(c => c.name.toLowerCase().includes(cq) || c.latin.toLowerCase().includes(cq) || c.type.toLowerCase().includes(cq)) : CROPS.filter(c => {
    if (filter === "sownow") {
      if (!suitability(c, loc).ok) return false;
      const s = status(c, loc);
      return s.kind === "now" || s.kind === "year";
    }
    if (filter === "all") return true;
    return c.type.toLowerCase() === filter;
  })).sort((a, b) => (suitability(a, loc).ok ? 0 : 1) - (suitability(b, loc).ok ? 0 : 1));
  const goCrop = (id, from = "list") => {
    setCropId(id);
    setBack(from);
    setScreen("detail");
    window.scrollTo(0, 0);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "plot"
  }, /*#__PURE__*/React.createElement("style", {
    dangerouslySetInnerHTML: {
      __html: CSS
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "backdrop"
  }), /*#__PURE__*/React.createElement("div", {
    className: "grain"
  }), /*#__PURE__*/React.createElement("div", {
    className: "stage"
  }, /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement("div", {
    className: "statusbar"
  }, /*#__PURE__*/React.createElement("span", null, now), /*#__PURE__*/React.createElement("span", {
    className: "dots"
  }, /*#__PURE__*/React.createElement("i", {
    className: "dot"
  }), /*#__PURE__*/React.createElement("i", {
    className: "dot"
  }), /*#__PURE__*/React.createElement("i", {
    className: "dot"
  }))), screen === "location" && /*#__PURE__*/React.createElement("div", {
    className: "screen",
    style: {
      padding: "6px 24px 28px",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("svg", {
    width: "120",
    height: "90",
    viewBox: "0 0 120 90",
    style: {
      position: "absolute",
      right: -6,
      top: 30,
      opacity: .16
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M60 88 60 18",
    fill: "none",
    stroke: "#1E342A",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M60 34c-10-12-26-13-36-9 2 12 14 20 36 20M60 50c10-12 26-13 36-9-2 12-14 20-36 20",
    fill: "none",
    stroke: "#1E342A",
    strokeWidth: "2"
  })), /*#__PURE__*/React.createElement("div", {
    className: "rise",
    style: {
      animationDelay: ".05s",
      marginTop: 34,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Sprout, {
    size: 22,
    color: "var(--moss)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "fr",
    style: {
      fontSize: 23,
      fontWeight: 600,
      letterSpacing: "-.01em"
    }
  }, "Plot")), /*#__PURE__*/React.createElement("h1", {
    className: "fr rise",
    style: {
      animationDelay: ".15s",
      fontSize: 38,
      lineHeight: 1.05,
      margin: "30px 0 0",
      fontWeight: 600,
      letterSpacing: "-.02em",
      maxWidth: 300
    }
  }, "Grow what your ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: "italic",
      color: "var(--clay)"
    }
  }, "ground"), " can grow."), /*#__PURE__*/React.createElement("p", {
    className: "rise",
    style: {
      animationDelay: ".25s",
      color: "var(--ink2)",
      fontSize: 15.5,
      margin: "16px 0 0",
      maxWidth: 310
    }
  }, "Tell us where you garden. We'll tune every crop's soil, water and timing to your local climate."), /*#__PURE__*/React.createElement("div", {
    className: "rise",
    style: {
      animationDelay: ".35s",
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "label",
    style: {
      marginBottom: 10
    }
  }, "Where are you growing?"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Search, {
    size: 19,
    color: "var(--muted)",
    style: {
      position: "absolute",
      left: 15,
      top: 16
    }
  }), /*#__PURE__*/React.createElement("input", {
    className: "input",
    placeholder: "Search your town or city",
    value: query,
    onChange: e => setQuery(e.target.value)
  }), query && /*#__PURE__*/React.createElement(X, {
    size: 18,
    color: "var(--muted)",
    onClick: () => setQuery(""),
    style: {
      position: "absolute",
      right: 14,
      top: 16,
      cursor: "pointer"
    }
  })), query.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "sugg"
  }, matches.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "sugg-row",
    style: {
      cursor: "default",
      color: "var(--muted)"
    }
  }, "No matching city yet \u2014 try a nearby larger city"), matches.slice(0, 6).map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    className: "sugg-row",
    onClick: () => {
      setLoc(c);
      setScreen("list");
      setQuery("");
    }
  }, /*#__PURE__*/React.createElement(MapPin, {
    size: 17,
    color: "var(--clay)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 15
    }
  }, c.city), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--muted)"
    }
  }, c.country, " \xB7 ", c.climate)), /*#__PURE__*/React.createElement(ChevronRight, {
    size: 17,
    color: "var(--muted)"
  }))), matches.length > 6 && /*#__PURE__*/React.createElement("div", {
    className: "sugg-row",
    style: {
      cursor: "default",
      color: "var(--muted)",
      fontSize: 12.5
    }
  }, "+", matches.length - 6, " more \u2014 keep typing to narrow")), !query && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 14
    }
  }, CITIES.slice(0, 8).map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    className: "chip",
    onClick: () => {
      setLoc(c);
      setScreen("list");
    }
  }, c.city))), /*#__PURE__*/React.createElement("p", {
    className: "mono",
    style: {
      fontSize: 10.5,
      color: "var(--muted)",
      marginTop: 12,
      letterSpacing: ".04em"
    }
  }, CITIES.length, " cities across ", new Set(CITIES.map(c => c.country)).size, " countries \u2014 search above")))), /*#__PURE__*/React.createElement("button", {
    className: "btn rise",
    style: {
      animationDelay: ".45s",
      background: "transparent",
      color: "var(--ink2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: "14px",
      fontSize: 14.5
    },
    onClick: () => {
      setLoc(CITIES[0]);
      setScreen("list");
    }
  }, /*#__PURE__*/React.createElement(MapPin, {
    size: 17
  }), " Use my current location")), screen === "list" && loc && /*#__PURE__*/React.createElement("div", {
    className: "screen"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "4px 22px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Sprout, {
    size: 19,
    color: "var(--moss)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "fr",
    style: {
      fontSize: 19,
      fontWeight: 600
    }
  }, "Plot")), /*#__PURE__*/React.createElement("button", {
    className: "chip",
    onClick: () => setScreen("location"),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(MapPin, {
    size: 14,
    color: "var(--clay)"
  }), " ", loc.city)), /*#__PURE__*/React.createElement("div", {
    className: "card rise",
    style: {
      marginTop: 16,
      padding: 16,
      background: "var(--card2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "label",
    style: {
      marginBottom: 9
    }
  }, "Your growing conditions"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "fr",
    style: {
      fontSize: 22,
      fontWeight: 600
    }
  }, loc.city), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: "var(--ink2)"
    }
  }, loc.climate)), /*#__PURE__*/React.createElement("div", {
    className: "hr",
    style: {
      margin: "12px 0"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: "var(--clay)"
    }
  }, loc.zone), /*#__PURE__*/React.createElement("div", {
    className: "label",
    style: {
      fontSize: 9
    }
  }, "Zone")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: "var(--line)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 13.5,
      fontWeight: 700
    }
  }, loc.season), /*#__PURE__*/React.createElement("div", {
    className: "label",
    style: {
      fontSize: 9
    }
  }, "Season")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: "var(--line)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 13.5,
      fontWeight: 700
    }
  }, loc.len), /*#__PURE__*/React.createElement("div", {
    className: "label",
    style: {
      fontSize: 9
    }
  }, "Growing days")))), /*#__PURE__*/React.createElement("h2", {
    className: "fr",
    style: {
      fontSize: 24,
      fontWeight: 600,
      margin: "22px 0 4px",
      letterSpacing: "-.01em"
    }
  }, "What to grow in ", MFULL[NOW]), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      color: "var(--muted)",
      margin: "0 0 14px"
    }
  }, loc.hemi === "S" ? "Southern hemisphere — your seasons run opposite the north." : loc.hemi === "EQ" ? "Near the equator — most crops sow any month." : "Tuned to your frost dates and season length."), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Search, {
    size: 17,
    color: "var(--muted)",
    style: {
      position: "absolute",
      left: 14,
      top: 13
    }
  }), /*#__PURE__*/React.createElement("input", {
    className: "input",
    style: {
      padding: "11px 14px 11px 42px",
      fontSize: 15
    },
    placeholder: "Search crops \u2014 name or type",
    value: cropQuery,
    onChange: e => setCropQuery(e.target.value)
  }), cropQuery && /*#__PURE__*/React.createElement(X, {
    size: 17,
    color: "var(--muted)",
    onClick: () => setCropQuery(""),
    style: {
      position: "absolute",
      right: 13,
      top: 13,
      cursor: "pointer"
    }
  })), !cq && /*#__PURE__*/React.createElement("div", {
    className: "scrollx",
    style: {
      display: "flex",
      gap: 8,
      overflowX: "auto",
      paddingBottom: 4
    }
  }, [["all", "All"], ["sownow", "Sow now"], ["fruit", "Fruit"], ["vegetable", "Vegetable"], ["herb", "Herb"], ["tree", "Trees"]].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    className: "chip" + (filter === k ? " on" : ""),
    onClick: () => setFilter(k)
  }, l))), cq && /*#__PURE__*/React.createElement("p", {
    className: "mono",
    style: {
      fontSize: 11,
      color: "var(--muted)",
      letterSpacing: ".04em",
      margin: "2px 0 0"
    }
  }, list.length, " ", list.length === 1 ? "MATCH" : "MATCHES", " FOR \u201C", cropQuery.trim(), "\u201D")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 22px 110px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, list.map((c, i) => {
    const st = status(c, loc);
    const fit = suitability(c, loc);
    return /*#__PURE__*/React.createElement("div", {
      key: c.id,
      className: "packet rise" + (fit.ok ? "" : " unfit"),
      style: {
        animationDelay: `${i * 0.06}s`
      },
      onClick: () => goCrop(c.id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "band",
      style: {
        background: c.color
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 13px 14px",
        display: "flex",
        flexDirection: "column",
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "tag",
      style: {
        background: tint(c.color, .15),
        color: c.color
      }
    }, c.type), isSaved(c.id) && /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "var(--moss)",
        color: "#FBF3E6"
      }
    }, /*#__PURE__*/React.createElement(Check, {
      size: 13
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "center",
        padding: "8px 0 6px"
      }
    }, /*#__PURE__*/React.createElement(Glyph, {
      id: c.id,
      size: 50
    })), /*#__PURE__*/React.createElement("div", {
      className: "fr",
      style: {
        fontSize: 18,
        fontWeight: 600,
        lineHeight: 1.1
      }
    }, c.name), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "auto",
        paddingTop: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 11.5,
        fontWeight: 700,
        color: "var(--ink2)",
        display: "inline-flex",
        alignItems: "center",
        gap: 4
      }
    }, c.perennial ? `${c.years} yr` : `~${c.maturity}d`, fit.level === "marginal" && /*#__PURE__*/React.createElement(AlertTriangle, {
      size: 11,
      color: "#8A6716"
    })), fit.level === "unfit" ? /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 10.5,
        fontWeight: 700,
        color: "#9A3D22"
      }
    }, /*#__PURE__*/React.createElement(AlertTriangle, {
      size: 12
    }), " ", fit.short) : st.kind === "now" || st.kind === "year" ? /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11,
        fontWeight: 700,
        color: "#3C5E3A"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: "var(--moss)"
      }
    }), " ", c.perennial ? "plant" : "sow") : /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: "var(--muted)"
      }
    }, MS[st.month], " \u2192"))));
  })), list.length === 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: "center",
      color: "var(--muted)",
      padding: "0 0 30px"
    }
  }, cq ? `No crops match “${cropQuery.trim()}”.` : "Nothing to sow right now in this filter.")), screen === "detail" && crop && loc && /*#__PURE__*/React.createElement("div", {
    className: "screen"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: tint(crop.color, .13),
      padding: "6px 22px 20px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => {
      setScreen(back);
      window.scrollTo(0, 0);
    },
    style: {
      background: "transparent",
      display: "flex",
      alignItems: "center",
      gap: 5,
      color: "var(--ink2)",
      fontSize: 14,
      padding: "6px 0"
    }
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    size: 18
  }), " ", back === "plot" ? "My Plot" : back === "calendar" ? "Your Year" : "Crops"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: 14,
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper)",
      borderRadius: 18,
      padding: 10,
      border: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement(Glyph, {
    id: crop.id,
    size: 58
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag",
    style: {
      background: tint(crop.color, .2),
      color: crop.color
    }
  }, crop.type), /*#__PURE__*/React.createElement("h1", {
    className: "fr",
    style: {
      fontSize: 30,
      fontWeight: 600,
      margin: "6px 0 0",
      lineHeight: 1,
      letterSpacing: "-.02em"
    }
  }, crop.name), /*#__PURE__*/React.createElement("div", {
    className: "fr",
    style: {
      fontStyle: "italic",
      color: "var(--ink2)",
      fontSize: 14,
      marginTop: 2
    }
  }, crop.latin))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, (() => {
    const fit = suitability(crop, loc);
    if (fit.level === "unfit") return /*#__PURE__*/React.createElement("span", {
      className: "warnbadge"
    }, /*#__PURE__*/React.createElement(AlertTriangle, {
      size: 14
    }), " Not suited to ", loc.city);
    if (fit.level === "marginal") return /*#__PURE__*/React.createElement("span", {
      className: "warnbadge amber"
    }, /*#__PURE__*/React.createElement(AlertTriangle, {
      size: 14
    }), " Short season in ", loc.city);
    return /*#__PURE__*/React.createElement(StatusBadge, {
      st: status(crop, loc),
      perennial: crop.perennial
    });
  })())), suitability(crop, loc).level !== "fit" && (() => {
    const fit = suitability(crop, loc);
    const amber = fit.level === "marginal";
    const bd = amber ? "rgba(190,142,44,.3)" : "rgba(189,87,54,.3)";
    const bg = amber ? "rgba(190,142,44,.09)" : "rgba(189,87,54,.08)";
    const ic = amber ? "#8A6716" : "#9A3D22";
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "0 22px",
        marginTop: -2
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: 14,
        background: bg,
        borderColor: bd,
        display: "flex",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(AlertTriangle, {
      size: 18,
      color: ic,
      style: {
        flexShrink: 0,
        marginTop: 1
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        color: "var(--ink)",
        lineHeight: 1.45
      }
    }, fit.reason)));
  })(), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 22px 30px"
    }
  }, crop.perennial ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "fr",
    style: {
      fontSize: 46,
      fontWeight: 600,
      color: "var(--clay)",
      lineHeight: 1
    }
  }, crop.years), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: "var(--ink2)",
      fontWeight: 600
    }
  }, "years to first fruit")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--muted)",
      marginTop: 3
    }
  }, "Grown ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--ink2)"
    }
  }, crop.germ), ", then crops each year"), /*#__PURE__*/React.createElement("div", {
    className: "label",
    style: {
      margin: "22px 0 0"
    }
  }, "The long game"), /*#__PURE__*/React.createElement(PerennialTimeline, {
    crop: crop,
    sownAt: sownDates[crop.id]
  }), /*#__PURE__*/React.createElement(SowControl, {
    crop: crop,
    sownAt: sownDates[crop.id],
    onSet: ts => setSown(crop.id, ts)
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "fr",
    style: {
      fontSize: 46,
      fontWeight: 600,
      color: "var(--clay)",
      lineHeight: 1
    }
  }, crop.maturity), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: "var(--ink2)",
      fontWeight: 600
    }
  }, "days to first harvest")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--muted)",
      marginTop: 3
    }
  }, crop.germ.match(/\d/) ? /*#__PURE__*/React.createElement(React.Fragment, null, "Germinates in ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--ink2)"
    }
  }, crop.germ, " days"), " from sowing") : /*#__PURE__*/React.createElement(React.Fragment, null, "Grown ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--ink2)"
    }
  }, crop.germ))), /*#__PURE__*/React.createElement("div", {
    className: "label",
    style: {
      margin: "22px 0 0"
    }
  }, "From seed to plate"), /*#__PURE__*/React.createElement(Timeline, {
    crop: crop,
    sownAt: sownDates[crop.id]
  }), /*#__PURE__*/React.createElement(SowControl, {
    crop: crop,
    sownAt: sownDates[crop.id],
    onSet: ts => setSown(crop.id, ts)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 11,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(WaterSpec, {
    crop: crop
  }), /*#__PURE__*/React.createElement(SunSpec, {
    crop: crop
  }), /*#__PURE__*/React.createElement(SoilSpec, {
    crop: crop
  }), /*#__PURE__*/React.createElement(TempSpec, {
    crop: crop
  })), /*#__PURE__*/React.createElement("div", {
    className: "label",
    style: {
      margin: "24px 0 4px"
    }
  }, "Planting calendar \xB7 ", loc.city), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12.5,
      color: "var(--muted)",
      margin: "0 0 12px"
    }
  }, crop.perennial ? "When to plant, and the season a mature tree fruits." : loc.hemi === "S" ? "Shifted for the southern hemisphere." : loc.hemi === "EQ" ? "Sow most of the year in this climate." : "Based on your zone and frost dates."), (() => {
    const sm = sowMonths(crop, loc);
    const hm = harvestMonths(crop, loc);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 4
      }
    }, MS.map((m, i) => {
      const sow = sm.includes(i);
      const har = hm.includes(i);
      const isNow = i === NOW;
      let bg = "var(--card2)",
        col = "var(--muted)";
      if (sow) {
        bg = "var(--clay)";
        col = "#FBF3E6";
      } else if (har) {
        bg = tint("#BE8E2C", .85);
        col = "#fff";
      }
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        className: "cell",
        style: {
          background: bg,
          color: col,
          border: isNow ? "2px solid var(--ink)" : "1px solid transparent",
          fontWeight: isNow ? 700 : 400
        }
      }, m);
    })), /*#__PURE__*/React.createElement(CalendarLegend, {
      plantLabel: crop.perennial ? "Plant" : "Sow"
    }), crop.perennial && /*#__PURE__*/React.createElement("p", {
      className: "mono",
      style: {
        fontSize: 10,
        color: "var(--muted)",
        marginTop: 10,
        letterSpacing: ".03em"
      }
    }, "Harvest shown is for an established tree, not the year you plant."));
  })(), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginTop: 22,
      padding: 16,
      background: tint(crop.color, .07),
      borderColor: tint(crop.color, .25)
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "label",
    style: {
      marginBottom: 7
    }
  }, "Notes for your plot"), /*#__PURE__*/React.createElement("p", {
    className: "fr",
    style: {
      fontSize: 15.5,
      lineHeight: 1.5,
      margin: 0,
      color: "var(--ink)"
    }
  }, crop.note)), isSaved(crop.id) ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    style: {
      marginTop: 18,
      background: "transparent",
      color: "var(--moss)",
      border: "1.5px solid var(--moss)",
      boxShadow: "none"
    },
    onClick: () => toggleSave(crop.id)
  }, /*#__PURE__*/React.createElement(Check, {
    size: 18
  }), " In your plot \xB7 tap to remove"), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => {
      setScreen("plot");
      window.scrollTo(0, 0);
    },
    style: {
      background: "transparent",
      color: "var(--ink2)",
      width: "100%",
      padding: "12px",
      fontSize: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      marginTop: 4
    }
  }, "Go to My Plot ", /*#__PURE__*/React.createElement(ArrowRight, {
    size: 16
  }))) : /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    style: {
      marginTop: 18
    },
    onClick: () => toggleSave(crop.id)
  }, /*#__PURE__*/React.createElement(Plus, {
    size: 18
  }), " Add to my plot"), /*#__PURE__*/React.createElement("p", {
    className: "mono",
    style: {
      fontSize: 9.5,
      color: "var(--muted)",
      textAlign: "center",
      marginTop: 18,
      letterSpacing: ".04em"
    }
  }, "Sample data shown for layout \u2014 not horticultural advice"))), screen === "plot" && loc && /*#__PURE__*/React.createElement(PlotScreen, {
    loc: loc,
    saved: saved,
    sownDates: sownDates,
    setScreen: setScreen,
    goCrop: goCrop,
    toggleSave: toggleSave
  }), screen === "calendar" && loc && /*#__PURE__*/React.createElement(CalendarScreen, {
    loc: loc,
    saved: saved,
    sownDates: sownDates,
    setScreen: setScreen,
    goCrop: goCrop
  }))), (screen === "list" || screen === "plot" || screen === "calendar") && /*#__PURE__*/React.createElement("div", {
    className: "navbar"
  }, /*#__PURE__*/React.createElement("button", {
    className: "navtab" + (screen === "list" ? " on" : ""),
    onClick: () => {
      setScreen("list");
      window.scrollTo(0, 0);
    }
  }, /*#__PURE__*/React.createElement(Compass, {
    size: 17
  }), " ", /*#__PURE__*/React.createElement("span", null, "Discover")), /*#__PURE__*/React.createElement("button", {
    className: "navtab" + (screen === "calendar" ? " on" : ""),
    onClick: () => {
      setScreen("calendar");
      window.scrollTo(0, 0);
    }
  }, /*#__PURE__*/React.createElement(CalendarDays, {
    size: 17
  }), " ", /*#__PURE__*/React.createElement("span", null, "Year")), /*#__PURE__*/React.createElement("button", {
    className: "navtab" + (screen === "plot" ? " on" : ""),
    onClick: () => {
      setScreen("plot");
      window.scrollTo(0, 0);
    }
  }, /*#__PURE__*/React.createElement(Sprout, {
    size: 17
  }), " ", /*#__PURE__*/React.createElement("span", null, "Plot"), saved.length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "navcount"
  }, saved.length))));
}
var __r = document.getElementById("root");
ReactDOM.createRoot(__r).render(React.createElement(PlotApp));