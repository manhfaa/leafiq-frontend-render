export type PlanTier = "free" | "pro" | "plus";

export type PlantType = string;

export type DiagnosisStepKey = "yolo" | "roadmap" | "rag";

export type DiagnosisStepState =
  | "idle"
  | "queued"
  | "processing"
  | "success"
  | "warning"
  | "locked";

export type DiagnosisStatus =
  | "idle"
  | "uploading"
  | "scanning"
  | "success"
  | "invalid-image"
  | "locked";

export type CameraPreviewState = "idle" | "starting" | "live" | "error" | "unsupported";

export type SeverityLevel = "Nhẹ" | "Trung bình" | "Cao" | string;
export type DiagnosisInputMethod = "upload" | "capture" | "sample";
export type DiagnosisRecordOrigin = "mock" | "user";

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  eyebrow: string;
  accent: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
}

export interface SupportedPlant {
  id: string;
  name: PlantType;
  latinLabel: string;
  insight: string;
  accent: string;
}

export interface WorkflowStep {
  id: string;
  step: string;
  title: string;
  description: string;
}

export interface PricingPlan {
  id: PlanTier;
  name: string;
  price: string;
  description: string;
  cta: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
}

export interface RecommendationBlock {
  title: string;
  items: string[];
}

export interface DiagnosisRecord {
  id: string;
  plant: PlantType;
  disease: string;
  confidence: number;
  severity: SeverityLevel;
  classificationReady?: boolean;
  image: string;
  createdAt: string;
  note: string;
  yoloVerified: boolean;
  leafConfidence?: number;
  leafCheckNote?: string;
  inputMethod?: DiagnosisInputMethod;
  origin?: DiagnosisRecordOrigin;
  symptomSummary: string;
  causes: string[];
  recommendations: RecommendationBlock[];
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  createdAt: string;
  citations?: RagCitation[];
}

export interface QuickPrompt {
  id: string;
  label: string;
  prompt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  currentPlan: PlanTier;
}

export type ChatWorkspace = "rag" | "advisory";
export type AdvisoryMode = "advisor" | "expert";
export type ChatMode = "rag" | "advisor" | "expert";

export type RagDocCategory = "source" | "etl" | "taxonomy" | "diagnosis";

export interface RagSource {
  sourceId: string;
  name: string;
  url: string;
  license: string;
  trustLevel: "official" | "research" | "open-data";
}

export interface RagDocument {
  id: string;
  title: string;
  summary: string;
  content: string;
  language: "vi" | "en";
  category: RagDocCategory;
  docType: "guide" | "portal" | "dataset_metadata" | "policy" | "playbook";
  tags: string[];
  source: RagSource;
}

export interface RagCitation {
  id: string;
  title: string;
  sourceName: string;
  url: string;
  license: string;
}

export interface ChatApiRequest {
  query: string;
  mode: ChatMode;
  latestDiagnosis?: DiagnosisRecord | null;
}

export interface ChatApiResponse {
  mode: ChatMode;
  answer: string;
  citations?: RagCitation[];
  retrievedDocs: RagDocument[];
  kbSize: number;
  generatedAt: string;
}
