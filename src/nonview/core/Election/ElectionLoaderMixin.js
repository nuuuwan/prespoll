import { WWW, EntType } from "../../base";
import Result from "../Result.js";

import OngoingElection from "../OngoingElection.js";
import ElectionStaticLoaderMixin from "./ElectionStaticLoaderMixin.js";
const ElectionLoaderMixin = {
  async __loadData() {
    if (this.isFuture) {
      await OngoingElection.loadData(this);
    } else {
      const pdResultList = await this.getPDResultList();
      this.build(EntType.PD, pdResultList);
    }
  },

  async getRawDataList() {
    const timeStamp = "any";
    return await WWW.tsv(this.urlData, timeStamp);
  },

  async getPDResultList() {
    const rawData = await this.getRawDataList();

    const filteredRawData = rawData.filter(function (d) {
      return EntType.fromID(d["entity_id"]) === EntType.PD;
    });

    const pdResultList = filteredRawData.map(function (d) {
      return Result.fromDict(d);
    });

    const sortedPDResultList = pdResultList.sort(function (a, b) {
      return (
        (a.resultTime || "").localeCompare(b.resultTime || "") ||
        a.summary.polled - b.summary.polled
      );
    });
    return sortedPDResultList;
  },

  build(baseEntType, baseResultList) {
    this.baseResultList = baseResultList;

    if (baseEntType === EntType.PD) {
      this.pdResultList = baseResultList;
    } else if (baseEntType === EntType.ED) {
      this.pdResultList = [];
      this.edResultList = baseResultList;
    } else {
      throw new Error("Invalid baseEntType: " + baseEntType);
    }

    this.baseEntType = baseEntType;

    this.edResultList =
      this.edResultList ||
      ElectionStaticLoaderMixin.buildEDResultList(this.pdResultList);
    this.provinceResultList = ElectionStaticLoaderMixin.buildProvinceResultList(
      this.edResultList
    );

    this.resultLK = ElectionStaticLoaderMixin.buildResultLK(
      this.provinceResultList
    );

    this.ezResultList = ElectionStaticLoaderMixin.buildEZResultList(
      this.baseResultList
    );

    this.resultList = [
      this.resultLK,
      ...this.ezResultList,
      ...this.provinceResultList,
      ...this.edResultList,
      ...this.pdResultList,
    ];

    this.resultIdx = ElectionStaticLoaderMixin.buildResultIdx(this.resultList);
    this.isLoaded = true;
  },
};

export default ElectionLoaderMixin;
