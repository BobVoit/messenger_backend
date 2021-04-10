class Mediator {
    constructor({ EVENTS, TRIGGERS }) {
        this.events = {};
        this.triggers = {};
        this.EVENTS = EVENTS;
        this.TRIGGERS = TRIGGERS;
        Object.keys(this.EVENTS).forEach(key => this.events[this.EVENTS[key]] = []);
        Object.keys(this.TRIGGERS).forEach(key => this.triggers[this.TRIGGERS[key]] = () => { return null });
    }

    // получить объект событий
    getEventTypes() {
        return this.EVENTS;
    }

    // подписаться на событие name
    // добавить в массив свойства name функцию func
    subscribe(name, func) {
        if (this.events[name] && func instanceof Function) {
            this.events[name].push(func);
        }
    }

    // вызвать все функции в массиве свойства name
    // в качестве аргумента использовать data
    call(name, data) {
        if (this.events[name]) {
            this.events[name].forEach(event => {
                if (event instanceof Function) {
                    event(data);
                }
            });
        }
    }

    // получить все события триггеров
    getTriggerTypes() {
        return this.TRIGGERS;
    }

    // установить свойству name функцию func
    set(name, func) {
        if (name && func instanceof Function) {
            this.triggers[name] = func;
        }
    }

    // получить значение вызова функции свойства name
    // в качестве аргумента использовать data
    get(name, data) {
        return (this.triggers[name] && this.triggers[name] instanceof Function) ?
            this.triggers[name](data) : null;
    }
}

module.exports = Mediator;