import { Box, Divider, MenuItem, Select } from "@mui/material";

const STYLE = {
  border: "none",
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiSelect-select": {
    margin: 0,
    padding: 0,
  },
};

function CustomSelectInner({
  value,
  getID,
  renderValue,
  renderMenuItemInner,
  getDividerKey,
  onChangeInner,
  dataIdx,
}) {
  let prevDividerKey;
  return (
    <Box>
    <Select
      value={getID(value)}
      onChange={onChangeInner}
      sx={STYLE}
      renderValue={function (value, i) {
        return renderValue(dataIdx[value], i);
      }}
    >
      {Object.entries(dataIdx).reduce(function (innerItems, [id, data], i) {
        const inner = renderMenuItemInner(data, i);
        const dividerKey = getDividerKey(data);
        if (prevDividerKey !== dividerKey && i !== 0) {
          innerItems.push(<Divider key={`divider-${i}`} />);
        }
        prevDividerKey = dividerKey;
        innerItems.push(
          <MenuItem key={id} value={id}>
            {inner}
          </MenuItem>
        );
        return innerItems;
      }, [])}
    </Select></Box>
  );
}

function getDataIdx(dataList, getID, reverse) {
  let sortedDataList = dataList
    .filter((data) => getID(data) !== null)
    .sort(function (a, b) {
      return getID(a).localeCompare(getID(b));
    });
  if (reverse) {
    sortedDataList.reverse();
  }
  const dataIdx = Object.fromEntries(
    sortedDataList.map((data) => [getID(data), data])
  );
  return dataIdx;
}

export default function CustomSelect({
  value,
  onChange,
  dataList,
  getID,
  renderValue,
  renderMenuItemInner,
  getDividerKey,
  reverse,
}) {
  const dataIdx = getDataIdx(dataList, getID, reverse);

  const onChangeInner = function (event) {
    const id = event.target.value;
    onChange(dataIdx[id]);
  };
  return (
    <CustomSelectInner
      value={value}
      getID={getID}
      renderValue={renderValue}
      renderMenuItemInner={renderMenuItemInner}
      getDividerKey={getDividerKey}
      onChangeInner={onChangeInner}
      dataIdx={dataIdx}
    />
  );
}
