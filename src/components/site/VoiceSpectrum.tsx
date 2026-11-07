import { useEffect, useRef, useState } from "react";
import { AudioLines, Mic } from "lucide-react";

type Props = {
  side: "concierge" | "guest";
  context: AudioContext | null;
  track: MediaStreamTrack | null;
  muted?: boolean;
};

const bands = 24;

export function VoiceSpectrum({ side, context, track, muted = false }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [speaking, setSpeaking] = useState(false);
  const guest = side === "guest";
  const color = guest ? "#527166" : "#906433";
  const Icon = guest ? Mic : AudioLines;

  useEffect(() => {
    const brush = canvas.current?.getContext("2d");
    if (!brush) return;
    brush.fillStyle = color;
    function draw(heights: number[]) {
      if (!brush) return;
      brush.clearRect(0, 0, 240, 48);
      heights.forEach((height, i) => brush.fillRect(i * 10 + 2, (48 - height) / 2, 6, height));
    }
    const heights = Array<number>(bands).fill(2);
    draw(heights);
    setSpeaking(false);
    if (!context || !track || muted) return;

    const analyser = context.createAnalyser();
    analyser.fftSize = 1024;
    analyser.minDecibels = -75;
    analyser.maxDecibels = -20;
    analyser.smoothingTimeConstant = 0.65;
    const source = context.createMediaStreamSource(new MediaStream([track]));
    source.connect(analyser);
    const bins = new Uint8Array(analyser.frequencyBinCount);
    // Space the bars by pitch across the main speech range (100 Hz to 6 kHz).
    const edges = Array.from({ length: bands + 1 }, (_, i) =>
      Math.min(
        bins.length - 1,
        Math.floor((100 * 60 ** (i / bands) * analyser.fftSize) / context.sampleRate),
      ),
    );
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer = window.setInterval(() => {
      analyser.getByteFrequencyData(bins);
      let peak = 0;
      for (let i = 0; i < bands; i++) {
        const first = edges[i]!;
        const end = Math.max(first + 1, edges[i + 1]!);
        let sum = 0;
        for (let bin = first; bin < end; bin++) sum += bins[bin]!;
        const level = sum / ((end - first) * 255);
        peak = Math.max(peak, level);
        heights[i] = motion.matches ? 2 : 2 + level * 44;
      }
      setSpeaking(peak > 0.24);
      draw(heights);
    }, 80);
    return () => {
      window.clearInterval(timer);
      source.disconnect();
      analyser.disconnect();
    };
  }, [color, context, muted, track]);

  return (
    <div className={guest ? "rounded-xl bg-[#e2e9df] p-4" : "rounded-xl bg-[#ece2cf] p-4"}>
      <div className="flex items-center gap-2 text-sm font-medium">
        <Icon aria-hidden="true" size={16} style={{ color }} />
        {guest ? "You" : "Sage"}
      </div>
      <canvas
        ref={canvas}
        width={240}
        height={48}
        className="my-3 block h-9 w-full"
        aria-hidden="true"
      />
      <p className="text-xs text-muted-foreground">
        {muted ? "Muted" : !track ? "Standby" : speaking ? "Speaking" : "Listening"}
      </p>
    </div>
  );
}
