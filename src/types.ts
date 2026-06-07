/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CategoryType =
  | "Smart Governance"
  | "Smart Mobility"
  | "Smart Environment"
  | "Smart Economy"
  | "Smart Living"
  | "Smart People";

export interface IndicatorDefinition {
  id: string;
  category: CategoryType;
  nameMs: string;
  nameEn: string;
  descriptionMs: string;
  descriptionEn: string;
}

export interface SmartProject {
  id: string;
  name: string;
  category: CategoryType;
  budget: number; // in MYR / RM
  status: "Proposed" | "Ongoing" | "Completed";
  descriptionMs: string;
  descriptionEn: string;
  targetImpact: string;
  timeline: string;
}

export interface HistoryRecord {
  date: string;
  score: number;
}

export interface CityData {
  id: string;
  name: string;
  state: string;
  population: string;
  totalIndicators: number;
  scores: Record<CategoryType, number>;
  indicatorValues: Record<string, boolean>; // tracks true/false for each indicator definition ID
  projects: SmartProject[];
  history: HistoryRecord[];
}
