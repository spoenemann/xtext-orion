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
		name: 'Xtext Content Assist Plugin',
		version: '2.9.0',
		description: 'Content Assist through the Xtext server.'
	};
	var provider = new PluginProvider(headers);
	
	var serverUrl = 'http://' + location.host + '/xtext-service/content-assist';
	var contentAssistService = {
		computeContentAssist: function(editorContext, params) {
			var deferred = new Deferred();
			editorContext.getText().then(function(fullText) {
				var serverData = {
					contentType: 'xtext/statemachine',
					fullText: fullText,
					caretOffset : params.offset
				};
				if (params.selection.start != params.offset || params.selection.end != params.offset) {
					serverData.selectionStart = params.selection.start;
					serverData.selectionEnd = params.selection.end;
				}
				jQuery.ajax(serverUrl, {
					async: true,
					type: 'POST',
					data: serverData,
					dataType: 'json',
					success: function(result) {
						if (!result.conflict) {
							var proposals = result.entries.map(function(entry) {
								var p = {
									proposal : entry.proposal,
									prefix : entry.prefix,
									overwrite : true,
									name : (entry.label ? entry.label : entry.proposal),
									description : entry.description,
									additionalEdits : entry.textReplacements,
									positions : entry.editPositions,
								};
								if (entry.escapePosition)
									p.escapePosition = entry.escapePosition;
								return p;
							});
							deferred.resolve(proposals);
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
	
	provider.registerServiceProvider('orion.edit.contentAssist', contentAssistService, {
		name: 'State Machine content assist',
		contentType: [ 'xtext/statemachine' ]
	});
	provider.connect();
});
