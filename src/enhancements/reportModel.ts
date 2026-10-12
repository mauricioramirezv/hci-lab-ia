import type {ProjectState} from '../domain';
import {collectRecords,emptyDraft,buildReport,blocksMarkdown} from '../reports/model';
export function reportMarkdown(state:ProjectState,language='es-CO'){const records=collectRecords(state);return blocksMarkdown(buildReport(records,state.reportDraft||emptyDraft(records),language));}
