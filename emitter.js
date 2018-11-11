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
        return childEvent.startsWith(event) && childEvent[event.length] === '.';
    }

    function shouldCall(record) {
        record.times--;
        record.callCount++;

        return (!record.frequency || record.callCount % record.frequency === 1) &&
            (!record.times || record.times > 0);
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
            events = events.filter(record => !(record.context === context &&
                (event === record.event || isChildEvent(event, record.event))));

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} this
         */
        emit: function (event) {
            let records = events.filter(record => (event === record.event ||
                isChildEvent(record.event, event)) && shouldCall(record));

            records.sort((a, b) => b.event.split('.').length - a.event.split('.').length);

            records.forEach(record => record.handler.call(record.context));

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
            if (times <= 0) {
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
            if (frequency <= 0) {
                this.on(event, context, handler);
            } else {
                events.push({ event, context, handler, frequency, callCount: 0 });
            }

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
