'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let events = [];

    function isChildEvent(event, childEvent) {
        return childEvent.indexOf(event) === 0 && childEvent[event.length] === '.';
    }

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} this
         */
        on: function (event, context, handler) {
            events.push({ event, context, handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object} this
         */
        off: function (event, context) {
            events = events.filter(record => {
                return !(record.context === context &&
                    (event === record.event || isChildEvent(event, record.event)));
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} this
         */
        emit: function (event) {
            let records = events.filter(record => {
                return (event === record.event || isChildEvent(record.event, event));
            });

            records.forEach(record => {
                record.times--;
                record.callCount++;
            });

            records = records.filter(record => {
                return (!record.frequency || record.callCount % record.frequency === 1) &&
                (!record.times || record.times > 0);
            });

            records.sort((a, b) => {
                return a.event.split('.').length < b.event.split('.').length;
            });

            records.forEach(record => {
                record.handler.call(record.context);
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object} this
         */
        several: function (event, context, handler, times) {
            if (times <= 1) {
                this.on(event, context, handler);
            } else {
                events.push({ event, context, handler, times });
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object} this
         */
        through: function (event, context, handler, frequency) {
            let callCount = 0;
            if (frequency <= 1) {
                this.on(event, context, handler);
            } else {
                events.push({ event, context, handler, frequency, callCount });
            }

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
