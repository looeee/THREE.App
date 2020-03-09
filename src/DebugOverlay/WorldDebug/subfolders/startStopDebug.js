function startStopDebug(folder, world) {
  const params = {
    start: () => {
      world.start();
    },
    stop: () => {
      world.stop();
    },
  };
  folder.add(params, 'start');
  folder.add(params, 'stop');
}

export { startStopDebug };
