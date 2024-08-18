import { Box } from "@mui/material";

import { ElectionSelector } from "../../molecules";
import { STYLE } from "../../../nonview/constants";

const STYLE_PAGE_HEADER = {
  SELECTOR: {
    position: "fixed",
    top: 0,
    right: 0,
    left: 0,
    zIndex: 3000,
    padding: 1,
  },
};

export default function PageHeader({
  electionDisplay,
  projectedElection,
  db,
  setElection,
}) {
  const color = projectedElection
    ? projectedElection.color
    : STYLE.COLOR.LIGHTEST;
  return (
    <Box
      sx={Object.assign({ backgroundColor: color }, STYLE_PAGE_HEADER.SELECTOR)}
    >
      <ElectionSelector
        selectedElection={electionDisplay}
        colorElection={projectedElection}
        elections={db.elections}
        setElection={setElection}
      />
    </Box>
  );
}
