"use client";

import { Fragment, useRef, useState, type DragEvent } from "react";
import {
  Eraser,
  Flag,
  Move,
  Plus,
  Puzzle,
  Radar,
  Repeat,
  Sigma,
  Square,
  Star,
  Variable,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Mini Scratch studio — a faithful take on the Scratch 3.0 editor layout:
 *  - left:    block palette with a category rail (all 9 Scratch categories)
 *  - center:  scripts area — drag blocks here, reorder them, click one to remove it
 *  - right:   stage with green flag + stop, plus sprite and backdrop pickers
 */

type BlockId =
  | "when" | "move" | "turn" | "goto"
  | "say" | "think" | "grow"
  | "pop" | "meow" | "drum"
  | "broadcast"
  | "wait" | "repeat"
  | "edge" | "mouse" | "loudness"
  | "random" | "math"
  | "set" | "change"
  | "jump" | "spin";
type CategoryId =
  | "motion" | "looks" | "sound" | "events" | "control"
  | "sensing" | "operators" | "variables" | "myblocks";

interface CategoryDef {
  id: CategoryId;
  label: string;
  color: string;
  ink: string;
  icon: LucideIcon;
}

const CATEGORIES: CategoryDef[] = [
  { id: "motion", label: "Motion", color: "#4C97FF", ink: "#FFFFFF", icon: Move },
  { id: "looks", label: "Looks", color: "#9966FF", ink: "#FFFFFF", icon: Star },
  { id: "sound", label: "Sound", color: "#CF63CF", ink: "#FFFFFF", icon: Volume2 },
  { id: "events", label: "Events", color: "#FFBF00", ink: "#5C4300", icon: Flag },
  { id: "control", label: "Control", color: "#FFAB19", ink: "#6B3D00", icon: Repeat },
  { id: "sensing", label: "Sensing", color: "#5CB1D6", ink: "#FFFFFF", icon: Radar },
  { id: "operators", label: "Operators", color: "#59C059", ink: "#FFFFFF", icon: Sigma },
  { id: "variables", label: "Variables", color: "#FF8C1A", ink: "#FFFFFF", icon: Variable },
  { id: "myblocks", label: "My Blocks", color: "#FF6680", ink: "#FFFFFF", icon: Puzzle },
];

interface BlockDef {
  id: BlockId;
  label: string;
  category: CategoryId;
  hat?: boolean;
}

const BLOCKS: BlockDef[] = [
  { id: "when", label: "when flag clicked", category: "events", hat: true },
  { id: "move", label: "move 10 steps", category: "motion" },
  { id: "turn", label: "turn 15 degrees", category: "motion" },
  { id: "goto", label: "go to start", category: "motion" },
  { id: "say", label: "say Hello! for 2 sec", category: "looks" },
  { id: "think", label: "think Hmm… for 2 sec", category: "looks" },
  { id: "grow", label: "change size by 10", category: "looks" },
  { id: "pop", label: "play pop sound", category: "sound" },
  { id: "meow", label: "play meow sound", category: "sound" },
  { id: "drum", label: "play drum beat", category: "sound" },
  { id: "broadcast", label: "broadcast message1", category: "events" },
  { id: "wait", label: "wait 1 seconds", category: "control" },
  { id: "repeat", label: "repeat 3 times", category: "control" },
  { id: "edge", label: "touching edge?", category: "sensing" },
  { id: "mouse", label: "mouse x", category: "sensing" },
  { id: "loudness", label: "loudness", category: "sensing" },
  { id: "random", label: "pick random 1 to 10", category: "operators" },
  { id: "math", label: "add 2 + 3", category: "operators" },
  { id: "set", label: "set score to 0", category: "variables" },
  { id: "change", label: "change score by 1", category: "variables" },
  { id: "jump", label: "jump", category: "myblocks" },
  { id: "spin", label: "spin 90 degrees", category: "myblocks" },
];

const BLOCK_IDS = BLOCKS.map((b) => b.id);
const REPEAT_TIMES = 3;
const isBlock = (value: string): value is BlockId => (BLOCK_IDS as string[]).includes(value);

const DEFAULT_SCRIPT: BlockId[] = ["when", "say", "move", "pop", "turn"];

const SPEECH_LINES: Record<string, string[]> = {
  when: ["Let's code!", "Here we go…"],
  say: ["Hello! I love learning at LEA Labs!", "I'm Scratchy the cat!"],
  move: ["Step by step!", "Zoom zoom!"],
  turn: ["Wheee!", "Spinning fun!"],
  think: ["Hmm, let me think…", "Hmm…"],
  meow: ["Meow!"],
  drum: ["Boom boom!"],
  broadcast: ["Message sent!", "Broadcasting!"],
  wait: ["Hmm, thinking…"],
};
const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

interface SpriteState {
  x: number;
  rotation: number;
  speech: string | null;
  bounce: boolean;
  scale: number;
  thinking: boolean;
}

/* ------------------------------- sprites ------------------------------- */

function CatSprite({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Scratchy the cat">
      <path d="M12 40 Q2 32 8 20" stroke="#F59E0B" strokeWidth="7" fill="none" strokeLinecap="round" />
      <ellipse cx="32" cy="46" rx="16" ry="13" fill="#F59E0B" />
      <circle cx="32" cy="24" r="13" fill="#F59E0B" />
      <path d="M22 16 L20 4 L30 12 Z" fill="#F59E0B" />
      <path d="M42 16 L44 4 L34 12 Z" fill="#F59E0B" />
      <path d="M22 14 L20.5 7 L28 12 Z" fill="#FB7185" />
      <path d="M42 14 L43.5 7 L36 12 Z" fill="#FB7185" />
      <circle cx="27" cy="24" r="2.2" fill="#1C1917" />
      <circle cx="37" cy="24" r="2.2" fill="#1C1917" />
      <path d="M28 30 Q32 33 36 30" stroke="#1C1917" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M18 26 L10 24 M18 29 L10 30" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M46 26 L54 24 M46 29 L54 30" stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function RobotSprite({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Robo the robot">
      <line x1="32" y1="14" x2="32" y2="6" stroke="#94A3B8" strokeWidth="3" />
      <circle cx="32" cy="4" r="3" fill="#F87171" />
      <rect x="18" y="14" width="28" height="24" rx="7" fill="#CBD5E1" />
      <rect x="13" y="20" width="6" height="10" rx="3" fill="#94A3B8" />
      <rect x="45" y="20" width="6" height="10" rx="3" fill="#94A3B8" />
      <circle cx="25" cy="25" r="3.2" fill="#0F172A" />
      <circle cx="39" cy="25" r="3.2" fill="#0F172A" />
      <circle cx="26" cy="24" r="1" fill="#FFFFFF" />
      <circle cx="40" cy="24" r="1" fill="#FFFFFF" />
      <rect x="29" y="31" width="6" height="2.4" rx="1.2" fill="#0F172A" />
      <rect x="20" y="42" width="24" height="16" rx="7" fill="#94A3B8" />
      <rect x="27" y="47" width="10" height="5" rx="2" fill="#F87171" />
    </svg>
  );
}

function DinoSprite({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Dino the dinosaur">
      <path d="M18 44 Q8 40 10 30" stroke="#558B2F" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M22 34 L16 26 L24 29 Z" fill="#66BB6A" />
      <path d="M26 30 L22 21 L30 26 Z" fill="#7CB342" />
      <path d="M32 28 L30 18 L37 24 Z" fill="#66BB6A" />
      <ellipse cx="32" cy="44" rx="14" ry="12" fill="#66BB6A" />
      <circle cx="45" cy="29" r="10" fill="#66BB6A" />
      <circle cx="47" cy="27" r="2.2" fill="#1C1917" />
      <path d="M42 34 Q45 36 48 34" stroke="#1C1917" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <rect x="25" y="54" width="5" height="6" rx="2" fill="#558B2F" />
      <rect x="34" y="54" width="5" height="6" rx="2" fill="#558B2F" />
    </svg>
  );
}

const SPRITES = [
  { id: "cat", name: "Scratchy", render: CatSprite },
  { id: "robot", name: "Robo", render: RobotSprite },
  { id: "dino", name: "Dino", render: DinoSprite },
] as const;
type SpriteId = (typeof SPRITES)[number]["id"];

/* ------------------------------ backdrops ------------------------------ */

function MeadowBackdrop() {
  return (
    <svg viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="md-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7EC8FF" />
          <stop offset="1" stopColor="#DFF3FF" />
        </linearGradient>
      </defs>
      <rect width="320" height="240" fill="url(#md-sky)" />
      <circle cx="262" cy="52" r="26" fill="#FFD54A" />
      <g fill="#FFFFFF" opacity="0.92">
        <ellipse cx="72" cy="58" rx="26" ry="12" />
        <ellipse cx="94" cy="52" rx="18" ry="10" />
        <ellipse cx="212" cy="96" rx="20" ry="9" />
        <ellipse cx="228" cy="91" rx="14" ry="8" />
      </g>
      <ellipse cx="88" cy="205" rx="120" ry="70" fill="#8FD48F" />
      <ellipse cx="244" cy="218" rx="130" ry="76" fill="#66BB6A" />
      <rect y="206" width="320" height="34" fill="#4CAF50" />
    </svg>
  );
}

function SpaceBackdrop() {
  const stars: [number, number, number][] = [
    [24, 36, 1.6], [58, 88, 1.2], [92, 26, 1.4], [128, 70, 1.1], [164, 30, 1.7],
    [196, 92, 1.2], [232, 44, 1.5], [268, 110, 1.2], [300, 52, 1.4], [40, 140, 1.1],
    [150, 128, 1.3], [280, 160, 1.1], [112, 160, 1.2], [24, 200, 1.3],
  ];
  return (
    <svg viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="sp-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B1026" />
          <stop offset="1" stopColor="#1B2A5B" />
        </linearGradient>
      </defs>
      <rect width="320" height="240" fill="url(#sp-bg)" />
      <g fill="#FFFFFF">
        {stars.map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} opacity={0.85} />
        ))}
      </g>
      <circle cx="252" cy="62" r="18" fill="#D8E3F0" />
      <circle cx="246" cy="56" r="4" fill="#B0C4DE" />
      <circle cx="60" cy="198" r="34" fill="#E88B4A" />
      <ellipse cx="60" cy="198" rx="52" ry="10" fill="none" stroke="#F6C177" strokeWidth="4" transform="rotate(-18 60 198)" />
    </svg>
  );
}

function UnderwaterBackdrop() {
  return (
    <svg viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="uw-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1E90D0" />
          <stop offset="1" stopColor="#0B5EA8" />
        </linearGradient>
      </defs>
      <rect width="320" height="240" fill="url(#uw-bg)" />
      <g fill="#FFFFFF" opacity="0.22">
        <circle cx="60" cy="70" r="5" />
        <circle cx="84" cy="48" r="3" />
        <circle cx="200" cy="90" r="6" />
        <circle cx="230" cy="60" r="3.5" />
        <circle cx="150" cy="40" r="4" />
        <circle cx="280" cy="120" r="5" />
      </g>
      <path d="M46 240 q12 -32 0 -64 q-12 -32 0 -64" stroke="#2E7D32" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M96 240 q10 -26 0 -52 q-10 -26 0 -52" stroke="#388E3C" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M306 240 q-12 -30 0 -60 q12 -30 0 -60" stroke="#2E7D32" strokeWidth="9" fill="none" strokeLinecap="round" />
      <ellipse cx="228" cy="118" rx="26" ry="14" fill="#FF8A65" />
      <path d="M254 118 l14 -7 v14 z" fill="#FF8A65" />
      <circle cx="218" cy="115" r="2.2" fill="#1C1917" />
      <rect y="208" width="320" height="32" fill="#E8C37A" />
    </svg>
  );
}

function CityBackdrop() {
  return (
    <svg viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="ct-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2C3E8F" />
          <stop offset="1" stopColor="#FF8A5C" />
        </linearGradient>
      </defs>
      <rect width="320" height="240" fill="url(#ct-bg)" />
      <circle cx="262" cy="58" r="20" fill="#FFF3D6" />
      <rect x="30" y="92" width="46" height="148" fill="#233061" />
      <g fill="#FFD54A" opacity="0.9">
        <rect x="38" y="110" width="9" height="11" />
        <rect x="56" y="110" width="9" height="11" />
        <rect x="38" y="132" width="9" height="11" />
        <rect x="56" y="132" width="9" height="11" />
        <rect x="38" y="154" width="9" height="11" />
      </g>
      <rect x="96" y="62" width="54" height="178" fill="#1E2A55" />
      <g fill="#FFD54A" opacity="0.9">
        <rect x="106" y="80" width="10" height="12" />
        <rect x="126" y="80" width="10" height="12" />
        <rect x="106" y="102" width="10" height="12" />
        <rect x="126" y="102" width="10" height="12" />
        <rect x="106" y="124" width="10" height="12" />
        <rect x="126" y="124" width="10" height="12" />
      </g>
      <rect x="170" y="112" width="40" height="128" fill="#233061" />
      <rect x="179" y="128" width="9" height="11" fill="#FFD54A" opacity="0.9" />
      <rect x="193" y="128" width="9" height="11" fill="#FFD54A" opacity="0.9" />
      <rect x="230" y="78" width="58" height="162" fill="#1E2A55" />
      <g fill="#FFD54A" opacity="0.9">
        <rect x="239" y="96" width="10" height="12" />
        <rect x="260" y="96" width="10" height="12" />
        <rect x="239" y="118" width="10" height="12" />
        <rect x="260" y="118" width="10" height="12" />
      </g>
    </svg>
  );
}

const BACKDROPS = [
  { id: "meadow", name: "Meadow", render: MeadowBackdrop },
  { id: "space", name: "Space", render: SpaceBackdrop },
  { id: "underwater", name: "Underwater", render: UnderwaterBackdrop },
  { id: "city", name: "City", render: CityBackdrop },
] as const;
type BackdropId = (typeof BACKDROPS)[number]["id"];

/* --------------------------- block shape bits --------------------------- */

/** The puzzle-piece notches that make blocks look like Scratch blocks. */
function Notches({ color, hat }: { color: string; hat?: boolean }) {
  return (
    <>
      {!hat && (
        <span
          aria-hidden
          className="absolute -top-[7px] left-1/2 z-10 h-[10px] w-5 -translate-x-1/2 rounded-t-[5px]"
          style={{ backgroundColor: color }}
        />
      )}
      <span
        aria-hidden
        className="absolute -bottom-[7px] left-1/2 z-10 h-[10px] w-5 -translate-x-1/2 rounded-b-[5px]"
        style={{ backgroundColor: color }}
      />
    </>
  );
}

const categoryOf = (id: BlockId) => CATEGORIES.find((c) => c.id === BLOCKS.find((b) => b.id === id)!.category)!;

/* ------------------------------ component ------------------------------ */

export function ScratchWorkspace() {
  const [category, setCategory] = useState<CategoryId>("motion");
  const [script, setScript] = useState<BlockId[]>(DEFAULT_SCRIPT);
  const [running, setRunning] = useState(false);
  const [spriteId, setSpriteId] = useState<SpriteId>("cat");
  const [backdropId, setBackdropId] = useState<BackdropId>("meadow");
  const [sprite, setSprite] = useState<SpriteState>({ x: 0, rotation: 0, speech: null, bounce: false, scale: 1, thinking: false });

  const runningRef = useRef(false);
  const dragIndexRef = useRef<number | null>(null);
  const xRef = useRef(0);
  const mouseXRef = useRef(0);
  const scoreRef = useRef(0);
  const [dragActive, setDragActive] = useState(false);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const addBlock = (type: BlockId) => setScript((s) => [...s, type]);
  const removeBlock = (index: number) =>
    setScript((s) => (s.length > 1 ? s.filter((_, i) => i !== index) : s));
  const resetSprite = () => {
    xRef.current = 0;
    setSprite({ x: 0, rotation: 0, speech: null, bounce: false, scale: 1, thinking: false });
  };

  /** Execute a single block. Blocks that produce their own speech/animation handle it here. */
  const execBlock = async (block: BlockId) => {
    switch (block) {
      case "when":
        setSprite((s) => ({ ...s, speech: pick(SPEECH_LINES.when) }));
        await sleep(900);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "move": {
        const nx = clamp(xRef.current + 46, -110, 110);
        xRef.current = nx;
        setSprite((s) => ({ ...s, x: nx }));
        await sleep(520);
        break;
      }
      case "turn":
        setSprite((s) => ({ ...s, rotation: (s.rotation + 15) % 360 }));
        await sleep(420);
        break;
      case "goto":
        xRef.current = 0;
        setSprite((s) => ({ ...s, x: 0, rotation: 0 }));
        await sleep(320);
        break;
      case "say":
        setSprite((s) => ({ ...s, speech: pick(SPEECH_LINES.say) }));
        await sleep(1700);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "think":
        setSprite((s) => ({ ...s, thinking: true, speech: pick(SPEECH_LINES.think) }));
        await sleep(1300);
        setSprite((s) => ({ ...s, thinking: false, speech: null }));
        break;
      case "grow":
        setSprite((s) => ({ ...s, scale: clamp(s.scale + 0.15, 0.5, 2.5), speech: "Growing!" }));
        await sleep(420);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "pop":
        setSprite((s) => ({ ...s, bounce: true, speech: "Pop!" }));
        await sleep(380);
        setSprite((s) => ({ ...s, bounce: false, speech: null }));
        break;
      case "meow":
        setSprite((s) => ({ ...s, bounce: true, speech: "Meow!" }));
        await sleep(380);
        setSprite((s) => ({ ...s, bounce: false, speech: null }));
        break;
      case "drum":
        setSprite((s) => ({ ...s, bounce: true, speech: "Boom!" }));
        await sleep(450);
        setSprite((s) => ({ ...s, bounce: false, speech: null }));
        break;
      case "broadcast":
        setSprite((s) => ({ ...s, speech: pick(SPEECH_LINES.broadcast) }));
        await sleep(800);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "wait":
        await sleep(1000);
        break;
      case "edge": {
        if (Math.abs(xRef.current) >= 88) {
          setSprite((s) => ({ ...s, bounce: true, speech: "Yes! Edge!" }));
          await sleep(420);
          setSprite((s) => ({ ...s, bounce: false, speech: null }));
        } else {
          const nx = clamp(xRef.current + 46, -110, 110);
          xRef.current = nx;
          setSprite((s) => ({ ...s, x: nx, speech: "Not yet…" }));
          await sleep(520);
          setSprite((s) => ({ ...s, speech: null }));
        }
        break;
      }
      case "mouse": {
        const tx = clamp(mouseXRef.current, -110, 110);
        xRef.current = tx;
        setSprite((s) => ({ ...s, x: tx, speech: `Mouse X: ${Math.round(tx)}` }));
        await sleep(600);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      }
      case "loudness":
        setSprite((s) => ({ ...s, bounce: true, speech: "So loud!" }));
        await sleep(500);
        setSprite((s) => ({ ...s, bounce: false, speech: null }));
        break;
      case "random": {
        const n = 1 + Math.floor(Math.random() * 10);
        setSprite((s) => ({ ...s, bounce: true, speech: `I picked ${n}!` }));
        await sleep(600);
        setSprite((s) => ({ ...s, bounce: false, speech: null }));
        break;
      }
      case "math": {
        const a = 1 + Math.floor(Math.random() * 9);
        const b = 1 + Math.floor(Math.random() * 9);
        setSprite((s) => ({ ...s, speech: `${a} + ${b} = ${a + b}` }));
        await sleep(1100);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      }
      case "set":
        scoreRef.current = 0;
        setScore(0);
        setSprite((s) => ({ ...s, speech: "Score = 0" }));
        await sleep(700);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "change":
        scoreRef.current += 1;
        setScore(scoreRef.current);
        setSprite((s) => ({ ...s, bounce: true, speech: "Score +1!" }));
        await sleep(500);
        setSprite((s) => ({ ...s, bounce: false, speech: null }));
        break;
      case "jump":
        setSprite((s) => ({ ...s, bounce: true, speech: "Jump!" }));
        await sleep(500);
        setSprite((s) => ({ ...s, bounce: false, speech: null }));
        break;
      case "spin":
        setSprite((s) => ({ ...s, rotation: (s.rotation + 90) % 360, speech: "Wheee!" }));
        await sleep(450);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "repeat":
        break; // handled by the run loop below
    }
  };

  const run = async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setRunning(true);
    resetSprite();
    await sleep(350);

    for (let i = 0; i < script.length; i++) {
      if (!runningRef.current) break;
      const block = script[i];
      if (block === "repeat") {
        const body = script.slice(i + 1);
        for (let k = 0; k < REPEAT_TIMES && runningRef.current; k++) {
          for (const b of body) {
            if (!runningRef.current) break;
            await execBlock(b);
          }
        }
        break; // the repeated body was already executed
      }
      await execBlock(block);
    }

    runningRef.current = false;
    setRunning(false);
  };

  const stop = () => {
    runningRef.current = false;
    setRunning(false);
    resetSprite();
  };

  const clearScript = () => setScript(["when"]);

  /* drag & drop */
  const handlePaletteDragStart = (e: DragEvent<HTMLButtonElement>, id: BlockId) => {
    dragIndexRef.current = null;
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleScriptDragStart = (e: DragEvent<HTMLButtonElement>, index: number, id: BlockId) => {
    if (running) {
      e.preventDefault();
      return;
    }
    dragIndexRef.current = index;
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleScriptDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    const target = (e.target as HTMLElement).closest("[data-index]");
    setDropIndex(target ? Number(target.getAttribute("data-index")) : script.length);
  };

  const handleScriptDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("text/plain") as BlockId;
    const from = dragIndexRef.current;
    const to = dropIndex ?? script.length;
    if (isBlock(type)) {
      if (from !== null) {
        // Reorder an existing block.
        setScript((prev) => {
          const next = [...prev];
          const [moved] = next.splice(from, 1);
          next.splice(from < to ? to - 1 : to, 0, moved);
          return next;
        });
      } else {
        // New block from the palette — insert where the marker is.
        setScript((prev) => [...prev.slice(0, to), type, ...prev.slice(to)]);
      }
    }
    dragIndexRef.current = null;
    setDropIndex(null);
    setDragActive(false);
  };

  const ActiveSprite = SPRITES.find((s) => s.id === spriteId)!.render;
  const ActiveBackdrop = BACKDROPS.find((b) => b.id === backdropId)!.render;

  const paletteBlocks = BLOCKS.filter((b) => b.category === category);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b bg-muted/30 pb-3">
        <CardTitle className="text-sm font-medium">Scratch workspace</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearScript}
          className="h-8 gap-1.5 text-xs"
          disabled={running}
        >
          <Eraser className="h-3.5 w-3.5" aria-hidden />
          Clear
        </Button>
      </CardHeader>

      <CardContent className="grid gap-4 p-4 lg:grid-cols-[210px_minmax(0,1fr)_290px]">
        {/* ---------------- left: block palette ---------------- */}
        <div className="flex gap-2 lg:flex-col">
          {/* category rail */}
          <div className="flex flex-wrap gap-1 lg:flex-col" role="tablist" aria-label="Block categories">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  title={cat.label}
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                    active ? "text-white shadow-sm" : "text-muted-foreground hover:bg-muted"
                  )}
                  style={active ? { backgroundColor: cat.color } : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </button>
              );
            })}
          </div>

          {/* blocks of the active category */}
          <div className="flex-1 rounded-xl border bg-muted/30 p-2.5">
            <p className="px-1 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {CATEGORIES.find((c) => c.id === category)!.label}
            </p>
            <div className="space-y-3">
              {paletteBlocks.map((def) => {
                const cat = categoryOf(def.id);
                return (
                  <button
                    key={def.id}
                    type="button"
                    draggable={!running}
                    onDragStart={(e) => handlePaletteDragStart(e, def.id)}
                    onClick={() => addBlock(def.id)}
                    disabled={running}
                    title={running ? undefined : "Drag into the workspace or click to add"}
                    className={cn(
                      "relative block w-full rounded-[10px] px-3 py-2 text-left text-xs font-semibold shadow-sm transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60",
                      def.hat && "rounded-t-[16px]"
                    )}
                    style={{ backgroundColor: cat.color, color: cat.ink }}
                  >
                    <Notches color={cat.color} hat={def.hat} />
                    {def.label}
                  </button>
                );
              })}
            </div>
            <p className="px-1 pt-3 text-[11px] leading-snug text-muted-foreground">
              Drag a block into the workspace, or tap it to add.
            </p>
          </div>
        </div>

        {/* ---------------- center: scripts area ---------------- */}
        <div className="flex flex-col gap-2 lg:col-start-2">
          <p className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Scripts</p>
          <div
            onDragEnter={() => setDragActive(true)}
            onDragOver={handleScriptDragOver}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setDragActive(false);
                setDropIndex(null);
              }
            }}
            onDrop={handleScriptDrop}
            className={cn(
              "flex-1 rounded-xl bg-white p-3 ring-1 transition-shadow",
              "[background-image:radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:18px_18px]",
              dragActive ? "ring-2 ring-orange-400" : "ring-black/5"
            )}
          >
            {script.length <= 1 ? (
              <div className="flex h-full min-h-[220px] items-center justify-center text-center text-sm text-muted-foreground">
                <p className="max-w-[220px]">
                  Drag blocks from the palette to build your script, then press the green flag.
                </p>
              </div>
            ) : null}

            {script.map((id, index) => (
              <Fragment key={`${id}-${index}`}>
                {dropIndex === index && <DropMarker />}
                <button
                  type="button"
                  data-index={index}
                  draggable={!running}
                  onDragStart={(e) => handleScriptDragStart(e, index, id)}
                  onDragEnd={() => {
                    dragIndexRef.current = null;
                    setDropIndex(null);
                  }}
                  onClick={() => removeBlock(index)}
                  disabled={running}
                  title="Drag to reorder · click to remove"
                  className={cn(
                    "relative block w-full rounded-[10px] px-3 py-2 text-left text-xs font-semibold shadow-sm transition-transform hover:scale-[1.01] disabled:opacity-70",
                    id === "when" && "rounded-t-[16px]"
                  )}
                  style={{ backgroundColor: categoryOf(id).color, color: categoryOf(id).ink }}
                >
                  <Notches color={categoryOf(id).color} hat={id === "when"} />
                  {BLOCKS.find((b) => b.id === id)!.label}
                </button>
              </Fragment>
            ))}
            {dropIndex === script.length && <DropMarker />}
          </div>
        </div>

        {/* ---------------- right: stage + sprite + backdrop ---------------- */}
        <div className="flex flex-col gap-3 lg:col-start-3">
          {/* stage */}
          <div>
            <div className="mb-1.5 flex items-center gap-2 px-0.5">
              <button
                type="button"
                onClick={() => void run()}
                disabled={running}
                aria-label="Run script"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 shadow-sm transition-transform hover:scale-110 active:scale-95 disabled:opacity-60"
              >
                <Flag className="h-3.5 w-3.5 text-white" aria-hidden />
              </button>
              <button
                type="button"
                onClick={stop}
                aria-label="Stop script"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 shadow-sm transition-transform hover:scale-110 active:scale-95"
              >
                <Square className="h-3 w-3 fill-white text-white" aria-hidden />
              </button>
              <span className="text-xs font-medium text-muted-foreground">Stage</span>
            </div>

            <div
              onPointerMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                mouseXRef.current = clamp(e.clientX - (rect.left + rect.width / 2), -110, 110);
              }}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white ring-1 ring-black/5"
            >
              <ActiveBackdrop />
              {score > 0 ? (
                <div className="absolute right-2 top-2 z-10 rounded-md border border-orange-300 bg-orange-50 px-2 py-0.5 text-[11px] font-semibold text-orange-700 shadow-sm">
                  Score: {score}
                </div>
              ) : null}
              <div className="pointer-events-none absolute bottom-7 left-1/2">
                <div
                  className="transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `translateX(${sprite.x}px) scale(${(sprite.bounce ? 1.18 : 1) * sprite.scale})`,
                  }}
                >
                  <div className="relative">
                    {sprite.speech ? (
                      <div
                        className={cn(
                          "absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl border bg-white px-3.5 py-1.5 text-xs font-medium shadow-md",
                          sprite.thinking ? "rounded-full border-dashed" : "rounded-bl-sm"
                        )}
                      >
                        {sprite.speech}
                      </div>
                    ) : null}
                    <div
                      className="transition-transform duration-300 ease-in-out"
                      style={{ transform: `rotate(${sprite.rotation}deg)` }}
                    >
                      <ActiveSprite className="h-16 w-16 drop-shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* sprite picker */}
          <div>
            <p className="mb-1.5 px-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Sprite
            </p>
            <div className="grid grid-cols-4 gap-2">
              {SPRITES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSpriteId(item.id)}
                  title={`Use ${item.name}`}
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-xl border bg-white p-1.5 transition-colors",
                    spriteId === item.id
                      ? "border-sky-400 ring-1 ring-sky-300"
                      : "border-border hover:border-sky-300"
                  )}
                >
                  <item.render className="h-9 w-9" />
                  <span className="text-[10px] text-muted-foreground">{item.name}</span>
                </button>
              ))}
              <div
                title="More sprites coming soon"
                className="flex aspect-[4/5] items-center justify-center rounded-xl border border-dashed text-muted-foreground"
              >
                <Plus className="h-4 w-4" aria-hidden />
              </div>
            </div>
          </div>

          {/* backdrop picker */}
          <div>
            <p className="mb-1.5 px-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Backdrop
            </p>
            <div className="grid grid-cols-2 gap-2">
              {BACKDROPS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBackdropId(item.id)}
                  title={`Use ${item.name}`}
                  className={cn(
                    "group relative aspect-[4/3] overflow-hidden rounded-lg transition-all",
                    backdropId === item.id
                      ? "ring-2 ring-sky-400"
                      : "ring-1 ring-black/10 hover:ring-sky-300"
                  )}
                >
                  <item.render />
                  <span className="absolute bottom-1 left-1 rounded bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DropMarker() {
  return <div className="my-1 h-1 rounded-full bg-orange-400" aria-hidden />;
}
