class Answer {
    constructor() {
        this.ERROR = {
            404: 'page not found',
            900: 'undefined error'
        };
    }

    good(data) {
        return {
            result: 'ok',
            data
        }
    }

    bad(code) {
        code = code || 900;
        return {
            result: 'error',
            error: {
                code,
                text: this.ERROR[code]
            }
        }
    }
}

module.exports = Answer;