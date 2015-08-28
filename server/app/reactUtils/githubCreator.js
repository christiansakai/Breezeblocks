var shortid = require('shortid');
var _ = require('lodash');

module.exports = function(currentUser, github, repoName){
	var user = github.getUser();

	var repoObj = {
	  "name": repoName,
	  "description": "React Native mobile app generated by BreezeBlocks.io",
	  "homepage": currentUser.github.profileUrl,
	};
	
	return new Promise(function(resolve, reject){
		user.createRepo(repoObj, function(err, res) {
			if(err) {
				// var errorMessage = err.request.responseText.errors.filter(function(error){
				// 	return error.message === "name already exists on this account";
				// })
				// if(errorMessage.length > 0){
				// 	//send message to front end, to inform user to rename app. (TODO)
				// 	console.log("Name already exists on this account");
				// }
				reject(err);
			}
			else {
				resolve(res);
			}
		});
	});
};

