export type ControlMode = 'manual' | 'hmi' | 'scada' | 'mes';

export interface MachineState {
  length: number;
  speed: number;
  temp: number;
  count: number;
  isRunning: boolean;
  isAuto: boolean;
  targetLength: number;
  alarm: string | null;
}

export const INITIAL_MACHINE_STATE: MachineState = {
  length: 0,
  speed: 0,
  temp: 25,
  count: 0,
  isRunning: false,
  isAuto: false,
  targetLength: 8.0,
  alarm: null
};

export const MODE_DESCRIPTIONS = {
  manual: {
    title: "현장 수동 제어",
    desc: "작업자가 직접 레버나 버튼을 조작하여 모터를 구동하고 절단기를 작동시킵니다.",
    features: ["직접 조작", "피드백 없음", "수기 기록"],
    color: "amber"
  },
  hmi: {
    title: "HMI 로컬 자동화",
    desc: "설비 옆 터치패널에서 목표 길이를 설정하고 PLC가 자동으로 속도와 절단을 제어합니다.",
    features: ["터치 UI", "PLC 로직 제어", "로컬 알람"],
    color: "blue"
  },
  scada: {
    title: "SCADA 통합 관제",
    desc: "중앙 관제실에서 여러 대의 절단기를 모니터링하고, MES 지시사항에 따라 레시피를 하달합니다.",
    features: ["원격 제어", "데이터 로깅", "통신 상태 모니터링"],
    color: "emerald"
  },
  mes: {
    title: "MES 생산 실행 관리",
    desc: "수집된 데이터를 바탕으로 생산 계획 대비 실적을 관리하고, 품질 분석 및 이력 추적을 수행합니다.",
    features: ["생산 실적 관리", "품질 추적성(Traceability)", "OEE 분석"],
    color: "indigo"
  }
};
