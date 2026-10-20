import type {ProjectState} from '../project/domain';
import {collectRecords,emptyDraft,buildReport,blocksMarkdown} from './model';
export function reportMarkdown(state:ProjectState,language='es-CO'){const records=collectRecords(state);return blocksMarkdown(buildReport(records,state.reportDraft||emptyDraft(records),language));}
