import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Billboard, ContactShadows, Loader, OrbitControls, Text, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Twilight blue & gold palette for the hall
const BG_TOP = "#c3cfe8";
const BG_BOTTOM = "#2b3350";
const FOG = "#3c4568";
const FLOOR = "#2a3149";

/** Vertical gradient sky as the scene background (self-contained, no HDR). */
function Backdrop() {
  const { scene } = useThree();
  useEffect(() => {
    const c = document.createElement("canvas");
    c.width = 2;
    c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, BG_TOP);
    g.addColorStop(1, BG_BOTTOM);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 2, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const prev = scene.background;
    scene.background = tex;
    return () => {
      tex.dispose();
      scene.background = prev;
    };
  }, [scene]);
  return null;
}
import { clone as skeletonClone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { wedding } from "../config";
import { fetchAttendees } from "../lib/attendees";
import { useLang } from "../i18n";

const DEMO = ["Ayesha", "Bilal", "Fatima", "Hamza", "Zoya", "Imran", "Sana", "Yusuf", "Mariam", "Omar", "Hira", "Danish"];
const MAX_MODEL_GUESTS = 80; // beyond this, fall back to light figures for performance

const url = (p: string) => (p ? import.meta.env.BASE_URL + p : "");

/** Returns a normalized copy of a model: fit to width or height, centred X/Z, base on floor. */
function useFittedScene(src: string, opts: { width?: number; height?: number }) {
  const { scene } = useGLTF(src);
  return useMemo(() => {
    const clone = skeletonClone(scene);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const s = opts.height ? opts.height / (size.y || 1) : (opts.width ?? 1) / (size.x || 1);
    clone.scale.setScalar(s);
    clone.position.set(-center.x * s, -box.min.y * s, -center.z * s);
    const g = new THREE.Group();
    g.add(clone);
    return g;
  }, [scene, opts.width, opts.height]);
}

function FittedModel({
  src,
  width,
  height,
  position,
  rotationY = 0,
}: {
  src: string;
  width?: number;
  height?: number;
  position: [number, number, number];
  rotationY?: number;
}) {
  const obj = useFittedScene(src, { width, height });
  return <primitive object={obj} position={position} rotation={[0, rotationY, 0]} />;
}

/** Low-poly placeholder figure. */
function Figure({ body, position }: { body: string; position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.55, 0]}>
        <capsuleGeometry args={[0.22, 0.5, 6, 12]} />
        <meshStandardMaterial color={body} roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.17, 20, 20]} />
        <meshStandardMaterial color="#e8cfa0" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Couple() {
  const { models, stage, couple } = wedding.seating;
  const cz = couple.z;
  const cy = couple.y;
  const left = couple.x - couple.gap / 2;
  const right = couple.x + couple.gap / 2;

  return (
    <group>
      {models.stage ? (
        <FittedModel src={url(models.stage)} width={stage.width} position={[0, 0, stage.z]} rotationY={stage.rotationY} />
      ) : (
        <group position={[0, 0.4, stage.z]}>
          <mesh receiveShadow castShadow position={[0, -0.2, 0]}>
            <boxGeometry args={[8, 0.4, 4]} />
            <meshStandardMaterial color="#3a2a12" roughness={0.5} metalness={0.2} />
          </mesh>
        </group>
      )}

      {models.groom ? (
        <FittedModel src={url(models.groom)} height={couple.height} position={[left, cy, cz]} rotationY={couple.rotationY} />
      ) : (
        <Figure body="#0f3d2e" position={[left, cy, cz]} />
      )}
      {models.bride ? (
        <FittedModel src={url(models.bride)} height={couple.height} position={[right, cy, cz]} rotationY={couple.rotationY} />
      ) : (
        <Figure body="#c99bb0" position={[right, cy, cz]} />
      )}

      <Billboard position={[left, cy + couple.height + 0.35, cz]}>
        <Text fontSize={0.32} color="#f4d98a" anchorX="center" outlineWidth={0.008} outlineColor="#241a08">
          {wedding.groom}
        </Text>
      </Billboard>
      <Billboard position={[right, cy + couple.height + 0.35, cz]}>
        <Text fontSize={0.32} color="#f4d98a" anchorX="center" outlineWidth={0.008} outlineColor="#241a08">
          {wedding.bride}
        </Text>
      </Billboard>
    </group>
  );
}

function useGuestLayout(count: number) {
  const { x: offX, z: startZ } = wedding.seating.guests;
  return useMemo(() => {
    const perRow = Math.max(4, Math.min(14, Math.ceil(Math.sqrt(count * 1.8))));
    const spacing = 1.6;
    return Array.from({ length: count }, (_, i) => {
      const row = Math.floor(i / perRow);
      const col = i % perRow;
      const inRow = Math.min(perRow, count - row * perRow);
      const x = offX + (col - (inRow - 1) / 2) * spacing;
      // startZ is the front row (nearest the stage); rows extend toward the camera.
      const z = startZ + row * spacing;
      return [x, z] as [number, number];
    });
  }, [count, offX, startZ]);
}

/** Guests rendered with the supplied 3D model (cloned per person). */
function GuestModels({ names }: { names: string[] }) {
  const { models, guests } = wedding.seating;
  const base = useFittedScene(url(models.guest), { height: guests.height });
  const layout = useGuestLayout(names.length);
  const clones = useMemo(() => layout.map(() => skeletonClone(base)), [base, layout]);

  return (
    <group>
      {clones.map((obj, i) => (
        <primitive key={i} object={obj} position={[layout[i][0], guests.y, layout[i][1]]} rotation={[0, guests.rotationY, 0]} />
      ))}
      {layout.map(([x, z], i) => (
        <Billboard key={i} position={[x, guests.y + guests.height + 0.25, z]}>
          <Text fontSize={0.2} color="#f7f0e1" anchorX="center" outlineWidth={0.006} outlineColor="#0a2419">
            {names[i]}
          </Text>
        </Billboard>
      ))}
    </group>
  );
}

/** Light placeholder guests (capsule + head) with labels. */
function GuestFigures({ names }: { names: string[] }) {
  const gy = wedding.seating.guests.y;
  const layout = useGuestLayout(names.length);
  return (
    <group>
      {layout.map(([x, z], i) => (
        <Figure key={i} body="#14503c" position={[x, gy, z]} />
      ))}
      {layout.map(([x, z], i) => (
        <Billboard key={i} position={[x, gy + 1.55, z]}>
          <Text fontSize={0.2} color="#f7f0e1" anchorX="center" outlineWidth={0.006} outlineColor="#0a2419">
            {names[i]}
          </Text>
        </Billboard>
      ))}
    </group>
  );
}

function Guests({ names }: { names: string[] }) {
  const useModel = Boolean(wedding.seating.models.guest) && names.length <= MAX_MODEL_GUESTS;
  return useModel ? <GuestModels names={names} /> : <GuestFigures names={names} />;
}

export function SeatingPage() {
  const { t } = useLang();
  const [names, setNames] = useState<string[] | null>(null);

  useEffect(() => {
    fetchAttendees().then(setNames);
  }, []);

  const loading = names === null;
  const display = names && names.length > 0 ? names : import.meta.env.DEV ? DEMO : [];
  const empty = !loading && (names?.length ?? 0) === 0 && !import.meta.env.DEV;

  return (
    <div className="fixed inset-0 bg-[#2a3149]">
      <Canvas shadows camera={{ position: [0, 7, 16], fov: 45 }}>
        <Backdrop />
        <fog attach="fog" args={[FOG, 24, 56]} />

        <ambientLight intensity={0.65} />
        <hemisphereLight args={["#cdd6ea", "#20263a", 0.6]} />
        <directionalLight position={[8, 14, 8]} intensity={1.25} color="#fff1d6" castShadow shadow-mapSize={[1024, 1024]} />
        <spotLight position={[0, 11, -4]} angle={0.6} penumbra={0.6} intensity={1.6} color="#ffd98f" castShadow />

        <Suspense fallback={null}>
          <Couple />
          <Guests names={display} />
        </Suspense>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <circleGeometry args={[40, 48]} />
          <meshStandardMaterial color={FLOOR} roughness={0.85} metalness={0.15} />
        </mesh>
        <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={44} blur={2.5} far={12} />

        <OrbitControls target={[0, 1, -3]} minDistance={6} maxDistance={36} maxPolarAngle={Math.PI / 2.05} enablePan={false} />
      </Canvas>

      <Loader />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center pt-6">
        <h1 className="rounded-full bg-black/25 px-5 py-1.5 font-display text-2xl tracking-[0.14em] text-[#ffe8c0] backdrop-blur-sm">
          {t.hallTitle}
        </h1>
      </div>

      <a
        href="#/"
        className="absolute left-4 top-4 z-10 rounded-full border border-[#d4af37]/50 bg-black/30 px-4 py-2 font-serif text-sm tracking-wide text-[#f4d98a] backdrop-blur-sm"
      >
        ← {t.backToInvite}
      </a>

      {empty && (
        <div className="pointer-events-none absolute inset-x-0 bottom-16 flex justify-center">
          <p className="rounded-full bg-black/40 px-5 py-2 text-sm text-[#f7f0e1] backdrop-blur-sm">{t.hallEmpty}</p>
        </div>
      )}
    </div>
  );
}

export default SeatingPage;
