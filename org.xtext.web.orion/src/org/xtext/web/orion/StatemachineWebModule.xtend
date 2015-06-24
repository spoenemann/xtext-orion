/*******************************************************************************
 * Copyright (c) 2015 itemis AG (http://www.itemis.eu) and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *******************************************************************************/
package org.xtext.web.orion

import com.google.inject.Binder
import com.google.inject.name.Names
import java.util.concurrent.ExecutorService
import org.eclipse.xtend.lib.annotations.Accessors
import org.eclipse.xtend.lib.annotations.FinalFieldsConstructor
import org.eclipse.xtext.ide.LexerIdeBindings
import org.eclipse.xtext.ide.editor.contentassist.antlr.IContentAssistParser
import org.eclipse.xtext.ide.editor.contentassist.antlr.internal.Lexer
import org.eclipse.xtext.web.server.DefaultWebModule
import org.xtext.example.statemachine.ide.contentassist.antlr.StatemachineParser
import org.xtext.example.statemachine.ide.contentassist.antlr.internal.InternalStatemachineLexer

@Accessors
@FinalFieldsConstructor
class StatemachineWebModule extends DefaultWebModule {

	val ExecutorService executorService

	def configureExecutorService(Binder binder) {
		binder.bind(ExecutorService).toInstance(executorService)
	}

	def configureContentAssistLexer(Binder binder) {
		binder.bind(Lexer).annotatedWith(Names.named(LexerIdeBindings.CONTENT_ASSIST)).to(InternalStatemachineLexer)
	}

	def Class<? extends IContentAssistParser> bindIContentAssistParser() {
		StatemachineParser
	}

}
