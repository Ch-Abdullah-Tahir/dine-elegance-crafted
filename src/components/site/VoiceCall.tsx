import { useCallback, useEffect, useRef, useState } from "react";
import { Room, RoomEvent, Track, type RemoteTrack } from "livekit-client";
import { AudioLines, Clock, Mic, MicOff, Phone, PhoneOff, Volume2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createLiveKitCallToken } from "@/lib/livekit-token.functions";
import { VoiceSpectrum } from "./VoiceSpectrum";
import { useOnline } from "@/hooks/use-online";

type Phase = "ready" | "connecting" | "microphone" | "live" | "ended";
type Session = {
  room: Room;
  context: AudioContext | null;
  startedAt: number | null;
  controller: AbortController;
};

const callTimeouts = {
  connecting: [
    30_000,
    "Couldn’t connect to the call. Check your internet connection and try again.",
  ],
  microphone: [45_000, "Microphone access timed out. Allow your microphone and try again."],
  agent: [30_000, "Sage didn’t join in time. Try calling again or use the reservation form."],
  reconnecting: [
    20_000,
    "The connection was lost and the call ended. You can call again once you’re online.",
  ],
} as const;

function elapsedSeconds(startedAt: number) {
  return Math.floor((performance.now() - startedAt) / 1000);
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return [minutes, seconds % 60].map((value) => String(value).padStart(2, "0")).join(":");
}

function release(session: Session | null) {
  if (!session) return;
  session.controller.abort();
  void session.room.disconnect();
  if (session.context && session.context.state !== "closed") void session.context.close();
}

export function VoiceCall() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="fixed right-4 bottom-5 z-40 inline-flex max-w-[calc(100vw-2rem)] cursor-pointer items-center gap-3 rounded-full border border-[#849786] bg-[#304a40] py-2 pr-5 pl-2 text-sm font-medium text-[#faf4e8] shadow-lg transition-colors hover:bg-[#243c32] focus-visible:outline-2 focus-visible:outline-offset-4 sm:right-6"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#dfcca9] text-[#3a4638]">
            <AudioLines size={18} aria-hidden="true" />
          </span>
          Talk to Sage, our AI host
        </button>
      </DialogTrigger>
      {open && <CallPanel />}
    </Dialog>
  );
}

function CallPanel() {
  const sessionRef = useRef<Session | null>(null);
  const speaker = useRef<HTMLAudioElement>(null);
  const [phase, setPhase] = useState<Phase>("ready");
  const [context, setContext] = useState<AudioContext | null>(null);
  const [remote, setRemote] = useState<RemoteTrack | null>(null);
  const [microphone, setMicrophone] = useState<MediaStreamTrack | null>(null);
  const [muted, setMuted] = useState(false);
  const [changingMic, setChangingMic] = useState(false);
  const [needsSound, setNeedsSound] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [error, setError] = useState("");
  const [duration, setDuration] = useState<number | null>(null);
  const online = useOnline();

  // Once both sides join, keep counting through silence, mute, and reconnection.
  const timingCall = phase === "live" && (remote !== null || duration !== null);
  useEffect(() => {
    const session = sessionRef.current;
    if (!timingCall || !session) return;
    const startedAt = (session.startedAt ??= performance.now());
    setDuration(elapsedSeconds(startedAt));
    const timer = window.setInterval(() => setDuration(elapsedSeconds(startedAt)), 1000);
    return () => window.clearInterval(timer);
  }, [timingCall]);

  useEffect(
    () => () => {
      const session = sessionRef.current;
      sessionRef.current = null;
      release(session);
    },
    [],
  );

  useEffect(() => {
    const player = speaker.current;
    if (!remote || !player) return;
    remote.attach(player);
    return () => {
      remote.detach(player);
    };
  }, [remote]);

  const endCall = useCallback((message = "") => {
    const session = sessionRef.current;
    if (session && session.startedAt !== null) setDuration(elapsedSeconds(session.startedAt));
    sessionRef.current = null;
    release(session);
    setRemote(null);
    setMicrophone(null);
    setContext(null);
    setMuted(false);
    setChangingMic(false);
    setNeedsSound(false);
    setReconnecting(false);
    setError(message);
    setPhase("ended");
  }, []);

  const interrupted = reconnecting || !online;
  const waitingFor =
    phase === "ready" || phase === "ended"
      ? null
      : interrupted
        ? "reconnecting"
        : phase === "live"
          ? remote
            ? null
            : "agent"
          : phase;

  useEffect(() => {
    const session = sessionRef.current;
    if (!session || !waitingFor) return;
    const [delay, message] = callTimeouts[waitingFor];
    const timer = window.setTimeout(() => {
      if (sessionRef.current === session) endCall(message);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [waitingFor, endCall]);

  async function startCall() {
    if (sessionRef.current || !navigator.onLine) return;
    setDuration(null);
    setError("");
    setPhase("connecting");
    let room: Room;
    try {
      room = new Room();
    } catch {
      setError(
        "This browser couldn’t start a voice call. Try opening the site in a browser with microphone support.",
      );
      setPhase("ready");
      return;
    }
    let audioContext: AudioContext | null = null;
    try {
      audioContext = new AudioContext();
      void audioContext.resume().catch(() => {});
    } catch {
      // Voice calls can still work on a browser without Web Audio meters.
    }
    const session: Session = {
      room,
      context: audioContext,
      startedAt: null,
      controller: new AbortController(),
    };
    sessionRef.current = session;
    setContext(audioContext);
    const isCurrent = () => sessionRef.current === session;

    room.on(RoomEvent.TrackSubscribed, (track, _publication, participant) => {
      if (isCurrent() && participant.isAgent && track.kind === Track.Kind.Audio) setRemote(track);
    });
    room.on(RoomEvent.TrackUnsubscribed, (track) => {
      if (isCurrent()) setRemote((current) => (current === track ? null : current));
    });
    room.on(RoomEvent.AudioPlaybackStatusChanged, () => {
      if (isCurrent()) setNeedsSound(!room.canPlaybackAudio);
    });
    const reconnect = () => {
      if (isCurrent()) setReconnecting(true);
    };
    room.on(RoomEvent.Reconnecting, reconnect);
    room.on(RoomEvent.SignalReconnecting, reconnect);
    room.on(RoomEvent.Reconnected, () => {
      if (isCurrent()) setReconnecting(false);
    });
    try {
      const { serverUrl, participantToken } = await createLiveKitCallToken({
        signal: session.controller.signal,
      });
      if (!isCurrent()) return;
      await room.connect(serverUrl, participantToken);
      if (!isCurrent()) {
        void room.disconnect();
        return;
      }
      room.on(RoomEvent.Disconnected, () => {
        if (isCurrent())
          endCall("The call disconnected. You can start a new call when you’re online.");
      });
      setPhase("microphone");
      const publication = await room.localParticipant.setMicrophoneEnabled(true);
      if (!isCurrent()) {
        publication?.audioTrack?.stop();
        return;
      }
      if (!publication?.audioTrack) throw new Error("No microphone is available.");
      setMicrophone(publication.audioTrack.mediaStreamTrack);
      setNeedsSound(!room.canPlaybackAudio);
      setPhase("live");
    } catch (cause) {
      if (!isCurrent()) return;
      if (cause instanceof Error && cause.name === "NotAllowedError") {
        endCall("Allow microphone access in your browser, then start the call again.");
      } else {
        endCall("Couldn’t start the call. Check your connection and microphone, then try again.");
      }
    }
  }

  async function toggleMicrophone() {
    const session = sessionRef.current;
    if (!session || changingMic) return;
    setChangingMic(true);
    setError("");
    try {
      const publication = await session.room.localParticipant.setMicrophoneEnabled(muted);
      if (sessionRef.current !== session) return;
      setMuted(!session.room.localParticipant.isMicrophoneEnabled);
      setMicrophone(publication?.audioTrack?.mediaStreamTrack ?? null);
    } catch {
      if (sessionRef.current === session)
        setError("Couldn’t change your microphone. Please try again.");
    } finally {
      if (sessionRef.current === session) setChangingMic(false);
    }
  }

  async function enableSound() {
    const session = sessionRef.current;
    if (!session) return;
    try {
      if (session.context?.state === "suspended") void session.context.resume().catch(() => {});
      await session.room.startAudio();
      if (sessionRef.current === session) setNeedsSound(!session.room.canPlaybackAudio);
    } catch {
      if (sessionRef.current === session)
        setError("Allow audio playback in your browser and try again.");
    }
  }

  const pending = phase === "connecting" || phase === "microphone";
  const status = {
    ready: "Ready to call",
    connecting: "Connecting…",
    microphone: "Waiting for microphone access…",
    live: remote ? "Call connected" : "Waiting for Sage…",
    ended: "Call ended",
  }[phase];
  const MicIcon = muted ? MicOff : Mic;
  return (
    <DialogContent className="w-[calc(100vw-2rem)] max-w-md max-h-[calc(100dvh-2rem)] gap-5 overflow-y-auto rounded-2xl border-[#cfc8b7] bg-[#f3eee3] p-6 text-[#303c33] sm:rounded-2xl sm:p-8">
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 pr-5 text-xs font-medium text-[#4b6153]">
          <span role="status" className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className={
                phase === "live" && remote && !interrupted
                  ? "size-2 rounded-full bg-[#517656]"
                  : "size-2 rounded-full border border-current"
              }
            />
            {!online
              ? sessionRef.current
                ? "Internet connection lost. Waiting to reconnect…"
                : "You’re offline"
              : reconnecting
                ? "Reconnecting…"
                : status}
          </span>
          {duration !== null && (
            <span
              role="timer"
              aria-label="Call duration"
              className="inline-flex items-center gap-1.5 tabular-nums"
            >
              <Clock size={13} aria-hidden="true" />
              {formatDuration(duration)}
            </span>
          )}
        </div>
        <DialogTitle className="pr-3 font-display text-4xl leading-none font-medium">
          Sage, Dine Cottage’s AI host
        </DialogTitle>
        <DialogDescription className="mt-3 leading-relaxed text-[#525b50]">
          Ask about the menu, explore private dining, or reserve a table.
        </DialogDescription>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <VoiceSpectrum
          side="concierge"
          context={context}
          track={remote?.mediaStreamTrack ?? null}
        />
        <VoiceSpectrum side="guest" context={context} track={microphone} muted={muted} />
      </div>
      <audio ref={speaker} autoPlay playsInline />
      {error && (
        <p role="alert" className="text-sm text-[#883c32]">
          {error}
        </p>
      )}
      {needsSound && (
        <button
          type="button"
          onClick={enableSound}
          className="flex items-center gap-2 text-sm font-medium underline"
        >
          <Volume2 size={16} />
          Enable sound
        </button>
      )}
      {phase === "live" ? (
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={changingMic}
            onClick={toggleMicrophone}
            className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#91a192] text-sm font-medium hover:bg-[#e2e9df] disabled:opacity-60"
          >
            <MicIcon size={16} aria-hidden="true" />
            {muted ? "Unmute" : "Mute"}
          </button>
          <button
            type="button"
            onClick={() => endCall()}
            className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#84483b] text-sm font-medium text-white hover:bg-[#71392f]"
          >
            <PhoneOff size={16} aria-hidden="true" /> End call
          </button>
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={pending ? () => endCall() : startCall}
            disabled={!pending && !online}
            className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#304a40] text-sm font-medium text-[#faf4e8] hover:bg-[#243c32]"
          >
            {pending ? (
              <PhoneOff size={16} aria-hidden="true" />
            ) : (
              <Phone size={16} aria-hidden="true" />
            )}
            {pending ? "Cancel call" : phase === "ended" ? "Call again" : "Start voice call"}
          </button>
          {!pending && (
            <p className="mt-2.5 text-center text-xs text-[#525b50]">
              This call uses your browser’s microphone.
            </p>
          )}
        </div>
      )}
    </DialogContent>
  );
}
