/**
 * <p>Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
 * Please see the LICENSE file for information about licensing.</p>
 *
 * @module plugins/TiIncludeFinder
 * @author Bryan Hughes &lt;<a href='mailto:bhughes@appcelerator.com'>bhughes@appcelerator.com</a>&gt;
 */


var path = require('path'),
	Runtime = require(path.join(global.titaniumCodeProcessorLibDir, 'Runtime')),
	results = {
		resolved: [],
		unresolved: [],
		missing: []
	};

// ******** Plugin API Methods ********

/**
 * Creates an instance of the require provider plugin
 *
 * @classdesc Provides a CommonJS compliant require() implementation, based on Titanium Mobile's implementations
 *
 * @constructor
 * @name module:plugins/TiIncludeFinder
 */
module.exports = function () {
	Runtime.on('tiIncludeResolved', function(e) {
		results.resolved.push(e);
	});
	Runtime.on('tiIncludeUnresolved', function(e) {
		results.unresolved.push(e);
	});
	Runtime.on('tiIncludeMissing', function(e) {
		results.missing.push(e);
	});
};

/**
 * Initializes the plugin
 *
 * @method
 * @name module:plugins/TiIncludeFinder#init
 */
module.exports.prototype.init = function init() {};

/**
* Gets the results of the plugin
*
* @method
 * @name module:plugins/TiIncludeFinder#getResults
* @returns {Object} A dictionary with two array properties: <code>resolved</code> and <code>unresolved</code>. The
*		<code>resolved</code> array contains a list of resolved absolute paths to files that were required. The
*		<code>unresolved</code> array contains a list of unresolved paths, as passed in to the <code>require()</code>
*		method.
*/
module.exports.prototype.getResults = function getResults() {
	return results;
};

/**
 * Generates the results HTML page
 *
 * @method
 * @param {String} baseDirectory The base directory of the code, useful for shortening paths
 * @return {Object} The information for generating the template. Two keys are expected: template is the path to the
 *		mustache template (note the name of the file must be unique, irrespective of path) and data is the information
 *		to dump into the template
 */
module.exports.prototype.getResultsPageData = function getResultsPageData(baseDirectory) {

	var numIncludesResolved = results.resolved.length,
		numIncludesUnresolved = results.unresolved.length,
		numIncludesMissing = results.missing.length,
		resolved,
		unresolved,
		missing;

	if (numIncludesResolved) {
		resolved = {
			list: []
		};
		results.resolved.forEach(function (file) {
			resolved.list.push({
				name: file.data.name,
				path: file.data.path.replace(baseDirectory, ''),
				filename: file.filename.replace(baseDirectory, ''),
				line: file.line
			});
		});
	}

	if (numIncludesUnresolved) {
		unresolved = {
			list: []
		};
		results.unresolved.forEach(function (file) {
			unresolved.list.push({
				filename: file.filename.replace(baseDirectory, ''),
				line: file.line
			});
		});
	}

	if (numIncludesMissing) {
		missing = {
			list: []
		};
		results.missing.forEach(function (file) {
			missing.list.push({
				name: file.data.name,
				filename: file.filename.replace(baseDirectory, ''),
				line: file.line
			});
		});
	}

	return {
		template: path.join(__dirname, '..', 'templates', 'tiApiIncludeFinderTemplate.html'),
		data: {
			numIncludesResolved: numIncludesResolved === 1 ? '1 file' : numIncludesResolved + ' files',
			numIncludesUnresolved: numIncludesUnresolved === 1 ? '1 file' : numIncludesUnresolved + ' files',
			numIncludesMissing: numIncludesMissing === 1 ? '1 file' : numIncludesMissing + ' files',
			resolved: resolved,
			unresolved: unresolved,
			missing: missing
		}
	};
};
module.exports.prototype.displayName = 'Ti.includes';