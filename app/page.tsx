"use client";
import { useMemo, useState } from "react";
import { estimateCO2eReduction, estimateLHV, estimateNOxIndex } from "@/lib/calc";
import BrandLogo from "@/components/BrandLogo";
import ThemeToggle from "@/components/ThemeToggle";
import AnimatedNumber from "@/components/AnimatedNumber";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function Page(){
  const [h2,setH2]=useState(30);
  const [tClass,setTClass]=useState<"aero"|"frame">("frame");
  const LHV=50;
  const lhv=estimateLHV({h2BlendPct:h2,turbineClass:tClass,baseLHV_MJkg:LHV});
  const nox=estimateNOxIndex({h2BlendPct:h2,turbineClass:tClass,baseLHV_MJkg:LHV});
  const co2=estimateCO2eReduction({h2BlendPct:h2,turbineClass:tClass,baseLHV_MJkg:LHV});
  const chartData=useMemo(()=>Array.from({length:21},(_,i)=>i*5).map(p=>({blend:p,co2:(p/100)*100})),[]);

  return(<main className='min-h-screen bg-gradient-to-b from-primary/10 to-white dark:from-primary/10 dark:to-neutral-950'>
    <div className='sticky top-0 z-10 backdrop-blur bg-white/70 dark:bg-neutral-900/70 border-b dark:border-neutral-800'>
      <div className='max-w-5xl mx-auto px-6 py-3 flex items-center justify-between'>
        <BrandLogo/>
        <div className='flex items-center gap-3'>
          <a className='px-3 py-1 rounded bg-primary text-white' href='https://www.greengasturbines.com' target='_blank'>Website</a>
          <ThemeToggle/>
        </div>
      </div>
    </div>
    <div className='max-w-5xl mx-auto p-6 space-y-6'>
      <h1 className='text-3xl font-bold'>Hydrogen Blend Calculator (demo)</h1>
      <div className='card'>
        <label className='block text-sm font-medium'>H₂ blend (%)</label>
        <input type='range' min={0} max={100} value={h2} onChange={e=>setH2(parseInt(e.target.value))} className='w-full'/>
        <div className='flex items-center gap-2 mt-2'>
          <button onClick={()=>setH2(Math.max(0,h2-10))} className='px-2 py-1 border rounded dark:border-neutral-700'>-10</button>
          <div className='text-lg font-semibold'>{h2}%</div>
          <button onClick={()=>setH2(Math.min(100,h2+10))} className='px-2 py-1 border rounded dark:border-neutral-700'>+10</button>
        </div>
        <div className='mt-4 flex gap-4 items-center'><label className='text-sm'>Turbine class:</label>
          <select value={tClass} onChange={e=>setTClass(e.target.value as any)} className='border rounded px-2 py-1 dark:bg-neutral-900 dark:border-neutral-700'>
            <option value='frame'>Frame</option><option value='aero'>Aeroderivative</option>
          </select>
        </div>
      </div>
      <div className='grid md:grid-cols-3 gap-4'>
        <div className='card'><div className='text-sm text-gray-500 dark:text-gray-400'>Estimated LHV</div><div className='kpi'><AnimatedNumber value={lhv} decimals={1}/> MJ/kg</div></div>
        <div className='card'><div className='text-sm text-gray-500 dark:text-gray-400'>NOₓ index (relative)</div><div className='kpi'><AnimatedNumber value={nox} decimals={2}/>×</div></div>
        <div className='card'><div className='text-sm text-gray-500 dark:text-gray-400'>CO₂e reduction</div><div className='kpi'><AnimatedNumber value={co2} decimals={0}/> %</div></div>
      </div>
      <div className='card'>
        <div className='font-medium mb-2'>CO₂e reduction vs blend</div>
        <div className='h-72'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray='3 3'/>
              <XAxis dataKey='blend' unit='%' /><YAxis unit='%' /><Tooltip/>
              <Line type='monotone' dataKey='co2' dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className='text-xs text-gray-500 dark:text-gray-400 mt-2'>Current blend: <span className='font-semibold'>{h2}%</span> → <span className='font-semibold'>{co2.toFixed(0)}%</span> CO₂e reduction (illustrative).</div>
      </div>
      <div className='text-xs text-gray-500 dark:text-gray-400'>Illustrative only — replace formulas in <code>lib/calc.ts</code> with validated models.</div>
    </div>
  </main>);
}
