import { ApplicationStage } from "../types/applicationStatus";

export const APPLICATION_STATUS_BREAKDOWN: Record<ApplicationStage, number> = {
  "Not Started": 340,
  "In Progress": 512,
  Submitted: 618,
  "In Review": 274,
  Result: 190,
};
