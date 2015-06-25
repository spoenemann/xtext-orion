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
	'orion/keyBinding',
	'xtext/xtext-orion'
], function(PluginProvider, Deferred, mKeyBinding, xtext) {
	var EDITOR_ID = 'org.eclipse.xtext';
	var context, editor, editorModelChanges = [], contextModelChanges = [];
	
	var hashParams = window.top.location.hash.split(',');
	if (hashParams.length > 0) {
		var resourceId = hashParams[0].substring(1);
		if (resourceId.length > 0) {
			editor = xtext.createEditor({
				theme: 'orion/editor/themes/default',
				syntaxDefinition: 'xtext/generated/statemachine-syntax',
				resourceId: resourceId,
				loadFromServer: false
			});
			var textView = editor.getTextView();
			textView.addEventListener("ModelChanged", function(event) {
				if (context && contextModelChanges.length == 0) {
					editorModelChanges.push({});
					context.setText(editor.getText()).then(function() {
						editorModelChanges.shift();
					});
				}
			});
		}
	}
	
	function refreshEditor() {
		if (editor && editorModelChanges.length == 0) {
			context.getText().then(function(text) {
				contextModelChanges.push({});
				editor.setText(text);
				contextModelChanges.shift();
			});
		}
	}
	
	var headers = {
		name: 'Xtext Editor Plugin',
		version: '2.9.0',
		description: 'This plugin provides an editor for Xtext languages.'
	};

	var provider = new PluginProvider(headers);
	
	provider.registerService('orion.edit.editor', {
		setTextModel: function(pluggableEditorContext) {
			context = pluggableEditorContext;
			refreshEditor();
			return new Deferred();
		},
		onChanged: function(event) {
			refreshEditor();
		},
		registerKeys: function(keys) {
			if (false && editor) {
				var textView = editor.getTextView();
				for (i in keys) {
					var keyDef = keys[i];
					var keyStroke = new mKeyBinding.KeyStroke(keyDef.keyCode, keyDef.mod1, keyDef.mod2, keyDef.mod3, keyDef.mod4);
					var actionId = '_orion-action-' + i;
					textView.setKeyBinding(keyStroke, actionId);
					textView.setAction(actionId, function() {
						context.processKey({
							type: keyStroke.type,
							keyCode: keyStroke.keyCode,
							ctrlKey: keyStroke.mod1,
							shiftKey: keyStroke.mod2,
							altKey: keyStroke.mod3,
							metaKey: keyStroke.mod4
						});
						return true;
					});
				}
			}
		}
	}, {
		id: EDITOR_ID,
		name: 'Xtext Editor',
		uriTemplate: 'edit.html#{,Location,params*},editor=' + EDITOR_ID
	});
	
	provider.registerService('orion.navigate.openWith', {}, {
		editor: EDITOR_ID,
		contentType: ['xtext/statemachine']
	});
	
	provider.connect();
});
