import { CLASSPREFIX } from '../../enums/constants';

export const defaultConfig = {
    defClassName: 'layer-text',
    classPrefix: CLASSPREFIX,
    className: '',
    transform: {
        type: 'identity'
    },
    interaction: {
        highlight: [{
            type: 'fill',
            intensity: [0, 0, -15, 0]
        }],
        fade: [{
            type: 'fill',
            intensity: [0, 0, +15, 0]
        }],
        focus: [{
            type: 'fill',
            intensity: [0, 0, +15, 0]
        }]
    },
    transition: {
        effect: 'cubic',
        duration: 1000
    },
    encoding: {
        color: {},
        size: {},
        radius: {},
        angle: {},
        text: {
            value: '',
            formatter: (val, i, data, context) => {
                const valueParser = context.valueParser();
                return valueParser(val);
            },
            background: {
                padding: 10
            }
        },
        rotation: {
            value: 0
        },
        'alignment-baseline': {
            value: 'middle'
        }
    },
    states: {
        highlight: {
            className: `${CLASSPREFIX}-layer-text-highlight`
        },
        fadeout: {
            className: `${CLASSPREFIX}-layer-text-fadeout`
        },
        selected: {
            className: `${CLASSPREFIX}-layer-text-selected`
        }
    }
};
