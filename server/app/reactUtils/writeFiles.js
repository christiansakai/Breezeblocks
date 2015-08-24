var fileContent = require('./recursiveRead');
var path = require('path');

module.exports = function(userId, buildId, repo, projectName){
	console.log("Begin Writing");
	fileContent(userId, buildId, projectName)
	.then(function(fileObject){
		var keys = Object.keys(fileObject);
		console.log(keys.length);
		(function repoWrite(fileNames, fileObject, index){
			console.log("fileNames", index, fileNames[index])
			repo.write('master', fileNames[index], fileObject[fileNames[index]], 'Exported BreezeBlocks Project', function(err) {
				console.log("writing to file", index);
				if(err) console.error(err);
				index++;
				if(index < fileNames.length) {
					repoWrite(fileNames, fileObject, index);
				}
			});
		})(keys, fileObject, 0);
	})
	.catch(function(err){ 
		console.log("promise error", err); 
	});
}

/*		var i = 0;
		var writingFiles = setInterval(function(){
			var fileName = keys[i]
			repo.write('master', fileName, fileObject[fileName], 'Exported BreezeBlocks Project', function(err) {
				console.log("writing to file", i+1);
				if(err) console.error(err);
			});
			i++;
			if(i >= keys.length) clearInterval(writingFiles);
		}, 1000);*/
/*function repoWrite(fileNames, fileObject, index){
	repo.write('master', fileNames[index], fileObject[fileNames[index]], 'Exported BreezeBlocks Project', function(err) {
		console.log("writing to file", index);
		if(err) console.error(err);
		else if(index < fileNames.length) {
			repoWrite(fileNames, fileObject, index++);
		}
	});
}*/