const getters = {
	isLogin: state => state.user.isLogin,
	name: state => state.user.name,
	roles: state => state.user.roles,
	userInfo: state => state.user.info,
	searchText: state => state.search.searchText
}

export default getters
