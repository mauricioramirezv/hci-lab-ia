export type Persona = {
  id: string;
  name: string;
  age: string;
  context: string;
  goal: string;
  barrier: string;
  device: string;
  empathy: { says: string; thinks: string; does: string; feels: string };
  basis?: 'observed' | 'assumed' | 'mixed';
  observed?: string;
  assumptions?: string;
  emotionSource?: 'observed' | 'declared';
};

export type Scenario = {
  id: string;
  title: string;
  actor: string;
  context: string;
  task: string;
  constraint: string;
  success: string;
  personaId?: string;
  fictional?: boolean;
};

export type ResearchData = { personas: Persona[]; scenarios: Scenario[] };
