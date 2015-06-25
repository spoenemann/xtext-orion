/*******************************************************************************
 * Copyright (c) 2015 itemis AG (http://www.itemis.eu) and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *******************************************************************************/
package org.xtext.web.orion

import org.eclipse.xtext.web.servlet.XtextServlet

class StatemachineXtextServlet extends XtextServlet {

	StatemachineWebSetup setup
	
	override init() {
		super.init()
		setup = new StatemachineWebSetup()
		setup.createInjectorAndDoEMFRegistration()
	}

	override destroy() {
		setup.dispose()
		super.destroy()
	}

}
