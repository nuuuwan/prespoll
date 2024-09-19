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
      this.build(pdResultList);
          }
  },

  async getRawDataList() {
    const timeStamp = "any";
    return await WWW.tsv(this.urlData, timeStamp);
  },

  async getPDResultList() {
    const rawData = await this.getRawDataList();

    const filteredRawData = rawData.filter(function (d) {
      return EntType.fromID(d['entity_id']) === EntType.PD;
    });

    const pdResultList = filteredRawData.map(function (d) {
      return Result.fromDict(d);
    });

    const sortedPDResultList = pdResultList.sort(function (a, b) {
      return ((a.resultTime || "").localeCompare((b.resultTime || ""))) || ( a.summary.polled - b.summary.polled);
    });
    return sortedPDResultList
  },

   build(pdResultList) {
    this.pdResultList = pdResultList;

    this.edResultList = ElectionStaticLoaderMixin.buildEDResultList(pdResultList);;
    this.provinceResultList = ElectionStaticLoaderMixin.buildProvinceResultList(this.edResultList);;
    this.ezResultList = ElectionStaticLoaderMixin.buildEZResultList(pdResultList);;
    this.resultLK = ElectionStaticLoaderMixin.buildResultLK(this.provinceResultList);

    this.resultList = [
      ...this.pdResultList,
      ...this.edResultList,
      ...this.provinceResultList,
      ...this.ezResultList,
      this.resultLK,
    ];

    this.resultIdx = ElectionStaticLoaderMixin.buildResultIdx(this.resultList);
    this.isLoaded = true;

  },
};

export default ElectionLoaderMixin;
