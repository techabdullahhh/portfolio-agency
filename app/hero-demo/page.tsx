"use client";

import CapabilitiesPill from "@/components/hero/CapabilitiesPill";
import CapsuleWave from "@/components/hero/CapsuleWave";

export default function HeroDemoPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-50 px-4 py-16">
      <section className="w-full max-w-3xl text-center">
        <CapabilitiesPill
          items={[
            "Development",
            "Custom Websites",
            "Realtime Dashboards",
            "Autonomous Agents",
            "Security",
          ]}
          speed={44}
          pillClassName="mx-auto max-w-full"
        />

        <div className="mt-4">
          <CapsuleWave
            className="w-full"
            height={84}
            waves={2}
            amplitude={12}
          />
        </div>
      </section>
    </main>
  );
}

