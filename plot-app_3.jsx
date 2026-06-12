import React, { useState, useMemo, useEffect } from "react";
import {
  MapPin, Search, Droplets, Sun, Thermometer, Sprout, Compass, Plus, Trash2,
  CalendarDays, ChevronLeft, ChevronRight, ArrowRight, Check, FlaskConical, X, AlertTriangle, Info, Camera, Snowflake, NotebookPen, Wheat, Settings, Download, Upload, Repeat, Bug, Moon, Flower, Scissors
} from "lucide-react";

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
  --t-ochre:#8A6716; --t-danger:#9A3D22; --t-dangerBg:#9A3D22; --t-green:#3C5E3A; --t-frost:#2C5068; --t-frostI:#3E6E8C; --t-teal:#2F6B69;
  --map-bg:linear-gradient(180deg,#E7E0CC,#DfD6BE); --map-land:#C7D1AE; --map-stroke:#9DAB84;
  font-family:'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif;
  color:var(--ink); line-height:1.45;
}
.plot.dark{
  --paper:#1B241F; --paper2:#222C26; --card:#26312A; --card2:#212B25;
  --ink:#EAE3D0; --ink2:#C6BFA9; --muted:#8E9588;
  --moss:#74A872; --clay:#D97D58; --ochre:#D6AC4A; --soil:#C2A98C;
  --line:rgba(234,227,208,0.13); --line2:rgba(234,227,208,0.28);
  --t-ochre:#D9B45C; --t-danger:#E2917A; --t-dangerBg:#B14C30; --t-green:#92C28D; --t-frost:#A8CBE0; --t-frostI:#86B5D2; --t-teal:#86C7C4;
  --map-bg:linear-gradient(180deg,#202B24,#1B241F); --map-land:#3C4D3A; --map-stroke:#566753;
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
  position:relative; z-index:2; min-height:100vh; min-height:100dvh;
  display:flex; justify-content:center; padding:0;
}
.app{
  width:100%; max-width:100%; background:var(--paper);
  border-radius:0; overflow:hidden; position:relative;
  min-height:100vh; min-height:100dvh; display:flex; flex-direction:column;
  padding-top:calc(env(safe-area-inset-top, 0px) + 10px);
}
@media (min-width:480px){
  .stage{ padding:26px 14px 40px; }
  .app{ max-width:430px; min-height:768px; border-radius:30px; padding-top:0;
    box-shadow:0 30px 70px -24px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.06); }
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

.navbar{ position:fixed; left:50%; bottom:calc(14px + env(safe-area-inset-bottom, 0px)); transform:translateX(-50%); z-index:60;
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
const CITIES = [
  { id:"london",      city:"London",        country:"United Kingdom", zone:"9a",  climate:"Temperate maritime",   hemi:"N",  season:"Mar – Oct",  frost:"Nov – Mar", len:"~210 days", tier:1, chillWinter:true },
  { id:"phoenix",     city:"Phoenix",       country:"United States",  zone:"9b",  climate:"Hot desert",           hemi:"N",  season:"Feb – Nov",  frost:"rare",      len:"~300 days", tier:3, chillWinter:true },
  { id:"sydney",      city:"Sydney",        country:"Australia",      zone:"10b", climate:"Humid subtropical",    hemi:"S",  season:"Sep – May",  frost:"none",      len:"~330 days", tier:3, chillWinter:false },
  { id:"oslo",        city:"Oslo",          country:"Norway",         zone:"5b",  climate:"Cold continental",     hemi:"N",  season:"May – Sep",  frost:"Oct – Apr", len:"~150 days", tier:0, chillWinter:true },
  { id:"nairobi",     city:"Nairobi",       country:"Kenya",          zone:"—",   climate:"Tropical highland",    hemi:"EQ", season:"Year-round", frost:"none",      len:"365 days",  tier:4, chillWinter:false },
  { id:"sp",          city:"São Paulo",     country:"Brazil",         zone:"—",   climate:"Humid subtropical",    hemi:"S",  season:"Aug – May",  frost:"rare",      len:"~300 days", tier:3, chillWinter:false },
  { id:"madrid",      city:"Madrid",        country:"Spain",          zone:"9a",  climate:"Hot-summer Mediterranean", hemi:"N", season:"Mar – Nov", frost:"Dec – Feb", len:"~250 days", tier:2, chillWinter:true },
  { id:"barcelona",   city:"Barcelona",     country:"Spain",          zone:"10a", climate:"Mediterranean",        hemi:"N",  season:"Mar – Nov",  frost:"rare",      len:"~270 days", tier:2, chillWinter:true },
  { id:"seville",     city:"Seville",       country:"Spain",          zone:"10b", climate:"Hot Mediterranean",    hemi:"N",  season:"Feb – Nov",  frost:"rare",      len:"~300 days", tier:3, chillWinter:false },
  { id:"paris",       city:"Paris",         country:"France",         zone:"8b",  climate:"Temperate oceanic",    hemi:"N",  season:"Apr – Oct",  frost:"Nov – Mar", len:"~200 days", tier:1, chillWinter:true },
  { id:"rome",        city:"Rome",          country:"Italy",          zone:"9b",  climate:"Mediterranean",        hemi:"N",  season:"Mar – Nov",  frost:"Dec – Feb", len:"~260 days", tier:2, chillWinter:true },
  { id:"berlin",      city:"Berlin",        country:"Germany",        zone:"7b",  climate:"Humid continental",    hemi:"N",  season:"Apr – Oct",  frost:"Nov – Mar", len:"~180 days", tier:1, chillWinter:true },
  { id:"lisbon",      city:"Lisbon",        country:"Portugal",       zone:"10a", climate:"Mediterranean",        hemi:"N",  season:"Mar – Nov",  frost:"rare",      len:"~280 days", tier:2, chillWinter:true },
  { id:"stockholm",   city:"Stockholm",     country:"Sweden",         zone:"6a",  climate:"Humid continental",    hemi:"N",  season:"May – Sep",  frost:"Oct – Apr", len:"~160 days", tier:0, chillWinter:true },
  { id:"moscow",      city:"Moscow",        country:"Russia",         zone:"4b",  climate:"Humid continental",    hemi:"N",  season:"May – Sep",  frost:"Oct – Apr", len:"~135 days", tier:0, chillWinter:true },
  { id:"newyork",     city:"New York",      country:"United States",  zone:"7b",  climate:"Humid continental",    hemi:"N",  season:"Apr – Oct",  frost:"Nov – Mar", len:"~190 days", tier:2, chillWinter:true },
  { id:"losangeles",  city:"Los Angeles",   country:"United States",  zone:"10b", climate:"Mediterranean",        hemi:"N",  season:"Year-round", frost:"rare",      len:"~330 days", tier:3, chillWinter:false },
  { id:"toronto",     city:"Toronto",       country:"Canada",         zone:"6a",  climate:"Humid continental",    hemi:"N",  season:"May – Oct",  frost:"Nov – Apr", len:"~160 days", tier:0, chillWinter:true },
  { id:"mexicocity",  city:"Mexico City",   country:"Mexico",         zone:"11a", climate:"Subtropical highland", hemi:"N",  season:"Year-round", frost:"rare",      len:"~330 days", tier:3, chillWinter:false },
  { id:"buenosaires", city:"Buenos Aires",  country:"Argentina",      zone:"10a", climate:"Humid subtropical",    hemi:"S",  season:"Sep – May",  frost:"rare",      len:"~290 days", tier:2, chillWinter:true },
  { id:"santiago",    city:"Santiago",      country:"Chile",          zone:"9b",  climate:"Mediterranean",        hemi:"S",  season:"Sep – May",  frost:"Jun – Aug", len:"~250 days", tier:2, chillWinter:true },
  { id:"rio",         city:"Rio de Janeiro",country:"Brazil",         zone:"—",   climate:"Tropical",             hemi:"S",  season:"Year-round", frost:"none",      len:"365 days",  tier:4, chillWinter:false },
  { id:"capetown",    city:"Cape Town",     country:"South Africa",   zone:"10a", climate:"Mediterranean",        hemi:"S",  season:"Sep – May",  frost:"rare",      len:"~290 days", tier:2, chillWinter:true },
  { id:"cairo",       city:"Cairo",         country:"Egypt",          zone:"10b", climate:"Hot desert",           hemi:"N",  season:"Feb – Nov",  frost:"none",      len:"~320 days", tier:3, chillWinter:false },
  { id:"lagos",       city:"Lagos",         country:"Nigeria",        zone:"—",   climate:"Tropical",             hemi:"EQ", season:"Year-round", frost:"none",      len:"365 days",  tier:4, chillWinter:false },
  { id:"tokyo",       city:"Tokyo",         country:"Japan",          zone:"9b",  climate:"Humid subtropical",    hemi:"N",  season:"Mar – Nov",  frost:"Dec – Feb", len:"~250 days", tier:2, chillWinter:true },
  { id:"beijing",     city:"Beijing",       country:"China",          zone:"6b",  climate:"Continental monsoon",  hemi:"N",  season:"Apr – Oct",  frost:"Nov – Mar", len:"~190 days", tier:2, chillWinter:true },
  { id:"delhi",       city:"Delhi",         country:"India",          zone:"11a", climate:"Hot semi-arid",        hemi:"N",  season:"Year-round", frost:"none",      len:"~320 days", tier:3, chillWinter:false },
  { id:"singapore",   city:"Singapore",     country:"Singapore",      zone:"—",   climate:"Tropical rainforest",  hemi:"EQ", season:"Year-round", frost:"none",      len:"365 days",  tier:4, chillWinter:false },
  { id:"bangkok",     city:"Bangkok",       country:"Thailand",       zone:"—",   climate:"Tropical savanna",     hemi:"EQ", season:"Year-round", frost:"none",      len:"365 days",  tier:4, chillWinter:false },
  { id:"mumbai",      city:"Mumbai",        country:"India",          zone:"—",   climate:"Tropical",             hemi:"EQ", season:"Year-round", frost:"none",      len:"365 days",  tier:4, chillWinter:false },
  { id:"dubai",       city:"Dubai",         country:"United Arab Emirates", zone:"11b", climate:"Hot desert",     hemi:"N",  season:"Oct – May",  frost:"none",      len:"~330 days", tier:3, chillWinter:false },
  { id:"melbourne",   city:"Melbourne",     country:"Australia",      zone:"10a", climate:"Temperate oceanic",    hemi:"S",  season:"Sep – May",  frost:"rare",      len:"~270 days", tier:2, chillWinter:true },
  { id:"auckland",    city:"Auckland",      country:"New Zealand",    zone:"10b", climate:"Temperate oceanic",    hemi:"S",  season:"Sep – May",  frost:"rare",      len:"~290 days", tier:2, chillWinter:true },
  { id:"dublin",      city:"Dublin",        country:"Ireland",        zone:"9a",  climate:"Temperate oceanic",    hemi:"N",  season:"Apr – Oct",  frost:"Nov – Mar", len:"~200 days", tier:1, chillWinter:true },
  { id:"amsterdam",   city:"Amsterdam",     country:"Netherlands",    zone:"8b",  climate:"Temperate oceanic",    hemi:"N",  season:"Apr – Oct",  frost:"Nov – Mar", len:"~195 days", tier:1, chillWinter:true },
  { id:"copenhagen",  city:"Copenhagen",    country:"Denmark",        zone:"8a",  climate:"Temperate oceanic",    hemi:"N",  season:"Apr – Oct",  frost:"Nov – Mar", len:"~190 days", tier:1, chillWinter:true },
  { id:"vienna",      city:"Vienna",        country:"Austria",        zone:"8a",  climate:"Humid continental",    hemi:"N",  season:"Apr – Oct",  frost:"Nov – Mar", len:"~190 days", tier:1, chillWinter:true },
  { id:"warsaw",      city:"Warsaw",        country:"Poland",         zone:"6b",  climate:"Humid continental",    hemi:"N",  season:"Apr – Oct",  frost:"Nov – Mar", len:"~180 days", tier:0, chillWinter:true },
  { id:"athens",      city:"Athens",        country:"Greece",         zone:"10a", climate:"Mediterranean",        hemi:"N",  season:"Mar – Nov",  frost:"rare",      len:"~280 days", tier:2, chillWinter:true },
  { id:"istanbul",    city:"Istanbul",      country:"Turkey",         zone:"9a",  climate:"Mediterranean",        hemi:"N",  season:"Mar – Nov",  frost:"Dec – Feb", len:"~250 days", tier:2, chillWinter:true },
  { id:"helsinki",    city:"Helsinki",      country:"Finland",        zone:"5b",  climate:"Humid continental",    hemi:"N",  season:"May – Sep",  frost:"Oct – Apr", len:"~155 days", tier:0, chillWinter:true },
  { id:"zurich",      city:"Zurich",        country:"Switzerland",    zone:"8a",  climate:"Humid continental",    hemi:"N",  season:"Apr – Oct",  frost:"Nov – Mar", len:"~185 days", tier:1, chillWinter:true },
  { id:"kyiv",        city:"Kyiv",          country:"Ukraine",        zone:"6a",  climate:"Humid continental",    hemi:"N",  season:"Apr – Oct",  frost:"Nov – Mar", len:"~170 days", tier:0, chillWinter:true },
  { id:"chicago",     city:"Chicago",       country:"United States",  zone:"6a",  climate:"Humid continental",    hemi:"N",  season:"Apr – Oct",  frost:"Nov – Mar", len:"~175 days", tier:1, chillWinter:true },
  { id:"seattle",     city:"Seattle",       country:"United States",  zone:"8b",  climate:"Temperate oceanic",    hemi:"N",  season:"Apr – Oct",  frost:"Nov – Mar", len:"~200 days", tier:1, chillWinter:true },
  { id:"houston",     city:"Houston",       country:"United States",  zone:"9a",  climate:"Humid subtropical",    hemi:"N",  season:"Feb – Nov",  frost:"rare",      len:"~290 days", tier:3, chillWinter:false },
  { id:"miami",       city:"Miami",         country:"United States",  zone:"11a", climate:"Tropical monsoon",     hemi:"N",  season:"Year-round", frost:"none",      len:"365 days",  tier:4, chillWinter:false },
  { id:"vancouver",   city:"Vancouver",     country:"Canada",         zone:"8b",  climate:"Temperate oceanic",    hemi:"N",  season:"Apr – Oct",  frost:"Nov – Mar", len:"~200 days", tier:1, chillWinter:true },
  { id:"montreal",    city:"Montreal",      country:"Canada",         zone:"5a",  climate:"Humid continental",    hemi:"N",  season:"May – Sep",  frost:"Oct – Apr", len:"~150 days", tier:0, chillWinter:true },
  { id:"havana",      city:"Havana",        country:"Cuba",           zone:"11b", climate:"Tropical",             hemi:"N",  season:"Year-round", frost:"none",      len:"365 days",  tier:4, chillWinter:false },
  { id:"lima",        city:"Lima",          country:"Peru",           zone:"11a", climate:"Mild desert",          hemi:"S",  season:"Year-round", frost:"none",      len:"~330 days", tier:3, chillWinter:false },
  { id:"bogota",      city:"Bogotá",        country:"Colombia",       zone:"—",   climate:"Subtropical highland", hemi:"EQ", season:"Year-round", frost:"rare",      len:"~330 days", tier:2, chillWinter:false },
  { id:"caracas",     city:"Caracas",       country:"Venezuela",      zone:"—",   climate:"Tropical savanna",     hemi:"EQ", season:"Year-round", frost:"none",      len:"365 days",  tier:4, chillWinter:false },
  { id:"casablanca",  city:"Casablanca",    country:"Morocco",        zone:"10b", climate:"Mediterranean",        hemi:"N",  season:"Feb – Nov",  frost:"rare",      len:"~300 days", tier:2, chillWinter:false },
  { id:"marrakech",   city:"Marrakech",     country:"Morocco",        zone:"10a", climate:"Hot semi-arid",        hemi:"N",  season:"Feb – Nov",  frost:"rare",      len:"~300 days", tier:3, chillWinter:false },
  { id:"johannesburg",city:"Johannesburg",  country:"South Africa",   zone:"9b",  climate:"Subtropical highland", hemi:"S",  season:"Sep – Apr",  frost:"Jun – Aug", len:"~250 days", tier:2, chillWinter:true },
  { id:"accra",       city:"Accra",         country:"Ghana",          zone:"—",   climate:"Tropical savanna",     hemi:"EQ", season:"Year-round", frost:"none",      len:"365 days",  tier:4, chillWinter:false },
  { id:"addisababa",  city:"Addis Ababa",   country:"Ethiopia",       zone:"—",   climate:"Subtropical highland", hemi:"EQ", season:"Year-round", frost:"rare",      len:"~330 days", tier:2, chillWinter:false },
  { id:"telaviv",     city:"Tel Aviv",      country:"Israel",         zone:"10b", climate:"Mediterranean",        hemi:"N",  season:"Feb – Nov",  frost:"rare",      len:"~310 days", tier:3, chillWinter:false },
  { id:"tehran",      city:"Tehran",        country:"Iran",           zone:"8b",  climate:"Cold semi-arid",       hemi:"N",  season:"Mar – Nov",  frost:"Dec – Feb", len:"~240 days", tier:2, chillWinter:true },
  { id:"riyadh",      city:"Riyadh",        country:"Saudi Arabia",   zone:"11a", climate:"Hot desert",           hemi:"N",  season:"Oct – May",  frost:"none",      len:"~330 days", tier:3, chillWinter:false },
  { id:"tashkent",    city:"Tashkent",      country:"Uzbekistan",     zone:"7a",  climate:"Continental",          hemi:"N",  season:"Apr – Oct",  frost:"Nov – Mar", len:"~200 days", tier:2, chillWinter:true },
  { id:"seoul",       city:"Seoul",         country:"South Korea",    zone:"7a",  climate:"Humid continental",    hemi:"N",  season:"Apr – Oct",  frost:"Nov – Mar", len:"~190 days", tier:2, chillWinter:true },
  { id:"hanoi",       city:"Hanoi",         country:"Vietnam",        zone:"—",   climate:"Humid subtropical",    hemi:"N",  season:"Year-round", frost:"rare",      len:"~320 days", tier:3, chillWinter:false },
  { id:"hongkong",    city:"Hong Kong",     country:"Hong Kong",      zone:"11a", climate:"Humid subtropical",    hemi:"N",  season:"Year-round", frost:"rare",      len:"~330 days", tier:3, chillWinter:false },
  { id:"jakarta",     city:"Jakarta",       country:"Indonesia",      zone:"—",   climate:"Tropical rainforest",  hemi:"EQ", season:"Year-round", frost:"none",      len:"365 days",  tier:4, chillWinter:false },
  { id:"manila",      city:"Manila",        country:"Philippines",    zone:"—",   climate:"Tropical",             hemi:"EQ", season:"Year-round", frost:"none",      len:"365 days",  tier:4, chillWinter:false },
  { id:"kualalumpur", city:"Kuala Lumpur",  country:"Malaysia",       zone:"—",   climate:"Tropical rainforest",  hemi:"EQ", season:"Year-round", frost:"none",      len:"365 days",  tier:4, chillWinter:false },
  { id:"perth",       city:"Perth",         country:"Australia",      zone:"10b", climate:"Mediterranean",        hemi:"S",  season:"Sep – May",  frost:"rare",      len:"~300 days", tier:3, chillWinter:false },
  { id:"wellington",  city:"Wellington",    country:"New Zealand",    zone:"10a", climate:"Temperate oceanic",    hemi:"S",  season:"Sep – May",  frost:"rare",      len:"~270 days", tier:1, chillWinter:true },
];

const CITY_LL = { london:[-0.13,51.51], phoenix:[-112.07,33.45], sydney:[151.21,-33.87], oslo:[10.75,59.91], nairobi:[36.82,-1.29], sp:[-46.63,-23.55], madrid:[-3.7,40.42], barcelona:[2.17,41.39], seville:[-5.98,37.39], paris:[2.35,48.86], rome:[12.5,41.9], berlin:[13.4,52.52], lisbon:[-9.14,38.72], stockholm:[18.07,59.33], moscow:[37.62,55.75], newyork:[-74.01,40.71], losangeles:[-118.24,34.05], toronto:[-79.38,43.65], mexicocity:[-99.13,19.43], buenosaires:[-58.38,-34.6], santiago:[-70.65,-33.45], rio:[-43.17,-22.91], capetown:[18.42,-33.92], cairo:[31.24,30.04], lagos:[3.38,6.52], tokyo:[139.69,35.69], beijing:[116.41,39.9], delhi:[77.21,28.61], singapore:[103.82,1.35], bangkok:[100.5,13.76], mumbai:[72.88,19.08], dubai:[55.27,25.2], melbourne:[144.96,-37.81], auckland:[174.76,-36.85], dublin:[-6.26,53.35], amsterdam:[4.9,52.37], copenhagen:[12.57,55.68], vienna:[16.37,48.21], warsaw:[21.01,52.23], athens:[23.73,37.98], istanbul:[28.98,41.01], helsinki:[24.94,60.17], zurich:[8.54,47.37], kyiv:[30.52,50.45], chicago:[-87.63,41.88], seattle:[-122.33,47.61], houston:[-95.37,29.76], miami:[-80.19,25.76], vancouver:[-123.12,49.28], montreal:[-73.57,45.5], havana:[-82.38,23.11], lima:[-77.04,-12.05], bogota:[-74.07,4.71], caracas:[-66.9,10.49], casablanca:[-7.59,33.57], marrakech:[-7.98,31.63], johannesburg:[28.05,-26.2], accra:[-0.19,5.6], addisababa:[38.74,9.03], telaviv:[34.78,32.07], tehran:[51.39,35.69], riyadh:[46.72,24.71], tashkent:[69.24,41.3], seoul:[126.98,37.57], hanoi:[105.83,21.03], hongkong:[114.16,22.32], jakarta:[106.85,-6.21], manila:[120.98,14.6], kualalumpur:[101.69,3.14], perth:[115.86,-31.95], wellington:[174.78,-41.29] };
const WORLD_PATH = `M241,47L242,48L243,47L245,47L246,46L247,46L248,46L249,46L250,45L251,45L251,46L253,46L254,46L255,46L254,46L253,46L252,46L252,48L251,49L250,49L250,50L249,51L248,51L246,52L245,54L244,54L243,54L241,53L242,52L241,51L241,49L241,47ZM196,89L197,90L198,91L199,91L200,90L202,90L202,91L202,93L202,94L203,94L204,95L202,96L202,99L203,101L201,101L199,101L194,100L193,100L192,100L192,99L192,98L193,97L193,95L194,94L193,93L193,92L193,91L192,89L193,89L196,89ZM201,41L201,42L200,43L199,42L200,41L200,40ZM232,59L233,59L234,59L235,58L236,58L236,59L235,60L232,60L232,59ZM114,138L112,138L111,138L111,136L112,137L114,137L115,138ZM115,105L116,105L117,105L119,107L121,108L122,108L121,110L122,110L124,111L125,110L126,109L126,110L125,111L124,112L122,113L122,115L122,116L122,117L123,118L123,119L122,121L121,122L119,122L118,122L118,123L116,124L115,124L115,125L116,125L115,126L115,128L113,128L112,129L113,130L114,130L113,132L112,133L111,133L111,135L108,135L108,134L107,133L107,132L108,131L108,130L108,129L109,127L108,126L108,125L108,124L108,123L109,122L109,121L109,120L110,118L110,117L110,116L109,114L110,113L110,112L110,111L111,111L111,110L112,108L113,107L113,106L114,105L115,105ZM224,42L225,42L226,43L227,44L225,44L224,43ZM249,132L251,132L249,133L249,132ZM325,124L326,124L328,124L328,125L328,126L327,127L325,126L325,124ZM324,97L325,97L325,98L326,100L326,101L326,102L327,102L329,103L330,105L331,105L331,106L332,107L333,109L333,110L334,112L333,113L333,115L332,116L331,117L331,118L330,119L330,120L328,121L327,121L326,122L325,121L324,122L322,121L321,121L320,120L319,119L318,119L318,117L317,118L318,117L318,116L316,117L315,117L315,116L313,115L311,114L310,115L308,115L307,115L306,115L305,116L304,116L303,117L301,117L300,117L299,118L297,118L296,117L296,116L296,115L295,114L295,112L294,110L293,109L294,108L294,107L294,105L295,105L296,104L297,104L298,103L299,103L301,103L302,102L302,101L303,99L304,99L305,98L306,97L307,97L308,98L310,98L310,97L311,96L312,95L312,94L313,94L314,95L315,95L316,95L316,96L316,97L316,99L318,99L319,100L320,101L321,99L322,98L322,97L322,96L322,94L323,95L324,96L324,97ZM197,35L196,36L195,36L194,36L192,36L191,36L190,36L191,35L193,35L194,34L195,34L196,34L197,34ZM227,42L229,41L230,42L229,44L229,45L228,44L227,44L226,43L226,42L227,42ZM209,87L209,86L210,85L211,86L210,87ZM183,32L185,32L186,32L186,33L184,33L183,32ZM183,77L182,76L182,74L181,73L181,72L182,71L184,71L184,72L183,74L183,77ZM177,73L176,73L175,73L175,72L176,70L177,69L178,69L179,68L180,68L180,69L181,70L182,70L182,71L181,72L180,72L177,72L177,73ZM273,61L272,62L272,61L271,60L270,60L270,61L269,61L269,59L268,58L268,57L269,57L271,58L272,58L272,59L272,60L273,61ZM203,39L204,39L206,39L207,39L209,39L208,40L206,41L205,42L204,42L202,41L203,39ZM199,38L199,39L199,40L197,40L196,39L198,38L199,38ZM203,29L204,29L206,29L207,28L208,27L209,27L211,27L211,29L212,29L211,30L212,31L211,31L209,32L208,31L206,31L205,31L204,31L204,30L203,29ZM91,65L92,65L92,66L91,67L91,66ZM117,105L116,105L115,105L114,105L113,106L112,104L111,103L112,102L111,101L111,100L111,98L111,97L111,96L110,94L112,94L113,93L115,93L115,94L116,95L117,96L118,96L119,96L120,98L120,99L122,99L122,100L123,101L122,102L121,102L120,102L118,103L118,104L117,105ZM122,113L124,112L125,111L126,110L126,109L126,108L125,107L124,106L123,105L122,105L122,104L122,102L123,101L122,100L122,99L120,99L119,98L119,97L118,96L117,96L116,95L115,95L115,94L113,93L112,94L110,94L109,94L110,92L108,93L107,92L106,91L107,89L108,88L109,87L110,87L111,85L110,84L110,82L110,81L112,81L113,82L114,82L115,82L117,81L116,81L116,79L117,79L118,79L119,78L120,78L120,79L120,80L120,81L121,82L123,81L124,81L125,81L126,81L127,80L128,79L129,81L129,83L131,83L131,84L133,84L135,85L135,86L137,85L139,86L140,86L141,87L143,88L144,88L145,90L145,92L143,94L142,95L141,96L141,99L141,100L140,101L140,103L139,104L139,105L138,106L137,106L135,106L134,107L132,108L132,109L132,110L131,111L130,112L129,114L128,115L127,116L126,116L126,115L124,114L123,113ZM272,55L272,56L270,56L269,56L269,55L271,55L272,55ZM206,102L207,103L208,104L209,105L208,106L207,107L206,108L204,109L203,109L202,110L201,109L200,108L200,105L201,105L201,101L203,101L204,101L205,101ZM195,76L196,75L198,75L199,74L200,74L201,74L202,72L203,72L204,73L203,74L205,75L206,76L206,77L207,78L206,78L205,78L203,78L202,79L200,78L199,78L198,79L197,79L196,81L195,80L194,78L195,77L195,76ZM118,34L116,34L115,33L117,33L118,34ZM56,34L54,34L53,33L52,33L53,33L54,33L56,34ZM124,32L124,33L126,33L127,34L127,35L127,36L126,36L126,35L125,36L123,35L121,35L121,34L123,32L124,31L124,32ZM98,20L97,21L96,21L98,20ZM95,17L96,18L97,18L98,19L100,19L97,19L96,19L94,20L93,19L94,18L94,17ZM84,14L82,14L80,14L82,13L83,13L84,14ZM89,14L89,15L91,14L92,14L93,16L94,15L94,13L96,13L97,13L99,14L98,15L99,16L97,17L95,17L94,16L93,18L92,19L90,19L89,20L88,20L87,21L86,22L85,24L87,24L87,25L89,26L91,26L92,27L94,27L95,28L97,28L98,28L98,30L99,31L100,32L101,30L101,29L102,28L103,27L103,26L101,24L103,23L102,22L102,21L104,21L105,21L107,21L108,21L110,22L111,24L112,24L114,24L115,23L116,24L117,25L119,26L120,27L122,28L123,29L124,30L124,31L123,32L121,32L120,33L118,33L116,33L115,33L114,33L111,34L110,35L109,36L111,35L113,34L115,34L115,35L115,36L117,37L118,37L119,36L120,37L119,38L117,38L116,39L115,39L114,39L116,38L114,38L113,38L112,36L111,36L110,36L109,38L107,38L105,38L104,39L102,39L101,39L100,41L99,41L98,41L98,40L98,39L97,38L96,37L95,37L94,36L93,35L92,35L90,35L89,35L87,35L86,34L85,34L83,34L79,34L76,34L73,34L70,34L67,34L64,34L63,34L60,34L57,34L55,33L53,32L52,31L51,30L49,29L50,28L48,26L47,25L46,24L45,23L44,24L43,24L41,23L40,23L39,23L39,17L39,13L41,14L42,14L43,14L46,13L47,13L49,13L50,13L52,13L53,13L54,14L56,13L57,13L59,13L60,14L62,14L64,14L65,14L66,15L65,15L67,15L69,15L71,16L72,15L71,15L73,14L75,14L76,15L77,15L79,15L80,15L82,15L84,15L84,16L85,15L86,14L85,13L84,13L84,12L85,11L86,11L87,12L88,13L89,14ZM66,10L68,10L69,11L70,10L71,10L72,11L72,10L73,10L75,10L75,11L77,13L79,13L77,13L76,14L74,14L73,14L71,14L68,14L67,14L65,14L63,13L65,13L66,13L68,13L66,12L64,12L62,12L64,12L62,12L61,11L62,10L65,10L66,10ZM104,10L103,10L102,10L101,10L99,10L102,9L104,10ZM93,10L95,10L98,9L99,10L101,11L102,10L104,11L106,11L108,11L109,12L111,12L113,14L111,14L114,15L115,15L117,16L118,16L116,18L115,18L113,17L112,17L113,18L114,18L115,20L114,20L111,19L113,20L114,21L111,21L109,20L108,20L107,19L105,18L102,19L102,18L104,18L106,18L107,16L105,14L103,14L102,13L101,13L99,13L95,13L93,13L91,13L90,12L90,11L92,9L94,9ZM80,9L81,9L83,9L83,10L83,11L82,12L81,12L78,10L80,10L78,10L80,9ZM87,10L86,11L85,11L84,10L85,9L88,9L89,9L88,10L87,10ZM60,12L57,12L54,11L55,10L55,9L58,9L60,9L62,9L63,9L64,10L63,10L61,10L60,11ZM86,8L84,8L83,8L85,7L86,8ZM82,6L82,7L80,8L79,8L77,7L79,7L80,6L81,6ZM72,7L73,7L74,7L74,8L70,8L68,9L66,9L68,8L64,8L62,8L64,7L65,7L67,7L69,7L71,8L70,7L70,6L71,6ZM85,6L86,6L88,6L90,7L92,7L94,8L95,7L97,7L99,7L100,8L98,9L97,8L94,9L92,9L90,8L88,8L87,7L86,7L84,7L83,6L85,6ZM64,5L63,6L62,7L60,7L59,7L57,7L59,6L61,5L62,6L64,5ZM70,5L68,6L66,5L69,5L70,5ZM70,4L69,5L67,5L68,4L70,4ZM84,5L83,5L81,5L83,4L84,5ZM80,5L79,5L77,5L75,5L76,4L75,4L76,4L79,4ZM93,3L94,4L93,4L91,5L89,5L87,5L86,4L85,4L84,3L85,2L86,2L88,2L89,2L91,2L92,3ZM112,0L114,0L116,0L118,0L116,1L113,1L112,1L115,1L112,2L111,2L109,3L107,3L103,4L104,4L104,5L102,5L100,6L102,6L99,7L97,7L94,7L92,7L91,7L92,6L95,5L94,5L92,5L95,4L93,3L96,3L98,3L96,2L92,2L91,2L89,1L90,1L91,1L93,1L94,0L96,0L97,1L99,0L101,0L104,0L107,0L109,0L112,0ZM190,35L190,37L189,37L188,37L187,37L187,36L188,35L190,35ZM111,136L111,138L112,138L111,139L110,138L109,138L108,137L107,137L105,136L108,137L109,137L110,136L111,136ZM112,104L112,106L113,107L112,108L112,109L111,111L110,111L110,112L110,113L109,114L110,116L110,117L110,118L109,120L109,121L109,122L108,123L108,124L108,125L108,126L109,127L108,129L108,130L108,131L107,132L107,133L108,134L108,135L111,135L110,136L109,136L109,137L107,137L106,136L105,135L105,134L104,132L105,131L106,130L104,130L105,129L106,127L107,127L107,125L106,126L106,125L106,123L106,121L106,120L107,119L108,117L109,115L108,114L109,112L109,111L109,109L110,107L110,104L110,103L110,101L111,101L112,102L111,103L112,104ZM308,33L309,34L311,34L311,35L313,35L315,35L314,36L314,37L313,38L312,38L311,39L311,40L310,40L308,41L307,41L305,42L303,43L301,44L302,43L301,42L300,43L298,44L298,45L300,46L301,45L302,46L301,46L300,47L300,49L301,50L301,51L302,52L302,53L302,55L300,56L300,57L299,58L297,59L296,60L295,60L294,60L292,61L291,62L290,63L290,62L289,61L287,61L287,60L286,60L284,60L282,61L282,62L280,61L279,61L279,60L279,59L278,59L278,58L279,57L279,55L277,55L276,55L276,54L275,54L273,54L273,55L271,55L270,55L269,56L267,55L266,55L264,54L262,53L261,53L260,52L259,51L258,50L259,49L258,48L256,47L255,46L255,45L254,44L255,43L257,43L258,42L260,41L261,40L260,38L262,38L263,36L265,36L266,35L267,34L269,35L270,35L271,37L272,38L273,38L275,39L276,40L277,40L280,40L281,40L282,40L283,41L285,41L286,41L288,41L289,40L290,40L292,39L292,38L293,38L294,38L296,37L297,36L299,36L299,35L297,35L296,35L296,34L298,33L299,33L300,31L300,30L302,30L304,30L305,30L307,31L307,32L308,33ZM177,78L176,78L174,78L172,79L172,78L171,77L172,76L172,75L172,74L172,73L173,73L174,73L175,73L176,73L177,75L177,77L177,78ZM193,81L192,81L190,81L189,79L188,79L189,78L189,77L190,76L192,76L192,75L193,74L194,72L194,71L194,70L195,71L195,73L194,73L195,74L195,75L195,77L194,78L195,79L196,80L196,81L194,81L193,81ZM211,79L211,81L210,82L210,83L210,84L209,85L209,86L209,87L210,88L210,90L211,91L209,91L209,93L208,94L208,95L209,95L208,95L207,95L206,95L205,94L203,94L202,94L202,93L202,92L202,91L201,90L199,90L198,91L197,91L197,90L193,89L192,89L193,88L194,88L195,88L196,87L196,86L196,85L198,84L198,83L198,81L198,80L199,79L199,78L201,79L202,79L204,78L206,78L207,78L208,79L209,79L211,79ZM193,88L192,88L191,87L191,86L192,85L194,85L194,84L194,83L194,82L193,82L193,81L194,81L196,81L197,80L198,79L198,81L198,82L198,83L197,84L196,86L196,87L195,88L194,88ZM105,83L104,83L103,83L101,82L102,80L103,78L102,77L103,76L102,75L103,74L104,74L105,72L106,72L107,71L109,71L108,72L107,73L107,74L108,75L109,76L111,77L112,77L113,77L112,78L113,79L113,80L113,82L112,81L110,81L111,82L110,84L111,85L110,87L110,86L109,85L108,85L106,84L105,83ZM97,75L96,74L95,73L94,72L95,72L96,72L97,73L97,74ZM98,60L99,60L100,60L102,60L103,61L104,62L105,62L104,63L102,63L102,62L100,61L98,61L97,60L96,61L95,61L96,60L97,60ZM213,48L214,48L215,47L214,48L213,48ZM197,34L196,34L195,34L194,34L193,33L194,32L195,32L196,32L198,33L199,34L198,34L197,34ZM190,28L191,29L192,29L194,29L194,30L195,31L193,32L192,33L193,34L193,35L191,35L190,36L189,35L187,35L188,34L187,34L186,33L186,31L187,30L188,29L189,28L190,28ZM223,70L223,71L222,72L222,71L223,70ZM191,27L190,28L189,28L188,26L189,26L191,25L190,26ZM108,63L109,63L110,64L111,64L110,65L109,65L108,64L108,63ZM192,60L189,61L186,63L184,64L183,64L182,63L178,60L175,58L171,56L171,54L173,53L174,53L175,52L176,52L177,51L179,51L178,49L178,48L179,47L180,47L181,46L183,46L185,46L186,46L187,46L188,46L188,48L188,49L188,50L189,53L190,54L190,55L190,56L190,58L190,59L192,59ZM100,86L100,85L99,85L99,84L100,83L101,82L102,82L103,83L105,83L104,85L103,86L102,86L101,88L100,87L100,86ZM215,53L214,55L213,55L212,53L213,54L213,55L214,57L215,58L216,59L217,61L213,61L209,61L205,61L205,57L205,54L205,52L205,51L206,51L207,52L208,52L210,52L211,51L212,52L213,52L214,52L215,53ZM222,70L220,68L219,68L218,68L216,69L217,67L217,66L218,65L219,66L219,67L221,69L222,70ZM171,41L171,40L172,39L173,39L175,39L176,40L178,40L180,40L182,41L183,41L182,42L181,42L180,44L180,45L179,46L177,46L176,46L175,47L173,46L173,45L173,44L173,43L173,42L172,41L171,41ZM204,25L203,24L205,24L206,23L207,24L208,24L208,25L206,26L205,25ZM218,68L219,68L220,68L221,69L222,70L222,71L223,72L223,73L227,75L225,78L224,78L222,79L221,79L220,79L219,79L217,79L216,78L215,76L214,75L214,74L214,72L215,71L216,69L218,69ZM209,14L210,15L209,16L210,17L210,19L212,20L210,21L208,22L206,23L204,23L203,23L201,22L202,21L201,20L202,19L205,18L204,17L204,15L202,14L201,14L202,14L204,14L205,14L206,14L208,13L209,13ZM119,135L120,134L121,134L121,135L119,135ZM184,33L185,33L186,34L188,34L187,35L186,36L187,37L187,39L187,40L185,40L183,40L182,41L181,40L178,40L179,39L179,37L178,36L176,35L177,34L178,34L178,33L179,34L181,33L183,32L184,33ZM191,87L190,86L189,84L189,83L191,82L191,81L192,81L193,82L194,82L194,83L194,84L194,85L193,85L191,86L191,87ZM174,28L173,29L172,28L174,28ZM177,24L176,25L177,25L178,25L177,27L178,27L179,28L180,30L182,30L181,31L181,32L179,32L178,32L176,33L175,33L174,33L176,32L175,31L176,31L175,30L177,30L176,28L175,28L175,27L174,26L174,25L176,24L177,24ZM222,41L221,40L220,40L222,40L224,40L225,40L226,41L225,42L224,42L223,41L222,41ZM181,77L179,78L178,78L177,77L177,76L177,73L177,72L179,72L180,72L180,74L181,75L180,76L181,77ZM172,75L171,75L170,74L169,73L168,73L167,74L166,73L165,72L166,71L166,70L168,71L169,71L170,71L172,72L172,73L172,74ZM163,70L164,69L165,69L164,70L163,70ZM165,72L164,71L164,70L166,70L166,71L165,72ZM189,82L190,81L191,81L191,82L190,82ZM204,47L205,48L206,48L205,48L204,48ZM207,41L205,42L204,42L203,43L203,44L204,45L203,45L203,47L202,46L201,45L200,44L201,43L202,42L203,42L204,42L205,42L206,42ZM133,0L137,0L140,0L141,0L145,0L153,0L159,0L157,1L153,1L148,1L152,1L155,1L157,1L157,2L159,1L164,1L167,1L164,2L160,3L162,3L161,4L160,5L162,6L160,6L158,6L160,7L159,8L161,9L158,9L160,9L158,10L156,10L158,10L156,10L158,12L156,13L154,12L154,13L156,13L158,13L155,14L152,15L149,15L148,15L147,15L146,16L144,17L142,17L140,18L139,19L137,20L137,22L137,23L135,23L134,22L132,22L131,22L130,21L128,19L128,18L126,17L126,16L127,15L129,14L129,13L128,13L127,14L125,13L126,12L127,12L129,12L127,12L125,12L125,10L124,9L123,8L121,8L119,7L117,7L114,7L111,7L110,7L109,6L111,6L113,6L109,5L107,5L111,4L114,4L112,3L116,2L118,2L120,1L123,1L126,1L127,1L130,1L132,1L133,1L135,1L133,1ZM90,69L89,69L88,68L88,67L90,67L89,66L90,65L91,65L91,67L92,67L91,68L90,69ZM127,80L126,81L125,81L126,79L126,78L127,78L128,78L128,80ZM120,75L122,76L122,77L123,78L122,79L123,80L123,81L122,81L121,82L120,81L120,79L120,78L119,77L120,76L120,75ZM93,70L92,69L91,69L91,68L92,67L93,67L94,67L95,67L96,67L97,68L96,68L95,68L94,69L93,70ZM199,37L199,38L198,38L197,38L196,39L198,40L196,39L195,38L194,38L195,38L197,36L198,37L199,37ZM107,63L108,63L108,64L107,65L106,65L107,65L107,64ZM196,36L197,35L199,35L200,35L201,34L202,35L202,36L200,37L199,37L198,37L197,36ZM304,93L303,93L304,92L305,92L304,93ZM298,91L299,91L298,92L297,92L298,91ZM303,91L301,92L300,92L301,92L303,91ZM289,90L291,90L293,90L294,91L296,91L295,92L293,91L292,91L291,91L289,91L288,91L286,90L285,90L286,89L287,89L288,89ZM310,86L309,86L308,86L309,86L310,86ZM314,84L314,86L315,86L316,85L317,85L319,85L321,86L321,89L321,92L319,91L318,91L319,90L318,89L316,88L314,87L313,87L312,86L313,85L312,85L311,84L312,84L314,84ZM305,82L304,83L303,83L301,83L300,84L301,84L303,84L302,85L302,86L303,88L303,89L303,87L302,88L301,87L301,86L300,87L300,89L299,88L300,87L299,86L299,85L300,83L301,82L303,82L304,82L305,81ZM309,82L308,83L307,82L308,81L309,82ZM298,81L299,82L298,82L298,84L297,84L297,85L296,87L295,87L294,86L292,86L291,86L290,85L289,83L289,82L291,82L292,82L293,82L294,82L295,80L296,79L297,79L297,80L298,81ZM286,89L285,89L283,87L281,86L280,84L279,82L278,81L276,79L275,78L277,78L278,79L280,80L281,81L282,81L283,82L283,84L284,84L285,85L286,86L286,87L286,89ZM258,48L259,49L259,50L259,51L260,52L261,53L260,54L261,55L262,55L263,56L265,56L266,56L267,57L268,56L268,55L270,56L271,56L272,55L273,54L275,54L276,54L276,55L277,55L277,56L275,56L275,58L274,59L273,60L272,59L271,59L272,58L271,58L270,58L269,57L269,58L269,59L269,60L269,61L267,62L266,63L265,64L264,65L262,66L261,67L260,69L260,71L260,73L259,73L258,75L257,74L256,73L256,72L255,70L255,69L254,67L253,65L253,64L253,63L253,62L251,62L249,61L248,59L251,59L250,57L250,56L251,55L252,55L253,54L253,53L254,52L255,51L254,50L254,48L256,48L257,48L258,48ZM174,29L173,31L171,31L170,31L171,30L170,29L172,28L173,28L174,29ZM234,46L236,45L237,45L238,45L240,46L241,49L241,50L241,51L241,53L242,54L243,55L243,56L242,57L241,58L240,58L239,57L237,57L237,56L236,56L235,57L233,56L232,55L231,54L230,53L229,53L228,53L228,51L226,50L225,49L226,48L225,46L224,45L224,44L225,44L227,44L228,43L229,45L230,46L232,46L234,46ZM225,47L226,48L226,50L227,51L228,52L229,53L227,53L227,54L225,54L222,52L220,51L219,51L219,50L221,49L221,47L222,46L223,46L224,46L225,47ZM165,17L166,18L165,19L162,19L160,19L157,19L158,19L156,18L158,18L156,17L158,17L159,17L161,17L162,17L164,16L165,17ZM216,50L215,51L215,53L214,52L215,50ZM196,45L195,46L194,46L192,45L194,45L195,45ZM189,42L190,44L188,44L188,43ZM192,36L194,36L194,37L192,38L193,39L194,39L195,41L196,41L198,42L198,43L197,43L197,44L196,45L196,44L195,43L194,42L193,42L191,41L190,39L189,39L188,39L187,38L187,37L188,37L189,37L190,37L191,36L192,36ZM216,51L217,51L219,50L219,51L217,51L218,52L217,53L215,54L215,52L216,51ZM315,49L314,50L313,50L312,50L313,49L314,49ZM321,46L321,47L319,48L317,48L316,50L315,48L313,49L312,49L311,49L312,50L311,52L310,52L310,51L309,50L310,49L312,48L315,47L316,47L317,46L319,45L320,44L320,42L321,42L322,43L321,45L321,46ZM324,39L325,39L326,40L324,40L323,41L322,40L321,41L320,41L320,40L321,40L322,38L323,38ZM251,41L249,42L248,42L247,42L246,40L245,39L243,39L242,39L241,39L239,37L236,38L236,42L235,41L233,41L231,40L230,39L231,38L233,38L233,37L232,36L230,36L229,37L228,35L226,35L227,34L228,33L229,33L231,31L232,31L235,32L236,32L237,32L238,32L240,32L241,32L240,31L241,31L241,29L245,29L248,28L251,28L251,29L252,29L254,29L257,29L258,30L260,32L262,32L263,32L264,33L266,33L267,33L267,34L266,36L263,36L262,37L260,38L261,40L260,41L258,40L256,40L254,40L252,40ZM221,84L221,85L220,86L220,87L218,87L214,84L214,83L215,82L215,80L214,79L215,77L216,79L218,79L220,80L221,79L222,79L221,80L221,84ZM251,41L253,40L256,40L258,40L259,40L260,41L259,41L257,42L255,42L254,43L252,44L251,43L249,43L251,43L252,43L253,42L252,42L250,41ZM283,72L283,71L282,70L284,69L285,69L286,68L288,69L287,71L286,71L284,73ZM308,44L309,46L309,47L308,48L306,49L307,47L306,46L306,45L308,45ZM285,69L286,67L285,66L283,65L282,65L281,65L281,64L280,63L281,62L282,61L283,62L284,62L284,63L285,64L286,66L287,67L287,69L286,69ZM172,79L171,78L170,77L169,76L169,75L170,74L171,75L172,75L171,77L172,77L172,79ZM195,60L194,60L192,60L191,58L189,57L190,56L190,55L190,54L190,52L191,51L191,50L193,50L194,50L195,51L197,52L198,52L199,53L200,52L200,51L202,50L203,50L204,51L205,51L205,52L205,54L205,57L205,61L205,63L204,63L200,62L196,60L195,60ZM262,75L262,77L260,77L260,75L260,73L261,74L262,75ZM209,112L209,113L208,114L208,112L209,112ZM203,29L201,28L202,27L204,27L205,27L206,27L206,29L204,29L203,29ZM201,27L202,26L203,25L204,26L205,25L206,26L208,26L208,27L207,27L206,27L204,27L202,27L201,27ZM175,47L176,48L177,48L178,49L179,50L177,51L176,51L175,52L174,53L173,53L171,54L171,55L170,56L169,56L167,58L166,59L166,61L163,62L164,60L164,59L165,58L166,57L167,55L168,55L170,54L170,52L171,50L172,49L174,48L175,47ZM207,35L208,35L209,35L210,36L209,37L208,36L207,35ZM230,95L230,97L230,98L230,99L230,100L229,101L229,102L229,103L228,105L228,107L227,108L225,109L224,108L224,107L223,105L224,104L224,102L224,101L224,100L224,99L226,99L227,98L228,97L229,96L229,95ZM83,57L82,59L82,60L82,61L83,62L84,64L85,64L86,65L88,64L89,64L90,62L91,62L93,61L93,63L92,64L92,65L90,65L89,65L89,66L88,67L88,68L87,67L85,67L84,67L83,67L81,66L79,66L78,65L76,65L75,64L74,63L75,62L74,60L73,59L72,58L71,57L70,56L69,55L68,55L67,53L67,52L66,51L65,53L66,54L67,55L68,56L69,57L69,58L70,59L70,60L69,59L68,58L68,57L67,56L66,56L66,55L65,54L64,53L63,51L64,50L65,50L67,51L69,52L71,52L73,51L75,52L76,53L77,54L78,53L80,54L80,55L81,57L82,57ZM201,41L202,41L203,41L202,42L201,42ZM168,68L169,68L170,68L174,67L174,62L174,58L175,58L178,60L182,62L183,63L184,64L184,66L184,67L181,68L180,68L179,68L178,68L177,69L176,70L175,72L175,73L174,73L172,73L171,72L171,71L170,71L169,71L168,70L168,68ZM280,63L278,63L278,64L278,65L279,67L278,68L279,69L279,70L280,71L279,72L279,73L279,72L279,70L278,68L278,67L277,67L275,67L274,67L275,66L274,65L274,64L272,62L273,61L273,60L273,59L275,58L275,57L276,56L277,55L279,55L279,57L278,58L278,59L279,59L279,60L279,61L280,61L280,63ZM268,34L269,34L271,33L272,32L274,33L276,33L277,33L278,33L279,31L280,31L281,31L282,32L284,33L285,33L286,33L287,33L288,33L289,34L291,34L292,34L293,33L294,33L295,33L297,33L295,35L297,35L299,35L300,36L297,36L296,37L294,38L293,38L292,38L291,39L291,40L289,40L288,41L286,41L285,41L283,41L282,40L281,40L280,40L277,40L276,40L275,39L273,38L272,38L271,38L271,36L269,35L268,34ZM215,95L217,95L218,94L220,94L220,95L221,97L220,98L219,100L217,101L216,102L215,103L215,105L216,106L215,107L214,108L213,108L213,110L212,109L212,107L211,105L212,104L213,103L213,102L213,100L212,99L210,99L210,98L213,97L214,98L214,99L215,99L216,98L215,97L214,95ZM168,68L167,67L165,66L164,67L163,66L164,65L164,64L164,63L163,62L167,62L167,60L168,60L168,57L171,57L171,56L175,58L174,58L174,62L175,67L170,68L169,68L168,68ZM215,95L215,97L216,98L216,99L215,100L214,98L214,97L213,97L213,96L213,95L213,94L213,92L214,92L215,95ZM281,77L282,77L283,78L283,79L284,80L284,81L283,81L281,80L281,79L280,78L280,77L281,77ZM299,79L297,79L296,79L296,80L295,82L293,82L292,82L291,82L290,81L291,81L292,80L293,80L294,78L295,79L295,78L297,76L298,77L299,78L299,79ZM196,112L195,110L195,109L194,107L194,106L194,105L193,103L192,101L192,100L193,100L198,100L201,101L203,101L205,100L204,101L202,101L201,105L200,105L200,108L200,111L198,112L197,112L196,112ZM346,104L347,105L346,105L345,104L344,103L345,103ZM182,71L181,70L180,69L180,68L181,68L183,68L184,67L184,64L186,63L189,61L192,60L194,60L195,60L195,62L196,63L195,65L195,66L194,67L194,69L194,70L192,70L191,70L190,70L188,70L187,70L185,69L184,69L184,70L182,71ZM189,78L187,79L186,79L185,77L184,77L183,75L183,74L184,73L184,72L184,70L184,69L185,69L186,70L188,70L189,70L190,70L192,70L193,69L194,71L194,72L193,73L193,74L192,75L191,76L190,76L189,78ZM94,72L93,71L92,70L93,70L94,69L95,68L96,68L96,69L97,71L96,72L95,72ZM186,29L187,30L187,31L186,32L185,32L184,32L185,30L186,29ZM208,12L211,13L210,13L211,13L209,14L208,13L206,13L205,14L204,14L202,14L201,14L200,14L198,14L197,15L195,17L194,18L193,19L192,20L192,21L192,23L191,24L188,25L187,25L186,24L185,23L185,21L186,20L189,20L191,19L192,17L195,15L196,14L199,13L201,13L203,13L205,12L206,12L208,12ZM205,5L202,6L201,5L203,5L205,5ZM198,3L202,4L199,4L198,5L196,6L194,6L195,5L193,5L191,4L193,3L195,3L197,3L198,3ZM205,3L207,3L206,3L203,4L200,3L198,3L197,3L200,2L202,3L203,2L205,3ZM268,55L268,56L267,57L266,56L265,56L263,56L262,55L261,55L260,54L260,53L262,53L263,54L265,54L267,55L268,55ZM353,124L354,124L354,125L353,126L351,127L351,129L349,130L348,130L347,129L347,128L348,127L350,127L351,126L352,125L353,123ZM355,119L355,120L357,121L358,121L358,122L357,122L357,123L356,124L355,124L355,123L354,123L355,121L354,120L353,118L354,118ZM239,62L238,63L238,64L237,64L236,65L235,66L234,66L232,64L235,63L236,61L235,60L236,59L237,59L239,59L239,60L239,61ZM255,46L256,47L258,48L257,48L256,48L254,48L254,50L255,51L254,52L253,53L253,54L252,55L251,55L250,56L250,57L251,59L249,59L247,59L246,58L245,58L243,58L241,58L242,57L243,56L243,55L242,54L241,53L243,54L244,54L245,54L246,53L247,52L249,51L250,50L250,49L251,49L252,48L251,47L253,46L254,46L255,46ZM102,76L102,75L101,74L100,75L100,76L99,75L98,75L97,74L98,74L99,74L100,73L101,74L103,74L103,75ZM110,101L109,101L107,99L105,98L104,97L103,95L102,93L101,91L100,90L99,89L99,88L100,86L100,87L101,88L102,87L103,86L104,85L105,83L106,84L107,85L108,85L109,85L109,87L108,88L107,88L107,90L106,91L107,92L108,93L110,92L109,94L110,94L111,96L111,97L111,98L111,100L110,101ZM306,75L307,76L306,77L306,76L306,77L304,77L304,76L303,76L302,76L302,75L303,74L305,74L305,73L306,74ZM304,73L303,74L302,73L303,72L304,72L304,73ZM299,74L297,75L298,73L300,72L299,73ZM302,71L303,71L302,73L302,72ZM306,71L306,72L305,73L304,72L304,70L305,70ZM301,64L302,65L303,66L302,67L302,69L303,69L304,69L304,70L303,69L301,69L301,68L300,67L300,65L301,64ZM332,88L331,89L330,89L328,89L329,89L330,89L332,88ZM327,90L329,92L330,93L330,94L329,93L328,93L327,92L325,91L323,91L323,92L321,92L321,89L321,86L323,86L325,87L326,88L328,89L327,90ZM333,87L332,86L331,86L332,86L333,87ZM195,32L195,31L194,30L196,28L198,28L199,28L200,29L201,29L203,29L204,30L204,31L204,32L203,34L202,34L200,34L199,33L198,33L197,33L195,32ZM311,41L310,41L309,42L308,43L308,44L307,45L306,45L305,45L305,44L304,43L306,42L307,41L310,41L311,41ZM171,41L172,41L173,41L173,43L173,44L173,45L173,46L172,46L171,45L171,44L171,42L171,41ZM117,105L118,104L118,103L120,102L121,102L122,103L122,105L123,105L124,105L124,107L126,107L126,108L125,110L124,110L122,110L121,110L122,109L121,108L120,107L117,105ZM203,35L204,35L205,35L206,35L207,35L208,36L208,38L209,38L209,39L207,39L206,39L204,39L203,39L202,38L201,37L202,36L203,35ZM324,32L325,34L323,34L323,35L324,36L322,37L322,35L322,34L322,32L322,31L322,30L323,29L323,30L323,31L324,32ZM203,29L201,29L200,29L201,28L202,28ZM5,16L8,16L10,17L9,17L7,18L7,19L6,19L4,18L3,17L2,18L0,17L0,14L2,15L5,16ZM1,12L0,12L1,11L2,12L1,12ZM324,10L322,10L320,10L322,9L323,10ZM331,8L330,8L328,8L326,8L328,8L331,8ZM325,7L321,8L319,8L317,8L319,7L321,7L325,7ZM238,12L234,12L232,12L232,10L234,9L236,8L238,7L241,7L244,7L246,6L248,6L245,7L242,8L238,9L237,10L235,11L238,12ZM287,6L288,6L291,6L293,7L293,8L290,9L292,9L293,9L294,9L296,9L299,9L303,10L305,9L307,9L309,10L308,11L310,12L311,12L312,11L314,12L316,11L317,12L320,12L319,11L320,10L330,11L333,12L337,12L339,12L340,13L341,14L342,13L344,13L346,14L348,13L350,14L351,14L350,13L354,13L356,13L359,14L360,14L360,18L359,18L357,18L358,19L359,20L357,20L355,21L352,22L351,23L349,22L346,23L345,23L344,23L342,25L343,25L343,27L342,27L342,28L340,29L340,30L339,30L338,31L337,32L336,30L335,28L336,26L337,25L338,25L340,24L342,23L344,22L344,20L343,21L340,22L339,21L337,22L334,23L333,24L331,24L330,23L329,24L325,24L322,24L319,26L315,28L317,28L318,29L320,29L321,30L321,32L321,33L320,35L319,36L317,38L316,39L314,40L312,40L311,40L311,39L312,38L313,38L314,37L314,36L315,35L313,35L311,35L311,34L309,34L308,33L307,32L307,31L306,30L304,30L302,30L301,30L301,31L299,32L298,33L297,33L295,33L294,33L293,33L292,34L291,34L289,34L288,34L287,33L286,33L285,33L284,33L282,32L281,31L280,31L279,31L278,32L277,33L276,33L275,33L273,33L271,33L269,34L268,34L267,33L266,33L264,33L263,32L262,32L261,32L258,30L257,29L254,29L253,30L252,29L251,29L251,28L249,28L246,28L241,29L242,30L241,30L242,32L240,32L238,32L237,32L236,32L235,32L232,31L231,31L229,32L228,33L227,34L226,35L228,35L229,36L228,37L227,38L228,39L229,41L227,42L226,41L225,40L222,40L221,40L220,40L219,39L218,38L218,37L219,36L218,36L220,35L220,34L219,33L217,33L215,32L214,32L214,31L213,31L212,31L211,30L212,30L211,29L211,28L210,27L208,27L208,26L207,24L209,23L208,22L210,21L211,21L210,19L210,18L209,16L210,15L208,15L209,14L211,13L212,13L214,14L217,14L220,15L221,16L220,17L218,17L214,16L215,18L215,19L216,19L217,19L220,18L222,17L223,17L224,17L224,16L223,14L226,15L226,16L228,16L230,15L234,14L235,15L237,15L239,14L240,15L241,14L240,13L244,13L245,14L249,15L248,14L247,14L247,12L249,11L249,10L253,10L252,12L253,13L253,14L254,15L251,17L252,17L254,16L255,15L255,14L254,14L254,12L253,12L255,11L256,12L258,11L260,11L262,11L261,9L262,9L265,9L267,9L267,8L268,8L270,7L273,7L276,7L279,7L281,7L282,6L284,5L286,6L285,6L287,6ZM285,5L279,5L281,4L283,4L285,4ZM231,2L230,3L229,3L228,3L227,3L225,2L227,2L228,2L230,2L232,2ZM280,4L278,4L275,4L273,4L271,3L274,2L276,2L278,2L280,3ZM210,84L211,85L210,86L209,85L210,84ZM171,56L171,57L168,57L168,60L167,60L167,62L163,62L165,61L166,59L167,58L168,57L169,56L171,56ZM223,67L222,66L221,64L220,63L219,62L219,60L218,59L217,59L217,57L216,56L215,55L215,54L216,54L218,53L217,51L219,51L220,51L222,52L225,54L227,54L228,54L229,55L230,56L230,57L231,58L232,60L235,61L235,63L232,64L229,64L228,65L227,66L226,66L225,66L224,66L223,66ZM214,74L213,72L213,71L212,71L212,72L211,73L210,73L208,74L207,74L206,73L205,73L204,74L204,73L203,72L203,71L202,70L202,69L203,68L204,67L204,63L205,63L205,61L209,61L213,61L217,61L217,62L217,63L217,64L218,65L217,66L217,67L216,68L216,69L216,70L215,72L214,73ZM214,74L214,75L214,76L215,77L214,79L213,79L211,79L210,79L209,79L207,78L206,77L206,76L205,75L205,73L206,73L207,74L208,73L209,74L210,73L211,73L212,72L213,71L213,72L214,74ZM163,69L162,68L163,67L164,67L165,66L167,67L168,68L168,70L168,71L166,70L164,70L163,71L164,70L165,70L164,69L163,69ZM169,76L168,76L167,75L167,74L169,73L169,74L169,75L169,76ZM92,70L91,70L90,69L91,69L92,69ZM229,74L228,75L224,74L223,72L225,73L226,72L227,72L228,72L229,72L229,73ZM230,71L231,71L231,72L231,74L230,75L229,76L229,78L228,79L227,80L226,81L224,82L223,83L222,84L221,84L221,80L222,79L223,79L225,78L228,75L229,74L229,72ZM201,38L202,39L203,40L202,41L201,40L200,40L200,39L199,38L200,37L201,37ZM123,77L124,77L125,77L126,77L126,79L126,80L125,80L124,81L123,80L122,79L123,78ZM199,34L200,34L201,34L203,34L201,34L200,35L199,35L198,35L197,35L198,34L199,34ZM194,36L195,36L196,36L196,37L195,37ZM202,17L201,18L200,19L198,20L197,22L199,23L198,24L197,24L196,26L196,27L195,27L193,28L193,27L192,26L191,24L192,23L193,22L192,20L193,19L194,19L195,17L196,16L198,15L200,15L202,14L204,15L204,17L202,17ZM219,50L217,51L216,50L216,49L216,48L217,46L218,46L220,46L221,46L222,46L221,47L221,49L219,50ZM194,70L194,69L194,67L195,66L195,65L196,63L195,62L195,60L196,60L200,62L204,63L204,67L203,68L202,69L202,70L203,71L202,72L201,74L200,74L199,74L198,75L197,75L195,76L195,75L194,73L195,73L195,71L194,70ZM182,77L181,77L180,76L181,75L180,74L180,72L181,72L181,73L182,76ZM283,71L281,70L279,72L279,74L280,75L281,76L282,77L281,77L280,76L279,75L278,74L279,73L279,72L280,71L279,70L279,69L278,68L279,67L278,65L278,64L278,63L280,63L281,63L281,65L282,65L283,65L285,66L285,67L286,68L284,69L283,69L283,71ZM251,43L250,43L251,43L252,44L254,44L255,45L255,46L254,46L253,46L251,46L251,45L250,45L249,46L248,46L248,45L247,44L249,43L249,42L251,42ZM241,47L239,46L237,45L236,45L235,46L234,45L234,44L233,43L233,42L234,42L234,41L233,41L234,41L235,42L237,42L239,40L240,41L240,42L242,42L242,43L244,44L245,45L247,45L246,46L245,47L243,47L242,48L241,47ZM305,92L306,91L307,91L306,92L305,92ZM189,53L189,51L188,50L188,48L188,47L190,46L191,46L191,47L191,48L190,49L191,50L191,51L190,52L189,53ZM217,42L218,42L220,42L222,41L223,41L224,42L224,43L224,45L225,46L223,46L221,46L220,46L218,46L217,46L216,47L215,46L213,47L211,46L210,47L209,46L208,46L207,45L207,44L207,43L209,43L211,42L212,41L214,41L215,41L217,42ZM207,42L206,42L207,41L208,41L209,42L208,42ZM302,59L301,60L300,60L301,58L302,58ZM214,84L218,86L219,88L219,89L219,90L219,91L220,92L220,93L218,94L217,95L215,94L214,93L213,92L212,92L210,90L209,89L209,87L211,87L210,85L210,84L212,84L214,84ZM212,84L211,84L210,84L210,83L210,82L211,81L211,79L212,79L213,79L214,79L215,81L214,82L214,84L212,84ZM212,31L213,31L214,31L214,32L215,32L217,33L218,33L220,33L220,35L219,35L217,36L216,36L215,37L217,38L215,38L214,39L212,38L214,37L212,37L211,36L210,38L209,38L209,37L210,37L209,36L208,35L207,35L206,35L205,35L204,35L203,35L202,34L203,33L204,31L205,31L206,31L207,31L209,32L210,32L212,31ZM122,113L124,114L125,114L127,116L127,117L125,118L124,118L123,117L122,117L122,115L122,114ZM85,34L86,34L87,35L88,35L90,35L92,35L93,35L94,35L95,36L96,37L97,38L98,39L98,40L97,41L99,41L100,41L101,40L102,39L103,39L105,38L107,38L108,38L110,37L111,36L112,36L112,37L112,39L111,39L110,39L109,41L110,41L109,42L108,42L106,42L108,42L107,42L106,43L105,44L105,45L104,44L104,45L104,46L104,47L103,48L101,49L100,50L99,52L99,53L99,55L100,56L100,57L99,58L98,56L97,55L97,54L96,53L95,53L94,53L92,53L91,53L91,54L90,54L88,53L87,53L85,54L84,54L83,55L83,56L83,57L82,57L81,56L80,55L79,54L78,53L76,54L75,52L74,52L72,51L69,52L67,51L65,50L64,50L63,50L62,49L61,49L60,49L58,47L57,45L56,44L56,43L56,41L56,39L56,38L56,37L56,36L55,35L57,35L57,36L58,35L60,34L63,34L64,34L67,34L70,34L73,34L76,34L79,34L83,34L85,34ZM8,19L10,19L11,20L10,20L8,20ZM25,12L26,12L28,12L29,13L30,12L32,13L34,13L36,13L38,13L39,13L39,17L39,23L40,23L41,23L43,24L44,24L45,23L46,24L47,25L48,26L50,27L49,28L48,28L46,26L46,25L45,25L43,25L42,25L40,23L39,23L37,23L36,23L34,23L33,22L32,22L30,23L28,24L29,22L30,22L28,22L26,24L26,25L25,25L24,26L22,27L20,27L19,28L18,28L15,29L16,28L17,28L18,27L19,27L21,26L22,25L23,24L22,24L20,24L19,24L18,23L16,23L15,22L14,21L15,20L16,20L18,19L19,19L19,18L18,18L16,18L15,19L14,18L12,17L13,17L16,16L18,17L16,16L15,15L13,15L16,14L17,14L18,13L19,13L21,12L22,12L23,12L25,12ZM247,46L245,45L244,44L242,43L242,42L240,42L240,41L239,40L237,41L236,42L236,38L239,37L240,38L242,39L243,39L245,39L246,40L246,41L248,42L249,42L250,41L251,42L253,42L252,43L251,43L249,42L249,43L247,44L248,45L248,46L247,46ZM109,71L108,73L108,74L109,73L110,72L111,72L113,72L114,72L115,73L117,72L118,72L119,74L120,75L119,76L119,77L119,78L118,79L117,79L115,79L116,80L117,81L116,82L115,82L114,82L113,81L113,80L112,78L112,77L111,77L110,76L108,76L108,75L107,74L107,73L108,71ZM288,61L287,62L286,63L286,65L287,66L288,67L289,70L289,71L287,73L285,74L285,73L285,72L286,72L287,71L288,69L288,68L287,66L285,64L284,64L285,63L283,62L283,61L283,60L284,60L286,60L287,60L287,61L288,61ZM233,66L232,67L231,68L230,68L228,69L227,70L226,70L224,70L223,70L223,69L223,68L223,67L223,66L223,65L225,66L226,66L227,66L228,65L229,64L232,64L233,66ZM212,112L211,113L209,115L207,116L206,117L205,117L204,117L203,117L202,117L200,118L199,117L198,116L198,115L198,114L196,112L197,112L198,112L200,111L200,108L201,109L201,110L202,109L203,108L205,109L206,108L207,107L209,105L211,105L212,107L212,108L211,109L212,110L213,110L212,111L212,112ZM209,112L208,112L207,113L208,114L209,113ZM213,92L213,94L213,95L213,96L213,97L210,98L209,99L208,100L206,101L205,101L204,100L203,100L202,96L204,96L204,95L205,94L207,95L208,95L209,96L210,95L209,95L208,94L209,93L209,92L210,91L212,92L213,92ZM211,105L210,105L209,105L208,104L206,102L205,101L206,101L208,100L209,99L210,99L212,99L213,100L213,101L213,102L213,103L211,105Z`;

const CROPS = [
  { id:"tomato", name:"Tomato", latin:"Solanum lycopersicum", type:"Fruit", color:"#BD5736",
    sun:"Full sun", water:2, soil:"Rich loam", ph:[6.0,6.8], temp:[18,29],
    germ:"6–8", maturity:75, sow:[2,3,4],
    stages:[["Sow",0],["Sprout",7],["Seedling",24],["Grow",45],["Flower",58],["Harvest",75]],
    note:"A warm-season favourite. Needs steady heat and consistent moisture — shelter from frost on both ends of the season." },
  { id:"carrot", name:"Carrot", latin:"Daucus carota", type:"Vegetable", color:"#BE8E2C",
    sun:"Full sun", water:2, soil:"Loose & sandy", ph:[6.0,6.8], temp:[16,21],
    germ:"14–21", maturity:70, sow:[3,4,5,6],
    stages:[["Sow",0],["Sprout",17],["Seedling",30],["Root",55],["Harvest",70]],
    note:"A cool-tolerant root. Sow direct into deep, stone-free soil and thin the seedlings so roots size up evenly." },
  { id:"strawberry", name:"Strawberry", latin:"Fragaria × ananassa", type:"Fruit", color:"#C44A3C",
    sun:"Full sun", water:2, soil:"Fertile loam", ph:[5.5,6.8], temp:[15,26],
    germ:"from plants", maturity:75, sow:[2,3,4],
    stages:[["Plant",0],["Root",21],["Flower",45],["Fruit",60],["Harvest",75]],
    note:"Usually grown from young plants or runners. Mulch underneath to keep fruit clean and crops perennially each year." },
  { id:"lettuce", name:"Lettuce", latin:"Lactuca sativa", type:"Vegetable", color:"#4E7A4C",
    sun:"Part – full sun", water:3, soil:"Moist loam", ph:[6.0,7.0], temp:[10,20],
    germ:"7–10", maturity:50, sow:[2,3,7,8],
    stages:[["Sow",0],["Sprout",8],["Seedling",20],["Leaf",38],["Harvest",50]],
    note:"A quick cool-season crop that bolts in heat. Sow a little every few weeks for a steady supply of leaves." },
  { id:"pepper", name:"Bell Pepper", latin:"Capsicum annuum", type:"Fruit", color:"#C25A2E",
    sun:"Full sun", water:2, soil:"Rich loam", ph:[6.0,6.8], temp:[21,29],
    germ:"7–14", maturity:85, sow:[2,3],
    stages:[["Sow",0],["Sprout",10],["Seedling",30],["Grow",52],["Flower",66],["Harvest",85]],
    note:"Heat-loving and slow to start, so sow early indoors. Let fruit ripen on the plant for deeper colour and sweetness." },
  { id:"basil", name:"Basil", latin:"Ocimum basilicum", type:"Herb", color:"#5C8A3F",
    sun:"Full sun", water:2, soil:"Moist loam", ph:[6.0,7.0], temp:[18,30],
    germ:"5–10", maturity:55, sow:[3,4,5],
    stages:[["Sow",0],["Sprout",7],["Seedling",22],["Leaf",42],["Harvest",55]],
    note:"A tender, frost-shy herb. Pinch out the growing tips often to keep plants bushy and delay flowering." },
  { id:"cucumber", name:"Cucumber", latin:"Cucumis sativus", type:"Fruit", color:"#4F7A3A",
    sun:"Full sun", water:3, soil:"Rich, moist", ph:[6.0,7.0], temp:[18,30],
    germ:"7–10", maturity:60, sow:[3,4,5],
    stages:[["Sow",0],["Sprout",8],["Seedling",22],["Vine",40],["Flower",50],["Harvest",60]],
    note:"A thirsty, warm-season climber. Train it up a support to save space and pick often to keep new fruit coming." },
  { id:"eggplant", name:"Eggplant", latin:"Solanum melongena", type:"Fruit", color:"#7A5290",
    sun:"Full sun", water:2, soil:"Rich loam", ph:[5.5,6.8], temp:[21,30],
    germ:"7–14", maturity:80, sow:[2,3],
    stages:[["Sow",0],["Sprout",12],["Seedling",32],["Grow",55],["Flower",66],["Harvest",80]],
    note:"A heat-lover like pepper — slow to start, so sow early indoors. Harvest while the skin is still glossy and firm." },
  { id:"pumpkin", name:"Pumpkin", latin:"Cucurbita pepo", type:"Fruit", color:"#C56A1E",
    sun:"Full sun", water:2, soil:"Rich, deep", ph:[6.0,6.8], temp:[20,30],
    germ:"7–10", maturity:110, sow:[4,5],
    stages:[["Sow",0],["Sprout",9],["Vine",35],["Flower",60],["Fruit",85],["Harvest",110]],
    note:"A sprawling, hungry crop that needs room to roam. Let fruit cure in the sun before storing it for the winter." },
  { id:"blueberry", name:"Blueberry", latin:"Vaccinium corymbosum", type:"Fruit", color:"#5E6FA8",
    sun:"Full – part sun", water:2, soil:"Acidic, peaty", ph:[4.5,5.5], temp:[15,27],
    germ:"from plants", maturity:90, sow:[2,3],
    stages:[["Plant",0],["Root",25],["Flower",50],["Fruit",75],["Harvest",90]],
    note:"A perennial bush that crops more each year. It needs acidic soil — grow in ericaceous compost if your ground is limey." },
  { id:"potato", name:"Potato", latin:"Solanum tuberosum", type:"Vegetable", color:"#C49A66",
    sun:"Full sun", water:2, soil:"Loose, fertile", ph:[5.0,6.0], temp:[15,20],
    germ:"from tubers", maturity:90, sow:[2,3,4],
    stages:[["Plant",0],["Sprout",18],["Foliage",40],["Flower",60],["Harvest",90]],
    note:"Grown from seed potatoes, not seed. Mound soil over the stems as they grow to stop the tubers greening in the light." },
  { id:"onion", name:"Onion", latin:"Allium cepa", type:"Vegetable", color:"#C9824C",
    sun:"Full sun", water:2, soil:"Firm, fertile", ph:[6.0,7.0], temp:[13,24],
    germ:"from sets", maturity:100, sow:[2,3],
    stages:[["Plant",0],["Root",20],["Leaf",45],["Bulb",75],["Harvest",100]],
    note:"Easiest from sets — small bulbs planted in spring. Ease off the watering once the tops flop over and start to yellow." },
  { id:"spinach", name:"Spinach", latin:"Spinacia oleracea", type:"Vegetable", color:"#3F7140",
    sun:"Part – full sun", water:3, soil:"Moist, rich", ph:[6.0,7.0], temp:[10,20],
    germ:"7–14", maturity:45, sow:[2,3,7,8],
    stages:[["Sow",0],["Sprout",10],["Seedling",22],["Leaf",36],["Harvest",45]],
    note:"A fast, cool-season leaf that bolts in summer heat. Sow in spring and again in autumn for the most tender crops." },
  { id:"pea", name:"Pea", latin:"Pisum sativum", type:"Vegetable", color:"#6FA03F",
    sun:"Full sun", water:2, soil:"Well-drained loam", ph:[6.0,7.0], temp:[13,18],
    germ:"7–14", maturity:65, sow:[2,3,4],
    stages:[["Sow",0],["Sprout",10],["Seedling",24],["Climb",40],["Flower",52],["Harvest",65]],
    note:"A cool-season climber — give it netting or twigs to scramble up. Pick the pods young and often for the sweetest peas." },
  { id:"radish", name:"Radish", latin:"Raphanus sativus", type:"Vegetable", color:"#C24A60",
    sun:"Full – part sun", water:2, soil:"Light, moist", ph:[6.0,7.0], temp:[10,18],
    germ:"4–7", maturity:25, sow:[2,3,4,5,6,7,8],
    stages:[["Sow",0],["Sprout",5],["Seedling",12],["Root",20],["Harvest",25]],
    note:"The quickest crop you can grow — ready in about a month. Sow a short row every couple of weeks for a steady supply." },
  { id:"mint", name:"Mint", latin:"Mentha spicata", type:"Herb", color:"#5FA05A",
    sun:"Part – full sun", water:3, soil:"Moist, rich", ph:[6.0,7.0], temp:[15,25],
    germ:"from plants", maturity:60, sow:[3,4,5],
    stages:[["Plant",0],["Root",20],["Spread",40],["Leaf",50],["Harvest",60]],
    note:"Vigorous to the point of invasive — grow it in a sunken pot to keep the runners from taking over your beds." },
  { id:"apple", name:"Apple", latin:"Malus domestica", type:"Tree", color:"#C0413E", perennial:true, clim:{chill:true},
    sun:"Full sun", water:2, soil:"Loam, well-drained", ph:[6.0,7.0], temp:[15,24],
    germ:"from a young tree", years:"2–4", sow:[10,11,0,1,2], harvest:[7,8,9],
    arc:[["Plant","Yr 0"],["Establish","Yr 1"],["First fruit","Yr 2–4"],["Full crop","Yr 5+"]],
    note:"A temperate tree that needs a cold winter to fruit well — not one for the tropics. Most kinds want a second variety nearby to pollinate." },
  { id:"banana", name:"Banana", latin:"Musa acuminata", type:"Tree", color:"#E6B62E", perennial:true, clim:{warmth:3},
    sun:"Full sun", water:3, soil:"Rich, moist", ph:[5.5,7.0], temp:[20,30],
    germ:"from a sucker", years:"1–2", sow:[3,4,5], harvest:[6,7,8,9],
    arc:[["Plant","Yr 0"],["Grow","~6 mo"],["Flower","~12 mo"],["First fruit","1–2 yr"]],
    note:"A fast tropical perennial that loves heat and humidity — but a single frost will kill it. If you have no real winter, you're in business." },
  { id:"lemon", name:"Lemon", latin:"Citrus limon", type:"Tree", color:"#D9CF3A", perennial:true, clim:{warmth:2},
    sun:"Full sun", water:2, soil:"Loam, well-drained", ph:[6.0,7.0], temp:[13,29],
    germ:"from a young tree", years:"2–3", sow:[2,3,4], harvest:[10,11,0,1],
    arc:[["Plant","Yr 0"],["Establish","Yr 1"],["First fruit","Yr 2–3"],["Full crop","Yr 4+"]],
    note:"A subtropical evergreen that hates frost — keep it in a pot you can move under cover where winters bite. It loves a sunny, sheltered spot." },
  { id:"orange", name:"Orange", latin:"Citrus sinensis", type:"Tree", color:"#E58A2A", perennial:true, clim:{warmth:2},
    sun:"Full sun", water:2, soil:"Loam, well-drained", ph:[6.0,7.5], temp:[15,29],
    germ:"from a young tree", years:"3–4", sow:[2,3,4], harvest:[11,0,1,2],
    arc:[["Plant","Yr 0"],["Establish","Yr 1"],["First fruit","Yr 3–4"],["Full crop","Yr 5+"]],
    note:"A subtropical citrus that sweetens in warm sun and mild winters. Frost-tender while young, so shelter it through any cold snaps." },
  { id:"cherry", name:"Cherry", latin:"Prunus avium", type:"Tree", color:"#A8324A", perennial:true, clim:{chill:true},
    sun:"Full sun", water:2, soil:"Loam, well-drained", ph:[6.0,7.0], temp:[15,24],
    germ:"from a young tree", years:"3–5", sow:[10,11,0,1,2], harvest:[5,6],
    arc:[["Plant","Yr 0"],["Establish","Yr 1–2"],["First fruit","Yr 3–5"],["Full crop","Yr 6+"]],
    note:"A temperate tree that needs winter cold to set fruit. Be quick at harvest — and net it, or the birds will beat you to every cherry." },
  { id:"mango", name:"Mango", latin:"Mangifera indica", type:"Tree", color:"#DD6E3A", perennial:true, clim:{warmth:3},
    sun:"Full sun", water:2, soil:"Rich, well-drained", ph:[5.5,7.5], temp:[21,35],
    germ:"from a young tree", years:"3–5", sow:[3,4,5], harvest:[5,6,7],
    arc:[["Plant","Yr 0"],["Establish","Yr 1–2"],["First fruit","Yr 3–5"],["Full crop","Yr 6+"]],
    note:"A true tropical that wants long, hot summers and no frost at all. In a cool climate it's a greenhouse-only dream." },
  { id:"watermelon", name:"Watermelon", latin:"Citrullus lanatus", type:"Fruit", color:"#5AA152",
    sun:"Full sun", water:3, soil:"Rich, well-drained", ph:[6.0,6.8], temp:[21,35],
    germ:"7–10", maturity:90, sow:[3,4,5],
    stages:[["Sow",0],["Sprout",8],["Vine",30],["Flower",50],["Fruit",70],["Harvest",90]],
    note:"Needs a long, hot summer and plenty of room to ramble. Tap a ripe one and it sounds hollow — that's your cue." },
  { id:"melon", name:"Melon", latin:"Cucumis melo", type:"Fruit", color:"#D7B06A",
    sun:"Full sun", water:2, soil:"Rich, well-drained", ph:[6.0,6.8], temp:[18,30],
    germ:"7–10", maturity:85, sow:[3,4,5],
    stages:[["Sow",0],["Sprout",8],["Vine",28],["Flower",48],["Fruit",68],["Harvest",85]],
    note:"A heat-lover — the more warmth, the sweeter the fruit. A ripe melon slips easily from the vine and smells fragrant." },
  { id:"sweetcorn", name:"Sweetcorn", latin:"Zea mays", type:"Vegetable", color:"#D8A93A",
    sun:"Full sun", water:2, soil:"Rich, fertile", ph:[6.0,6.8], temp:[18,32],
    germ:"7–10", maturity:80, sow:[3,4,5],
    stages:[["Sow",0],["Sprout",9],["Knee-high",30],["Tassel",55],["Silk",65],["Harvest",80]],
    note:"Plant it in a block rather than a row so the wind can pollinate it. Pick when the kernels run milky if you nick one." },
  { id:"sweetpotato", name:"Sweet Potato", latin:"Ipomoea batatas", type:"Vegetable", color:"#C2703C",
    sun:"Full sun", water:2, soil:"Loose, sandy", ph:[5.5,6.5], temp:[21,30],
    germ:"from slips", maturity:110, sow:[4,5],
    stages:[["Plant",0],["Root",20],["Vine",50],["Tuber",80],["Harvest",110]],
    note:"Grown from rooted cuttings called slips. It needs a long, hot, frost-free season — genuinely tricky in cool climates." },
  { id:"butternut", name:"Butternut Squash", latin:"Cucurbita moschata", type:"Fruit", color:"#D2A862",
    sun:"Full sun", water:2, soil:"Rich, deep", ph:[6.0,6.8], temp:[18,30],
    germ:"7–10", maturity:100, sow:[4,5],
    stages:[["Sow",0],["Sprout",9],["Vine",35],["Flower",58],["Fruit",80],["Harvest",100]],
    note:"Like pumpkin, it sprawls and feeds heavily over a long warm season. Let the skin harden and cure it before storing." },
  { id:"okra", name:"Okra", latin:"Abelmoschus esculentus", type:"Vegetable", color:"#5E8C3F",
    sun:"Full sun", water:2, soil:"Rich loam", ph:[6.0,6.8], temp:[24,35],
    germ:"7–14", maturity:60, sow:[4,5],
    stages:[["Sow",0],["Sprout",10],["Seedling",28],["Flower",45],["Pod",55],["Harvest",60]],
    note:"Thrives in real heat and sulks when it's cool. Pick the pods young and often, or they turn tough and stringy." },
  { id:"parsley", name:"Parsley", latin:"Petroselinum crispum", type:"Herb", color:"#4A8A48",
    sun:"Part – full sun", water:2, soil:"Moist, rich", ph:[6.0,7.0], temp:[10,21],
    germ:"14–28", maturity:75, sow:[2,3,4,7,8],
    stages:[["Sow",0],["Sprout",21],["Seedling",40],["Leaf",60],["Harvest",75]],
    note:"Slow to germinate, so be patient. It's a cut-and-come-again leaf that runs to seed in its second year." },
  { id:"cilantro", name:"Cilantro", latin:"Coriandrum sativum", type:"Herb", color:"#5FA050",
    sun:"Part – full sun", water:2, soil:"Light, moist", ph:[6.0,6.8], temp:[10,24],
    germ:"7–14", maturity:45, sow:[2,3,7,8,9],
    stages:[["Sow",0],["Sprout",10],["Seedling",22],["Leaf",36],["Harvest",45]],
    note:"Bolts fast in summer heat — sow in the cool of spring and autumn. Let some flower to harvest coriander seed." },
  { id:"rosemary", name:"Rosemary", latin:"Salvia rosmarinus", type:"Herb", color:"#6F8F72",
    sun:"Full sun", water:1, soil:"Light, well-drained", ph:[6.0,7.5], temp:[15,30],
    germ:"from plants", maturity:90, sow:[3,4,5],
    stages:[["Plant",0],["Root",25],["Grow",55],["Bush",75],["Harvest",90]],
    note:"A woody Mediterranean perennial that loves sun and sharp drainage and hates soggy soil. Hardy to a light frost." },
  { id:"thyme", name:"Thyme", latin:"Thymus vulgaris", type:"Herb", color:"#6B8E5A",
    sun:"Full sun", water:1, soil:"Light, well-drained", ph:[6.0,8.0], temp:[13,28],
    germ:"from plants", maturity:80, sow:[3,4,5],
    stages:[["Plant",0],["Root",25],["Spread",50],["Harvest",80]],
    note:"A low, creeping perennial that thrives on neglect and good drainage. Trim it back after it flowers to stay bushy." },
  { id:"sage", name:"Sage", latin:"Salvia officinalis", type:"Herb", color:"#8AA07E",
    sun:"Full sun", water:1, soil:"Well-drained loam", ph:[6.0,7.0], temp:[15,28],
    germ:"from plants", maturity:90, sow:[3,4,5],
    stages:[["Plant",0],["Root",25],["Grow",55],["Bush",75],["Harvest",90]],
    note:"A hardy, silvery perennial — give it sun and good drainage. Replace the woody old plants every few years." },
  { id:"oregano", name:"Oregano", latin:"Origanum vulgare", type:"Herb", color:"#5E8C4E",
    sun:"Full sun", water:1, soil:"Light, well-drained", ph:[6.0,8.0], temp:[15,28],
    germ:"7–14", maturity:80, sow:[3,4,5],
    stages:[["Sow",0],["Sprout",12],["Seedling",30],["Leaf",55],["Harvest",80]],
    note:"A tough Mediterranean perennial whose flavour deepens in poor, dry soil and full sun. Easy and long-lived." },
  { id:"chives", name:"Chives", latin:"Allium schoenoprasum", type:"Herb", color:"#5A9A5E",
    sun:"Part – full sun", water:2, soil:"Moist, rich", ph:[6.0,7.0], temp:[10,24],
    germ:"14–21", maturity:75, sow:[2,3,4],
    stages:[["Sow",0],["Sprout",18],["Grass",40],["Clump",60],["Harvest",75]],
    note:"A hardy perennial onion relative — snip the grassy leaves often, and the purple pompom flowers are edible too." },
  { id:"dill", name:"Dill", latin:"Anethum graveolens", type:"Herb", color:"#69A24A",
    sun:"Full sun", water:2, soil:"Light, well-drained", ph:[5.5,6.5], temp:[13,24],
    germ:"7–14", maturity:55, sow:[3,4,5,6],
    stages:[["Sow",0],["Sprout",12],["Seedling",28],["Feather",42],["Harvest",55]],
    note:"A feathery annual that bolts to seed quickly — sow a little and often, and harvest both the leaf and the seed." },
  { id:"lavender", name:"Lavender", latin:"Lavandula angustifolia", type:"Herb", color:"#9488BE",
    sun:"Full sun", water:1, soil:"Light, well-drained", ph:[6.5,8.0], temp:[15,30],
    germ:"from plants", maturity:120, sow:[3,4,5],
    stages:[["Plant",0],["Root",30],["Grow",70],["Flower",100],["Harvest",120]],
    note:"A sun-loving Mediterranean perennial grown for its fragrant flowers. It needs sharp drainage and hates wet feet." },
  { id:"lemongrass", name:"Lemongrass", latin:"Cymbopogon citratus", type:"Herb", color:"#8AAE5A", clim:{warmth:3},
    sun:"Full sun", water:3, soil:"Rich, moist", ph:[6.0,7.5], temp:[20,33],
    germ:"from plants", maturity:90, sow:[4,5],
    stages:[["Plant",0],["Root",25],["Grass",55],["Clump",75],["Harvest",90]],
    note:"A tropical grass that loves heat and humidity and is killed by frost. In cool climates, grow it in a pot to overwinter indoors." },
  { id:"zucchini", name:"Zucchini", latin:"Cucurbita pepo", type:"Vegetable", color:"#6A9A3F",
    sun:"Full sun", water:3, soil:"Rich, moist", ph:[6.0,7.5], temp:[18,28],
    germ:"6–10", maturity:55, sow:[3,4,5],
    stages:[["Sow",0],["Sprout",8],["Seedling",20],["Flower",38],["Fruit",46],["Harvest",55]],
    note:"A warm-season courgette that crops heavily — pick them young and often, as one plant can feed a street. Sow after the last frost." },
  { id:"kale", name:"Kale", latin:"Brassica oleracea", type:"Vegetable", color:"#3E7A50",
    sun:"Part – full sun", water:2, soil:"Fertile, firm", ph:[6.0,7.5], temp:[7,24],
    germ:"5–8", maturity:60, sow:[2,3,4,5,6,7],
    stages:[["Sow",0],["Sprout",6],["Seedling",18],["Leaf",40],["Harvest",60]],
    note:"A tough, hardy brassica that shrugs off frost — leaves actually sweeten after a cold snap. Pick from the bottom up for a long harvest." },
  { id:"broccoli", name:"Broccoli", latin:"Brassica oleracea", type:"Vegetable", color:"#4E7A4C",
    sun:"Full sun", water:2, soil:"Rich, firm", ph:[6.0,7.0], temp:[10,22],
    germ:"5–10", maturity:80, sow:[2,3,4,7,8],
    stages:[["Sow",0],["Sprout",7],["Seedling",22],["Grow",50],["Harvest",80]],
    note:"A cool-season crop — cut the central head while the buds are still tight, then keep picking the smaller side shoots for weeks." },
  { id:"beetroot", name:"Beetroot", latin:"Beta vulgaris", type:"Vegetable", color:"#9C3B5A",
    sun:"Full sun", water:2, soil:"Loose, fertile", ph:[6.0,7.5], temp:[10,24],
    germ:"7–14", maturity:60, sow:[3,4,5,6,7],
    stages:[["Sow",0],["Sprout",12],["Seedling",26],["Root",45],["Harvest",60]],
    note:"Two crops in one — sweet roots and edible leaves. Each knobbly seed is a cluster, so thin the seedlings to give roots room." },
  { id:"beans", name:"Green Beans", latin:"Phaseolus vulgaris", type:"Vegetable", color:"#6FA03E",
    sun:"Full sun", water:2, soil:"Light, fertile", ph:[6.0,7.0], temp:[18,27],
    germ:"7–12", maturity:60, sow:[3,4,5],
    stages:[["Sow",0],["Sprout",9],["Seedling",22],["Flower",40],["Pod",52],["Harvest",60]],
    note:"A warm-season legume — sow once frost has passed. Pick the pods young and keep picking, and the plants keep cropping." },
  { id:"garlic", name:"Garlic", latin:"Allium sativum", type:"Vegetable", color:"#C9B79A",
    sun:"Full sun", water:1, soil:"Free-draining", ph:[6.0,7.5], temp:[7,24],
    germ:"from cloves", maturity:240, sow:[9,10],
    stages:[["Plant",0],["Root",30],["Leaf",120],["Bulb",210],["Harvest",240]],
    note:"Planted in autumn from single cloves; a spell of winter cold helps the bulbs split into a proper head. Lift them when the leaves yellow next summer." },
  { id:"leek", name:"Leek", latin:"Allium ampeloprasum", type:"Vegetable", color:"#7FA86A",
    sun:"Full sun", water:2, soil:"Rich, deep", ph:[6.0,7.5], temp:[7,24],
    germ:"10–14", maturity:120, sow:[1,2,3],
    stages:[["Sow",0],["Sprout",13],["Seedling",35],["Grow",90],["Harvest",120]],
    note:"Slow, hardy and undemanding. Transplant the seedlings deep and earth them up as they grow to blanch long, tender white stems." },
  { id:"raspberry", name:"Raspberry", latin:"Rubus idaeus", type:"Fruit", color:"#B0405E", perennial:true, clim:{chill:true},
    sun:"Full – part sun", water:2, soil:"Rich, moist", ph:[5.5,6.5], temp:[13,25],
    germ:"from canes", years:"1–2", sow:[2,3,10,11], harvest:[6,7,8],
    arc:[["Plant","Yr 0"],["Establish","Yr 1"],["First fruit","Yr 1–2"],["Full crop","Yr 2+"]],
    note:"Grown from canes; summer kinds fruit on last year's growth. They want a cool winter and dislike heat, so not one for warm climates." },
  { id:"grape", name:"Grape", latin:"Vitis vinifera", type:"Fruit", color:"#6E4A7E", perennial:true, clim:{warmth:2},
    sun:"Full sun", water:1, soil:"Free-draining", ph:[5.5,7.0], temp:[15,30],
    germ:"from a vine", years:"2–3", sow:[2,3], harvest:[8,9],
    arc:[["Plant","Yr 0"],["Establish","Yr 1–2"],["First fruit","Yr 3"],["Full crop","Yr 4+"]],
    note:"A long-lived vine that wants a warm, sunny wall and sharp drainage. Prune it hard every winter — fruit comes on the current year's shoots." },
  { id:"tarragon", name:"Tarragon", latin:"Artemisia dracunculus", type:"Herb", color:"#6FA06A",
    sun:"Full – part sun", water:1, soil:"Light, well-drained", ph:[6.0,7.5], temp:[13,24],
    germ:"from plants", maturity:70, sow:[3,4,5],
    stages:[["Plant",0],["Root",20],["Grow",45],["Bush",60],["Harvest",70]],
    note:"French tarragon is grown from plants, not seed — its aniseed leaves are the prize. Give it sun and dry feet, and shelter it over hard winters." },
  { id:"pear", name:"Pear", latin:"Pyrus communis", type:"Tree", color:"#9CB04E", perennial:true, clim:{chill:true},
    sun:"Full sun", water:2, soil:"Loam, well-drained", ph:[6.0,7.0], temp:[15,24],
    germ:"from a young tree", years:"3–5", sow:[10,11,0,1,2], harvest:[7,8,9],
    arc:[["Plant","Yr 0"],["Establish","Yr 1–2"],["First fruit","Yr 3–5"],["Full crop","Yr 6+"]],
    note:"A temperate tree like the apple — it needs a cold winter to crop, and most want a pollination partner nearby. It flowers early, so late frosts can nip the blossom." },
  { id:"fig", name:"Fig", latin:"Ficus carica", type:"Tree", color:"#6E5A86", perennial:true, clim:{warmth:2},
    sun:"Full sun", water:1, soil:"Free-draining", ph:[6.0,7.5], temp:[15,30],
    germ:"from a young tree", years:"2–3", sow:[2,3,4], harvest:[7,8,9],
    arc:[["Plant","Yr 0"],["Establish","Yr 1"],["First fruit","Yr 2–3"],["Full crop","Yr 4+"]],
    note:"A Mediterranean tree that fruits best against a hot, sunny wall. Crowd its roots — a pot or paving — and it puts energy into figs rather than leaves." },
  { id:"cabbage", name:"Cabbage", latin:"Brassica oleracea", type:"Vegetable", color:"#6F9B6A",
    sun:"Full sun", water:2, soil:"Rich, firm", ph:[6.0,7.5], temp:[10,24],
    germ:"5–10", maturity:90, sow:[2,3,4,7],
    stages:[["Sow",0],["Sprout",8],["Seedling",24],["Grow",55],["Harvest",90]],
    note:"A cool-season brassica — firm the soil well and net against pigeons and caterpillars. Cut the heads once they feel solid." },
  { id:"cauliflower", name:"Cauliflower", latin:"Brassica oleracea", type:"Vegetable", color:"#C9C3A8",
    sun:"Full sun", water:2, soil:"Rich, firm", ph:[6.0,7.0], temp:[10,22],
    germ:"5–10", maturity:95, sow:[2,3,4],
    stages:[["Sow",0],["Sprout",8],["Seedling",24],["Grow",60],["Harvest",95]],
    note:"The fussiest brassica — it needs steady moisture and rich soil or the curds stay small. Snap a leaf over the head to keep it white." },
  { id:"chard", name:"Swiss Chard", latin:"Beta vulgaris", type:"Vegetable", color:"#D24E3A",
    sun:"Part – full sun", water:2, soil:"Fertile, moist", ph:[6.0,7.5], temp:[10,26],
    germ:"7–14", maturity:55, sow:[3,4,5,6,7],
    stages:[["Sow",0],["Sprout",11],["Seedling",24],["Leaf",42],["Harvest",55]],
    note:"A hardy cut-and-come-again leaf with bright stems. Pick the outer leaves and it keeps cropping for months, right through mild winters." },
  { id:"asparagus", name:"Asparagus", latin:"Asparagus officinalis", type:"Vegetable", color:"#6E9B4E", perennial:true,
    sun:"Full sun", water:2, soil:"Free-draining, sandy", ph:[6.5,7.5], temp:[15,25],
    germ:"from crowns", years:"2–3", sow:[2,3], harvest:[3,4,5],
    arc:[["Plant","Yr 0"],["Establish","Yr 1–2"],["First crop","Yr 2–3"],["Full crop","Yr 3+"]],
    note:"A long-term investment grown from crowns — resist cutting any spears for the first two years while it builds strength, then it crops each spring for decades." },
  { id:"celery", name:"Celery", latin:"Apium graveolens", type:"Vegetable", color:"#8FAE5A",
    sun:"Full – part sun", water:3, soil:"Rich, moist", ph:[6.0,7.0], temp:[13,24],
    germ:"14–21", maturity:120, sow:[2,3,4],
    stages:[["Sow",0],["Sprout",18],["Seedling",40],["Grow",90],["Harvest",120]],
    note:"Thirsty and slow — it needs constantly moist, rich soil to grow tender stalks instead of stringy ones. Keep it well watered all season." },
  { id:"blackberry", name:"Blackberry", latin:"Rubus fruticosus", type:"Fruit", color:"#5A3A6E", perennial:true,
    sun:"Full – part sun", water:2, soil:"Fertile, moist", ph:[5.5,7.0], temp:[15,28],
    germ:"from canes", years:"1–2", sow:[2,3,10,11], harvest:[7,8,9],
    arc:[["Plant","Yr 0"],["Establish","Yr 1"],["First fruit","Yr 1–2"],["Full crop","Yr 2+"]],
    note:"Vigorous, easygoing canes that fruit on second-year growth. Train the long canes along a wire or fence and they'll crop for years." },
  { id:"rhubarb", name:"Rhubarb", latin:"Rheum rhabarbarum", type:"Fruit", color:"#C0464A", perennial:true, clim:{chill:true},
    sun:"Full – part sun", water:2, soil:"Rich, deep", ph:[6.0,6.8], temp:[10,24],
    germ:"from crowns", years:"1–2", sow:[9,10,1,2], harvest:[3,4,5],
    arc:[["Plant","Yr 0"],["Establish","Yr 1"],["First crop","Yr 2"],["Full crop","Yr 3+"]],
    note:"A hardy perennial grown from crowns that needs a cold winter. Don't pull any stalks the first year; after that, harvest spring stalks for years. The leaves are toxic — eat only the stalks." },
  { id:"fennel", name:"Fennel", latin:"Foeniculum vulgare", type:"Herb", color:"#7FA050",
    sun:"Full sun", water:2, soil:"Fertile, well-drained", ph:[6.0,7.0], temp:[13,26],
    germ:"10–14", maturity:80, sow:[3,4,5],
    stages:[["Sow",0],["Sprout",12],["Seedling",30],["Feather",55],["Harvest",80]],
    note:"Feathery, aniseed foliage — and Florence types swell a crisp bulb at the base. Give it sun and space; let it flower and it will self-seed freely." },
  { id:"lemonbalm", name:"Lemon Balm", latin:"Melissa officinalis", type:"Herb", color:"#8FB85A",
    sun:"Part – full sun", water:2, soil:"Moist, average", ph:[6.0,7.5], temp:[13,26],
    germ:"from plants", maturity:70, sow:[3,4,5],
    stages:[["Plant",0],["Root",20],["Grow",45],["Bush",60],["Harvest",70]],
    note:"A lemon-scented mint relative — easy, vigorous and best contained. Cut it back hard to keep fresh leaves coming and stop it setting seed." },
  { id:"peach", name:"Peach", latin:"Prunus persica", type:"Tree", color:"#E59A6E", perennial:true, clim:{chill:true},
    sun:"Full sun", water:2, soil:"Loam, well-drained", ph:[6.0,7.0], temp:[16,28],
    germ:"from a young tree", years:"2–4", sow:[10,11,0,1,2], harvest:[6,7],
    arc:[["Plant","Yr 0"],["Establish","Yr 1"],["First fruit","Yr 2–4"],["Full crop","Yr 4+"]],
    note:"Needs a cold winter to set fruit and a warm summer to ripen it, so it likes places with real seasons. Thin the young fruit for size, and watch for leaf curl in wet springs." },
  { id:"plum", name:"Plum", latin:"Prunus domestica", type:"Tree", color:"#7A3F66", perennial:true, clim:{chill:true},
    sun:"Full sun", water:2, soil:"Loam, moist", ph:[6.0,7.0], temp:[15,25],
    germ:"from a young tree", years:"3–5", sow:[10,11,0,1,2], harvest:[7,8],
    arc:[["Plant","Yr 0"],["Establish","Yr 1–2"],["First fruit","Yr 3–5"],["Full crop","Yr 5+"]],
    note:"A hardy temperate tree that needs winter cold. Some kinds self-pollinate, others want a partner. A heavy crop can snap branches, so thin or prop them." },
  { id:"olive", name:"Olive", latin:"Olea europaea", type:"Tree", color:"#6E7A3E", perennial:true, clim:{warmth:2},
    sun:"Full sun", water:1, soil:"Free-draining, poor OK", ph:[6.0,8.0], temp:[15,30],
    germ:"from a young tree", years:"3–5", sow:[3,4,5], harvest:[9,10],
    arc:[["Plant","Yr 0"],["Establish","Yr 1–2"],["First fruit","Yr 3–5"],["Full crop","Yr 5+"]],
    note:"An evergreen Mediterranean tree that thrives on heat, sun and poor, dry soil. It shrugs off light frost once established but won't fruit where summers stay cool." },
  { id:"brussels", name:"Brussels Sprouts", latin:"Brassica oleracea", type:"Vegetable", color:"#5E8C4E",
    sun:"Full sun", water:2, soil:"Rich, very firm", ph:[6.0,7.5], temp:[7,21],
    germ:"5–10", maturity:180, sow:[2,3,4],
    stages:[["Sow",0],["Sprout",8],["Seedling",26],["Grow",100],["Harvest",180]],
    note:"A long, hardy crop whose sprouts sweeten after a frost. Firm the soil hard and stake tall plants, then pick the sprouts from the bottom up." },
  { id:"parsnip", name:"Parsnip", latin:"Pastinaca sativa", type:"Vegetable", color:"#D9C9A2",
    sun:"Full sun", water:2, soil:"Deep, stone-free", ph:[6.0,7.0], temp:[7,21],
    germ:"14–28", maturity:180, sow:[2,3,4],
    stages:[["Sow",0],["Sprout",24],["Seedling",45],["Root",130],["Harvest",180]],
    note:"Slow to start and slow to grow, but worth the wait — leave the roots in the ground through autumn frosts, which turns them sweet and nutty." },
  { id:"broadbeans", name:"Broad Beans", latin:"Vicia faba", type:"Vegetable", color:"#8FA86A",
    sun:"Full sun", water:2, soil:"Firm, fertile", ph:[6.0,7.5], temp:[7,20],
    germ:"7–14", maturity:90, sow:[1,2,3],
    stages:[["Sow",0],["Sprout",12],["Seedling",30],["Flower",55],["Pod",75],["Harvest",90]],
    note:"Hardy and easy — sow in late winter or early spring (or in autumn in mild areas for an earlier crop). Pinch out the tops once pods set to deter blackfly." },
  { id:"pakchoi", name:"Pak Choi", latin:"Brassica rapa", type:"Vegetable", color:"#5FA05A",
    sun:"Part – full sun", water:2, soil:"Fertile, moist", ph:[6.0,7.0], temp:[10,24],
    germ:"5–10", maturity:45, sow:[3,4,7,8],
    stages:[["Sow",0],["Sprout",7],["Seedling",18],["Leaf",34],["Harvest",45]],
    note:"A fast, juicy oriental leaf that bolts in heat and long days — best sown in spring and late summer. Pick the whole head young, or take leaves as you need them." },
  { id:"blackcurrant", name:"Blackcurrant", latin:"Ribes nigrum", type:"Fruit", color:"#3E2E52", perennial:true, clim:{chill:true},
    sun:"Full – part sun", water:2, soil:"Rich, moist", ph:[6.0,6.8], temp:[13,24],
    germ:"from a bush", years:"1–2", sow:[10,11,1,2], harvest:[6,7],
    arc:[["Plant","Yr 0"],["Establish","Yr 1"],["First fruit","Yr 1–2"],["Full crop","Yr 3+"]],
    note:"An easy, very hardy bush that fruits on young wood — cut out the oldest stems each winter. It wants a cool winter and laughs at cold." },
  { id:"gooseberry", name:"Gooseberry", latin:"Ribes uva-crispa", type:"Fruit", color:"#9CB04E", perennial:true, clim:{chill:true},
    sun:"Full – part sun", water:2, soil:"Fertile, moist", ph:[6.0,7.0], temp:[13,24],
    germ:"from a bush", years:"1–2", sow:[10,11,1,2], harvest:[5,6],
    arc:[["Plant","Yr 0"],["Establish","Yr 1"],["First fruit","Yr 1–2"],["Full crop","Yr 3+"]],
    note:"A thorny, tough bush for cool climates. Thin the crop in late spring for big, sweet dessert berries, or pick them early and tart for cooking." },
  { id:"kiwi", name:"Kiwi", latin:"Actinidia deliciosa", type:"Fruit", color:"#8A7A4E", perennial:true, clim:{warmth:2},
    sun:"Full sun", water:2, soil:"Rich, well-drained", ph:[5.5,7.0], temp:[15,28],
    germ:"from a vine", years:"3–5", sow:[3,4], harvest:[9,10],
    arc:[["Plant","Yr 0"],["Establish","Yr 1–2"],["First fruit","Yr 3–5"],["Full crop","Yr 5+"]],
    note:"A big, vigorous vine that needs a sturdy frame and usually both a male and female plant to fruit. It wants a long warm summer and a cool winter to rest." },
  { id:"chamomile", name:"Chamomile", latin:"Chamaemelum nobile", type:"Herb", color:"#E0CC7E",
    sun:"Full sun", water:1, soil:"Light, sandy", ph:[5.5,7.5], temp:[13,26],
    germ:"10–14", maturity:70, sow:[3,4,5],
    stages:[["Sow",0],["Sprout",12],["Seedling",28],["Flower",50],["Harvest",70]],
    note:"Feathery foliage topped with little daisy flowers for tea. It likes poor, dry, sunny ground and self-seeds happily once it settles in." },
  { id:"bay", name:"Bay", latin:"Laurus nobilis", type:"Herb", color:"#4E7A4C",
    sun:"Full – part sun", water:2, soil:"Well-drained loam", ph:[6.0,7.5], temp:[13,28],
    germ:"from a young plant", maturity:120, sow:[4,5,6],
    stages:[["Plant",0],["Root",30],["Grow",75],["Bush",100],["Harvest",120]],
    note:"A slow evergreen — once established it gives aromatic leaves all year. Frost-tender when young, so pot it where winters bite, and clip it to shape." },
  { id:"apricot", name:"Apricot", latin:"Prunus armeniaca", type:"Tree", color:"#E6A24E", perennial:true, clim:{chill:true},
    sun:"Full sun", water:2, soil:"Loam, well-drained", ph:[6.0,7.0], temp:[15,28],
    germ:"from a young tree", years:"2–4", sow:[10,11,0,1,2], harvest:[6,7],
    arc:[["Plant","Yr 0"],["Establish","Yr 1"],["First fruit","Yr 2–4"],["Full crop","Yr 4+"]],
    note:"A stone fruit that needs winter cold but flowers very early, so late frosts often catch the blossom — a warm, sheltered wall really helps it crop." },
  { id:"pomegranate", name:"Pomegranate", latin:"Punica granatum", type:"Tree", color:"#C24A40", perennial:true, clim:{warmth:2},
    sun:"Full sun", water:1, soil:"Free-draining", ph:[5.5,7.5], temp:[15,32],
    germ:"from a young tree", years:"2–3", sow:[3,4,5], harvest:[9,10],
    arc:[["Plant","Yr 0"],["Establish","Yr 1"],["First fruit","Yr 2–3"],["Full crop","Yr 4+"]],
    note:"A tough, drought-hardy shrub-tree that needs long, hot summers to ripen its fruit. It takes some frost once established but won't crop in cool climates." },
  { id:"avocado", name:"Avocado", latin:"Persea americana", type:"Tree", color:"#557A34", perennial:true, clim:{warmth:3},
    sun:"Full sun", water:2, soil:"Rich, very free-draining", ph:[6.0,7.0], temp:[18,30],
    germ:"from a young tree", years:"3–5", sow:[3,4,5], harvest:[0,1,2],
    arc:[["Plant","Yr 0"],["Establish","Yr 1–2"],["First fruit","Yr 3–5"],["Full crop","Yr 5+"]],
    note:"A subtropical evergreen that hates frost and wet roots — it needs real warmth and sharp drainage. Grafted trees fruit far sooner than one grown from a stone." },
  { id:"chilli", name:"Chilli Pepper", latin:"Capsicum annuum", type:"Fruit", color:"#C0392E",
    sun:"Full sun", water:2, soil:"Rich loam", ph:[6.0,6.8], temp:[21,30],
    germ:"10–21", maturity:90, sow:[1,2,3],
    stages:[["Sow",0],["Sprout",14],["Seedling",32],["Grow",55],["Flower",70],["Harvest",90]],
    note:"Even more heat-loving than sweet peppers, so sow early indoors. The more sun and warmth, the hotter the fruit — pick green, or leave it to ripen red." },
  { id:"turnip", name:"Turnip", latin:"Brassica rapa", type:"Vegetable", color:"#CBB0C2",
    sun:"Full sun", water:2, soil:"Loose, fertile", ph:[6.0,7.0], temp:[7,22],
    germ:"5–10", maturity:50, sow:[2,3,4,7,8],
    stages:[["Sow",0],["Sprout",7],["Seedling",20],["Root",38],["Harvest",50]],
    note:"A fast, cool-season root — sow in spring and again in late summer. Pull them young and tender, and don't waste the peppery leafy tops." },
  { id:"rocket", name:"Rocket", latin:"Eruca vesicaria", type:"Vegetable", color:"#5E8C3E",
    sun:"Part – full sun", water:2, soil:"Moist, average", ph:[6.0,7.0], temp:[10,22],
    germ:"5–8", maturity:35, sow:[2,3,4,8,9],
    stages:[["Sow",0],["Sprout",6],["Seedling",16],["Leaf",28],["Harvest",35]],
    note:"A peppery salad leaf ready in weeks. It bolts fast in summer heat, so sow a little and often at the cooler ends of the year." },
  { id:"artichoke", name:"Globe Artichoke", latin:"Cynara cardunculus", type:"Vegetable", color:"#7E9A7E", perennial:true,
    sun:"Full sun", water:2, soil:"Rich, free-draining", ph:[6.5,7.5], temp:[13,24],
    germ:"from offsets", years:"1–2", sow:[3,4], harvest:[5,6,7],
    arc:[["Plant","Yr 0"],["Establish","Yr 1"],["First crop","Yr 1–2"],["Full crop","Yr 3+"]],
    note:"A big, architectural perennial — you eat the flower buds before they open. Grown from offsets, it crops from its second summer for several years." },
  { id:"redcurrant", name:"Redcurrant", latin:"Ribes rubrum", type:"Fruit", color:"#C0413E", perennial:true, clim:{chill:true},
    sun:"Full – part sun", water:2, soil:"Fertile, moist", ph:[6.0,7.0], temp:[13,24],
    germ:"from a bush", years:"1–2", sow:[10,11,1,2], harvest:[6,7],
    arc:[["Plant","Yr 0"],["Establish","Yr 1"],["First fruit","Yr 1–2"],["Full crop","Yr 3+"]],
    note:"A hardy bush strung with jewel-red berries. Unlike blackcurrants it fruits on older wood, so prune it more lightly. It wants a cool winter." },
  { id:"passionfruit", name:"Passionfruit", latin:"Passiflora edulis", type:"Fruit", color:"#6E4A7E", perennial:true, clim:{warmth:2},
    sun:"Full sun", water:2, soil:"Rich, well-drained", ph:[6.0,7.0], temp:[18,30],
    germ:"from a vine", years:"1–2", sow:[3,4,5], harvest:[8,9,10],
    arc:[["Plant","Yr 0"],["Establish","Yr 1"],["First fruit","Yr 1–2"],["Full crop","Yr 2+"]],
    note:"A fast, exotic climber for warm gardens — give it a sturdy trellis and a frost-free spot. It can fruit in its first or second year where summers run long and hot." },
  { id:"marjoram", name:"Marjoram", latin:"Origanum majorana", type:"Herb", color:"#7EA85E",
    sun:"Full sun", water:1, soil:"Light, well-drained", ph:[6.0,8.0], temp:[13,28],
    germ:"8–14", maturity:80, sow:[3,4,5],
    stages:[["Sow",0],["Sprout",12],["Seedling",30],["Leaf",55],["Harvest",80]],
    note:"Sweeter and milder than its cousin oregano. A sun-lover that wants dry, well-drained soil; tender in hard winters, so pot it up or grow it as an annual where it's cold." },
  { id:"sorrel", name:"Sorrel", latin:"Rumex acetosa", type:"Herb", color:"#6E9A3E",
    sun:"Part – full sun", water:2, soil:"Moist, fertile", ph:[5.5,6.8], temp:[7,24],
    germ:"10–14", maturity:60, sow:[3,4,5],
    stages:[["Sow",0],["Sprout",12],["Seedling",28],["Leaf",45],["Harvest",60]],
    note:"A hardy perennial leaf with a sharp, lemony tang — best young in salads. Pick often and snap off flower stalks to keep tender new leaves coming." },
  { id:"lemonverbena", name:"Lemon Verbena", latin:"Aloysia citrodora", type:"Herb", color:"#8FB85A",
    sun:"Full sun", water:2, soil:"Light, well-drained", ph:[6.0,7.5], temp:[15,28],
    germ:"from plants", maturity:90, sow:[4,5,6],
    stages:[["Plant",0],["Root",25],["Grow",55],["Bush",75],["Harvest",90]],
    note:"Intensely lemon-scented leaves on a tender shrub — the finest of the lemon herbs for tea. Grow it in a pot to bring under cover where winters are cold." },
  { id:"lime", name:"Lime", latin:"Citrus aurantiifolia", type:"Tree", color:"#8FB84A", perennial:true, clim:{warmth:3},
    sun:"Full sun", water:2, soil:"Loam, well-drained", ph:[6.0,7.0], temp:[15,30],
    germ:"from a young tree", years:"2–3", sow:[3,4,5], harvest:[7,8,9,10],
    arc:[["Plant","Yr 0"],["Establish","Yr 1"],["First fruit","Yr 2–3"],["Full crop","Yr 4+"]],
    note:"The most frost-tender of the common citrus — it needs real warmth and won't take any cold. A sheltered sunny spot, or a pot you can move under cover, suits it best." },
  { id:"almond", name:"Almond", latin:"Prunus dulcis", type:"Tree", color:"#DDB88E", perennial:true, clim:{chill:true},
    sun:"Full sun", water:1, soil:"Loam, free-draining", ph:[6.0,7.5], temp:[15,30],
    germ:"from a young tree", years:"3–5", sow:[10,11,0,1,2], harvest:[7,8],
    arc:[["Plant","Yr 0"],["Establish","Yr 1–2"],["First fruit","Yr 3–5"],["Full crop","Yr 5+"]],
    note:"A close cousin of the peach, grown for its nut. It needs winter cold but blossoms very early like the apricot, so late frosts can cost you a crop in cooler areas." },
  { id:"quince", name:"Quince", latin:"Cydonia oblonga", type:"Tree", color:"#DDC257", perennial:true, clim:{chill:true},
    sun:"Full sun", water:2, soil:"Loam, moist", ph:[6.0,7.0], temp:[15,25],
    germ:"from a young tree", years:"3–4", sow:[10,11,0,1,2], harvest:[9,10],
    arc:[["Plant","Yr 0"],["Establish","Yr 1–2"],["First fruit","Yr 3–4"],["Full crop","Yr 5+"]],
    note:"An old-fashioned hardy tree with fragrant golden autumn fruit — hard and sour raw, but turning pink and perfumed when cooked. Mostly self-fertile, so one tree will crop." },
  { id:"kohlrabi", name:"Kohlrabi", latin:"Brassica oleracea", type:"Vegetable", color:"#A9BD8A",
    sun:"Full sun", water:2, soil:"Fertile, firm", ph:[6.0,7.5], temp:[10,24],
    germ:"5–10", maturity:60, sow:[3,4,5,7,8],
    stages:[["Sow",0],["Sprout",8],["Seedling",22],["Grow",45],["Harvest",60]],
    note:"A quirky brassica grown for its swollen stem, which sits on the soil like a green or purple sputnik. Harvest it young — golf-ball to tennis-ball size — before it turns woody." },
  { id:"springonion", name:"Spring Onion", latin:"Allium cepa", type:"Vegetable", color:"#8FB85E",
    sun:"Full sun", water:2, soil:"Fertile, light", ph:[6.0,7.5], temp:[10,24],
    germ:"7–14", maturity:60, sow:[2,3,4,5,6,7,8],
    stages:[["Sow",0],["Sprout",10],["Seedling",24],["Grow",45],["Harvest",60]],
    note:"Quick, mild onions pulled young for salads. Sow a short row every few weeks through the season for a steady supply — no waiting around for bulbs." },
  { id:"pineapple", name:"Pineapple", latin:"Ananas comosus", type:"Fruit", color:"#D9A83E", perennial:true, clim:{warmth:3},
    sun:"Full sun", water:2, soil:"Free-draining, sandy", ph:[4.5,6.5], temp:[20,30],
    germ:"from a crown", years:"1–2", sow:[3,4,5,6], harvest:[6,7,8,9],
    arc:[["Plant","Yr 0"],["Establish","Yr 1"],["First fruit","Yr 1–2"],["Full crop","Yr 2+"]],
    note:"A tropical ground bromeliad you can start from a leafy supermarket top. It needs real heat and sharp drainage, takes a year or two to fruit, then throws up offsets to do it all again." },
  { id:"goji", name:"Goji Berry", latin:"Lycium barbarum", type:"Fruit", color:"#CC4A33", perennial:true,
    sun:"Full – part sun", water:1, soil:"Well-drained, average", ph:[6.5,8.0], temp:[13,30],
    germ:"from a shrub", years:"2–3", sow:[3,4,5], harvest:[7,8,9],
    arc:[["Plant","Yr 0"],["Establish","Yr 1"],["First fruit","Yr 2–3"],["Full crop","Yr 3+"]],
    note:"A tough, sprawling shrub that shrugs off cold, heat and poor soil. It fruits on new wood from its second or third year — give it a trim and a support to keep it tidy." },
  { id:"physalis", name:"Cape Gooseberry", latin:"Physalis peruviana", type:"Fruit", color:"#D9A23E",
    sun:"Full sun", water:2, soil:"Average, well-drained", ph:[6.0,7.0], temp:[15,28],
    germ:"10–14", maturity:100, sow:[2,3,4],
    stages:[["Sow",0],["Sprout",12],["Seedling",32],["Flower",55],["Fruit",75],["Harvest",100]],
    note:"A relative of the tomato that wraps each sweet golden berry in a papery lantern. Grow it like a tomato — the fruit is ripe when the husk turns straw-brown and drops." },
  { id:"lovage", name:"Lovage", latin:"Levisticum officinale", type:"Herb", color:"#6E9A4E",
    sun:"Full – part sun", water:2, soil:"Rich, moist", ph:[6.0,7.5], temp:[10,26],
    germ:"10–20", maturity:80, sow:[3,4,5],
    stages:[["Sow",0],["Sprout",15],["Seedling",35],["Leaf",60],["Harvest",80]],
    note:"A big, hardy perennial that tastes intensely of celery — a little goes a long way in soups and stocks. One plant is plenty; cut it back to keep fresh young leaves coming." },
  { id:"borage", name:"Borage", latin:"Borago officinalis", type:"Herb", color:"#5E84C2",
    sun:"Full sun", water:1, soil:"Average, well-drained", ph:[6.0,7.5], temp:[13,28],
    germ:"7–14", maturity:60, sow:[3,4,5,6],
    stages:[["Sow",0],["Sprout",10],["Seedling",26],["Flower",45],["Harvest",60]],
    note:"A cheerful, bee-loving herb with edible star-shaped blue flowers and cucumber-flavoured leaves. It self-seeds with abandon, so deadhead it if you want to keep it in check." },
  { id:"savory", name:"Summer Savory", latin:"Satureja hortensis", type:"Herb", color:"#7E9A5A",
    sun:"Full sun", water:1, soil:"Light, well-drained", ph:[6.0,7.5], temp:[15,28],
    germ:"10–15", maturity:70, sow:[4,5],
    stages:[["Sow",0],["Sprout",12],["Seedling",30],["Leaf",50],["Harvest",70]],
    note:"A peppery annual herb, the classic partner for beans. It likes warmth, sun and poor, dry soil — pick sprigs as the flowers start to open for the best flavour." },
  { id:"walnut", name:"Walnut", latin:"Juglans regia", type:"Tree", color:"#7E624A", perennial:true, clim:{chill:true},
    sun:"Full sun", water:2, soil:"Deep, fertile loam", ph:[6.0,7.5], temp:[13,28],
    germ:"from a young tree", years:"4–7", sow:[10,11,0,1,2], harvest:[8,9],
    arc:[["Plant","Yr 0"],["Establish","Yr 1–3"],["First fruit","Yr 4–7"],["Full crop","Yr 8+"]],
    note:"A large, long-lived tree that needs winter cold, space and patience — it can be years before the first nuts. Its roots and leaves suppress nearby plants, so site it well away from the veg." },
  { id:"hazelnut", name:"Hazelnut", latin:"Corylus avellana", type:"Tree", color:"#A07E52", perennial:true, clim:{chill:true},
    sun:"Full – part sun", water:2, soil:"Well-drained loam", ph:[6.0,7.5], temp:[10,24],
    germ:"from a young plant", years:"3–4", sow:[10,11,0,1,2], harvest:[8,9],
    arc:[["Plant","Yr 0"],["Establish","Yr 1–2"],["First fruit","Yr 3–4"],["Full crop","Yr 5+"]],
    note:"More a large shrub than a tree, and hardy as they come. Plant two different kinds for good pollination, and watch for squirrels racing you to the ripe nuts." },
  { id:"nectarine", name:"Nectarine", latin:"Prunus persica nucipersica", type:"Tree", color:"#E27E5A", perennial:true, clim:{chill:true},
    sun:"Full sun", water:2, soil:"Loam, well-drained", ph:[6.0,7.0], temp:[16,28],
    germ:"from a young tree", years:"2–4", sow:[10,11,0,1,2], harvest:[6,7],
    arc:[["Plant","Yr 0"],["Establish","Yr 1"],["First fruit","Yr 2–4"],["Full crop","Yr 4+"]],
    note:"A smooth-skinned peach with all the same needs — winter chill, a warm summer to ripen, and a sheltered spot. Just as prone to leaf curl, so keep it dry-headed in spring." },
  { id:"persimmon", name:"Persimmon", latin:"Diospyros kaki", type:"Tree", color:"#E0762E", perennial:true, clim:{warmth:2},
    sun:"Full sun", water:2, soil:"Loam, well-drained", ph:[6.0,7.0], temp:[15,30],
    germ:"from a young tree", years:"3–5", sow:[2,3,4], harvest:[10,11],
    arc:[["Plant","Yr 0"],["Establish","Yr 1–2"],["First fruit","Yr 3–5"],["Full crop","Yr 5+"]],
    note:"A handsome tree that hangs on to its glowing orange fruit long after the leaves drop. It likes warm summers and mild winters; many kinds must go soft-ripe before they lose their mouth-puckering bite." },
];

/* companion planting: traditional pairings, written once, shown on both crops' pages */
const COMPANION_GOOD = [
  ["tomato","basil"],["tomato","chives"],["tomato","carrot"],["tomato","parsley"],["tomato","garlic"],["tomato","borage"],["tomato","asparagus"],["tomato","celery"],
  ["physalis","basil"],["chilli","basil"],["pepper","basil"],["pepper","onion"],["pepper","oregano"],["okra","pepper"],
  ["eggplant","basil"],["eggplant","beans"],
  ["carrot","onion"],["carrot","leek"],["carrot","chives"],["carrot","springonion"],["carrot","rosemary"],["carrot","sage"],["carrot","pea"],["carrot","lettuce"],
  ["beans","sweetcorn"],["beans","cucumber"],["beans","potato"],["beans","savory"],["beans","celery"],["broadbeans","savory"],["broadbeans","spinach"],
  ["sweetcorn","pumpkin"],["sweetcorn","butternut"],["sweetcorn","cucumber"],["sweetcorn","melon"],["sweetcorn","zucchini"],
  ["cucumber","dill"],["cucumber","lettuce"],["cucumber","radish"],["cucumber","pea"],
  ["pumpkin","borage"],["zucchini","borage"],["melon","borage"],
  ["lettuce","radish"],["lettuce","chives"],["lettuce","strawberry"],["lettuce","spinach"],["lettuce","rocket"],
  ["spinach","strawberry"],["spinach","pea"],
  ["onion","beetroot"],["onion","lettuce"],["onion","chamomile"],["onion","cabbage"],
  ["garlic","beetroot"],["garlic","lettuce"],["garlic","raspberry"],
  ["cabbage","dill"],["cabbage","celery"],["cabbage","chamomile"],["cabbage","mint"],["cabbage","rosemary"],["cabbage","thyme"],["cabbage","sage"],["cabbage","potato"],
  ["broccoli","beetroot"],["broccoli","dill"],["cauliflower","celery"],["brussels","celery"],["kale","beetroot"],
  ["beetroot","kohlrabi"],
  ["pea","turnip"],["pea","radish"],
  ["strawberry","borage"],["strawberry","thyme"],["strawberry","chives"],
  ["asparagus","parsley"],["asparagus","basil"],
  ["leek","celery"],["rosemary","sage"],["chives","apple"],["dill","lettuce"],
];
const COMPANION_BAD = [
  ["onion","beans"],["onion","pea"],["onion","broadbeans"],
  ["garlic","beans"],["garlic","pea"],["garlic","broadbeans"],
  ["leek","beans"],["leek","pea"],["leek","broadbeans"],
  ["tomato","potato"],["tomato","sweetcorn"],["tomato","cabbage"],["tomato","kohlrabi"],["tomato","fennel"],["tomato","dill"],
  ["fennel","beans"],["fennel","pepper"],["fennel","eggplant"],["fennel","cilantro"],["fennel","dill"],
  ["potato","cucumber"],["potato","pumpkin"],["potato","raspberry"],
  ["carrot","dill"],["carrot","parsnip"],
  ["cabbage","strawberry"],["sage","cucumber"],["rosemary","mint"],
  ["raspberry","blackberry"],
  ["walnut","tomato"],["walnut","potato"],["walnut","apple"],["walnut","blueberry"],
];
function companionsFor(id){
  const pick=(pairs)=>{
    const s=[];
    for(const [a,b] of pairs){ if(a===id) s.push(b); else if(b===id) s.push(a); }
    return [...new Set(s)].map(x=>CROPS.find(c=>c.id===x)).filter(Boolean).sort((a,b)=>a.name.localeCompare(b.name));
  };
  return { good: pick(COMPANION_GOOD), bad: pick(COMPANION_BAD) };
}

/* succession crops: re-sow a short row every N days for a steady supply */
const SUCCESSION = {
  radish:10, rocket:14, lettuce:14, spinach:14, cilantro:14, pakchoi:14,
  dill:21, springonion:21, turnip:21, beetroot:21, carrot:21, pea:21,
  beans:21, kohlrabi:21, sweetcorn:21, fennel:21,
};
function succLabel(d){ return d%7===0 ? "~"+(d/7)+" weeks" : "~"+d+" days"; }

/* common pests & problems: each written once, mapped to the crops it afflicts */
const PROBLEMS = {
  slugs:{ name:"Slugs & snails", signs:"Ragged holes in leaves, silvery slime trails, and seedlings that vanish overnight.",
    fix:"Patrol with a torch on damp evenings, set beer traps, and use copper tape or wool pellets around precious plants. Encourage frogs and birds, and keep loose mulch away from young seedlings." },
  aphids:{ name:"Aphids (greenfly & blackfly)", signs:"Clusters of tiny green or black insects on shoot tips and leaf undersides; sticky honeydew; curled, distorted growth.",
    fix:"Squash colonies by hand or blast off with water. Ladybirds and hoverflies clear them naturally, so avoid spraying. On broad beans, pinch out infested tips once pods set." },
  cabbagewhite:{ name:"Cabbage white caterpillars", signs:"Holes eaten through brassica leaves, green or stripy caterpillars, and clusters of yellow eggs underneath.",
    fix:"Net with fine mesh before the butterflies arrive in late spring — it's far easier than fighting them after. Check leaf undersides weekly and rub off any eggs you find." },
  cabbagerootfly:{ name:"Cabbage root fly", signs:"Young brassicas wilt and collapse; white maggots on the roots when you pull a casualty.",
    fix:"Fit a collar (cardboard or felt disc) snugly around each stem at planting so the fly can't lay at the base, or grow under fine mesh from day one." },
  fleabeetle:{ name:"Flea beetle", signs:"Leaves peppered with dozens of tiny round holes; small shiny beetles that spring away when disturbed.",
    fix:"Keep seedlings growing fast with steady water — established plants shrug it off. Mesh covers protect young sowings, and late-summer sowings often escape the worst." },
  carrotfly:{ name:"Carrot fly", signs:"Rusty-brown tunnels riddling the roots; foliage that reddens and wilts.",
    fix:"The fly hunts by scent, so sow thinly to avoid thinning, and surround the row with a fine mesh barrier at least 60 cm tall — it flies low. Alliums nearby help mask the smell." },
  blight:{ name:"Blight", signs:"Brown patches on leaves and stems spreading fast in warm, wet spells; fruit and tubers turn rotten.",
    fix:"Act quickly: remove infected leaves, water at the base not over the foliage, and give plants airflow. Earth up potatoes well. Bin — don't compost — anything infected." },
  powderymildew:{ name:"Powdery mildew", signs:"A white, dusty coating spreading over leaves, usually in late summer or after dry spells.",
    fix:"Drought stress invites it, so water steadily at the roots and mulch. Remove the worst leaves, space plants for airflow, and accept some on mature squash — it rarely kills." },
  blossomendrot:{ name:"Blossom end rot", signs:"A dark, sunken, leathery patch at the base of the fruit.",
    fix:"Not a disease — it's a calcium hiccup caused by erratic watering. Water little and often rather than drowning after drought, and mulch to keep moisture even. New fruit will be fine." },
  splittingfruit:{ name:"Splitting", signs:"Fruit or roots crack open, usually right after heavy rain follows a dry spell.",
    fix:"Even moisture is the cure: mulch well, water consistently in dry weather, and pick promptly when rain is forecast after drought." },
  bolting:{ name:"Bolting", signs:"The plant suddenly throws up a flower stalk and turns bitter or tough, long before you've had your fill.",
    fix:"Heat, drought and long days trigger it. Sow at the cooler ends of the season, keep plants watered, pick often, and choose bolt-resistant varieties for summer sowings." },
  dampingoff:{ name:"Damping off", signs:"Indoor-sown seedlings keel over at the soil line and wither, often in patches.",
    fix:"A fungal problem of stale, soggy conditions: use clean pots and fresh compost, sow thinly, water from below sparingly, and give seedlings air and light." },
  birds:{ name:"Birds & squirrels", signs:"Pigeons strip brassica and pea leaves to skeletons; berries, cobs and nuts vanish as they ripen.",
    fix:"Netting is the only real answer — taut and well-anchored so nothing gets tangled. Net brassicas from planting, fruit as it colours, and pick promptly once ripe." },
  mice:{ name:"Mice", signs:"Freshly sown peas, beans or corn dug up and eaten before they ever sprout.",
    fix:"Start seeds in pots or lengths of guttering somewhere safe, then plant out as sturdy seedlings the mice ignore." },
  vineweevil:{ name:"Vine weevil", signs:"Neat notches bitten from leaf edges; pot-grown plants suddenly collapse as white C-shaped grubs eat the roots.",
    fix:"Tip out suspect pots and check the compost for grubs. Biological nematodes, watered on in late summer, control them well in containers." },
  codlingmoth:{ name:"Codling moth", signs:"Maggoty fruit with a tell-tale tunnel and crumbly droppings near the core.",
    fix:"Hang pheromone traps from late spring to catch the males, pick up windfalls promptly, and accept that a few maggoty fruit are part of growing apples." },
  sawfly:{ name:"Gooseberry sawfly", signs:"Leaves stripped to skeletons with startling speed, starting low in the bush's centre; small green caterpillar-like larvae.",
    fix:"Inspect the bush's heart weekly from mid-spring — catch the first brood and you stop the plague. Pick larvae off by hand; birds will help if the bush is open." },
  rust:{ name:"Rust", signs:"Bright orange pustules dotting the leaves, usually from midsummer.",
    fix:"Mostly cosmetic on leeks and chives — remove the worst leaves, space for airflow, and go easy on nitrogen feed. On pear, the culprit overwinters on junipers nearby." },
  whitefly:{ name:"Whitefly", signs:"Clouds of tiny white insects rise from the undersides of leaves when brushed.",
    fix:"On outdoor brassicas it's mostly cosmetic — hose colonies off and carry on. Under cover, hang sticky traps and let parasitic wasps or cooler airflow do the rest." },
  spidermite:{ name:"Red spider mite", signs:"Fine webbing and pale, mottled, bronzed leaves in hot dry spells, especially under cover.",
    fix:"They hate humidity: mist plants, damp down paths, and keep compost moist. Indoors, biological controls work well; badly hit leaves won't recover, so remove them." },
  peachleafcurl:{ name:"Peach leaf curl", signs:"Spring leaves emerge red, blistered and puckered, then fall.",
    fix:"The fungus needs winter rain on the buds — a rain cover from midwinter to spring works wonders on wall-trained trees. Clear fallen leaves, feed well, and the second flush usually grows clean." },
  clubroot:{ name:"Clubroot", signs:"Brassicas wilt on sunny days and stay stunted; roots are swollen and distorted when lifted.",
    fix:"No cure once it's in the soil, so prevention matters: improve drainage, lime to raise pH, rotate brassicas on a long cycle, and choose resistant varieties." },
  asparagusbeetle:{ name:"Asparagus beetle", signs:"Chequered orange-and-black beetles and grey larvae grazing the spears and ferns.",
    fix:"Pick adults and larvae off by hand through the season, and cut down and clear the old ferns each autumn so they have nowhere to overwinter." },
  brownrot:{ name:"Brown rot", signs:"Fruit rots on the tree in soft brown patches ringed with buff-coloured pustules; some shrivel and hang on as 'mummies'.",
    fix:"Hygiene is everything: remove rotting and mummified fruit promptly, prune for open airflow, and handle fruit gently — the fungus enters through wounds." },
  forkedroots:{ name:"Forked roots", signs:"Roots split into stubby fingers instead of one straight taper.",
    fix:"Caused by stones, compaction or fresh manure. Sow direct into deep, raked, stone-free soil that was manured for a previous crop, and don't transplant." },
  greenpotato:{ name:"Green tubers", signs:"Potatoes near the surface turn green where light reaches them.",
    fix:"Green parts are mildly toxic — cut them away or discard badly affected tubers. Earth up plants well as they grow, and store the harvest somewhere properly dark." },
  scale:{ name:"Scale insects", signs:"Small brown limpet-like bumps fixed along stems and leaf undersides; sticky honeydew and sooty mould below.",
    fix:"Wipe colonies off with a damp cloth or soft toothbrush — repeat every week or two until clear. Check new growth in spring, when the mobile young are easiest to stop." },
};
const CROP_PROBLEMS = {
  tomato:["blight","aphids","blossomendrot","splittingfruit","dampingoff","whitefly"],
  potato:["blight","greenpotato"],
  pepper:["aphids","blossomendrot","dampingoff"], chilli:["aphids","blossomendrot","dampingoff"],
  eggplant:["aphids","spidermite","dampingoff"], physalis:["aphids","dampingoff"], okra:["aphids","spidermite"],
  lettuce:["slugs","bolting","aphids","dampingoff"], rocket:["fleabeetle","bolting"], spinach:["slugs","bolting"],
  chard:["slugs"], sorrel:["slugs","bolting"], celery:["slugs","bolting"], basil:["slugs","dampingoff"],
  cilantro:["bolting"], dill:["bolting"], fennel:["bolting"],
  cabbage:["cabbagewhite","cabbagerootfly","clubroot","slugs","birds","whitefly","splittingfruit"],
  cauliflower:["cabbagewhite","cabbagerootfly","clubroot","slugs","birds","whitefly"],
  broccoli:["cabbagewhite","cabbagerootfly","clubroot","slugs","birds","whitefly"],
  kale:["cabbagewhite","cabbagerootfly","clubroot","slugs","birds","whitefly","fleabeetle"],
  brussels:["cabbagewhite","cabbagerootfly","clubroot","slugs","birds","whitefly"],
  kohlrabi:["cabbagewhite","cabbagerootfly","clubroot","slugs","bolting"],
  pakchoi:["fleabeetle","cabbagerootfly","clubroot","slugs","bolting"],
  turnip:["fleabeetle","cabbagewhite","cabbagerootfly","clubroot","bolting"],
  radish:["fleabeetle","cabbagerootfly","clubroot","splittingfruit","bolting"],
  carrot:["carrotfly","forkedroots","splittingfruit"], parsnip:["carrotfly","forkedroots"], parsley:["carrotfly"],
  beetroot:["bolting","slugs"], onion:["rust","bolting"], garlic:["rust"], leek:["rust"], springonion:["rust"], chives:["rust"], mint:["rust"],
  pea:["mice","birds","powderymildew","slugs","aphids"], beans:["slugs","aphids","mice","spidermite"],
  broadbeans:["aphids","mice","slugs"], sweetcorn:["mice","birds","slugs"],
  cucumber:["powderymildew","spidermite","slugs"], zucchini:["powderymildew","slugs","blossomendrot"],
  pumpkin:["powderymildew","slugs"], butternut:["powderymildew","slugs"],
  melon:["powderymildew","spidermite"], watermelon:["powderymildew","spidermite","blossomendrot"],
  strawberry:["slugs","birds","vineweevil"], blueberry:["birds","vineweevil"],
  raspberry:["birds","aphids"], blackberry:["birds"], goji:["birds"],
  redcurrant:["sawfly","birds","aphids"], blackcurrant:["birds","aphids"], gooseberry:["sawfly","powderymildew","birds","aphids"],
  grape:["powderymildew","birds"], asparagus:["asparagusbeetle","slugs"], artichoke:["aphids","slugs"],
  apple:["codlingmoth","aphids","brownrot","powderymildew"], pear:["codlingmoth","rust","brownrot"], quince:["codlingmoth","brownrot"],
  cherry:["birds","aphids","brownrot","splittingfruit"], plum:["aphids","brownrot"],
  peach:["peachleafcurl","brownrot"], nectarine:["peachleafcurl","brownrot"], apricot:["peachleafcurl","brownrot"],
  hazelnut:["birds"], walnut:["birds"], fig:["birds"],
  lemon:["scale"], orange:["scale"], lime:["scale"], bay:["scale"], olive:["scale"],
};

/* sowing depth & spacing (cm): d=depth, s=plant spacing, r=row spacing, n=technique note */
const TREE_NOTE = "When planting into the ground, set it at the depth it grew before — match the old soil level from its pot, or the dark soil mark on a bare-root stem. Keep the knobbly graft joint on the trunk above the soil, never buried.";
const SOWING = {
  tomato:{ d:0.5, s:50, r:75 }, pepper:{ d:0.5, s:45, r:60 }, chilli:{ d:0.5, s:45, r:60 },
  eggplant:{ d:0.5, s:50, r:70 }, physalis:{ d:0.5, s:60, r:75 }, okra:{ d:1.5, s:40, r:60 },
  cucumber:{ d:2, s:45, r:90 }, zucchini:{ d:3, s:90, r:100 }, pumpkin:{ d:3, s:120, r:150 },
  butternut:{ d:3, s:90, r:120 }, melon:{ d:2, s:60, r:120 }, watermelon:{ d:2.5, s:90, r:150 },
  carrot:{ d:1, s:5, r:30 }, parsnip:{ d:1.5, s:10, r:30 }, beetroot:{ d:2, s:10, r:30 },
  radish:{ d:1, s:3, r:15 }, turnip:{ d:1.5, s:12, r:30 }, kohlrabi:{ d:1.5, s:20, r:30 },
  potato:{ d:10, s:30, r:60 }, sweetpotato:{ s:30, r:75, n:"Plant rooted slips — not seed — buried up to their first leaves." },
  onion:{ d:1, s:10, r:30 }, springonion:{ d:1, s:2, r:15 }, garlic:{ d:5, s:15, r:30 },
  leek:{ d:1, s:15, r:30, n:"Sow shallow, then drop pencil-thick transplants into 15 cm holes — don't backfill, just water in — for long white stems." },
  lettuce:{ d:0.5, s:25, r:30 }, spinach:{ d:1.5, s:10, r:30 }, chard:{ d:2, s:25, r:40 },
  rocket:{ d:0.5, s:10, r:20 }, pakchoi:{ d:1, s:20, r:30 }, sorrel:{ d:1, s:30, r:35 },
  celery:{ d:0, s:25, r:30 }, fennel:{ d:1, s:25, r:40 },
  cabbage:{ d:1.5, s:45, r:60 }, cauliflower:{ d:1.5, s:60, r:60 }, broccoli:{ d:1.5, s:45, r:60 },
  kale:{ d:1.5, s:45, r:60 }, brussels:{ d:1.5, s:60, r:75 },
  pea:{ d:4, s:7, r:60 }, beans:{ d:4, s:15, r:45 }, broadbeans:{ d:5, s:20, r:45 },
  sweetcorn:{ d:3, s:35, r:60, n:"Sow in a block of short rows, not one long line — corn is wind-pollinated and blocks fill the cobs." },
  asparagus:{ d:15, s:35, r:120, n:"Set crowns in a trench, spread the roots over a ridge, and fill in gradually as shoots appear." },
  artichoke:{ s:90, r:120, n:"Plant offsets level with the soil — the crown should sit at the surface, not below it." },
  basil:{ d:0.5, s:20, r:25 }, parsley:{ d:1, s:15, r:25 }, cilantro:{ d:1, s:5, r:20 },
  dill:{ d:1, s:15, r:25 }, chives:{ d:0.5, s:15, r:25 }, borage:{ d:1.5, s:30, r:40 },
  savory:{ d:0.5, s:15, r:25 }, thyme:{ d:0.5, s:25, r:30 }, oregano:{ d:0.5, s:30, r:30 },
  marjoram:{ d:0.5, s:25, r:25 }, sage:{ d:1, s:45, r:50 }, chamomile:{ d:0, s:20, r:25 },
  lovage:{ d:1, s:60 },
  mint:{ s:30, n:"Best from a young plant, confined to a pot sunk in the ground — loose, its runners take the bed." },
  rosemary:{ s:60, n:"Start from a young plant at the same depth as its pot — seed is painfully slow." },
  tarragon:{ s:45, n:"French tarragon doesn't come true from seed — always start from a plant or division." },
  lavender:{ s:45, n:"Easiest from a young plant, set at the same depth as its pot in sharply drained soil." },
  lemongrass:{ s:30, n:"Plant a rooted stalk or division with the base just below the surface." },
  lemonbalm:{ s:40, n:"Plant at the same depth as its pot — it bulks up fast." },
  lemonverbena:{ s:60, n:"Plant pot-depth in a warm corner; in cold areas keep it in the pot to move under cover." },
  bay:{ s:150, n:"Plant at pot depth, or keep it in a large pot and clip to shape." },
  strawberry:{ s:35, r:75, n:"Set the crown exactly at soil level — buried it rots, exposed it dries." },
  blueberry:{ s:120, n:"Pot depth, in ericaceous (acid) soil or a large pot of it." },
  raspberry:{ s:45, r:180, n:"Set canes about 7 cm deep and cut back to 25 cm after planting." },
  blackberry:{ s:250, n:TREE_NOTE },
  blackcurrant:{ s:150, n:"Plant 5 cm deeper than it grew in the pot — burying the base encourages strong new shoots." },
  redcurrant:{ s:150, n:TREE_NOTE }, gooseberry:{ s:120, n:TREE_NOTE },
  rhubarb:{ s:90, n:"Plant crowns with the buds just proud of the surface — never buried." },
  grape:{ s:150, n:TREE_NOTE }, kiwi:{ s:300, n:TREE_NOTE }, passionfruit:{ s:250, n:TREE_NOTE },
  goji:{ s:150, n:TREE_NOTE },
  pineapple:{ s:50, n:"Nestle the base of a leafy crown 2–3 cm into free-draining mix and keep it warm." },
  apple:{ s:350, n:TREE_NOTE+" Final spacing depends on the roots it's grafted onto — dwarf trees sit far closer." },
  pear:{ s:400, n:TREE_NOTE }, quince:{ s:400, n:TREE_NOTE }, cherry:{ s:500, n:TREE_NOTE },
  plum:{ s:400, n:TREE_NOTE }, peach:{ s:400, n:TREE_NOTE }, nectarine:{ s:400, n:TREE_NOTE },
  apricot:{ s:400, n:TREE_NOTE }, almond:{ s:500, n:TREE_NOTE }, fig:{ s:300, n:TREE_NOTE },
  olive:{ s:500, n:TREE_NOTE }, pomegranate:{ s:300, n:TREE_NOTE }, persimmon:{ s:500, n:TREE_NOTE },
  walnut:{ s:1000, n:TREE_NOTE }, hazelnut:{ s:300, n:TREE_NOTE },
  lemon:{ s:400, n:TREE_NOTE }, orange:{ s:400, n:TREE_NOTE }, lime:{ s:400, n:TREE_NOTE },
  avocado:{ s:700, n:TREE_NOTE }, mango:{ s:800, n:TREE_NOTE },
  banana:{ s:300, n:"Plant the corm or sucker at the depth it grew — it's a giant herb, not a tree." },
};

/* crops that genuinely thrive in containers, with a one-line pot tip */
const POT_FRIENDLY = {
  mint:"Perfect potted — it stops the runners taking over. Any 25 cm pot, kept moist.",
  basil:"A 15–20 cm pot on a warm sill; water in the morning and pick often.",
  parsley:"A 20 cm pot, deeper than you'd think — it has a taproot.",
  cilantro:"A 15 cm pot, sown little and often; it bolts fast in heat.",
  chives:"Any 15 cm pot; split the clump every couple of years.",
  dill:"A deep 25 cm pot; sow direct, it sulks if transplanted.",
  thyme:"A shallow terracotta pan and gritty mix — it likes life dry.",
  oregano:"A 20 cm pot in full sun; trim to keep it bushy.",
  marjoram:"A 20 cm pot in your sunniest spot; bring under cover in cold winters.",
  sage:"A 25 cm pot with sharp drainage; replace woody plants every few years.",
  rosemary:"Loves a terracotta pot and sharp drainage; go easy on winter water.",
  lavender:"A terracotta pot and gritty mix; full sun, dry feet.",
  tarragon:"A 25 cm pot lets you move French tarragon out of winter wet.",
  savory:"A 15 cm pot in full sun does fine.",
  chamomile:"A wide shallow pot; let it spill over the edge.",
  sorrel:"A 25 cm pot in light shade keeps the leaves tender.",
  lemonbalm:"Pot it like mint — vigorous roots, happiest contained.",
  lemongrass:"A pot means you can winter it indoors — it hates cold.",
  lemonverbena:"Grow it in a pot you can move under cover before frost.",
  bay:"Classic in a pot — clip to shape and shelter from hard frost.",
  lettuce:"A shallow trough; sow a pinch every few weeks and keep moist.",
  rocket:"A window box is plenty; quick, shallow-rooted, cut-and-come-again.",
  spinach:"A 20 cm-deep trough in light shade; keep it moist or it bolts.",
  pakchoi:"A 20 cm pot each, or a trough; even moisture is everything.",
  radish:"Any 15 cm-deep container; ready in a month.",
  springonion:"A trough sown thickly; pull as needed.",
  chard:"A 30 cm pot per plant; pick the outer leaves and it keeps giving.",
  kale:"A 30 cm pot grows a compact plant; pick from the bottom up.",
  kohlrabi:"A 25 cm pot; keep evenly moist for tender globes.",
  beetroot:"A 30 cm-deep pot; thin early and water evenly.",
  carrot:"A deep pot (30 cm+) and short, round varieties beat carrot fly too.",
  garlic:"A 20 cm-deep pot, cloves 10 cm apart, full sun.",
  potato:"Brilliant in a 40-litre bag — keep earthing up and never let it dry.",
  sweetpotato:"A 40-litre bag in your hottest spot; plant slips deep.",
  tomato:"A 40 cm pot or growbag per plant; daily summer water, weekly feed once fruiting.",
  pepper:"Thrives in a 30 cm pot in your warmest corner; feed once flowering.",
  chilli:"Pots suit it perfectly — warm roots mean hotter fruit. 30 cm is plenty.",
  eggplant:"A 30 cm pot against a sunny wall; stake and feed well.",
  okra:"A 30 cm pot somewhere truly hot; it sulks below 20°C.",
  physalis:"Treat it like a pot tomato — 35 cm pot, sunny corner.",
  cucumber:"One plant in a 35 cm pot with a cane wigwam; water generously.",
  zucchini:"One plant in a 45 cm pot — thirsty and hungry, but very doable.",
  beans:"Dwarf French varieties in a deep trough with twiggy support.",
  pea:"Dwarf varieties in a 30 cm-deep trough; keep picking.",
  strawberry:"Made for pots and baskets — just never let it dry while flowering.",
  blueberry:"Often best in a pot: fill it with acid (ericaceous) compost and use rainwater.",
  raspberry:"Compact patio varieties manage well in a 40 cm pot of rich compost.",
  fig:"Fruits better with cramped roots — a 45 cm pot is ideal.",
  pineapple:"A houseplant-sized pot in your warmest, brightest window.",
  lemon:"The classic pot citrus — wheel it under cover before frost; feed spring to autumn.",
  orange:"Happy in a large pot moved under cover for winter; feed through the growing season.",
  lime:"The most cold-shy citrus — a pot you can bring indoors is the safest home.",
  olive:"Handsome in a big terracotta pot; sharp drainage and light winter protection.",
  pomegranate:"Takes to a large pot well — full sun and a dryish winter rest.",
  apple:"On a dwarf rootstock it's happy for years in a 45–50 cm pot.",
  peach:"Choose a patio variety — a pot also makes the rain cover for leaf curl easy.",
  nectarine:"Patio varieties suit a large pot; cover from winter rain to dodge leaf curl.",
  apricot:"Patio varieties suit a big pot in a sheltered sun-trap.",
};

/* what you actually put in the ground, and whether seed goes direct or starts indoors */
const START_OVERRIDE = {
  garlic:"Single cloves, pointy end up", potato:"Seed potatoes (small tubers)",
  onion:"Seed, or small starter bulbs (\u2018sets\u2019)", sweetpotato:"Rooted slips",
  springonion:"Seed \u2014 a pinch sown direct", pineapple:"A leafy fruit top (crown)",
  lemongrass:"A rooted stalk or division",
  basil:{ l:"Seed, or a living supermarket pot", k:"shop" },
  parsley:{ l:"Seed, or a living herb pot", k:"shop" },
  cilantro:{ l:"Seed (best), or a living herb pot", k:"shop" },
  chives:{ l:"Seed, or a living herb pot", k:"shop" },
  mint:{ l:"A young plant \u2014 a shop herb pot works", k:"shop" },
  thyme:{ l:"Seed, or a young plant", k:"plant" },
  oregano:{ l:"Seed, or a young plant", k:"plant" },
  sage:{ l:"Seed, or a young plant", k:"plant" },
  marjoram:{ l:"Seed, or a young plant", k:"plant" },
};
const INDOOR_START = { tomato:1, pepper:1, chilli:1, eggplant:1, physalis:1, okra:1, celery:1 };
const EITHER_START = { cucumber:1, zucchini:1, pumpkin:1, butternut:1, melon:1, watermelon:1, sweetcorn:1, basil:1, lettuce:1, leek:1 };
function startFor(crop){
  const o = START_OVERRIDE[crop.id];
  if(o) return typeof o==="string" ? { label:o, kind:"other" } : { label:o.l, kind:o.k };
  const g = String(crop.germ||"");
  if(/^\d/.test(g)){
    if(INDOOR_START[crop.id]) return { label:"Seed \u2014 start indoors in warmth", kind:"indoor" };
    if(EITHER_START[crop.id]) return { label:"Seed \u2014 in pots, or direct once warm", kind:"either" };
    return { label:"Seed \u2014 sown direct where it grows", kind:"direct" };
  }
  const t = g.replace(/^from\s+/,"");
  return { label: t.charAt(0).toUpperCase()+t.slice(1), kind: /plant/i.test(t) ? "plant" : "other" };
}

/* how to pick it so it keeps producing */
const PICKING = {
  basil:"Cut the stem just above a pair of leaves — two new shoots sprout from the joint. Never strip single leaves off a stem; you'll be left with a bald stick.",
  mint:"Cut whole stems low and often — it regrows fast and stays leafy instead of leggy.",
  oregano:"Snip stems just above a leaf joint; a hard trim as flowers appear brings a fresh flush.",
  marjoram:"Cut sprigs above a leaf pair; keep picking and it keeps branching.",
  lemonbalm:"Cut stems back hard — new growth is the tender, fragrant part.",
  thyme:"Snip soft green tips with scissors, but never cut back into bare brown wood — it won't regrow.",
  rosemary:"Take soft tip sprigs through the season; stay out of the old bare wood.",
  sage:"Pick leaves or soft tips freely in summer; go gently in autumn so it toughens up for winter.",
  tarragon:"Pinch the top few centimetres of each stem — the tips have the finest flavour.",
  savory:"Cut sprigs as the first flowers show — that's peak flavour.",
  lavender:"Cut stems just as the first florets open, with a good length of stalk.",
  lemonverbena:"Pick tips and leaves through summer; a mid-season trim keeps it bushy.",
  lemongrass:"Cut or twist whole stalks off at the base once they're finger-thick.",
  bay:"Pick single mature leaves any time of year — older leaves have more flavour than new ones.",
  chamomile:"Pick the flowers when fully open, pinched off just behind the head.",
  parsley:"Cut whole outer stems right at the base — new growth comes from the centre, so leave that alone.",
  cilantro:"Take whole outer stems at the base, or cut the whole plant 3 cm up and let it regrow once.",
  chives:"Shear the clump like a haircut, 3 cm above the soil — it regrows in a fortnight.",
  dill:"Take feathery fronds from the outside; leave the centre to keep producing.",
  lovage:"Cut outer stems at the base — and remember a little goes a long way.",
  sorrel:"Pick outer leaves at the base while young; snap off any flower stalks on sight.",
  borage:"Pick young leaves and open flowers — both are edible; older leaves get bristly.",
  lettuce:"Either cut the whole head, or take outer leaves and let the heart keep growing.",
  rocket:"Pick outer leaves, or shear the lot 3 cm above the crown for a second flush.",
  spinach:"Pick outer leaves little and often; the centre keeps making more.",
  chard:"Cut or twist outer stems off at the base; the plant crops for months.",
  kale:"Work up the stem taking the lower leaves; never cut the crown at the top.",
  pakchoi:"Cut the whole head at the base, or take outer leaves as you need them.",
  celery:"Snap or cut outer stems at the base and let the heart keep growing.",
  springonion:"Pull the whole plant, roots and all, once it's pencil-thick.",
  fennel:"Cut the bulb at soil level; the feathery tops are good any time.",
  asparagus:"Cut or snap spears at soil level when 15–18 cm tall — check every day or two in season.",
  rhubarb:"Pull and twist stalks off at the base — never cut — and always leave the plant half its stalks.",
  artichoke:"Cut each bud with 5 cm of stem while the scales are still tight and closed.",
  broccoli:"Cut the central head first — smaller side shoots follow for weeks afterwards.",
  brussels:"Snap sprouts off from the bottom of the stem upwards as they firm.",
  cabbage:"Cut the head at the base once it feels solid when pressed.",
  zucchini:"Cut — don't twist — at 15–20 cm, and check daily; they turn into marrows overnight.",
  cucumber:"Cut the stalk with a knife; pulling damages the vine.",
  beans:"Pick young and pick often — use two hands so you don't snap the stem — and the plant keeps producing.",
  pea:"Hold the vine with one hand and pick with the other; pods left on stop new ones forming.",
  okra:"Cut pods at 8–10 cm — daily in hot weather — before they turn woody.",
  tomato:"Snap the stalk at the little knuckle just above the fruit, or cut whole trusses.",
  pepper:"Cut with snips, leaving a short stem on the fruit — pulling tears the branch.",
  chilli:"Cut with a stub of stem; picking green prompts more fruit, leaving them ripens the heat.",
  eggplant:"Cut the tough stalk with secateurs while the skin is still glossy — dull means overripe.",
  sweetcorn:"When the silks turn brown, twist the cob down and off; a pierced kernel should bleed milky.",
  strawberry:"Pinch through the stalk so the green cap stays on the berry — it keeps far better.",
  raspberry:"A ripe berry slides off its core with the gentlest pull, leaving the core behind.",
  blackberry:"Ripe when it pulls away easily, core and all, and has gone fully black-dull.",
};

const MS = ["J","F","M","A","M","J","J","A","S","O","N","D"];
const MFULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const STAGE_INFO = {
  "Sow":"Seeds go into the soil or trays. Keep them warm and moist until they sprout.",
  "Plant":"A young plant, set, or tree goes into its final spot in the ground.",
  "Sprout":"The seed germinates and the first tiny shoots push through the soil.",
  "Seedling":"A small young plant with its first true leaves, finding its feet.",
  "Grow":"Leafy growth — the plant builds size and strength before it flowers or crops.",
  "Root":"The plant pours its energy into roots below ground.",
  "Leaf":"Leafy growth you can begin picking from.",
  "Climb":"The plant sends out shoots that need a support to scramble up.",
  "Vine":"Long trailing stems spread out and need room or a frame.",
  "Flower":"The plant blossoms — these flowers will set into fruit.",
  "Fruit":"Fruit forms and swells after the flowers fade.",
  "Foliage":"Leafy top growth fills out above ground.",
  "Tuber":"Tubers swell underground — the part you'll dig up to eat.",
  "Bulb":"The bulb fattens and ripens under the soil.",
  "Knee-high":"Plants are well established and shooting up fast — about knee height.",
  "Tassel":"Feathery flowers form at the top and shed pollen.",
  "Silk":"Silken threads catch the pollen so the cobs fill with kernels.",
  "Pod":"Pods form and fill — pick them while young and tender.",
  "Feather":"Soft, feathery leaves are ready to snip and use.",
  "Spread":"The plant spreads out to fill its space (and may need reining in).",
  "Bush":"The plant bushes out into a full, leafy shape.",
  "Grass":"Grassy blades grow up in a clump.",
  "Clump":"The clump thickens and is ready to harvest from.",
  "Harvest":"Ripe and ready to pick and eat.",
  "Establish":"The young tree settles in, growing roots and branches — no fruit yet.",
  "First fruit":"The tree is finally mature enough to bear its first real crop.",
  "First crop":"The plant is finally established enough for its first real harvest — take only a little this first time.",
  "Full crop":"The tree reaches full size and gives its biggest harvests every year.",
};
const NOW = new Date().getMonth();

const shift = (a,n)=>a.map(m=>(m+n+12)%12);
function sowMonths(crop, loc){
  if(!loc) return crop.sow;
  if(loc.hemi==="EQ") return [0,1,2,3,4,5,6,7,8,9,10,11];
  if(loc.hemi==="S") return shift(crop.sow,6);
  return crop.sow;
}
function harvestMonths(crop, loc){
  if(loc && loc.hemi==="EQ") return [0,1,2,3,4,5,6,7,8,9,10,11];
  if(crop.harvest) return loc && loc.hemi==="S" ? shift(crop.harvest,6) : crop.harvest;
  const base = sowMonths(crop,loc);
  const off = Math.round(crop.maturity/30);
  return base.map(m=>(m+off)%12);
}
function status(crop, loc){
  if(!loc) return { kind:"none" };
  if(loc.hemi==="EQ") return { kind:"year" };
  const sm = sowMonths(crop,loc);
  if(sm.includes(NOW)) return { kind:"now" };
  const sorted = [...sm].sort((a,b)=>a-b);
  const next = sorted.find(m=>m>NOW);
  return { kind:"wait", month: next!==undefined ? next : sorted[0] };
}
function suitability(crop, loc){
  if(!loc) return { ok:true, level:"fit" };
  // hard limits for perennials: climate survival / chill
  if(crop.clim){
    const tier = loc.tier==null ? 2 : loc.tier;
    if(crop.clim.warmth!=null && tier < crop.clim.warmth)
      return { ok:false, level:"unfit", short:"Too cool here", reason:`${crop.name} needs a warmer climate than ${loc.city} — it won't survive the cold or ripen fruit outdoors.` };
    if(crop.clim.chill && loc.chillWinter===false)
      return { ok:false, level:"unfit", short:"No winter chill", reason:`${crop.name} needs a cold winter to fruit, and ${loc.city} stays too warm year-round.` };
  }
  // soft warning for warm-season annuals: growing season may be too short to ripen outdoors
  if(!crop.perennial && crop.maturity && crop.temp && crop.temp[0] >= 17){
    const days = parseInt((String(loc.len).match(/\d+/)||["999"])[0], 10);
    if(days - crop.maturity < 50)
      return { ok:true, level:"marginal", short:"Short season", reason:`${loc.city}'s warm season is short for ${crop.name}, which needs about ${crop.maturity} days to mature. Start it indoors for a head start, or it may not ripen before the cold returns.` };
  }
  return { ok:true, level:"fit" };
}

/* --------------------------- crop glyphs -------------------------- */
function Glyph({ id, size=46 }){
  const ink="var(--ink)";
  const common = { width:size, height:size, viewBox:"0 0 48 48", fill:"none",
    stroke:ink, strokeWidth:2, strokeLinecap:"round", strokeLinejoin:"round" };
  if(id==="tomato") return (
    <svg {...common}><circle cx="24" cy="29" r="12.5" fill="#D9714F"/>
      <path d="M24 16.5 24 12" /><path d="M24 16.5c-2-3-5-3.5-7-3 1 3 3 4.5 7 4.5"/>
      <path d="M24 16.5c2-3 5-3.5 7-3-1 3-3 4.5-7 4.5"/><path d="M19 27c1-2 3-3 5-3" stroke="#FBF3E6"/></svg>);
  if(id==="carrot") return (
    <svg {...common}><path d="M24 41 16 19c5-3 11-3 16 0L24 41Z" fill="#E0973A"/>
      <path d="M21 27h6M20 33h5" stroke="#FBF3E6"/><path d="M24 18 24 9M24 12c-3-2-6-2-8-1m8 4c3-2 6-2 8-1" stroke="#4E7A4C"/></svg>);
  if(id==="strawberry") return (
    <svg {...common}><path d="M24 41c-7-2-11-8-11-14 0-3 5-5 11-5s11 2 11 5c0 6-4 12-11 14Z" fill="#D64A41"/>
      <path d="M24 22c-3-3-6-3.5-9-3 1 3.5 4 5 9 5 5 0 8-1.5 9-5-3-.5-6 0-9 3Z" fill="#4E7A4C" stroke="#4E7A4C"/>
      <circle cx="20" cy="30" r="0.9" fill="#FBF3E6" stroke="none"/><circle cx="27" cy="31" r="0.9" fill="#FBF3E6" stroke="none"/><circle cx="24" cy="35" r="0.9" fill="#FBF3E6" stroke="none"/></svg>);
  if(id==="lettuce") return (
    <svg {...common}><path d="M24 40c-9 0-14-5-14-11 3-2 6-1 8 1 1-4 4-6 6-6s5 2 6 6c2-2 5-3 8-1 0 6-5 11-14 11Z" fill="#7FA86A"/>
      <path d="M24 24v16M16 31c3 2 5 5 5 9M32 31c-3 2-5 5-5 9" stroke="var(--t-green)"/></svg>);
  if(id==="pepper") return (
    <svg {...common}><path d="M16 24c0 9 4 15 8 15s8-6 8-15c-3 1.5-5 1.5-8 1.5S19 25.5 16 24Z" fill="#D9603A"/>
      <path d="M24 25.5V14M24 14c0-2 2-3 4-3M24 14c0-2-2-3-4-3" stroke="#4E7A4C"/></svg>);
  if(id==="basil") return (
    <svg {...common}><path d="M24 41V19" stroke="#4E7A4C"/>
      <path d="M24 22c-3-4-8-4.5-11-3 .5 4 4 6.5 11 6.5Z" fill="#7FA86A"/>
      <path d="M24 22c3-4 8-4.5 11-3-.5 4-4 6.5-11 6.5Z" fill="#7FA86A"/>
      <path d="M24 31c-2.5-3-6-3.5-8.5-2.5.5 3 3 5 8.5 5Z" fill="#8FB87A"/>
      <path d="M24 31c2.5-3 6-3.5 8.5-2.5-.5 3-3 5-8.5 5Z" fill="#8FB87A"/></svg>);
  if(id==="cucumber") return (
    <svg {...common}>
      <g transform="rotate(12 24 24)">
        <rect x="18" y="9" width="12" height="31" rx="6" fill="#7FA86A"/>
        <circle cx="22" cy="16" r="0.9" fill="var(--t-green)" stroke="none"/>
        <circle cx="26" cy="22" r="0.9" fill="var(--t-green)" stroke="none"/>
        <circle cx="22" cy="28" r="0.9" fill="var(--t-green)" stroke="none"/>
        <circle cx="26" cy="34" r="0.9" fill="var(--t-green)" stroke="none"/>
      </g>
      <path d="M22 8c0-2 1-3 3-3" stroke="#4E7A4C"/></svg>);
  if(id==="eggplant") return (
    <svg {...common}>
      <path d="M24 41c-5.5 0-9.5-4.5-9.5-10.5 0-7 4-13 9.5-15.5 5.5 2.5 9.5 8.5 9.5 15.5C33.5 36.5 29.5 41 24 41Z" fill="#7A5290"/>
      <path d="M24 15V9M24 14c-2 0-4-1-5-3M24 14c2 0 4-1 5-3" stroke="#4E7A4C"/>
      <path d="M20 26c1-2 3-3 5-3" stroke="#FBF3E6"/></svg>);
  if(id==="pumpkin") return (
    <svg {...common}>
      <ellipse cx="24" cy="29" rx="14" ry="11" fill="#D9813A"/>
      <path d="M18.5 19c-2 4-2 16 0 20M29.5 19c2 4 2 16 0 20M24 18v22" stroke="#A85A1E"/>
      <path d="M24 18c0-3-1-5 1-7" stroke="#4E7A4C"/></svg>);
  if(id==="blueberry") return (
    <svg {...common}>
      <path d="M27 19c4-4 8-4 11-3-1 4-4 7-9 7" fill="#7FA86A"/>
      <path d="M23 23c0-4 2-7 5-9" stroke="#4E7A4C"/>
      <circle cx="19" cy="29" r="6" fill="#5E6FA8"/>
      <circle cx="30" cy="31" r="5.5" fill="#48578C"/>
      <circle cx="24" cy="36" r="5.5" fill="#5E6FA8"/>
      <path d="M19 26.5v2.5M17.5 27.5l1.5 1M20.5 27.5l-1.5 1" stroke="#2E3A6A" strokeWidth="1"/></svg>);
  if(id==="potato") return (
    <svg {...common}>
      <path d="M13 27c-1-7 5-12 13-11 7 1 10 5 9 12s-7 9-14 8-7-3-8-9Z" fill="#C49A66"/>
      <path d="M20 25l1.5 1.5M27 23l1.5 1.5M25 31l1.5 1.5" stroke="#7A5A30" strokeWidth="1.4"/></svg>);
  if(id==="onion") return (
    <svg {...common}>
      <path d="M24 41c-7 0-11-5-11-11 0-6 5-11 11-11s11 5 11 11c0 6-4 11-11 11Z" fill="#C9824C"/>
      <path d="M19 21c1 6 1 13 0 18M24 19v22M29 21c-1 6-1 13 0 18" stroke="#9A5A2E"/>
      <path d="M24 19c0-4-2-7-4-9M24 19c0-4 2-7 4-9M24 19v-9" stroke="#4E7A4C"/></svg>);
  if(id==="spinach") return (
    <svg {...common}>
      <path d="M24 41c-9-3-12-12-9-22 2-6 6-8 9-8s7 2 9 8c3 10 0 19-9 22Z" fill="#4E7A4C"/>
      <path d="M24 12v28M24 21c-3 1-5 3-6 6M24 21c3 1 5 3 6 6M24 31c-3 1-5 3-6 6M24 31c3 1 5 3 6 6" stroke="#2E4A2E"/></svg>);
  if(id==="pea") return (
    <svg {...common}>
      <g transform="rotate(32 24 25)">
        <rect x="14" y="20" width="20" height="10" rx="5" fill="#7FA86A"/>
        <circle cx="19" cy="25" r="2.3" fill="#4E7A4C" stroke="none"/>
        <circle cx="24" cy="25" r="2.3" fill="#4E7A4C" stroke="none"/>
        <circle cx="29" cy="25" r="2.3" fill="#4E7A4C" stroke="none"/>
      </g>
      <path d="M16 17c-3-1-5-4-4-8" stroke="#4E7A4C"/></svg>);
  if(id==="radish") return (
    <svg {...common}>
      <path d="M14 25c0-5 4-9 10-9s10 4 10 9c0 4-2 7-5 9l-5 9-5-9c-3-2-5-5-5-9Z" fill="#C24A60"/>
      <path d="M21 40l3 5 3-5" fill="#F2EAD7" stroke="none"/>
      <path d="M24 16c0-4-2-7-5-9M24 16c0-4 2-7 5-9M24 16V7" stroke="#4E7A4C"/></svg>);
  if(id==="mint") return (
    <svg {...common}>
      <path d="M24 41V13" stroke="#4E7A4C"/>
      <path d="M24 13c-2-2-2-5 0-7 2 2 2 5 0 7Z" fill="#7FA86A"/>
      <path d="M24 21c-3-3-7-3.5-10-2 .5 3.5 4 6.5 10 6.5Z" fill="#7FA86A"/>
      <path d="M24 21c3-3 7-3.5 10-2-.5 3.5-4 6.5-10 6.5Z" fill="#7FA86A"/>
      <path d="M24 31c-2.5-3-6-3.5-8.5-2 .5 3 3 5.5 8.5 5.5Z" fill="#8FB87A"/>
      <path d="M24 31c2.5-3 6-3.5 8.5-2-.5 3-3 5.5-8.5 5.5Z" fill="#8FB87A"/></svg>);
  if(id==="apple") return (
    <svg {...common}>
      <path d="M24 18c-3-3-8-3-10 0-3 4-2 12 2 17 2 3 4 4 8 4s6-1 8-4c4-5 5-13 2-17-3-3-7-3-10 0Z" fill="#C0413E"/>
      <path d="M24 18v-6" stroke="#5A4632"/>
      <path d="M24 13c2-3 6-4 9-3-1 4-5 5-9 4Z" fill="#7FA86A"/>
      <path d="M20 25c1-2 3-3 5-3" stroke="#FBF3E6"/></svg>);
  if(id==="banana") return (
    <svg {...common}>
      <path d="M16 13c-1 0-2 1-1 3 3 12 11 19 21 19 2 0 3-2 1-4-1-1-3-1-5-2-7-3-12-9-13-16 0-2-1-3-3-3Z" fill="#E6B62E"/>
      <path d="M19 14c1 9 8 16 17 18" stroke="#B98E1E"/>
      <path d="M37 35c1 1 1 2 0 3" stroke="#5A4632"/></svg>);
  if(id==="lemon") return (
    <svg {...common}>
      <g transform="rotate(-26 24 27)">
        <ellipse cx="24" cy="27" rx="13" ry="9" fill="#D9CF3A"/>
        <path d="M11 27h-2.5M37 27h2.5" stroke="#B0A81E"/>
      </g>
      <path d="M30 16c3-3 7-3 9-2-1 4-5 5-9 3Z" fill="#7FA86A"/></svg>);
  if(id==="orange") return (
    <svg {...common}>
      <circle cx="23" cy="28" r="13" fill="#E58A2A"/>
      <path d="M23 15v-4" stroke="#5A4632"/>
      <path d="M23 12c2-3 6-3 8-2-1 4-5 4-8 2Z" fill="#7FA86A"/>
      <circle cx="23" cy="15" r="1" fill="#B86A1E" stroke="none"/></svg>);
  if(id==="cherry") return (
    <svg {...common}>
      <path d="M20 17c4 4 4 9 0 16M28 15c-2 6 0 11 4 14" stroke="#5A4632"/>
      <path d="M24 15c2-3 6-3 8-1-1 3-5 4-8 1Z" fill="#7FA86A"/>
      <circle cx="18" cy="35" r="6" fill="#A8324A"/>
      <circle cx="31" cy="33" r="6" fill="#B23A52"/></svg>);
  if(id==="mango") return (
    <svg {...common}>
      <path d="M30 15c5 2 8 7 7 14-1 7-7 11-14 10-6-1-10-6-9-13 1-8 9-13 16-11Z" fill="#DD6E3A"/>
      <path d="M30 15c-1-1-1-3 1-4" stroke="#5A4632"/>
      <path d="M22 24c2-2 5-2 7-1" stroke="#F2C84A"/></svg>);
  if(id==="watermelon") return (
    <svg {...common}>
      <ellipse cx="24" cy="26" rx="14" ry="12" fill="#5AA152"/>
      <path d="M14 19c-1 5-1 10 0 15M20 16c-1 7-1 13 0 20M28 16c1 7 1 13 0 20M34 19c1 5 1 10 0 15" stroke="#2E5E33"/></svg>);
  if(id==="melon") return (
    <svg {...common}>
      <circle cx="24" cy="26" r="13" fill="#D7B06A"/>
      <path d="M13 22h22M12 28h24M16 18c-2 6-2 11 0 17M24 14v24M32 18c2 6 2 11 0 17" stroke="#A9824A" strokeWidth="1.2"/></svg>);
  if(id==="sweetcorn") return (
    <svg {...common}>
      <path d="M24 9c5 0 8 6 8 15s-3 15-8 15-8-6-8-15 3-15 8-15Z" fill="#E0B83E"/>
      <path d="M20 16v22M24 14v26M28 16v22M17 20h14M16 26h16M17 32h14" stroke="#B58E1E" strokeWidth="1"/>
      <path d="M16 33c-4 2-7 6-8 11 5-1 9-4 11-9Z" fill="#7FA86A"/></svg>);
  if(id==="sweetpotato") return (
    <svg {...common}>
      <path d="M12 30c-2-6 3-12 11-13 6-1 13 2 13 8 0 7-8 12-16 11-5-1-7-2-8-6Z" fill="#C2703C"/>
      <path d="M19 26l1.2 1.6M27 24l1.2 1.6" stroke="#8A4E26" strokeWidth="1.3"/></svg>);
  if(id==="butternut") return (
    <svg {...common}>
      <path d="M24 8c-2 0-3 2-3 5v10c0 3-3 4-4 7-2 4-1 9 1 11 2 3 10 3 12 0 2-2 3-7 1-11-1-3-4-4-4-7V13c0-3-1-5-3-5Z" fill="#D2A862"/>
      <path d="M24 8c0-2 2-3 4-2" stroke="#5A4632"/>
      <path d="M18 33c4 2 8 2 12 0" stroke="#A9824A" strokeWidth="1.1"/></svg>);
  if(id==="okra") return (
    <svg {...common}>
      <path d="M24 8c-2 4-3 10-3 16 0 8 1 14 3 16 2-2 3-8 3-16 0-6-1-12-3-16Z" fill="#5E8C3F"/>
      <path d="M24 14v26M20 20c0 8 0 13 1 17M28 20c0 8 0 13-1 17" stroke="#3C6E2E" strokeWidth="1.1"/>
      <path d="M24 9c-2-1-4-1-5 1M24 9c2-1 4-1 5 1" stroke="#4E7A4C"/></svg>);
  if(id==="parsley") return (
    <svg {...common}>
      <path d="M24 41V24" stroke="#4E7A4C"/>
      <g fill="#4A8A48"><circle cx="24" cy="13" r="5"/><circle cx="16" cy="19" r="5"/><circle cx="32" cy="19" r="5"/><circle cx="20" cy="25" r="4.5"/><circle cx="28" cy="25" r="4.5"/></g></svg>);
  if(id==="cilantro") return (
    <svg {...common}>
      <path d="M24 41V20" stroke="#4E7A4C"/>
      <g fill="#5FA050">
        <path d="M24 20c-2-4-6-6-10-6 0 5 4 8 10 8Z"/><path d="M24 20c2-4 6-6 10-6 0 5-4 8-10 8Z"/>
        <path d="M24 14c-2-3-5-4-8-4 0 4 3 6 8 6Z"/><path d="M24 14c2-3 5-4 8-4 0 4-3 6-8 6Z"/>
        <path d="M24 9c-1-2-3-3-5-3 0 3 2 4 5 4Z"/><path d="M24 9c1-2 3-3 5-3 0 3-2 4-5 4Z"/></g></svg>);
  if(id==="rosemary") return (
    <svg {...common}>
      <path d="M24 41V8" stroke="#6F8F72"/>
      <path d="M24 14l-5-3M24 14l5-3M24 20l-6-2M24 20l6-2M24 26l-6-2M24 26l6-2M24 32l-5-2M24 32l5-2" stroke="#6F8F72" strokeWidth="1.6"/></svg>);
  if(id==="thyme") return (
    <svg {...common}>
      <path d="M24 41V16" stroke="#6B8E5A"/>
      <g fill="#7FA86A" stroke="none"><circle cx="15" cy="30" r="1.7"/><circle cx="33" cy="30" r="1.7"/><circle cx="16" cy="24" r="1.6"/><circle cx="32" cy="24" r="1.6"/><circle cx="18" cy="18" r="1.5"/><circle cx="30" cy="18" r="1.5"/></g></svg>);
  if(id==="sage") return (
    <svg {...common}>
      <path d="M24 41V18" stroke="#8AA07E"/>
      <ellipse cx="17" cy="22" rx="6" ry="3" fill="#9CB090" transform="rotate(-25 17 22)"/>
      <ellipse cx="31" cy="20" rx="6" ry="3" fill="#9CB090" transform="rotate(25 31 20)"/>
      <ellipse cx="24" cy="13" rx="3.5" ry="6" fill="#9CB090"/></svg>);
  if(id==="oregano") return (
    <svg {...common}>
      <path d="M24 41V12" stroke="#5E8C4E"/>
      <g fill="#7FA86A"><circle cx="18" cy="30" r="3"/><circle cx="30" cy="30" r="3"/><circle cx="18" cy="22" r="3"/><circle cx="30" cy="22" r="3"/><circle cx="20" cy="15" r="2.6"/><circle cx="28" cy="15" r="2.6"/></g></svg>);
  if(id==="chives") return (
    <svg {...common}>
      <path d="M20 41C16 30 16 20 18 11M24 41C23 28 23 18 24 9M28 41C32 30 32 20 30 13" stroke="#5A9A5E"/>
      <circle cx="24" cy="9" r="3.5" fill="#9488BE"/></svg>);
  if(id==="dill") return (
    <svg {...common}>
      <path d="M24 41V18" stroke="#69A24A"/>
      <path d="M24 18C18 16 13 12 11 6M24 18c6-2 11-6 13-12M24 24c-5-1-9-4-11-9M24 24c5-1 9-4 11-9M24 30c-4-1-7-3-9-7M24 30c4-1 7-3 9-7" stroke="#69A24A" strokeWidth="1.3"/></svg>);
  if(id==="lavender") return (
    <svg {...common}>
      <path d="M16 41C15 30 15 22 16 16M24 41V12M32 41c1-11 1-19 0-25" stroke="#7E9A6E"/>
      <g fill="#9488BE" stroke="none"><rect x="13.5" y="9" width="5" height="9" rx="2.5"/><rect x="21.5" y="5" width="5" height="9" rx="2.5"/><rect x="29.5" y="9" width="5" height="9" rx="2.5"/></g></svg>);
  if(id==="lemongrass") return (
    <svg {...common}>
      <path d="M24 41C20 30 16 20 10 13M24 41C22 29 20 18 18 10M24 41V8M24 41c2-12 4-23 6-31M24 41c4-11 8-21 14-28" stroke="#8AAE5A"/></svg>);
  if(id==="zucchini") return (
    <svg {...common}>
      <g transform="rotate(-35 24 24)">
        <rect x="9" y="18" width="30" height="12" rx="6" fill="#6A9A3F"/>
        <path d="M14 24h20" stroke="#8FBF63" strokeWidth="1.3"/>
        <rect x="36" y="21" width="3.5" height="6" rx="1.7" fill="#4E7A4C" stroke="none"/>
      </g></svg>);
  if(id==="kale") return (
    <svg {...common}>
      <path d="M24 41V19" stroke="#2E5E33"/>
      <path d="M24 25c-3-5-9-6-13-4 1 3 3 5 6 6-3 0-5 2-6 5 5 1 10-2 13-7Z" fill="#3E7A50"/>
      <path d="M24 25c3-5 9-6 13-4-1 3-3 5-6 6 3 0 5 2 6 5-5 1-10-2-13-7Z" fill="#3E7A50"/>
      <path d="M24 33c-2-3-6-3.5-9-2 1 2.5 3 4 9 4Z" fill="#4F8C5C"/>
      <path d="M24 33c2-3 6-3.5 9-2-1 2.5-3 4-9 4Z" fill="#4F8C5C"/></svg>);
  if(id==="broccoli") return (
    <svg {...common}>
      <path d="M24 41V26" stroke="#5A8A4E" strokeWidth="3.2"/>
      <path d="M20 41V31M28 41V31" stroke="#5A8A4E" strokeWidth="2"/>
      <g fill="#3E7A50"><circle cx="18" cy="21" r="6"/><circle cx="30" cy="21" r="6"/><circle cx="24" cy="15" r="6.5"/><circle cx="24" cy="24" r="6"/></g></svg>);
  if(id==="beetroot") return (
    <svg {...common}>
      <path d="M24 39c-7 0-11-5-11-10 0-5 5-8 11-8s11 3 11 8c0 5-4 10-11 10Z" fill="#9C3B5A"/>
      <path d="M24 39c0-2 0-3 0-4" stroke="#6E2540" strokeWidth="1.4"/>
      <path d="M24 21V11M24 13c-3-3-6-3-8-2m8 2c3-3 6-3 8-2" stroke="#5FA05A"/></svg>);
  if(id==="beans") return (
    <svg {...common}>
      <path d="M24 11c-6 8-7 20-4 30" stroke="#6FA03E" strokeWidth="4"/>
      <path d="M24 11c0 9 1 21 6 30" stroke="#7FB048" strokeWidth="4"/>
      <path d="M24 11c4 8 7 19 12 27" stroke="#5E9036" strokeWidth="3.5"/></svg>);
  if(id==="garlic") return (
    <svg {...common}>
      <path d="M24 39c-7 0-11-5-11-11 0-6 4-12 11-12s11 6 11 12c0 6-4 11-11 11Z" fill="#EFE8D8" stroke="#C9B79A"/>
      <path d="M24 16V39M18 19c-1 6-1 13 0 19M30 19c1 6 1 13 0 19" stroke="#C9B79A" strokeWidth="1.2"/>
      <path d="M24 16c-1-3-2-5-4-6m4 6c1-3 2-5 4-6" stroke="#A9926E"/></svg>);
  if(id==="leek") return (
    <svg {...common}>
      <path d="M24 41V23" stroke="#EFE8D8" strokeWidth="6.5"/>
      <path d="M24 41V23" stroke="#CFBE9E" strokeWidth="1.1"/>
      <path d="M24 25c-2-9-5-14-10-17M24 25c2-9 5-14 10-17M24 25V7" stroke="#5FA05A" strokeWidth="3"/></svg>);
  if(id==="raspberry") return (
    <svg {...common}>
      <path d="M23.5 21c-2-3-5-3.5-8-3 1 3 3 4 8 4m0-1c2-3 5-3.5 8-3-1 3-3 4-8 4" fill="#7FA86A" stroke="#7FA86A"/>
      <g fill="#B0405E" stroke="none">
        <circle cx="23.5" cy="24" r="3"/><circle cx="20" cy="27" r="3.2"/><circle cx="27" cy="27" r="3.2"/>
        <circle cx="23.5" cy="30" r="3.2"/><circle cx="20.5" cy="33" r="3"/><circle cx="26.5" cy="33" r="3"/><circle cx="23.5" cy="36" r="2.8"/></g></svg>);
  if(id==="grape") return (
    <svg {...common}>
      <path d="M26 21v-5" stroke="#5A4632"/>
      <path d="M26 16c2-3 6-3 8-1-1 3-5 4-8 1Z" fill="#7FA86A"/>
      <g fill="#6E4A7E" stroke="none">
        <circle cx="18" cy="25" r="4"/><circle cx="26" cy="25" r="4"/><circle cx="22" cy="31" r="4"/><circle cx="30" cy="31" r="4"/><circle cx="26" cy="37" r="4"/></g></svg>);
  if(id==="tarragon") return (
    <svg {...common}>
      <path d="M24 41V12" stroke="#4E7A4C"/>
      <path d="M24 31c-4-1-7-3-9-6M24 27c4-1 7-3 9-6M24 23c-4-1-7-3-8-6M24 19c4-1 6-3 7-5M24 35c-3-1-5-2-7-4M24 35c3-1 5-2 7-4" stroke="#6FA06A" strokeWidth="1.6"/></svg>);
  if(id==="pear") return (
    <svg {...common}>
      <path d="M24 41c-6 0-9-4-9-9 0-4 2-6 3-9 1-2 1-4 1-6 0-3 2-5 4-5s4 2 4 5c0 2 0 4 1 6 1 3 3 5 3 9 0 5-3 9-10 9Z" fill="#9CB04E"/>
      <path d="M24 16v-5" stroke="#5A4632"/>
      <path d="M24 12c2-2 5-2 7-1-1 3-4 3-7 1Z" fill="#7FA86A"/></svg>);
  if(id==="fig") return (
    <svg {...common}>
      <path d="M24 41c-6 0-11-5-11-11 0-5 3-8 6-11 2-2 3-4 5-4s3 2 5 4c3 3 6 6 6 11 0 6-5 11-11 11Z" fill="#6E5A86"/>
      <path d="M24 15v-4" stroke="#5A4632"/>
      <path d="M24 11c2-3 6-3 8-1-1 3-5 4-8 1Z" fill="#7FA86A"/>
      <circle cx="24" cy="37.5" r="1.4" fill="#4A3A5E" stroke="none"/></svg>);
  if(id==="cabbage") return (
    <svg {...common}>
      <circle cx="24" cy="27" r="13" fill="#6F9B6A"/>
      <path d="M24 14c-6 3-9 8-9 13M24 14c6 3 9 8 9 13M16 33c3 4 5 5 8 5M32 33c-3 4-5 5-8 5M24 16v22" stroke="#3C6B45" strokeWidth="1.3"/></svg>);
  if(id==="cauliflower") return (
    <svg {...common}>
      <path d="M14 34c-2-3-2-7 1-9M34 34c2-3 2-7-1-9" stroke="#4E8C5A" strokeWidth="3"/>
      <g fill="#EFE7D2" stroke="#D6CBAE"><circle cx="18" cy="24" r="6"/><circle cx="30" cy="24" r="6"/><circle cx="24" cy="20" r="6.5"/><circle cx="24" cy="28" r="6"/></g></svg>);
  if(id==="chard") return (
    <svg {...common}>
      <path d="M24 41V22" stroke="#D24E3A" strokeWidth="3.2"/>
      <path d="M24 23c-9 0-15-6-15-14 8 0 14 5 15 13M24 23c9 0 15-6 15-14-8 0-14 5-15 13" fill="#4F8C5C"/>
      <path d="M24 9v14" stroke="#3C6B45" strokeWidth="1"/></svg>);
  if(id==="asparagus") return (
    <svg {...common}>
      <g stroke="#6E9B4E" strokeWidth="3.5"><path d="M19 41V15"/><path d="M24 41V11"/><path d="M29 41V14"/></g>
      <g fill="#557F38" stroke="none"><path d="M17 16l2-5 2 5z"/><path d="M22 12l2-5 2 5z"/><path d="M27 15l2-5 2 5z"/></g></svg>);
  if(id==="celery") return (
    <svg {...common}>
      <g stroke="#A9C47E" strokeWidth="3.5" fill="none"><path d="M24 41C22 33 20 24 18 15"/><path d="M24 41V13"/><path d="M24 41c2-8 4-17 6-26"/></g>
      <path d="M18 15c-2-2-4-2-6-1 1 3 3 4 6 3M30 15c2-2 4-2 6-1-1 3-3 4-6 3M24 13c0-3 1-5 0-7-1 2 0 4 0 7" fill="#5E8C3E" stroke="#5E8C3E"/></svg>);
  if(id==="blackberry") return (
    <svg {...common}>
      <path d="M23.5 21c-2-3-5-3.5-8-3 1 3 3 4 8 4m0-1c2-3 5-3.5 8-3-1 3-3 4-8 4" fill="#7FA86A" stroke="#7FA86A"/>
      <g fill="#3E2E52" stroke="none">
        <circle cx="23.5" cy="24" r="3"/><circle cx="20" cy="27" r="3.2"/><circle cx="27" cy="27" r="3.2"/><circle cx="23.5" cy="30" r="3.2"/><circle cx="20.5" cy="33" r="3"/><circle cx="26.5" cy="33" r="3"/><circle cx="23.5" cy="36" r="2.8"/></g></svg>);
  if(id==="rhubarb") return (
    <svg {...common}>
      <path d="M21 41V22M27 41V22" stroke="#C0464A" strokeWidth="3.5"/>
      <path d="M24 22c-9-1-14-6-15-13 8 0 13 4 15 11M24 22c9-1 14-6 15-13-8 0-13 4-15 11" fill="#4F8C5C"/></svg>);
  if(id==="fennel") return (
    <svg {...common}>
      <path d="M24 41c0-6 0-10 0-14" stroke="#A9C47E" strokeWidth="2.5"/>
      <path d="M24 27c-5-2-8-5-10-9M24 24c5-2 8-5 10-9M24 21c-4-2-6-4-7-8M24 18c4-2 6-4 7-8M24 30c-4-1-6-3-8-6M24 30c4-1 6-3 8-6" stroke="#6FA050" strokeWidth="1.4"/>
      <path d="M20 41c-1-4 1-7 4-7s5 3 4 7Z" fill="#EFE7D2" stroke="#C9BE9E"/></svg>);
  if(id==="lemonbalm") return (
    <svg {...common}>
      <path d="M24 41V12" stroke="#5E8C3E"/>
      <path d="M24 22c-4-1-7 1-8 5 4 1 7-1 8-5M24 22c4-1 7 1 8 5-4 1-7-1-8-5M24 16c-3-1-6 1-7 4 3 1 6-1 7-4M24 16c3-1 6 1 7 4-3 1-6-1-7-4M24 30c-3-1-6 1-7 4 3 1 6-1 7-4M24 30c3-1 6 1 7 4-3 1-6-1-7-4" fill="#8FB85A" stroke="#8FB85A"/></svg>);
  if(id==="peach") return (
    <svg {...common}>
      <circle cx="24" cy="28" r="12.5" fill="#E59A6E"/>
      <path d="M24 16v24" stroke="#C9764E" strokeWidth="1.3"/>
      <path d="M24 16v-4" stroke="#5A4632"/>
      <path d="M24 13c2-3 6-3 8-1-1 3-5 4-8 1Z" fill="#7FA86A"/></svg>);
  if(id==="plum") return (
    <svg {...common}>
      <ellipse cx="24" cy="28" rx="10" ry="12" fill="#7A3F66"/>
      <path d="M24 17v22" stroke="#56294A" strokeWidth="1.2"/>
      <path d="M24 17v-5" stroke="#5A4632"/>
      <path d="M24 13c2-2 5-2 7-1-1 3-4 3-7 1Z" fill="#7FA86A"/></svg>);
  if(id==="olive") return (
    <svg {...common}>
      <path d="M16 12c2 8 4 18 6 28" stroke="#7E8A4E" strokeWidth="1.6"/>
      <ellipse cx="20" cy="30" rx="3.2" ry="4.3" fill="#6E7A3E"/>
      <ellipse cx="27" cy="26" rx="3.2" ry="4.3" fill="#586B30"/>
      <path d="M30 16c4-2 7-1 8 2-3 2-6 1-8-2M26 12c3-2 6-1 7 2-3 2-5 1-7-2" fill="#8AA05E" stroke="#8AA05E"/></svg>);
  if(id==="brussels") return (
    <svg {...common}>
      <path d="M24 41V11" stroke="#5E8C4E" strokeWidth="3"/>
      <g fill="#5E8C4E" stroke="none"><circle cx="18" cy="34" r="3"/><circle cx="30" cy="34" r="3"/><circle cx="18" cy="27" r="3"/><circle cx="30" cy="27" r="3"/><circle cx="18" cy="20" r="3"/><circle cx="30" cy="20" r="3"/></g>
      <path d="M24 13c-3-3-7-3-10-2 2 3 5 4 10 3M24 13c3-3 7-3 10-2-2 3-5 4-10 3" fill="#4F8C5C" stroke="#4F8C5C"/></svg>);
  if(id==="parsnip") return (
    <svg {...common}>
      <path d="M24 42 17 18c5-3 9-3 14 0L24 42Z" fill="#E0D6B8"/>
      <path d="M21 26h6M21 32h5" stroke="#C9BE9E"/>
      <path d="M24 17 24 9M24 12c-3-2-6-2-8-1m8 4c3-2 6-2 8-1" stroke="#5FA05A"/></svg>);
  if(id==="broadbeans") return (
    <svg {...common}>
      <path d="M20 41C18 30 17 20 18 11" stroke="#8FA86A" strokeWidth="5"/>
      <path d="M28 41C30 30 31 20 30 11" stroke="#9FB87A" strokeWidth="5"/>
      <g fill="#6E8C4E" stroke="none"><circle cx="18" cy="16" r="1.6"/><circle cx="18" cy="22" r="1.6"/><circle cx="18" cy="28" r="1.6"/><circle cx="30" cy="16" r="1.6"/><circle cx="30" cy="22" r="1.6"/><circle cx="30" cy="28" r="1.6"/></g></svg>);
  if(id==="pakchoi") return (
    <svg {...common}>
      <path d="M24 41c-6 0-9-3-9-8 0-3 2-5 4-6 2-1 3-2 5-2s3 1 5 2c2 1 4 3 4 6 0 5-3 8-9 8Z" fill="#EFE7D2" stroke="#D6CBAE"/>
      <path d="M24 25c-2-8-4-13-7-16 0 5 2 10 5 14M24 25c2-8 4-13 7-16 0 5-2 10-5 14M24 25V8" fill="#4F8C5C" stroke="#4F8C5C"/></svg>);
  if(id==="blackcurrant") return (
    <svg {...common}>
      <path d="M24 10c0 4 0 7 0 10" stroke="#5A4632"/>
      <g fill="#3E2E52" stroke="none"><circle cx="20" cy="24" r="3.2"/><circle cx="27" cy="25" r="3.2"/><circle cx="22" cy="31" r="3.2"/><circle cx="28" cy="32" r="3.2"/><circle cx="24" cy="38" r="3"/></g></svg>);
  if(id==="gooseberry") return (
    <svg {...common}>
      <circle cx="20" cy="29" r="7" fill="#9CB04E"/>
      <circle cx="29" cy="27" r="6" fill="#A9BD5A"/>
      <path d="M20 23v-4M29 22v-4" stroke="#5A4632"/>
      <path d="M16 29c1-3 3-5 4-6M25 27c1-3 3-4 4-5" stroke="#7E9036" strokeWidth="1"/></svg>);
  if(id==="kiwi") return (
    <svg {...common}>
      <ellipse cx="24" cy="27" rx="10" ry="13" fill="#8A7A4E"/>
      <path d="M24 14v-3" stroke="#5A4632"/>
      <g stroke="#6E5E38" strokeWidth="0.8"><path d="M16 22c4 1 12 1 16 0M15 28c5 1 13 1 18 0M17 34c4 1 10 1 14 0"/></g></svg>);
  if(id==="chamomile") return (
    <svg {...common}>
      <path d="M24 41V24" stroke="#7E9A5A"/>
      <path d="M24 30c-3-1-5-2-7-4M24 33c3-1 5-2 7-4" stroke="#7E9A5A" strokeWidth="1.2"/>
      <g fill="#F4ECD6" stroke="#D8CDB2"><ellipse cx="24" cy="13" rx="2" ry="4"/><ellipse cx="24" cy="23" rx="2" ry="4"/><ellipse cx="19" cy="18" rx="4" ry="2"/><ellipse cx="29" cy="18" rx="4" ry="2"/></g>
      <circle cx="24" cy="18" r="3.4" fill="#E0CC5E" stroke="none"/></svg>);
  if(id==="bay") return (
    <svg {...common}>
      <path d="M24 41V12" stroke="#3C6B45"/>
      <path d="M24 30c-5 0-8-3-9-8 5 0 8 3 9 8M24 26c5 0 8-3 9-8-5 0-8 3-9 8M24 22c-4 0-7-3-8-7 4 0 7 3 8 7M24 18c4 0 7-3 8-7-4 0-7 3-8 7" fill="#4E7A4C" stroke="#4E7A4C"/></svg>);
  if(id==="apricot") return (
    <svg {...common}>
      <circle cx="24" cy="28" r="11.5" fill="#E6A24E"/>
      <path d="M24 17v22" stroke="#C9824E" strokeWidth="1.2"/>
      <path d="M24 17v-4" stroke="#5A4632"/>
      <path d="M24 14c2-3 6-3 8-1-1 3-5 4-8 1Z" fill="#7FA86A"/></svg>);
  if(id==="pomegranate") return (
    <svg {...common}>
      <circle cx="24" cy="29" r="12" fill="#C24A40"/>
      <g stroke="#9A2E28" strokeWidth="1.6" fill="none"><path d="M21 18l-1-4M24 18v-5M27 18l1-4"/></g></svg>);
  if(id==="avocado") return (
    <svg {...common}>
      <path d="M24 41c-6 0-10-5-10-11 0-5 2-8 4-12 1-3 2-6 6-6s5 3 6 6c2 4 4 7 4 12 0 6-4 11-10 11Z" fill="#557A34"/>
      <path d="M24 38c-4 0-7-4-7-8 0-4 1-6 3-9 1-2 1-4 4-4s3 2 4 4c2 3 3 5 3 9 0 4-3 8-7 8Z" fill="#C7D89A"/>
      <circle cx="24" cy="29" r="4.5" fill="#8A5E32" stroke="none"/></svg>);
  if(id==="chilli") return (
    <svg {...common}>
      <path d="M20 11c-1-2 1-4 3-3 2 1 2 3 1 5 4 0 7 3 6 8-1 9-8 16-14 16-2 0-3-2-1-4 2-2 5-2 8-6 4-5 5-10 5-14 0-2-2-3-5-3-2 0-3-1-2-3 0-1 1-1 2-1Z" fill="#C0392E"/>
      <path d="M23 8c2 0 3 2 2 4" stroke="#4E7A4C" strokeWidth="2"/></svg>);
  if(id==="turnip") return (
    <svg {...common}>
      <path d="M24 40c-7 0-11-5-11-10 0-5 5-8 11-8s11 3 11 8c0 5-4 10-11 10Z" fill="#EFE7DC"/>
      <path d="M13 28c2-3 6-5 11-5s9 2 11 5c-1-3-5-5-11-5s-10 2-11 5Z" fill="#9C6E8E"/>
      <path d="M24 22V11M24 13c-3-3-6-3-8-2m8 2c3-3 6-3 8-2" stroke="#5FA05A"/></svg>);
  if(id==="rocket") return (
    <svg {...common}>
      <path d="M24 41V20" stroke="#5E8C3E"/>
      <path d="M24 22c-2-2-3-5-2-8-2 1-4 1-6-1 0 3 1 5 3 6-2 0-4 1-5 4 4 1 8-1 10-5Z" fill="#6E9A4E"/>
      <path d="M24 31c-2-1-4-3-4-6-2 1-3 1-5 0 0 2 1 4 3 5-2 0-3 1-4 3 4 1 8 0 10-2ZM24 22c2-2 3-5 2-8 2 1 4 1 6-1 0 3-1 5-3 6 2 0 4 1 5 4-4 1-8-1-10-5Z" fill="#7EA85E"/></svg>);
  if(id==="artichoke") return (
    <svg {...common}>
      <path d="M24 41V28" stroke="#6E8C5A" strokeWidth="3"/>
      <path d="M24 12c-7 2-11 8-11 14 0 4 5 6 11 6s11-2 11-6c0-6-4-12-11-14Z" fill="#7E9A7E"/>
      <path d="M18 20c2 2 4 3 6 3s4-1 6-3M16 26c3 2 5 3 8 3s5-1 8-3M24 13v20" stroke="#5C7A5C" strokeWidth="1.2"/></svg>);
  if(id==="redcurrant") return (
    <svg {...common}>
      <path d="M22 10c1 4 1 8 0 12" stroke="#5A4632"/>
      <g fill="#C0413E" stroke="none"><circle cx="19" cy="24" r="2.8"/><circle cx="25" cy="24" r="2.8"/><circle cx="21" cy="30" r="2.8"/><circle cx="27" cy="30" r="2.8"/><circle cx="23" cy="36" r="2.6"/><circle cx="29" cy="35" r="2.6"/></g></svg>);
  if(id==="passionfruit") return (
    <svg {...common}>
      <circle cx="24" cy="28" r="11" fill="#6E4A7E"/>
      <path d="M24 17c0-3 2-5 5-5" stroke="#7FA86A"/>
      <path d="M29 12c2-1 4 1 3 3-1 2-4 1-3-3Z" fill="none" stroke="#7FA86A"/>
      <ellipse cx="21" cy="24" rx="3" ry="2" fill="#8A6A9A" stroke="none"/></svg>);
  if(id==="marjoram") return (
    <svg {...common}>
      <path d="M24 41V12" stroke="#5E8C3E"/>
      <g fill="#7EA85E" stroke="#7EA85E"><ellipse cx="20" cy="30" rx="3" ry="2"/><ellipse cx="28" cy="30" rx="3" ry="2"/><ellipse cx="20" cy="24" rx="3" ry="2"/><ellipse cx="28" cy="24" rx="3" ry="2"/><ellipse cx="20.5" cy="18" rx="2.6" ry="1.8"/><ellipse cx="27.5" cy="18" rx="2.6" ry="1.8"/></g></svg>);
  if(id==="sorrel") return (
    <svg {...common}>
      <path d="M20 41C19 31 18 22 19 14M28 41C29 31 30 22 29 14" stroke="#6E9A3E" strokeWidth="2"/>
      <path d="M19 14c-3-1-5 0-6 3 2 1 4 1 6-1 0 2-1 4 0 5 2-1 3-3 3-7-1-1-2-1-3 0Z" fill="#6E9A3E"/>
      <path d="M29 14c3-1 5 0 6 3-2 1-4 1-6-1 0 2 1 4 0 5-2-1-3-3-3-7 1-1 2-1 3 0Z" fill="#7EA84E"/></svg>);
  if(id==="lemonverbena") return (
    <svg {...common}>
      <path d="M24 41V11" stroke="#5E8C3E"/>
      <path d="M24 30c-5-1-9-3-12-7M24 27c5-1 9-3 12-7M24 22c-5-1-8-3-11-6M24 19c5-1 8-3 11-6M24 35c-4-1-7-2-10-5M24 35c4-1 7-2 10-5" stroke="#8FB85A" strokeWidth="2"/></svg>);
  if(id==="lime") return (
    <svg {...common}>
      <circle cx="23" cy="28" r="13" fill="#8FB84A"/>
      <path d="M23 15v-4" stroke="#5A4632"/>
      <path d="M23 12c2-3 6-3 8-2-1 4-5 4-8 2Z" fill="#5E8C3E"/>
      <circle cx="23" cy="15" r="1" fill="#6E9A2E" stroke="none"/></svg>);
  if(id==="almond") return (
    <svg {...common}>
      <path d="M24 41c-6 0-10-6-10-14 0-7 4-15 10-15s10 8 10 15c0 8-4 14-10 14Z" fill="#DDB88E"/>
      <path d="M24 14v26" stroke="#C49A6E" strokeWidth="1"/>
      <path d="M24 12c2-3 6-3 8-1-1 3-5 4-8 1Z" fill="#7FA86A"/></svg>);
  if(id==="quince") return (
    <svg {...common}>
      <path d="M24 41c-6 0-10-4-10-9 0-4 2-6 3-9 0-3-1-5 1-7 1-2 3-3 6-3s5 1 6 3c2 2 1 4 1 7 1 3 3 5 3 9 0 5-4 9-10 9Z" fill="#DDC257"/>
      <path d="M24 16v-5" stroke="#5A4632"/>
      <path d="M24 12c2-2 5-2 7-1-1 3-4 3-7 1Z" fill="#7FA86A"/></svg>);
  if(id==="kohlrabi") return (
    <svg {...common}>
      <circle cx="24" cy="33" r="9" fill="#A9BD8A"/>
      <g stroke="#5E8C3E" strokeWidth="1.6" fill="none"><path d="M20 25c-2-5-4-9-7-12"/><path d="M24 25V11"/><path d="M28 25c2-5 4-9 7-12"/></g>
      <g fill="#4F8C5C" stroke="#4F8C5C"><path d="M13 13c-1 4 1 6 4 6 1-3 0-5-4-6Z"/><path d="M24 9c-2 3-2 6 0 8 2-2 2-5 0-8Z"/><path d="M35 13c1 4-1 6-4 6-1-3 0-5 4-6Z"/></g></svg>);
  if(id==="springonion") return (
    <svg {...common}>
      <g strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M21 41V30" stroke="#D8E0C0"/><path d="M21 31V18" stroke="#8FB85E"/>
        <path d="M24 41V30" stroke="#D8E0C0"/><path d="M24 31V14" stroke="#8FB85E"/>
        <path d="M27 41V30" stroke="#D8E0C0"/><path d="M27 31V17" stroke="#8FB85E"/></g></svg>);
  if(id==="pineapple") return (
    <svg {...common}>
      <ellipse cx="24" cy="30" rx="9" ry="11" fill="#D9A83E"/>
      <path d="M16 26l16 8M16 30l16 8M16 34l16 4M32 26l-16 8M32 30l-16 8M32 34l-16 4" stroke="#A87A2E" strokeWidth="0.7"/>
      <g fill="#4E8C5A" stroke="none">
        <path d="M24 20l-2-11-2 4 1 7z"/><path d="M24 20l2-11 2 4-1 7z"/>
        <path d="M24 20l-6-7 1 5 5 3z"/><path d="M24 20l6-7-1 5-5 3z"/>
        <path d="M22 19v-9l2 9z"/></g></svg>);
  if(id==="goji") return (
    <svg {...common}>
      <path d="M24 12c-1 6-1 12 0 18" stroke="#6E8C4E"/>
      <g fill="#CC4A33" stroke="none"><ellipse cx="20" cy="26" rx="2" ry="3.4"/><ellipse cx="27" cy="25" rx="2" ry="3.4"/><ellipse cx="22" cy="33" rx="2" ry="3.4"/><ellipse cx="28" cy="32" rx="2" ry="3.4"/><ellipse cx="24" cy="38" rx="1.9" ry="3.2"/></g>
      <g fill="#6E9A4E" stroke="none"><path d="M24 16c-3-2-5-2-7-1 2 2 4 2 7 1Z"/><path d="M24 14c3-2 5-2 7-1-2 2-4 2-7 1Z"/></g></svg>);
  if(id==="physalis") return (
    <svg {...common}>
      <circle cx="24" cy="31" r="8" fill="#D9A23E"/>
      <path d="M24 23c-2-6-5-10-9-12 1 5 3 9 9 12M24 23c2-6 5-10 9-12-1 5-3 9-9 12M24 23V9" fill="#E2D4A8" stroke="#E2D4A8"/></svg>);
  if(id==="lovage") return (
    <svg {...common}>
      <path d="M24 41V13" stroke="#5E8C3E" strokeWidth="2"/>
      <g fill="#6E9A4E" stroke="#5E8C3E">
        <path d="M24 30c-3-3-7-4-10-3 2 3 6 5 10 3Z"/>
        <path d="M24 26c3-3 7-4 10-3-2 3-6 5-10 3Z"/>
        <path d="M24 20c-3-3-6-3-9-2 2 3 6 4 9 2Z"/>
        <path d="M24 16c3-3 6-3 9-2-2 3-6 4-9 2Z"/></g></svg>);
  if(id==="borage") return (
    <svg {...common}>
      <path d="M24 41V20" stroke="#5E8C3E"/>
      <path d="M24 31c-3-1-5-3-6-6-2 2-2 4 0 6 2 1 4 1 6 0Z" fill="#6E9A4E"/>
      <g fill="#5E84C2" stroke="none">
        <ellipse cx="24" cy="10" rx="2" ry="3.5"/>
        <ellipse cx="29.5" cy="14" rx="3.5" ry="2" transform="rotate(40 29.5 14)"/>
        <ellipse cx="27.5" cy="20.5" rx="2" ry="3.5" transform="rotate(72 27.5 20.5)"/>
        <ellipse cx="20.5" cy="20.5" rx="2" ry="3.5" transform="rotate(-72 20.5 20.5)"/>
        <ellipse cx="18.5" cy="14" rx="3.5" ry="2" transform="rotate(-40 18.5 14)"/></g>
      <circle cx="24" cy="15.5" r="2" fill="#2E3E6E" stroke="none"/></svg>);
  if(id==="savory") return (
    <svg {...common}>
      <path d="M24 41V12" stroke="#5E8C3E"/>
      <g stroke="#7E9A5A" strokeWidth="2" fill="none">
        <path d="M24 34c-3-1-5-3-6-6M24 31c3-1 5-3 6-6M24 26c-3-1-5-2-6-5M24 23c3-1 5-2 6-5M24 18c-2-1-4-2-5-4M24 16c2-1 4-2 5-4"/></g></svg>);
  if(id==="walnut") return (
    <svg {...common}>
      <circle cx="24" cy="29" r="11" fill="#7E624A"/>
      <path d="M24 18v22" stroke="#5E4632" strokeWidth="1.4"/>
      <path d="M20 22c-2 3-2 7 0 10M28 22c2 3 2 7 0 10M18 27c2 1 4 1 6 0M24 27c2 1 4 1 6 0" stroke="#5E4632" strokeWidth="0.8" fill="none"/>
      <path d="M24 18v-4" stroke="#5A4632"/>
      <path d="M24 15c2-3 6-3 8-1-1 3-5 4-8 1Z" fill="#6E8C4E"/></svg>);
  if(id==="hazelnut") return (
    <svg {...common}>
      <circle cx="22" cy="30" r="7" fill="#A07E52"/>
      <circle cx="30" cy="32" r="6" fill="#946F46"/>
      <path d="M22 23c-3-1-6-3-7-7 3 0 6 2 7 5M22 23c3-1 5-2 6-5 1 3-1 5-6 5M30 26c-3 0-6-2-7-5 3-1 6 0 7 3M30 26c2-1 4-3 4-6 2 2 1 5-4 6" fill="#5E9A4E" stroke="#5E9A4E"/></svg>);
  if(id==="nectarine") return (
    <svg {...common}>
      <circle cx="24" cy="28" r="12" fill="#E27E5A"/>
      <path d="M24 16v24" stroke="#C4623E" strokeWidth="1.3"/>
      <path d="M24 16v-4" stroke="#5A4632"/>
      <path d="M24 13c2-3 6-3 8-1-1 3-5 4-8 1Z" fill="#7FA86A"/></svg>);
  if(id==="persimmon") return (
    <svg {...common}>
      <path d="M24 40c-7 0-12-4-12-10s5-9 12-9 12 3 12 9-5 10-12 10Z" fill="#E0762E"/>
      <g fill="#5E8C3E" stroke="none"><path d="M24 22l-6-3 2 5zM24 22l6-3-2 5zM24 22l-3-6-1 6zM24 22l3-6 1 6z"/></g>
      <path d="M24 16v-3" stroke="#5A4632"/></svg>);
  return (
    <svg {...common}>
      <path d="M24 41V23" stroke="#4E7A4C"/>
      <path d="M24 27c-4-4-9-4-12-2 1 4 5 6 12 6Z" fill="#7FA86A"/>
      <path d="M24 25c3-3 7-3 10-1-1 3-4 5-10 5Z" fill="#7FA86A"/>
      <circle cx="24" cy="19" r="3.5" fill="#BD5736"/></svg>);
}

/* ----------------------- small UI fragments ---------------------- */
const tint = (hex,a)=>{ const n=parseInt(hex.slice(1),16); const r=(n>>16)&255,g=(n>>8)&255,b=n&255; return `rgba(${r},${g},${b},${a})`; };

function WaterDots({ level }){
  return (
    <span style={{ display:"inline-flex", gap:4 }}>
      {[1,2,3].map(i=>(
        <svg key={i} className="drop" viewBox="0 0 13 17">
          <path d="M6.5 0C6.5 0 1 6.5 1 11a5.5 5.5 0 0 0 11 0C12 6.5 6.5 0 6.5 0Z"
            fill={i<=level?"var(--moss)":"none"} stroke="var(--moss)" strokeWidth="1.4"/>
        </svg>
      ))}
    </span>
  );
}

/* days elapsed since sowing -> current stage + position, for annual crops */
function progressFor(crop, sownAt){
  if(!sownAt || !crop.stages) return null;
  const total = crop.stages[crop.stages.length-1][1] || 1;
  const days = Math.max(0, Math.floor((Date.now()-sownAt)/86400000));
  let idx = 0;
  for(let i=0;i<crop.stages.length;i++){ if(crop.stages[i][1] <= days) idx = i; }
  const done = days >= total;
  return { days, total, idx, done, stage: crop.stages[idx][0], pct: Math.min(100,(days/total)*100) };
}

/* expected stage dates for a sown annual (skips day-0 sow/plant) */
function stageEvents(crop, sownAt){
  if(!sownAt || crop.perennial || !crop.stages) return [];
  return crop.stages.filter(s=>s[1]>0).map(([label,day])=>({ label, day, ts: sownAt + day*86400000 }));
}
function dayStart(ts){ const d=new Date(ts); d.setHours(0,0,0,0); return d.getTime(); }
function fmtDay(ts){ return new Date(ts).toLocaleDateString(undefined,{ weekday:"short", day:"numeric", month:"short" }); }
function relDay(ts){
  const d = Math.round((dayStart(ts)-dayStart(Date.now()))/86400000);
  if(d===0) return "today"; if(d===1) return "tomorrow"; if(d===-1) return "yesterday";
  return d>0 ? `in ${d} days` : `${-d} days ago`;
}
/* calendar (.ics) export so the phone's own calendar does the reminding */
function buildICS(events){
  const p=n=>String(n).padStart(2,"0");
  const day=ts=>{ const d=new Date(ts); return ""+d.getFullYear()+p(d.getMonth()+1)+p(d.getDate()); };
  const d0=new Date();
  const stamp=""+d0.getUTCFullYear()+p(d0.getUTCMonth()+1)+p(d0.getUTCDate())+"T"+p(d0.getUTCHours())+p(d0.getUTCMinutes())+p(d0.getUTCSeconds())+"Z";
  const esc=s=>String(s).replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,");
  const L=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Plot//Growing Guide//EN","CALSCALE:GREGORIAN"];
  events.forEach((e,i)=>{
    L.push("BEGIN:VEVENT",
      "UID:plot-"+day(e.ts)+"-"+i+"-"+Math.abs((e.title||"").split("").reduce((a,c)=>a*31+c.charCodeAt(0)|0,7))+"@plot",
      "DTSTAMP:"+stamp,
      "DTSTART;VALUE=DATE:"+day(e.ts),
      "DTEND;VALUE=DATE:"+day(e.ts+86400000),
      "SUMMARY:"+esc(e.title));
    if(e.desc) L.push("DESCRIPTION:"+esc(e.desc));
    L.push("BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+esc(e.title),"TRIGGER:PT9H","END:VALARM","END:VEVENT");
  });
  L.push("END:VCALENDAR");
  return L.join("\r\n");
}
function downloadICS(filename, events){
  try{
    if(typeof document==="undefined" || !events.length) return;
    const blob=new Blob([buildICS(events)],{ type:"text/calendar;charset=utf-8" });
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a"); a.href=url; a.download=filename;
    document.body.appendChild(a); a.click();
    setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 400);
  }catch(err){ /* sandboxed previews may block downloads; the deployed app won't */ }
}
function downloadText(filename, text, mime){
  try{
    if(typeof document==="undefined") return;
    const blob=new Blob([text],{ type:(mime||"application/json")+";charset=utf-8" });
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a"); a.href=url; a.download=filename;
    document.body.appendChild(a); a.click();
    setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 400);
  }catch(err){}
}
/* backup file: everything Plot keeps on this device, in one JSON */
function makeBackup(s){
  return { app:"plot", version:1, exportedAt:new Date().toISOString(),
    loc: s.loc ? s.loc.id : null, saved: s.saved||[], sownDates: s.sownDates||{},
    notes: s.notes||{}, harvests: s.harvests||{}, photos: s.photos||{} };
}
function validateBackup(obj){
  if(!obj || typeof obj!=="object" || obj.app!=="plot" || typeof obj.version!=="number")
    return { error:"That file isn't a Plot backup." };
  if(obj.version>1) return { error:"This backup was made by a newer version of Plot." };
  const arr=(v)=>Array.isArray(v)?v.filter(x=>typeof x==="string"):[];
  const dict=(v)=>(v && typeof v==="object" && !Array.isArray(v))?v:{};
  const data={ loc: typeof obj.loc==="string"?obj.loc:null, saved:arr(obj.saved),
    sownDates:dict(obj.sownDates), notes:dict(obj.notes), harvests:dict(obj.harvests), photos:dict(obj.photos) };
  const city = data.loc ? CITIES.find(c=>c.id===data.loc) : null;
  const photoCount = Object.values(data.photos).reduce((n,o)=>n+Object.keys(dict(o)).length,0);
  const harvestCount = Object.values(data.harvests).reduce((n,a)=>n+(Array.isArray(a)?a.length:0),0);
  return { error:null, data, exportedAt: obj.exportedAt||null,
    summary:{ city: city?city.city:null, crops:data.saved.length, dates:Object.keys(data.sownDates).length,
      notes:Object.keys(data.notes).length, photos:photoCount, harvests:harvestCount } };
}
function cropICSEvents(crop, sownAt, loc){
  const out = stageEvents(crop, sownAt)
    .filter(e=>e.ts > Date.now()-86400000)
    .map(e=>({ ts:e.ts, title:`${crop.name} — expect ${e.label} (Plot)`, desc:(STAGE_INFO[e.label]||"")+` Expected around day ${e.day} from sowing — weather can shift this by a few days.` }));
  const sd = SUCCESSION[crop.id];
  if(sd && !crop.perennial && sownAt){
    const due = sownAt + sd*86400000;
    const okWin = !loc || (s=>s.kind==="now"||s.kind==="year")(status(crop,loc));
    if(due > Date.now() && okWin) out.push({ ts:due, title:`${crop.name} — sow your next batch (Plot)`, desc:`A succession crop: a short new row every ${succLabel(sd)} keeps the supply steady instead of a glut.` });
  }
  return out.sort((a,b)=>a.ts-b.ts);
}
/* shrink a camera photo so it fits the app's small on-device store */
function compressImage(file, maxDim, quality){
  maxDim = maxDim || 700; quality = quality || 0.72;
  return new Promise((resolve, reject)=>{
    try{
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = ()=>{
        try{
          const scale = Math.min(1, maxDim/Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width*scale)), h = Math.max(1, Math.round(img.height*scale));
          const cv = document.createElement("canvas"); cv.width=w; cv.height=h;
          cv.getContext("2d").drawImage(img, 0, 0, w, h);
          URL.revokeObjectURL(url);
          resolve(cv.toDataURL("image/jpeg", quality));
        }catch(ex){ URL.revokeObjectURL(url); reject(ex); }
      };
      img.onerror = ()=>{ URL.revokeObjectURL(url); reject(new Error("image load failed")); };
      img.src = url;
    }catch(ex){ reject(ex); }
  });
}
/* summarize a 7-day min-temp forecast into a frost outlook */
function frostOutlook(wx){
  if(!wx || wx.skip || wx.error || !wx.days || !wx.days.length) return null;
  const risky = wx.days.filter(d=>typeof d.tmin==="number" && d.tmin<=3);
  if(!risky.length) return { kind:"clear" };
  const worst = risky.reduce((a,b)=>(b.tmin<a.tmin?b:a));
  return { kind: worst.tmin<=0 ? "frost" : "risk", worst, count: risky.length };
}
function fmtForecastDay(dateStr){
  try{ return new Date(dateStr+"T12:00:00").toLocaleDateString(undefined,{ weekday:"short", day:"numeric", month:"short" }); }
  catch(e){ return dateStr; }
}
/* sum a crop's harvest entries into a readable total, e.g. "1.4 kg · 6 items" */
const HARVEST_UNITS = [["g","g","g"],["kg","kg","kg"],["item","item","items"],["bunch","bunch","bunches"],["handful","handful","handfuls"]];
function harvestTotals(entries){
  if(!entries || !entries.length) return "";
  let grams=0; const other={};
  for(const e of entries){
    const q=+e.qty || 0;
    if(e.unit==="g") grams+=q;
    else if(e.unit==="kg") grams+=q*1000;
    else other[e.unit]=(other[e.unit]||0)+q;
  }
  const parts=[];
  if(grams>0) parts.push(grams>=1000 ? (Math.round(grams/100)/10)+" kg" : Math.round(grams)+" g");
  for(const [u,sing,plur] of HARVEST_UNITS){
    if(u==="g"||u==="kg") continue;
    const q=other[u]; if(!q) continue;
    const n=Math.round(q*10)/10;
    parts.push(n+" "+(n===1?sing:plur));
  }
  return parts.join(" · ");
}

/* control on the detail screen to set/clear when a crop was sown */
function SowControl({ crop, sownAt, onSet, loc }){
  const todayStr = new Date().toISOString().slice(0,10);
  if(sownAt){
    const dateStr = new Date(sownAt).toLocaleDateString(undefined,{ day:"numeric", month:"short", year:"numeric" });
    const p = crop.perennial ? null : progressFor(crop, sownAt);
    const ready = p ? p.done : false;
    let line;
    if(crop.perennial){
      const days = Math.max(0,Math.floor((Date.now()-sownAt)/86400000));
      const months = Math.floor(days/30);
      line = months>=1 ? `Planted ${dateStr} · about ${months} ${months===1?"month":"months"} in` : `Planted ${dateStr} · ${days} ${days===1?"day":"days"} in`;
    } else {
      line = ready ? `Sown ${dateStr}` : `Sown ${dateStr} · day ${p.days}, ${p.stage.toLowerCase()}`;
    }
    const bg = ready ? tint("#BE8E2C",.16) : tint("#4E7A4C",.10);
    const bd = ready ? tint("#BE8E2C",.45) : tint("#4E7A4C",.3);
    const next = (!crop.perennial && !ready) ? stageEvents(crop, sownAt).find(e=>e.ts>Date.now()) : null;
    return (
      <div style={{ marginTop:12, background:bg, border:`1px solid ${bd}`, borderRadius:14, padding:"12px 14px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {ready ? <Check size={18} color="var(--ochre)"/> : <Sprout size={18} color="var(--moss)"/>}
          <span style={{ flex:1, fontSize:14, color:"var(--ink)" }}>
            {ready && <b style={{ display:"block", fontSize:14.5, color:"var(--t-ochre)" }}>Ready to harvest</b>}
            <span style={{ fontWeight:ready?500:600, color:ready?"var(--ink2)":"var(--ink)", fontSize:ready?12.5:14 }}>{line}</span>
          </span>
          <button className="iconbtn" onClick={()=>onSet(null)} aria-label="Clear date"><X size={16}/></button>
        </div>
        {next && (
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginTop:10, paddingTop:10, borderTop:`1px solid ${bd}` }}>
            <span style={{ fontSize:12.5, color:"var(--ink2)", flex:1, minWidth:150 }}>
              Next: <b style={{ color:"var(--ink)" }}>{next.label}</b> — {fmtDay(next.ts)} ({relDay(next.ts)})
            </span>
            <button className="chip" style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:12, padding:"5px 11px" }}
              onClick={()=>downloadICS(`plot-${crop.id}-stages.ics`, cropICSEvents(crop, sownAt, loc))}>
              <CalendarDays size={13}/> Calendar reminders
            </button>
          </div>
        )}
        {(()=>{
          const sd = !crop.perennial && SUCCESSION[crop.id];
          if(!sd) return null;
          const daysIn = Math.max(0, Math.floor((Date.now()-sownAt)/86400000));
          const okWin = !loc || (s=>s.kind==="now"||s.kind==="year")(status(crop,loc));
          if(daysIn < sd || !okWin) return null;
          return (
            <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${bd}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                <span style={{ fontSize:12.5, color:"var(--t-ochre)", flex:1, minWidth:150 }}>
                  <b>Next batch due</b> — it's been {daysIn} days. Little and often keeps it coming.
                </span>
                <button className="chip on" style={{ fontSize:12, padding:"5px 11px", background:"var(--ochre)", borderColor:"var(--ochre)" }} onClick={()=>onSet(Date.now())}>Sown a new batch</button>
              </div>
              <p className="mono" style={{ fontSize:8.5, color:"var(--muted)", letterSpacing:".04em", margin:"6px 0 0" }}>TRACKS YOUR NEWEST BATCH — THE HARVEST LOG KEEPS THE HISTORY</p>
            </div>
          );
        })()}
      </div>
    );
  }
  return (
    <div style={{ marginTop:12, background:"var(--card2)", border:"1px solid var(--line)", borderRadius:14, padding:"12px 14px" }}>
      <div style={{ fontSize:13.5, color:"var(--ink2)", marginBottom:10 }}>Track its growth — when did you {crop.perennial?"plant":"sow"} it?</div>
      <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
        <button className="chip on" onClick={()=>onSet(Date.now())} style={{ display:"inline-flex", alignItems:"center", gap:6 }}><Sprout size={14}/> {crop.perennial?"Planted":"Sown"} today</button>
        <span style={{ fontSize:12.5, color:"var(--muted)" }}>or pick a date</span>
        <input type="date" max={todayStr} onChange={e=>{ if(e.target.value) onSet(new Date(e.target.value).getTime()); }}
          style={{ fontFamily:"inherit", fontSize:13, padding:"7px 10px", borderRadius:9, border:"1px solid var(--line)", background:"var(--paper)", color:"var(--ink)" }} />
      </div>
    </div>
  );
}

/* per-stage photo journal: snap the plant at each stage, kept on-device */
function PhotoJournal({ crop, sownAt, shots, onAdd, onDelete }){
  const steps = crop.stages ? crop.stages.map(s=>s[0]) : (crop.arc||[]).map(a=>a[0]);
  const fileRef = React.useRef(null);
  const pendRef = React.useRef(null);
  const [view, setView] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  if(!sownAt || !steps.length) return null;
  const snap = (stage)=>{ pendRef.current=stage; setErr(null); if(fileRef.current){ fileRef.current.value=""; fileRef.current.click(); } };
  const onFile = async (e)=>{
    const f = e.target.files && e.target.files[0]; const stage = pendRef.current;
    if(!f || !stage) return;
    setBusy(true);
    try{
      const img = await compressImage(f);
      const ok = await onAdd(stage, img);
      if(ok===false) setErr("Couldn't save — this device's app storage is full. Delete a photo or two and try again.");
      else setView(stage);
    }catch(ex){ setErr("Couldn't read that photo — try taking it again."); }
    setBusy(false);
  };
  const dayOf = (ts)=> Math.max(0, Math.floor((ts - sownAt)/86400000));
  const cur = view ? shots[view] : null;
  return (
    <div style={{ marginTop:12 }}>
      <div className="label" style={{ margin:"12px 0 8px", display:"flex", alignItems:"center", gap:6 }}><Camera size={13}/> Photo journal</div>
      <div className="scrollx" style={{ display:"flex", gap:9, overflowX:"auto", paddingBottom:6 }}>
        {steps.map(st=>{
          const ph = shots[st];
          return (
            <div key={st} onClick={()=> ph ? setView(view===st?null:st) : snap(st)} style={{ flexShrink:0, width:88, cursor:"pointer" }}>
              {ph ? (
                <img src={ph.img} alt={crop.name+" at "+st} style={{ width:88, height:88, objectFit:"cover", borderRadius:12, border: view===st ? "2px solid var(--clay)" : "1px solid var(--line)", display:"block" }} />
              ) : (
                <div style={{ width:88, height:88, borderRadius:12, border:"1.5px dashed var(--line2)", background:"var(--card2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Camera size={20} color="var(--muted)"/>
                </div>
              )}
              <div style={{ fontSize:11, fontWeight:600, color: ph ? "var(--ink)" : "var(--muted)", marginTop:4, textAlign:"center", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{st}</div>
              <div className="mono" style={{ fontSize:8.5, color:"var(--muted)", letterSpacing:".03em", textAlign:"center" }}>
                {ph ? "DAY "+dayOf(ph.ts) : "ADD PHOTO"}
              </div>
            </div>
          );
        })}
      </div>
      {busy && <p className="mono" style={{ fontSize:10, color:"var(--muted)", margin:"4px 0 0", letterSpacing:".04em" }}>SAVING PHOTO…</p>}
      {err && <p style={{ fontSize:12.5, color:"var(--t-danger)", margin:"6px 0 0", lineHeight:1.4 }}>{err}</p>}
      {cur && (
        <div className="rise" style={{ marginTop:10, background:"var(--card)", border:"1px solid var(--line)", borderRadius:14, overflow:"hidden" }}>
          <img src={cur.img} alt={crop.name+" at "+view} style={{ width:"100%", display:"block", maxHeight:340, objectFit:"cover" }} />
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 13px" }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div className="fr" style={{ fontSize:15, fontWeight:600 }}>{view}</div>
              <div className="mono" style={{ fontSize:10, color:"var(--muted)", letterSpacing:".03em" }}>
                {fmtDay(cur.ts).toUpperCase()} · DAY {dayOf(cur.ts)} FROM {crop.perennial ? "PLANTING" : "SOWING"}
              </div>
            </div>
            <button className="chip" style={{ fontSize:12, padding:"5px 11px" }} onClick={()=>snap(view)}>Retake</button>
            <button className="iconbtn" aria-label="Delete photo" onClick={()=>{ onDelete(view); setView(null); }}><Trash2 size={16}/></button>
            <button className="iconbtn" aria-label="Close" onClick={()=>setView(null)}><X size={16}/></button>
          </div>
        </div>
      )}
      <p style={{ fontSize:11.5, color:"var(--muted)", margin:"7px 0 0", lineHeight:1.45 }}>
        Tap an empty slot to photograph the plant at that stage. Photos are shrunk to fit and stay on this device — they're not uploaded anywhere.
      </p>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} style={{ display:"none" }} />
    </div>
  );
}

/* freeform per-crop note, kept on-device */
function NotesCard({ crop, value, onChange }){
  return (
    <div style={{ marginTop:12, background:"var(--card2)", border:"1px solid var(--line)", borderRadius:14, padding:"12px 14px" }}>
      <div className="label" style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}><NotebookPen size={13}/> My notes</div>
      <textarea className="input" value={value||""} maxLength={2000} rows={3}
        onChange={(e)=>onChange(e.target.value)}
        placeholder="Variety, where it's planted, what worked…"
        style={{ padding:"10px 12px", borderRadius:11, fontSize:14, lineHeight:1.45, minHeight:64, resize:"vertical", boxSizing:"border-box" }} />
      <p className="mono" style={{ fontSize:9, color:"var(--muted)", letterSpacing:".05em", margin:"6px 0 0" }}>KEPT ON THIS DEVICE, LIKE YOUR SOW DATES</p>
    </div>
  );
}

/* one-row "how to pick" tip, expandable */
function PickRow({ crop }){
  const txt = PICKING[crop.id];
  const [open, setOpen] = useState(false);
  if(!txt) return null;
  return (
    <div style={{ marginTop:12, background:"var(--card2)", border:"1px solid var(--line)", borderRadius:14, overflow:"hidden" }}>
      <button onClick={()=>setOpen(o=>!o)}
        style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"12px 14px", background:"transparent", border:0, cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
        <Scissors size={14} color="var(--clay)"/>
        <span className="label" style={{ flex:1, margin:0 }}>How to pick</span>
        <ChevronRight size={15} color="var(--muted)" style={{ transform:open?"rotate(90deg)":"none", transition:"transform .15s" }}/>
      </button>
      {open && <p style={{ margin:0, padding:"0 14px 12px", fontSize:13, color:"var(--ink2)", lineHeight:1.5, animation:"fade .2s ease both" }}>{txt}</p>}
    </div>
  );
}

/* log each pick: amount + unit + date, with a running total */
function HarvestCard({ crop, sownAt, entries, onAdd, onDelete }){
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("g");
  const todayStr = new Date().toISOString().slice(0,10);
  const [date, setDate] = useState(todayStr);
  if(!sownAt && (!entries || !entries.length)) return null;
  const list = [...(entries||[])].sort((a,b)=>b.ts-a.ts);
  const total = harvestTotals(entries);
  const add = ()=>{
    const q = parseFloat(qty);
    if(!q || q<=0) return;
    const ts = date===todayStr ? Date.now() : new Date(date+"T12:00:00").getTime();
    onAdd({ qty:q, unit, ts });
    setQty("");
  };
  const unitLabel = (e)=>{ const u=HARVEST_UNITS.find(x=>x[0]===e.unit); return u ? (e.qty===1?u[1]:u[2]) : e.unit; };
  return (
    <div style={{ marginTop:12, background:"var(--card2)", border:"1px solid var(--line)", borderRadius:14, padding:"12px 14px" }}>
      <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", gap:8, marginBottom:9 }}>
        <div className="label" style={{ display:"flex", alignItems:"center", gap:6, margin:0 }}><Wheat size={13}/> Harvest log</div>
        {total && <span className="mono" style={{ fontSize:10.5, fontWeight:700, color:"var(--t-ochre)", letterSpacing:".03em" }}>{total.toUpperCase()} SO FAR</span>}
      </div>
      <div style={{ display:"flex", gap:7, alignItems:"center", flexWrap:"wrap" }}>
        <input type="number" inputMode="decimal" min="0" step="any" value={qty} placeholder="Amount"
          onChange={e=>setQty(e.target.value)}
          style={{ width:84, fontFamily:"inherit", fontSize:13.5, padding:"8px 10px", borderRadius:9, border:"1px solid var(--line)", background:"var(--paper)", color:"var(--ink)", outline:"none" }} />
        <select value={unit} onChange={e=>setUnit(e.target.value)}
          style={{ fontFamily:"inherit", fontSize:13.5, padding:"8px 8px", borderRadius:9, border:"1px solid var(--line)", background:"var(--paper)", color:"var(--ink)" }}>
          {HARVEST_UNITS.map(([u,s,p])=><option key={u} value={u}>{p}</option>)}
        </select>
        <input type="date" max={todayStr} value={date} onChange={e=>e.target.value && setDate(e.target.value)}
          style={{ fontFamily:"inherit", fontSize:12.5, padding:"8px 8px", borderRadius:9, border:"1px solid var(--line)", background:"var(--paper)", color:"var(--ink)" }} />
        <button className="chip on" onClick={add} style={{ fontSize:12.5, padding:"7px 14px" }}>Add</button>
      </div>
      {list.length>0 && (
        <div style={{ marginTop:10, borderTop:"1px solid var(--line)" }}>
          {list.map(e=>(
            <div key={e.id} style={{ display:"flex", alignItems:"center", gap:9, padding:"7px 0", borderBottom:"1px solid var(--line)" }}>
              <span className="mono" style={{ fontSize:10.5, color:"var(--muted)", letterSpacing:".03em", width:86, flexShrink:0 }}>{fmtDay(e.ts).toUpperCase()}</span>
              <span style={{ flex:1, fontSize:13.5, fontWeight:600, color:"var(--ink)" }}>{e.qty} {unitLabel(e)}</span>
              <button className="iconbtn" style={{ padding:4 }} aria-label="Delete entry" onClick={()=>onDelete(e.id)}><X size={14}/></button>
            </div>
          ))}
        </div>
      )}
      {list.length===0 && <p style={{ fontSize:12.5, color:"var(--muted)", margin:"9px 0 0" }}>Log each pick — even rough amounts — and see what this plant gives you over the season.</p>}
    </div>
  );
}

function StatusBadge({ st, perennial }){
  const [open, setOpen] = useState(false);
  if(st.kind!=="now" && st.kind!=="year" && st.kind!=="wait") return null;
  const verb = perennial ? "plant" : "sow";
  const Verb = perennial ? "Plant" : "Sow";
  const wait = st.kind==="wait";
  const bg = wait ? tint("#BE8E2C",.18) : tint("#4E7A4C",.16);
  const col = wait ? "var(--t-ochre)" : "var(--t-green)";
  const accent = wait ? "var(--ochre)" : "var(--moss)";
  let label, info;
  if(st.kind==="now"){ label = `Good to ${verb} now`; info = `The current month falls inside this crop's ${verb}ing window for your city, so now's a good time to ${verb} it.`; }
  else if(st.kind==="year"){ label = `${Verb} year-round`; info = `Your climate is mild enough to ${verb} this in any month — there's no cold season to wait out.`; }
  else { label = `Best ${perennial?"planted":"sown"} in ${MFULL[st.month]}`; info = `Now isn't the ideal time. This crop's ${verb}ing window for your city opens in ${MFULL[st.month]} — ${verb} it then so it grows in the right conditions.`; }
  return (
    <div style={{ display:"inline-block" }}>
      <span className="statusbadge" onClick={(e)=>{ e.stopPropagation(); setOpen(o=>!o); }} style={{ background:bg, color:col, cursor:"pointer" }}>
        {wait ? <CalendarDays size={14}/> : <Sprout size={14}/>} {label} <Info size={12} style={{ opacity:.55 }}/>
      </span>
      {open && (
        <div style={{ marginTop:10, background:"var(--card)", border:"1px solid var(--line)", borderLeft:`3px solid ${accent}`, borderRadius:12, padding:"10px 13px", maxWidth:330, animation:"fade .25s ease both" }}>
          <p style={{ margin:0, fontSize:13, color:"var(--ink2)", lineHeight:1.45 }}>{info}</p>
        </div>
      )}
    </div>
  );
}

/* ----------------------- growth timeline ------------------------- */
function SuccessionBadge({ crop }){
  const d = SUCCESSION[crop.id];
  const [open, setOpen] = useState(false);
  if(!d || crop.perennial) return null;
  return (
    <div style={{ display:"inline-block" }}>
      <span className="statusbadge" onClick={(e)=>{ e.stopPropagation(); setOpen(o=>!o); }}
        style={{ background:tint("#BE8E2C",.16), color:"var(--t-ochre)", cursor:"pointer" }}>
        <Repeat size={13}/> Sow little &amp; often <Info size={12} style={{ opacity:.55 }}/>
      </span>
      {open && (
        <div style={{ marginTop:10, background:"var(--card)", border:"1px solid var(--line)", borderLeft:"3px solid var(--ochre)", borderRadius:12, padding:"10px 13px", maxWidth:330, animation:"fade .25s ease both" }}>
          <p style={{ margin:0, fontSize:13, color:"var(--ink2)", lineHeight:1.45 }}>
            {crop.name} is a succession crop — instead of one big sowing, sow a short row every {succLabel(d)} through its season for a steady supply rather than a glut. Once it's in the ground, Plot will nudge you when the next batch is due.
          </p>
        </div>
      )}
    </div>
  );
}

function PotBadge({ crop }){
  const tip = POT_FRIENDLY[crop.id];
  const [open, setOpen] = useState(false);
  if(!tip) return null;
  return (
    <div style={{ display:"inline-block" }}>
      <span className="statusbadge" onClick={(e)=>{ e.stopPropagation(); setOpen(o=>!o); }}
        style={{ background:tint("#4E8C8A",.15), color:"var(--t-teal)", cursor:"pointer" }}>
        <Flower size={13}/> Happy in a pot <Info size={12} style={{ opacity:.55 }}/>
      </span>
      {open && (
        <div style={{ marginTop:10, background:"var(--card)", border:"1px solid var(--line)", borderLeft:"3px solid #4E8C8A", borderRadius:12, padding:"10px 13px", maxWidth:330, animation:"fade .25s ease both" }}>
          <p style={{ margin:0, fontSize:13, color:"var(--ink2)", lineHeight:1.45 }}>{tip}</p>
        </div>
      )}
    </div>
  );
}

function Timeline({ crop, sownAt }){
  const total = crop.stages[crop.stages.length-1][1] || 1;
  const [sel, setSel] = useState(null);
  const prog = sownAt ? progressFor(crop, sownAt) : null;
  const ppct = prog ? prog.pct : 0;
  /* stagger labels that would collide (e.g. Sow at day 0, Sprout at day 7 of 75) */
  const n = crop.stages.length, LW = 2.0, LGAP = 1.5;
  const lblRows = (()=>{
    const ends=[-1e9,-1e9];
    return crop.stages.map(([lbl,day],i)=>{
      const pct=(day/total)*100, w=lbl.length*LW;
      const start = i===0 ? pct : i===n-1 ? pct-w : pct-w/2;
      const end   = i===0 ? pct+w : i===n-1 ? pct : pct+w/2;
      let r;
      if(start >= ends[0]+LGAP) r=0;
      else if(start >= ends[1]+LGAP) r=1;
      else r = ends[0]<=ends[1] ? 0 : 1;
      ends[r]=Math.max(ends[r],end);
      return r;
    });
  })();
  const twoRows = lblRows.some(r=>r===1);
  return (
    <div style={{ padding:"6px 4px 2px" }}>
      <div style={{ position:"relative", height:4, borderRadius:4, background:"var(--line)", marginTop: prog ? 44 : 30 }}>
        {/* full reference line when no date; progress fill when tracking */}
        {prog ? (
          <div style={{ position:"absolute", top:0, left:0, bottom:0, width:`${ppct}%`, borderRadius:4,
            background:"linear-gradient(90deg,var(--moss),var(--ochre) 80%,var(--clay))", transition:"width .6s ease" }} />
        ) : (
          <div style={{ position:"absolute", inset:0, borderRadius:4, transformOrigin:"left",
            background:"linear-gradient(90deg,var(--moss),var(--ochre) 60%,var(--clay))",
            animation:"draw 1.1s .15s cubic-bezier(.2,.7,.3,1) both" }} />
        )}
        {/* current-day marker */}
        {prog && (
          <div style={{ position:"absolute", left:`${ppct}%`, top:"50%", transform:"translate(-50%,-50%)", zIndex:3 }}>
            <div className={prog.done?"readydot":"nowdot"} style={{ width:18, height:18, borderRadius:"50%", background:prog.done?"var(--ochre)":"var(--clay)", border:"3px solid var(--paper)" }} />
            <div className="mono" style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", top:-30, whiteSpace:"nowrap",
              background:prog.done?"var(--ochre)":"var(--clay)", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 7px", borderRadius:7 }}>
              {prog.done ? "READY" : `DAY ${prog.days}`}
            </div>
          </div>
        )}
        {crop.stages.map(([lbl,day],i)=>{
          const pct = (day/total)*100;
          const tx = i===0 ? "0" : i===crop.stages.length-1 ? "-100%" : "-50%";
          const align = i===0 ? "left" : i===crop.stages.length-1 ? "right" : "center";
          const on = sel===i;
          const reached = prog ? day <= prog.days : false;
          const cur = prog ? i===prog.idx && !prog.done : false;
          const dotBg = on ? "var(--clay)" : reached ? "var(--moss)" : "var(--paper)";
          const dotBorder = on ? "var(--clay)" : reached ? "var(--moss)" : "var(--ink)";
          return (
            <div key={lbl} onClick={(e)=>{ e.stopPropagation(); setSel(on?null:i); }}
              style={{ position:"absolute", left:`${pct}%`, top:"50%", transform:"translate(-50%,-50%)", cursor:"pointer", zIndex: cur?2:1 }}>
              <div style={{ position:"absolute", left:-18, top:-18, width:36, height:36 }} />
              <div style={{ width:on?15:13, height:on?15:13, borderRadius:"50%", background:dotBg,
                border:`3px solid ${dotBorder}`, animation: prog ? "none" : `pop .4s ${.3+i*0.12}s both`, transition:"all .15s" }} />
              <div style={{ position:"absolute", left:0, transform:`translateX(${tx})`, top:-26,
                whiteSpace:"nowrap", textAlign:align }} className="mono">
                <span style={{ fontSize:11, fontWeight:700, color:"var(--ink)" }}>{day}</span>
              </div>
              <div style={{ position:"absolute", left:0, transform:`translateX(${tx})`, top:18+lblRows[i]*13,
                whiteSpace:"nowrap", textAlign:align, fontSize:10.5, color: on?"var(--clay)":cur?"var(--ink)":"var(--muted)", fontWeight: (on||cur)?700:600 }}>{lbl}</div>
            </div>
          );
        })}
      </div>
      <div style={{ height: twoRows ? 39 : 26 }} />
      <StageHelper sel={sel} label={sel!==null?crop.stages[sel][0]:null} extra={sel!==null?`Around day ${crop.stages[sel][1]}`:null} onClose={()=>setSel(null)} />
    </div>
  );
}

/* helper card shown when a timeline stage is tapped */
function StageHelper({ sel, label, extra, onClose }){
  if(sel===null) return (
    <div style={{ display:"flex", alignItems:"center", gap:6, color:"var(--muted)", fontSize:12, marginTop:2 }}>
      <Info size={13}/> <span>Tap a stage to see what it means</span>
    </div>
  );
  return (
    <div style={{ marginTop:2, background:"var(--card)", border:"1px solid var(--line)", borderLeft:"3px solid var(--clay)",
      borderRadius:12, padding:"11px 13px", display:"flex", gap:10, alignItems:"flex-start", animation:"fade .25s ease both" }}>
      <div style={{ flex:1 }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
          <span className="fr" style={{ fontSize:15, fontWeight:600 }}>{label}</span>
          {extra && <span className="mono" style={{ fontSize:10, color:"var(--muted)" }}>{extra}</span>}
        </div>
        <p style={{ margin:"4px 0 0", fontSize:13, color:"var(--ink2)", lineHeight:1.45 }}>{STAGE_INFO[label] || "A stage in this crop's growth."}</p>
      </div>
      <button className="iconbtn" onClick={(e)=>{ e.stopPropagation(); onClose(); }} aria-label="Close" style={{ padding:4 }}><X size={15}/></button>
    </div>
  );
}

/* --------------------- perennial (tree) timeline ----------------- */
/* parse an arc time sublabel ("Yr 2–4", "~6 mo", "1–2 yr") into years */
function subYears(s){
  s = String(s).toLowerCase();
  const mo = s.match(/(\d+)\s*mo/);          if(mo) return (+mo[1])/12;
  const yb = s.match(/yr\s*(\d+)/);          if(yb) return +yb[1];
  const ya = s.match(/(\d+)\s*(?:–|-)?\s*\d*\s*yr/); if(ya) return +ya[1];
  return 0;
}
function perennialProgress(crop, sownAt){
  if(!sownAt || !crop.arc) return null;
  const a = crop.arc, n = a.length;
  const thr = a.map(x=>subYears(x[1]));
  const years = (Date.now()-sownAt)/(86400000*365.25);
  if(years >= thr[n-1]) return { pos:100, idx:n-1, done:true, years };
  let i=0; while(i<n-1 && years >= thr[i+1]) i++;
  const span = (thr[i+1]-thr[i]) || 1;
  const frac = Math.max(0, Math.min(1, (years-thr[i])/span));
  return { pos:((i+frac)/(n-1))*100, idx:i, done:false, years };
}
function PerennialTimeline({ crop, sownAt }){
  const a = crop.arc; const n = a.length;
  const [sel, setSel] = useState(null);
  const prog = sownAt ? perennialProgress(crop, sownAt) : null;
  const ppct = prog ? prog.pos : 0;
  const thr = a.map(x=>subYears(x[1]));
  const markLbl = prog ? (prog.done ? "CROPPING" : prog.years<2 ? `${Math.max(0,Math.round(prog.years*12))} MO` : `YR ${Math.round(prog.years)}`) : "";
  return (
    <div style={{ padding:"6px 4px 2px" }}>
      <div style={{ position:"relative", height:4, borderRadius:4, background:"var(--line)", marginTop: prog ? 44 : 30 }}>
        {prog ? (
          <div style={{ position:"absolute", top:0, left:0, bottom:0, width:`${ppct}%`, borderRadius:4,
            background:"linear-gradient(90deg,var(--moss),var(--ochre) 80%,var(--clay))", transition:"width .6s ease" }} />
        ) : (
          <div style={{ position:"absolute", inset:0, borderRadius:4, transformOrigin:"left",
            background:"linear-gradient(90deg,var(--moss),var(--ochre) 60%,var(--clay))",
            animation:"draw 1.1s .15s cubic-bezier(.2,.7,.3,1) both" }} />
        )}
        {prog && (
          <div style={{ position:"absolute", left:`${ppct}%`, top:"50%", transform:"translate(-50%,-50%)", zIndex:3 }}>
            <div className={prog.done?"readydot":"nowdot"} style={{ width:18, height:18, borderRadius:"50%", background:prog.done?"var(--ochre)":"var(--clay)", border:"3px solid var(--paper)" }} />
            <div className="mono" style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", top:-30, whiteSpace:"nowrap",
              background:prog.done?"var(--ochre)":"var(--clay)", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 7px", borderRadius:7 }}>{markLbl}</div>
          </div>
        )}
        {a.map(([lbl,sub],i)=>{
          const pct = n===1 ? 0 : (i/(n-1))*100;
          const tx = i===0 ? "0" : i===n-1 ? "-100%" : "-50%";
          const align = i===0 ? "left" : i===n-1 ? "right" : "center";
          const on = sel===i;
          const reached = prog ? prog.years >= thr[i] : false;
          const cur = prog ? i===prog.idx && !prog.done : false;
          const dotBg = on ? "var(--clay)" : reached ? "var(--moss)" : "var(--paper)";
          const dotBorder = on ? "var(--clay)" : reached ? "var(--moss)" : "var(--ink)";
          return (
            <div key={i} onClick={(e)=>{ e.stopPropagation(); setSel(on?null:i); }}
              style={{ position:"absolute", left:`${pct}%`, top:"50%", transform:"translate(-50%,-50%)", cursor:"pointer", zIndex: cur?2:1 }}>
              <div style={{ position:"absolute", left:-18, top:-18, width:36, height:36 }} />
              <div style={{ width:on?15:13, height:on?15:13, borderRadius:"50%", background:dotBg,
                border:`3px solid ${dotBorder}`, animation: prog ? "none" : `pop .4s ${.3+i*0.12}s both`, transition:"all .15s" }} />
              <div style={{ position:"absolute", left:0, transform:`translateX(${tx})`, top:-24,
                whiteSpace:"nowrap", textAlign:align, fontSize:11, fontWeight:700, color: on?"var(--clay)":cur?"var(--ink)":"var(--ink)" }}>{lbl}</div>
              <div style={{ position:"absolute", left:0, transform:`translateX(${tx})`, top:18,
                whiteSpace:"nowrap", textAlign:align, fontSize:10, color:"var(--muted)", fontWeight:600 }} className="mono">{sub}</div>
            </div>
          );
        })}
      </div>
      <div style={{ height:26 }} />
      <StageHelper sel={sel} label={sel!==null?a[sel][0]:null} extra={sel!==null?a[sel][1]:null} onClose={()=>setSel(null)} />
    </div>
  );
}
function PhBar({ range }){
  const lo=4, hi=9; const left=((range[0]-lo)/(hi-lo))*100; const w=((range[1]-range[0])/(hi-lo))*100;
  return (
    <div style={{ marginTop:10 }}>
      <div style={{ position:"relative", height:8, borderRadius:6,
        background:"linear-gradient(90deg,#C25A2E,#BE8E2C,#4E7A4C,#3a6f8a)" }}>
        <div style={{ position:"absolute", top:-3, height:14, left:`${left}%`, width:`${w}%`,
          border:"2px solid var(--ink)", borderRadius:6, background:tint("#1E342A",.06) }} />
      </div>
      <div className="mono" style={{ display:"flex", justifyContent:"space-between", fontSize:9.5, color:"var(--muted)", marginTop:4 }}>
        <span>acidic 4</span><span>7 neutral</span><span>9 alkaline</span>
      </div>
    </div>
  );
}
function SoilSpec({ crop }){
  const [open, setOpen] = useState(false);
  const mid = (crop.ph[0]+crop.ph[1])/2;
  const desc = mid<5.5 ? "acidic" : mid<6.5 ? "slightly acidic" : mid<=7.2 ? "near-neutral" : "slightly alkaline";
  return (
    <div className="spec" style={{ gridColumn:"1 / -1", cursor:"pointer" }} onClick={()=>setOpen(o=>!o)}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}><FlaskConical size={16} color="var(--clay)"/><span className="label">Soil · {crop.soil}</span></div>
        <Info size={14} color="var(--muted)"/>
      </div>
      <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginTop:7 }}>
        <span style={{ fontWeight:700, fontSize:15 }}>pH {crop.ph[0].toFixed(1)} – {crop.ph[1].toFixed(1)}</span>
        <span className="mono" style={{ fontSize:10.5, color:"var(--muted)" }}>{desc}</span>
      </div>
      <PhBar range={crop.ph}/>
      {open && (
        <div style={{ marginTop:12, paddingTop:12, borderTop:"1px solid var(--line)", animation:"fade .25s ease both" }}>
          <p style={{ margin:0, fontSize:13, color:"var(--ink2)", lineHeight:1.5 }}>
            Soil pH measures acidity on a 0–14 scale: under 7 is acidic, 7 is neutral, over 7 is alkaline. {crop.name} prefers <b style={{ color:"var(--ink)" }}>{desc}</b> soil (pH {crop.ph[0].toFixed(1)}–{crop.ph[1].toFixed(1)}){mid<5.5 ? " — it needs genuinely acidic ground, so use ericaceous (lime-free) compost if your soil is neutral or chalky" : ""}.
          </p>
          <p style={{ margin:"8px 0 0", fontSize:13, color:"var(--ink2)", lineHeight:1.5 }}>
            A cheap test kit tells you where your soil sits. Add garden lime to raise the pH, or sulphur and ericaceous compost to lower it. The "{crop.soil}" note describes the texture it likes — loam is the balanced ideal, sandy soil drains fast, and "rich" means plenty of compost dug in.
          </p>
        </div>
      )}
    </div>
  );
}
function SunSpec({ crop }){
  const [open, setOpen] = useState(false);
  const part = /part/i.test(crop.sun);
  const advice = part
    ? "It'll take a few hours of shade — handy in hot climates, where a little afternoon shade stops leafy crops scorching and running to seed."
    : "Give it the sunniest spot you have. Too little light and it grows leggy and pale, with few flowers or fruit.";
  return (
    <div className="spec" style={{ gridColumn:"1 / -1", cursor:"pointer" }} onClick={()=>setOpen(o=>!o)}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}><Sun size={16} color="var(--ochre)"/><span className="label">Sunlight</span></div>
        <Info size={14} color="var(--muted)"/>
      </div>
      <div style={{ fontWeight:700, fontSize:15, marginTop:7 }}>{crop.sun}</div>
      {open && (
        <div style={{ marginTop:12, paddingTop:12, borderTop:"1px solid var(--line)", animation:"fade .25s ease both" }}>
          <p style={{ margin:0, fontSize:13, color:"var(--ink2)", lineHeight:1.5 }}>
            Full sun means at least six hours of direct sun a day; part shade is roughly three to six hours, or dappled light. {crop.name} wants <b style={{ color:"var(--ink)" }}>{crop.sun.toLowerCase()}</b>.
          </p>
          <p style={{ margin:"8px 0 0", fontSize:13, color:"var(--ink2)", lineHeight:1.5 }}>{advice}</p>
        </div>
      )}
    </div>
  );
}
function CalendarLegend({ plantLabel="Sow" }){
  const [sel, setSel] = useState(null);
  const items = [
    { key:"plant", label:plantLabel, swatch:"var(--clay)", info:`The months to ${plantLabel.toLowerCase().replace(' / plant','/plant')} this crop where you live. Get it in within this window and it has time to grow before the cold returns.` },
    { key:"harvest", label:"Harvest", swatch:tint("#BE8E2C",.85), info:"When the crop is usually ready to pick in your area. For trees, this is the season once the plant is mature." },
    { key:"now", label:"This month", outline:true, info:"The outlined column is the current month, so you can see at a glance what needs doing right now." },
  ];
  return (
    <>
      <div style={{ display:"flex", gap:14, marginTop:10, fontSize:11.5, color:"var(--ink2)", flexWrap:"wrap" }}>
        {items.map((it,i)=>{
          const on = sel===i;
          return (
            <span key={it.key} onClick={()=>setSel(on?null:i)} style={{ display:"inline-flex", alignItems:"center", gap:6, cursor:"pointer", fontWeight:on?700:400, color:on?"var(--ink)":"var(--ink2)" }}>
              <span style={{ width:11, height:11, borderRadius:3, background:it.outline?"transparent":it.swatch, border:it.outline?"2px solid var(--ink)":"none" }}/> {it.label}
            </span>
          );
        })}
        <span style={{ display:"inline-flex", alignItems:"center", gap:4, color:"var(--muted)" }}><Info size={12}/></span>
      </div>
      {sel!==null && (
        <div style={{ marginTop:10, background:"var(--card)", border:"1px solid var(--line)", borderLeft:"3px solid var(--clay)", borderRadius:12, padding:"10px 13px", display:"flex", gap:10, alignItems:"flex-start", animation:"fade .25s ease both" }}>
          <p style={{ margin:0, flex:1, fontSize:13, color:"var(--ink2)", lineHeight:1.45 }}><b style={{ color:"var(--ink)" }}>{items[sel].label}.</b> {items[sel].info}</p>
          <button className="iconbtn" onClick={()=>setSel(null)} aria-label="Close" style={{ padding:4 }}><X size={15}/></button>
        </div>
      )}
    </>
  );
}
function WaterSpec({ crop }){
  const [open, setOpen] = useState(false);
  const level = crop.water; const name = ["","Low","Moderate","High"][level];
  const advice = level===1
    ? "Let the soil dry out between waterings — these plants resent soggy roots. A deep soak now and then beats little-and-often."
    : level===2
    ? "Keep the soil evenly moist but never waterlogged. Water when the top couple of centimetres feel dry, more often in hot, dry spells."
    : "A thirsty crop that wants consistently moist soil. Water often, especially in heat, and mulch to lock moisture in.";
  return (
    <div className="spec" style={{ gridColumn:"1 / -1", cursor:"pointer" }} onClick={()=>setOpen(o=>!o)}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}><Droplets size={16} color="var(--moss)"/><span className="label">Water</span></div>
        <Info size={14} color="var(--muted)"/>
      </div>
      <div style={{ fontWeight:700, fontSize:15, margin:"7px 0 8px" }}>{name}</div>
      <WaterDots level={level}/>
      {open && (
        <div style={{ marginTop:12, paddingTop:12, borderTop:"1px solid var(--line)", animation:"fade .25s ease both" }}>
          <p style={{ margin:0, fontSize:13, color:"var(--ink2)", lineHeight:1.5 }}>
            The drops show how much water a crop wants — one is low, three is high. {crop.name} is <b style={{ color:"var(--ink)" }}>{name.toLowerCase()}</b>. {advice}
          </p>
          <p style={{ margin:"8px 0 0", fontSize:13, color:"var(--ink2)", lineHeight:1.5 }}>
            Pots and sandy soil dry out fastest, so check those more often. Water in the morning and aim at the roots rather than the leaves.
          </p>
        </div>
      )}
    </div>
  );
}
function TempSpec({ crop }){
  const [open, setOpen] = useState(false);
  const f = c=>Math.round(c*9/5+32);
  const warm = crop.temp[0] >= 17;
  const cool = !warm && crop.temp[0] <= 16 && crop.temp[1] <= 24;
  const note = warm
    ? "This is a warm-season crop — cold checks its growth and frost will kill it, so wait until your nights are reliably mild before planting out."
    : cool
    ? "This is a cool-season crop — it shrugs off chilly weather but tends to bolt (run to seed) and turn bitter in summer heat."
    : "It copes with a fairly wide band, but still wants shelter from hard frost and scorching heat.";
  return (
    <div className="spec" style={{ gridColumn:"1 / -1", cursor:"pointer" }} onClick={()=>setOpen(o=>!o)}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}><Thermometer size={16} color="var(--clay)"/><span className="label">Ideal temperature</span></div>
        <Info size={14} color="var(--muted)"/>
      </div>
      <TempBar range={crop.temp}/>
      {open && (
        <div style={{ marginTop:12, paddingTop:12, borderTop:"1px solid var(--line)", animation:"fade .25s ease both" }}>
          <p style={{ margin:0, fontSize:13, color:"var(--ink2)", lineHeight:1.5 }}>
            This is the air-temperature band {crop.name} grows best in — {crop.temp[0]}–{crop.temp[1]}°C ({f(crop.temp[0])}–{f(crop.temp[1])}°F). Growth slows when it's colder and stalls or suffers when it's much hotter.
          </p>
          <p style={{ margin:"8px 0 0", fontSize:13, color:"var(--ink2)", lineHeight:1.5 }}>
            {note} It's often why a crop gets flagged "not suited" to a city — the climate sits outside this range.
          </p>
        </div>
      )}
    </div>
  );
}
function TempBar({ range }){
  const lo=0, hi=40; const left=(range[0]/hi)*100; const w=((range[1]-range[0])/hi)*100;
  const f = c=>Math.round(c*9/5+32);
  return (
    <div style={{ marginTop:10 }}>
      <div style={{ position:"relative", height:8, borderRadius:6,
        background:"linear-gradient(90deg,#6f93b8,#7FA86A,#BE8E2C,#BD5736)" }}>
        <div style={{ position:"absolute", top:-3, height:14, left:`${left}%`, width:`${w}%`,
          border:"2px solid var(--ink)", borderRadius:6, background:tint("#1E342A",.06) }} />
      </div>
      <div className="mono" style={{ fontSize:11, fontWeight:700, marginTop:6 }}>
        {range[0]}–{range[1]}°C <span style={{ color:"var(--muted)", fontWeight:400 }}>· {f(range[0])}–{f(range[1])}°F</span>
      </div>
    </div>
  );
}

/* --------------------------- my plot ----------------------------- */
/* good/bad neighbours card on the crop detail page */
function CompanionsCard({ crop, onOpen }){
  const { good, bad } = companionsFor(crop.id);
  if(!good.length && !bad.length) return null;
  const Chip = ({ c, tone })=>(
    <button className="chip" onClick={()=>onOpen(c.id)}
      style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 11px 5px 6px", fontSize:12.5,
        background: tone==="good" ? tint("#4E7A4C",.10) : tint("#BD5736",.10),
        borderColor: tone==="good" ? tint("#4E7A4C",.35) : tint("#BD5736",.35),
        color:"var(--ink)" }}>
      <span style={{ width:22, height:22, borderRadius:7, background:"var(--card)", display:"inline-flex", alignItems:"center", justifyContent:"center", border:"1px solid var(--line)" }}>
        <Glyph id={c.id} size={16}/>
      </span>
      {c.name}
    </button>
  );
  return (
    <div className="spec" style={{ marginTop:11 }}>
      <div style={{ display:"flex", alignItems:"center", gap:7 }}><Sprout size={16} color="var(--moss)"/><span className="label">Neighbours</span></div>
      {good.length>0 && (
        <>
          <div style={{ fontSize:12, fontWeight:700, color:"var(--t-green)", margin:"10px 0 6px" }}>Grows well beside</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>{good.map(c=><Chip key={c.id} c={c} tone="good"/>)}</div>
        </>
      )}
      {bad.length>0 && (
        <>
          <div style={{ fontSize:12, fontWeight:700, color:"var(--t-danger)", margin:"12px 0 6px" }}>Keep apart from</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>{bad.map(c=><Chip key={c.id} c={c} tone="bad"/>)}</div>
        </>
      )}
      <p style={{ fontSize:11.5, color:"var(--muted)", margin:"11px 0 0", lineHeight:1.45 }}>
        Companion planting is gardeners' tradition more than settled science — pairings that often help (shared space, pest confusion) or often clash (competition, shared diseases), not guarantees.
      </p>
    </div>
  );
}

/* sowing depth & spacing card with tap-to-explain stats */
function SowingCard({ crop }){
  const sw = SOWING[crop.id];
  const [sel, setSel] = useState(null);
  if(!sw) return null;
  const peren = !!crop.perennial;
  const fmt = (v)=> v>=100 ? (Math.round(v/10)/10>=10 ? Math.round(v/100*10)/10+" m" : (v/100)+" m") : v+" cm";
  const depthStr = sw.d===undefined ? null : sw.d===0 ? "Surface" : sw.d<1 ? (sw.d*10)+" mm" : sw.d+" cm";
  const stats=[];
  if(depthStr) stats.push(["depth","Depth",depthStr]);
  if(sw.s) stats.push(["space", crop.type==="Tree" ? "Between trees" : "Between plants", fmt(sw.s)]);
  if(sw.r) stats.push(["rows","Between rows", fmt(sw.r)]);
  if(!stats.length && !sw.n) return null;
  const start = startFor(crop);
  const EXPL = {
    start: start.kind==="shop" ? "A living herb pot from the shop is dozens of seedlings crammed together — tease the rootball apart into three or four clumps, replant each with room to breathe, and they'll romp away instead of fading on the windowsill."
      : start.kind==="plant" ? "A ready-grown plant from the garden centre buys you a head start of months — set it at the same depth it grew in its pot."
      : start.kind==="indoor" ? "Sow in small pots somewhere warm and bright, then plant out once frosts are done — these crops need a head start the open ground can't give."
      : start.kind==="either" ? "Happy either way: start in pots for an early jump, or sow straight into the soil once it's properly warm."
      : start.kind==="direct" ? "Sow straight into the soil where it will grow — it dislikes being transplanted, so no pots needed."
      : "This one starts from living material rather than a packet of seed — the note below covers how to set it.",
    depth: sw.d===0
      ? "Press the seed onto the surface and don't cover it — it needs light to germinate. Keep it gently moist until it sprouts."
      : `Sow about ${depthStr} deep — a good rule of thumb is two to three times the seed's own width. Too deep and the seedling runs out of steam before reaching light; too shallow and it dries out.`,
    space: peren
      ? `Leave about ${sw.s?fmt(sw.s):""} between plants — it looks generous now, but the roots and canopy will fill it.`
      : `About ${sw.s?fmt(sw.s):""} between plants gives each its share of light, water and air. Thin seedlings ruthlessly — crowding means mildew and small pickings.`,
    rows: `Keep rows about ${sw.r?fmt(sw.r):""} apart — room to hoe, water and pick without trampling the bed.`,
  };
  return (
    <div style={{ marginTop:12, background:"var(--card2)", border:"1px solid var(--line)", borderRadius:14, padding:"12px 14px" }}>
      <div className="label" style={{ display:"flex", alignItems:"center", gap:6, marginBottom:9 }}><Sprout size={13}/> {peren ? "Planting" : "Sowing"}</div>
      <div onClick={()=>setSel(sel==="start"?null:"start")}
        style={{ background:"var(--paper2)", borderRadius:9, padding:"7px 10px", cursor:"pointer", marginBottom:7,
          border: sel==="start" ? "1px solid var(--clay)" : "1px solid transparent" }}>
        <div className="mono" style={{ fontSize:9, color:"var(--muted)", letterSpacing:".06em" }}>START FROM</div>
        <div className="fr" style={{ fontSize:15, fontWeight:600, color: sel==="start" ? "var(--clay)" : "var(--ink)", lineHeight:1.2 }}>{start.label}</div>
      </div>
      {stats.length>0 && (
        <div style={{ display:"flex", gap:7 }}>
          {stats.map(([k,lab,val])=>(
            <div key={k} onClick={()=>setSel(sel===k?null:k)}
              style={{ flex:1, background:"var(--paper2)", borderRadius:9, padding:"7px 10px", cursor:"pointer",
                border: sel===k ? "1px solid var(--clay)" : "1px solid transparent" }}>
              <div className="mono" style={{ fontSize:9, color:"var(--muted)", letterSpacing:".06em" }}>{lab.toUpperCase()}</div>
              <div className="fr" style={{ fontSize:15.5, fontWeight:600, color: sel===k ? "var(--clay)" : "var(--ink)", lineHeight:1.15 }}>{val}</div>
            </div>
          ))}
        </div>
      )}
      {sel && (
        <div style={{ marginTop:9, background:"var(--card)", border:"1px solid var(--line)", borderLeft:"3px solid var(--clay)", borderRadius:10, padding:"9px 12px", animation:"fade .2s ease both", display:"flex", gap:8, alignItems:"flex-start" }}>
          <p style={{ margin:0, flex:1, fontSize:12.5, color:"var(--ink2)", lineHeight:1.45 }}>{EXPL[sel]}</p>
          <X size={14} color="var(--muted)" style={{ cursor:"pointer", flexShrink:0, marginTop:2 }} onClick={()=>setSel(null)}/>
        </div>
      )}
      {sw.n && <p style={{ fontSize:12.5, color:"var(--ink2)", margin: stats.length||sel ? "9px 0 0" : 0, lineHeight:1.45 }}>{sw.n}</p>}
    </div>
  );
}

/* common problems accordion on the crop detail page */
function ProblemsCard({ crop }){
  const ids = CROP_PROBLEMS[crop.id] || [];
  const [open, setOpen] = useState(null);
  if(!ids.length) return null;
  const items = ids.map(id=>({ id, ...PROBLEMS[id] })).filter(p=>p.name);
  return (
    <div className="spec" style={{ marginTop:11 }}>
      <div style={{ display:"flex", alignItems:"center", gap:7 }}><Bug size={16} color="var(--clay)"/><span className="label">Common problems</span></div>
      <div style={{ marginTop:6 }}>
        {items.map(p=>{
          const on = open===p.id;
          return (
            <div key={p.id} style={{ borderBottom:"1px solid var(--line)" }}>
              <button onClick={()=>setOpen(on?null:p.id)}
                style={{ width:"100%", display:"flex", alignItems:"center", gap:8, background:"transparent", border:0, padding:"11px 2px", cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
                <span style={{ flex:1, fontSize:14.5, fontWeight:600, color: on ? "var(--clay)" : "var(--ink)" }}>{p.name}</span>
                <ChevronRight size={15} color="var(--muted)" style={{ transform: on ? "rotate(90deg)" : "none", transition:"transform .15s" }}/>
              </button>
              {on && (
                <div style={{ padding:"0 2px 12px", animation:"fade .2s ease both" }}>
                  <p style={{ margin:0, fontSize:13, color:"var(--ink2)", lineHeight:1.5 }}><b style={{ color:"var(--ink)" }}>Signs:</b> {p.signs}</p>
                  <p style={{ margin:"7px 0 0", fontSize:13, color:"var(--ink2)", lineHeight:1.5 }}><b style={{ color:"var(--ink)" }}>What to do:</b> {p.fix}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p style={{ fontSize:11.5, color:"var(--muted)", margin:"10px 0 0", lineHeight:1.45 }}>
        Most plants shrug off a little damage — act when it's spreading, not at the first nibble. For a confident ID, a photo shown at a local nursery beats any list.
      </p>
    </div>
  );
}

/* frost outlook strip on My Plot, fed by the Open-Meteo forecast */
function FrostCard({ wx, loc, crops, sownDates, goCrop }){
  if(!wx || wx.skip || !loc || wx.locId!==loc.id) return null;
  if(wx.error) return (
    <p className="mono" style={{ fontSize:10, color:"var(--muted)", letterSpacing:".04em", margin:"0 0 12px", display:"flex", alignItems:"center", gap:6 }}>
      <Snowflake size={12}/> FROST OUTLOOK UNAVAILABLE — NEEDS A CONNECTION
    </p>
  );
  const o = frostOutlook(wx);
  if(!o) return null;
  if(o.kind==="clear") return (
    <p className="mono" style={{ fontSize:10, color:"var(--muted)", letterSpacing:".04em", margin:"0 0 12px", display:"flex", alignItems:"center", gap:6 }}>
      <Snowflake size={12}/> NO FROST EXPECTED IN {loc.city.toUpperCase()} THIS WEEK · OPEN-METEO
    </p>
  );
  const tender = crops.filter(c=>c.temp && c.temp[0]>=12);
  const out = tender.filter(c=>sownDates[c.id]);
  const named = (out.length?out:tender).slice(0,4);
  const more = (out.length?out:tender).length - named.length;
  const t = Math.round(o.worst.tmin);
  const frost = o.kind==="frost";
  return (
    <div style={{ marginBottom:14, background:tint("#5B8AA6",.13), border:`1px solid ${tint("#5B8AA6",.45)}`, borderRadius:14, padding:"12px 14px" }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
        <Snowflake size={18} color="var(--t-frostI)" style={{ flexShrink:0, marginTop:1 }}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="fr" style={{ fontSize:15.5, fontWeight:600, color:"var(--t-frost)" }}>{frost ? "Frost forecast" : "Frost risk"}</div>
          <p style={{ margin:"3px 0 0", fontSize:13, color:"var(--ink2)", lineHeight:1.45 }}>
            {fmtForecastDay(o.worst.date)} could dip to <b style={{ color:"var(--t-frost)" }}>{t}°C</b>{o.count>1 ? ` — ${o.count} cold nights in the next week.` : "."}
            {named.length>0
              ? <> {out.length ? "Cover or bring in" : "If any are already outside, protect"}: {named.map((c,i)=>(
                  <b key={c.id} style={{ color:"var(--ink)", cursor:"pointer" }} onClick={()=>goCrop && goCrop(c.id,"plot")}>{c.name}{i<named.length-1?", ":""}</b>
                ))}{more>0?` +${more} more`:""}.</>
              : <> Nothing frost-tender in your plot just now — hardy crops will shrug it off.</>}
          </p>
          <div className="mono" style={{ fontSize:8.5, color:"var(--muted)", letterSpacing:".05em", marginTop:6 }}>OPEN-METEO FORECAST · A FORECAST, NOT A PROMISE</div>
        </div>
      </div>
    </div>
  );
}

function PlotScreen({ loc, saved, sownDates={}, setScreen, goCrop, toggleSave, wx, notes={}, harvests={} }){
  const [jobsHelp, setJobsHelp] = useState(false);
  const crops = CROPS.filter(c=>saved.includes(c.id));
  const unfit = crops.filter(c=>suitability(c,loc).level==="unfit");
  const marginal = crops.filter(c=>suitability(c,loc).level==="marginal");
  const sowNow = crops.filter(c=>{ if(!suitability(c,loc).ok) return false; const s=status(c,loc); return s.kind==="now"||s.kind==="year"; });
  const jobs = [];
  crops.forEach(c=>{
    if(!suitability(c,loc).ok) return;
    const s = status(c,loc);
    if(s.kind==="now"||s.kind==="year") jobs.push({ verb:c.perennial?"Plant":"Sow", harvest:false, c });
    if(loc.hemi!=="EQ" && harvestMonths(c,loc).includes(NOW)) jobs.push({ verb:"Harvest", harvest:true, c });
  });

  return (
    <div className="screen">
      <div style={{ padding:"4px 22px 0" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <h1 className="fr" style={{ fontSize:27, fontWeight:600, margin:0, letterSpacing:"-.02em" }}>My Plot</h1>
          <button className="chip" onClick={()=>setScreen("location")} style={{ display:"flex", alignItems:"center", gap:6 }}>
            <MapPin size={14} color="var(--clay)"/> {loc.city}
          </button>
        </div>
        {crops.length>0 && (
          <p className="mono" style={{ fontSize:12, color:"var(--muted)", margin:"8px 0 0", letterSpacing:".04em" }}>
            {crops.length} {crops.length===1?"CROP":"CROPS"} · {sowNow.length} TO SOW NOW{unfit.length>0 ? ` · ${unfit.length} NOT SUITED` : ""}{marginal.length>0 ? ` · ${marginal.length} SHORT SEASON` : ""}
          </p>
        )}
      </div>

      {crops.length===0 ? (
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"40px 34px 120px" }}>
          <div style={{ width:78, height:78, borderRadius:"50%", background:"var(--card2)", border:"1px solid var(--line)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Sprout size={34} color="var(--moss)"/>
          </div>
          <h2 className="fr" style={{ fontSize:21, fontWeight:600, margin:"20px 0 6px" }}>Your plot is empty</h2>
          <p style={{ color:"var(--muted)", fontSize:14.5, margin:"0 0 22px", maxWidth:260 }}>
            Add crops from Discover and we'll plan their sowing and harvest around {loc.city}.
          </p>
          <button className="btn-primary" style={{ width:"auto", padding:"14px 24px" }} onClick={()=>{ setScreen("list"); window.scrollTo(0,0); }}>
            <Compass size={18}/> Browse crops
          </button>
        </div>
      ) : (
        <div style={{ padding:"18px 22px 120px" }}>
          <FrostCard wx={wx} loc={loc} crops={crops} sownDates={sownDates} goCrop={goCrop} />
          {/* jobs this month */}
          <div className="card" style={{ padding:16, background:"var(--card2)" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:11 }}>
              <span className="label">Jobs this month · {MFULL[NOW]}</span>
              <Info size={14} color="var(--muted)" style={{ cursor:"pointer" }} onClick={()=>setJobsHelp(h=>!h)} />
            </div>
            {jobsHelp && (
              <p style={{ margin:"0 0 12px", fontSize:13, color:"var(--ink2)", lineHeight:1.5, background:"var(--card)", border:"1px solid var(--line)", borderLeft:"3px solid var(--moss)", borderRadius:12, padding:"10px 13px", animation:"fade .25s ease both" }}>
                The tasks due in {loc.city} right now, worked out from each crop's calendar and today's date. A <b style={{ color:"var(--t-green)" }}>green</b> dot means sow or plant; <b style={{ color:"var(--t-ochre)" }}>amber</b> means harvest. Crops that aren't suited to your climate are left off. Tap any job to open the crop.
              </p>
            )}
            {jobs.length===0 ? (
              <p style={{ margin:0, fontSize:14, color:"var(--ink2)" }}>Nothing urgent — your crops are busy growing.</p>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
                {jobs.map((j,i)=>(
                  <div key={i} onClick={()=>goCrop(j.c.id,"plot")} style={{ display:"flex", alignItems:"center", gap:11, cursor:"pointer" }}>
                    <span style={{ width:9, height:9, borderRadius:"50%", background: j.harvest ? "var(--ochre)" : "var(--moss)" }}/>
                    <span style={{ fontSize:14.5, fontWeight:600, flex:1 }}>
                      {j.verb} <span className="fr" style={{ fontWeight:600 }}>{j.c.name}</span>
                    </span>
                    <ChevronRight size={15} color="var(--muted)"/>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* stage reminders from sow dates */}
          {(()=>{
            const rows=[]; const allUpcoming=[];
            crops.forEach(c=>{
              const sa=sownDates[c.id]; if(!sa) return;
              const evs=stageEvents(c,sa); if(!evs.length) return;
              const now=Date.now();
              evs.filter(e=>e.ts<=now && e.ts>now-5*86400000).forEach(e=>rows.push({c,e,past:true}));
              const next=evs.find(e=>e.ts>now); if(next) rows.push({c,e:next,past:false});
              const sd=SUCCESSION[c.id];
              if(sd && !c.perennial){
                const due=sa+sd*86400000; const st=status(c,loc);
                if(now>=due && (st.kind==="now"||st.kind==="year")) rows.push({c, e:{label:"Next batch", ts:due}, succ:true});
              }
              cropICSEvents(c,sa,loc).forEach(ev=>allUpcoming.push(ev));
            });
            if(!rows.length) return null;
            rows.sort((a,b)=>a.e.ts-b.e.ts);
            return (
              <div>
                <div className="label" style={{ margin:"22px 0 6px" }}>Stage reminders</div>
                <div className="card" style={{ padding:"4px 16px 13px" }}>
                  {rows.slice(0,8).map(({c,e,past,succ})=>(
                    <div key={c.id+e.label} className="prow" onClick={()=>goCrop(c.id,"plot")} style={{ padding:"11px 2px" }}>
                      <Glyph id={c.id} size={32}/>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:14.5, fontWeight:600 }}>{c.name} · <span style={{ color: (past||succ) ? "var(--t-ochre)" : "var(--ink2)" }}>{e.label}</span></div>
                        <div className="mono" style={{ fontSize:10.5, color: (past||succ) ? "var(--t-ochre)" : "var(--muted)", letterSpacing:".03em" }}>
                          {succ ? <>DUE {relDay(e.ts).toUpperCase()} — SOW A NEW BATCH</> : <>{fmtDay(e.ts).toUpperCase()} · {relDay(e.ts).toUpperCase()}{past ? " — CHECK IT" : ""}</>}
                        </div>
                      </div>
                      <ChevronRight size={15} color="var(--muted)"/>
                    </div>
                  ))}
                  {allUpcoming.length>0 && (
                    <button className="chip" style={{ display:"inline-flex", alignItems:"center", gap:6, marginTop:10 }}
                      onClick={()=>downloadICS("plot-stage-reminders.ics", allUpcoming.sort((a,b)=>a.ts-b.ts))}>
                      <CalendarDays size={14}/> Add to phone calendar
                    </button>
                  )}
                  <p style={{ fontSize:11.5, color:"var(--muted)", margin:"10px 0 0", lineHeight:1.5 }}>
                    Expected dates worked out from your sow date — weather will shift them by a few days. Plot can't send push alerts itself, so the calendar file lets your phone do the nudging.
                  </p>
                </div>
              </div>
            );
          })()}

          {/* harvest so far */}
          {(()=>{
            const rows = Object.keys(harvests)
              .map(id=>({ c: CROPS.find(x=>x.id===id), total: harvestTotals(harvests[id]) }))
              .filter(r=>r.c && r.total)
              .sort((a,b)=>a.c.name.localeCompare(b.c.name));
            if(!rows.length) return null;
            const shown = rows.slice(0,8);
            return (
              <div>
                <div className="label" style={{ margin:"22px 0 6px", display:"flex", alignItems:"center", gap:6 }}><Wheat size={12}/> Harvest so far</div>
                <div className="card" style={{ padding:"4px 16px" }}>
                  {shown.map(({c,total})=>(
                    <div key={c.id} className="prow" onClick={()=>goCrop(c.id,"plot")} style={{ padding:"11px 2px" }}>
                      <Glyph id={c.id} size={32}/>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:14.5, fontWeight:600 }}>{c.name}</div>
                      </div>
                      <span className="mono" style={{ fontSize:11, fontWeight:700, color:"var(--t-ochre)", letterSpacing:".03em" }}>{total.toUpperCase()}</span>
                      <ChevronRight size={15} color="var(--muted)"/>
                    </div>
                  ))}
                  {rows.length>shown.length && <p className="mono" style={{ fontSize:10, color:"var(--muted)", padding:"8px 2px", margin:0 }}>+{rows.length-shown.length} MORE — OPEN A CROP FOR ITS LOG</p>}
                </div>
              </div>
            );
          })()}

          {/* saved crops, grouped by what to do now */}
          {(()=>{
            const ok = (c)=>suitability(c,loc).ok;
            const isNow = (c)=>{ const s=status(c,loc); return s.kind==="now"||s.kind==="year"; };
            const byName = (a,b)=>a.name.localeCompare(b.name);
            const inGround = crops.filter(c=>sownDates[c.id]).sort(byName);
            const rest = crops.filter(c=>!sownDates[c.id]);
            const startNow = rest.filter(c=>ok(c) && isNow(c)).sort(byName);
            const later = rest.filter(c=>ok(c) && !isNow(c)).sort(byName);
            const notSuited = rest.filter(c=>!ok(c)).sort(byName);
            const Row = (c)=>{
              const s = status(c,loc), fit = suitability(c,loc), sa = sownDates[c.id];
              const p = (sa && !c.perennial) ? progressFor(c, sa) : null;
              const months = (sa && c.perennial) ? Math.floor((Date.now()-sa)/86400000/30) : 0;
              return (
                <div key={c.id} className="prow" onClick={()=>goCrop(c.id,"plot")} style={{ opacity:fit.ok?1:.6 }}>
                  <Glyph id={c.id} size={40}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div className="fr" style={{ fontSize:17, fontWeight:600, lineHeight:1.1 }}>{c.name}</div>
                    <div style={{ fontSize:12.5, color:"var(--muted)" }}>{c.type} · {c.perennial ? `${c.years} yr to fruit` : `~${c.maturity} days`}</div>
                    {notes[c.id] && <div style={{ fontSize:11.5, color:"var(--muted)", fontStyle:"italic", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>“{notes[c.id]}”</div>}
                  </div>
                  <div style={{ textAlign:"right" }}>
                    {fit.level==="unfit"
                      ? <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:700, color:"var(--t-danger)" }}><AlertTriangle size={12}/> {fit.short}</span>
                      : fit.level==="marginal"
                      ? <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:700, color:"var(--t-ochre)" }}><AlertTriangle size={12}/> {fit.short}</span>
                      : sa
                      ? (<div>
                           <div style={{ fontSize:11.5, fontWeight:700, color:"var(--clay)" }}>{c.perennial ? (months>=1?`${months}mo in`:"planted") : (p.done ? "ready" : `day ${p.days}`)}</div>
                           {!c.perennial && !p.done && <div className="mono" style={{ fontSize:9, color:"var(--muted)", letterSpacing:".03em" }}>{p.stage.toUpperCase()}</div>}
                         </div>)
                      : (s.kind==="now"||s.kind==="year")
                      ? <span style={{ fontSize:11.5, fontWeight:700, color:"var(--t-green)" }}>{c.perennial ? "plant now" : "sow now"}</span>
                      : <span className="mono" style={{ fontSize:11, color:"var(--muted)" }}>{MS[s.month]}</span>}
                  </div>
                  <button className="iconbtn" onClick={(e)=>{ e.stopPropagation(); toggleSave(c.id); }} aria-label="Remove">
                    <Trash2 size={16}/>
                  </button>
                </div>
              );
            };
            const Section = (title, arr)=> arr.length>0 ? (
              <div>
                <div className="label" style={{ margin:"22px 0 6px", display:"flex", alignItems:"baseline", gap:6 }}>{title} <span style={{ color:"var(--muted)", fontWeight:600 }}>({arr.length})</span></div>
                <div className="card" style={{ padding:"4px 16px" }}>{arr.map(Row)}</div>
              </div>
            ) : null;
            return (
              <div>
                {Section("In the ground", inGround)}
                {Section(loc.hemi==="EQ" ? "Ready to start" : "Sow or plant now", startNow)}
                {Section("Coming up", later)}
                {Section("Not suited to " + loc.city, notSuited)}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

/* ----------------------- year-at-a-glance ------------------------ */
function CalendarScreen({ loc, saved, sownDates={}, setScreen, goCrop }){
  const crops = CROPS.filter(c=>saved.includes(c.id));
  let sowCt=0, harCt=0;
  crops.forEach(c=>{
    if(!suitability(c,loc).ok) return;
    const s=status(c,loc); if(s.kind==="now"||s.kind==="year") sowCt++;
    if(loc.hemi!=="EQ" && harvestMonths(c,loc).includes(NOW)) harCt++;
  });
  const anyUnfit = crops.some(c=>suitability(c,loc).level==="unfit");
  const NAMECOL = 70;

  return (
    <div className="screen">
      <div style={{ padding:"4px 22px 0" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <h1 className="fr" style={{ fontSize:27, fontWeight:600, margin:0, letterSpacing:"-.02em" }}>Your Year</h1>
          <button className="chip" onClick={()=>setScreen("location")} style={{ display:"flex", alignItems:"center", gap:6 }}>
            <MapPin size={14} color="var(--clay)"/> {loc.city}
          </button>
        </div>
        {crops.length>0 && (
          <p className="mono" style={{ fontSize:12, color:"var(--muted)", margin:"8px 0 0", letterSpacing:".04em" }}>
            {MFULL[NOW].toUpperCase()} · {sowCt} TO SOW · {harCt} TO HARVEST
          </p>
        )}
      </div>

      {crops.length===0 ? (
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"40px 34px 120px" }}>
          <div style={{ width:78, height:78, borderRadius:"50%", background:"var(--card2)", border:"1px solid var(--line)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <CalendarDays size={32} color="var(--moss)"/>
          </div>
          <h2 className="fr" style={{ fontSize:21, fontWeight:600, margin:"20px 0 6px" }}>No crops to chart yet</h2>
          <p style={{ color:"var(--muted)", fontSize:14.5, margin:"0 0 22px", maxWidth:260 }}>
            Add a few crops and your whole growing year — sowing to harvest — will line up here, month by month.
          </p>
          <button className="btn-primary" style={{ width:"auto", padding:"14px 24px" }} onClick={()=>{ setScreen("list"); window.scrollTo(0,0); }}>
            <Compass size={18}/> Browse crops
          </button>
        </div>
      ) : (
        <div style={{ padding:"18px 18px 120px" }}>
          <div className="card" style={{ padding:"14px 14px 16px" }}>
            {/* month header */}
            <div style={{ display:"flex", gap:3, marginBottom:8, paddingLeft:NAMECOL }}>
              {MS.map((m,i)=>(
                <div key={i} style={{ flex:1, textAlign:"center", fontSize:10, fontWeight:i===NOW?700:500,
                  color:i===NOW?"var(--clay)":"var(--muted)", fontFamily:"'Space Mono', monospace" }}>{m}</div>
              ))}
            </div>
            {/* one row per crop */}
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {crops.map(c=>{
                const fit = suitability(c,loc);
                const sm = sowMonths(c,loc); const hm = harvestMonths(c,loc);
                const dim = fit.level==="unfit";
                const nameCol = dim ? "var(--t-danger)" : fit.level==="marginal" ? "var(--t-ochre)" : "var(--ink)";
                const sa = sownDates[c.id];
                const pp = (sa && !dim) ? (c.perennial ? perennialProgress(c,sa) : progressFor(c,sa)) : null;
                const ppct = pp ? (c.perennial ? pp.pos : pp.pct) : 0;
                return (
                  <div key={c.id} onClick={()=>goCrop(c.id,"calendar")} style={{ display:"flex", alignItems:"center", gap:0, cursor:"pointer" }}>
                    <div style={{ width:NAMECOL, flexShrink:0, paddingRight:6, overflow:"hidden" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <span style={{ flexShrink:0, opacity:dim?.5:1 }}><Glyph id={c.id} size={20}/></span>
                        <span className="fr" style={{ fontSize:11.5, fontWeight:600, color:nameCol, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.name}</span>
                      </div>
                      {pp && (
                        <div style={{ marginTop:3, height:3, borderRadius:3, background:"var(--line)", overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${Math.max(4,ppct)}%`, background:"var(--clay)", borderRadius:3 }} />
                        </div>
                      )}
                    </div>
                    <div style={{ flex:1, display:"flex", gap:3 }}>
                      {MS.map((m,i)=>{
                        const sow = !dim && sm.includes(i); const har = !dim && hm.includes(i); const isNow=i===NOW;
                        let bg="var(--card2)";
                        if(sow) bg="var(--clay)"; else if(har) bg=tint("#BE8E2C",.85);
                        return <div key={i} style={{ flex:1, height:18, borderRadius:4, background:bg,
                          border:isNow?"1.5px solid var(--ink)":"1px solid transparent", opacity:dim?.4:1 }} />;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* legend */}
          <div style={{ paddingLeft:4 }}>
            <CalendarLegend plantLabel="Sow / plant" />
          </div>
          {anyUnfit && <p className="mono" style={{ fontSize:10, color:"var(--muted)", marginTop:10, letterSpacing:".03em", paddingLeft:4 }}>Greyed rows aren't suited to {loc.city}'s climate.</p>}
          {loc.hemi==="S" && <p className="mono" style={{ fontSize:10, color:"var(--muted)", marginTop:6, letterSpacing:".03em", paddingLeft:4 }}>Calendar shifted for the southern hemisphere.</p>}
        </div>
      )}
    </div>
  );
}

/* =============================== APP ============================== */
function climateExplain(cl){
  const s = String(cl).toLowerCase();
  if(/mediterranean/.test(s)) return "Hot, dry summers and mild, wet winters. The summer drought means thirsty crops need watering, but the long warm season suits tomatoes, peppers and aubergines — and many cool-season crops grow happily through the mild winter.";
  if(/rainforest/.test(s)) return "Hot and wet nearly all year, with no real dry season and no frost. Growth is constant, so the challenges are humidity, fungal disease and heavy rain rather than cold.";
  if(/savanna/.test(s)) return "Hot all year with a distinct wet and dry season instead of a cold one. You plant to the rains — the wet season is your main growing window.";
  if(/highland/.test(s)) return "Up at altitude, so despite the latitude it stays mild and spring-like much of the year — warm days, cool nights. Hard frost is rare but possible on clear nights, and the gentle season is long.";
  if(/desert/.test(s)) return "Very dry, with hot days and big drops at night. Water is the limiting factor, not warmth — crops need regular irrigation and often some afternoon shade in peak heat.";
  if(/semi-arid/.test(s)) return "Dry — a little more rain than a true desert, but usually not enough, so expect to water. " + (/cold/.test(s) ? "Winters here are cold." : "Summers here are hot.");
  if(/oceanic|maritime/.test(s)) return "Mild and damp, moderated by the sea: cool summers, mild winters and rain spread through the year. Few extremes — excellent for leafy greens and cool-season crops, while heat-lovers may want the sunniest spot or a greenhouse.";
  if(/subtropical/.test(s)) return "Hot, humid summers and mild winters, with a long growing season and rarely a hard frost. Great for heat-loving crops, though the humidity can invite fungal problems.";
  if(/continental/.test(s)) return "Strongly seasonal: warm-to-hot summers and cold winters that usually freeze. A clear frost-free window drives the calendar — start tender crops indoors and move them out once frost has passed." + (/cold/.test(s) ? " Winters here are especially long and cold." : "");
  if(/tropical/.test(s)) return "Hot all year with no frost — the limit is the wet/dry cycle, not cold. You can grow more or less continuously, planting around the rains.";
  return "Your local climate pattern — it shapes how warm your seasons get and how harsh winter is, which the zone, season and growing-days figures break down further.";
}
function zoneExplain(z){
  const m = String(z).match(/^(\d+)\s*([ab])?/i);
  if(!m) return "A plant hardiness zone is a shorthand for how cold winters get. Near the equator there's no real cold season, so a number isn't very meaningful here — frost just isn't the limiting factor.";
  const n = +m[1], half = (m[2]||"").toLowerCase();
  const loF = n*10 - 70 + (half==="b" ? 5 : 0);
  const hiF = loF + (half ? 5 : 10);
  const c = (f)=> Math.round((f-32)*5/9);
  return `Zone ${z} on the USDA scale: your average coldest winter low is about ${loF}–${hiF}°F (${c(loF)} to ${c(hiF)}°C). Higher numbers mean milder winters. It mainly tells you which perennials and trees can survive your winter outdoors — and some fruit trees actually need a cold spell to crop.`;
}
function ConditionsCard({ loc }){
  const [sel, setSel] = useState(null);
  const stats = [
    { key:"zone", value:loc.zone, label:"Zone", color:"var(--clay)", title:"Hardiness zone", info: zoneExplain(loc.zone) },
    { key:"season", value:loc.season, label:"Season", color:"var(--ink)", title:"Growing season",
      info:`The frost-free stretch of the year in ${loc.city} — roughly ${loc.season}. Outside it, expect frosts that can damage or kill tender plants, so warm-season crops go out after it begins and should be harvested before it ends.` },
    { key:"len", value:loc.len, label:"Growing days", color:"var(--ink)", title:"Growing days",
      info:`Roughly how many frost-free days you get from the last spring frost to the first autumn frost (${loc.len}). It tells you whether slower crops have time to finish — a long season suits winter squash or melons, while a short one favours quick crops or starting seeds indoors.` },
  ];
  const climateItem = { key:"climate", title:loc.climate, info: climateExplain(loc.climate) };
  const cur = sel ? [climateItem, ...stats].find(x=>x.key===sel) : null;
  return (
    <div className="card rise" style={{ marginTop:16, padding:16, background:"var(--card2)" }}>
      <div className="label" style={{ marginBottom:9 }}>Your growing conditions</div>
      <div style={{ display:"flex", alignItems:"baseline", gap:8, flexWrap:"wrap" }}>
        <span className="fr" style={{ fontSize:22, fontWeight:600 }}>{loc.city}</span>
        <span onClick={()=>setSel(sel==="climate"?null:"climate")}
          style={{ fontSize:13.5, color: sel==="climate"?"var(--ink)":"var(--ink2)", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:4,
            borderBottom:`1px dashed ${sel==="climate"?"var(--clay)":"var(--line2)"}` }}>
          {loc.climate} <Info size={11} style={{ opacity:.5 }}/>
        </span>
      </div>
      <div className="hr" style={{ margin:"12px 0" }} />
      <div style={{ display:"flex", justifyContent:"space-between", textAlign:"center" }}>
        {stats.map((it,i)=>(
          <React.Fragment key={it.key}>
            {i>0 && <div style={{ width:1, background:"var(--line)" }} />}
            <div style={{ flex:1, cursor:"pointer", borderRadius:8, padding:"2px 2px 1px", background: sel===it.key ? tint("#1E342A",.05) : "transparent" }}
              onClick={()=>setSel(sel===it.key?null:it.key)}>
              <div className="mono" style={{ fontSize: it.key==="zone"?16:13.5, fontWeight:700, color:it.color }}>{it.value}</div>
              <div className="label" style={{ fontSize:9, display:"flex", alignItems:"center", justifyContent:"center", gap:3 }}>{it.label} <Info size={10} style={{ opacity:.5 }}/></div>
            </div>
          </React.Fragment>
        ))}
      </div>
      {cur && (
        <div style={{ marginTop:14, paddingTop:13, borderTop:"1px solid var(--line)", animation:"fade .25s ease both", display:"flex", gap:10, alignItems:"flex-start" }}>
          <div style={{ flex:1 }}>
            <div className="fr" style={{ fontSize:15, fontWeight:600, marginBottom:3 }}>{cur.title}</div>
            <p style={{ margin:0, fontSize:13, color:"var(--ink2)", lineHeight:1.5 }}>{cur.info}</p>
          </div>
          <button className="iconbtn" onClick={()=>setSel(null)} aria-label="Close" style={{ padding:4 }}><X size={15}/></button>
        </div>
      )}
    </div>
  );
}

/* options menu: backup, restore, change city, clear data */
function SettingsScreen({ onBack, counts, onExport, onRestore, onChangeCity, onAbout, theme, onTheme }){
  const fileRef = React.useRef(null);
  const [pending, setPending] = useState(null);
  const [err, setErr] = useState(null);
  const [done, setDone] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const pick = ()=>{ setErr(null); setDone(false); setPending(null); if(fileRef.current){ fileRef.current.value=""; fileRef.current.click(); } };
  const onFile = (e)=>{
    const f = e.target.files && e.target.files[0]; if(!f) return;
    const rd = new FileReader();
    rd.onload = ()=>{ try{ const v = validateBackup(JSON.parse(rd.result)); if(v.error) setErr(v.error); else setPending(v); }catch(ex){ setErr("That file isn't a Plot backup."); } };
    rd.onerror = ()=> setErr("Couldn't read that file.");
    rd.readAsText(f);
  };
  const Row = ({ icon:Icon, title, sub, onClick, danger })=>(
    <div className="sugg-row" onClick={onClick} style={ danger ? { color:"var(--t-danger)" } : undefined }>
      <Icon size={18} color={danger ? "var(--t-danger)" : "var(--clay)"}/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontWeight:600, fontSize:15, color: danger ? "var(--t-danger)" : "var(--ink)" }}>{title}</div>
        {sub && <div style={{ fontSize:12.5, color:"var(--muted)" }}>{sub}</div>}
      </div>
      <ChevronRight size={17} color="var(--muted)"/>
    </div>
  );
  const cs = counts||{};
  const here = [cs.crops+" crops", cs.dates+" sow dates", cs.notes+" notes", cs.photos+" photos", cs.harvests+" picks"].join(" · ");
  return (
    <div className="screen" style={{ padding:"6px 24px 120px" }}>
      <button onClick={onBack}
        style={{ display:"inline-flex", alignItems:"center", gap:5, border:0, background:"transparent", cursor:"pointer", fontFamily:"inherit", color:"var(--ink2)", fontSize:14, fontWeight:600, padding:"4px 0", marginBottom:6 }}>
        <ChevronLeft size={18}/> Back
      </button>
      <h1 className="fr" style={{ fontSize:30, fontWeight:600, letterSpacing:"-.02em", margin:"4px 0 8px" }}>Options</h1>

      <div className="label" style={{ margin:"14px 0 6px" }}>Back up</div>
      <div className="sugg" style={{ marginTop:0 }}>
        <Row icon={Download} title="Download backup" sub="Your city, crops, dates, notes, photos and harvest log — one file." onClick={onExport}/>
      </div>
      <p className="mono" style={{ fontSize:9.5, color:"var(--muted)", letterSpacing:".04em", margin:"7px 0 0" }}>ON THIS DEVICE NOW: {here.toUpperCase()}</p>

      <div className="label" style={{ margin:"20px 0 6px" }}>Restore</div>
      <div className="sugg" style={{ marginTop:0 }}>
        <Row icon={Upload} title="Restore from backup" sub="Open a Plot backup file from this or another device." onClick={pick}/>
      </div>
      {err && <p style={{ fontSize:13, color:"var(--t-danger)", margin:"8px 0 0", lineHeight:1.4 }}>{err}</p>}
      {done && <p style={{ fontSize:13, color:"var(--t-green)", fontWeight:600, margin:"8px 0 0" }}>Restored — your plot is back.</p>}
      {pending && (
        <div className="rise" style={{ marginTop:10, background:"var(--card)", border:"1px solid var(--line)", borderLeft:"3px solid var(--clay)", borderRadius:12, padding:"12px 14px" }}>
          <div className="fr" style={{ fontSize:15.5, fontWeight:600 }}>Backup{pending.exportedAt ? " from "+new Date(pending.exportedAt).toLocaleDateString(undefined,{ day:"numeric", month:"short", year:"numeric" }) : ""}</div>
          <p style={{ margin:"5px 0 0", fontSize:13, color:"var(--ink2)", lineHeight:1.5 }}>
            {pending.summary.crops} crops · {pending.summary.dates} sow dates · {pending.summary.notes} notes · {pending.summary.photos} photos · {pending.summary.harvests} picks{pending.summary.city ? " · city "+pending.summary.city : ""}.
            <b style={{ color:"var(--t-danger)" }}> Restoring replaces everything Plot currently holds on this device.</b>
          </p>
          <div style={{ display:"flex", gap:8, marginTop:11 }}>
            <button className="chip" onClick={()=>setPending(null)}>Cancel</button>
            <button className="chip on" style={{ background:"var(--t-dangerBg)", borderColor:"var(--t-dangerBg)" }}
              onClick={async ()=>{ const p=pending; setPending(null); await onRestore(p.data); setDone(true); }}>
              Replace my data
            </button>
          </div>
        </div>
      )}

      <div className="label" style={{ margin:"20px 0 6px" }}>Appearance</div>
      <div style={{ display:"flex", gap:4, background:"var(--paper2)", border:"1px solid var(--line2)", borderRadius:11, padding:4 }}>
        {[["auto","Auto",Settings],["light","Light",Sun],["dark","Dark",Moon]].map(([k,lab,Icon])=>(
          <button key={k} onClick={()=>onTheme && onTheme(k)} className="mono"
            style={{ flex:1, border:"none", borderRadius:8, padding:"8px 0", fontSize:11, letterSpacing:".04em", cursor:"pointer",
              background: theme===k ? "var(--ink)" : "transparent", color: theme===k ? "var(--paper)" : "var(--ink2)",
              display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6 }}>
            <Icon size={13}/> {lab.toUpperCase()}
          </button>
        ))}
      </div>
      <p className="mono" style={{ fontSize:9.5, color:"var(--muted)", letterSpacing:".04em", margin:"7px 0 0" }}>AUTO FOLLOWS YOUR PHONE'S LIGHT/DARK SETTING</p>

      <div className="label" style={{ margin:"20px 0 6px" }}>App</div>
      <div className="sugg" style={{ marginTop:0 }}>
        <Row icon={MapPin} title="Change growing city" onClick={onChangeCity}/>
        <Row icon={Info} title="About Plot" sub="How it works and what it can't know." onClick={onAbout}/>
        <Row icon={Trash2} danger title={confirmClear ? "Tap again to erase everything" : "Clear all data"} sub={confirmClear ? "Photos, dates, notes, harvests — gone for good." : "Start fresh on this device."}
          onClick={()=>{ if(confirmClear){ setConfirmClear(false); onRestore({ loc:null, saved:[], sownDates:{}, notes:{}, harvests:{}, photos:{} }, true); } else setConfirmClear(true); }}/>
      </div>
      <p style={{ fontSize:11.5, color:"var(--muted)", margin:"14px 0 0", lineHeight:1.5 }}>
        Backups include your photos, so the file can be a few MB. Keep one somewhere safe — Plot's data lives only on this device.
      </p>
      <input ref={fileRef} type="file" accept="application/json,.json" onChange={onFile} style={{ display:"none" }} />
    </div>
  );
}

function AppBar({ onAbout, onSettings }){
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 22px 4px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 21 V11" stroke="var(--moss)" strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M12 14 C 8 14 6.4 11 7 7.4 C 10.6 8 12 10.6 12 14 Z" fill="var(--moss)"/>
          <path d="M12 14 C 16 14 17.6 11 17 7.4 C 13.4 8 12 10.6 12 14 Z" fill="var(--moss)"/>
          <ellipse cx="12" cy="21" rx="4.4" ry="1.2" fill="var(--clay)"/>
        </svg>
        <span className="fr" style={{ fontSize:15, fontWeight:600, letterSpacing:"-.01em", color:"var(--ink)" }}>Plot</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:2 }}>
        <button className="iconbtn" onClick={onSettings} aria-label="Options" style={{ padding:4 }}><Settings size={17} color="var(--muted)"/></button>
        <button className="iconbtn" onClick={onAbout} aria-label="About Plot" style={{ padding:4 }}><Info size={17} color="var(--muted)"/></button>
      </div>
    </div>
  );
}

function WorldMap({ selectedId, onPick }){
  const REGIONS = [
    ["World","0 0 360 139"],
    ["Europe","168 20 54 30"],
    ["N. America","48 22 74 48"],
    ["S. America","96 70 50 69"],
    ["Africa","160 44 74 75"],
    ["Asia","218 22 112 58"],
    ["Oceania","288 90 72 42"],
  ];
  const COLOR = ["#5B8AA6","#4E8C8A","#5E8C4C","#C9972E","#C0563A"];
  const cc = (c)=> COLOR[Math.max(0, Math.min(4, c.tier))];
  const TIER_TXT = [
    "A cold climate with a short growing season and hard winter frosts.",
    "A cool temperate climate — a moderate season with real winter frost.",
    "A mild climate with a fairly long season and only light frost.",
    "A warm climate with a long season and little or no frost.",
    "A hot, near frost-free climate where many crops can grow year-round.",
  ];
  const warmthSummary = (c)=> TIER_TXT[Math.max(0,Math.min(4,c.tier))] + (c.hemi==="S" ? " Being in the southern hemisphere, its seasons run opposite the north." : c.hemi==="EQ" ? " Sitting near the equator, it sees little seasonal change." : "");
  const parseBox = (s)=>{ const a=s.split(" ").map(Number); return {x:a[0],y:a[1],w:a[2],h:a[3]}; };
  const [view, setView] = useState(parseBox(REGIONS[0][1]));
  const [focusId, setFocusId] = useState(selectedId || null);
  const cities = CITIES.filter(c=>CITY_LL[c.id]);
  const px = lon => lon + 180;
  const py = lat => 83 - Math.max(-56, Math.min(83, lat));
  const focus = cities.find(c=>c.id===focusId);

  const svgRef = React.useRef(null);
  const viewRef = React.useRef(view);
  const ptrs = React.useRef(null); if(ptrs.current===null) ptrs.current = new Map();
  const panLast = React.useRef(null);
  const pinch = React.useRef(null);
  const moved = React.useRef(false);
  const apply = (v)=>{ viewRef.current=v; setView(v); };

  const MAXW=450, MAXH=174, MINW=22;
  const clampSpan = (w,h)=>{ let k=1; if(w>MAXW) k=Math.min(k,MAXW/w); if(h>MAXH) k=Math.min(k,MAXH/h); if(w*k<MINW) k=MINW/w; return [w*k,h*k]; };
  const clampPos = (v)=>{ let {x,y,w,h}=v; x=(w<=360)?Math.min(360-w,Math.max(0,x)):(360-w)/2; y=(h<=139)?Math.min(139-h,Math.max(0,y)):(139-h)/2; return {x,y,w,h}; };
  const metrics = (r,v)=>{ const s=Math.min(r.width/v.w, r.height/v.h); return {s, ox:(r.width-v.w*s)/2, oy:(r.height-v.h*s)/2}; };
  const toUser = (cx,cy,r,v)=>{ const m=metrics(r,v); return {ux:v.x+(cx-r.left-m.ox)/m.s, uy:v.y+(cy-r.top-m.oy)/m.s}; };
  const zoomAround = (cx,cy,f)=>{
    const el=svgRef.current; if(!el) return; const r=el.getBoundingClientRect(); const v=viewRef.current;
    const u=toUser(cx,cy,r,v);
    const sp=clampSpan(v.w/f, v.h/f); const nw=sp[0], nh=sp[1];
    const m=metrics(r,{x:0,y:0,w:nw,h:nh});
    apply(clampPos({ x:u.ux-(cx-r.left-m.ox)/m.s, y:u.uy-(cy-r.top-m.oy)/m.s, w:nw, h:nh }));
  };
  const zoomCenter = (f)=>{ const el=svgRef.current; if(!el) return; const r=el.getBoundingClientRect(); zoomAround(r.left+r.width/2, r.top+r.height/2, f); };

  React.useEffect(()=>{
    const el=svgRef.current; if(!el) return;
    const onWheel=(e)=>{ e.preventDefault(); zoomAround(e.clientX, e.clientY, e.deltaY<0?1.15:1/1.15); };
    el.addEventListener("wheel", onWheel, {passive:false});
    const up=(e)=>{ ptrs.current.delete(e.pointerId); if(ptrs.current.size<2) pinch.current=null; if(ptrs.current.size===1){ const p=[...ptrs.current.values()][0]; panLast.current={x:p.x,y:p.y}; } if(ptrs.current.size===0) panLast.current=null; };
    window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    return ()=>{ el.removeEventListener("wheel", onWheel); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); };
  }, []);

  const onPointerDown=(e)=>{
    ptrs.current.set(e.pointerId, {x:e.clientX, y:e.clientY});
    moved.current=false;
    if(ptrs.current.size===1){ panLast.current={x:e.clientX, y:e.clientY}; pinch.current=null; }
    else if(ptrs.current.size===2){
      const el=svgRef.current; const r=el.getBoundingClientRect(); const v=viewRef.current;
      const p=[...ptrs.current.values()];
      const dist=Math.hypot(p[0].x-p[1].x, p[0].y-p[1].y)||1;
      pinch.current={ dist, midUser:toUser((p[0].x+p[1].x)/2,(p[0].y+p[1].y)/2,r,v), sv:v }; panLast.current=null;
    }
  };
  const onPointerMove=(e)=>{
    if(!ptrs.current.has(e.pointerId)) return;
    ptrs.current.set(e.pointerId, {x:e.clientX, y:e.clientY});
    const el=svgRef.current; if(!el) return; const r=el.getBoundingClientRect();
    if(ptrs.current.size>=2 && pinch.current){
      const p=[...ptrs.current.values()];
      const dist=Math.hypot(p[0].x-p[1].x, p[0].y-p[1].y)||1;
      const mx=(p[0].x+p[1].x)/2, my=(p[0].y+p[1].y)/2;
      const sp=clampSpan(pinch.current.sv.w/(dist/pinch.current.dist), pinch.current.sv.h/(dist/pinch.current.dist)); const nw=sp[0], nh=sp[1];
      const m=metrics(r,{x:0,y:0,w:nw,h:nh});
      moved.current=true;
      apply(clampPos({ x:pinch.current.midUser.ux-(mx-r.left-m.ox)/m.s, y:pinch.current.midUser.uy-(my-r.top-m.oy)/m.s, w:nw, h:nh }));
    } else if(ptrs.current.size===1 && panLast.current){
      const v=viewRef.current; const m=metrics(r,v);
      const ddx=e.clientX-panLast.current.x, ddy=e.clientY-panLast.current.y;
      if(Math.abs(ddx)+Math.abs(ddy)>3) moved.current=true;
      panLast.current={x:e.clientX, y:e.clientY};
      apply(clampPos({ x:v.x-ddx/m.s, y:v.y-ddy/m.s, w:v.w, h:v.h }));
    }
  };
  const onPointerUp=(e)=>{ ptrs.current.delete(e.pointerId); if(ptrs.current.size<2) pinch.current=null; if(ptrs.current.size===1){ const p=[...ptrs.current.values()][0]; panLast.current={x:p.x,y:p.y}; } if(ptrs.current.size===0) panLast.current=null; };

  const near=(b)=>Math.abs(view.x-b.x)<0.6&&Math.abs(view.y-b.y)<0.6&&Math.abs(view.w-b.w)<0.6&&Math.abs(view.h-b.h)<0.6;
  const vbw = view.w;
  const r = Math.max(0.7, vbw/360*2.2);
  const hit = r*2.8;
  const sw = Math.max(0.1, vbw/360*0.4);
  const vbStr = view.x+" "+view.y+" "+view.w+" "+view.h;
  return (
    <div>
      <div className="scrollx" style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:8 }}>
        {REGIONS.map(([name,box])=>{ const b=parseBox(box); return (
          <button key={name} className={"chip"+(near(b)?" on":"")} style={{ fontSize:12, padding:"5px 11px", whiteSpace:"nowrap" }} onClick={()=>apply(clampPos(b))}>{name}</button>
        );})}
      </div>
      <div style={{ position:"relative", border:"1px solid var(--line2)", borderRadius:14, overflow:"hidden", background:"var(--map-bg)" }}>
        <svg ref={svgRef} viewBox={vbStr} width="100%" preserveAspectRatio="xMidYMid meet"
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
          onDoubleClick={(e)=>zoomAround(e.clientX, e.clientY, 1.9)}
          style={{ display:"block", height:222, touchAction:"none", cursor:"grab", userSelect:"none" }}>
          <path d={WORLD_PATH} fill="var(--map-land)" stroke="var(--map-stroke)" strokeWidth={sw} fillRule="evenodd" />
          {cities.map(c=>{
            const x=px(CITY_LL[c.id][0]), y=py(CITY_LL[c.id][1]);
            const on = c.id===focusId, sel = c.id===selectedId, hi = on||sel;
            return (
              <g key={c.id} onClick={(e)=>{ e.stopPropagation(); if(moved.current) return; setFocusId(c.id); }} style={{ cursor:"pointer" }}>
                <circle cx={x} cy={y} r={hit} fill="transparent" />
                {hi && <circle cx={x} cy={y} r={r*2.9} fill="none" stroke="var(--ink)" strokeWidth={Math.max(0.18,r*0.26)} opacity="0.55" />}
                <circle cx={x} cy={y} r={hi?r*1.8:r} fill={cc(c)} stroke={hi?"var(--ink)":"#F2EAD7"} strokeWidth={Math.max(0.12,r*(hi?0.32:0.2))} />
              </g>
            );
          })}
        </svg>
        <div style={{ position:"absolute", right:8, bottom:8, display:"flex", flexDirection:"column", gap:6 }}>
          <button aria-label="Zoom in" onClick={()=>zoomCenter(1.6)} style={{ width:32, height:32, borderRadius:9, border:"1px solid var(--line)", background:"var(--card)", color:"var(--ink)", fontSize:20, fontWeight:600, lineHeight:0, cursor:"pointer", boxShadow:"0 1px 3px rgba(0,0,0,.14)" }}>+</button>
          <button aria-label="Zoom out" onClick={()=>zoomCenter(1/1.6)} style={{ width:32, height:32, borderRadius:9, border:"1px solid var(--line)", background:"var(--card)", color:"var(--ink)", fontSize:22, fontWeight:600, lineHeight:0, cursor:"pointer", boxShadow:"0 1px 3px rgba(0,0,0,.14)" }}>−</button>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, margin:"10px 0 0" }}>
        <span className="mono" style={{ fontSize:10, color:"var(--muted)", letterSpacing:".05em" }}>COOLER</span>
        <div style={{ display:"flex", width:118, height:8, borderRadius:5, overflow:"hidden", border:"1px solid var(--line2)" }}>
          {COLOR.map((col,i)=><div key={i} style={{ flex:1, background:col }} />)}
        </div>
        <span className="mono" style={{ fontSize:10, color:"var(--muted)", letterSpacing:".05em" }}>WARMER</span>
      </div>
      <p className="mono" style={{ fontSize:9.5, color:"var(--muted)", textAlign:"center", letterSpacing:".04em", margin:"5px 0 0" }}>PIN COLOUR = LOCAL GROWING WARMTH</p>
      <div style={{ marginTop:12, minHeight:52 }}>
        {focus ? (
          <div className="rise" style={{ background:"var(--card)", border:"1px solid var(--line)", borderRadius:12, padding:"12px 13px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:11 }}>
              <span style={{ width:15, height:15, borderRadius:"50%", background:cc(focus), flexShrink:0, boxShadow:"0 0 0 2px var(--paper), 0 0 0 3px rgba(0,0,0,.08)" }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div className="fr" style={{ fontSize:17, fontWeight:600, lineHeight:1.1 }}>{focus.city}</div>
                <div style={{ fontSize:12.5, color:"var(--muted)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{focus.country} · {focus.climate}</div>
              </div>
              <button className="btn" style={{ width:"auto", padding:"9px 16px", fontSize:14 }} onClick={()=>onPick(focus)}>Choose</button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, marginTop:11 }}>
              {[["Zone",focus.zone],["Season",focus.season],["Frost",focus.frost],["Growing days",focus.len]].map(([k,v])=>(
                <div key={k} style={{ background:"var(--paper2)", borderRadius:8, padding:"6px 9px" }}>
                  <div className="mono" style={{ fontSize:9, color:"var(--muted)", letterSpacing:".06em" }}>{k.toUpperCase()}</div>
                  <div className="fr" style={{ fontSize:13.5, fontWeight:600, color:"var(--ink)", lineHeight:1.15 }}>{v}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize:12.5, color:"var(--ink2)", margin:"10px 0 0", lineHeight:1.45 }}>{warmthSummary(focus)}</p>
          </div>
        ) : (
          <p style={{ textAlign:"center", color:"var(--muted)", fontSize:13, margin:"8px 0 0", lineHeight:1.4 }}>Tap a pin to see its climate and pick it. Pinch or scroll to zoom, drag to pan, or use the region buttons.</p>
        )}
      </div>
    </div>
  );
}

export default function PlotApp(){
  const [screen, setScreen] = useState("location");
  const [loc, setLoc] = useState(null);
  const [query, setQuery] = useState("");
  const [cropId, setCropId] = useState(null);
  const [dtab, setDtab] = useState("guide");
  const [filter, setFilter] = useState("all");
  const [cropQuery, setCropQuery] = useState("");
  const [hideUnfit, setHideUnfit] = useState(false);
  const [saved, setSaved] = useState([]);
  const [sownDates, setSownDates] = useState({});
  const [photos, setPhotos] = useState({});
  const [notes, setNotes] = useState({});
  const [harvests, setHarvests] = useState({});
  const [theme, setTheme] = useState("auto");
  const [sysDark, setSysDark] = useState(false);
  useEffect(()=>{
    if(typeof window==="undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSysDark(mq.matches);
    const fn = (e)=>setSysDark(e.matches);
    if(mq.addEventListener) mq.addEventListener("change", fn); else if(mq.addListener) mq.addListener(fn);
    return ()=>{ if(mq.removeEventListener) mq.removeEventListener("change", fn); else if(mq.removeListener) mq.removeListener(fn); };
  }, []);
  const isDark = theme==="dark" || (theme==="auto" && sysDark);
  const [loaded, setLoaded] = useState(false);
  const [back, setBack] = useState("list");
  const [locView, setLocView] = useState("map");
  const [locating, setLocating] = useState(false);

  // load saved plot from persistent storage once
  useEffect(()=>{
    let off=false;
    (async()=>{
      try{
        if(typeof window!=="undefined" && window.storage){
          try{ const r=await window.storage.get("plot:saved"); if(!off && r && r.value) setSaved(JSON.parse(r.value)); }catch(e){}
          try{ const r=await window.storage.get("plot:sownDates"); if(!off && r && r.value) setSownDates(JSON.parse(r.value)); }catch(e){}
          try{
            const ls = await window.storage.list("plot:photos:");
            const keys = ((ls && ls.keys) || []).filter(k=>String(k).indexOf("plot:photos:")===0);
            const acc = {};
            for(const k of keys){
              try{ const r = await window.storage.get(k); if(r && r.value) acc[k.slice(12)] = JSON.parse(r.value); }catch(e){}
            }
            if(!off && Object.keys(acc).length) setPhotos(acc);
          }catch(e){}
          try{ const r=await window.storage.get("plot:notes"); if(!off && r && r.value) setNotes(JSON.parse(r.value)); }catch(e){}
          try{ const r=await window.storage.get("plot:harvests"); if(!off && r && r.value) setHarvests(JSON.parse(r.value)); }catch(e){}
          try{
            const r=await window.storage.get("plot:loc");
            if(!off && r && r.value){ const c=CITIES.find(x=>x.id===r.value); if(c){ setLoc(c); setScreen(s=> s==="location" ? "list" : s); } }
          }catch(e){}
          try{ const r=await window.storage.get("plot:theme"); if(!off && r && r.value && ["auto","light","dark"].includes(r.value)) setTheme(r.value); }catch(e){}
        }
      }catch(e){}
      if(!off) setLoaded(true);
    })();
    return ()=>{ off=true; };
  }, []);
  // persist on change (after first load)
  useEffect(()=>{ if(!loaded) return; (async()=>{ try{ if(window.storage) await window.storage.set("plot:saved", JSON.stringify(saved)); }catch(e){} })(); }, [saved, loaded]);
  useEffect(()=>{ if(!loaded) return; (async()=>{ try{ if(window.storage) await window.storage.set("plot:sownDates", JSON.stringify(sownDates)); }catch(e){} })(); }, [sownDates, loaded]);
  /* notes save is debounced so typing doesn't hammer storage */
  useEffect(()=>{
    if(!loaded) return;
    const t=setTimeout(()=>{ (async()=>{ try{ if(window.storage) await window.storage.set("plot:notes", JSON.stringify(notes)); }catch(e){} })(); }, 600);
    return ()=>clearTimeout(t);
  }, [notes, loaded]);
  const setNote = (id, text)=> setNotes(n=>{ const m={...n}; if(text==="") delete m[id]; else m[id]=text; return m; });
  useEffect(()=>{ if(!loaded) return; (async()=>{ try{ if(window.storage) await window.storage.set("plot:harvests", JSON.stringify(harvests)); }catch(e){} })(); }, [harvests, loaded]);
  useEffect(()=>{ if(!loaded || !loc) return; (async()=>{ try{ if(window.storage) await window.storage.set("plot:loc", loc.id); }catch(e){} })(); }, [loc, loaded]);
  useEffect(()=>{ if(!loaded) return; (async()=>{ try{ if(window.storage) await window.storage.set("plot:theme", theme); }catch(e){} })(); }, [theme, loaded]);
  /* restore a backup (or wipe, when clearing): replace state + sync storage */
  const applyBackup = async (data, isClear)=>{
    setSaved(data.saved||[]); setSownDates(data.sownDates||{}); setNotes(data.notes||{});
    setHarvests(data.harvests||{}); setPhotos(data.photos||{});
    const city = data.loc ? CITIES.find(c=>c.id===data.loc) : null;
    setLoc(city||null); setWx(null);
    try{
      if(typeof window!=="undefined" && window.storage){
        const ls = await window.storage.list("plot:photos:");
        const keys = ((ls && ls.keys)||[]).filter(k=>String(k).indexOf("plot:photos:")===0);
        for(const k of keys){ const id=k.slice(12); if(!(data.photos||{})[id]){ try{ await window.storage.delete(k); }catch(e){} } }
        for(const id of Object.keys(data.photos||{})){ try{ await window.storage.set("plot:photos:"+id, JSON.stringify(data.photos[id])); }catch(e){} }
        if(!city){ try{ await window.storage.delete("plot:loc"); }catch(e){} }
      }
    }catch(e){}
    if(isClear || !city){ setScreen("location"); window.scrollTo(0,0); }
  };
  const addHarvest = (cropId, e)=> setHarvests(h=>{
    const id = Date.now().toString(36)+Math.random().toString(36).slice(2,6);
    const list = [...(h[cropId]||[]), { id, ts:e.ts, qty:e.qty, unit:e.unit }];
    return { ...h, [cropId]: list };
  });
  const deleteHarvest = (cropId, entryId)=> setHarvests(h=>{
    const list = (h[cropId]||[]).filter(x=>x.id!==entryId);
    const m = { ...h };
    if(list.length) m[cropId]=list; else delete m[cropId];
    return m;
  });

  const isSaved = (id)=> saved.includes(id);
  /* frost outlook: 7-day min temps from Open-Meteo for the chosen city, cached ~6h */
  const [wx, setWx] = useState(null);
  useEffect(()=>{
    if(!loc || !CITY_LL[loc.id]){ setWx(null); return; }
    if(loc.frost==="none"){ setWx({ locId:loc.id, skip:true }); return; }
    let off=false;
    (async()=>{
      const key="plot:wx:"+loc.id;
      try{
        if(typeof window!=="undefined" && window.storage){
          try{
            const r=await window.storage.get(key);
            if(r && r.value){ const c=JSON.parse(r.value); if(c && c.fetchedAt && Date.now()-c.fetchedAt < 6*3600000 && c.days){ if(!off) setWx(c); return; } }
          }catch(e){}
        }
        const ll=CITY_LL[loc.id];
        const res=await fetch("https://api.open-meteo.com/v1/forecast?latitude="+ll[1]+"&longitude="+ll[0]+"&daily=temperature_2m_min&timezone=auto&forecast_days=7");
        if(!res.ok) throw new Error("http "+res.status);
        const j=await res.json();
        const time=(j.daily&&j.daily.time)||[], mins=(j.daily&&j.daily.temperature_2m_min)||[];
        const days=time.map((d,i)=>({ date:d, tmin:mins[i] }));
        if(!days.length) throw new Error("empty forecast");
        const data={ locId:loc.id, fetchedAt:Date.now(), days };
        if(!off) setWx(data);
        try{ if(typeof window!=="undefined" && window.storage) await window.storage.set(key, JSON.stringify(data)); }catch(e){}
      }catch(e){ if(!off) setWx({ locId:loc.id, error:true }); }
    })();
    return ()=>{ off=true; };
  }, [loc]);
  const toggleSave = (id)=> setSaved(s=>{
    if(s.includes(id)){ setSownDates(d=>{ const n={...d}; delete n[id]; return n; }); return s.filter(x=>x!==id); }
    return [...s, id];
  });
  const setSown = (id, ts)=>{
    setSownDates(d=>{ const n={...d}; if(ts==null) delete n[id]; else n[id]=ts; return n; });
    if(ts!=null) setSaved(s=> s.includes(id) ? s : [...s, id]);
  };
  const setPhoto = async (cropId, stage, img)=>{
    const cur = { ...(photos[cropId]||{}) };
    if(img) cur[stage] = { img, ts: Date.now() }; else delete cur[stage];
    const np = { ...photos };
    if(Object.keys(cur).length) np[cropId]=cur; else delete np[cropId];
    setPhotos(np);
    try{
      if(typeof window!=="undefined" && window.storage){
        if(Object.keys(cur).length){
          const r = await window.storage.set("plot:photos:"+cropId, JSON.stringify(cur));
          if(r==null) return false;
        } else {
          await window.storage.delete("plot:photos:"+cropId);
        }
      }
      return true;
    }catch(e){ return false; }
  };

  const detectLocation = ()=>{
    if(typeof navigator==="undefined" || !navigator.geolocation){ setLocView("map"); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos)=>{
        const la = pos.coords.latitude, lo = pos.coords.longitude;
        let best=null, bd=Infinity;
        for(const c of CITIES){
          const ll = CITY_LL[c.id]; if(!ll) continue;
          const dLat=(la-ll[1])*Math.PI/180, dLon=(lo-ll[0])*Math.PI/180;
          const a=Math.sin(dLat/2)**2 + Math.cos(la*Math.PI/180)*Math.cos(ll[1]*Math.PI/180)*Math.sin(dLon/2)**2;
          const d=Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          if(d<bd){ bd=d; best=c; }
        }
        setLocating(false);
        if(best){ setLoc(best); setScreen("list"); }
      },
      ()=>{ setLocating(false); setLocView("map"); },
      { enableHighAccuracy:false, timeout:8000, maximumAge:600000 }
    );
  };

  const crop = CROPS.find(c=>c.id===cropId);

  const matches = CITIES.filter(c=>{
    const q = query.trim().toLowerCase();
    if(!q) return true;
    return c.city.toLowerCase().includes(q) || c.country.toLowerCase().includes(q);
  });

  const cq = cropQuery.trim().toLowerCase();
  const base = cq
    ? CROPS.filter(c=> c.name.toLowerCase().includes(cq) || c.latin.toLowerCase().includes(cq) || c.type.toLowerCase().includes(cq))
    : CROPS.filter(c=>{
        if(filter==="sownow"){ if(!suitability(c,loc).ok) return false; const s=status(c,loc); return s.kind==="now"||s.kind==="year"; }
        if(filter==="perennial") return !!c.perennial;
        if(filter==="pots") return !!POT_FRIENDLY[c.id];
        if(filter==="all") return true;
        return c.type.toLowerCase()===filter;
      });
  const fitRank = (c)=>{ const l=suitability(c,loc).level; return l==="fit"?0:l==="marginal"?1:2; };
  const sortedBase = [...base].sort((a,b)=> fitRank(a)-fitRank(b) || a.name.localeCompare(b.name));
  const unfitInView = (!cq) ? sortedBase.filter(c=>!suitability(c,loc).ok).length : 0;
  const list = (!cq && hideUnfit) ? sortedBase.filter(c=>suitability(c,loc).ok) : sortedBase;
  const suitedShown = list.filter(c=>suitability(c,loc).ok).length;

  const goCrop = (id, from="list")=>{ setCropId(id); setBack(from); setDtab(sownDates[id] ? "journal" : "guide"); setScreen("detail"); window.scrollTo(0,0); };

  return (
    <div className={"plot"+(isDark?" dark":"")}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="backdrop" />
      <div className="grain" />
      <div className="stage">
        <div className="app">
          {(screen==="list"||screen==="calendar"||screen==="plot") && <AppBar onAbout={()=>{ setBack(screen); setScreen("about"); window.scrollTo(0,0); }} onSettings={()=>{ setBack(screen); setScreen("settings"); window.scrollTo(0,0); }} />}

          {/* ============ LOCATION SCREEN ============ */}
          {screen==="location" && (
            <div className="screen" style={{ padding:"6px 24px 28px", justifyContent:"space-between" }}>
              <div>
                {/* decorative sprig */}
                <svg width="120" height="90" viewBox="0 0 120 90" style={{ position:"absolute", right:-6, top:30, opacity:.16 }}>
                  <path d="M60 88 60 18" fill="none" stroke="var(--ink)" strokeWidth="2"/>
                  <path d="M60 34c-10-12-26-13-36-9 2 12 14 20 36 20M60 50c10-12 26-13 36-9-2 12-14 20-36 20" fill="none" stroke="var(--ink)" strokeWidth="2"/>
                </svg>

                <div className="rise" style={{ animationDelay:".05s", marginTop:34, display:"flex", alignItems:"center", gap:8 }}>
                  <Sprout size={22} color="var(--moss)"/>
                  <span className="fr" style={{ fontSize:23, fontWeight:600, letterSpacing:"-.01em" }}>Plot</span>
                </div>

                <h1 className="fr rise" style={{ animationDelay:".15s", fontSize:38, lineHeight:1.05, margin:"30px 0 0", fontWeight:600, letterSpacing:"-.02em", maxWidth:300 }}>
                  Grow what your <span style={{ fontStyle:"italic", color:"var(--clay)" }}>ground</span> can grow.
                </h1>
                <p className="rise" style={{ animationDelay:".25s", color:"var(--ink2)", fontSize:15.5, margin:"16px 0 0", maxWidth:310 }}>
                  Tell us where you garden. We'll tune every crop's soil, water and timing to your local climate.
                </p>

                <div className="rise" style={{ animationDelay:".35s", marginTop:26 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12, gap:10 }}>
                    <div className="label" style={{ margin:0 }}>Where are you growing?</div>
                    <div style={{ display:"flex", gap:4, background:"var(--paper2)", border:"1px solid var(--line2)", borderRadius:10, padding:3, flexShrink:0 }}>
                      {[["map","Map",Compass],["search","Search",Search]].map(([k,lab,Icon])=>(
                        <button key={k} onClick={()=>setLocView(k)} className="mono" style={{ border:"none", borderRadius:8, padding:"6px 11px", fontSize:11, letterSpacing:".03em", cursor:"pointer", background:locView===k?"var(--ink)":"transparent", color:locView===k?"var(--paper)":"var(--ink2)", display:"inline-flex", alignItems:"center", gap:5 }}><Icon size={13}/> {lab.toUpperCase()}</button>
                      ))}
                    </div>
                  </div>

                  {locView==="map" ? (
                    <WorldMap key={loc?loc.id:"none"} selectedId={loc?loc.id:null} onPick={(c)=>{ setLoc(c); setScreen("list"); setQuery(""); }} />
                  ) : (
                  <>
                  <div style={{ position:"relative" }}>
                    <Search size={19} color="var(--muted)" style={{ position:"absolute", left:15, top:16 }} />
                    <input className="input" placeholder="Search your town or city"
                      value={query} onChange={e=>setQuery(e.target.value)} />
                    {query && <X size={18} color="var(--muted)" onClick={()=>setQuery("")}
                      style={{ position:"absolute", right:14, top:16, cursor:"pointer" }} />}
                  </div>

                  {(query.length>0) && (
                    <div className="sugg">
                      {matches.length===0 && <div className="sugg-row" style={{ cursor:"default", color:"var(--muted)" }}>No matching city yet — try a nearby larger city</div>}
                      {matches.slice(0,6).map(c=>(
                        <div key={c.id} className="sugg-row" onClick={()=>{ setLoc(c); setScreen("list"); setQuery(""); }}>
                          <MapPin size={17} color="var(--clay)"/>
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:600, fontSize:15 }}>{c.city}</div>
                            <div style={{ fontSize:12.5, color:"var(--muted)" }}>{c.country} · {c.climate}</div>
                          </div>
                          <ChevronRight size={17} color="var(--muted)"/>
                        </div>
                      ))}
                      {matches.length>6 && <div className="sugg-row" style={{ cursor:"default", color:"var(--muted)", fontSize:12.5 }}>+{matches.length-6} more — keep typing to narrow</div>}
                    </div>
                  )}

                  {!query && (
                    <>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:14 }}>
                        {CITIES.slice(0,8).map(c=>(
                          <button key={c.id} className="chip" onClick={()=>{ setLoc(c); setScreen("list"); }}>{c.city}</button>
                        ))}
                      </div>
                      <p className="mono" style={{ fontSize:10.5, color:"var(--muted)", marginTop:12, letterSpacing:".04em" }}>
                        {CITIES.length} cities across {new Set(CITIES.map(c=>c.country)).size} countries
                      </p>
                    </>
                  )}
                  </>
                  )}
                </div>
              </div>

              <button className="btn rise" disabled={locating} style={{ animationDelay:".45s", background:"transparent",
                color:"var(--ink2)", display:"flex", alignItems:"center", justifyContent:"center",
                gap:8, padding:"14px", fontSize:14.5, opacity:locating?0.65:1 }}
                onClick={detectLocation}>
                <MapPin size={17}/> {locating ? "Locating…" : "Use my current location"}
              </button>
            </div>
          )}

          {/* ============ CROP LIST SCREEN ============ */}
          {screen==="list" && loc && (
            <div className="screen">
              <div style={{ padding:"4px 22px 0" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <Sprout size={19} color="var(--moss)"/>
                    <span className="fr" style={{ fontSize:19, fontWeight:600 }}>Plot</span>
                  </div>
                  <button className="chip" onClick={()=>setScreen("location")} style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <MapPin size={14} color="var(--clay)"/> {loc.city}
                  </button>
                </div>

                {/* growing conditions banner */}
                <ConditionsCard loc={loc} />

                <h2 className="fr" style={{ fontSize:24, fontWeight:600, margin:"22px 0 4px", letterSpacing:"-.01em" }}>
                  What to grow in {MFULL[NOW]}
                </h2>
                <p style={{ fontSize:13.5, color:"var(--muted)", margin:"0 0 14px" }}>
                  {loc.hemi==="S" ? "Southern hemisphere — your seasons run opposite the north." :
                   loc.hemi==="EQ" ? "Near the equator — most crops sow any month." :
                   "Tuned to your frost dates and season length."}
                </p>

                {/* crop search */}
                <div style={{ position:"relative", marginBottom:12 }}>
                  <Search size={17} color="var(--muted)" style={{ position:"absolute", left:14, top:13 }} />
                  <input className="input" style={{ padding:"11px 14px 11px 42px", fontSize:15 }} placeholder="Search crops — name or type"
                    value={cropQuery} onChange={e=>setCropQuery(e.target.value)} />
                  {cropQuery && <X size={17} color="var(--muted)" onClick={()=>setCropQuery("")} style={{ position:"absolute", right:13, top:13, cursor:"pointer" }} />}
                </div>

                {/* filters (hidden while searching) */}
                {!cq && (
                  <>
                    <div className="scrollx" style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4 }}>
                      {[["all","All"],["sownow","Sow now"],["pots","Pots"],["perennial","Perennials"],["fruit","Fruit"],["vegetable","Vegetable"],["herb","Herb"],["tree","Trees"]].map(([k,l])=>(
                        <button key={k} className={"chip"+(filter===k?" on":"")} onClick={()=>setFilter(k)}>{l}</button>
                      ))}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, marginTop:10 }}>
                      <p className="mono" style={{ fontSize:11, color:"var(--muted)", letterSpacing:".04em", margin:0, flex:1, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {list.length} {list.length===1?"CROP":"CROPS"}{(!hideUnfit && suitedShown<list.length) ? ` · ${suitedShown} SUIT ${loc.city.toUpperCase()}` : ""}
                      </p>
                      {unfitInView>0 && (
                        <button className={"chip"+(hideUnfit?" on":"")} onClick={()=>setHideUnfit(v=>!v)} style={{ fontSize:11.5, padding:"5px 11px", flexShrink:0, whiteSpace:"nowrap" }}>
                          {hideUnfit ? "Showing all" : "Hide unsuited"}
                        </button>
                      )}
                    </div>
                  </>
                )}
                {cq && <p className="mono" style={{ fontSize:11, color:"var(--muted)", letterSpacing:".04em", margin:"2px 0 0" }}>{list.length} {list.length===1?"MATCH":"MATCHES"} FOR “{cropQuery.trim()}”</p>}
              </div>

              {/* packet grid */}
              <div style={{ padding:"14px 22px 110px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {list.map((c,i)=>{
                  const st = status(c,loc);
                  const fit = suitability(c,loc);
                  return (
                    <div key={c.id} className={"packet rise"+(fit.ok?"":" unfit")} style={{ animationDelay:`${i*0.06}s` }} onClick={()=>goCrop(c.id)}>
                      <div className="band" style={{ background:c.color }} />
                      <div style={{ padding:"12px 13px 14px", display:"flex", flexDirection:"column", flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                          <span className="tag" style={{ background:tint(c.color,.15), color:c.color }}>{c.type}</span>
                          {isSaved(c.id) && <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:20, height:20, borderRadius:"50%", background:"var(--moss)", color:"#FBF3E6" }}><Check size={13}/></span>}
                        </div>
                        <div style={{ display:"flex", justifyContent:"center", padding:"8px 0 6px" }}>
                          <Glyph id={c.id} size={50} />
                        </div>
                        <div className="fr" style={{ fontSize:18, fontWeight:600, lineHeight:1.1 }}>{c.name}</div>
                        <div style={{ marginTop:"auto", paddingTop:10, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                          <span className="mono" style={{ fontSize:11.5, fontWeight:700, color:"var(--ink2)", display:"inline-flex", alignItems:"center", gap:4 }}>{c.perennial ? `${c.years} yr` : `~${c.maturity}d`}{fit.level==="marginal" && <AlertTriangle size={11} color="var(--t-ochre)"/>}</span>
                          {fit.level==="unfit"
                            ? <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:10.5, fontWeight:700, color:"var(--t-danger)" }}><AlertTriangle size={12}/> {fit.short}</span>
                            : (st.kind==="now"||st.kind==="year")
                            ? <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:700, color:"var(--t-green)" }}><span style={{ width:7, height:7, borderRadius:"50%", background:"var(--moss)" }}/> {c.perennial ? "plant" : "sow"}</span>
                            : <span style={{ fontSize:11, fontWeight:600, color:"var(--muted)" }}>{MS[st.month]} →</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {list.length===0 && <p style={{ textAlign:"center", color:"var(--muted)", padding:"0 0 30px" }}>{cq ? `No crops match “${cropQuery.trim()}”.` : filter==="sownow" ? `Nothing to sow in ${loc.city} right now — check back next month.` : hideUnfit ? `No crops in this filter suit ${loc.city}. Tap “Showing all” to see them anyway.` : "No crops in this filter."}</p>}
            </div>
          )}

          {/* ============ CROP DETAIL SCREEN ============ */}
          {screen==="detail" && crop && loc && (
            <div className="screen">
              {/* header band */}
              <div style={{ background:tint(crop.color,.13), padding:"6px 22px 20px" }}>
                <button className="btn" onClick={()=>{ setScreen(back); window.scrollTo(0,0); }} style={{ background:"transparent",
                  display:"flex", alignItems:"center", gap:5, color:"var(--ink2)", fontSize:14, padding:"6px 0" }}>
                  <ChevronLeft size={18}/> {back==="plot" ? "My Plot" : back==="calendar" ? "Your Year" : "Crops"}
                </button>
                <div style={{ display:"flex", alignItems:"flex-end", gap:14, marginTop:6 }}>
                  <div style={{ background:"var(--paper)", borderRadius:18, padding:10, border:"1px solid var(--line)" }}>
                    <Glyph id={crop.id} size={58}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <span className="tag" style={{ background:tint(crop.color,.2), color:crop.color }}>{crop.type}</span>
                    <h1 className="fr" style={{ fontSize:30, fontWeight:600, margin:"6px 0 0", lineHeight:1, letterSpacing:"-.02em" }}>{crop.name}</h1>
                    <div className="fr" style={{ fontStyle:"italic", color:"var(--ink2)", fontSize:14, marginTop:2 }}>{crop.latin}</div>
                  </div>
                </div>
                <div style={{ marginTop:14 }}>
                  {(()=>{ const fit=suitability(crop,loc);
                    if(fit.level==="unfit") return <span className="warnbadge"><AlertTriangle size={14}/> Not suited to {loc.city}</span>;
                    if(fit.level==="marginal") return <span className="warnbadge amber"><AlertTriangle size={14}/> Short season in {loc.city}</span>;
                    return (
                      <div style={{ display:"flex", alignItems:"flex-start", gap:8, flexWrap:"wrap" }}>
                        <StatusBadge st={status(crop,loc)} perennial={crop.perennial} />
                        <SuccessionBadge crop={crop} />
                        <PotBadge crop={crop} />
                      </div>
                    );
                  })()}
                </div>
              </div>

              {suitability(crop,loc).level!=="fit" && (()=>{ const fit=suitability(crop,loc); const amber=fit.level==="marginal";
                const bd = amber ? "rgba(190,142,44,.3)" : "rgba(189,87,54,.3)";
                const bg = amber ? "rgba(190,142,44,.09)" : "rgba(189,87,54,.08)";
                const ic = amber ? "var(--t-ochre)" : "var(--t-danger)";
                return (
                <div style={{ padding:"0 22px", marginTop:-2 }}>
                  <div className="card" style={{ padding:14, background:bg, borderColor:bd, display:"flex", gap:10 }}>
                    <AlertTriangle size={18} color={ic} style={{ flexShrink:0, marginTop:1 }}/>
                    <div style={{ fontSize:13.5, color:"var(--ink)", lineHeight:1.45 }}>{fit.reason}</div>
                  </div>
                </div>
                ); })()}

              <div style={{ padding:"20px 22px 30px" }}>
                {/* time to first fruit / harvest hero */}
                {crop.perennial ? (
                  <>
                    <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                      <span className="fr" style={{ fontSize:46, fontWeight:600, color:"var(--clay)", lineHeight:1 }}>{crop.years}</span>
                      <span style={{ fontSize:15, color:"var(--ink2)", fontWeight:600 }}>years to first fruit</span>
                    </div>
                    <div style={{ fontSize:13, color:"var(--muted)", marginTop:3 }}>
                      Grown <b style={{ color:"var(--ink2)" }}>{crop.germ}</b>, then crops each year
                    </div>

                    <div className="label" style={{ margin:"22px 0 0" }}>The long game</div>
                    <PerennialTimeline crop={crop} sownAt={sownDates[crop.id]} />
                    <SowControl crop={crop} sownAt={sownDates[crop.id]} onSet={(ts)=>setSown(crop.id, ts)} loc={loc} />
                  </>
                ) : (
                  <>
                    <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                      <span className="fr" style={{ fontSize:46, fontWeight:600, color:"var(--clay)", lineHeight:1 }}>{crop.maturity}</span>
                      <span style={{ fontSize:15, color:"var(--ink2)", fontWeight:600 }}>days to first harvest</span>
                    </div>
                    <div style={{ fontSize:13, color:"var(--muted)", marginTop:3 }}>
                      {crop.germ.match(/\d/)
                        ? <>Germinates in <b style={{ color:"var(--ink2)" }}>{crop.germ} days</b> from sowing</>
                        : <>Grown <b style={{ color:"var(--ink2)" }}>{crop.germ}</b></>}
                    </div>

                    <div className="label" style={{ margin:"22px 0 0" }}>From seed to plate</div>
                    <Timeline crop={crop} sownAt={sownDates[crop.id]} />
                    <SowControl crop={crop} sownAt={sownDates[crop.id]} onSet={(ts)=>setSown(crop.id, ts)} loc={loc} />
                  </>
                )}

                {/* section tabs: split the long page into Guide / Care / Journal */}
                <div style={{ display:"flex", gap:4, background:"var(--paper2)", border:"1px solid var(--line2)", borderRadius:11, padding:4, marginTop:16 }}>
                  {[["guide","Guide"],["care","Care"],["journal","Journal"]].map(([k,lab])=>(
                    <button key={k} onClick={()=>setDtab(k)} className="mono"
                      style={{ flex:1, border:"none", borderRadius:8, padding:"8px 0", fontSize:11, letterSpacing:".05em", cursor:"pointer",
                        background: dtab===k ? "var(--ink)" : "transparent", color: dtab===k ? "var(--paper)" : "var(--ink2)" }}>
                      {lab.toUpperCase()}
                    </button>
                  ))}
                </div>

                {dtab==="journal" && <>
                <PhotoJournal crop={crop} sownAt={sownDates[crop.id]} shots={photos[crop.id]||{}}
                  onAdd={(st,img)=>setPhoto(crop.id,st,img)} onDelete={(st)=>setPhoto(crop.id,st,null)} />

                <HarvestCard crop={crop} sownAt={sownDates[crop.id]} entries={harvests[crop.id]||[]}
                  onAdd={(e)=>addHarvest(crop.id, e)} onDelete={(eid)=>deleteHarvest(crop.id, eid)} />

                <NotesCard crop={crop} value={notes[crop.id]} onChange={(t)=>setNote(crop.id, t)} />

                {!sownDates[crop.id] && (
                  <p style={{ fontSize:12.5, color:"var(--muted)", margin:"12px 2px 0", lineHeight:1.5 }}>
                    The photo journal and harvest log appear here once you've set a sow date above.
                  </p>
                )}
                </>}

                {dtab==="care" && <>
                <PickRow crop={crop} />

                <CompanionsCard crop={crop} onOpen={(id)=>goCrop(id, back)} />

                <ProblemsCard crop={crop} />
                </>}

                {dtab==="guide" && <>
                <SowingCard crop={crop} />

                {/* spec grid */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11, marginTop:12 }}>
                  <WaterSpec crop={crop} />
                  <SunSpec crop={crop} />
                  <SoilSpec crop={crop} />
                  <TempSpec crop={crop} />
                </div>

                {/* planting calendar for this location */}
                <div className="label" style={{ margin:"24px 0 4px" }}>Planting calendar · {loc.city}</div>
                <p style={{ fontSize:12.5, color:"var(--muted)", margin:"0 0 12px" }}>
                  {crop.perennial ? "When to plant, and the season a mature tree fruits." :
                   loc.hemi==="S" ? "Shifted for the southern hemisphere." : loc.hemi==="EQ" ? "Sow most of the year in this climate." : "Based on your zone and frost dates."}
                </p>
                {(()=>{
                  const sm = sowMonths(crop,loc); const hm = harvestMonths(crop,loc);
                  return (
                    <>
                      <div style={{ display:"flex", gap:4 }}>
                        {MS.map((m,i)=>{
                          const sow = sm.includes(i); const har = hm.includes(i); const isNow = i===NOW;
                          let bg="var(--card2)", col="var(--muted)";
                          if(sow){ bg="var(--clay)"; col="#FBF3E6"; }
                          else if(har){ bg=tint("#BE8E2C",.85); col="#fff"; }
                          return (
                            <div key={i} className="cell" style={{ background:bg, color:col,
                              border:isNow?"2px solid var(--ink)":"1px solid transparent", fontWeight:isNow?700:400 }}>{m}</div>
                          );
                        })}
                      </div>
                      <CalendarLegend plantLabel={crop.perennial ? "Plant" : "Sow"} />
                      {crop.perennial && <p className="mono" style={{ fontSize:10, color:"var(--muted)", marginTop:10, letterSpacing:".03em" }}>Harvest shown is for an established tree, not the year you plant.</p>}
                    </>
                  );
                })()}

                {/* note */}
                <div className="card" style={{ marginTop:22, padding:16, background:tint(crop.color,.07), borderColor:tint(crop.color,.25) }}>
                  <div className="label" style={{ marginBottom:7 }}>Notes for your plot</div>
                  <p className="fr" style={{ fontSize:15.5, lineHeight:1.5, margin:0, color:"var(--ink)" }}>{crop.note}</p>
                </div>
                </>}

                {isSaved(crop.id) ? (
                  <>
                    <button className="btn-primary" style={{ marginTop:18, background:"transparent", color:"var(--moss)", border:"1.5px solid var(--moss)", boxShadow:"none" }} onClick={()=>toggleSave(crop.id)}>
                      <Check size={18}/> In your plot · tap to remove
                    </button>
                    <button className="btn" onClick={()=>{ setScreen("plot"); window.scrollTo(0,0); }} style={{ background:"transparent", color:"var(--ink2)", width:"100%", padding:"12px", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:4 }}>
                      Go to My Plot <ArrowRight size={16}/>
                    </button>
                  </>
                ) : (
                  <button className="btn-primary" style={{ marginTop:18 }} onClick={()=>toggleSave(crop.id)}>
                    <Plus size={18}/> Add to my plot
                  </button>
                )}

                <p className="mono" style={{ fontSize:9.5, color:"var(--muted)", textAlign:"center", marginTop:18, letterSpacing:".04em" }}>
                  Sample data shown for layout — not horticultural advice
                </p>
              </div>
            </div>
          )}

          {/* ============ MY PLOT SCREEN ============ */}
          {screen==="plot" && loc && (
            <PlotScreen loc={loc} saved={saved} sownDates={sownDates} setScreen={setScreen} goCrop={goCrop} toggleSave={toggleSave} wx={wx} notes={notes} harvests={harvests} />
          )}

          {/* ============ YEAR CALENDAR SCREEN ============ */}
          {screen==="calendar" && loc && (
            <CalendarScreen loc={loc} saved={saved} sownDates={sownDates} setScreen={setScreen} goCrop={goCrop} />
          )}

          {/* ============ ABOUT SCREEN ============ */}
          {screen==="about" && (
            <div className="screen" style={{ padding:"6px 24px 120px" }}>
              <button onClick={()=>{ setScreen(back); window.scrollTo(0,0); }}
                style={{ display:"inline-flex", alignItems:"center", gap:5, border:0, background:"transparent", cursor:"pointer", fontFamily:"inherit", color:"var(--ink2)", fontSize:14, fontWeight:600, padding:"4px 0", marginBottom:6 }}>
                <ChevronLeft size={18}/> Back
              </button>
              <h1 className="fr" style={{ fontSize:30, fontWeight:600, letterSpacing:"-.02em", margin:"4px 0 8px" }}>About Plot</h1>
              <p style={{ fontSize:15, color:"var(--ink2)", lineHeight:1.55, margin:"0 0 20px" }}>
                Plot tunes what to grow, when to sow, and what to expect to your local climate — across {CROPS.length} fruit, vegetables, herbs and trees in {CITIES.length} cities worldwide.
              </p>

              <div className="label" style={{ margin:"0 0 6px" }}>How the timing works</div>
              <p style={{ fontSize:14, color:"var(--ink2)", lineHeight:1.6, margin:"0 0 16px" }}>
                When you choose a location, Plot reads three things about it: your <b style={{ color:"var(--ink)" }}>hardiness zone</b> (how cold winters get), your <b style={{ color:"var(--ink)" }}>frost-free season</b>, and roughly how many <b style={{ color:"var(--ink)" }}>growing days</b> that leaves you. Each crop's sow and harvest windows then come from its typical timing, flipped for your hemisphere and nudged by your season length. Whether a crop suits you at all is judged on two things — how much summer warmth it needs, and whether it needs, or can't survive, a cold winter.
              </p>

              <div className="label" style={{ margin:"0 0 6px" }}>Tracking your plot</div>
              <p style={{ fontSize:14, color:"var(--ink2)", lineHeight:1.6, margin:"0 0 4px" }}>
                Add crops to your plot and Plot works out each month's jobs. Note when you sowed something and its timeline tracks progress day by day — from sprout through to a "ready to harvest" nudge. Everything you save stays on your device, and the app works offline once loaded.
              </p>

              <div className="card" style={{ marginTop:20, padding:16, background:"var(--card)", borderLeft:"3px solid var(--clay)" }}>
                <div className="fr" style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>What it can't know</div>
                <p style={{ fontSize:13.5, color:"var(--ink2)", lineHeight:1.55, margin:0 }}>Plot is a starting point, not a soil test. A few honest limits worth keeping in mind:</p>
                <ul style={{ margin:"10px 0 0", paddingLeft:18, fontSize:13.5, color:"var(--ink2)", lineHeight:1.6 }}>
                  <li style={{ marginBottom:7 }}>The climate model is <b style={{ color:"var(--ink)" }}>coarse</b> — broad warmth and winter-cold bands, not true accumulated heat. A borderline crop is a "maybe", not a promise.</li>
                  <li style={{ marginBottom:7 }}>Dates are <b style={{ color:"var(--ink)" }}>typical, not guaranteed</b>. A cold spring, a heatwave, your seed variety, and your plot's own microclimate (a sunny wall, a frost pocket) can each shift things by weeks.</li>
                  <li style={{ marginBottom:7 }}>It works from a <b style={{ color:"var(--ink)" }}>fixed list of cities</b>, not a live map — so it reflects a regional climate, not your exact garden.</li>
                  <li>The hardiness zone uses the <b style={{ color:"var(--ink)" }}>USDA</b> scale; other countries rate winter-hardiness differently.</li>
                </ul>
                <p style={{ margin:"11px 0 0", fontSize:13.5, color:"var(--ink2)", lineHeight:1.55 }}>
                  When in doubt, trust what grows well in gardens near you — a good local nursery knows your patch better than any model can.
                </p>
              </div>

              <p style={{ margin:"22px 0 0", fontSize:12.5, color:"var(--muted)", textAlign:"center", lineHeight:1.5 }}>
                A guide, not a guarantee — your weather and your soil always have the final say.
              </p>
            </div>
          )}
          {screen==="settings" && (
            <SettingsScreen
              onBack={()=>{ setScreen(back); window.scrollTo(0,0); }}
              counts={{ crops:saved.length, dates:Object.keys(sownDates).length, notes:Object.keys(notes).length,
                photos:Object.values(photos).reduce((n,o)=>n+Object.keys(o||{}).length,0),
                harvests:Object.values(harvests).reduce((n,a)=>n+(Array.isArray(a)?a.length:0),0) }}
              onExport={()=>downloadText("plot-backup-"+new Date().toISOString().slice(0,10)+".json", JSON.stringify(makeBackup({ loc, saved, sownDates, notes, harvests, photos })))}
              onRestore={applyBackup}
              onChangeCity={()=>{ setScreen("location"); window.scrollTo(0,0); }}
              onAbout={()=>{ setScreen("about"); window.scrollTo(0,0); }}
              theme={theme} onTheme={setTheme}
            />
          )}
        </div>
      </div>

      {(screen==="list" || screen==="plot" || screen==="calendar" || screen==="about" || screen==="settings") && (
        <div className="navbar">
          <button className={"navtab"+(screen==="list"?" on":"")} onClick={()=>{ setScreen("list"); window.scrollTo(0,0); }}>
            <Compass size={17}/> <span>Discover</span>
          </button>
          <button className={"navtab"+(screen==="calendar"?" on":"")} onClick={()=>{ setScreen("calendar"); window.scrollTo(0,0); }}>
            <CalendarDays size={17}/> <span>Year</span>
          </button>
          <button className={"navtab"+(screen==="plot"?" on":"")} onClick={()=>{ setScreen("plot"); window.scrollTo(0,0); }}>
            <Sprout size={17}/> <span>Plot</span>
            {saved.length>0 && <span className="navcount">{saved.length}</span>}
          </button>
        </div>
      )}
    </div>
  );
}
