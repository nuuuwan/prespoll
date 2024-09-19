import { ArrayX, Time, Translate } from "../../base/index.js";

export default class ElectionBase {
  static URL_BASE =
    "https://raw.githubusercontent.com/nuuuwan/gig-data/master/gig2_custom_ec_only";
  constructor(electionType, date) {
    this.electionType = electionType;
    this.date = date;

    this.baseEntType = null;
    this.pdResultList = null;
    this.edResultList = null;
    this.provinceResultList = null;
    this.ezResultList = null;
    this.resultLK = null;
    this.resultList = null;
    this.resultIdx = null;
    this.isLoaded = false;
  }

  get electionTypeTitle() {
    if (this.electionType === "Presidential") {
      return "Presidential";
    }
    return "Parliamentary";
  }

  get title() {
    return this.year + " " + Translate(this.electionTypeTitle);
  }

  get titleLong() {
    return (
      this.year +
      " " +
      Translate("Sri Lankan " + this.electionTypeTitle + " Election")
    );
  }

  get year() {
    return this.date.substring(0, 4);
  }

  get dateFormatted() {
    return Time.fromString(this.date).getDate().toLocaleDateString("en-LK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  get urlData() {
    return (
      ElectionBase.URL_BASE +
      "/government-elections-" +
      this.electionType.toLowerCase() +
      ".regions-ec." +
      this.year +
      ".tsv"
    );
  }

  get isFuture() {
    return this.date.localeCompare(Time.now().dateString) > 0;
  }

  localeCompare(other) {
    return this.date.localeCompare(other.date);
  }

  get color() {
    if (!this.resultIdx) {
      return "gray";
    }
    return this.resultLK.color;
  }

  get nResults() {
    return this.pdResultList.length;
  }

  get finalResult() {
    return ArrayX.last(this.pdResultList);
  }

  get finalPDID() {
    return this.finalResult.entID;
  }

  get pdIDList() {
    return this.pdResultList.map((result) => result.entID);
  }
}
