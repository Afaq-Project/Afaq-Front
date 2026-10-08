import { ApplicationStage } from "../types/applicationStatus";

export const APPLICATION_STATUS_BREAKDOWN: Record<ApplicationStage, number> = {
  "Not started": 340,
  "In progress": 512,
  Submitted: 618,
  "In review": 274,
  Decision: 190,
};
