import t0 from '../data/armenia-2027.json';
import {tripBoundary} from '../contract';
export const trips=[t0].map(t=>tripBoundary.parse(t));
export const drafts=[].map(t=>tripBoundary.parse(t));
