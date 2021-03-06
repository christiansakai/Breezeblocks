var Handlebars = require('handlebars');
var ChangeCase = require('change-case');
var path = require('path');
var fs = require('fs-extra');

Handlebars.registerHelper('pascalCase', function(string) {
	return ChangeCase.pascalCase(string);
});

module.exports = function(data, styleData, titles, newProjectDir){
	var templatePath = path.join(__dirname, 'tabBarIOSTemplate.hbs');

	if(data){
		//-=-=-=-=-=-=-=-=-=-=-=-=-=-=data cleanse-=-=-=-=-=-=-=-=-=-=-=-=-=-
		data = data.children[0];
		var tabBarClasses = data.className.slice(1);
		var tabBarItems = data.props[0].TabBarIOSItems;

		tabBarItems.forEach(function(item, index){
			if(!item.projectReference) tabBarItems[index].projectReference = titles[0].replace('.js', "");
		});

		var tabBarProps = Object.keys(data.props[0]).filter(function(key){
			return key !== "TabBarIOSItems";
		});
		tabBarProps = tabBarProps.reduce(function(previousValue, key){
			previousValue[key] = data.props[0][key];
			return previousValue;
		}, {});

		var titleLinks = titles.reduce(function(previousValue, title){
			if(title !== 'index.ios.js'){			
				var titleRemovedJS = title.replace(/\.js/, "");
				previousValue[titleRemovedJS] = "./" + title;
			}
			return previousValue;
		}, {});

		var defaultButton = tabBarItems[0].systemIcon;

		var stylesNeeded = tabBarItems.reduce(function(previousValue, item){
			if(item.className){
				item.className.forEach(function(className, index) {
					if(index !== 1) previousValue.push(className);
				});
			}

			return previousValue;
		}, tabBarClasses);

		var styles = {};
		for(var key in styleData){
			if(stylesNeeded.indexOf(key) !== -1) styles[key] = styleData[key];
		}

		//-=-=-=-=-=-=-=-=-=-=-=-=-=-=end data cleanse-=-=-=-=-=-=-=-=-=-=-=-=-=-

		return new Promise(function(resolve, reject) {
			fs.readFile(templatePath, function(err, data) {
				if (err) reject(err);
				else {
					resolve(data.toString());
				}
			});
		})
		.then(function(templateFile){

			var createTemplate = Handlebars.compile(templateFile);

			var tabBarTemplate = createTemplate({
				filesReq: titleLinks,
				tabBarClasses: tabBarClasses,
				tabBarItems: tabBarItems,
				tabBarProps: tabBarProps,
				styles: styles,
				defaultButton: defaultButton
			});

			return new Promise(function(resolve, reject) {
				fs.writeFile(newProjectDir + "/tabBar.js", tabBarTemplate, function(err) {
					if (err) reject(err);
					else resolve(tabBarTemplate);
				});
			});

		})
		.then(function(tabBarTemplate){
			return new Promise(function(resolve, reject) {
				fs.copy(__dirname+'/multipageIndex.ios.js', newProjectDir+"/index.ios.js", function(err) {
					if (err) reject(err);
					else resolve('index created');
				});
			});
		})
		.then(function(index){
			return "tabBar and index generated"
		});
	}else{
		return new Promise(function(resolve, reject){
			resolve("No tabBar recognized");
		});
	}




};