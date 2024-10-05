import { createServer } from 'vite';
import { ViteNodeServer } from 'vite-node/server'
import { ViteNodeRunner } from 'vite-node/client'
import { installSourcemapsSupport } from 'vite-node/source-map'

// create vite server
const server = await createServer({
  appType: 'custom',
  clearScreen: false,
  plugins: [{
    async handleHotUpdate(ctx) {
      ctx.modules.forEach((m) => {
        if (m.id) {

          runner.moduleCache.deleteByModuleId(m.id);
          console.log('> cleared file from vite module cache', m.id);
        }
      });
      
      await runTestFile();
    }
  }],
  optimizeDeps: {
    // It's recommended to disable deps optimization
    disabled: true,
  },
})
// this is need to initialize the plugins
await server.pluginContainer.buildStart({})

// create vite-node server
const node = new ViteNodeServer(server)

// fixes stacktraces in Errors
installSourcemapsSupport({
  getSourceMap: source => node.getSourceMap(source),
})

// create vite-node runner
const runner = new ViteNodeRunner({
  debug: true,
  root: server.config.root,
  base: server.config.base,
  // when having the server and runner in a different context,
  // you will need to handle the communication between them
  // and pass to this function
  fetchModule(id) {
    return node.fetchModule(id)
  },
  resolveId(id, importer) {
    return node.resolveId(id, importer)
  },
})

async function runTestFile() {
  console.log('running test file!');
  // execute the file
  try {
    await runner.executeFile('./example.ts')
    console.log('> ran file without errors');
  } catch (err) {
    console.log('> ERROR! location from stack is:');
    console.log(err.stack.split('\n')[1])
    
  }
}

await runTestFile();

// close the vite server
// await server.close()