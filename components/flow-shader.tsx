"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/* ── WebGL Flow Shader ──
 * - fragment shader: flow/noise field + circular fade แบบ aspect-correct
 * - sync สีกับธีม (อ่าน CSS variables และฟังการเปลี่ยน class/style ของ <html>)
 * - guard ด้วย prefers-reduced-motion และ pause เมื่อ tab ซ่อน
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
uniform float uOp;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}
void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0); // aspect-correct space
  float d = length(p);
  float mask = 1.0 - smoothstep(0.22, 0.52, d); // circular fade

  vec2 q = vec2(fbm(p * 1.1 + uTime * 0.10), fbm(p * 1.1 - uTime * 0.08 + 3.7));
  float flow = fbm(p * 1.5 + q * 1.6 + uTime * 0.05);
  float flow2 = fbm(p * 2.6 - q * 2.2 + uTime * 0.07);

  vec3 col = mix(uA, uB, flow);
  col = mix(col, uC, smoothstep(0.55, 0.92, flow2) * 0.22);
  col = mix(col, uA, smoothstep(0.28, 0.5, d) * 0.42); // เก็บตรงกลางให้เงียบ

  gl_FragColor = vec4(col, mask * uOp);
}
`;

type RGB = [number, number, number];

function parseColor(value: string, fallback: RGB): RGB {
  const v = value.trim();
  if (!v) return fallback;
  if (v.startsWith("#")) {
    let hex = v.slice(1);
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const n = parseInt(hex, 16);
    if (hex.length === 6 && !Number.isNaN(n)) {
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((b) => b / 255) as RGB;
    }
  }
  const m = v.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const parts = m[1].split(",").map((s) => parseFloat(s));
    if (parts.length >= 3 && parts.every((p) => !Number.isNaN(p))) {
      return [parts[0] / 255, parts[1] / 255, parts[2] / 255] as RGB;
    }
  }
  return fallback;
}

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("[flow-shader] compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function FlowShader({
  fixed = true,
  opacity = 0.55,
  className,
}: {
  fixed?: boolean;
  opacity?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const opacityRef = useRef(opacity);
  opacityRef.current = opacity;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: false,
        antialias: false,
        powerPreference: "low-power",
      }) as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("[flow-shader] link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const loc = {
      uRes: gl.getUniformLocation(program, "uRes"),
      uTime: gl.getUniformLocation(program, "uTime"),
      uA: gl.getUniformLocation(program, "uA"),
      uB: gl.getUniformLocation(program, "uB"),
      uC: gl.getUniformLocation(program, "uC"),
      uOp: gl.getUniformLocation(program, "uOp"),
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const style = getComputedStyle(document.documentElement);
    let colorA = parseColor(style.getPropertyValue("--background"), [0.05, 0.04, 0.03]);
    let colorB = parseColor(style.getPropertyValue("--muted"), [0.13, 0.11, 0.1]);
    let colorC = parseColor(style.getPropertyValue("--accent"), [1, 0.42, 0.24]);

    const refreshColors = () => {
      const s = getComputedStyle(document.documentElement);
      colorA = parseColor(s.getPropertyValue("--background"), colorA);
      colorB = parseColor(s.getPropertyValue("--muted"), colorB);
      colorC = parseColor(s.getPropertyValue("--accent"), colorC);
    };

    const observer = new MutationObserver(() => refreshColors());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let running = !reduce;
    const start = performance.now();

    const render = (now: number) => {
      const t = (now - start) / 1000;
      gl.uniform2f(loc.uRes, canvas.width, canvas.height);
      gl.uniform1f(loc.uTime, t);
      gl.uniform3f(loc.uA, colorA[0], colorA[1], colorA[2]);
      gl.uniform3f(loc.uB, colorB[0], colorB[1], colorB[2]);
      gl.uniform3f(loc.uC, colorC[0], colorC[1], colorC[2]);
      gl.uniform1f(loc.uOp, opacityRef.current);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const loop = (now: number) => {
      render(now);
      raf = requestAnimationFrame(loop);
    };

    if (running) {
      raf = requestAnimationFrame(loop);
    } else {
      render(start); // ภาพนิ่ง 1 เฟรม (reduced motion)
    }

    const onVisibility = () => {
      const hidden = document.hidden;
      if (reduce) return;
      if (hidden) {
        cancelAnimationFrame(raf);
        running = false;
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      observer.disconnect();
      cancelAnimationFrame(raf);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none", className)}
      style={
        fixed
          ? { position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: -1 }
          : { position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }
      }
    />
  );
}
