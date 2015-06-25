/*******************************************************************************
 * Copyright (c) 2015 itemis AG (http://www.itemis.eu) and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *******************************************************************************/

define([
	'orion/plugin',
	'orion/Deferred',
	'jquery'
], function(PluginProvider, Deferred, jQuery) {
	var headers = {
		name: 'Xtext Validation Plugin',
		version: '2.9.0',
		description: 'Validation through the Xtext server.'
	};
	var provider = new PluginProvider(headers);
	
	var serverUrl = 'http://' + location.host + '/xtext-service/validation';
	var validationService = {
		computeProblems: function(editorContext, params) {
			var deferred = new Deferred();
			editorContext.getText().then(function(fullText) {
				var serverData = {
					contentType: 'xtext/statemachine',
					fullText: fullText
				};
				jQuery.ajax(serverUrl, {
					async: true,
					type: 'POST',
					data: serverData,
					dataType: 'json',
					success: function(result) {
						if (!result.conflict) {
							var problems = result.entries.map(function(entry) {
								return {
									description: entry.description,
									start: entry.startOffset,
									end: entry.endOffset,
									severity: entry.severity
								};
							});
							deferred.resolve({ problems: problems });
						}
					},
					error: function(xhr, textStatus, errorThrown) {
						deferred.reject(errorThrown);
					}
				});
			});
			return deferred.promise;
		}
	};
	
	provider.registerServiceProvider('orion.edit.validator', validationService, {
		contentType: [ 'xtext/statemachine' ]
	});
	provider.connect();
});
