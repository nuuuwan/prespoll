import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { Party } from "../../../nonview/core";
import { Format } from "../../../nonview/base";
import { Box } from "@mui/material";
import { STYLE } from "../../../nonview/constants";

export default function PartyToVotesPieChart({ partyToVotes }) {
  const data = Object.entries(partyToVotes.partyToVotesSortedOthered).map(
    function ([partyID, votes]) {
      const party = Party.fromID(partyID);
      return {
        id: partyID,
        value: votes / partyToVotes.totalVotes,
        label: partyID,
        color: party.color || "#888",
      };
    }
  );

  return (
    <Box flexGrow={1}>
      <PieChart
        series={[
          {
            data,
            arcLabel: (item) => Format.percent(item.value),
            arcLabelMinAngle: 60,
            outerRadius: 100,
            innerRadius: 0,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: "white",
            fontSize: "200%",
            fontFamily: STYLE.FONT_FAMILY,
          },
        }}
        slotProps={{ legend: { hidden: true } }}
        width={STYLE.COLUMN_WIDTH}
        height={Math.min(STYLE.HEIGHT / 3, STYLE.COLUMN_WIDTH)}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      />
    </Box>
  );
}
