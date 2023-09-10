/**
 * @type {TextLine[]}
 */
const textLines = [
  {
    chrs: '＜私は＞',
    entry: { step: 0, x: 0, y: 0, rot: 0 },
    letterAnimParamsList: [
      [{ easing: 'none' }],
      [{ easing: 'easeLinear', y: 40 }],
      [{ easing: 'easeLinear', y: 10 }],
      [{ easing: 'none' }],
    ],
    lineAnimParams: [
      { rot: 10, rotX: -100, easing: 'easeOutCubic' },
      { rot: -35, rotX: -100, rotY: 40, easing: 'easeOutCubic' },
      { rot: +35, rotX: 100, rotY: 40, easing: 'easeOutCubic' },
    ],
  },
  {
    chrs: '集積の',
    entry: { step: 1, x: 80, y: 80, rot: 0 },
    letterAnimParamsList: [
      [{ easing: 'easeLinear', y: 40 }],
      [{ easing: 'none' }],
      [{ easing: 'none' }],
    ],
    lineAnimParams: [
      { rot: 20, rotX: 100, easing: 'easeOutCubic' },
      { rot: -25, rotX: -150, rotY: 100, easing: 'easeOutCubic' },
    ],
  },
  {
    chrs: '海を',
    entry: { step: 2, x: 60, y: 150, rot: 10 },
    letterAnimParamsList: [
      [{ easing: 'easeLinear', y: 20 }],
      [{ easing: 'none' }],
    ],
    lineAnimParams: [{ rot: -15, x: -50, y: -80, easing: 'easeOutCubic' }],
  },
];
