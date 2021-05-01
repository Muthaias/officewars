class ClientApi {
    constructor(rawApi) {
        this._rawApi = rawApi
    }

    async loadGame(id) {
        const data = await (await fetch(`cgi-bin/server/state/${id}`)).text()
        console.log(data)
        const api = this._rawApi
        const game = api.loadGame(data, data.length)
        console.log(api.getGameName(game))
        return this._wrapGame(game)
    }

    async loadGameList() {
        const data = await (await fetch("cgi-bin/server/games")).text()
        const api = this._rawApi
        const gameList = api.loadGameList(data, data.length)
        const listFuncs = {
            gameCount: api.getGameCount,
            game: this._wrapGame,
        }
        return Object.keys(listFuncs).reduce((acc, key) => {
            acc[key] = listFuncs[key].bind(acc, gameList)
            return acc
        }, {})
    }

    _wrapGame(game) {
        const api = this._rawApi
        const gameFuncs = {
            name: api.getGameName,
            playerCount: api.getPlayerCount,
            playerName: api.getPlayerName,
            playerColor: api.getPlayerColor,
            nodeCount: api.getNodeCount,
            isNodeConnected: api.getNodeConnected,
            nodeControlledBy: api.getNodeControlledBy,
            turnCount: api.getTurnCount,
            stepHistory: api.stepGameHistory,
        }
        return Object.keys(gameFuncs).reduce((acc, key) => {
            acc[key] = gameFuncs[key].bind(acc, game)
            return acc
        }, {})
    }

    static async fromModule(module) {
        const apiInit = new Promise((resolve, reject) => {
            module.onRuntimeInitialized = () => {
                const loadGameList = Module.cwrap('loadGameList', 'number', ['string', 'number'])
                const loadGame = Module.cwrap('loadGame', 'number', ['string', 'number'])
                const getGameCount = Module.cwrap('getGameCount', 'number', ['number'])
                const getGame = Module.cwrap('getGame', 'number', ['number', 'number'])
                const getGameName = Module.cwrap('getGameName', 'string', ['number', 'number'])
                const getPlayerCount = Module.cwrap('getPlayerCount', 'number', ['number'])
                const getPlayerName = Module.cwrap('getPlayerName', 'string', ['number', 'number'])
                const getPlayerColor = Module.cwrap('getPlayerColor', 'string', ['number', 'number'])
                const getNodeCount = Module.cwrap('getNodeCount', 'number', ['number'])
                const getNodeConnected = Module.cwrap('getNodeConnected', 'number', ['number', 'number', 'number'])
                const getNodeControlledBy = Module.cwrap('getNodeControlledBy', 'number', ['number', 'number'])
                const getTurnCount = Module.cwrap('getTurnCount', 'number', ['number'])
                const stepGameHistory = Module.cwrap('stepGameHistory', 'number', ['number', 'number'])

                resolve({
                    loadGameList,
                    loadGame,
                    getGameCount,
                    getGame,
                    getGameName,
                    getPlayerCount,
                    getPlayerName,
                    getPlayerColor,
                    getNodeCount,
                    getNodeConnected,
                    getNodeControlledBy,
                    getTurnCount,
                    stepGameHistory
                })
            }
        });
        const rawApi = await apiInit;
        return new ClientApi(rawApi)
    }
}