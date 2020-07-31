const search = {
    state: {
        searchText:'',  // 全局搜索文案
        axiosDataUrl:{}  // 当前请求的数据
    },
    mutations: {
        SET_SEARCH: (state, search) => {
            state.searchText = search
        },
        SET_AXISOURLCUR: (state, axiosDataUrl) => {
            state.axiosDataUrl = axiosDataUrl
        },
    },
    actions: {

    }
}

export default search
