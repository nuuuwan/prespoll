import { useDataContext } from "../../nonview/core/DataProvider";
import { CustomStack, ElectionSmallTitle, ProjectionTitle } from "../atoms";
import {
  FinalOutcomeView,
  PartyToVotesStatsView,
  SummaryView,
  ProjectedResultBarChart,
} from ".";

import { FinalOutcome } from "../../nonview/core";
import InsightErrorMarginTooHigh from "./FinalOutcomeView/InsightErrorMarginTooHigh";
import { ProjectionAlert } from "../atoms/ProjectionTitle";

export default function ProjectionView() {
  const data = useDataContext();
  if (!data) {
    return null;
  }
  const { electionProjected, electionDisplay } = data;
  const resultLK = electionProjected.resultLK;

  const finalOutcome = new FinalOutcome(
    electionProjected,
    electionDisplay.nResults
  );

  if (finalOutcome.isTooMuchError) {
    return (
      <CustomStack>
        <ProjectionTitle />
        <InsightErrorMarginTooHigh />
      </CustomStack>
    );
  }

  return (
    <CustomStack>
      <ProjectionTitle />
      <FinalOutcomeView />

      <PartyToVotesStatsView partyToVotes={resultLK.partyToVotes} />
      <ProjectedResultBarChart />
      <SummaryView summary={resultLK.summary} />
      <ElectionSmallTitle />

      <ProjectionAlert />
    </CustomStack>
  );
}
