import { getRandomSample } from '../utilities/getRandomSample.js';
function highlightsDebug(folder, world) {
  const params = {
    showAllHighlights: () => {
      world.showAllHighlights();
    },
    hideAllHighlights: () => {
      world.hideAllHighlights();
    },
    stressTest: () => {
      // TODO
    },
    randomHighlights: () => {
      const names = world.getHighlightNames();
      const random = getRandomSample(names, 10);
      world.showHighlights(random);
    },
    addHighlights: '',
    hideHighlights: '',
    logNames: () => {
      console.log(world.getHighlightNames());
    },
  };
  folder.add(params, 'showAllHighlights').name('Show all highlights');
  folder.add(params, 'hideAllHighlights').name('Hide all highlights');
  folder.add(params, 'stressTest').name('Stress test');
  folder
    .add(params, 'randomHighlights')
    .name('Show random highlights');
  folder
    .add(params, 'addHighlights')
    .name('Add highlights')
    .onChange(() => {
      if (
        params.addHighlights.length > 2 &&
        +params.addHighlights > 400
      ) {
        world.showHighlights([params.addHighlights]);
      }
    });
  folder
    .add(params, 'hideHighlights')
    .name('Hide highlights')
    .onChange(() => {
      if (
        params.addHighlights.length > 2 &&
        +params.addHighlights > 400
      ) {
        world.showHighlights([params.hideHighlights]);
      }
    });
  folder.add(params, 'logNames').name('Log Names');
}

export { highlightsDebug };
