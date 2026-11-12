// Tall, fashion-illustration style characters (flat colour + soft shading, no outlines).
import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export type Who = "miki" | "ren" | "kai" | "hana" | "yui" | "mei";
export type Mood = "happy" | "cold" | "angry" | "talk" | "nervous" | "laugh" | "sad" | "blush";

type Look = {
  skin: string; hair: string; hairStyle: "messy" | "swept" | "bun" | "bob" | "pony" | "waves";
  shirt: string; stripes?: string; jacket?: string; jacketLong?: boolean;
  bottom: "pants" | "shorts" | "skirt"; bottomColor: string; legs?: string;
  shoes: string; boots?: boolean; bow?: string; scarf?: string; beanie?: string;
};
export const LOOKS: Record<Who, Look> = {
  miki: { skin: "#f6d3b8", hair: "#3a2a2a", hairStyle: "bun", shirt: "#3a3550", stripes: "#c9475a", jacket: "#4f7a3a", jacketLong: true,
    bottom: "shorts", bottomColor: "#3c5a8a", legs: "#2d2a38", shoes: "#6b3f26", boots: true },
  ren: { skin: "#efc9a8", hair: "#22232b", hairStyle: "swept", shirt: "#4d6e94", jacket: undefined,
    bottom: "pants", bottomColor: "#26262e", shoes: "#4a3227" },
  kai: { skin: "#f3c6a0", hair: "#b8572e", hairStyle: "messy", shirt: "#2f8c84", jacket: "#9a5a2e",
    bottom: "pants", bottomColor: "#2f4a74", shoes: "#a8283a", boots: true },
  hana: { skin: "#f8dcc6", hair: "#a98fd6", hairStyle: "waves", shirt: "#f7c6d9", jacket: "#fff4ea",
    bottom: "skirt", bottomColor: "#e48fb4", shoes: "#c9566a", bow: "#ff6f9f" },
  yui: { skin: "#e8b48f", hair: "#5a3a26", hairStyle: "pony", shirt: "#9fb4c4", jacket: "#2f4c5c",
    bottom: "skirt", bottomColor: "#c9d6dc", legs: "#253a48", shoes: "#8a5a36", boots: true, scarf: "#5fc6cf" },
  mei: { skin: "#f5d0b5", hair: "#2a1d1d", hairStyle: "bob", shirt: "#f2c641", jacket: "#e6e3de",
    bottom: "skirt", bottomColor: "#f2c641", shoes: "#e0a63a" },
};

const shade = "rgba(20,15,40,0.18)";

const HairBack: React.FC<{ l: Look }> = ({ l }) => {
  const c = l.hair;
  switch (l.hairStyle) {
    case "bun": return <><circle cx={150} cy={52} r={26} fill={c} /><ellipse cx={150} cy={104} rx={50} ry={58} fill={c} /></>;
    case "bob": return <path d="M96 100 Q96 44 150 44 Q204 44 204 100 L208 170 Q180 178 168 160 L132 160 Q120 178 92 170Z" fill={c} />;
    case "waves": return <path d="M92 100 Q92 40 150 40 Q208 40 208 100 Q222 150 206 196 Q214 214 196 222 Q170 210 166 170 L134 170 Q130 210 104 222 Q86 214 94 196 Q78 150 92 100Z" fill={c} />;
    case "pony": return <><ellipse cx={150} cy={102} rx={50} ry={58} fill={c} /><path d="M188 90 Q236 120 222 240 Q212 300 196 320 Q206 250 190 160Z" fill={c} /></>;
    default: return <ellipse cx={150} cy={100} rx={49} ry={56} fill={c} />;
  }
};
const HairFront: React.FC<{ l: Look }> = ({ l }) => {
  const c = l.hair;
  switch (l.hairStyle) {
    case "messy": return <path d="M100 104 Q96 50 140 46 Q150 30 168 44 Q196 42 202 70 Q214 84 202 104 Q190 82 176 88 Q170 72 152 82 Q140 70 128 86 Q112 80 100 104Z" fill={c} />;
    case "swept": return <path d="M100 100 Q98 48 150 44 Q200 46 202 96 Q190 70 160 74 Q172 92 166 116 Q150 84 120 80 Q108 86 100 100Z" fill={c} />;
    case "bun": return <path d="M102 96 Q108 56 150 54 Q192 56 198 96 Q170 76 150 84 Q128 76 102 96Z" fill={c} />;
    case "bob": return <path d="M100 104 Q104 52 150 50 Q196 52 200 104 Q176 80 150 82 Q124 80 100 104Z" fill={c} />;
    case "waves": return <path d="M98 108 Q100 50 150 48 Q200 50 202 108 Q186 78 160 76 Q140 90 116 84 Q104 92 98 108Z" fill={c} />;
    default: return <path d="M100 100 Q104 52 150 50 Q196 52 200 100 Q178 78 150 82 Q122 78 100 100Z" fill={c} />;
  }
};

const IRIS: Record<Who, string> = { miki: "#3b2a22", ren: "#1e2333", kai: "#3f7a52", hana: "#6a4fa8", yui: "#5a3a26", mei: "#2e2420" };
const GIRL: Record<Who, boolean> = { miki: true, ren: false, kai: false, hana: true, yui: true, mei: true };
const Eye: React.FC<{ cx: number; iris: string; girl: boolean; look: number; side: -1 | 1 }> = ({ cx, iris, girl, look, side }) => (<g>
  <path d={`M${cx - 9} 114 Q${cx} 104 ${cx + 9} 114 Q${cx} 121 ${cx - 9} 114Z`} fill="#fff" />
  <circle cx={cx + look} cy={113.5} r={4.6} fill={iris} />
  <circle cx={cx + look} cy={113.5} r={2.2} fill="#120c14" />
  <circle cx={cx + look + 1.6} cy={111.6} r={1.3} fill="#fff" />
  <path d={`M${cx - 10} 114 Q${cx} 102 ${cx + 10} 113`} stroke="#2a2030" strokeWidth={girl ? 3.4 : 2.6} fill="none" strokeLinecap="round" />
  {girl && <path d={`M${cx + side * 9} 112 l${side * 5} -4 M${cx + side * 6} 108.5 l${side * 3.5} -4.5`} stroke="#2a2030" strokeWidth={2} strokeLinecap="round" />}
  <path d={`M${cx - 7} 119.5 Q${cx} 122 ${cx + 7} 119.5`} stroke="rgba(120,70,60,.35)" strokeWidth={1.5} fill="none" />
</g>);

const Face: React.FC<{ who: Who; mood: Mood; talking: boolean; blink: boolean; open: number; look: number; brow: string }> = ({ who, mood, talking, blink, open, look, brow }) => {
  const ink = "#2a2030"; const girl = GIRL[who]; const iris = IRIS[who];
  const k = { stroke: ink, strokeWidth: 3, strokeLinecap: "round" as const, fill: "none" };
  const eyes = blink ? <><path d="M125 115 Q134 119 143 115M157 115 Q166 119 175 115" {...k} /></>
    : mood === "happy" || mood === "laugh" ? <><path d="M125 117 Q134 107 143 117" {...k} /><path d="M157 117 Q166 107 175 117" {...k} /></>
    : mood === "cold" ? <><Eye cx={134} iris={iris} girl={girl} look={look} side={-1} /><Eye cx={166} iris={iris} girl={girl} look={look} side={1} />
        <path d="M124 110 Q134 107 144 110 L144 113 L124 113Z M156 110 Q166 107 176 110 L176 113 L156 113Z" fill={LOOKS[who].skin} />
        <path d="M124 112h20M156 112h20" {...k} strokeWidth={2.6} /></>
    : <><Eye cx={134} iris={iris} girl={girl} look={look} side={-1} /><Eye cx={166} iris={iris} girl={girl} look={look} side={1} /></>;
  const bk = { stroke: brow, strokeWidth: 4, strokeLinecap: "round" as const, fill: "none" };
  const brows = mood === "angry" ? <path d="M123 97 L143 104M177 97 L157 104" {...bk} />
    : mood === "nervous" || mood === "sad" || mood === "blush" ? <path d="M124 102 L143 96M176 102 L157 96" {...bk} />
    : mood === "cold" ? <path d="M124 101 L144 100M156 100 L176 101" {...bk} />
    : <path d="M124 100 Q134 94 144 99M156 99 Q166 94 176 100" {...bk} />;
  const lip = girl ? "#c9566a" : "#a85a5a";
  const mouth = talking ? <><path d={`M${142 - open * 2} 141 Q150 ${139 + open * 12} ${158 + open * 2} 141 Q150 137 ${142 - open * 2} 141Z`} fill="#7a2c38" />
        <path d={`M${144 - open} 141.5 Q150 ${141 + open * 4} ${156 + open} 141.5`} stroke="#fff" strokeWidth={2} fill="none" opacity={0.8} /></>
    : mood === "laugh" ? <><path d="M137 138 Q150 156 163 138Z" fill="#7a2c38" /><path d="M140 139h20" stroke="#fff" strokeWidth={3} /></>
    : mood === "happy" || mood === "talk" ? <path d="M139 139 Q150 148 161 139" stroke={lip} strokeWidth={3.4} fill="none" strokeLinecap="round" />
    : mood === "angry" ? <path d="M140 145 Q150 139 160 145" stroke={lip} strokeWidth={3.4} fill="none" strokeLinecap="round" />
    : mood === "nervous" || mood === "blush" ? <path d="M139 143 q5.5-4 11 0 t11 0" stroke={lip} strokeWidth={3} fill="none" strokeLinecap="round" />
    : mood === "sad" ? <path d="M141 146 Q150 140 159 146" stroke={lip} strokeWidth={3.2} fill="none" strokeLinecap="round" />
    : <path d="M142 142 Q150 144 158 142" stroke={lip} strokeWidth={3.2} fill="none" strokeLinecap="round" />;
  return (<>
    <ellipse cx={124} cy={132} rx={11} ry={6} fill="#ff8fa3" opacity={mood === "blush" ? 0.95 : mood === "happy" || mood === "laugh" ? 0.5 : 0.22} />
    <ellipse cx={176} cy={132} rx={11} ry={6} fill="#ff8fa3" opacity={mood === "blush" ? 0.95 : mood === "happy" || mood === "laugh" ? 0.5 : 0.22} />
    {mood === "blush" && <path d="M116 128 l6 -6 M124 130 l6 -6 M170 128 l6 -6 M178 130 l6 -6" stroke="#e0607a" strokeWidth={2} />}
    {eyes}{brows}
    <path d="M151 116 Q147 128 149 131 Q152 133 156 131" stroke="rgba(130,70,50,.5)" strokeWidth={2.4} fill="none" strokeLinecap="round" />
    {girl && !talking && mood !== "laugh" && <path d="M143 146 Q150 149 157 146" stroke={lip} strokeWidth={2} fill="none" opacity={0.5} />}
    {mouth}
    {mood === "sad" && <path d="M128 122 q3 8 0 12 q-3 -4 0 -12z" fill="#8fd3ff" opacity={0.8} />}
    {mood === "nervous" && <path d="M194 84 q7 12 0 18 q-7 -6 0 -18z" fill="#8fd3ff" />}
    {mood === "angry" && <path d="M188 70 l8 0 l0 -8 M200 62 l0 8 l8 0 M188 78 l8 0 l0 8 M200 86 l0 -8 l8 0" stroke="#e04848" strokeWidth={3.5} fill="none" strokeLinecap="round" />}
  </>);
};

const Arm: React.FC<{ side: -1 | 1; sleeve: string; skin: string; up: number; swing: number }> = ({ side, sleeve, skin, up, swing }) => {
  const sx = 150 + side * 54;
  // up: 0 = relaxed, 1 = gesturing forearm raised
  const upper = -side * (6 + up * 22) + swing;
  const fore = side * up * 75;
  return (
    <g transform={`rotate(${upper} ${sx} 202)`}>
      <rect x={sx - 15} y={196} width={30} height={176} rx={15} fill={sleeve} />
      <rect x={sx + (side > 0 ? 2 : -15)} y={196} width={13} height={176} rx={6} fill={shade} />
      <g transform={`rotate(${fore} ${sx} 362)`}>
        <rect x={sx - 13} y={356} width={26} height={150} rx={13} fill={sleeve} />
        <rect x={sx - 10} y={490} width={20} height={14} fill={skin} />
        <ellipse cx={sx} cy={516} rx={12} ry={16} fill={skin} />
      </g>
    </g>
  );
};

export const FashionCharacter: React.FC<{
  who: Who; x: number; y: number; scale?: number; mood: Mood; talking: boolean; flip?: boolean; enterDelay?: number; tilt?: number;
}> = ({ who, x, y, scale = 1, mood, talking, flip, enterDelay = 0, tilt = 0 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const l = LOOKS[who];
  const enter = spring({ frame: f - enterDelay, fps, config: { damping: 18, stiffness: 120, mass: 0.8 } });
  const seed = who.charCodeAt(0) + who.length * 11;
  const blink = (f + seed * 7) % Math.round(fps * 3.4) < 4;
  const open = talking ? 0.4 + 0.6 * Math.abs(Math.sin(t * 16 + seed)) : 0;
  const sway = Math.sin(t * 1.6 + seed) * 1.2 + (mood === "laugh" ? Math.sin(t * 24) * 1.5 : 0);
  const nod = talking ? Math.sin(t * 7) * 3 : Math.sin(t * 1.3 + seed) * 1.5;
  const gesture = talking ? 0.55 + 0.45 * Math.sin(t * 3 + seed) : 0;
  const sleeve = l.jacket ?? l.shirt;
  const legTop = l.bottom === "pants" ? l.bottomColor : l.legs ?? l.skin;
  const W = 300, H = 900;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W * scale} height={H * scale} style={{
      position: "absolute", left: x - (W / 2) * scale, top: y - H * scale + (1 - enter) * 80, overflow: "visible",
      opacity: Math.min(1, enter), transform: `rotate(${tilt}deg) scaleX(${flip ? -1 : 1})`, transformOrigin: "50% 98%",
    }}>
      <ellipse cx={150} cy={884} rx={86} ry={10} fill="#000" opacity={0.16} />
      <g transform={`rotate(${sway} 150 880) translate(150 0) scale(1.18 1) translate(-150 0)`}>
        {/* legs */}
        <path d="M108 450 L150 450 L144 842 L122 842Z" fill={legTop} />
        <path d="M150 450 L194 450 L180 842 L156 842Z" fill={legTop} />
        <path d="M168 450 L194 450 L180 842 L168 842Z" fill={shade} />
        {l.bottom === "shorts" && <path d="M104 430 L196 430 L200 540 L154 540 L150 500 L146 540 L100 540Z" fill={l.bottomColor} />}
        {l.bottom === "skirt" && <path d="M108 430 L192 430 L214 590 L86 590Z" fill={l.bottomColor} />}
        {l.bottom === "skirt" && <path d="M160 430 L192 430 L214 590 L170 590Z" fill={shade} />}
        {l.bottom === "pants" && <><path d="M134 456 L134 836 M168 456 L166 836" stroke="rgba(255,255,255,.14)" strokeWidth={2} strokeDasharray="6 5" />
          <path d="M112 452 Q122 476 138 470 M188 452 Q178 476 162 470" stroke="rgba(0,0,0,.25)" strokeWidth={2.5} fill="none" />
          <path d="M150 452 L149 520" stroke="rgba(0,0,0,.3)" strokeWidth={2.5} /></>}
        {l.bottom === "shorts" && <path d="M104 532 L148 532 M152 532 L200 532" stroke="rgba(255,255,255,.35)" strokeWidth={3} strokeDasharray="4 4" />}
        {l.bottom === "skirt" && <path d="M130 440 L120 586 M150 440 L150 588 M170 440 L182 586" stroke="rgba(0,0,0,.12)" strokeWidth={3} />}
        {/* shoes / boots */}
        {l.boots ? <><path d="M116 740 L148 740 L150 862 L106 866 Q104 850 116 846Z" fill={l.shoes} /><path d="M154 740 L184 740 L190 846 Q200 852 196 866 L152 862Z" fill={l.shoes} /></>
          : <><path d="M114 836 L146 836 L148 864 L98 868 Q98 850 114 846Z" fill={l.shoes} /><path d="M156 836 L182 836 L186 846 Q204 852 202 868 L154 864Z" fill={l.shoes} /></>}
        <path d="M98 866 L150 862 L150 870 L96 872Z M152 862 L202 866 L204 872 L152 870Z" fill="rgba(0,0,0,.45)" />
        {l.boots && <path d="M116 760 L148 760 M154 760 L184 760" stroke="rgba(255,255,255,.2)" strokeWidth={4} />}
        {/* back arm */}
        <Arm side={1} sleeve={sleeve} skin={l.skin} up={0} swing={-sway} />
        {/* torso */}
        <rect x={138} y={150} width={24} height={50} fill={l.skin} />
        <path d="M98 198 Q150 182 202 198 L194 446 L106 446Z" fill={l.shirt} />
        {l.stripes && [0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={104} y={226 + i * 36} width={92} height={13} fill={l.stripes} />)}
        {l.bottom === "pants" && <rect x={106} y={430} width={88} height={22} fill={l.bottomColor} />}
        {l.bottom === "pants" && <><rect x={106} y={432} width={88} height={12} fill="#3a2a22" /><rect x={142} y={430} width={16} height={16} rx={2} fill="none" stroke="#d9b45a" strokeWidth={3} /></>}
        {l.jacket && <>
          <path d={`M92 198 Q118 184 136 200 L132 ${l.jacketLong ? 600 : 470} L94 ${l.jacketLong ? 600 : 470} Q86 330 92 198Z`} fill={l.jacket} />
          <path d={`M208 198 Q182 184 164 200 L168 ${l.jacketLong ? 600 : 470} L206 ${l.jacketLong ? 600 : 470} Q214 330 208 198Z`} fill={l.jacket} />
          <path d={`M180 200 L168 ${l.jacketLong ? 600 : 470} L206 ${l.jacketLong ? 600 : 470} Q214 330 208 198Z`} fill={shade} />
          <path d="M136 200 L118 196 L132 262Z M164 200 L182 196 L168 262Z" fill="rgba(0,0,0,.22)" />
          <path d="M100 330 L128 330 M172 330 L200 330" stroke="rgba(0,0,0,.2)" strokeWidth={3} />
          {[300, 360, 420].map((yy) => <circle key={yy} cx={130} cy={yy} r={4} fill="rgba(0,0,0,.3)" />)}
          <path d="M96 210 Q94 330 98 460" stroke="rgba(255,255,255,.15)" strokeWidth={4} fill="none" />
        </>}
        {!l.jacket && <><path d="M128 190 L150 222 L172 190 L162 184 L150 204 L138 184Z" fill="rgba(255,255,255,.35)" />
          {[240, 290, 340, 390].map((yy) => <circle key={yy} cx={150} cy={yy} r={3.5} fill="rgba(255,255,255,.7)" />)}
          <path d="M150 222 L150 430" stroke="rgba(0,0,0,.15)" strokeWidth={2} />
          <rect x={162} y={250} width={24} height={22} rx={3} fill="none" stroke="rgba(0,0,0,.18)" strokeWidth={2} />
          <path d="M170 196 L202 198 L194 446 L172 446Z" fill={shade} /></>}
        {l.bow && <><path d="M126 192 Q150 214 174 192 L170 206 Q150 224 130 206Z" fill="#fff" /><path d="M86 588 Q96 600 106 588 T126 588 T146 588 T166 588 T186 588 T206 588 T214 590" stroke="#fff" strokeWidth={5} fill="none" /><path d="M120 452 L180 452" stroke={l.bow} strokeWidth={8} /></>}
        {l.scarf && <path d="M120 176 Q150 200 180 176 L184 200 Q150 226 116 200Z M168 200 L176 300 L158 296 L156 206Z" fill={l.scarf} />}
        {/* head */}
        <g transform={`rotate(${nod} 150 170)`}>
          <HairBack l={l} />
          <ellipse cx={150} cy={112} rx={42} ry={52} fill={l.skin} />
          <ellipse cx={108} cy={118} rx={7} ry={11} fill={l.skin} /><ellipse cx={192} cy={118} rx={7} ry={11} fill={l.skin} /><path d="M106 112 q4 6 0 12M194 112 q-4 6 0 12" stroke="rgba(140,80,60,.4)" strokeWidth={2} fill="none" />
          <path d="M112 128 Q118 160 150 166 Q182 160 188 128 Q186 156 150 172 Q114 156 112 128Z" fill="rgba(140,80,60,.12)" />
          <path d="M168 66 Q196 92 186 150 Q172 164 158 162 Q186 120 168 66Z" fill={shade} opacity={0.6} />
          <Face who={who} mood={mood} talking={talking} blink={blink} open={open} look={Math.sin(t * 0.7 + seed) * 1.6 + (flip ? -1 : 1)} brow={l.hair} />
          <HairFront l={l} />
          <path d="M118 66 Q140 54 166 58 M126 76 Q146 64 172 70" stroke="rgba(255,255,255,.22)" strokeWidth={4} fill="none" strokeLinecap="round" />
          {l.bow && <g transform="translate(184 60) rotate(20)"><path d="M0 0 L-18 -12 L-18 12Z M0 0 L18 -12 L18 12Z" fill={l.bow} /><circle r={5} fill={l.bow} /></g>}
          {l.beanie && <path d="M98 92 Q100 36 150 34 Q200 36 202 92Z" fill={l.beanie} />}
        </g>
        {/* front arm (gestures when talking) */}
        <Arm side={-1} sleeve={sleeve} skin={l.skin} up={gesture} swing={sway} />
      </g>
    </svg>
  );
};
