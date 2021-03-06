import { CLASSPREFIX } from '../../enums/constants';

export const defaultConfig = {
    defClassName: 'layer-tick',
    className: '',
    classPrefix: CLASSPREFIX,
    interaction: {
        highlight: [{
            type: 'stroke',
            intensity: [0, 0, -15, 0]
        }],
        fade: [{
            type: 'stroke',
            intensity: [0, 0, 15, 0]
        }],
        focus: [{
            type: 'stroke',
            intensity: [0, 0, 15, 0]
        }]
    },
    innerPadding: 0.1,
    transform: {
        type: 'identity'
    },
    transition: {
        effect: 'cubic',
        duration: 1000
    },
    interpolate: 'linear',
    encoding: {
        color: { },
        x: {},
        y: {},
        x0: {},
        y0: {},
        radius: {},
        radius0: {},
        angle: {},
        angle0: {},
        strokeOpacity: {
            value: 0.5
        },
        fillOpacity: {
            value: 0.5
        }
    },
    states: {
        highlight: {
            className: `${CLASSPREFIX}-layer-tick-highlight`
        },
        fadeout: {
            className: `${CLASSPREFIX}-layer-tick-fadeout`
        },
        selected: {
            className: `${CLASSPREFIX}-layer-tick-selected`
        }
    }
};
