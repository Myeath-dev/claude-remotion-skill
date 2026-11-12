// Tall, fashion-illustration style characters (flat colour + soft shading, no outlines).
import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export type Who = "miki" | "ren" | "kai" | "hana" | "yui" | "mei";
export type Mood = "happy" | "cold" | "angry" | "talk" | "nervous" | "laugh";

type Look = {
  skin: string; hair: string; hairStyle: "messy" | "swept" | "bun" | "bob" | "pony" | "waves";
  shirt: string; stripes?: string; jacket?: string; jacketLong?: boolean;
  bottom: "pants" | "shorts" | "skirt"; bottomColor: string; legs?: string;
  shoes: string; boots?: boolean; scarf?: string; beanie?: string;
};
export const LOOKS: Record<Who, Look> = {
  miki: { skin: "#f6d3b8", hair: "#3a2a2a", hairStyle: "bun", shirt: "#3a3550", stripes: "#c9475a", jacket: "#4f7a3a", jacketLong: true,
    bottom: "shorts", bottomColor: "#3c5a8a", legs: "#2d2a38", shoes: "#6b3f26", boots: true },
  ren: { skin: "#efc9a8", hair: "#22232b", hairStyle: "swept", shirt: "#4d6e94", jacket: undefined,
    bottom: "pants", bottomColor: "#26262e", shoes: "#4a3227" },
  kai: { skin: "#f3c6a0", hair: "#b8572e", hairStyle: "messy", shirt: "#2f8c84", jacket: "#9a5a2e",
    bottom: "pants", bottomColor: "#2f4a74", shoes: "#a8283a", boots: true },
  hana: { skin: "#f8dcc6", hair: "#a98fd6", hairStyle: "waves", shirt: "#f4f1ea", jacket: undefined,
    bottom: "pants", bottomColor: "#26355e", shoes: "#2a2a35", scarf: undefined },
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

const Face: React.FC<{ mood: Mood; talking: boolean; blink: boolean; open: number }> = ({ mood, talking, blink, open }) => {
  const ink = "#2a2030";
  const k = { stroke: ink, strokeWidth: 3, strokeLinecap: "round" as const, fill: "none" };
  const eyes = blink ? <><path d="M128 114h12M160 114h12" {...k} /></>
    : mood === "happy" || mood === "laugh" ? <><path d="M127 116 Q134 108 141 116" {...k} /><path d="M159 116 Q166 108 173 116" {...k} /></>
    : mood === "cold" ? <><path d="M127 113h14M159 113h14" {...k} /><ellipse cx={134} cy={116} rx={4} ry={2.5} fill={ink} /><ellipse cx={166} cy={116} rx={4} ry={2.5} fill={ink} /></>
    : <><ellipse cx={134} cy={114} rx={4} ry={5} fill={ink} /><ellipse cx={166} cy={114} rx={4} ry={5} fill={ink} /></>;
  const brows = mood === "angry" ? <><path d="M124 100 L142 106M176 100 L158 106" {...k} /></>
    : mood === "nervous" ? <><path d="M124 104 L142 99M176 104 L158 99" {...k} /></>
    : <><path d="M125 101 Q134 97 142 101M158 101 Q166 97 175 101" {...k} /></>;
  const mouth = talking ? <ellipse cx={150} cy={142} rx={7 + open * 2} ry={2 + open * 6} fill="#8a3a42" />
    : mood === "laugh" ? <path d="M138 138 Q150 154 162 138Z" fill="#8a3a42" />
    : mood === "happy" || mood === "talk" ? <path d="M140 140 Q150 147 160 140" {...k} stroke="#9a4a4a" />
    : mood === "angry" ? <path d="M141 145 Q150 139 159 145" {...k} stroke="#9a4a4a" />
    : mood === "nervous" ? <path d="M140 143 q5-4 10 0 t10 0" {...k} stroke="#9a4a4a" />
    : <path d="M143 142h14" {...k} stroke="#9a4a4a" />;
  return (<>
    {eyes}{brows}
    <path d="M150 118 Q147 130 152 132" stroke="rgba(120,60,40,.45)" strokeWidth={2.5} fill="none" strokeLinecap="round" />
    {mouth}
    {(mood === "happy" || mood === "laugh") && <><ellipse cx={124} cy={130} rx={9} ry={5} fill="#ff8fa3" opacity={0.45} /><ellipse cx={176} cy={130} rx={9} ry={5} fill="#ff8fa3" opacity={0.45} /></>}
    {mood === "nervous" && <path d="M194 86 q7 12 0 18 q-7 -6 0 -18z" fill="#8fd3ff" />}
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
  who: Who; x: number; y: number; scale?: number; mood: Mood; talking: boolean; flip?: boolean; enterDelay?: number;
}> = ({ who, x, y, scale = 1, mood, talking, flip, enterDelay = 0 }) => {
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
      opacity: Math.min(1, enter), transform: `scaleX(${flip ? -1 : 1})`,
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
        {/* shoes / boots */}
        {l.boots ? <><path d="M116 740 L148 740 L150 862 L106 866 Q104 850 116 846Z" fill={l.shoes} /><path d="M154 740 L184 740 L190 846 Q200 852 196 866 L152 862Z" fill={l.shoes} /></>
          : <><path d="M114 836 L146 836 L148 864 L98 868 Q98 850 114 846Z" fill={l.shoes} /><path d="M156 836 L182 836 L186 846 Q204 852 202 868 L154 864Z" fill={l.shoes} /></>}
        {/* back arm */}
        <Arm side={1} sleeve={sleeve} skin={l.skin} up={0} swing={-sway} />
        {/* torso */}
        <rect x={138} y={150} width={24} height={50} fill={l.skin} />
        <path d="M98 198 Q150 182 202 198 L194 446 L106 446Z" fill={l.shirt} />
        {l.stripes && [0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={104} y={226 + i * 36} width={92} height={13} fill={l.stripes} />)}
        {l.bottom === "pants" && <rect x={106} y={430} width={88} height={22} fill={l.bottomColor} />}
        {l.bottom === "pants" && <rect x={108} y={436} width={84} height={6} fill="#2a2030" opacity={0.5} />}
        {l.jacket && <>
          <path d={`M92 198 Q118 184 136 200 L132 ${l.jacketLong ? 600 : 470} L94 ${l.jacketLong ? 600 : 470} Q86 330 92 198Z`} fill={l.jacket} />
          <path d={`M208 198 Q182 184 164 200 L168 ${l.jacketLong ? 600 : 470} L206 ${l.jacketLong ? 600 : 470} Q214 330 208 198Z`} fill={l.jacket} />
          <path d={`M180 200 L168 ${l.jacketLong ? 600 : 470} L206 ${l.jacketLong ? 600 : 470} Q214 330 208 198Z`} fill={shade} />
          <path d="M136 200 L118 196 L132 262Z M164 200 L182 196 L168 262Z" fill="rgba(0,0,0,.22)" />
        </>}
        {!l.jacket && <><path d="M134 192 L150 220 L166 192 L158 186 L150 204 L142 186Z" fill="rgba(255,255,255,.35)" />
          <path d="M170 196 L202 198 L194 446 L172 446Z" fill={shade} /></>}
        {l.scarf && <path d="M120 176 Q150 200 180 176 L184 200 Q150 226 116 200Z M168 200 L176 300 L158 296 L156 206Z" fill={l.scarf} />}
        {/* head */}
        <g transform={`rotate(${nod} 150 170)`}>
          <HairBack l={l} />
          <ellipse cx={150} cy={112} rx={42} ry={52} fill={l.skin} />
          <ellipse cx={108} cy={118} rx={7} ry={11} fill={l.skin} /><ellipse cx={192} cy={118} rx={7} ry={11} fill={l.skin} />
          <path d="M168 66 Q196 92 186 150 Q172 164 158 162 Q186 120 168 66Z" fill={shade} opacity={0.6} />
          <Face mood={mood} talking={talking} blink={blink} open={open} />
          <HairFront l={l} />
          {l.beanie && <path d="M98 92 Q100 36 150 34 Q200 36 202 92Z" fill={l.beanie} />}
        </g>
        {/* front arm (gestures when talking) */}
        <Arm side={-1} sleeve={sleeve} skin={l.skin} up={gesture} swing={sway} />
      </g>
    </svg>
  );
};
