// @flow
import { catchError } from "rxjs/operators";
import { saveEpic, saveAsEpic } from "./saving";

import {
  fetchContentEpic,
  newNotebookEpic,
  launchKernelWhenNotebookSetEpic
} from "./loading";

import type { ActionsObservable, Epic } from "redux-observable";

import {
  launchKernelEpic,
  launchKernelByNameEpic,
  interruptKernelEpic,
  killKernelEpic,
  watchSpawn
} from "./zeromq-kernels";

import {
  restartKernelEpic,
  acquireKernelInfoEpic,
  watchExecutionStateEpic,
  executeCellEpic,
  updateDisplayEpic,
  commListenEpic,
  executeAllCellsEpic,
  setNotebookEpic
} from "@nteract/core/epics";

import { publishEpic } from "./github-publish";

import {
  loadConfigEpic,
  saveConfigEpic,
  saveConfigOnChangeEpic
} from "./config";

export function retryAndEmitError(err: Error, source: ActionsObservable<*>) {
  return source.startWith({ type: "ERROR", payload: err, error: true });
}

export const wrapEpic = (epic: Epic<*, *, *>) => (...args: any) =>
  epic(...args).pipe(catchError(retryAndEmitError));

const epics = [
  launchKernelWhenNotebookSetEpic,
  setNotebookEpic,
  executeAllCellsEpic,
  restartKernelEpic,
  watchSpawn,
  commListenEpic,
  publishEpic,
  saveEpic,
  saveAsEpic,
  fetchContentEpic,
  newNotebookEpic,
  executeCellEpic,
  updateDisplayEpic,
  launchKernelEpic,
  launchKernelByNameEpic,
  interruptKernelEpic,
  killKernelEpic,
  acquireKernelInfoEpic,
  watchExecutionStateEpic,
  loadConfigEpic,
  saveConfigEpic,
  saveConfigOnChangeEpic
].map(wrapEpic);

export default epics;
