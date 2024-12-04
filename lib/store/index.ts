import { create } from 'zustand';
import { SystemState } from '@/types/system';

const initialState: SystemState = {
  auth: {
    user: null,
    organization: null,
    permissions: [],
    session: null,
  },
  connection: {
    assistant: { status: 'disconnected' },
    voice: { status: 'disconnected' },
    memory: { status: 'disconnected' },
  },
  interaction: {
    mode: 'text',
    activeThread: '',
    context: null,
    tools: [],
  },
  voice: {
    status: 'inactive',
    calibration: { isCalibrated: false },
    devices: [],
    processing: { status: 'idle' },
  },
  memory: {
    activeContexts: [],
    searchResults: [],
    pendingOperations: [],
  },
};

export const useStore = create<{
  state: SystemState;
  setUser: (user: any) => void;
  setOrganization: (org: any) => void;
  setConnectionStatus: (type: keyof SystemState['connection'], status: string) => void;
  setInteractionMode: (mode: SystemState['interaction']['mode']) => void;
  setVoiceStatus: (status: string) => void;
  setActiveThread: (threadId: string) => void;
}>((set) => ({
  state: initialState,
  setUser: (user) =>
    set((state) => ({
      state: {
        ...state.state,
        auth: { ...state.state.auth, user },
      },
    })),
  setOrganization: (organization) =>
    set((state) => ({
      state: {
        ...state.state,
        auth: { ...state.state.auth, organization },
      },
    })),
  setConnectionStatus: (type, status) =>
    set((state) => ({
      state: {
        ...state.state,
        connection: {
          ...state.state.connection,
          [type]: { status },
        },
      },
    })),
  setInteractionMode: (mode) =>
    set((state) => ({
      state: {
        ...state.state,
        interaction: { ...state.state.interaction, mode },
      },
    })),
  setVoiceStatus: (status) =>
    set((state) => ({
      state: {
        ...state.state,
        voice: { ...state.state.voice, status },
      },
    })),
  setActiveThread: (threadId) =>
    set((state) => ({
      state: {
        ...state.state,
        interaction: { ...state.state.interaction, activeThread: threadId },
      },
    })),
}));