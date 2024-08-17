import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Slider,
  Stack,
  Typography,
} from "@mui/material";

import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Replay10Icon from "@mui/icons-material/Replay10";
import Forward10Icon from "@mui/icons-material/Forward10";

import { useState } from "react";
import { STYLE } from "../../nonview/constants";

const N_JUMP_STEPS = 10;

function BottomNavigationActionCustom({ Icon, onClick, disabled }) {
  const color = disabled ? STYLE.COLOR.LIGHTER : STYLE.COLOR.DARKER;
  return (
    <BottomNavigationAction
      onClick={onClick}
      disabled={disabled}
      sx={{ color }}
      icon={<Icon />}
    />
  );
}

function getBottomNavigationActionConfigs(
  setNResultsDisplay,
  nResultsDisplay,
  nResults,
  isPlaying,
  playAnimation,
  pauseAnimation
) {
  return [
    {
      Icon: FirstPageIcon,
      onClick: () => setNResultsDisplay(0),
      disabled: nResultsDisplay === 0,
    },
    {
      Icon: Replay10Icon,
      onClick: () =>
        setNResultsDisplay(Math.max(0, nResultsDisplay - N_JUMP_STEPS)),
      disabled: nResultsDisplay === 0,
    },
    {
      Icon: isPlaying ? PauseIcon : PlayArrowIcon,
      onClick: () => (isPlaying ? pauseAnimation() : playAnimation()),
    },
    {
      Icon: Forward10Icon,
      onClick: () =>
        setNResultsDisplay(Math.min(nResults, nResultsDisplay + N_JUMP_STEPS)),
      disabled: nResultsDisplay === nResults,
    },
    {
      Icon: LastPageIcon,
      onClick: () => setNResultsDisplay(nResults),
      disabled: nResultsDisplay === nResults,
    },
  ];
}

function BottomNavigationCustom({
  nResultsDisplay,
  nResults,
  setNResultsDisplay,
  isPlaying,
  playAnimation,
  pauseAnimation,
}) {
  return (
    <BottomNavigation>
      {getBottomNavigationActionConfigs(
        setNResultsDisplay,
        nResultsDisplay,
        nResults,
        isPlaying,
        playAnimation,
        pauseAnimation
      ).map(function (config, i) {
        return (
          <BottomNavigationActionCustom
            key={i}
            Icon={config.Icon}
            onClick={config.onClick}
            disabled={config.disabled}
          />
        );
      })}
    </BottomNavigation>
  );
}

function CustomSlider({
  nResultsDisplayUpdated,
  nResults,
  onChange,
  onChangeCommitted,
}) {
  return (
    <Stack
      direction="row"
      gap={2}
      sx={{
        alignItems: "center",
        p: 0,
        m: 0,
        paddingLeft: 2,
        paddingRight: 2,
      }}
    >
      <Typography variant="h6">{nResultsDisplayUpdated}</Typography>
      <Slider
        aria-label="Always visible"
        value={nResultsDisplayUpdated}
        min={0}
        max={nResults}
        onChange={onChange}
        onChangeCommitted={onChangeCommitted}
      />
      <Typography variant="h6" color={STYLE.COLOR.LIGHT}>
        {nResults}
      </Typography>
    </Stack>
  );
}

const STYLE_PLAYER_CONTROL = {
  position: "fixed",
  bottom: 0,
  right: 0,
  left: 0,
  zIndex: 2000,
  backgroundColor: "white",
};

export default function PlayerControl({
  electionDisplay,
  election,
  setNResultsDisplay,
  isPlaying,
  playAnimation,
  pauseAnimation,
}) {
  const nResultsDisplay = electionDisplay.nResults;
  const nResults = election.nResults
  
  const [nResultsDisplayUpdated, setNResultsDisplayUpdated] =
    useState(nResultsDisplay);
  const onChangeCommitted = function (__, value) {
    setNResultsDisplayUpdated(value);
    setNResultsDisplay(value);
  };
  const onChange = function (__, value) {
    setNResultsDisplayUpdated(value);
  };

  return (
    <Box sx={STYLE_PLAYER_CONTROL}>
      <CustomSlider
        nResultsDisplayUpdated={nResultsDisplayUpdated}
        nResults={nResults}
        onChange={onChange}
        onChangeCommitted={onChangeCommitted}
      />
      <BottomNavigationCustom
        nResultsDisplay={nResultsDisplay}
        nResults={nResults}
        setNResultsDisplay={setNResultsDisplay}
        isPlaying={isPlaying}
        playAnimation={playAnimation}
        pauseAnimation={pauseAnimation}
      />
    </Box>
  );
}
