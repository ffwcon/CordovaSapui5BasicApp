/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Dialog','./ComboBoxTextField','./Toolbar','./Button','./Bar','./Text','./Title','./SelectList','./Popover','sap/ui/core/InvisibleText','sap/ui/core/IconPool','sap/ui/core/ValueStateSupport','./library','sap/ui/Device'],function(q,D,C,T,B,a,b,c,S,P,I,d,V,l,e){"use strict";var f=C.extend("sap.m.ComboBoxBase",{metadata:{library:"sap.m","abstract":true,defaultAggregation:"items",aggregations:{items:{type:"sap.ui.core.Item",multiple:true,singularName:"item",bindable:"bindable"},picker:{type:"sap.ui.core.PopupInterface",multiple:false,visibility:"hidden"}},events:{loadItems:{}}}});var p;f.prototype.updateItems=function(r){this.bItemsUpdated=false;this.destroyItems();this.updateAggregation("items");this.bItemsUpdated=true;if(this.hasLoadItemsEventListeners()){this.onItemsLoaded();}};f.prototype.refreshItems=function(){this.bItemsUpdated=false;this.refreshAggregation("items");};f.prototype.loadItems=function(g,o){var h=typeof g==="function";if(this.hasLoadItemsEventListeners()&&(this.getItems().length===0)){this._bOnItemsLoadedScheduled=false;if(h){o=q.extend({action:g,busyIndicator:true,busyIndicatorDelay:300},o);this.aMessageQueue.push(o);if((this.iLoadItemsEventInitialProcessingTimeoutID===-1)&&(o.busyIndicator)){this.iLoadItemsEventInitialProcessingTimeoutID=setTimeout(function onItemsNotLoadedAfterDelay(){this.setInternalBusyIndicatorDelay(0);this.setInternalBusyIndicator(true);}.bind(this),o.busyIndicatorDelay);}}if(!this.bProcessingLoadItemsEvent){this.bProcessingLoadItemsEvent=true;this.fireLoadItems();}}else if(h){g.call(this);}};f.prototype.onItemsLoaded=function(){this.bProcessingLoadItemsEvent=false;clearTimeout(this.iLoadItemsEventInitialProcessingTimeoutID);if(this.bInitialBusyIndicatorState!==this.getBusy()){this.setInternalBusyIndicator(this.bInitialBusyIndicatorState);}if(this.iInitialBusyIndicatorDelay!==this.getBusyIndicatorDelay()){this.setInternalBusyIndicatorDelay(this.iInitialBusyIndicatorDelay);}for(var i=0,m,n,g;i<this.aMessageQueue.length;i++){m=this.aMessageQueue.shift();i--;g=(i+1)===this.aMessageQueue.length;n=g?null:this.aMessageQueue[i+1];if(typeof m.action==="function"){if((m.name==="input")&&!g&&(n.name==="input")){continue;}m.action.call(this);}}};f.prototype.hasLoadItemsEventListeners=function(){return this.hasListeners("loadItems");};f.prototype._scheduleOnItemsLoadedOnce=function(){if(!this._bOnItemsLoadedScheduled&&!this.isBound("items")&&this.hasLoadItemsEventListeners()&&this.bProcessingLoadItemsEvent){this._bOnItemsLoadedScheduled=true;setTimeout(this.onItemsLoaded.bind(this),0);}};f.prototype.getPickerInvisibleTextId=function(){if(!sap.ui.getCore().getConfiguration().getAccessibility()){return"";}var r=sap.ui.getCore().getLibraryResourceBundle("sap.m");if(!p){p=new I({text:r.getText("COMBOBOX_AVAILABLE_OPTIONS")}).toStatic().getId();}return p;};f.prototype.init=function(){C.prototype.init.apply(this,arguments);this.setPickerType(e.system.phone?"Dialog":"Dropdown");if(e.system.phone){this.attachEvent("_change",this.onPropertyChange,this);}this.createPicker(this.getPickerType());this.bItemsUpdated=false;this.bOpenedByKeyboardOrButton=false;this._oPickerValueStateText=null;this.bProcessingLoadItemsEvent=false;this.iLoadItemsEventInitialProcessingTimeoutID=-1;this.aMessageQueue=[];this.bInitialBusyIndicatorState=this.getBusy();this.iInitialBusyIndicatorDelay=this.getBusyIndicatorDelay();this._bOnItemsLoadedScheduled=false;this._bDoTypeAhead=true;};f.prototype.onBeforeRendering=function(){var n=this.getValueState()===sap.ui.core.ValueState.None;C.prototype.onBeforeRendering.apply(this,arguments);if(!this.isPickerDialog()&&n){this._showValueStateText(false);}};f.prototype.exit=function(){C.prototype.exit.apply(this,arguments);if(this.getList()){this.getList().destroy();this._oList=null;}if(this._oPickerValueStateText){this._oPickerValueStateText.destroy();}clearTimeout(this.iLoadItemsEventInitialProcessingTimeoutID);this.aMessageQueue=null;};f.prototype.ontouchstart=function(E){if(!this.getEnabled()||!this.getEditable()){return;}E.setMarked();if(this.isOpenArea(E.target)){this.addStyleClass(this.getRenderer().CSS_CLASS_COMBOBOXBASE+"Pressed");}};f.prototype.ontouchend=function(E){if(!this.getEnabled()||!this.getEditable()){return;}E.setMarked();if(!this.isOpen()&&this.isOpenArea(E.target)){this.removeStyleClass(this.getRenderer().CSS_CLASS_COMBOBOXBASE+"Pressed");}};f.prototype.ontap=function(E){C.prototype.ontap.apply(this,arguments);var g=this.getRenderer().CSS_CLASS_COMBOBOXBASE,o=E.srcControl,h;if(!this.getEnabled()||!this.getEditable()){return;}E.setMarked();if(o.isOpenArea&&o.isOpenArea(E.target)){if(this.isOpen()){this.close();this.removeStyleClass(g+"Pressed");return;}this.loadItems();this.bOpenedByKeyboardOrButton=true;if(this.isPlatformTablet()){h=this.getPicker();h.setInitialFocus(h);}this.open();}if(this.isOpen()){this.addStyleClass(g+"Pressed");}};f.prototype.onsapshow=function(E){if(!this.getEnabled()||!this.getEditable()){return;}E.setMarked();if(E.keyCode===q.sap.KeyCodes.F4){this.onF4(E);}if(this.isOpen()){this.close();return;}this.selectText(0,this.getValue().length);this.loadItems();this.bOpenedByKeyboardOrButton=true;this.open();};f.prototype.onF4=function(E){E.preventDefault();};f.prototype.onsapescape=function(E){if(this.getEnabled()&&this.getEditable()&&this.isOpen()){E.setMarked();E.preventDefault();this.close();}else{C.prototype.onsapescape.apply(this,arguments);}};f.prototype.onsaphide=f.prototype.onsapshow;f.prototype.onsapfocusleave=function(E){if(!E.relatedControlId){C.prototype.onsapfocusleave.apply(this,arguments);return;}var r=sap.ui.getCore().byId(E.relatedControlId);if(r===this){return;}var o=this.getAggregation("picker"),F=r&&r.getFocusDomRef();if(o&&q.sap.containsOrEquals(o.getFocusDomRef(),F)){return;}C.prototype.onsapfocusleave.apply(this,arguments);};f.prototype.getPopupAnchorDomRef=function(){return this.getDomRef();};f.prototype.addContent=function(o){};f.prototype.getList=function(){if(this.bIsDestroyed){return null;}return this._oList;};f.prototype.setPickerType=function(s){this._sPickerType=s;};f.prototype.getPickerType=function(){return this._sPickerType;};f.prototype.setValueState=function(v){var A,s=this.getValueStateText(),g=(v===sap.ui.core.ValueState.None?false:this.getShowValueStateMessage());this._sOldValueState=this.getValueState();C.prototype.setValueState.apply(this,arguments);this._showValueStateText(g);if(s){this._setValueStateText(s);}else{A=V.getAdditionalText(this);this._setValueStateText(A);}this._alignValueStateStyles();return this;};f.prototype.setValueStateText=function(t){C.prototype.setValueStateText.apply(this,arguments);this._setValueStateText(this.getValueStateText());return this;};f.prototype.setShowValueStateMessage=function(s){C.prototype.setShowValueStateMessage.apply(this,arguments);this._showValueStateText(this.getShowValueStateMessage());return this;};f.prototype._showValueStateText=function(s){var o;if(this.isPickerDialog()){if(this._oPickerValueStateText){this._oPickerValueStateText.setVisible(s);}}else{o=this._getPickerCustomHeader();if(o){o.setVisible(s);}}};f.prototype._setValueStateText=function(t){var h;if(this.isPickerDialog()){this._oPickerValueStateText=this.getPickerValueStateText();this._oPickerValueStateText.setText(t);}else{h=this._getPickerCustomHeader();if(h){h.getContentLeft()[0].setText(t);}}};f.prototype._getPickerCustomHeader=function(){var i,o,g=this.getPicker(),s=this.getRenderer().CSS_CLASS_COMBOBOXBASE+"PickerTitle";if(!g){return null;}if(g.getCustomHeader()){return g.getCustomHeader();}i=new c({textAlign:"Left"}).addStyleClass(s);o=new a({visible:false,contentLeft:i});g.setCustomHeader(o);return o;};f.prototype._alignValueStateStyles=function(){var o=this._sOldValueState,g=this.getRenderer().CSS_CLASS_COMBOBOXBASE+"Picker",s=g+"ValueState",O=g+o+"State",h=g+this.getValueState()+"State",i;if(this.isPickerDialog()&&this._oPickerValueStateText){this._oPickerValueStateText.addStyleClass(s);this._oPickerValueStateText.removeStyleClass(O);this._oPickerValueStateText.addStyleClass(h);}else{i=this._getPickerCustomHeader();if(i){i.addStyleClass(s);i.removeStyleClass(O);i.addStyleClass(h);}}};f.prototype.shouldValueStateMessageBeOpened=function(){var s=C.prototype.shouldValueStateMessageBeOpened.apply(this,arguments);return(s&&!this.isOpen());};f.prototype.onPropertyChange=function(o,g){var n=o.getParameter("newValue"),s=o.getParameter("name"),m="set"+s.charAt(0).toUpperCase()+s.slice(1),h=(g&&g.srcControl)||this.getPickerTextField();if(/\bvalue\b|\benabled\b|\bname\b|\bplaceholder\b|\beditable\b|\btextAlign\b|\btextDirection\b|\bvalueState\b/.test(s)&&h&&(typeof h[m]==="function")){h[m](n);}};f.prototype.isPickerDialog=function(){return this.getPickerType()==="Dialog";};f.prototype.isPlatformTablet=function(){var n=!e.system.combi,t=e.system.tablet&&n;return t;};f.prototype.getDropdownSettings=function(){return{showArrow:false,placement:sap.m.PlacementType.VerticalPreferredBottom,offsetX:0,offsetY:0,bounce:false,ariaLabelledBy:this.getPickerInvisibleTextId()||undefined};};f.prototype.getPickerValueStateText=function(){var o=this.getPicker();if(!this._oPickerValueStateText){this._oPickerValueStateText=new b({width:"100%"});o.insertContent(this._oPickerValueStateText,0);}return this._oPickerValueStateText;};f.prototype.createPicker=function(s){};f.prototype.onBeforeClose=function(){this.bOpenedByKeyboardOrButton=false;};f.prototype.getPicker=function(){if(this.bIsDestroyed){return null;}return this.createPicker(this.getPickerType());};f.prototype.getPickerTextField=function(){var o=this.getPicker(),s=o.getSubHeader();return s&&s.getContent()[0]||null;};f.prototype.getPickerTitle=function(){var o=this.getPicker(),h=o&&o.getCustomHeader();if(this.isPickerDialog()&&h){return h.getContentMiddle()[0];}return null;};f.prototype.createDialog=function(){var t=this,o=this.createPickerTextField(),g=o._handleEvent;o._handleEvent=function(E){g.apply(this,arguments);if(/keydown|sapdown|sapup|saphome|sapend|sappagedown|sappageup|input/.test(E.type)){t._handleEvent(E);}};return new D({stretch:true,customHeader:t.createPickerHeader(),buttons:this.createPickerCloseButton(),subHeader:new T({content:o}),beforeOpen:function(){t.updatePickerHeaderTitle();},ariaLabelledBy:t.getPickerInvisibleTextId()||undefined});};f.prototype.createPickerHeader=function(){var t=this,i=d.getIconURI("decline");return new a({contentMiddle:new c(),contentRight:new B({icon:i,press:function(){t.close();t.revertSelection();}})});};f.prototype.revertSelection=function(){};f.prototype.updatePickerHeaderTitle=function(){var o=this.getPicker(),r=sap.ui.getCore().getLibraryResourceBundle("sap.m"),L,g;if(!o){return;}g=this.getLabels();if(g.length){L=g[0];if(L&&(typeof L.getText==="function")){this.getPickerTitle().setText(L.getText());}}else{this.getPickerTitle().setText(r.getText("COMBOBOX_PICKER_TITLE"));}};f.prototype.createPickerCloseButton=function(){var t=this,o,r=sap.ui.getCore().getLibraryResourceBundle("sap.m");return new B({text:r.getText("COMBOBOX_CLOSE_BUTTON"),press:function(){o=t.getPickerTextField();t.updateDomValue(o.getValue());t.onChange();t.close();}});};f.prototype.hasContent=function(){return this.getItems().length>0;};f.prototype.findFirstEnabledItem=function(i){var L=this.getList();return L?L.findFirstEnabledItem(i):null;};f.prototype.findLastEnabledItem=function(i){var L=this.getList();return L?L.findLastEnabledItem(i):null;};f.prototype.open=function(){var o=this.getPicker();if(o){o.open();}return this;};f.prototype.getVisibleItems=function(){var L=this.getList();return L?L.getVisibleItems():[];};f.prototype.isItemSelected=function(){};f.prototype.getKeys=function(g){g=g||this.getItems();for(var i=0,k=[];i<g.length;i++){k[i]=g[i].getKey();}return k;};f.prototype.getSelectableItems=function(){var L=this.getList();return L?L.getSelectableItems():[];};f.prototype.findItem=function(s,v){var L=this.getList();return L?L.findItem(s,v):null;};f.prototype.getItemByText=function(t){return this.findItem("text",t);};f.prototype.scrollToItem=function(i){var o=this.getPicker(),g=o.getDomRef("cont"),h=i&&i.getDomRef();if(!o||!g||!h){return;}var j=g.scrollTop,k=h.offsetTop,m=g.clientHeight,n=h.offsetHeight;if(j>k){g.scrollTop=k;}else if((k+n)>(j+m)){g.scrollTop=Math.ceil(k+n-m);}};f.prototype.clearFilter=function(){for(var i=0,g=this.getItems();i<g.length;i++){g[i].bVisible=true;}};f.prototype.onItemChange=function(o){};f.prototype.clearSelection=function(){};f.prototype.setInternalBusyIndicator=function(g){this.bInitialBusyIndicatorState=this.getBusy();return this.setBusy.apply(this,arguments);};f.prototype.setInternalBusyIndicatorDelay=function(i){this.iInitialBusyIndicatorDelay=this.getBusyIndicatorDelay();return this.setBusyIndicatorDelay.apply(this,arguments);};f.prototype.addItem=function(i){this.addAggregation("items",i);if(i){i.attachEvent("_change",this.onItemChange,this);}this._scheduleOnItemsLoadedOnce();return this;};f.prototype.insertItem=function(i,g){this.insertAggregation("items",i,g,true);if(i){i.attachEvent("_change",this.onItemChange,this);}this._scheduleOnItemsLoadedOnce();return this;};f.prototype.getItemAt=function(i){return this.getItems()[+i]||null;};f.prototype.getFirstItem=function(){return this.getItems()[0]||null;};f.prototype.getLastItem=function(){var i=this.getItems();return i[i.length-1]||null;};f.prototype.getEnabledItems=function(i){var L=this.getList();return L?L.getEnabledItems(i):[];};f.prototype.getItemByKey=function(k){var L=this.getList();return L?L.getItemByKey(k):null;};f.prototype.isOpen=function(){var o=this.getAggregation("picker");return!!(o&&o.isOpen());};f.prototype.close=function(){var o=this.getAggregation("picker");if(o){o.close();}return this;};f.prototype.removeItem=function(i){var L=this.getList();i=L?L.removeItem(i):null;if(i){i.detachEvent("_change",this.onItemChange,this);}return i;};f.prototype.removeAllItems=function(){var L=this.getList(),g=L?L.removeAllItems():[];this.clearSelection();for(var i=0;i<g.length;i++){g[i].detachEvent("_change",this.onItemChange,this);}return g;};f.prototype.destroyItems=function(){var L=this.getList();if(L){L.destroyItems();}return this;};return f;},true);
