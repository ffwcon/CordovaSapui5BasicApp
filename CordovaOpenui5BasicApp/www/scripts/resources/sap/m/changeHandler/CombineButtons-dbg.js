/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(["sap/ui/fl/Utils"],
	function(FlexUtils) {
		"use strict";

		/**
		 * Change handler for combining sap.m.Button(s) in a sap.m.MenuButton inside sap.m.Bar
		 *
		 * @alias sap.m.changeHandler.CombineButtons
		 * @author SAP SE
		 * @version 1.48.6
		 * @experimental Since 1.48
		 */
		var CombineButtons = { };

		/**
		 * Combines sap.m.Button(s) in a sap.m.MenuButton
		 *
		 * @param {sap.ui.fl.Change} oChange Change wrapper object with instructions to be applied on the control map
		 * @param {sap.m.Bar} oControl Containing the buttons
		 * @param {object} mPropertyBag Map of properties
		 * @param {object} mPropertyBag.modifier Modifier for the controls
		 * @return {boolean} true if change could be applied
		 *
		 * @public
		 */
		CombineButtons.applyChange = function(oChange, oControl, mPropertyBag) {

			if (mPropertyBag.modifier.targets !== "jsControlTree") {
				throw new Error("Combine buttons change can't be applied on XML tree");
			}

			var oChangeDefinition = oChange.getDefinition(),
				oModifier = mPropertyBag.modifier,
				oView = FlexUtils.getViewForControl(oControl),
				oSourceControl = oModifier.bySelector(oChangeDefinition.content.combineButtonSelectors[0], mPropertyBag.appComponent),
				oAppComponent = mPropertyBag.appComponent,
				oParent = oModifier.getParent(oSourceControl),
				iAggregationIndex, sBarAggregation, aButtons,
				bIsRtl = sap.ui.getCore().getConfiguration().getRTL(),
				oMenu, oMenuButton, aMenuButtonName = [];

			aButtons = oChangeDefinition.content.combineButtonSelectors.map(function (oCombineButtonSelector) {
				return oModifier.bySelector(oCombineButtonSelector, oAppComponent);
			});

			sBarAggregation = aButtons[0].sParentAggregationName;
			iAggregationIndex = oParent.indexOfAggregation(sBarAggregation, oSourceControl);

			oMenu = oModifier.createControl("sap.m.Menu", mPropertyBag.appComponent, oView);

			aButtons.forEach(function (oButton, index) {
				var sId = oView.createId(jQuery.sap.uid()),
					sButtonText = oModifier.getProperty(oButton, "text");

				var oMenuItem = oModifier.createControl("sap.m.MenuItem", mPropertyBag.appComponent, oView, sId);
				oModifier.setProperty(oMenuItem, "text", oButton.mProperties.text);
				oModifier.setProperty(oMenuItem, "icon", oButton.mProperties.icon);
				oMenuItem.attachPress(function(oEvent) {
					return oButton.firePress(oEvent);
				});

				if (sButtonText) {
					bIsRtl ? aMenuButtonName.unshift(sButtonText) : aMenuButtonName.push(sButtonText);
				}

				var oIdToSave = oModifier.createControl("sap.ui.core.CustomData", mPropertyBag.appComponent, oView, sId + "-originalButtonId");
				oModifier.setProperty(oIdToSave, "key", "originalButtonId");
				oModifier.setProperty(oIdToSave, "value", oModifier.getId(oButton));

				oModifier.removeAggregation(oControl, sBarAggregation, oButton);
				// adding each button control to the menuItem's dependents aggregation
				// this way we can save all relevant information it my have
				oModifier.insertAggregation(oMenuItem, "dependents", oButton);
				oModifier.insertAggregation(oMenuItem, "customData", oIdToSave);
				oModifier.insertAggregation(oMenu, "items", oMenuItem, index);
			});

			oMenuButton = oModifier.createControl("sap.m.MenuButton", mPropertyBag.appComponent, oView, oView.createId(jQuery.sap.uid()));
			oModifier.setProperty(oMenuButton, "text", aMenuButtonName.join("/"));
			oModifier.insertAggregation(oMenuButton, "menu", oMenu, 0);

			oModifier.insertAggregation(oControl, sBarAggregation, oMenuButton, iAggregationIndex);

		};

		/**
		 * Completes the change by adding change handler specific content
		 *
		 * @param {sap.ui.fl.Change} oChange Change wrapper object to be completed
		 * @param {object} oSpecificChangeInfo Specific info object
		 * @param {object} oSpecificChangeInfo.combineFieldIds Ids of selected buttons
		 *                                                     to be combined
		 * @param {object} mPropertyBag Map of properties
		 * @param {object} mPropertyBag.modifier Modifier for the controls
		 *
		 * @public
		 */
		CombineButtons.completeChangeContent = function(oChange, oSpecificChangeInfo, mPropertyBag) {

			var oModifier = mPropertyBag.modifier,
				oAppComponent = mPropertyBag.appComponent,
				oChangeDefinition = oChange.getDefinition(),
				aCombineButtonIds = oSpecificChangeInfo.combineFieldIds;

			if (aCombineButtonIds && aCombineButtonIds.length >= 2) {
				oChange.addDependentControl(aCombineButtonIds, "combinedButtons", mPropertyBag);
				oChangeDefinition.content.combineButtonSelectors = aCombineButtonIds.map(function(sCombineButtonId) {
					return oModifier.getSelector(sCombineButtonId, oAppComponent);
				});
			} else {
				throw new Error("Combine buttons action cannot be completed: oSpecificChangeInfo.combineFieldIds attribute required");
			}
		};

		return CombineButtons;
	},
	/* bExport= */true);