// Cartoon 9:16 mini-drama — "Vida en el internado", capítulo 1.
// Timing comes from timeline.json (generated from script.json + TTS durations).
import React from "react";
import {
  AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig,
} from "remotion";
import TL from "./timeline.json";
import TL2 from "./timeline-cap2.json";
import { Grain, Vignette } from "../components/Layers";
import { FashionCharacter } from "./Fashion";

// ---------------- theme ----------------
const D = {
  ink: "#1d1b2e", skin: "#ffd9b8", skinShade: "#f2b994", white: "#ffffff", blush: "#ff8fa3",
  font: "'Fredoka', 'DejaVu Sans', sans-serif",
  pop: { damping: 12, stiffness: 160, mass: 0.7 },
  soft: { damping: 20, stiffness: 90, mass: 1 },
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.83, 0, 0.17, 1),
};
type Who = "miki" | "ren" | "kai" | "hana" | "yui" | "mei";
type Mood = "happy" | "cold" | "angry" | "talk" | "nervous" | "laugh";
type Line = { who: string; text: string; mood?: string; fx?: string; start: number; dur: number; audio: string;
  with?: string; thought?: boolean; enter?: string[]; move?: Record<string, number>; pose?: Record<string, string>; moods?: Record<string, string> };
type Scene = { id: string; start: number; end: number; lines: Line[] };
const SCENES = TL.scenes as Scene[];
export const DRAMA_TOTAL_S: number = TL.total;
const SCENES2 = TL2.scenes as Scene[];
export const DRAMA2_TOTAL_S: number = TL2.total;

const CAST: Record<Who, { name: string; hair: string; top: string; pants: string; tag: string }> = {
  miki: { name: "Miki", hair: "#2b2340", top: "#ff7eb6", pants: "#3d3a5c", tag: "#ff7eb6" },
  ren: { name: "Ren", hair: "#24304f", top: "#3f6fd8", pants: "#23263a", tag: "#5b8cff" },
  kai: { name: "Kai", hair: "#d9622b", top: "#34b36b", pants: "#2f3b55", tag: "#34b36b" },
  hana: { name: "Hana", hair: "#b79cff", top: "#ffd23f", pants: "#4b4470", tag: "#b79cff" },
  yui: { name: "Yui", hair: "#7a4a2a", top: "#9b6bd6", pants: "#36324f", tag: "#9b6bd6" },
  mei: { name: "Mei", hair: "#1f1a1a", top: "#ef4b4b", pants: "#2e2a40", tag: "#ef4b4b" },
};

// ---------------- helpers ----------------
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, t: f / fps }; };
const activeLine = (lines: Line[], tAbs: number) =>
  lines.find((l) => tAbs >= l.start && tAbs < l.start + l.dur + 0.3);

// ---------------- character ----------------
const Hair: React.FC<{ who: Who; layer: "back" | "front" }> = ({ who, layer }) => {
  const c = CAST[who].hair; const s = { fill: c, stroke: D.ink, strokeWidth: 6, strokeLinejoin: "round" as const };
  if (who === "miki") return layer === "back"
    ? <><circle cx={52} cy={150} r={42} {...s} /><circle cx={248} cy={150} r={42} {...s} /><circle cx={150} cy={140} r={100} {...s} /></>
    : <><path d="M58 130 Q70 50 150 48 Q230 50 242 130 Q215 98 190 112 Q170 88 150 108 Q128 86 108 112 Q84 96 58 130Z" {...s} />
      <circle cx={70} cy={112} r={10} fill="#ffd23f" stroke={D.ink} strokeWidth={4} /></>;
  if (who === "ren") return layer === "back"
    ? <path d="M48 160 Q40 60 150 44 Q260 60 252 160 L232 120 L222 168 L200 110 L80 110 L72 168 L66 120Z" {...s} />
    : <path d="M54 136 Q66 52 150 46 Q240 54 250 128 Q230 112 214 130 Q200 96 170 98 L118 168 L122 102 Q90 108 54 136Z" {...s} />;
  if (who === "kai") return layer === "back"
    ? <>{[[70, 90], [110, 58], [150, 48], [190, 58], [230, 90], [252, 132], [48, 132]].map(([x, y], i) =>
        <circle key={i} cx={x} cy={y} r={40} {...s} />)}</>
    : <path d="M60 128 Q80 80 118 92 Q130 66 160 84 Q190 66 204 94 Q236 88 242 128 Q210 108 150 112 Q90 108 60 128Z" {...s} />;
  if (who === "hana") return layer === "back"
    ? <path d="M40 220 Q30 60 150 46 Q270 60 260 220 Q240 236 220 214 L80 214 Q60 236 40 220Z" {...s} />
    : <><path d="M56 140 Q64 56 150 50 Q236 56 244 140 Q200 104 150 120 Q100 104 56 140Z" {...s} />
      <path d="M206 92 l8 -18 l8 18 l18 2 l-14 12 l4 18 l-16 -10 l-16 10 l4 -18 l-14 -12z" fill="#ffd23f" stroke={D.ink} strokeWidth={4} /></>;
  if (who === "yui") return layer === "back"
    ? <path d="M44 300 Q24 60 150 46 Q276 60 256 300 Q150 320 44 300Z" {...s} />
    : <><path d="M58 138 Q66 58 150 52 Q234 58 242 138 Q150 90 58 138Z" {...s} />
      <path d="M62 112 Q150 50 238 112" stroke="#ffd23f" strokeWidth={14} fill="none" strokeLinecap="round" /></>;
  // mei
  return layer === "back"
    ? <><path d="M196 70 Q290 40 280 170 Q262 120 220 110Z" {...s} /><circle cx={150} cy={140} r={98} {...s} /></>
    : <><path d="M58 132 Q70 56 150 50 Q230 56 242 132 Q196 96 150 112 Q104 96 58 132Z" {...s} />
      <circle cx={206} cy={70} r={14} fill="#ffd23f" stroke={D.ink} strokeWidth={4} /></>;
};

const Face: React.FC<{ mood: Mood; talking: boolean; blink: boolean; mouthOpen: number }> = ({ mood, talking, blink, mouthOpen }) => {
  const k = { stroke: D.ink, strokeWidth: 6, strokeLinecap: "round" as const, fill: "none" };
  let eyes: React.ReactNode;
  if (blink) eyes = <><path d="M98 160h28" {...k} /><path d="M174 160h28" {...k} /></>;
  else if (mood === "happy" || mood === "laugh") eyes = <><path d="M96 166 Q112 146 128 166" {...k} /><path d="M172 166 Q188 146 204 166" {...k} /></>;
  else if (mood === "cold") eyes = <><ellipse cx={112} cy={166} rx={12} ry={8} fill={D.ink} /><ellipse cx={188} cy={166} rx={12} ry={8} fill={D.ink} />
    <path d="M96 158h32M172 158h32" {...k} /></>;
  else eyes = <><ellipse cx={112} cy={162} rx={13} ry={17} fill={D.ink} /><ellipse cx={188} cy={162} rx={13} ry={17} fill={D.ink} />
    <circle cx={117} cy={155} r={5} fill="#fff" /><circle cx={193} cy={155} r={5} fill="#fff" /></>;
  const brows = mood === "angry" ? <><path d="M94 132 L128 144" {...k} /><path d="M206 132 L172 144" {...k} /></>
    : mood === "nervous" ? <><path d="M96 140 L126 132" {...k} /><path d="M204 140 L174 132" {...k} /></>
    : mood === "cold" ? <><path d="M96 138h30M174 138h30" {...k} /></> : null;
  let mouth: React.ReactNode;
  if (talking) mouth = <ellipse cx={150} cy={206} rx={16 + mouthOpen * 6} ry={4 + mouthOpen * 14} fill="#7a2e3a" stroke={D.ink} strokeWidth={5} />;
  else if (mood === "laugh") mouth = <path d="M124 196 Q150 236 176 196Z" fill="#7a2e3a" stroke={D.ink} strokeWidth={5} strokeLinejoin="round" />;
  else if (mood === "happy" || mood === "talk") mouth = <path d="M130 200 Q150 218 170 200" {...k} />;
  else if (mood === "cold") mouth = <path d="M136 208h28" {...k} />;
  else if (mood === "angry") mouth = <path d="M132 212 Q150 198 168 212" {...k} />;
  else mouth = <path d="M130 208 q7-8 13 0 t13 0 t13 0" {...k} />;
  return (<>
    {eyes}{brows}{mouth}
    {(mood === "happy" || mood === "laugh") && <><ellipse cx={92} cy={192} rx={16} ry={9} fill={D.blush} opacity={0.7} /><ellipse cx={208} cy={192} rx={16} ry={9} fill={D.blush} opacity={0.7} /></>}
    {mood === "nervous" && <path d="M232 110 q12 20 0 30 q-12 -10 0 -30z" fill="#7fd8ff" stroke={D.ink} strokeWidth={4} />}
    {mood === "angry" && <path d="M216 86 l14 0 l0 -14 M236 72 l0 14 l14 0 M216 100 l14 0 l0 14 M236 114 l0 -14 l14 0" stroke="#ef4b4b" strokeWidth={6} fill="none" strokeLinecap="round" />}
  </>);
};

const Character: React.FC<{
  who: Who; x: number; y: number; scale?: number; mood: Mood; talking: boolean; flip?: boolean; enterDelay?: number;
}> = ({ who, x, y, scale = 1, mood, talking, flip, enterDelay = 0 }) => {
  const { f, fps, t } = useT(); const c = CAST[who];
  const enter = spring({ frame: f - enterDelay, fps, config: D.pop });
  const seed = who.length * 7 + who.charCodeAt(0);
  const blink = (f + seed * 13) % Math.round(fps * 3.2) < 4;
  const mouthOpen = talking ? 0.5 + 0.5 * Math.abs(Math.sin(t * 17 + seed)) : 0;
  const bounce = talking ? Math.abs(Math.sin(t * 8)) * 10 : Math.sin(t * 2 + seed) * 4; // idle breathing
  const laughShake = mood === "laugh" ? Math.sin(t * 30) * 3 : 0;
  const k = { stroke: D.ink, strokeWidth: 6, strokeLinejoin: "round" as const };
  const armSwing = talking ? Math.sin(t * 6) * 10 : Math.sin(t * 2 + seed) * 3;
  return (
    <svg viewBox="0 0 300 560" width={300 * scale} height={560 * scale} style={{
      position: "absolute", left: x - 150 * scale, top: y - 560 * scale + (1 - enter) * 120 - bounce, overflow: "visible",
      opacity: Math.min(1, enter), transform: `scaleX(${flip ? -1 : 1}) rotate(${laughShake}deg)`,
    }}>
      <ellipse cx={150} cy={552} rx={90} ry={12} fill="#000" opacity={0.18} />
      {/* legs */}
      <rect x={104} y={430} width={38} height={110} rx={14} fill={c.pants} {...k} />
      <rect x={158} y={430} width={38} height={110} rx={14} fill={c.pants} {...k} />
      <ellipse cx={118} cy={540} rx={30} ry={14} fill={D.ink} /><ellipse cx={182} cy={540} rx={30} ry={14} fill={D.ink} />
      {/* arms */}
      <g transform={`rotate(${12 + armSwing} 82 300)`}><rect x={56} y={290} width={40} height={140} rx={20} fill={c.top} {...k} /><circle cx={76} cy={438} r={20} fill={D.skin} {...k} /></g>
      <g transform={`rotate(${-12 - armSwing} 218 300)`}><rect x={204} y={290} width={40} height={140} rx={20} fill={c.top} {...k} /><circle cx={224} cy={438} r={20} fill={D.skin} {...k} /></g>
      {/* body */}
      <path d="M80 300 Q80 270 150 268 Q220 270 220 300 L228 446 Q150 462 72 446Z" fill={c.top} {...k} />
      {who === "kai" && <path d="M98 282 Q150 330 202 282" stroke={D.ink} strokeWidth={10} fill="none" />}
      {who === "ren" && <path d="M150 272 L150 450" stroke={D.ink} strokeWidth={5} />}
      <rect x={134} y={244} width={32} height={34} fill={D.skinShade} {...k} />
      {/* head */}
      <Hair who={who} layer="back" />
      <circle cx={150} cy={160} r={96} fill={D.skin} {...k} />
      <ellipse cx={56} cy={170} rx={14} ry={20} fill={D.skin} {...k} /><ellipse cx={244} cy={170} rx={14} ry={20} fill={D.skin} {...k} />
      <Face mood={mood} talking={talking} blink={blink} mouthOpen={mouthOpen} />
      <Hair who={who} layer="front" />
    </svg>
  );
};

// ---------------- speech bubble ----------------
const Bubble: React.FC<{ line: Line; speakerX: number; sceneStart: number }> = ({ line, speakerX, sceneStart }) => {
  const { f, fps, t } = useT(); const c = CAST[line.who as Who];
  const local = f - Math.round((line.start - sceneStart) * fps);
  const p = spring({ frame: local, fps, config: D.pop });
  const chars = Math.floor(interpolate(t - (line.start - sceneStart), [0, line.dur * 0.85], [0, line.text.length], clamp));
  const end = line.start - sceneStart + line.dur + 0.3;
  const out = interpolate(t, [end - 0.15, end], [1, 0], clamp);
  const tail = Math.max(120, Math.min(960, speakerX));
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 150, opacity: Math.min(1, p) * out,
      transform: `translateY(${(1 - p) * 30}px) scale(${0.9 + 0.1 * p})`, transformOrigin: `${tail - 60}px 100%` }}>
      <div style={{ position: "relative", background: line.thought ? "#fff0f6" : D.white, border: `6px ${line.thought ? "dashed" : "solid"} ${D.ink}`, borderRadius: line.thought ? 90 : 44, fontStyle: line.thought ? "italic" : "normal",
        padding: "48px 44px 40px", boxShadow: `0 10px 0 ${D.ink}` }}>
        <div style={{ position: "absolute", top: -32, left: 36, background: c.tag, color: D.white, border: `5px solid ${D.ink}`,
          borderRadius: 24, padding: "4px 26px", fontFamily: D.font, fontWeight: 800, fontSize: 40 }}>{line.with ? `${c.name} y ${CAST[line.with as Who].name}` : c.name}{line.thought ? " (piensa)" : ""}</div>
        <div style={{ fontFamily: D.font, fontSize: 56, fontWeight: 700, color: D.ink, lineHeight: 1.2, minHeight: 136 }}>
          {line.text.slice(0, chars)}<span style={{ opacity: 0 }}>{line.text.slice(chars)}</span>
        </div>
        <svg width={80} height={70} style={{ position: "absolute", bottom: -64, left: tail - 60 - 40, overflow: "visible" }}>
          <path d="M10 0 L40 60 L60 0" fill={D.white} stroke={D.ink} strokeWidth={6} strokeLinejoin="round" />
          <rect x={4} y={-10} width={62} height={12} fill={D.white} />
        </svg>
      </div>
    </div>
  );
};

// ---------------- backgrounds ----------------
const Floor: React.FC<{ y: number; color: string; line: string }> = ({ y, color, line }) => (<>
  <rect x={0} y={y} width={1080} height={1920 - y} fill={color} />
  {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M${i * 160 - 200} 1920 L${540 + (i - 3.5) * 60} ${y}`} stroke={line} strokeWidth={4} />)}
  <rect x={0} y={y - 10} width={1080} height={20} fill={D.ink} opacity={0.85} />
</>);
const Door: React.FC<{ x: number; y: number; num: string; color: string }> = ({ x, y, num, color }) => (<g>
  <rect x={x} y={y} width={220} height={420} rx={12} fill={color} stroke={D.ink} strokeWidth={8} />
  <rect x={x + 60} y={y + 40} width={100} height={60} rx={10} fill="#fff" stroke={D.ink} strokeWidth={6} />
  <text x={x + 110} y={y + 86} textAnchor="middle" fontFamily={D.font} fontWeight={800} fontSize={44} fill={D.ink}>{num}</text>
  <circle cx={x + 190} cy={y + 230} r={12} fill="#ffd23f" stroke={D.ink} strokeWidth={5} />
</g>);

const BoardBG: React.FC<{ highlight: number }> = ({ highlight }) => {
  const rows = ["01 · Toma, Rika, Leo", "02 · Nico, Aiko, Max", "07 · Miki, Ren, Kai, Hana", "08 · Yui, Shun, Taro", "09 · Mei, Sora, Bo"];
  return (<svg width={1080} height={1920} style={{ position: "absolute" }}>
    <rect width={1080} height={1920} fill="#ffe3b3" />
    <rect y={0} width={1080} height={120} fill="#ffcf85" />
    <Floor y={1420} color="#c98b5a" line="#b47a4c" />
    <g transform="translate(140 560)">
      <rect width={800} height={560} rx={20} fill="#c98b5a" stroke={D.ink} strokeWidth={10} />
      <rect x={30} y={30} width={740} height={500} rx={10} fill="#e8b98a" />
      <g transform="rotate(-2 400 280)">
        <rect x={110} y={60} width={580} height={440} fill="#fff" stroke={D.ink} strokeWidth={6} />
        <text x={400} y={120} textAnchor="middle" fontFamily={D.font} fontWeight={800} fontSize={40} fill={D.ink}>HABITACIONES</text>
        {rows.map((r, i) => (<g key={i}>
          {i === 2 && <rect x={134} y={150 + i * 64} width={532} height={52} rx={8} fill="#ffd23f" opacity={highlight} />}
          <text x={150} y={188 + i * 64} fontFamily={D.font} fontWeight={600} fontSize={34} fill={D.ink}>{r}</text>
        </g>))}
        <circle cx={400} cy={66} r={14} fill="#ef4b4b" stroke={D.ink} strokeWidth={5} />
      </g>
    </g>
  </svg>);
};
const HallBG: React.FC = () => (<svg width={1080} height={1920} style={{ position: "absolute" }}>
  <rect width={1080} height={1920} fill="#cdeaff" />
  <rect y={0} width={1080} height={120} fill="#a9d6f5" />
  <Door x={60} y={1000} num="08" color="#ff9fb8" /><Door x={420} y={1000} num="09" color="#9fe0b8" /><Door x={780} y={1000} num="10" color="#ffd27a" />
  <Floor y={1420} color="#8fb3d9" line="#7da1c8" />
</svg>);
const RoomBG: React.FC = () => (<svg width={1080} height={1920} style={{ position: "absolute" }}>
  <rect width={1080} height={1920} fill="#fff1d6" />
  <rect x={360} y={760} width={360} height={300} rx={16} fill="#9fdcff" stroke={D.ink} strokeWidth={10} />
  <path d="M540 760v300M360 910h360" stroke={D.ink} strokeWidth={8} />
  <circle cx={640} cy={830} r={30} fill="#ffe27a" />
  {[60, 790].map((x) => (<g key={x}>
    <rect x={x} y={860} width={230} height={560} fill="none" stroke={D.ink} strokeWidth={10} />
    <rect x={x} y={960} width={230} height={50} rx={10} fill="#ff9fb8" stroke={D.ink} strokeWidth={8} />
    <rect x={x} y={1240} width={230} height={50} rx={10} fill="#9fb8ff" stroke={D.ink} strokeWidth={8} />
  </g>))}
  <text x={540} y={700} textAnchor="middle" fontFamily={D.font} fontWeight={800} fontSize={60} fill={D.ink} opacity={0.25}>07</text>
  <Floor y={1420} color="#d8a06c" line="#c48f5e" />
  <rect x={330} y={1380} width={150} height={110} rx={14} fill="#ef4b4b" stroke={D.ink} strokeWidth={8} />
  <rect x={610} y={1390} width={130} height={100} rx={14} fill="#34b36b" stroke={D.ink} strokeWidth={8} />
</svg>);

// ---------------- effects ----------------
const IceCube: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const { f, fps } = useT(); const p = spring({ frame: f, fps, config: D.pop });
  return (<svg width={360} height={360} viewBox="0 0 200 200" style={{ position: "absolute", left: x - 180, top: y - 180, opacity: 0.85 * Math.min(1, p), transform: `scale(${p})` }}>
    <path d="M30 60 L100 30 L170 60 L170 150 L100 180 L30 150Z" fill="#bfefff" stroke={D.ink} strokeWidth={6} opacity={0.6} />
    <path d="M30 60 L100 90 L170 60 M100 90 V180" stroke={D.ink} strokeWidth={5} fill="none" opacity={0.6} />
    <path d="M50 70 L60 110" stroke="#fff" strokeWidth={10} strokeLinecap="round" />
  </svg>);
};

// ---------------- scene runner ----------------
const Hearts: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const { t } = useT();
  return (<>{[0, 1, 2, 3].map((i) => {
    const p = (t * 0.7 + i * 0.25) % 1;
    return <svg key={i} width={70} height={70} viewBox="0 0 40 40" style={{ position: "absolute", left: x - 35 + Math.sin(p * 9 + i) * 40 + (i - 1.5) * 30, top: y - p * 260, opacity: 1 - p, transform: `scale(${0.6 + p * 0.6})` }}>
      <path d="M20 36 C6 26 2 18 2 12 C2 6 7 2 12 2 C16 2 19 5 20 8 C21 5 24 2 28 2 C33 2 38 6 38 12 C38 18 34 26 20 36Z" fill="#ff5c8a" /></svg>;
  })}</>);
};
const Bonk: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const { t } = useT();
  return (<>{[0, 1, 2].map((i) => {
    const a = t * 4 + (i * Math.PI * 2) / 3;
    return <svg key={i} width={60} height={60} viewBox="0 0 40 40" style={{ position: "absolute", left: x - 30 + Math.cos(a) * 80, top: y - 30 + Math.sin(a) * 22 }}>
      <path d="M20 2 L24 15 L38 15 L27 23 L31 37 L20 29 L9 37 L13 23 L2 15 L16 15Z" fill="#ffd23f" stroke="#1d1b2e" strokeWidth={2.5} /></svg>;
  })}</>);
};

type Spot = { who: Who; x: number; flip?: boolean };
const DialogueScene: React.FC<{ scene: Scene; cast: Spot[]; bg: React.ReactNode; defaultMood?: Partial<Record<Who, Mood>>; size?: number }> = ({ scene, cast, bg, defaultMood = {}, size = 1.22 }) => {
  const { f, fps, t } = useT(); const tAbs = scene.start + t;
  const line = activeLine(scene.lines, tAbs);
  const ease = (from: number, to: number, at: number, d = 0.5) => interpolate(tAbs, [at, at + d], [from, to], { ...clamp, easing: D.inOut });
  // positions: base x, then each line's `move` slides the character there
  const posX = (c: Spot) => { let x = c.x;
    for (const l of scene.lines) if (l.move && l.move[c.who] !== undefined) x = ease(x, l.move[c.who], l.start + 0.1);
    return x; };
  // entrances: characters listed in a line's `enter` walk in from the right edge at that line
  const enterLine = (who: Who) => scene.lines.find((l) => l.enter?.includes(who));
  const enterOffset = (who: Who) => { const l = enterLine(who); return l ? ease(700, 0, l.start - 0.4, 0.7) : 0; };
  // poses: "fall" tilts the character to the floor, "stand" brings them back
  const tilt = (who: Who, flip?: boolean) => { let a = 0;
    for (const l of scene.lines) { const p = l.pose?.[who]; if (!p) continue;
      const target = p === "fall" ? (who === "ren" ? -4 : 6) : 0; a = ease(a, target, l.start + l.dur * 0.6, 0.35); }
    return a; };
  const spk = line ? cast.find((c) => c.who === line.who) : undefined;
  const target = spk ? (540 - posX(spk)) * 0.12 : 0;
  const fallShake = scene.lines.some((l) => l.pose && Object.values(l.pose).includes("fall") && Math.abs(tAbs - (l.start + l.dur * 0.6 + 0.35)) < 0.25) ? Math.sin(t * 90) * 14 : 0;
  const camX = interpolate(Math.sin(t * 0.6), [-1, 1], [-6, 6]) + target + fallShake;
  // legacy chapter-1 exits
  const exitAt = (fx: string) => { const l = scene.lines.find((x) => x.fx === fx); return l ? l.start + l.dur * 0.6 - scene.start : Infinity; };
  const exitX = (who: Who) => {
    const at = who === "ren" ? exitAt("exitRen") : who === "kai" ? exitAt("exitKai") : Infinity;
    if (!Number.isFinite(at)) return 0;
    return interpolate(t, [at, at + 0.8], [0, 900], { ...clamp, easing: D.inOut });
  };
  const lastSaid: Partial<Record<Who, Mood>> = {};
  for (const l of scene.lines) if (l.start <= tAbs && l.mood) { lastSaid[l.who as Who] = l.mood as Mood; if (l.with) lastSaid[l.with as Who] = l.mood as Mood; }
  for (const l of scene.lines) if (l.start <= tAbs && l.moods) for (const [w, m] of Object.entries(l.moods)) if (!scene.lines.some((k) => k.who === w && k.start > l.start && k.start <= tAbs)) lastSaid[w as Who] = m as Mood;
  const ending = scene.lines.length > 0 && tAbs > scene.lines[scene.lines.length - 1].start + 0.6;
  // close-up while anyone is in a "fall" pose
  const fallL = scene.lines.find((l) => l.pose && Object.values(l.pose).includes("fall"));
  const standL = scene.lines.find((l) => l.pose && Object.values(l.pose).includes("stand"));
  const zIn = fallL ? fallL.start + fallL.dur * 0.6 + 0.2 : Infinity;
  const zOut = standL ? standL.start + standL.dur * 0.5 : Infinity;
  const zoom = Number.isFinite(zIn) ? interpolate(tAbs, [zIn, zIn + 0.5, zOut, zOut + 0.5], [1, 2.1, 2.1, 1], { ...clamp, easing: D.inOut }) : 1;
  const focus = fallL ? Object.keys(fallL.pose!) : [];
  const xOf = (who: string) => { const c = cast.find((k) => k.who === who); return c ? posX(c) + enterOffset(c.who) : 540; };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${focus.length ? focus.reduce((a, w) => a + xOf(w), 0) / focus.length : 540}px ${1760 - 860 * size}px` }}>
      <AbsoluteFill style={{ transform: `translateX(${camX}px) scale(1.03)` }}>{bg}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${camX * 1.6}px)` }}>
        {cast.map((c, i) => {
          const el = enterLine(c.who); if (el && tAbs < el.start - 0.4) return null;
          const talking = !!line && (line.who === c.who || line.with === c.who) && !line.thought && tAbs < line.start + line.dur;
          let mood: Mood = lastSaid[c.who] ?? defaultMood[c.who] ?? "talk";
          if (ending && (c.who === "miki" || c.who === "hana") && scene.id === "room") mood = "laugh";
          return <FashionCharacter key={c.who} who={c.who} x={posX(c) + enterOffset(c.who) + exitX(c.who)} y={1760} scale={size} mood={mood} talking={talking} flip={c.flip} enterDelay={el ? Math.round((el.start - 0.4 - scene.start) * fps) : i * 5} tilt={tilt(c.who, c.flip)} />;
        })}
        {line?.fx === "ice" && <Sequence from={Math.round((line.start - scene.start) * fps)} layout="none"><IceCube x={cast.find((c) => c.who === "ren")!.x} y={1760 - 790 * size} /></Sequence>}
        {line?.fx === "hearts" && <Hearts x={xOf(line.who)} y={1760 - 760 * size} />}
        {line?.fx === "bonk" && <Bonk x={xOf(line.who)} y={1760 - 900 * size} />}
      </AbsoluteFill>
      </AbsoluteFill>
      {scene.lines.map((l, i) => (
        <Sequence key={i} from={Math.round((l.start - scene.start) * fps)} durationInFrames={Math.round((l.dur + 0.35) * fps)} layout="none">
          <Bubble line={l} speakerX={xOf(l.who) + camX * 1.6} sceneStart={l.start} />
        </Sequence>
      ))}
      {scene.lines.map((l, i) => (
        <Sequence key={`a${i}`} from={Math.round((l.start - scene.start) * fps)} layout="none"><Audio src={staticFile(l.audio)} /></Sequence>
      ))}
      {/* scene wipe-in */}
      <AbsoluteFill style={{ background: D.ink, transform: `translateX(${interpolate(f, [0, fps * 0.4], [0, 1080], { ...clamp, easing: D.inOut })}px)` }} />
    </AbsoluteFill>
  );
};

const TitleCard: React.FC<{ scene: Scene; top: string; big: string; sub: string; showNarr: boolean }> = ({ scene, top, big, sub, showNarr }) => {
  const { f, fps, t } = useT();
  const a = spring({ frame: f - 4, fps, config: D.pop }); const b = spring({ frame: f - 12, fps, config: D.pop });
  return (<AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #ffd27a, #ff9a6b)" }}>
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M540 860 L${540 + Math.cos(i / 14 * 6.283 + t * 0.2) * 1600} ${860 + Math.sin(i / 14 * 6.283 + t * 0.2) * 1600} L${540 + Math.cos((i + 0.5) / 14 * 6.283 + t * 0.2) * 1600} ${860 + Math.sin((i + 0.5) / 14 * 6.283 + t * 0.2) * 1600}Z`} fill="#fff" opacity={0.12} />)}
      <g transform={`translate(540 ${1500 + (1 - b) * 300})`}>
        <rect x={-300} y={-260} width={600} height={360} fill="#fff6e6" stroke={D.ink} strokeWidth={10} />
        <path d="M-340 -260 L0 -440 L340 -260Z" fill="#ef4b4b" stroke={D.ink} strokeWidth={10} strokeLinejoin="round" />
        {[-200, -60, 80, 200].map((x) => <rect key={x} x={x - 40} y={-200} width={70} height={80} fill="#9fdcff" stroke={D.ink} strokeWidth={6} />)}
        <rect x={-50} y={-20} width={100} height={120} fill="#c98b5a" stroke={D.ink} strokeWidth={8} />
      </g>
    </svg>
    <div style={{ position: "absolute", top: 420, left: 0, right: 0, textAlign: "center", fontFamily: D.font, color: D.ink,
      opacity: Math.min(1, a), transform: `translateY(${(1 - a) * 40}px) rotate(${Math.sin(t * 2) * 1.2}deg)` }}>
      <div style={{ fontSize: 58, fontWeight: 700 }}>{top}</div>
      <div style={{ fontSize: Math.min(132, 1350 / big.length), fontWeight: 800, lineHeight: 1, color: "#fff", WebkitTextStroke: `6px ${D.ink}`, textShadow: `0 10px 0 ${D.ink}`, marginTop: 20 }}>{big}</div>
      <div style={{ display: "inline-block", marginTop: 40, background: D.ink, color: "#ffd23f", borderRadius: 30, padding: "10px 36px", fontSize: 50, fontWeight: 700 }}>{sub}</div>
    </div>
    {showNarr && scene.lines.map((l, i) => (
      <Sequence key={i} from={Math.round((l.start - scene.start) * fps)} layout="none">
        <Audio src={staticFile(l.audio)} />
        <div style={{ position: "absolute", top: 960, left: 80, right: 80, textAlign: "center", fontFamily: D.font, fontSize: 46, fontWeight: 600, color: D.ink, opacity: Math.min(1, spring({ frame: f - Math.round((l.start - scene.start) * fps), fps, config: D.soft })) }}>{l.text}</div>
      </Sequence>
    ))}
  </AbsoluteFill>);
};

const BoardScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const { f, fps } = useT();
  const hl = interpolate(f, [fps * 0.4, fps * 0.8], [0, 1], clamp) * (0.6 + 0.4 * Math.sin(f / 4));
  return <DialogueScene scene={scene} bg={<BoardBG highlight={hl} />} defaultMood={{ ren: "cold", kai: "happy" }}
    cast={[{ who: "miki", x: 220 }, { who: "ren", x: 540 }, { who: "kai", x: 860, flip: true }]} />;
};

export const Internado: React.FC = () => {
  const { fps } = useVideoConfig();
  const F = (s: number) => Math.round(s * fps);
  const by = (id: string) => SCENES.find((s) => s.id === id)!;
  const seq = (id: string, el: React.ReactNode) => { const s = by(id); return <Sequence key={id} from={F(s.start)} durationInFrames={F(s.end - s.start)}>{el}</Sequence>; };
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      {seq("title", <TitleCard scene={by("title")} top="Capítulo 1" big="Vida en el internado" sub="Ingreso" showNarr />)}
      {seq("board", <BoardScene scene={by("board")} />)}
      {seq("hall", <DialogueScene scene={by("hall")} bg={<HallBG />} defaultMood={{ hana: "nervous" }}
        cast={[{ who: "mei", x: 220 }, { who: "hana", x: 540 }, { who: "yui", x: 860, flip: true }]} />)}
      {seq("room", <DialogueScene scene={by("room")} bg={<RoomBG />} defaultMood={{ ren: "cold" }}
        cast={[{ who: "hana", x: 190 }, { who: "miki", x: 430 }, { who: "kai", x: 670, flip: true }, { who: "ren", x: 900, flip: true }]} size={1.12} />)}
      {seq("end", <TitleCard scene={by("end")} top="Vida en el internado" big="Continuará..." sub="Capítulo 2 pronto" showNarr={false} />)}
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};

export const Internado2: React.FC = () => {
  const { fps } = useVideoConfig();
  const F = (s: number) => Math.round(s * fps);
  const by = (id: string) => SCENES2.find((s) => s.id === id)!;
  const seq = (id: string, el: React.ReactNode) => { const s = by(id); return <Sequence key={id} from={F(s.start)} durationInFrames={F(s.end - s.start)}>{el}</Sequence>; };
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      {seq("title", <TitleCard scene={by("title")} top="Capítulo 2" big="Conociéndonos" sub="Parte 1" showNarr />)}
      {seq("talk", <DialogueScene scene={by("talk")} bg={<RoomBG />} cast={[{ who: "hana", x: 330 }, { who: "miki", x: 750, flip: true }]} size={1.22} />)}
      {seq("back", <DialogueScene scene={by("back")} bg={<RoomBG />} defaultMood={{ ren: "cold" }}
        cast={[{ who: "hana", x: 200 }, { who: "miki", x: 420 }, { who: "kai", x: 660, flip: true }, { who: "ren", x: 890, flip: true }]} size={1.12} />)}
      {seq("end", <TitleCard scene={by("end")} top="Vida en el internado" big="Continuará..." sub="Capítulo 3 pronto" showNarr={false} />)}
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
