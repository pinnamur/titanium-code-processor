/**
 * <p>Copyright (c) 2009-2013 by Appcelerator, Inc. All Rights Reserved.
 * Please see the LICENSE file for information about licensing.</p>
 *
 * The break statement causes execution to exit the current block, if the block can contain a break statement.
 *
 * @module rules/AST_Break
 * @see ECMA-262 Spec Chapter 12.8
 */

/**
 * @event module:rules/AST_Break.rule
 * @property {string} ruleName The string 'AST_Break'
 * @property {module:AST.node} ast The AST node that is an instance of this rule
 * @property {string} file The file that the rule begins on.
 * @property {number} line The line of the file where the rule begins on.
 * @property {number} column The column of the file where the rule begins on.
 * @property {boolean} processingComplete Indicates whether the rule has been processed yet or not. This can be used to
 *		determine if this is the pre-evalutation event or the post-evaluation event.
 * @property {Array} result The result of evaluating the break. The result is a return tuple consisting of
 *		['break', label if supplied or undefined, undefined]. Only available post-evaluation.
 */

var AST = require('../AST'),
	RuleProcessor = require('../RuleProcessor');

AST.registerRuleProcessor('AST_Break', function processRule() {

	var result = ['break', undefined, undefined];

	RuleProcessor.preProcess(this);

	RuleProcessor.fireRuleEvent(this, {}, false);
	RuleProcessor.logRule('AST_Break', this.label && this.label.name);

	if (this.label) {
		result[2] = this.label.name;
	}

	RuleProcessor.fireRuleEvent(this, {
		result: result
	}, true);

	RuleProcessor.postProcess(this, result);

	return result;
});