import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings2, 
  Cpu, 
  Database, 
  Play, 
  Square, 
  RotateCcw, 
  AlertTriangle,
  Scissors,
  Activity,
  BarChart3,
  CheckCircle2,
  LayoutDashboard,
  ArrowRight,
  Monitor,
  Smartphone,
  Server,
  TrendingUp,
  History
} from 'lucide-react';
import { cn } from './lib/utils';
import { ControlMode, INITIAL_MACHINE_STATE, MachineState, MODE_DESCRIPTIONS } from './constants';

// --- Components ---

const RebarVisualizer = ({ state }: { state: MachineState }) => {
  const [isCutting, setIsCutting] = useState(false);
  const prevCount = useRef(state.count);

  useEffect(() => {
    if (state.count > prevCount.current) {
      setIsCutting(true);
      const timer = setTimeout(() => setIsCutting(false), 500);
      prevCount.current = state.count;
      return () => clearTimeout(timer);
    }
    prevCount.current = state.count;
  }, [state.count]);

  return (
    <div className="relative h-48 bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden flex items-center px-12 shadow-2xl">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* Conveyor Belt */}
      <div className="absolute inset-x-0 bottom-10 h-6 bg-zinc-900 border-y border-zinc-800 flex overflow-hidden shadow-inner">
        {[...Array(30)].map((_, i) => (
          <motion.div 
            key={i}
            className="w-10 h-full border-r border-zinc-800 shrink-0"
            animate={state.isRunning ? { x: [0, 40] } : {}}
            transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }}
          />
        ))}
      </div>

      {/* Rebar Shadow */}
      <motion.div 
        className="absolute bottom-16 h-2 bg-black/40 blur-md rounded-full z-0"
        style={{ width: `${(state.length / 12) * 100}%` }}
      />

      {/* Rebar (Enhanced Styling) */}
      <motion.div 
        className="h-6 relative z-10 rounded-sm shadow-lg overflow-hidden border-y border-white/10"
        style={{ 
          width: `${(state.length / 12) * 100}%`,
          backgroundColor: '#92400e', // Amber-800 (Rusty Steel)
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(0,0,0,0.4) 12px, rgba(0,0,0,0.4) 15px)',
          boxShadow: 'inset 0 4px 6px rgba(255,255,255,0.2), inset 0 -4px 6px rgba(0,0,0,0.3), 0 10px 15px -3px rgba(0,0,0,0.5)'
        }}
      >
        {/* Metallic Shine */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20" />
      </motion.div>

      {/* Sparks / Cut Effect */}
      <AnimatePresence>
        {isCutting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 -translate-y-1/2 z-30 pointer-events-none"
            style={{ left: `${(state.targetLength / 12) * 100}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="relative flex items-center justify-center">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-6 bg-yellow-400 rounded-full"
                  initial={{ rotate: i * 30, y: 0, scale: 1 }}
                  animate={{ y: -60, x: (Math.random() - 0.5) * 40, opacity: 0, scale: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              ))}
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 2, 0], opacity: [0, 1, 0] }}
                className="w-12 h-12 bg-white rounded-full blur-xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cutter Head (Dynamic Position) */}
      <motion.div 
        className="absolute top-0 bottom-0 w-1 bg-zinc-800/50 z-20"
        animate={{ left: `${(state.targetLength / 12) * 100}%` }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <motion.div 
          className="absolute top-1/2 -translate-y-1/2 -left-8 w-16 h-16 bg-zinc-800 border-2 border-zinc-600 rounded-xl flex items-center justify-center text-zinc-300 shadow-2xl"
          animate={isCutting ? { 
            y: ["-50%", "0%", "-50%"],
            scale: [1, 1.1, 1],
            backgroundColor: ["#27272a", "#3f3f46", "#27272a"]
          } : {}}
          transition={{ duration: 0.3, ease: "backOut" }}
        >
          <Scissors size={28} className={cn("transition-colors duration-200", isCutting ? "text-yellow-400" : "text-zinc-400")} />
          
          {/* Blade Visual */}
          <motion.div 
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-zinc-400 rounded-full"
            animate={isCutting ? { opacity: [0, 1, 0], y: [0, 20, 0] } : { opacity: 0 }}
          />
          
          {/* Position Label */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-zinc-800 rounded text-[8px] font-bold text-zinc-500 whitespace-nowrap border border-zinc-700">
            절단점: {state.targetLength.toFixed(1)}m
          </div>
        </motion.div>
      </motion.div>

      {/* Labels */}
      <div className="absolute top-4 left-6 flex gap-4">
        <div className="px-3 py-1 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg text-[10px] font-mono text-zinc-400 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          길이: <span className="text-white font-bold">{state.length.toFixed(2)}m</span>
        </div>
        <div className="px-3 py-1 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg text-[10px] font-mono text-zinc-400 flex items-center gap-2">
          <div className={cn("w-1.5 h-1.5 rounded-full", state.temp > 40 ? "bg-red-500 animate-pulse" : "bg-emerald-500")} />
          온도: <span className="text-white font-bold">{state.temp.toFixed(1)}°C</span>
        </div>
      </div>
    </div>
  );
};

const ManualPanel = ({ state, setState }: { state: MachineState, setState: React.Dispatch<React.SetStateAction<MachineState>> }) => {
  const handleCut = () => {
    setState(prev => ({ ...prev, count: prev.count + 1, length: 0 }));
  };

  return (
    <div className="p-6 bg-zinc-100 rounded-2xl border border-zinc-200 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings2 size={18} className="text-amber-600" />
        <h3 className="font-bold text-sm">현장 조작반 (버튼 제어)</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setState(prev => ({ ...prev, isRunning: !prev.isRunning }))}
          className={cn(
            "h-20 rounded-xl flex flex-col items-center justify-center gap-2 shadow-lg transition-all",
            state.isRunning 
              ? "bg-red-600 shadow-red-900/20 text-white" 
              : "bg-emerald-600 shadow-emerald-900/20 text-white"
          )}
        >
          {state.isRunning ? <Square size={24} /> : <Play size={24} />}
          <span className="text-[10px] font-bold">{state.isRunning ? "모터 정지" : "모터 가동"}</span>
        </button>
        <button 
          onClick={handleCut}
          className="h-20 bg-zinc-800 active:bg-zinc-900 text-white rounded-xl flex flex-col items-center justify-center gap-2 shadow-lg shadow-zinc-900/20 transition-all"
        >
          <Scissors size={24} />
          <span className="text-[10px] font-bold">수동 절단</span>
        </button>
      </div>

      <div className="p-4 bg-white rounded-xl border border-zinc-200 space-y-2">
        <p className="text-[10px] font-bold text-zinc-400 uppercase">수동 조작 로그</p>
        <div className="text-xs font-mono text-zinc-600 h-20 overflow-y-auto">
          {state.count > 0 && Array.from({ length: state.count }).map((_, i) => (
            <div key={i}>[로그] #{i + 1}번 철근 수동 절단 완료</div>
          ))}
          {state.count === 0 && <div className="italic text-zinc-400">활동 기록 없음...</div>}
        </div>
      </div>
    </div>
  );
};

const HMIPanel = ({ state, setState }: { state: MachineState, setState: React.Dispatch<React.SetStateAction<MachineState>> }) => {
  const toggleAuto = () => setState(prev => ({ ...prev, isAuto: !prev.isAuto, isRunning: !prev.isAuto }));

  return (
    <div className="p-6 bg-zinc-800 rounded-2xl border-4 border-zinc-700 shadow-2xl space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Smartphone size={18} className="text-blue-400" />
          <h3 className="font-bold text-sm text-white">HMI 터치 패널</h3>
        </div>
        <div className="text-[10px] font-mono text-zinc-500">V2.4.1 로컬</div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-700">
          <p className="text-[10px] text-zinc-500 mb-1">목표 길이 (m)</p>
          <input 
            type="number" 
            value={state.targetLength}
            onChange={(e) => setState(prev => ({ ...prev, targetLength: Number(e.target.value) }))}
            className="w-full bg-transparent text-blue-400 font-bold text-xl outline-none"
          />
        </div>
        <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-700">
          <p className="text-[10px] text-zinc-500 mb-1">현재 길이 (m)</p>
          <p className="text-white font-bold text-xl">{state.length.toFixed(2)}</p>
        </div>
        <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-700">
          <p className="text-[10px] text-zinc-500 mb-1">절단 수량</p>
          <p className="text-white font-bold text-xl">{state.count}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={toggleAuto}
          className={cn(
            "flex-1 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
            state.isAuto ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "bg-zinc-700 text-zinc-400"
          )}
        >
          {state.isAuto ? <Square size={18} /> : <Play size={18} />}
          {state.isAuto ? "자동 운전 정지" : "자동 운전 시작"}
        </button>
        <button 
          onClick={() => setState(prev => ({ ...prev, count: 0 }))}
          className="px-6 bg-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-600 transition-colors"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="h-12 bg-zinc-900 rounded-lg flex items-center px-4 gap-3 border border-zinc-700">
        <div className={cn("w-2 h-2 rounded-full animate-pulse", state.isRunning ? "bg-emerald-500" : "bg-zinc-600")} />
        <span className="text-xs font-mono text-zinc-400">
          {state.isAuto ? "PLC 로직: 자동 사이클 가동 중" : "PLC 로직: 대기 중"}
        </span>
      </div>
    </div>
  );
};

const SCADAPanel = ({ state, setState }: { state: MachineState, setState: React.Dispatch<React.SetStateAction<MachineState>> }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  const sendRemoteCommand = (command: string, action: () => void) => {
    setIsSyncing(true);
    setLastCommand(command);
    // Simulate network latency for SCADA command
    setTimeout(() => {
      action();
      setIsSyncing(false);
      setTimeout(() => setLastCommand(null), 2000);
    }, 800);
  };

  return (
    <div className="p-8 bg-zinc-50 rounded-2xl border border-zinc-200 shadow-xl space-y-8 relative overflow-hidden">
      {/* Network Sync Overlay */}
      <AnimatePresence>
        {isSyncing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-emerald-500/5 backdrop-blur-[2px] z-50 flex items-center justify-center"
          >
            <div className="bg-white p-4 rounded-xl shadow-xl border border-emerald-100 flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-emerald-600">원격 제어 명령 전송 중...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600">
            <Monitor size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg">중앙 SCADA 대시보드</h3>
            <p className="text-xs text-zinc-500">1번 라인 철근 절단 스테이션 (원격 제어 활성화)</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-mono text-zinc-400">통신 상태</p>
            <p className="text-xs font-bold text-emerald-500 flex items-center gap-1 justify-end">
              <Server size={12} /> OPC UA 연결됨
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '설비효율(OEE)', value: '94.2%', icon: TrendingUp, color: 'text-emerald-500' },
          { label: '총 절단 수량', value: state.count, icon: BarChart3, color: 'text-blue-500' },
          { label: '현재 온도', value: `${state.temp.toFixed(1)}°C`, icon: Activity, color: state.temp > 40 ? 'text-red-500' : 'text-emerald-500' },
          { label: '가동 상태', value: state.isRunning ? '가동 중' : '정지됨', icon: History, color: state.isRunning ? 'text-emerald-500' : 'text-zinc-400' },
        ].map((stat, i) => (
          <div key={i} className="p-4 bg-white rounded-xl border border-zinc-100 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-bold text-zinc-400 uppercase">{stat.label}</p>
              <stat.icon size={12} className={stat.color} />
            </div>
            <p className={cn("text-lg font-bold", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Remote Control Section */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Settings2 size={14} /> 원격 설비 제어
          </h4>
          <div className="p-6 bg-zinc-900 rounded-2xl text-white space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => sendRemoteCommand(state.isRunning ? "정지" : "가동", () => 
                  setState(prev => ({ ...prev, isRunning: !prev.isRunning, isAuto: true }))
                )}
                className={cn(
                  "py-4 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-2 border",
                  state.isRunning 
                    ? "bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300" 
                    : "bg-emerald-600 border-emerald-500 hover:bg-emerald-500 text-white"
                )}
              >
                {state.isRunning ? <Square size={20} /> : <Play size={20} />}
                {state.isRunning ? "원격 정지" : "원격 가동"}
              </button>
              <button 
                onClick={() => sendRemoteCommand("비상 정지", () => 
                  setState(prev => ({ ...prev, isRunning: false, isAuto: false }))
                )}
                className="py-4 bg-red-600/20 border border-red-500/50 hover:bg-red-600/30 text-red-500 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-2"
              >
                <AlertTriangle size={20} />
                비상 정지 (원격)
              </button>
            </div>

            <div className="pt-4 border-t border-zinc-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">목표 길이 설정값</span>
                <span className="text-sm font-mono text-emerald-400">{state.targetLength.toFixed(2)}m</span>
              </div>
              <div className="flex gap-2">
                {[6.0, 8.0, 10.0, 12.0].map(len => (
                  <button 
                    key={len}
                    onClick={() => sendRemoteCommand(`길이 변경 ${len}m`, () => 
                      setState(prev => ({ ...prev, targetLength: len }))
                    )}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-[10px] font-bold border transition-all",
                      state.targetLength === len 
                        ? "bg-emerald-500 border-emerald-400 text-white" 
                        : "bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {len}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Messages & Feedback */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Activity size={14} /> 명령 피드백 루프
          </h4>
          <div className="bg-zinc-100 rounded-2xl border border-zinc-200 p-6 h-[220px] flex flex-col">
            <div className="flex-1 space-y-3 overflow-y-auto">
              <AnimatePresence>
                {lastCommand && (
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3"
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-xs font-bold text-emerald-700">명령 전송됨: {lastCommand}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                  <span>[10:21:37]</span>
                  <span className="text-blue-500">시스템</span>
                  <span>원격 세션 연결됨</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                  <span>[10:21:38]</span>
                  <span className="text-emerald-500">PLC_01</span>
                  <span>핸드쉐이크 성공 (지연시간: 12ms)</span>
                </div>
                {state.isRunning && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono"
                  >
                    <span>[10:21:40]</span>
                    <span className="text-emerald-500">PLC_01</span>
                    <span className="text-zinc-600">텔레메트리 스트리밍 중...</span>
                  </motion.div>
                )}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">HMI 동기화: 활성</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">송수신: 1.2kbps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MESPanel = ({ state }: { state: MachineState }) => {
  const productionGoal = 500;
  const progress = (state.count / productionGoal) * 100;

  return (
    <div className="p-8 bg-white rounded-2xl border border-zinc-200 shadow-xl space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600">
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg">MES 생산 실행 관리 시스템</h3>
            <p className="text-xs text-zinc-500">생산 계획 대비 실적 및 품질 분석</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold">
          실시간 연동 중
        </div>
      </div>

      {/* Production Progress */}
      <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">생산 목표 달성률</p>
            <h4 className="text-2xl font-black text-zinc-900">{progress.toFixed(1)}%</h4>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-zinc-400">목표: {productionGoal} EA</p>
            <p className="text-sm font-bold text-indigo-600">현재: {state.count} EA</p>
          </div>
        </div>
        <div className="h-3 bg-zinc-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quality Analysis */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 size={14} className="text-indigo-500" /> 품질 분석 (정밀도)
          </h4>
          <div className="p-4 bg-white rounded-xl border border-zinc-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-600">평균 오차 범위</span>
              <span className="text-xs font-bold text-emerald-600">±0.02m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-600">양품률 (Yield)</span>
              <span className="text-xs font-bold text-indigo-600">99.8%</span>
            </div>
            <div className="pt-2 border-t border-zinc-50">
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                * SCADA를 통해 수집된 PLC 센서 데이터를 바탕으로 절단 정밀도를 실시간 계산합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Traceability / History */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <History size={14} className="text-indigo-500" /> 생산 이력 추적 (Traceability)
          </h4>
          <div className="bg-zinc-50 rounded-xl border border-zinc-100 overflow-hidden">
            <table className="w-full text-[10px]">
              <thead className="bg-zinc-100 text-zinc-500">
                <tr>
                  <th className="p-2 text-left">LOT ID</th>
                  <th className="p-2 text-left">길이</th>
                  <th className="p-2 text-left">시간</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {state.count > 0 ? (
                  [...Array(Math.min(state.count, 4))].map((_, i) => (
                    <tr key={i} className="bg-white">
                      <td className="p-2 font-mono text-indigo-600">RB-260226-{String(state.count - i).padStart(3, '0')}</td>
                      <td className="p-2">{state.targetLength.toFixed(2)}m</td>
                      <td className="p-2 text-zinc-400">방금 전</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-zinc-400 italic">생산 데이터 대기 중...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MES Value Proposition */}
      <div className="p-4 bg-indigo-600 rounded-xl text-white flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
          <TrendingUp size={24} />
        </div>
        <div>
          <h4 className="text-xs font-bold mb-1">데이터 기반 의사결정</h4>
          <p className="text-[10px] text-indigo-100 leading-relaxed">
            현장의 모든 절단 데이터가 MES에 축적되어, 설비의 노후도 예측 및 자재 수급 계획 최적화에 활용됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [mode, setMode] = useState<ControlMode>('manual');
  const [state, setState] = useState<MachineState>(INITIAL_MACHINE_STATE);

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        if (!prev.isRunning) return prev;

        let nextLength = prev.length + 0.05;
        let nextCount = prev.count;
        let nextTemp = prev.temp + 0.01;

        // Auto Cut Logic (HMI/SCADA/MES)
        if (prev.isAuto && nextLength >= prev.targetLength) {
          nextLength = 0;
          nextCount += 1;
          nextTemp += 0.5; // Cutting generates heat
        }

        return {
          ...prev,
          length: nextLength,
          count: nextCount,
          temp: nextTemp
        };
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <LayoutDashboard size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">철근 절단 공정 제어 시뮬레이션</h1>
              <p className="text-[10px] text-zinc-500 font-mono uppercase">철근 절단 공정 디지털 트윈</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", state.isRunning ? "bg-emerald-500" : "bg-zinc-300")} />
            <span className="text-[10px] font-bold text-zinc-400 uppercase">{state.isRunning ? '가동 중' : '정지됨'}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Intro */}
        <section className="mb-12">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold tracking-tight mb-4 leading-tight">
              현장 제어에서 <span className="text-emerald-600">스마트 관제</span>까지
            </h2>
            <p className="text-zinc-500 leading-relaxed">
              철근 절단기(Rebar Cutter) 설비를 예시로, 수동 조작반부터 HMI 자동화, SCADA 통합 관제, 그리고 MES 생산 관리까지 
              어떻게 유기적으로 연결되고 데이터가 가치를 창출하는지 직접 시연해 보십시오.
            </p>
          </div>
        </section>

        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-zinc-200/50 rounded-2xl w-fit">
          {(['manual', 'hmi', 'scada', 'mes'] as ControlMode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                // Reset some states when switching for clarity
                if (m === 'mes') {
                  setState(prev => ({ ...prev, isAuto: true, isRunning: true }));
                } else {
                  setState(prev => ({ ...prev, isAuto: m !== 'manual' }));
                }
              }}
              className={cn(
                "px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                mode === m 
                  ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-300" 
                  : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              {m === 'manual' && <Settings2 size={16} />}
              {m === 'hmi' && <Smartphone size={16} />}
              {m === 'scada' && <Monitor size={16} />}
              {m === 'mes' && <BarChart3 size={16} />}
              {MODE_DESCRIPTIONS[m].title}
            </button>
          ))}
        </div>

        {/* Simulation Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Visualizer & Info */}
          <div className="lg:col-span-7 space-y-8">
            <RebarVisualizer state={state} />
            
            <div className="p-8 bg-white rounded-2xl border border-zinc-200 shadow-sm">
              <h3 className="text-xl font-bold mb-4">{MODE_DESCRIPTIONS[mode].title} 특징</h3>
              <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
                {MODE_DESCRIPTIONS[mode].desc}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MODE_DESCRIPTIONS[mode].features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                    <div className={cn("w-1.5 h-1.5 rounded-full", 
                      mode === 'manual' ? 'bg-amber-500' : mode === 'hmi' ? 'bg-blue-500' : mode === 'scada' ? 'bg-emerald-500' : 'bg-indigo-500'
                    )} />
                    <span className="text-xs font-medium text-zinc-700">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison Logic Note */}
            <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-indigo-900 mb-1">MES 도입의 궁극적 목표</h4>
                  <p className="text-xs text-indigo-700 leading-relaxed">
                    MES는 단순히 설비를 제어하는 것을 넘어, 현장에서 수집된 빅데이터를 분석하여 
                    <strong> 생산 효율 최적화, 품질 완벽 추적, 자재 낭비 최소화</strong>를 실현하는 제조 지능화의 핵심입니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Control Panel */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {mode === 'manual' && <ManualPanel state={state} setState={setState} />}
                {mode === 'hmi' && <HMIPanel state={state} setState={setState} />}
                {mode === 'scada' && <SCADAPanel state={state} setState={setState} />}
                {mode === 'mes' && <MESPanel state={state} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Scenario Guide */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold">시연 시나리오 가이드</h3>
            <p className="text-sm text-zinc-500">누군가에게 설명할 때 아래 순서로 보여주세요.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { 
                step: '01', 
                title: '수동 제어의 한계', 
                desc: '현장 버튼을 직접 조작합니다. 데이터가 남지 않고 오차가 큽니다.' 
              },
              { 
                step: '02', 
                title: 'HMI 자동화', 
                desc: '현장에서 정밀 제어가 가능해지지만, 데이터가 설비에 고립됩니다.' 
              },
              { 
                step: '03', 
                title: 'SCADA 통합 관제', 
                desc: '원격으로 설비를 제어하고 모든 데이터를 실시간 수집합니다.' 
              },
              { 
                step: '04', 
                title: 'MES 지능화 관리', 
                desc: '수집된 데이터를 분석하여 실적 관리와 품질 추적을 수행합니다.' 
              },
            ].map((s, i) => (
              <div key={i} className="relative p-8 bg-white rounded-2xl border border-zinc-200 shadow-sm">
                <span className="absolute -top-4 left-8 text-4xl font-black text-zinc-100 z-0">{s.step}</span>
                <div className="relative z-10">
                  <h4 className="font-bold mb-3">{s.title}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-zinc-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">스마트 팩토리 솔루션</p>
          <h3 className="text-xl font-bold mb-8">MES/SCADA 통합으로 제조 경쟁력을 높이십시오.</h3>
          <div className="flex justify-center gap-8 text-[10px] text-zinc-500">
            <span>PLC 통합</span>
            <span>HMI 디자인</span>
            <span>SCADA 아키텍처</span>
            <span>MES 연결성</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
