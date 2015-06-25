/*******************************************************************************
 * Copyright (c) 2015 itemis AG (http://www.itemis.eu) and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *******************************************************************************/
package org.xtext.web.orion

import com.google.inject.Guice
import com.google.inject.Injector
import com.google.inject.Module
import com.google.inject.util.Modules
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import org.eclipse.emf.ecore.resource.Resource
import org.eclipse.xtext.resource.IResourceFactory
import org.eclipse.xtext.resource.IResourceServiceProvider
import org.xtext.example.statemachine.StatemachineRuntimeModule
import org.xtext.example.statemachine.StatemachineStandaloneSetup

class StatemachineWebSetup extends StatemachineStandaloneSetup {
	
	ExecutorService executorService
	
	override createInjector() {
		dispose()
		executorService = Executors.newCachedThreadPool
		val runtimeModule = new StatemachineRuntimeModule as Module
		val webModule = new StatemachineWebModule(executorService)
		return Guice.createInjector(Modules.override(runtimeModule).with(webModule))
	}
	
	override register(Injector injector) {
		super.register(injector)
		val resourceFactory = injector.getInstance(IResourceFactory)
		val serviceProvider = injector.getInstance(IResourceServiceProvider)
		Resource.Factory.Registry.INSTANCE.contentTypeToFactoryMap.put('xtext/statemachine', resourceFactory)
		IResourceServiceProvider.Registry.INSTANCE.contentTypeToFactoryMap.put('xtext/statemachine', serviceProvider)
	}
	
	def dispose() {
		if (executorService !== null)
			executorService.shutdown()
		executorService = null
	}
	
}