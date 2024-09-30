import { AppBar, Box, Toolbar, Typography } from "@mui/material";

import { useDataContext } from "../../../nonview/core/DataProvider";
import { RefreshButton } from "../../../view";
import { CustomMenu } from "../../../view";

const STYLE_PAGE_HEADER = {
  SELECTOR: {
    position: "sticky",
    top: 0,
    right: 0,
    left: 0,
    zIndex: 3000,
    padding: 0,
    margin: 0,
    color: "white",
    borderBottom: "1px solid #eee",
  },
};

export default function PageHeader() {
  const data = useDataContext();
  if (!data) {
    return null;
  }
  const { electionProjected } = data;
  const backgroundColor = electionProjected?.color || "gray";

  return (
    <Box sx={Object.assign({ backgroundColor }, STYLE_PAGE_HEADER.SELECTOR)}>
      <AppBar position="static" sx={{ backgroundColor }}>
        <Toolbar>
          <Typography variant="h4">{electionProjected.title}</Typography>

          <Box sx={{ flexGrow: 1 }} />

          <RefreshButton />
          <CustomMenu />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
