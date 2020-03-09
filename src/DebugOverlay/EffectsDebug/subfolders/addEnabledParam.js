function addEnabledParam(folder, pass) {
  const params = {
    enabled: pass.enabled,
  };
  folder
    .add(params, 'enabled')
    .name('Enabled')
    .onChange(() => {
      pass.enabled = params.enabled;
    });
}

export { addEnabledParam };
