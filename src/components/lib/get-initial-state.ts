export function getInitialState() {
  return {
    doc: {
      label: 'How can we help?',
      children: [
        {
          label: 'I have one existing Observable, and',
          children: [
            {
              label: 'I want to change each emitted value',
              children: [
                {
                  label: 'to be a constant value',
                  value: 'https://rxjs.dev/api/operators/mapTo',
                },
                {
                  label: 'to be a value calculated through a formula',
                  value: 'https://rxjs.dev/api/operators/map',
                },
              ],
            },
            {
              label: 'I want to pick a property off each emitted value',
              value: 'https://rxjs.dev/api/operators/pluck',
            },
            {
              label: 'I want to spy the values being emitted without affecting them',
              value: 'https://rxjs.dev/api/operators/tap',
            },
            {
              label: 'I want to allow some values to pass',
              children: [
                {
                  label: 'based on custom logic',
                  value: 'https://rxjs.dev/api/operators/filter',
                },
                {
                  label: 'if they are at the start of the Observable',
                  children: [
                    {
                      label: 'and only the first value',
                      value: 'https://rxjs.dev/api/operators/first',
                    },
                    {
                      label: 'based on a given amount',
                      value: 'https://rxjs.dev/api/operators/take',
                    },
                    {
                      label: 'based on custom logic',
                      value: 'https://rxjs.dev/api/operators/takeWhile',
                    },
                  ],
                },
                {
                  label: 'if they are exactly the n-th emission',
                  value: 'https://rxjs.dev/api/operators/elementAt',
                },
                {
                  label: 'if they are at the end of the Observable',
                  children: [
                    {
                      label: 'and only the last value',
                      value: 'https://rxjs.dev/api/operators/last',
                    },
                    {
                      label: 'based on a given amount',
                      value: 'https://rxjs.dev/api/operators/takeLast',
                    },
                  ],
                },
                {
                  label: 'until another Observable emits a value',
                  value: 'https://rxjs.dev/api/operators/takeUntil',
                },
              ],
            },
            {
              label: 'I want to ignore values',
              children: [
                {
                  label: 'altogether',
                  value: 'https://rxjs.dev/api/operators/ignoreElements',
                },
                {
                  label: 'from the start of the Observable',
                  children: [
                    {
                      label: 'based on a given amount',
                      value: 'https://rxjs.dev/api/operators/skip',
                    },
                    {
                      label: 'based on custom logic',
                      value: 'https://rxjs.dev/api/operators/skipWhile',
                    },
                  ],
                },
                {
                  label: 'from the end of the Observable',
                  value: 'https://rxjs.dev/api/operators/skipLast',
                },
                {
                  label: 'until another Observable emits a value',
                  value: 'https://rxjs.dev/api/operators/skipUntil',
                },
                {
                  label: 'that match some previous value',
                  children: [
                    {
                      label: 'according to value equality',
                      children: [
                        {
                          label: 'emitted just before the current value',
                          value: 'https://rxjs.dev/api/operators/distinctUntilChanged',
                        },
                        {
                          label: 'emitted some time in the past',
                          value: 'https://rxjs.dev/api/operators/distinct',
                        },
                      ],
                    },
                    {
                      label: 'according to a key or object property',
                      children: [
                        {
                          label: 'emitted just before the current value',
                          value: 'https://rxjs.dev/api/operators/distinctUntilKeyChanged',
                        },
                      ],
                    },
                  ],
                },
                {
                  label: 'that occur too frequently',
                  children: [
                    {
                      label: 'by emitting the first value in each time window',
                      children: [
                        {
                          label: `where time windows are determined by another Observable's emissions`,
                          value: 'https://rxjs.dev/api/operators/throttle',
                        },
                        {
                          label: 'where time windows are determined by a time duration',
                          value: 'https://rxjs.dev/api/operators/throttleTime',
                        },
                      ],
                    },
                    {
                      label: 'by emitting the last value in each time window',
                      children: [
                        {
                          label: `where time windows are determined by another Observable's emissions`,
                          value: 'https://rxjs.dev/api/operators/audit',
                        },
                        {
                          label: 'where time windows are determined by a time duration',
                          value: 'https://rxjs.dev/api/operators/auditTime',
                        },
                      ],
                    },
                    {
                      label: 'by emitting the last value as soon as enough silence has occured',
                      children: [
                        {
                          label:
                            'where the silence duration threshold is determined by another Observable',
                          value: 'https://rxjs.dev/api/operators/debounce',
                        },
                        {
                          label:
                            'where the silence duration threshold is determined by a time duration',
                          value: 'https://rxjs.dev/api/operators/debounceTime',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              label: 'I want to compute a formula using all values emitted',
              children: [
                {
                  label: 'and only output the final computed value',
                  value: 'https://rxjs.dev/api/operators/reduce',
                },
                {
                  label: 'and output the computed values when the source emits a value',
                  value: 'https://rxjs.dev/api/operators/scan',
                },
                {
                  label:
                    'and output the computed values as a nested Observable when the source emits a value',
                  value: 'https://rxjs.dev/api/operators/mergeScan',
                },
              ],
            },
            {
              label: 'I want to wrap its messages with metadata',
              children: [
                {
                  label: 'that describes each notification (next, error, or complete)',
                  value: 'https://rxjs.dev/api/operators/materialize',
                },
                {
                  label: 'that includes the time past since the last emitted value',
                  value: 'https://rxjs.dev/api/operators/timeInterval',
                },
              ],
            },
            {
              label: 'after a period of inactivity',
              children: [
                {
                  label: 'I want to throw an error',
                  value: 'https://rxjs.dev/api/operators/timeout',
                },
                {
                  label: 'I want to switch to another Observable',
                  value: 'https://rxjs.dev/api/operators/timeoutWith',
                },
              ],
            },
            {
              label: 'I want to ensure there is only one value',
              value: 'https://rxjs.dev/api/operators/single',
            },
            {
              label: 'I want to know how many values it emits',
              value: 'https://rxjs.dev/api/operators/count',
            },
            {
              label: 'I want to prepend one value',
              value: 'https://rxjs.dev/api/operators/startWith',
            },
            {
              label: 'I want to delay the emissions',
              children: [
                {
                  label: 'based on a given amount of time',
                  value: 'https://rxjs.dev/api/operators/delay',
                },
                {
                  label: 'based on the emissions of another Observable',
                  value: 'https://rxjs.dev/api/operators/delayWhen',
                },
              ],
            },
            {
              label: 'I want to group the values',
              children: [
                {
                  label: 'until the Observable completes',
                  children: [
                    {
                      label: 'and convert to an array',
                      value: 'https://rxjs.dev/api/operators/toArray',
                    },
                    {
                      label: 'and convert to a Promise',
                      value: 'https://rxjs.dev/api/operators/Observable',
                    },
                  ],
                },
                {
                  label: 'consecutively in pairs, as arrays',
                  value: 'https://rxjs.dev/api/operators/pairwise',
                },
                {
                  label:
                    'based on a criterion, and output two Observables: ' +
                    'those that match the criterion and those that do not',
                  value: 'https://rxjs.dev/api/operators/partition',
                },
                {
                  label: 'in batches of a particular size',
                  children: [
                    {
                      label: 'and emit the group as an array',
                      value: 'https://rxjs.dev/api/operators/bufferCount',
                    },
                    {
                      label: 'and emit the group as a nested Observable',
                      value: 'https://rxjs.dev/api/operators/windowCount',
                    },
                  ],
                },
                {
                  label: 'based on time',
                  children: [
                    {
                      label: 'and emit the group as an array',
                      value: 'https://rxjs.dev/api/operators/bufferTime',
                    },
                    {
                      label: 'and emit the group as a nested Observable',
                      value: 'https://rxjs.dev/api/operators/windowTime',
                    },
                  ],
                },
                {
                  label: 'until another Observable emits',
                  children: [
                    {
                      label: 'and emit the group as an array',
                      value: 'https://rxjs.dev/api/operators/buffer',
                    },
                    {
                      label: 'and emit the group as a nested Observable',
                      value: 'https://rxjs.dev/api/operators/window',
                    },
                  ],
                },
                {
                  label: 'based on the emissions of an Observable created on-demand',
                  children: [
                    {
                      label: 'and emit the group as an array',
                      value: 'https://rxjs.dev/api/operators/bufferWhen',
                    },
                    {
                      label: 'and emit the group as a nested Observable',
                      value: 'https://rxjs.dev/api/operators/windowWhen',
                    },
                  ],
                },
                {
                  label:
                    'based on another Observable for opening a group, and an Observable for closing a group',
                  children: [
                    {
                      label: 'and emit the group as an array',
                      value: 'https://rxjs.dev/api/operators/bufferToggle',
                    },
                    {
                      label: 'and emit the group as a nested Observable',
                      value: 'https://rxjs.dev/api/operators/windowToggle',
                    },
                  ],
                },
                {
                  label: 'based on a key calculated from the emitted values',
                  value: 'https://rxjs.dev/api/operators/groupBy',
                },
              ],
            },
            {
              label: 'I want to start a new Observable for each value',
              children: [
                {
                  label: 'and emit the values from all nested Observables in parallel',
                  children: [
                    {
                      label: 'where the nested Observable is the same for every value',
                      value: 'https://rxjs.dev/api/operators/mergeMapTo',
                    },
                    {
                      label: 'where the nested Observable is calculated for each value',
                      value: 'https://rxjs.dev/api/operators/mergeMap',
                    },
                  ],
                },
                {
                  label: 'and emit the values from each nested Observable in order',
                  children: [
                    {
                      label: 'where the nested Observable is the same for every value',
                      value: 'https://rxjs.dev/api/operators/concatMapTo',
                    },
                    {
                      label: 'where the nested Observable is calculated for each value',
                      value: 'https://rxjs.dev/api/operators/concatMap',
                    },
                  ],
                },
                {
                  label: 'and cancel the previous nested Observable when a new value arrives',
                  children: [
                    {
                      label: 'where the nested Observable is the same for every value',
                      value: 'https://rxjs.dev/api/operators/switchMapTo',
                    },
                    {
                      label: 'where the nested Observable is calculated for each value',
                      value: 'https://rxjs.dev/api/operators/switchMap',
                    },
                  ],
                },
                {
                  label:
                    'and ignore incoming values while the current nested Observable has not yet completed',
                  value: 'https://rxjs.dev/api/operators/exhaustMap',
                },
                {
                  label: 'and recursively start a new Observable for each new value',
                  value: 'https://rxjs.dev/api/operators/expand',
                },
              ],
            },
            {
              label: 'I want to perform custom operations',
              value: 'https://rxjs.dev/api/operators/pipe',
            },
            {
              label: 'I want to share a subscription between multiple subscribers',
              children: [
                {
                  label: 'using a conventional Subject',
                  children: [
                    {
                      label: 'and start it as soon as the first subscriber arrives',
                      value: 'https://rxjs.dev/api/operators/share',
                    },
                    {
                      label: 'and start it manually or imperatively',
                      value: 'https://rxjs.dev/api/operators/publish',
                    },
                  ],
                },
                {
                  label: 'using a BehaviorSubject',
                  value: 'https://rxjs.dev/api/operators/publishBehavior',
                },
                {
                  label: 'using a ReplaySubject',
                  value: 'https://rxjs.dev/api/operators/publishReplay',
                },
                {
                  label: 'using an AsyncSubject',
                  value: 'https://rxjs.dev/api/operators/publishLast',
                },
                {
                  label: 'using a specific subject implementation',
                  value: 'https://rxjs.dev/api/operators/multicast',
                },
              ],
            },
            {
              label: 'when an error occurs',
              children: [
                {
                  label: 'I want to start a new Observable',
                  value: 'https://rxjs.dev/api/operators/catchError',
                },
                {
                  label: 'I want to re-subscribe',
                  children: [
                    { label: 'immediately', value: 'https://rxjs.dev/api/operators/retry' },
                    {
                      label: 'when another Observable emits',
                      value: 'https://rxjs.dev/api/operators/retryWhen',
                    },
                  ],
                },
              ],
            },
            {
              label: 'when it completes',
              children: [
                {
                  label: 'I want to re-subscribe',
                  children: [
                    { label: 'immediately', value: 'https://rxjs.dev/api/operators/repeat' },
                    {
                      label: 'when another Observable emits',
                      value: 'https://rxjs.dev/api/operators/repeatWhen',
                    },
                  ],
                },
                {
                  label: 'I want to start a new Observable',
                  value: 'https://rxjs.dev/api/operators/concat',
                },
              ],
            },
            {
              label: 'when it completes, errors or unsubscribes, I want to execute a function',
              value: 'https://rxjs.dev/api/operators/finalize',
            },
            {
              label: 'I want to change the scheduler',
              children: [
                {
                  label: 'that routes calls to subscribe',
                  value: 'https://rxjs.dev/api/operators/subscribeOn',
                },
                {
                  label: 'that routes values to observers',
                  value: 'https://rxjs.dev/api/operators/observeOn',
                },
              ],
            },
            {
              label: 'I want to combine this Observable with others, and',
              children: [
                {
                  label:
                    'I want to receive values only from the Observable that emits a value first',
                  value: 'https://rxjs.dev/api/operators/race',
                },
                {
                  label: 'I want to output the values from either of them',
                  value: 'https://rxjs.dev/api/operators/merge',
                },
                {
                  label: 'I want to output a value computed from values of the source Observables',
                  children: [
                    {
                      label: 'using the latest value of each source whenever any source emits',
                      value: 'https://rxjs.dev/api/operators/combineLatest',
                    },
                    {
                      label:
                        'using the latest value of each source only when the primary Observable emits',
                      value: 'https://rxjs.dev/api/operators/withLatestFrom',
                    },
                    {
                      label: 'using each source value only once',
                      value: 'https://rxjs.dev/api/operators/zip',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'I have some Observables to combine together as one Observable, and',
          children: [
            {
              label: 'I want to receive values only from the Observable that emits a value first',
              value: 'https://rxjs.dev/api/operators/race',
            },
            {
              label: 'I want to be notified when all of them have completed',
              value: 'https://rxjs.dev/api/operators/forkJoin',
            },
            {
              label: 'I want to output the values from either of them',
              value: 'https://rxjs.dev/api/operators/merge',
            },
            {
              label: 'I want to output a value computed from values of the source Observables',
              children: [
                {
                  label: 'using the latest value of each source whenever any source emits',
                  value: 'https://rxjs.dev/api/operators/combineLatest',
                },
                {
                  label: 'using each source value only once',
                  value: 'https://rxjs.dev/api/operators/zip',
                },
              ],
            },
            {
              label: 'I want to subscribe to each in order',
              value: 'https://rxjs.dev/api/operators/concat',
            },
          ],
        },
        {
          label: 'I have no Observables yet, and',
          children: [
            {
              label: 'I want to create a new Observable',
              children: [
                {
                  label: 'using custom logic',
                  value: 'https://rxjs.dev/api/operators/Observable',
                },
                {
                  label: 'using a state machine similar to a for loop',
                  value: 'https://rxjs.dev/api/operators/generate',
                },
                {
                  label: 'that throws an error',
                  value: 'https://rxjs.dev/api/operators/throwError',
                },
                {
                  label: 'that just completes, without emitting values',
                  value: 'https://rxjs.dev/api/operators/EMPTY',
                },
                {
                  label: 'that never emits anything',
                  value: 'https://rxjs.dev/api/operators/NEVER',
                },
                {
                  label: 'from an existing source of events',
                  children: [
                    {
                      label: 'coming from the DOM or Node.js or similar',
                      value: 'https://rxjs.dev/api/operators/fromEvent',
                    },
                    {
                      label: 'that uses an API to add and remove event handlers',
                      value: 'https://rxjs.dev/api/operators/fromEventPattern',
                    },
                  ],
                },
                {
                  label: 'from a Promise or an event source',
                  value: 'https://rxjs.dev/api/operators/from',
                },
                {
                  label: 'that iterates',
                  children: [
                    {
                      label: 'over the values in an array',
                      value: 'https://rxjs.dev/api/operators/from',
                    },
                    {
                      label: 'over values in a numeric range',
                      value: 'https://rxjs.dev/api/operators/range',
                    },
                    {
                      label: 'over prefined values given as arguments',
                      value: 'https://rxjs.dev/api/operators/of',
                    },
                  ],
                },
                {
                  label: 'that emits values on a timer',
                  children: [
                    { label: 'regularly', value: 'https://rxjs.dev/api/operators/interval' },
                    {
                      label: 'with an optional initial delay',
                      value: 'https://rxjs.dev/api/operators/timer',
                    },
                  ],
                },
                {
                  label: 'which is built on demand when subscribed',
                  value: 'https://rxjs.dev/api/operators/defer',
                },
              ],
            },
            {
              label: 'I want to convert a callback to an Observable',
              children: [
                {
                  label: 'supporting a conventional callback API',
                  value: 'https://rxjs.dev/api/operators/bindCallback',
                },
                {
                  label: 'supporting Node.js callback style API',
                  value: 'https://rxjs.dev/api/operators/bindNodeCallback',
                },
              ],
            },
          ],
        },
      ],
    },
  };
}
