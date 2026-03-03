// Daily runner (cron entrypoint)
// TODO: generate 3 shorts (KO/JP/EN) at ~45s each, then upload.
// For now this is a placeholder to wire the pipeline.

console.log(`[${new Date().toISOString()}] run_daily start`);
console.log('Next: implement video generation with ffmpeg + macOS say, then call tools/youtube/upload.mjs for ko/jp/en outputs.');
console.log(`[${new Date().toISOString()}] run_daily end`);
