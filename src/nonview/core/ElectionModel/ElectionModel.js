import { EntType } from "../../base";
import Election from "../Election/Election";
import ElectionModelFeatureUtils from "./ElectionModelFeatureUtils";
import ElectionModelProjectionUtils from "./ElectionModelProjectionUtils";

import ElectionModelUtils from "./ElectionModelUtils";

export default class ElectionModel {
  constructor(
    elections,
    currentElection,
    releasedPDIDList,
    nonReleasedPDIDList
  ) {
    this.elections = elections;
    this.currentElection = currentElection;
    this.releasedPDIDList = releasedPDIDList;
    this.nonReleasedPDIDList = nonReleasedPDIDList;
    this.trainingOutput = this.train();
  }

  getXEvaluate() {
    return ElectionModelFeatureUtils.getFeatureMatrix(
      [this.currentElection],
      this.releasedPDIDList
    );
  }

  train() {
    const previousElections = Election.getPreviousElections(
      this.elections,
      this.currentElection
    );

    const XAll = ElectionModelFeatureUtils.getFeatureMatrixListForElections(
      previousElections,
      this.releasedPDIDList
    );
    const YAll = ElectionModelFeatureUtils.getFeatureMatrixListForElections(
      previousElections,
      this.nonReleasedPDIDList
    );
    const pError = ElectionModelUtils.getPErrorEvaluate(XAll, YAll);
    const model = ElectionModelUtils.trainModel(XAll, YAll);

    const normPDToPartyToPVotes = ElectionModelProjectionUtils.getProjection(
      model,
      this.currentElection,
      this.getXEvaluate(),
      this.nonReleasedPDIDList
    );
    return { normPDToPartyToPVotes, pError };
  }

  getProjectedResultList() {
    const { normPDToPartyToPVotes, pError } = this.trainingOutput;
    const lastElection = Election.getPenultimateElection(
      this.elections,
      this.currentElection
    );
    const lastElectionOfSameType = Election.getPenultimateElectionOfSameType(
      this.elections,
      this.currentElection
    );
    const notReleasedResultList = this.nonReleasedPDIDList
      .map(function (pdID) {
        return ElectionModelProjectionUtils.getSimulatedResult(
          lastElection,
          lastElectionOfSameType,
          pdID,
          normPDToPartyToPVotes,
          pError
        );
      })
      .filter((result) => result !== null);

    const releasedResultList = this.releasedPDIDList.map((pdID) =>
      this.currentElection.getResult(pdID)
    );

    return [...releasedResultList, ...notReleasedResultList].filter(
      (result) => result
    );
  }

  getElectionNotReleasedPrediction() {
    const election = new Election(
      this.currentElection.electionType,
      this.currentElection.date
    );
    const pdResultList = this.getProjectedResultList();
    election.build(EntType.PD, pdResultList);
    return election;
  }
}

Object.assign(ElectionModel, ElectionModelUtils);
