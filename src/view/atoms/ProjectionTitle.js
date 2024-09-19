import { Box, Link, Typography } from "@mui/material";
import { Translate } from "../../nonview/base";
import { useDataContext } from "../../nonview/core/DataProvider";
import CustomAlert from "./CustomAlert";

export function ProjectionAlert() {
  const data = useDataContext();
  if (!data) {
    return null;
  }
  const { electionDisplay, pdIdx, electionPrevious } = data;

  const entID = "LK";
  const { nResultsTotal, nResultsReleased } = electionDisplay.getReleaseStats(
    entID,
    pdIdx,
    electionPrevious
  );

  const isComplete = nResultsReleased === nResultsTotal;

  if (isComplete) {
    return null;
  }

  return (
    <CustomAlert severity="warning">
      <Typography variant="body1">
        {Translate(
          "This projection is generated by a Machine Learning model using both current released results and historical data. The results have a 90% confidence level, meaning there's a 10% chance they may be incorrect. These are not official results and could differ significantly from the final outcome. For more details, please refer to the "
        )}
        <Link href="https://github.com/nuuuwan/prespoll">
          {Translate("Source Code")}
        </Link>
        {'.'}
      </Typography>
    </CustomAlert>
  );
}

export default function ProjectionTitle() {
  const data = useDataContext();
  if (!data) {
    return null;
  }
  const { electionDisplay, pdIdx, electionPrevious } = data;

  const entID = "LK";
  const { nResultsTotal, nResultsReleased } = electionDisplay.getReleaseStats(
    entID,
    pdIdx,
    electionPrevious
  );

  const isComplete = nResultsReleased === nResultsTotal;

  let title = "Final Result";
  if (!isComplete) {
    title = "Projected Final Result";
  }

  return (
    <Box>
      <Typography variant="h4" color="secondary">
        {Translate(title)}
      </Typography>
    </Box>
  );
}
