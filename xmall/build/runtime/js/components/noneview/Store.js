define([], function(){

	var Store = function(){

	}

	Store.saveObjectByStore = function(key, object) {
		window.localStorage[key] = JSON.stringify(object);
	}

	Store.loadStoreObject = function(key) {
		var objectString =  window.localStorage[key];
		return objectString == null ? null : JSON.parse(objectString);
	}

	Store.deleteStoreObject = function(key) {
		window.localStorage[key] = null;
	}

	Store.clearStore = function() {
		window.localStorage.clear();
	}

  Store.saveObjectBySession = function(key, object) {
		window.sessionStorage[key] = JSON.stringify(object);
	}

	Store.loadSessionObject = function(key) {
		var objectString =  window.sessionStorage[key];
		return objectString == null ? null : JSON.parse(objectString);
	}

	Store.deleteSessionObject = function(key) {
		window.sessionStorage[key] = null;
	}

	return Store;
});
