import type {ProjectState} from '../../project/domain';
import {collectRecords,emptyDraft} from '../domain/records';
import {blocksMarkdown} from '../domain/document';
import {buildReport} from './reportFormat';
export function reportMarkdown(state:ProjectState,language='es-CO'){const records=collectRecords(state);return blocksMarkdown(buildReport(records,state.reportDraft||emptyDraft(records),language));}
