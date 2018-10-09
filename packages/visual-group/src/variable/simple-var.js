import { DateTimeFormatter } from 'muze-utils';
import Variable from './variable';

/**
 * This is a wrapper on top of fields passed in rows or columns in canvas. This is used to get the type of field or
 * get min difference from the field values.
 *
 * @public
 * @class SimpleVariable
 * @namespace muze
 * @extends {Variable}
 */
export default class SimpleVariable extends Variable {

    /**
     * Creates an instance of simple variable instance.
     *
     * @param {string} text Field name.
     */
    constructor (text) {
        super();
        this.oneVar(text);
    }

    /**
     * Gets the field name associated with this variable instance.
     *
     * @public
     * @return {string} Name of the field.
     */
    oneVar (...oneV) {
        if (oneV.length) {
            this._oneVar = oneV[0];
            return this;
        }
        return this._oneVar;
    }

    data (...dm) {
        if (dm.length) {
            this._data = dm[0];
            return this;
        }
        return this._data;
    }

    toString () {
        return this.oneVar();
    }

    /**
     * Gets the number formatter function of this variable.
     *
     * @public
     * @return {Function} Number formatter function.
     */
    numberFormat () {
        if (this.type() === 'measure') {
            const formatter = this.data().getFieldspace().getMeasure()[this.oneVar()]._ref;
            return formatter.numberFormat();
        } return val => val;
    }

    format (values) {
        if (values && this.subtype() === 'temporal') {
            const formatter = this.data().getFieldspace().getDimension()[this.oneVar()]._ref.schema.format;
            const dtFormat = new DateTimeFormatter(formatter);
            values = values.map(e => dtFormat.getNativeDate(e));
        }
        return values;
    }

    /**
     * Return the field names associated with this variable instance.
     *
     * @public
     * @return {Array} Array of fields.
     */
    getMembers () {
        return [this.oneVar()];
    }

    /**
     * Returns the type of the variable. Whether it is measure or dimension.
     *
     * @public
     * @return {string} Type of variable.
     */
    type () {
        const fieldDef = this.data().getFieldsConfig()[this.oneVar()].def;
        return fieldDef.type;
    }

    /**
     * Returns the subtype of the variable. Subtype can be categorical or temporal. If no subtype is found, then it
     * returns the type of the variable.
     *
     * @public
     * @return {string} Subtype of variable.
     */
    subtype () {
        const fieldDef = this.data().getFieldsConfig()[this.oneVar()].def;
        return fieldDef.subtype || fieldDef.type;
    }

    /**
     * Returns the minimum consecutive difference between the data values of this variable.
     *
     * @returns {number} Minimum consecutive difference.
     */
    getMinDiff () {
        const fieldSpace = this.data().getFieldspace();
        return fieldSpace.fieldsObj()[this.oneVar()].getMinDiff();
    }

    /**
     * Returns true if two variable instances are same.If both variable has the same field names, they are equal.
     *
     * @return {Boolean} Whether two variable instances are same.
     */
    equals (varInst) {
        return this.oneVar() === varInst.oneVar();
    }
}
