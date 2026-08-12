#!/usr/bin/env node
// /data を /docs/data に写し、index.json を作り直すだけの雑用。
import { syncDocsData } from './lib/paths.js';

const { days, meetings } = syncDocsData();
console.log(`✓ docs/data を更新しました（${days.length} 日分 / 議事録 ${meetings.length} 本）`);
