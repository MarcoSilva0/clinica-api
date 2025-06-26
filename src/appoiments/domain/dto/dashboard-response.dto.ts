export interface ExamTypeAverageTime {
  examTypeId: string;
  examTypeName: string;
  defaultDuration: string;
  averageTimeMinutes: number;
}

export interface DashboardDataResponse {
  confirmed: any[];
  finished: any[];
  inProgress: any[];
  averageTimes: ExamTypeAverageTime[];
  currentDateTime: Date;
}

export interface WaitingPatient {
  id: string;
  patient_name: string;
  patient_cpf: string;
  date_start: Date;
  examsType: {
    id: string;
    name: string;
    defaultDuration: string;
  };
  estimatedWaitTimeMinutes: number;
  positionInQueue: number;
}

export interface FinishedAppointment {
  id: string;
  patient_name: string;
  patient_cpf: string;
  date_start: Date;
  finishedDate: Date;
  examsType: {
    id: string;
    name: string;
  };
  actualDurationMinutes: number;
}
