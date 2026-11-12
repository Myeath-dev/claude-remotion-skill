// Reel 9:16 — mini clase de coreano con gatos: 배 = barco / pera / barriga.
import React from "react";
import {
  AbsoluteFill, Audio, Easing, staticFile, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig,
} from "remotion";
import { Grain, Vignette } from "../components/Layers";

const K = {
  sea1: "#071a2b", sea2: "#0d3b52", text: "#f4f1ea", dim: "#9fb7c4",
  boat: "#ffb347", pear: "#b8e05a", belly: "#ff8fa3", eat: "#7fd8ff", hurt: "#c7a2ff",
  cat: "#f2a65a", catDark: "#d9823a", ink: "#3a2416",
  display: "'Space Grotesk', 'DejaVu Sans', sans-serif", ko: "'Noto Sans KR', 'WenQuanYi Zen Hei', sans-serif",
  out: Easing.bezier(0.16, 1, 0.3, 1),
  pop: { damping: 11, stiffness: 170, mass: 0.7 },
};

// scene lengths in seconds — frames derive from fps
const S = { hook: 2.6, word: 1.8, diEsto: 1.6, story: 2.1, final: 6.6, cta: 2.3 };
const WORDS = [
  { es: "Barco", ko: "배", ro: "be", c: K.boat, icon: "boat" },
  { es: "Pera", ko: "배", ro: "be", c: K.pear, icon: "pear" },
  { es: "Barriga", ko: "배", ro: "be", c: K.belly, icon: "belly" },
  { es: "Comer", ko: "먹다", ro: "mok-da", c: K.eat, icon: "eat" },
  { es: "Doler", ko: "아프다", ro: "a-pu-da", c: K.hurt, icon: "hurt" },
] as const;
const STORY = [
  { pre: "El gato sube a un ", hi: "barco", post: ".", ko: "고양이가 배에 탔어.", c: K.boat, icon: "boat" },
  { pre: "Se come una ", hi: "pera", post: ".", ko: "배를 먹었어.", c: K.pear, icon: "eat" },
  { pre: "¡Y le duele la ", hi: "barriga", post: "!", ko: "배가 아파!", c: K.belly, icon: "hurt" },
] as const;
const FINAL = [
  { ko: "배에서", ro: "be-e-so", es: "en el barco", c: K.boat, icon: "boat" },
  { ko: "배를 먹어서", ro: "be-rul mo-go-so", es: "comió pera y", c: K.pear, icon: "eat" },
  { ko: "배가 아파요", ro: "be-ga a-pa-yo", es: "le duele la barriga", c: K.belly, icon: "hurt" },
] as const;

export const CG_TOTAL_S =
  S.hook + WORDS.length * S.word + S.diEsto + STORY.length * S.story + S.final + S.cta;

// ---------- motion helpers ----------
const usePop = (delay = 0) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: K.pop });
};
const useExit = (dur: number) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const len = Math.round(fps * 0.2);
  return interpolate(f, [dur - len, dur], [1, 0], { easing: Easing.in(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};
const Pop: React.FC<{ delay?: number; dur: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ delay = 0, dur, style, children }) => {
  const p = usePop(delay); const q = useExit(dur);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", opacity: Math.min(1, p) * q,
      transform: `translateY(${(1 - p) * 40}px) scale(${0.85 + 0.15 * p})`, ...style }}>{children}</div>
  );
};

// ---------- cat mascot (SVG) ----------
type Mood = "happy" | "eat" | "hurt";
const CatHead: React.FC<{ mood: Mood; x: number; y: number; s: number }> = ({ mood, x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-58 -20L-50 -78L-14 -50Z" fill={K.cat} /><path d="M58 -20L50 -78L14 -50Z" fill={K.cat} />
    <path d="M-48 -32L-46 -64L-24 -48Z" fill="#ffc9b9" /><path d="M48 -32L46 -64L24 -48Z" fill="#ffc9b9" />
    <ellipse rx={66} ry={58} fill={K.cat} />
    <path d="M-14 -56q14 10 28 0M-8 -44q8 6 16 0" stroke={K.catDark} strokeWidth={6} fill="none" strokeLinecap="round" />
    <ellipse cx={-38} cy={18} rx={12} ry={8} fill={K.belly} opacity={0.6} /><ellipse cx={38} cy={18} rx={12} ry={8} fill={K.belly} opacity={0.6} />
    {mood === "hurt" ? <path d="M-30 -6l14 8-14 8M30 -6l-14 8 14 8" stroke={K.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
      : mood === "eat" ? <path d="M-32 0q10-12 20 0M12 0q10-12 20 0" stroke={K.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
      : <><circle cx={-22} r={9} fill={K.ink} /><circle cx={22} r={9} fill={K.ink} /><circle cx={-19} cy={-3} r={3} fill="#fff" /><circle cx={25} cy={-3} r={3} fill="#fff" /></>}
    <path d="M-6 12h12l-6 7z" fill="#e0607a" />
    {mood === "hurt" ? <path d="M-12 30q12-10 24 0" stroke={K.ink} strokeWidth={5} fill="none" strokeLinecap="round" />
      : mood === "eat" ? <ellipse cy={28} rx={12} ry={10} fill="#7a2e3a" />
      : <path d="M-12 22q6 8 12 0q6 8 12 0" stroke={K.ink} strokeWidth={5} fill="none" strokeLinecap="round" />}
    <path d="M-46 14h-30M-46 22l-28 8M46 14h30M46 22l28 8" stroke={K.ink} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
  </g>
);
const PearPath: React.FC = () => (<>
  <path d="M0 -60c-18 0-24 22-24 40-24 14-34 34-34 56 0 32 26 50 58 50s58-18 58-50c0-22-10-42-34-56 0-18-6-40-24-40z" fill={K.pear} />
  <path d="M0 -58q4-20 14-26" stroke="#7a5230" strokeWidth={8} fill="none" />
</>);
const Waves: React.FC = () => <path d="M10 178q20-12 40 0t40 0 40 0 40 0 40 0" stroke={K.eat} strokeWidth={8} fill="none" />;

const Icon: React.FC<{ kind: string; size: number; x: number; y: number; delay?: number }> = ({ kind, size, x, y, delay = 0 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const p = usePop(delay);
  const t = f / fps; // idle breathing
  const body: Record<string, React.ReactNode> = {
    cat: <CatHead mood="happy" x={100} y={110} s={1.3} />,
    boat: <><path d="M100 10v80" stroke={K.text} strokeWidth={6} /><path d="M104 14l46 60h-46z" fill={K.text} />
      <CatHead mood="happy" x={72} y={98} s={0.7} /><path d="M20 120h160l-24 40H44z" fill={K.boat} /><Waves /></>,
    pear: <g transform="translate(100 100)"><PearPath /></g>,
    belly: <><ellipse cx={100} cy={110} rx={70} ry={60} fill={K.cat} /><circle cx={100} cy={116} r={7} fill="#b4566a" /></>,
    eat: <><CatHead mood="eat" x={80} y={110} s={1} /><g transform="translate(160 120) scale(.5)"><PearPath /><circle cx={-50} cy={10} r={22} fill={K.sea1} /></g></>,
    hurt: <><CatHead mood="hurt" x={100} y={90} s={0.95} /><ellipse cx={100} cy={170} rx={46} ry={26} fill={K.cat} />
      <path d="M168 20l-14 26h18l-16 30" stroke={K.hurt} strokeWidth={9} fill="none" strokeLinejoin="round" />
      <path d="M28 30l10 22M18 66l20 6" stroke={K.hurt} strokeWidth={9} strokeLinecap="round" /></>,
  };
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={{ position: "absolute", left: x - size / 2,
      top: y - size / 2 + Math.sin(t * 2.4) * 10, opacity: Math.min(1, p),
      transform: `scale(${0.4 + 0.6 * p}) rotate(${Math.sin(t * 1.7) * 4}deg)` }}>{body[kind]}</svg>
  );
};

// ---------- text pieces ----------
const Title: React.FC<{ dur: number; top: number; size?: number; delay?: number; children: React.ReactNode }> = ({ dur, top, size = 92, delay = 0, children }) => (
  <Pop dur={dur} delay={delay} style={{ top, fontFamily: K.display, fontWeight: 800, fontSize: size, lineHeight: 1.05, textTransform: "uppercase", color: K.text }}>{children}</Pop>
);
const Romaji: React.FC<{ c: string; text: string; size?: number }> = ({ c, text, size = 46 }) => (
  <span style={{ display: "inline-block", border: `3px solid ${c}`, color: c, borderRadius: 22, padding: "6px 26px", fontSize: size, fontWeight: 700, fontFamily: K.display }}>{text}</span>
);
const KoBlock: React.FC<{ dur: number; top: number; delay: number; ko: string; ro: string; c: string }> = ({ dur, top, delay, ko, ro, c }) => (
  <Pop dur={dur} delay={delay} style={{ top }}>
    <div style={{ fontFamily: K.ko, fontWeight: 700, fontSize: 230, lineHeight: 1, color: c, textShadow: `0 0 60px ${c}55` }}>{ko}</div>
    <div style={{ marginTop: 22 }}><Romaji c={c} text={ro} /></div>
  </Pop>
);

// ---------- background ----------
const Sea: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const wave = (o: number, a: number) => {
    let d = `M0 ${o}`;
    for (let x = 0; x <= 1080; x += 40) d += ` L${x} ${o + Math.sin(x / 140 + t * 1.3 + a) * 22}`;
    return `${d} L1080 1920 L0 1920Z`;
  };
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, ${K.sea2}, ${K.sea1})` }}>
      <svg width={1080} height={1920}>
        <path d={wave(1560, 0)} fill="#0b2e44" /><path d={wave(1640, 2)} fill="#0a2638" /><path d={wave(1730, 4)} fill="#081f30" />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- scenes ----------
const Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const { fps } = useVideoConfig();
  return (<AbsoluteFill>
    <Title dur={dur} top={230} size={104}>¿Una palabra,<br /><span style={{ color: K.pear }}>tres cosas?</span></Title>
    <Pop dur={dur} delay={Math.round(fps * 0.4)} style={{ top: 500, fontFamily: K.ko, fontSize: 48, color: K.text }}>한 단어, 세 가지 뜻?</Pop>
    <KoBlock dur={dur} top={640} delay={Math.round(fps * 0.8)} ko="배" ro="be" c={K.text} />
    <Icon kind="cat" size={440} x={540} y={1320} delay={Math.round(fps * 1.1)} />
  </AbsoluteFill>);
};
const Word: React.FC<{ dur: number; i: number }> = ({ dur, i }) => {
  const { fps } = useVideoConfig(); const f = useCurrentFrame(); const w = WORDS[i];
  const bar = interpolate(f, [0, fps * 0.3], [0, 140], { easing: K.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (<AbsoluteFill>
    <Title dur={dur} top={240}>{w.es}</Title>
    <div style={{ position: "absolute", top: 350, left: 540 - bar / 2, width: bar, height: 6, borderRadius: 3, background: w.c }} />
    <KoBlock dur={dur} top={450} delay={Math.round(fps * 0.55)} ko={w.ko} ro={w.ro} c={w.c} />
    <Icon kind={w.icon} size={420} x={540} y={1260} delay={3} />
    <Pop dur={dur} style={{ top: 1640, fontSize: 38, color: K.dim, fontFamily: K.display }}>{i + 1} / {WORDS.length}</Pop>
  </AbsoluteFill>);
};
const DiEsto: React.FC<{ dur: number }> = ({ dur }) => (<AbsoluteFill>
  <Title dur={dur} top={600} size={130}>A ver,<br /><span style={{ color: K.eat }}>di esto.</span></Title>
  <Pop dur={dur} delay={9} style={{ top: 920, fontFamily: K.ko, fontSize: 48, color: K.text }}>자, 따라 해 봐.</Pop>
</AbsoluteFill>);
const Story: React.FC<{ dur: number; i: number }> = ({ dur, i }) => {
  const s = STORY[i];
  return (<AbsoluteFill>
    <Title dur={dur} top={250} size={84}>{s.pre}<span style={{ color: s.c }}>{s.hi}</span>{s.post}</Title>
    <Pop dur={dur} delay={9} style={{ top: 470, fontFamily: K.ko, fontSize: 52, color: s.c }}>{s.ko}</Pop>
    <Icon kind={s.icon} size={520} x={540} y={1050} delay={4} />
  </AbsoluteFill>);
};
const Final: React.FC<{ dur: number }> = ({ dur }) => {
  const { fps } = useVideoConfig(); const f = useCurrentFrame();
  const step = Math.round(fps * 1.7), start = Math.round(fps * 0.5);
  const act = Math.max(-1, Math.min(2, Math.floor((f - start) / step)));
  return (<AbsoluteFill>
    <Title dur={dur} top={200} size={78}>¡Ahora todo junto!</Title>
    {FINAL.map((l, k) => {
      const on = k <= act; const cur = k === act;
      return (
        <Pop key={k} dur={dur} delay={6 + k * 4} style={{ top: 480 + k * 300, opacity: on ? 1 : 0.35, transform: `scale(${cur ? 1.08 : 1})` }}>
          <div style={{ fontFamily: K.ko, fontWeight: 700, fontSize: 120, color: on ? l.c : K.text }}>{l.ko}</div>
          <Romaji c={on ? l.c : K.dim} text={l.ro} size={38} />
          <div style={{ fontFamily: K.display, fontSize: 36, color: K.dim, marginTop: 10 }}>{l.es}</div>
        </Pop>
      );
    })}
    {act >= 0 && (
      <Sequence from={start + act * step} key={act} layout="none">
        <Icon kind={FINAL[act].icon} size={300} x={540} y={1500} />
      </Sequence>
    )}
  </AbsoluteFill>);
};
const Cta: React.FC<{ dur: number }> = ({ dur }) => (<AbsoluteFill>
  <Title dur={dur + 30} top={560} size={110}>¿Lo dijiste<br />sin <span style={{ color: K.belly }}>trabarte?</span></Title>
  <Pop dur={dur + 30} delay={12} style={{ top: 900, fontFamily: K.display, fontSize: 56, color: K.text }}>Escríbelo en coreano ↓</Pop>
  <Pop dur={dur + 30} delay={21} style={{ top: 1020, fontFamily: K.ko, fontSize: 64, color: K.pear }}>배에서 배를 먹어서 배가 아파요</Pop>
  <Icon kind="boat" size={460} x={540} y={1420} delay={30} />
</AbsoluteFill>);

// ---------- composition ----------
export const CoreanoGatos: React.FC = () => {
  const { fps } = useVideoConfig();
  const F = (s: number) => Math.round(s * fps);
  const parts: { d: number; el: (d: number) => React.ReactNode }[] = [
    { d: F(S.hook), el: (d) => <Hook dur={d} /> },
    ...WORDS.map((_, i) => ({ d: F(S.word), el: (d: number) => <Word dur={d} i={i} /> })),
    { d: F(S.diEsto), el: (d) => <DiEsto dur={d} /> },
    ...STORY.map((_, i) => ({ d: F(S.story), el: (d: number) => <Story dur={d} i={i} /> })),
    { d: F(S.final), el: (d) => <Final dur={d} /> },
    { d: F(S.cta), el: (d) => <Cta dur={d} /> },
  ];
  let from = 0;
  return (
    <AbsoluteFill style={{ background: K.sea1 }}>
      <Sea />
      {parts.map((p, i) => { const at = from; from += p.d;
        return <Sequence key={i} from={at} durationInFrames={p.d}>{p.el(p.d)}</Sequence>; })}
      <Audio src={staticFile("coreano-gatos-voz.wav")} />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
