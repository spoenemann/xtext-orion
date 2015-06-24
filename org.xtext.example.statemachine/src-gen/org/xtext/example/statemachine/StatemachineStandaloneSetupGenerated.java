/*******************************************************************************
 * Copyright (c) 2015 itemis AG (http://www.itemis.eu) and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *******************************************************************************/
package org.xtext.example.statemachine;

import org.eclipse.emf.ecore.EPackage;
import org.eclipse.emf.ecore.resource.Resource;
import org.eclipse.xtext.ISetup;
import org.eclipse.xtext.ISetupExtension;

import com.google.inject.Guice;
import com.google.inject.Injector;

import java.util.List;
import java.util.Arrays;

/**
 * Generated from StandaloneSetup.xpt!
 */
@SuppressWarnings("all")
public class StatemachineStandaloneSetupGenerated implements ISetup, ISetupExtension {

	@Override
	public List<String> getFileExtensions() {
		return Arrays.asList("statemachine");
	}

	@Override
	public Injector createInjectorAndDoEMFRegistration() {
		org.eclipse.xtext.common.TerminalsStandaloneSetup.doSetup();

		Injector injector = createInjector();
		register(injector);
		return injector;
	}
	
	public Injector createInjector() {
		return Guice.createInjector(new org.xtext.example.statemachine.StatemachineRuntimeModule());
	}
	
	public void register(Injector injector) {
	if (!EPackage.Registry.INSTANCE.containsKey("http://www.xtext.org/example/statemachine/Statemachine")) {
		EPackage.Registry.INSTANCE.put("http://www.xtext.org/example/statemachine/Statemachine", org.xtext.example.statemachine.statemachine.StatemachinePackage.eINSTANCE);
	}

		org.eclipse.xtext.resource.IResourceFactory resourceFactory = injector.getInstance(org.eclipse.xtext.resource.IResourceFactory.class);
		org.eclipse.xtext.resource.IResourceServiceProvider serviceProvider = injector.getInstance(org.eclipse.xtext.resource.IResourceServiceProvider.class);
		Resource.Factory.Registry.INSTANCE.getExtensionToFactoryMap().put("statemachine", resourceFactory);
		org.eclipse.xtext.resource.IResourceServiceProvider.Registry.INSTANCE.getExtensionToFactoryMap().put("statemachine", serviceProvider);
		

	}
}
