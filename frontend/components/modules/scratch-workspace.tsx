"use client";

import { Fragment, useEffect, useRef, useState, type ButtonHTMLAttributes, type DragEvent } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  ChevronDown,
  Flag,
  FolderOpen,
  Maximize2,
  Move,
  MousePointer2,
  MoreHorizontal,
  Plus,
  Puzzle,
  Radar,
  Redo2,
  Repeat,
  Save,
  Sigma,
  Square,
  Star,
  Trash2,
  Undo2,
  Variable,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { resourceService, type ResourceRow } from "@/services/resources";

/**
 * Mini Scratch studio — a faithful take on the Scratch 3.0 editor layout:
 *  - left:    block palette with a category rail (all 9 Scratch categories)
 *  - center:  scripts area — drag blocks here, reorder them, click one to remove it
 *  - right:   stage with green flag + stop, plus sprite and backdrop pickers
 */

type BlockId =
  | "when" | "when-key" | "when-clicked" | "when-backdrop" | "when-loudness" | "when-receive"
  | "move" | "turn" | "turn-left" | "goto" | "goto-random" | "goto-xy" | "glide" | "point-direction" | "point-mouse" | "change-x" | "set-x" | "change-y" | "set-y" | "bounce" | "rotation-style" | "x-position" | "y-position" | "direction"
  | "say" | "say-short" | "think" | "think-short" | "grow" | "change-size" | "set-size" | "next-costume" | "switch-costume" | "clear-effects" | "change-effect" | "set-effect" | "front-layer" | "back-layer" | "show" | "hide"
  | "pop" | "meow" | "drum" | "play-sound" | "stop-sounds" | "change-volume" | "set-volume" | "rest-beats" | "change-tempo" | "set-tempo"
  | "broadcast" | "broadcast-wait"
  | "wait" | "repeat" | "forever" | "if" | "if-else" | "wait-until" | "repeat-until" | "stop-all" | "create-clone" | "delete-clone" | "start-clone"
  | "edge" | "touch-color" | "color-touch" | "ask" | "answer" | "key" | "mouse" | "mouse-y" | "mouse-down" | "loudness" | "timer" | "reset-timer" | "current-date" | "days-since" | "username"
  | "random" | "math" | "subtract" | "multiply" | "divide" | "compare" | "and" | "or" | "not" | "join" | "letter" | "length" | "contains" | "mod" | "round" | "abs"
  | "set" | "change" | "show-variable" | "hide-variable" | "add-list" | "delete-list" | "delete-all-list" | "insert-list" | "replace-list" | "item-list" | "length-list" | "contains-list" | "show-list" | "hide-list"
  | "jump" | "spin" | "dance" | "celebrate" | "reset-player";

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
  // Events
  { id: "when", label: "when flag clicked", category: "events", hat: true },
  { id: "when-key", label: "when space key pressed", category: "events", hat: true },
  { id: "when-clicked", label: "when this sprite clicked", category: "events", hat: true },
  { id: "when-backdrop", label: "when backdrop switches to Meadow", category: "events", hat: true },
  { id: "when-loudness", label: "when loudness > 10", category: "events", hat: true },
  { id: "when-receive", label: "when I receive message1", category: "events", hat: true },
  { id: "broadcast", label: "broadcast message1", category: "events" },
  { id: "broadcast-wait", label: "broadcast message1 and wait", category: "events" },
  // Motion
  { id: "move", label: "move 10 steps", category: "motion" },
  { id: "turn", label: "turn clockwise 15 degrees", category: "motion" },
  { id: "turn-left", label: "turn counterclockwise 15 degrees", category: "motion" },
  { id: "goto", label: "go to mouse-pointer", category: "motion" },
  { id: "goto-random", label: "go to random position", category: "motion" },
  { id: "goto-xy", label: "go to x: 0 y: 0", category: "motion" },
  { id: "glide", label: "glide 1 secs to random position", category: "motion" },
  { id: "point-direction", label: "point in direction 90", category: "motion" },
  { id: "point-mouse", label: "point towards mouse-pointer", category: "motion" },
  { id: "change-x", label: "change x by 10", category: "motion" },
  { id: "set-x", label: "set x to 0", category: "motion" },
  { id: "change-y", label: "change y by 10", category: "motion" },
  { id: "set-y", label: "set y to 0", category: "motion" },
  { id: "bounce", label: "if on edge, bounce", category: "motion" },
  { id: "rotation-style", label: "set rotation style left-right", category: "motion" },
  { id: "x-position", label: "x position", category: "motion" },
  { id: "y-position", label: "y position", category: "motion" },
  { id: "direction", label: "direction", category: "motion" },
  // Looks
  { id: "say", label: "say Hello! for 2 seconds", category: "looks" },
  { id: "say-short", label: "say Hello!", category: "looks" },
  { id: "think", label: "think Hmm… for 2 seconds", category: "looks" },
  { id: "think-short", label: "think Hmm…", category: "looks" },
  { id: "grow", label: "change size by 10", category: "looks" },
  { id: "change-size", label: "change size by 10", category: "looks" },
  { id: "set-size", label: "set size to 100%", category: "looks" },
  { id: "next-costume", label: "next costume", category: "looks" },
  { id: "switch-costume", label: "switch costume to costume1", category: "looks" },
  { id: "clear-effects", label: "clear graphic effects", category: "looks" },
  { id: "change-effect", label: "change color effect by 25", category: "looks" },
  { id: "set-effect", label: "set color effect to 0", category: "looks" },
  { id: "front-layer", label: "go to front layer", category: "looks" },
  { id: "back-layer", label: "go back 1 layers", category: "looks" },
  { id: "show", label: "show", category: "looks" },
  { id: "hide", label: "hide", category: "looks" },
  // Sound
  { id: "pop", label: "start sound pop", category: "sound" },
  { id: "meow", label: "start sound meow", category: "sound" },
  { id: "drum", label: "play drum 1 for 0.25 beats", category: "sound" },
  { id: "play-sound", label: "play sound pop until done", category: "sound" },
  { id: "stop-sounds", label: "stop all sounds", category: "sound" },
  { id: "change-volume", label: "change volume by -10", category: "sound" },
  { id: "set-volume", label: "set volume to 100%", category: "sound" },
  { id: "rest-beats", label: "rest for 0.25 beats", category: "sound" },
  { id: "change-tempo", label: "change tempo by 20", category: "sound" },
  { id: "set-tempo", label: "set tempo to 60 bpm", category: "sound" },
  // Control
  { id: "wait", label: "wait 1 seconds", category: "control" },
  { id: "repeat", label: "repeat 3 times", category: "control" },
  { id: "forever", label: "forever", category: "control" },
  { id: "if", label: "if then", category: "control" },
  { id: "if-else", label: "if then else", category: "control" },
  { id: "wait-until", label: "wait until touching edge?", category: "control" },
  { id: "repeat-until", label: "repeat until touching edge?", category: "control" },
  { id: "stop-all", label: "stop all", category: "control" },
  { id: "create-clone", label: "create clone of myself", category: "control" },
  { id: "delete-clone", label: "delete this clone", category: "control" },
  { id: "start-clone", label: "when I start as a clone", category: "control", hat: true },
  // Sensing
  { id: "edge", label: "touching edge?", category: "sensing" },
  { id: "touch-color", label: "touching color?", category: "sensing" },
  { id: "color-touch", label: "color is touching?", category: "sensing" },
  { id: "ask", label: "ask What's your name? and wait", category: "sensing" },
  { id: "answer", label: "answer", category: "sensing" },
  { id: "key", label: "key space pressed?", category: "sensing" },
  { id: "mouse", label: "mouse x", category: "sensing" },
  { id: "mouse-y", label: "mouse y", category: "sensing" },
  { id: "mouse-down", label: "mouse down?", category: "sensing" },
  { id: "loudness", label: "loudness", category: "sensing" },
  { id: "timer", label: "timer", category: "sensing" },
  { id: "reset-timer", label: "reset timer", category: "sensing" },
  { id: "current-date", label: "current year", category: "sensing" },
  { id: "days-since", label: "days since 2000", category: "sensing" },
  { id: "username", label: "username", category: "sensing" },
  // Operators
  { id: "random", label: "pick random 1 to 10", category: "operators" },
  { id: "math", label: "2 + 3", category: "operators" },
  { id: "subtract", label: "5 - 2", category: "operators" },
  { id: "multiply", label: "2 * 3", category: "operators" },
  { id: "divide", label: "6 / 2", category: "operators" },
  { id: "compare", label: "2 > 1", category: "operators" },
  { id: "and", label: "touching edge? and mouse down?", category: "operators" },
  { id: "or", label: "touching edge? or mouse down?", category: "operators" },
  { id: "not", label: "not touching edge?", category: "operators" },
  { id: "join", label: "join hello world", category: "operators" },
  { id: "letter", label: "letter 1 of hello", category: "operators" },
  { id: "length", label: "length of hello", category: "operators" },
  { id: "contains", label: "hello contains h?", category: "operators" },
  { id: "mod", label: "10 mod 3", category: "operators" },
  { id: "round", label: "round 3.14", category: "operators" },
  { id: "abs", label: "abs of -10", category: "operators" },
  // Variables and lists
  { id: "set", label: "set score to 0", category: "variables" },
  { id: "change", label: "change score by 1", category: "variables" },
  { id: "show-variable", label: "show variable score", category: "variables" },
  { id: "hide-variable", label: "hide variable score", category: "variables" },
  { id: "add-list", label: "add thing to my list", category: "variables" },
  { id: "delete-list", label: "delete 1 of my list", category: "variables" },
  { id: "delete-all-list", label: "delete all of my list", category: "variables" },
  { id: "insert-list", label: "insert thing at 1 of my list", category: "variables" },
  { id: "replace-list", label: "replace item 1 of my list", category: "variables" },
  { id: "item-list", label: "item 1 of my list", category: "variables" },
  { id: "length-list", label: "length of my list", category: "variables" },
  { id: "contains-list", label: "my list contains thing?", category: "variables" },
  { id: "show-list", label: "show list my list", category: "variables" },
  { id: "hide-list", label: "hide list my list", category: "variables" },
  // Custom blocks
  { id: "jump", label: "define jump", category: "myblocks" },
  { id: "spin", label: "define spin", category: "myblocks" },
  { id: "dance", label: "define dance", category: "myblocks" },
  { id: "celebrate", label: "define celebrate", category: "myblocks" },
  { id: "reset-player", label: "define reset player", category: "myblocks" },
];

const BLOCK_IDS = BLOCKS.map((b) => b.id);
const REPEAT_TIMES = 3;
const isBlock = (value: string): value is BlockId => (BLOCK_IDS as string[]).includes(value);

const DEFAULT_SCRIPT: BlockId[] = ["when", "say", "move", "pop", "turn"];

export interface ScratchWorkspaceProps {
  /** Existing saved project to hydrate when the editor is opened from Projects. */
  projectId?: string | null;
}

function storedBlockIds(value: unknown): BlockId[] {
  const candidate = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? (() => {
          try {
            const parsed = JSON.parse(value) as unknown;
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })()
      : [];
  const valid = candidate.filter((item): item is BlockId => typeof item === "string" && isBlock(item));
  return valid.length ? valid : DEFAULT_SCRIPT;
}

function storedSpriteId(value: unknown): SpriteId {
  return SPRITES.some((item) => item.id === value) ? (value as SpriteId) : "cat";
}

function storedBackdropId(value: unknown): BackdropId {
  return BACKDROPS.some((item) => item.id === value) ? (value as BackdropId) : "meadow";
}

function projectTimestamp(row: ResourceRow) {
  const value = row.updated_at ?? row.created_at;
  if (!value) return "Not saved yet";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? "Saved recently" : `Saved ${date.toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" })}`;
}



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

/** The connector tabs that make blocks read like chunky Scratch puzzle pieces. */
function Notches({ color, hat }: { color: string; hat?: boolean }) {
  return (
    <>
      {!hat && (
        <span
          aria-hidden
          className="absolute -top-[9px] left-1/2 z-10 h-[14px] w-7 -translate-x-1/2 rounded-t-[7px] border-x-2 border-t-2 border-white/20 shadow-[0_-2px_0_rgba(0,0,0,0.12)]"
          style={{ backgroundColor: color }}
        />
      )}
      <span
        aria-hidden
        className="absolute -bottom-[9px] left-1/2 z-10 h-[14px] w-7 -translate-x-1/2 rounded-b-[7px] border-x-2 border-b-2 border-black/10 shadow-[0_2px_0_rgba(0,0,0,0.12)]"
        style={{ backgroundColor: color }}
      />
    </>
  );
}

const categoryOf = (id: BlockId) => CATEGORIES.find((c) => c.id === BLOCKS.find((b) => b.id === id)!.category)!;

function ScratchBlock({
  def,
  className,
  ...props
}: { def: BlockDef; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const cat = categoryOf(def.id);
  return (
    <button
      {...props}
      type="button"
      className={cn(
        "relative isolate block min-h-11 w-full overflow-visible rounded-[9px] px-4 py-2.5 text-left text-[13px] font-semibold leading-tight tracking-[-0.01em] shadow-[0_2px_0_rgba(0,0,0,0.18),0_5px_10px_rgba(0,0,0,0.08)] ring-1 ring-black/10 transition-transform duration-150 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60",
        def.hat && "rounded-t-[18px] pt-3",
        className,
      )}
      style={{ backgroundColor: cat.color, color: cat.ink }}
    >
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-[inherit] bg-white/20" />
      <Notches color={cat.color} hat={def.hat} />
      <span className="relative z-20">{def.label}</span>
    </button>
  );
}

/* ------------------------------ component ------------------------------ */

export function ScratchWorkspace({ projectId = null }: ScratchWorkspaceProps) {
  const queryClient = useQueryClient();
  const [category, setCategory] = useState<CategoryId>("motion");
  const [script, setScript] = useState<BlockId[]>(DEFAULT_SCRIPT);
  const [running, setRunning] = useState(false);
  const [spriteId, setSpriteId] = useState<SpriteId>("cat");
  const [backdropId, setBackdropId] = useState<BackdropId>("meadow");
  const [projectTitle, setProjectTitle] = useState("My Scratch project");
  const [savedProjectId, setSavedProjectId] = useState<string | null>(projectId);
  const [saveMessage, setSaveMessage] = useState("Not saved yet");
  const [saveNotice, setSaveNotice] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [hydratedProjectId, setHydratedProjectId] = useState<string | null>(null);
  const [sprite, setSprite] = useState<SpriteState>({ x: 0, rotation: 0, speech: null, bounce: false, scale: 1, thinking: false });

  const runningRef = useRef(false);

  const dragIndexRef = useRef<number | null>(null);
  const xRef = useRef(0);
  const mouseXRef = useRef(0);
  const scoreRef = useRef(0);
  const [dragActive, setDragActive] = useState(false);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
    const [score, setScore] = useState(0);

  const projectQuery = useQuery({
    queryKey: ["scratch-project", projectId],
    queryFn: () => resourceService.get("projects", projectId as string),
    enabled: Boolean(projectId),
  });

  const saveProject = useMutation({
    mutationFn: () => {
      const payload: ResourceRow = {
        title: projectTitle.trim() || "My Scratch project",
        kind: "scratch_project",
        status: "draft",
        script,
        sprite_id: spriteId,
        backdrop_id: backdropId,
        score: scoreRef.current,
        preview_asset: "/lesson-art/block_explorer_hero.png",
        editor: "scratch",
      };
      return savedProjectId
        ? resourceService.update("projects", savedProjectId, payload)
        : resourceService.create("projects", payload);
    },
    onMutate: () => setSaveNotice("saving"),
    onSuccess: (result) => {
      const saved = result.data as ResourceRow;
      const nextId = String(saved.id ?? savedProjectId ?? "");
      if (nextId) setSavedProjectId(nextId);
      setSaveMessage(projectTimestamp(saved));
      setSaveNotice("saved");
      queryClient.invalidateQueries({ queryKey: ["learner-scratch-projects"] });
      queryClient.invalidateQueries({ queryKey: ["scratch-project", nextId] });
    },
    onError: () => {
      setSaveNotice("error");
      setSaveMessage("Save failed — try again");
    },
  });

  useEffect(() => {
    if (!projectId || !projectQuery.data?.data || hydratedProjectId === projectId) return;
    const saved = projectQuery.data.data as ResourceRow;
    setProjectTitle(String(saved.title ?? "My Scratch project"));
    setScript(storedBlockIds(saved.script));
    setSpriteId(storedSpriteId(saved.sprite_id));
    setBackdropId(storedBackdropId(saved.backdrop_id));
    scoreRef.current = Number(saved.score ?? 0);
    setScore(scoreRef.current);
    setSavedProjectId(projectId);
    setSaveMessage(projectTimestamp(saved));
    setHydratedProjectId(projectId);
  }, [hydratedProjectId, projectId, projectQuery.data?.data]);

  useEffect(() => {
    if (!projectId) setHydratedProjectId("new");
  }, [projectId]);

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
            case "turn-left":
        setSprite((s) => ({ ...s, rotation: (s.rotation - 15 + 360) % 360 }));
        await sleep(420);
        break;
      case "goto-random": {
        const randomX = Math.round((Math.random() * 2 - 1) * 105);
        xRef.current = randomX;
        setSprite((s) => ({ ...s, x: randomX, speech: "New place!" }));
        await sleep(520);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      }
      case "goto-xy":
        xRef.current = 0;
        setSprite((s) => ({ ...s, x: 0, speech: "At x: 0, y: 0" }));
        await sleep(500);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "glide": {
        const randomX = Math.round((Math.random() * 2 - 1) * 105);
        xRef.current = randomX;
        setSprite((s) => ({ ...s, x: randomX }));
        await sleep(900);
        break;
      }
      case "point-direction":
        setSprite((s) => ({ ...s, rotation: 90, speech: "Pointing east!" }));
        await sleep(500);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "point-mouse":
        setSprite((s) => ({ ...s, rotation: mouseXRef.current >= 0 ? 90 : 270, speech: "I see you!" }));
        await sleep(500);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "change-x": {
        const nx = clamp(xRef.current + 22, -110, 110);
        xRef.current = nx;
        setSprite((s) => ({ ...s, x: nx }));
        await sleep(350);
        break;
      }
      case "set-x":
        xRef.current = 0;
        setSprite((s) => ({ ...s, x: 0 }));
        await sleep(300);
        break;
      case "change-y":
      case "set-y":
        setSprite((s) => ({ ...s, bounce: true, speech: block === "change-y" ? "Up we go!" : "Y reset!" }));
        await sleep(420);
        setSprite((s) => ({ ...s, bounce: false, speech: null }));
        break;
      case "bounce":
        xRef.current = xRef.current >= 0 ? -Math.abs(xRef.current) : Math.abs(xRef.current);
        setSprite((s) => ({ ...s, x: xRef.current, rotation: (s.rotation + 180) % 360, speech: "Boing!" }));
        await sleep(450);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "x-position":
        setSprite((s) => ({ ...s, speech: `x: ${Math.round(xRef.current)}` }));
        await sleep(550);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "y-position":
      case "direction":
        setSprite((s) => ({ ...s, speech: block === "direction" ? `Direction: ${s.rotation}°` : "y: 0" }));
        await sleep(550);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "say-short":
        setSprite((s) => ({ ...s, speech: pick(SPEECH_LINES.say) }));
        await sleep(900);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "think-short":
        setSprite((s) => ({ ...s, thinking: true, speech: pick(SPEECH_LINES.think) }));
        await sleep(900);
        setSprite((s) => ({ ...s, thinking: false, speech: null }));
        break;
      case "change-size":
        setSprite((s) => ({ ...s, scale: clamp(s.scale + 0.15, 0.5, 2.5), speech: "Bigger!" }));
        await sleep(420);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "set-size":
        setSprite((s) => ({ ...s, scale: 1, speech: "Back to 100%!" }));
        await sleep(420);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "next-costume":
      case "switch-costume":
        setSprite((s) => ({ ...s, bounce: true, speech: "New costume!" }));
        await sleep(420);
        setSprite((s) => ({ ...s, bounce: false, speech: null }));
        break;
      case "clear-effects":
      case "set-effect":
      case "set-volume":
      case "set-tempo":
      case "show":
      case "front-layer":
        setSprite((s) => ({ ...s, speech: "Done!" }));
        await sleep(400);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "hide":
        setSprite((s) => ({ ...s, speech: "Now you see me…" }));
        await sleep(400);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "change-effect":
      case "back-layer":
      case "stop-sounds":
      case "rest-beats":
      case "change-tempo":
      case "play-sound":
        setSprite((s) => ({ ...s, bounce: true, speech: "Action!" }));
        await sleep(400);
        setSprite((s) => ({ ...s, bounce: false, speech: null }));
        break;
      case "broadcast-wait":
        setSprite((s) => ({ ...s, speech: "Message sent!" }));
        await sleep(1000);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "forever":
      case "if":
      case "if-else":
      case "wait-until":
      case "repeat-until":
      case "stop-all":
      case "create-clone":
      case "delete-clone":
      case "start-clone":
        setSprite((s) => ({ ...s, speech: block === "forever" ? "Looping!" : "Control block" }));
        await sleep(450);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "touch-color":
      case "color-touch":
      case "key":
      case "mouse-y":
      case "mouse-down":
      case "timer":
      case "reset-timer":
      case "current-date":
      case "days-since":
      case "username":
      case "answer":
      case "ask":
        setSprite((s) => ({ ...s, speech: block === "ask" ? "What's your name?" : "Sensing!" }));
        await sleep(600);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "subtract":
      case "multiply":
      case "divide":
      case "compare":
      case "and":
      case "or":
      case "not":
      case "join":
      case "letter":
      case "length":
      case "contains":
      case "mod":
      case "round":
      case "abs":
        setSprite((s) => ({ ...s, speech: "Operators calculate!" }));
        await sleep(650);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "show-variable":
      case "hide-variable":
      case "add-list":
      case "delete-list":
      case "delete-all-list":
      case "insert-list":
      case "replace-list":
      case "item-list":
      case "length-list":
      case "contains-list":
      case "show-list":
      case "hide-list":
        setSprite((s) => ({ ...s, speech: "Data updated!" }));
        await sleep(550);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "dance":
      case "celebrate":
      case "jump":
      case "spin":
      case "reset-player":
        setSprite((s) => ({ ...s, bounce: true, rotation: (s.rotation + 90) % 360, speech: block === "reset-player" ? "Reset!" : "Let's dance!" }));
        await sleep(550);
        setSprite((s) => ({ ...s, bounce: false, speech: null }));
        break;
      case "when-key":
      case "when-clicked":
      case "when-backdrop":
      case "when-loudness":
      case "when-receive":
        setSprite((s) => ({ ...s, speech: "Event ready!" }));
        await sleep(650);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "rotation-style":
        setSprite((s) => ({ ...s, speech: "Left-right mode" }));
        await sleep(400);
        setSprite((s) => ({ ...s, speech: null }));
        break;
      case "repeat":
        break; // handled by the run loop below
      default:
        break;
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
  const activeCategory = CATEGORIES.find((cat) => cat.id === category)!;

  return (
    <section
      aria-label="Scratch coding workspace"
      className="overflow-hidden rounded-[18px] border border-[#cbd2d9] bg-[#eef1f4] shadow-[0_18px_45px_rgba(43,56,70,0.16)]"
    >
      {/* Scratch's familiar project chrome */}
      <div className="flex h-12 items-center justify-between bg-[#59636e] px-3 text-white">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f47945] text-[11px] font-black tracking-tight shadow-inner">
            LEA
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-bold leading-none">Scratch studio</p>
            <p className="mt-1 text-[10px] leading-none text-white/65">Create · test · share</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Undo" title="Undo" className="rounded-md p-1.5 text-white/80 hover:bg-white/10 hover:text-white">
            <Undo2 className="h-4 w-4" aria-hidden />
          </button>
          <button type="button" aria-label="Redo" title="Redo" className="rounded-md p-1.5 text-white/80 hover:bg-white/10 hover:text-white">
            <Redo2 className="h-4 w-4" aria-hidden />
          </button>
          <span className="mx-1 h-5 w-px bg-white/20" />
          <button type="button" aria-label="More project options" title="More options" className="rounded-md p-1.5 text-white/80 hover:bg-white/10 hover:text-white">
            <MoreHorizontal className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <div className="border-b border-[#d2d8de] bg-white px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex min-w-[190px] flex-1 items-center gap-2">
            <span className="sr-only">Project name</span>
            <input
              value={projectTitle}
              onChange={(event) => setProjectTitle(event.target.value)}
              aria-label="Project name"
              maxLength={80}
              className="min-w-0 flex-1 border-b border-transparent bg-transparent px-1 py-1 text-[13px] font-semibold text-[#39434e] outline-none hover:border-[#cbd2d9] focus:border-[#4c97ff]"
            />
          </label>
          <button type="button" className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-[#67717d] hover:bg-[#f0f2f4]">
            File <ChevronDown className="h-3 w-3" aria-hidden />
          </button>
          <button type="button" className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-[#67717d] hover:bg-[#f0f2f4]">
            Edit <ChevronDown className="h-3 w-3" aria-hidden />
          </button>
          <Link href="/learner/projects" className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold text-[#4d176e] hover:bg-[#f5eff8]">
            <FolderOpen className="h-3.5 w-3.5" aria-hidden /> Projects
          </Link>
          <button
            type="button"
            onClick={() => saveProject.mutate()}
            disabled={running || saveProject.isPending || !projectTitle.trim()}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#f47945] px-3 py-1.5 text-[11px] font-bold text-white shadow-sm hover:bg-[#d95d2e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-3.5 w-3.5" aria-hidden />
            {saveProject.isPending ? "Saving…" : "Save project"}
          </button>
          <span role={saveNotice === "error" ? "alert" : "status"} aria-live="polite" className={cn("ml-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold", saveNotice === "saved" && "bg-emerald-50 text-emerald-700", saveNotice === "saving" && "bg-[#f6eef9] text-[#4d176e]", saveNotice === "error" && "bg-rose-50 text-rose-700", saveNotice === "idle" && "text-[#8a949f]")}>
            <span className={cn("h-2 w-2 rounded-full", saveNotice === "error" ? "bg-rose-400" : saveNotice === "saved" ? "bg-emerald-400" : saveNotice === "saving" ? "bg-[#f47945]" : "bg-[#b9c1c9]")} />
            <span>{saveNotice === "saving" ? "Saving…" : saveNotice === "saved" ? "Saved to Projects" : saveNotice === "error" ? "Save failed — try again" : saveMessage}</span>
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-[#8a949f]">
          <MousePointer2 className="h-3 w-3" aria-hidden /> Drag blocks to build an idea. Save it when you want to come back later.
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(238px,0.9fr)_minmax(360px,1.3fr)_minmax(330px,0.95fr)]">
        {/* ---------------- left: category rail + block palette ---------------- */}
        <aside className="min-w-0 border-b border-[#cbd2d9] bg-[#edf0f3] lg:border-b-0 lg:border-r">
          <div className="border-b border-[#d2d8de] px-3 py-3">
            <p className="text-[13px] font-bold text-[#39434e]">Code blocks</p>
            <p className="mt-1 text-[10px] leading-relaxed text-[#7d8791]">Choose a category, then drag a block into your script.</p>
          </div>
          <div className="flex min-h-[535px] lg:min-h-[650px]">
            <div className="w-[104px] shrink-0 space-y-1.5 border-r border-[#d2d8de] bg-[#e1e5e9] p-2" role="tablist" aria-label="Block categories">
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
                      "flex min-h-[42px] w-full items-center gap-2 rounded-[7px] px-2 text-left text-[11px] font-bold leading-tight shadow-sm ring-1 ring-black/10 transition duration-150",
                      active ? "scale-[1.02] opacity-100 ring-2 ring-white/80" : "opacity-75 hover:opacity-100"
                    )}
                    style={{ backgroundColor: cat.color, color: cat.ink }}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="min-w-0 flex-1 bg-[#f8f9fa] p-3">
              <div className="mb-4 flex items-start justify-between gap-2">
                <div>
                  <p className="text-[13px] font-bold text-[#39434e]">{activeCategory.label}</p>
                  <p className="mt-1 text-[10px] text-[#8a949f]">Click to add · drag to use</p>
                </div>
                <span className="mt-0.5 h-3 w-3 shrink-0 rounded-full ring-2 ring-white" style={{ backgroundColor: activeCategory.color }} aria-hidden />
              </div>
              <div className="space-y-4">
                {paletteBlocks.map((def) => (
                  <ScratchBlock
                    key={def.id}
                    def={def}
                    draggable={!running}
                    onDragStart={(e) => handlePaletteDragStart(e, def.id)}
                    onClick={() => addBlock(def.id)}
                    disabled={running}
                    title={running ? undefined : "Drag into the scripts area or click to add"}
                  />
                ))}
              </div>
              <div className="mt-7 border-t border-dashed border-[#cdd3da] pt-3 text-[10px] leading-relaxed text-[#8a949f]">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#67717d]"><MousePointer2 className="h-3 w-3" aria-hidden /> Build your story</span>
                <p className="mt-1">Blocks snap together when you drop them into the script.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ---------------- center: scripts canvas ---------------- */}
        <main className="min-w-0 border-b border-[#cbd2d9] bg-[#eef1f4] lg:border-b-0 lg:border-r">
          <div className="flex min-h-[62px] items-center justify-between gap-3 border-b border-[#d2d8de] bg-[#f8f9fa] px-4 py-3">
            <div>
              <p className="text-[13px] font-bold text-[#39434e]">Scripts</p>
              <p className="mt-1 text-[10px] text-[#8a949f]">Snap blocks together to make the sprite move.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1.5 text-[10px] font-semibold text-[#8a949f] sm:inline-flex">
                <span className={cn("h-2 w-2 rounded-full", running ? "bg-emerald-500" : "bg-[#b9c1c9]")} />
                {running ? "Running" : `${script.length} blocks`}
              </span>
              <button
                type="button"
                onClick={clearScript}
                disabled={running}
                title="Clear script"
                className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[10px] font-bold text-[#6d7782] hover:bg-[#e9edf0] disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden /> Clear
              </button>
            </div>
          </div>
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
              "relative min-h-[535px] overflow-auto p-5 lg:min-h-[650px]",
              "[background-color:#ffffff] [background-image:linear-gradient(#e5e9ed_1px,transparent_1px),linear-gradient(90deg,#e5e9ed_1px,transparent_1px)] [background-size:24px_24px]",
              dragActive ? "ring-2 ring-inset ring-[#f47945]" : ""
            )}
          >
            <div className="pointer-events-none absolute right-4 top-4 rounded bg-white/75 px-2 py-1 text-[10px] font-medium text-[#a0a8b0] shadow-sm">
              {dragActive ? "Drop to snap" : "Scripts canvas"}
            </div>
            <div className="relative z-10 w-full max-w-[375px]">
              {script.length <= 1 ? (
                <div className="mb-3 flex min-h-[130px] items-center justify-center rounded-lg border-2 border-dashed border-[#cbd2d9] bg-white/55 px-5 text-center text-[12px] leading-relaxed text-[#8a949f]">
                  Drag blocks from the palette to start your script.
                </div>
              ) : null}
              {script.map((id, index) => {
                const def = BLOCKS.find((b) => b.id === id)!;
                return (
                  <Fragment key={`${id}-${index}`}>
                    {dropIndex === index && <DropMarker />}
                    <ScratchBlock
                      def={def}
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
                    />
                  </Fragment>
                );
              })}
              {dropIndex === script.length && <DropMarker />}
            </div>
          </div>
        </main>

        {/* ---------------- right: stage and asset trays ---------------- */}
        <aside className="min-w-0 bg-white">
          <div className="flex min-h-[62px] items-center justify-between border-b border-[#d2d8de] bg-[#f8f9fa] px-3 py-3">
            <div>
              <p className="text-[13px] font-bold text-[#39434e]">Stage</p>
              <p className="mt-1 text-[10px] text-[#8a949f]">Preview your project</p>
            </div>
            <button type="button" aria-label="Full screen stage" title="Full screen stage" className="rounded-md p-1.5 text-[#7d8791] hover:bg-[#e9edf0] hover:text-[#39434e]">
              <Maximize2 className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <div className="p-3">
            <div className="mb-2 flex items-center gap-2 border-b border-[#d9dee3] pb-2">
              <button
                type="button"
                onClick={() => void run()}
                disabled={running}
                aria-label="Run script"
                title="Run script"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4cbf56] shadow-[0_2px_0_#36933f] transition-transform hover:scale-105 active:translate-y-0.5 disabled:opacity-60"
              >
                <Flag className="h-4 w-4 text-white" aria-hidden />
              </button>
              <button
                type="button"
                onClick={stop}
                aria-label="Stop script"
                title="Stop script"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ed4c5c] shadow-[0_2px_0_#ba3542] transition-transform hover:scale-105 active:translate-y-0.5"
              >
                <Square className="h-3.5 w-3.5 fill-white text-white" aria-hidden />
              </button>
              <span className="ml-auto text-[10px] font-semibold text-[#8a949f]">{running ? "Playing" : "Ready"}</span>
            </div>

            <div className="overflow-hidden rounded-[7px] border-[6px] border-[#d7dde2] bg-white shadow-[0_2px_0_#aeb7c0,0_6px_16px_rgba(54,65,76,0.12)]">
              <div
                onPointerMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  mouseXRef.current = clamp(e.clientX - (rect.left + rect.width / 2), -110, 110);
                }}
                className="relative aspect-[4/3] min-h-[300px] w-full overflow-hidden bg-white"
              >
                <ActiveBackdrop />
                {score > 0 ? (
                  <div className="absolute right-2 top-2 z-10 rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-bold text-[#ef7e28] shadow-sm">
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
                            "absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl border border-[#cad1d8] bg-white px-3.5 py-1.5 text-xs font-medium text-[#39434e] shadow-md",
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
                        <ActiveSprite className="h-20 w-20 drop-shadow-md" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-[#d7dde2] bg-white px-2 py-1.5 text-[10px] text-[#8a949f]">
                <span>Stage</span>
                <span>{backdropId}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-t border-[#d2d8de] bg-[#f1f3f5] p-3 sm:grid-cols-[1.08fr_0.92fr] lg:grid-cols-1 xl:grid-cols-[1.08fr_0.92fr]">
            {/* sprite picker */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#68737e]">Sprites</p>
                <button type="button" title="Add sprite" className="rounded-md bg-white p-1 text-[#7d8791] ring-1 ring-[#d2d8de] hover:text-[#f47945]"><Plus className="h-3.5 w-3.5" aria-hidden /></button>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {SPRITES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSpriteId(item.id)}
                    title={`Use ${item.name}`}
                    className={cn(
                      "flex min-h-[70px] flex-col items-center justify-center gap-0.5 rounded-md border bg-white p-1 transition-colors",
                      spriteId === item.id ? "border-[#4c97ff] bg-[#eef7ff] ring-2 ring-[#4c97ff]/30" : "border-[#d2d8de] hover:border-[#4c97ff]"
                    )}
                  >
                    <item.render className="h-9 w-9" />
                    <span className="text-[10px] font-medium text-[#68737e]">{item.name}</span>
                  </button>
                ))}
                <div title="More sprites coming soon" className="flex min-h-[70px] items-center justify-center rounded-md border border-dashed border-[#c4cbd2] bg-white/60 text-[#8a949f]">
                  <Plus className="h-4 w-4" aria-hidden />
                </div>
              </div>
            </div>

            {/* backdrop picker */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#68737e]">Backdrops</p>
                <button type="button" title="Add backdrop" className="rounded-md bg-white p-1 text-[#7d8791] ring-1 ring-[#d2d8de] hover:text-[#f47945]"><Plus className="h-3.5 w-3.5" aria-hidden /></button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {BACKDROPS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setBackdropId(item.id)}
                    title={`Use ${item.name}`}
                    className={cn(
                      "group relative aspect-[4/3] overflow-hidden rounded-md transition-all",
                      backdropId === item.id ? "ring-2 ring-[#4c97ff]" : "ring-1 ring-black/10 hover:ring-[#4c97ff]"
                    )}
                  >
                    <item.render />
                    <span className="absolute bottom-1 left-1 rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-semibold text-white">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function DropMarker() {
  return <div className="my-1 h-1 rounded-full bg-orange-400" aria-hidden />;
}
