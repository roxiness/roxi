const { Machine, interpret } = require('xstate')

const createAppMachine = Machine({
  id: 'createApp',
  initial: 'idle',
  context: {
    idleMsg: '',
    retries: 0
  },
  states: {
    idle: {
      on: { FETCH: 'loading' }
    },
    greeting: {},
    cloneRepo: {},
    setInitialPackageJson: {},
    prompt: {
      states: {
        packageManager: {},
        gitHost: {},
        gitPackageConfig: {}
      },
    },
    loading: {
      on: { RESOLVE: 'success', REJECT: 'failure' }
    },
    success: {
      type: 'final'
    },
    failure: {
      on: {
        RETRY: {
          target: 'loading',
          actions: assign({
            retries: (context, event) => context.retries + 1
          })
        }
      }
    }
  }
});

const createAppService = interpret(createAppMachine).onTransition(state =>
  console.log(state.value)
);
