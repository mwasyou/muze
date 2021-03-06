import { FieldType, InvalidAwareTypes } from 'muze-utils';
import { defaultConfig } from './default-config';
import { LineLayer } from '../line';
import drawArea from './renderer';
import './styles.scss';
import { STACK, ENCODING } from '../../enums/constants';
import {
    getAxesScales,
    positionPoints,
    getIndividualClassName,
    getValidTransformForAggFn,
    getColorMetaInf,
    resolveEncodingValues,
    sortData
} from '../../helpers';

/**
 * Area layer renders a closed path. The mark type of this layer is ```area```. This layer can be used
 * to create stacked or multi-series areas and vertical range area plots by using the encoding properties.
 *
 * To create this layer using layer configuration from canvas,
 * ```
 *      canvas.layers([{
 *          mark: 'area',
 *          transform: {
 *              type: 'stack' // Produces a stacked area.
 *          }
 *      }]);
 * ```
 *
 * @public
 *
 * @class
 * @module AreaLayer
 * @extends LineLayer
 */
export default class AreaLayer extends LineLayer {
    /** oation of line layer
     * @return {Object} Default configuration of layer
     */
    static defaultConfig () {
        return defaultConfig;
    }

    /**
     *
     *
     * @static
     *
     * @memberof AreaLayer
     */
    static formalName () {
        return 'area';
    }

    /**
     * Calculates the domain from data. It calls its parent class's method which is line layer
     * to get the domain and overwrites the domain according to its need.
     * @return {Array} Domain values
     */
    calculateDomainFromData (data, encodingFieldsInf, fieldsConfig) {
        const domains = super.calculateDomainFromData(data, fieldsConfig);
        [ENCODING.X, ENCODING.Y].forEach((type) => {
            const { [`${type}FieldType`]: fieldType } = encodingFieldsInf;
            if (fieldType === FieldType.MEASURE && domains[type] !== undefined) {
                domains[type][0] = Math.min(domains[type][0], 0);
                domains[type][1] = Math.max(0, domains[type][1]);
            }
        });
        return domains;
    }

    /**
     * Returns the drawing method of this layer
     * @return {Function} Draw method
     */
    getDrawFn () {
        return drawArea;
    }

    /**
     * Generates the x and y positions for each point
     * @param {Array} data Data Array
     * @param {Object} encoding Visual Encodings of the layer
     * @param {Object} axes Contains the axis
     * @return {Array} Array of points
     */
    translatePoints (data) {
        let points = [];
        const transformType = this.transformType();
        const axes = this.axes();
        const colorAxis = axes.color;
        const config = this.config();
        const fieldsConfig = this.data().getFieldsConfig();
        const { xField, yField, y0Field } = this.encodingFieldsInf();
        const {
            xAxis,
            yAxis
       } = getAxesScales(axes);
        const classNameFn = config.individualClassName;
        const isXDim = fieldsConfig[xField] && fieldsConfig[xField].def.type === FieldType.DIMENSION;
        const isYDim = fieldsConfig[yField] && fieldsConfig[yField].def.type === FieldType.DIMENSION;
        const key = isXDim ? 'x' : (isYDim ? 'y' : null);
        const minYVal = yAxis.domain()[0];
        const basePos = minYVal < 0 ? yAxis.getScaleValue(0) : yAxis.getScaleValue(minYVal);
        sortData(data, axes);
        points = data.map((d, i) => {
            let color;
            const xPx = xAxis.getScaleValue(d.x) + xAxis.getUnitWidth() / 2;
            const yPx = yAxis.getScaleValue(d.y);
            const y0Px = (y0Field || transformType === STACK) ? yAxis.getScaleValue(d.y0) : basePos;
            color = colorAxis.getColor(d.color);
            const invalidY = d.y instanceof InvalidAwareTypes;
            const invalidY0 = d.y0 instanceof InvalidAwareTypes;
            const resolvedValues = resolveEncodingValues({
                values: {
                    x: xPx,
                    y: yPx,
                    y0: y0Px,
                    color
                },
                data: d
            }, i, data, this);
            color = resolvedValues.color;
            const point = {
                enter: {
                    x: xPx,
                    y: invalidY ? null : basePos,
                    y0: invalidY0 ? null : basePos
                },
                update: {
                    x: xPx,
                    y: invalidY ? null : resolvedValues.y,
                    y0: invalidY0 ? null : resolvedValues.y0
                },
                source: d.source,
                rowId: d.rowId,
                className: classNameFn ? classNameFn(d, i, data, this) : '',
                style: {
                    fill: color
                },
                meta: getColorMetaInf(color, colorAxis)
            };
            point.className = getIndividualClassName(d, i, data, this);
            this.cachePoint(d[key], point);
            return point;
        });
        points = positionPoints(this, points);
        points = points.filter((point) => {
            const update = point.update;
            return !isNaN(update.x) && !isNaN(update.y);
        });
        return points;
    }

    resolveTransformType () {
        this._transformType = getValidTransformForAggFn(this);
    }

    /**
     * Get the css styles need to be applied on the line path
     * @param {string} color Color value
     * @return {Object} Path styles
     */
    getPathStyle (color) {
        return {
            fill: color
        };
    }
}

