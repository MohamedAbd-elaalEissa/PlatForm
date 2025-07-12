import{Ma as ne,Na as b,Ua as D,Xa as z,_a as ae,ab as le,mb as ce,ob as re,qa as te,ra as ie}from"./chunk-IFNCIUGM.js";import{$ as y,Ab as l,Cb as H,Db as E,Dc as h,Eb as m,Ec as J,Jb as g,Kb as v,Lb as f,Mb as L,Nb as j,Pb as P,Rb as Y,Sb as F,Tb as G,Ub as U,Uc as W,Wc as ee,Xb as O,Yb as K,Zb as T,_ as N,_a as s,_b as V,_c as oe,aa as C,cd as B,fa as _,fb as A,jc as S,kc as X,lb as u,lc as Z,ma as q,mb as M,na as $,oa as w,pa as Q,pb as d,ra as r,rb as R,sb as x,wa as I,zb as p}from"./chunk-WMH6ZWCB.js";var pe=(()=>{class e extends ae{static \u0275fac=(()=>{let o;return function(t){return(o||(o=r(e)))(t||e)}})();static \u0275cmp=u({type:e,selectors:[["MinusIcon"]],features:[d],decls:2,vars:5,consts:[["width","14","height","14","viewBox","0 0 14 14","fill","none","xmlns","http://www.w3.org/2000/svg"],["d","M13.2222 7.77778H0.777778C0.571498 7.77778 0.373667 7.69584 0.227806 7.54998C0.0819442 7.40412 0 7.20629 0 7.00001C0 6.79373 0.0819442 6.5959 0.227806 6.45003C0.373667 6.30417 0.571498 6.22223 0.777778 6.22223H13.2222C13.4285 6.22223 13.6263 6.30417 13.7722 6.45003C13.9181 6.5959 14 6.79373 14 7.00001C14 7.20629 13.9181 7.40412 13.7722 7.54998C13.6263 7.69584 13.4285 7.77778 13.2222 7.77778Z","fill","currentColor"]],template:function(i,t){i&1&&(Q(),g(0,"svg",0),f(1,"path",1),v()),i&2&&(m(t.getClassNames()),p("aria-label",t.ariaLabel)("aria-hidden",t.ariaHidden)("role",t.role))},encapsulation:2})}return e})();var de=["checkboxicon"],fe=["input"],ke=()=>({"p-checkbox-input":!0}),xe=e=>({checked:e,class:"p-checkbox-icon"});function me(e,n){if(e&1&&f(0,"span",8),e&2){let o=F(3);l("ngClass",o.checkboxIcon),p("data-pc-section","icon")}}function ge(e,n){e&1&&f(0,"CheckIcon",9),e&2&&(l("styleClass","p-checkbox-icon"),p("data-pc-section","icon"))}function ve(e,n){if(e&1&&(L(0),x(1,me,1,2,"span",7)(2,ge,1,2,"CheckIcon",6),j()),e&2){let o=F(2);s(),l("ngIf",o.checkboxIcon),s(),l("ngIf",!o.checkboxIcon)}}function ye(e,n){e&1&&f(0,"MinusIcon",9),e&2&&(l("styleClass","p-checkbox-icon"),p("data-pc-section","icon"))}function Ce(e,n){if(e&1&&(L(0),x(1,ve,3,2,"ng-container",4)(2,ye,1,2,"MinusIcon",6),j()),e&2){let o=F();s(),l("ngIf",o.checked),s(),l("ngIf",o._indeterminate())}}function _e(e,n){}function $e(e,n){e&1&&x(0,_e,0,0,"ng-template")}var we=({dt:e})=>`
.p-checkbox {
    position: relative;
    display: inline-flex;
    user-select: none;
    vertical-align: bottom;
    width: ${e("checkbox.width")};
    height: ${e("checkbox.height")};
}

.p-checkbox-input {
    cursor: pointer;
    appearance: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    z-index: 1;
    outline: 0 none;
    border: 1px solid transparent;
    border-radius: ${e("checkbox.border.radius")};
}

.p-checkbox-box {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${e("checkbox.border.radius")};
    border: 1px solid ${e("checkbox.border.color")};
    background: ${e("checkbox.background")};
    width: ${e("checkbox.width")};
    height: ${e("checkbox.height")};
    transition: background ${e("checkbox.transition.duration")}, color ${e("checkbox.transition.duration")}, border-color ${e("checkbox.transition.duration")}, box-shadow ${e("checkbox.transition.duration")}, outline-color ${e("checkbox.transition.duration")};
    outline-color: transparent;
    box-shadow: ${e("checkbox.shadow")};
}

.p-checkbox-icon {
    transition-duration: ${e("checkbox.transition.duration")};
    color: ${e("checkbox.icon.color")};
    font-size: ${e("checkbox.icon.size")};
    width: ${e("checkbox.icon.size")};
    height: ${e("checkbox.icon.size")};
}

.p-checkbox:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
    border-color: ${e("checkbox.hover.border.color")};
}

.p-checkbox-checked .p-checkbox-box {
    border-color: ${e("checkbox.checked.border.color")};
    background: ${e("checkbox.checked.background")};
}

.p-checkbox-checked .p-checkbox-icon {
    color: ${e("checkbox.icon.checked.color")};
}

.p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
    background: ${e("checkbox.checked.hover.background")};
    border-color: ${e("checkbox.checked.hover.border.color")};
}

.p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-icon {
    color: ${e("checkbox.icon.checked.hover.color")};
}

.p-checkbox:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
    border-color: ${e("checkbox.focus.border.color")};
    box-shadow: ${e("checkbox.focus.ring.shadow")};
    outline: ${e("checkbox.focus.ring.width")} ${e("checkbox.focus.ring.style")} ${e("checkbox.focus.ring.color")};
    outline-offset: ${e("checkbox.focus.ring.offset")};
}

.p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
    border-color: ${e("checkbox.checked.focus.border.color")};
}

p-checkbox.ng-invalid.ng-dirty .p-checkbox-box {
    border-color: ${e("checkbox.invalid.border.color")};
}

.p-checkbox.p-variant-filled .p-checkbox-box {
    background: ${e("checkbox.filled.background")};
}

.p-checkbox-checked.p-variant-filled .p-checkbox-box {
    background: ${e("checkbox.checked.background")};
}

.p-checkbox-checked.p-variant-filled:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
    background: ${e("checkbox.checked.hover.background")};
}

.p-checkbox.p-disabled {
    opacity: 1;
}

.p-checkbox.p-disabled .p-checkbox-box {
    background: ${e("checkbox.disabled.background")};
    border-color: ${e("checkbox.checked.disabled.border.color")};
}

.p-checkbox.p-disabled .p-checkbox-box .p-checkbox-icon {
    color: ${e("checkbox.icon.disabled.color")};
}

.p-checkbox-sm,
.p-checkbox-sm .p-checkbox-box {
    width: ${e("checkbox.sm.width")};
    height: ${e("checkbox.sm.height")};
}

.p-checkbox-sm .p-checkbox-icon {
    font-size: ${e("checkbox.icon.sm.size")};
    width: ${e("checkbox.icon.sm.size")};
    height: ${e("checkbox.icon.sm.size")};
}

.p-checkbox-lg,
.p-checkbox-lg .p-checkbox-box {
    width: ${e("checkbox.lg.width")};
    height: ${e("checkbox.lg.height")};
}

.p-checkbox-lg .p-checkbox-icon {
    font-size: ${e("checkbox.icon.lg.size")};
    width: ${e("checkbox.icon.lg.size")};
    height: ${e("checkbox.icon.lg.size")};
}
`,Ie={root:({instance:e,props:n})=>["p-checkbox p-component",{"p-checkbox-checked":e.checked,"p-disabled":n.disabled,"p-invalid":n.invalid,"p-variant-filled":n.variant?n.variant==="filled":e.config.inputStyle==="filled"||e.config.inputVariant==="filled"}],box:"p-checkbox-box",input:"p-checkbox-input",icon:"p-checkbox-icon"},be=(()=>{class e extends D{name="checkbox";theme=we;classes=Ie;static \u0275fac=(()=>{let o;return function(t){return(o||(o=r(e)))(t||e)}})();static \u0275prov=y({token:e,factory:e.\u0275fac})}return e})();var Me={provide:ce,useExisting:N(()=>he),multi:!0},he=(()=>{class e extends z{value;name;disabled;binary;ariaLabelledBy;ariaLabel;tabindex;inputId;style;inputStyle;styleClass;inputClass;indeterminate=!1;size;formControl;checkboxIcon;readonly;required;autofocus;trueValue=!0;falseValue=!1;variant;onChange=new I;onFocus=new I;onBlur=new I;inputViewChild;get checked(){return this._indeterminate()?!1:this.binary?this.model===this.trueValue:ie(this.value,this.model)}get containerClass(){return{"p-checkbox p-component":!0,"p-checkbox-checked p-highlight":this.checked,"p-disabled":this.disabled,"p-variant-filled":this.variant==="filled"||this.config.inputStyle()==="filled"||this.config.inputVariant()==="filled","p-checkbox-sm p-inputfield-sm":this.size==="small","p-checkbox-lg p-inputfield-lg":this.size==="large"}}_indeterminate=A(void 0);checkboxIconTemplate;templates;_checkboxIconTemplate;model;onModelChange=()=>{};onModelTouched=()=>{};focused=!1;_componentStyle=_(be);ngAfterContentInit(){this.templates.forEach(o=>{switch(o.getType()){case"icon":this._checkboxIconTemplate=o.template;break;case"checkboxicon":this._checkboxIconTemplate=o.template;break}})}ngOnChanges(o){super.ngOnChanges(o),o.indeterminate&&this._indeterminate.set(o.indeterminate.currentValue)}updateModel(o){let i,t=this.injector.get(re,null,{optional:!0,self:!0}),a=t&&!this.formControl?t.value:this.model;this.binary?(i=this._indeterminate()?this.trueValue:this.checked?this.falseValue:this.trueValue,this.model=i,this.onModelChange(i)):(this.checked||this._indeterminate()?i=a.filter(c=>!te(c,this.value)):i=a?[...a,this.value]:[this.value],this.onModelChange(i),this.model=i,this.formControl&&this.formControl.setValue(i)),this._indeterminate()&&this._indeterminate.set(!1),this.onChange.emit({checked:i,originalEvent:o})}handleChange(o){this.readonly||this.updateModel(o)}onInputFocus(o){this.focused=!0,this.onFocus.emit(o)}onInputBlur(o){this.focused=!1,this.onBlur.emit(o),this.onModelTouched()}focus(){this.inputViewChild.nativeElement.focus()}writeValue(o){this.model=o,this.cd.markForCheck()}registerOnChange(o){this.onModelChange=o}registerOnTouched(o){this.onModelTouched=o}setDisabledState(o){setTimeout(()=>{this.disabled=o,this.cd.markForCheck()})}static \u0275fac=(()=>{let o;return function(t){return(o||(o=r(e)))(t||e)}})();static \u0275cmp=u({type:e,selectors:[["p-checkbox"],["p-checkBox"],["p-check-box"]],contentQueries:function(i,t,a){if(i&1&&(O(a,de,4),O(a,ne,4)),i&2){let c;T(c=V())&&(t.checkboxIconTemplate=c.first),T(c=V())&&(t.templates=c)}},viewQuery:function(i,t){if(i&1&&K(fe,5),i&2){let a;T(a=V())&&(t.inputViewChild=a.first)}},inputs:{value:"value",name:"name",disabled:[2,"disabled","disabled",h],binary:[2,"binary","binary",h],ariaLabelledBy:"ariaLabelledBy",ariaLabel:"ariaLabel",tabindex:[2,"tabindex","tabindex",J],inputId:"inputId",style:"style",inputStyle:"inputStyle",styleClass:"styleClass",inputClass:"inputClass",indeterminate:[2,"indeterminate","indeterminate",h],size:"size",formControl:"formControl",checkboxIcon:"checkboxIcon",readonly:[2,"readonly","readonly",h],required:[2,"required","required",h],autofocus:[2,"autofocus","autofocus",h],trueValue:"trueValue",falseValue:"falseValue",variant:"variant"},outputs:{onChange:"onChange",onFocus:"onFocus",onBlur:"onBlur"},features:[S([Me,be]),R,d,q],decls:6,vars:29,consts:[["input",""],[3,"ngClass"],["type","checkbox",3,"focus","blur","change","value","checked","disabled","readonly","ngClass"],[1,"p-checkbox-box"],[4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"styleClass",4,"ngIf"],["class","p-checkbox-icon",3,"ngClass",4,"ngIf"],[1,"p-checkbox-icon",3,"ngClass"],[3,"styleClass"]],template:function(i,t){if(i&1){let a=P();g(0,"div",1)(1,"input",2,0),Y("focus",function(k){return $(a),w(t.onInputFocus(k))})("blur",function(k){return $(a),w(t.onInputBlur(k))})("change",function(k){return $(a),w(t.handleChange(k))}),v(),g(3,"div",3),x(4,Ce,3,2,"ng-container",4)(5,$e,1,0,null,5),v()()}i&2&&(E(t.style),m(t.styleClass),l("ngClass",t.containerClass),p("data-p-highlight",t.checked)("data-p-checked",t.checked)("data-p-disabled",t.disabled),s(),E(t.inputStyle),m(t.inputClass),l("value",t.value)("checked",t.checked)("disabled",t.disabled)("readonly",t.readonly)("ngClass",X(26,ke)),p("id",t.inputId)("name",t.name)("tabindex",t.tabindex)("required",t.required?!0:null)("aria-labelledby",t.ariaLabelledBy)("aria-label",t.ariaLabel),s(3),l("ngIf",!t.checkboxIconTemplate&&!t._checkboxIconTemplate),s(),l("ngTemplateOutlet",t.checkboxIconTemplate||t._checkboxIconTemplate)("ngTemplateOutletContext",Z(27,xe,t.checked)))},dependencies:[B,W,ee,oe,le,pe,b],encapsulation:2,changeDetection:0})}return e})(),We=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=M({type:e});static \u0275inj=C({imports:[he,b,b]})}return e})();var Fe=["*"],Te=({dt:e})=>`
.p-floatlabel {
    display: block;
    position: relative;
}

.p-floatlabel label {
    position: absolute;
    pointer-events: none;
    top: 50%;
    transform: translateY(-50%);
    transition-property: all;
    transition-timing-function: ease;
    line-height: 1;
    font-weight: ${e("floatlabel.font.weight")};
    inset-inline-start: ${e("floatlabel.position.x")};
    color: ${e("floatlabel.color")};
    transition-duration: ${e("floatlabel.transition.duration")};
}

.p-floatlabel:has(.p-textarea) label {
    top: ${e("floatlabel.position.y")};
    transform: translateY(0);
}

.p-floatlabel:has(.p-inputicon:first-child) label {
    inset-inline-start: calc((${e("form.field.padding.x")} * 2) + ${e("icon.size")});
}

.p-floatlabel:has(.ng-invalid.ng-dirty) label {
    color: ${e("floatlabel.invalid.color")};
}

.p-floatlabel:has(input:focus) label,
.p-floatlabel:has(input.p-filled) label,
.p-floatlabel:has(input:-webkit-autofill) label,
.p-floatlabel:has(textarea:focus) label,
.p-floatlabel:has(textarea.p-filled) label,
.p-floatlabel:has(.p-inputwrapper-focus) label,
.p-floatlabel:has(.p-inputwrapper-filled) label {
    top: ${e("floatlabel.over.active.top")};
    transform: translateY(0);
    font-size: ${e("floatlabel.active.font.size")};
    font-weight: ${e("floatlabel.label.active.font.weight")};
}

.p-floatlabel:has(input.p-filled) label,
.p-floatlabel:has(textarea.p-filled) label,
.p-floatlabel:has(.p-inputwrapper-filled) label {
    color: ${e("floatlabel.active.color")};
}

.p-floatlabel:has(input:focus) label,
.p-floatlabel:has(input:-webkit-autofill) label,
.p-floatlabel:has(textarea:focus) label,
.p-floatlabel:has(.p-inputwrapper-focus) label {
    color: ${e("floatlabel.focus.color")};
}

.p-floatlabel-in .p-inputtext,
.p-floatlabel-in .p-textarea,
.p-floatlabel-in .p-select-label,
.p-floatlabel-in .p-multiselect-label-container,
.p-floatlabel-in .p-autocomplete-input-multiple,
.p-floatlabel-in .p-cascadeselect-label,
.p-floatlabel-in .p-treeselect-label {
    padding-top: ${e("floatlabel.in.input.padding.top")};
}

.p-floatlabel-in:has(input:focus) label,
.p-floatlabel-in:has(input.p-filled) label,
.p-floatlabel-in:has(input:-webkit-autofill) label,
.p-floatlabel-in:has(textarea:focus) label,
.p-floatlabel-in:has(textarea.p-filled) label,
.p-floatlabel-in:has(.p-inputwrapper-focus) label,
.p-floatlabel-in:has(.p-inputwrapper-filled) label {
    top: ${e("floatlabel.in.active.top")};
}

.p-floatlabel-on:has(input:focus) label,
.p-floatlabel-on:has(input.p-filled) label,
.p-floatlabel-on:has(input:-webkit-autofill) label,
.p-floatlabel-on:has(textarea:focus) label,
.p-floatlabel-on:has(textarea.p-filled) label,
.p-floatlabel-on:has(.p-inputwrapper-focus) label,
.p-floatlabel-on:has(.p-inputwrapper-filled) label {
    top: 0;
    transform: translateY(-50%);
    border-radius: ${e("floatlabel.on.border.radius")};
    background: ${e("floatlabel.on.active.background")};
    padding: ${e("floatlabel.on.active.padding")};
}
`,Ve={root:({instance:e,props:n})=>["p-floatlabel",{"p-floatlabel-over":n.variant==="over","p-floatlabel-on":n.variant==="on","p-floatlabel-in":n.variant==="in"}]},ue=(()=>{class e extends D{name="floatlabel";theme=Te;classes=Ve;static \u0275fac=(()=>{let o;return function(t){return(o||(o=r(e)))(t||e)}})();static \u0275prov=y({token:e,factory:e.\u0275fac})}return e})();var Se=(()=>{class e extends z{_componentStyle=_(ue);variant="over";static \u0275fac=(()=>{let o;return function(t){return(o||(o=r(e)))(t||e)}})();static \u0275cmp=u({type:e,selectors:[["p-floatlabel"],["p-floatLabel"],["p-float-label"]],hostVars:8,hostBindings:function(i,t){i&2&&H("p-floatlabel",!0)("p-floatlabel-over",t.variant==="over")("p-floatlabel-on",t.variant==="on")("p-floatlabel-in",t.variant==="in")},inputs:{variant:"variant"},features:[S([ue]),d],ngContentSelectors:Fe,decls:1,vars:0,template:function(i,t){i&1&&(G(),U(0))},dependencies:[B,b],encapsulation:2,changeDetection:0})}return e})(),ho=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=M({type:e});static \u0275inj=C({imports:[Se,b,b]})}return e})();export{pe as a,he as b,We as c,Se as d,ho as e};
