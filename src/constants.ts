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
  isDefectSimulating: boolean;
  defectType: 'length' | 'temp' | 'conflict' | null;
  controlAuthority: 'local' | 'remote' | 'shared';
  isPriorityEnabled: boolean;
}

export const INITIAL_MACHINE_STATE: MachineState = {
  length: 0,
  speed: 0,
  temp: 25,
  count: 0,
  isRunning: false,
  isAuto: false,
  targetLength: 8.0,
  alarm: null,
  isDefectSimulating: false,
  defectType: null,
  controlAuthority: 'shared',
  isPriorityEnabled: false
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
    defectHandling: "불량 발생 시 해당 LOT 전체를 격리 조치하고, 수집된 빅데이터를 분석하여 불량 원인(설비 노후, 자재 불량 등)을 파악하고 재발 방지 대책을 수립합니다.",
    color: "indigo"
  }
};

export const DEFECT_SCENARIOS = [
  {
    title: "치수 정밀도 불량 (길이 오차)",
    manual: "작업자가 줄자로 측정 후 인지. 이미 생산된 불량품은 수기 기록 없이 폐기되거나 방치됨.",
    hmi: "PLC 센서가 오차 감지 시 즉시 정지 및 경보. 현장 작업자가 즉시 보정 조치 수행.",
    scada: "중앙 관제실에 알람 발생. 불량 발생 시점의 설비 파라미터(속도, 압력 등)를 자동 저장하여 분석.",
    mes: "불량 데이터를 LOT ID에 매칭. 품질 보고서 자동 생성 및 해당 공정의 수율(Yield) 하락 실시간 반영."
  },
  {
    title: "커터 발열 및 마모",
    manual: "연기나 소음으로 인지. 대처가 늦어 설비 파손 위험이 큼.",
    hmi: "온도 센서 임계치 초과 시 자동 정지. '냉각 필요' 메시지 출력.",
    scada: "온도 추이 그래프 분석을 통해 마모 시점을 예측(예지보전)하여 사전에 부품 교체 지시.",
    mes: "소모품 교체 주기 관리와 연동. 자재 창고에 커터 날 재고 확인 및 구매 요청 자동화."
  }
];
