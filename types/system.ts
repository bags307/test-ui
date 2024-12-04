export interface SystemState {
  auth: {
    user: any | null;
    organization: any | null;
    permissions: string[];
    session: any | null;
  };
  connection: {
    assistant: ConnectionState;
    voice: ConnectionState;
    memory: ConnectionState;
  };
  interaction: {
    mode: 'text' | 'voice' | 'hybrid';
    activeThread: string;
    context: any | null;
    tools: ToolState[];
  };
  voice: {
    status: string;
    calibration: CalibrationState;
    devices: AudioDevice[];
    processing: ProcessingState;
  };
  memory: {
    activeContexts: string[];
    searchResults: any[];
    pendingOperations: Operation[];
  };
}

export interface ConnectionState {
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
}

export interface CalibrationState {
  isCalibrated: boolean;
  settings?: Record<string, any>;
}

export interface AudioDevice {
  id: string;
  label: string;
  kind: string;
}

export interface ProcessingState {
  status: 'idle' | 'processing' | 'error';
  error?: string;
}

export interface ToolState {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  result?: any;
}

export interface Operation {
  id: string;
  type: string;
  status: 'pending' | 'completed' | 'error';
  timestamp: string;
}