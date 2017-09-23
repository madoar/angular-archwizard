# Overview ng2-archwizard

[![Build Status](https://travis-ci.org/madoar/ng2-archwizard.svg?branch=master)](https://travis-ci.org/madoar/ng2-archwizard)
[![Dependency Status](https://david-dm.org/madoar/ng2-archwizard.svg)](https://david-dm.org/madoar/ng2-archwizard)
[![Dev-Dependency Status](https://david-dm.org/madoar/ng2-archwizard/dev-status.svg)](https://david-dm.org/madoar/ng2-archwizard?type=dev)
[![Dependency Licence Status](https://dependencyci.com/github/madoar/ng2-archwizard/badge)](https://dependencyci.com/github/madoar/ng2-archwizard)
[![Code Climate](https://codeclimate.com/github/madoar/ng2-archwizard/badges/gpa.svg)](https://codeclimate.com/github/madoar/ng2-archwizard)
[![Test Coverage](https://codeclimate.com/github/madoar/ng2-archwizard/badges/coverage.svg)](https://codeclimate.com/github/madoar/ng2-archwizard/coverage)
[![NPM Version](https://img.shields.io/npm/v/ng2-archwizard.svg)](https://www.npmjs.com/package/ng2-archwizard)

This project contains a functional wizard component for [Angular 2 and 4](https://angular.io/).

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Installation

`ng2-archwizard` is available as an NPM package. To install ng2-archwizard in your project directory run:
```
$ npm install --save ng2-archwizard
```

Afterwards you can import ng2-archwizard in your angular 2 project by adding the `WizardModule` to your Module declaration as followed:
```typescript
import { WizardModule } from 'ng2-archwizard';

@NgModule({
  imports: [
    WizardModule
  ],
})
export class Module { }
```

## How to use the wizard
To use the this wizard component in an angular 2 project simply add a wizard component to the html template of your component, like this:

```html
<wizard>
  <wizard-step stepTitle="Title of step 1">
    Content of Step 1
    <button type="button" nextStep>Next Step</button>
    <button type="button" goToStep="2">Go directly to third Step</button>
  </wizard-step>
  <wizard-step stepTitle="Title of step 2" optionalStep>
    Content of Step 2
    <button type="button" previousStep>Go to previous step</button>
    <button type="button" nextStep>Go to next step</button>
  </wizard-step>
  <wizard-step stepTitle="Title of step 3">
    Content of Step 3
    <button type="button" previousStep>Previous Step</button>
    <button type="button" (click)="finishFunction()">Finish</button>
  </wizard-step>
</wizard>
``` 

### \<wizard\>
The `<wizard></wizard>` environment is the environment, in which you define your wizard.
This environment must contain all steps, that make up your wizard.
It's possible to pass the following parameters to a wizard environment:

`ng2-archwizard` enables you to choose the location and the layout of the navigation bar inside your wizard.

#### \[navBarLocation\]
The location of the navigation bar inside the wizard can be specified with the `navBarLocation` input value.
This value can be either `top`, `bottom`, `left` or `right`, where the values specify the position at which the navigation bar will be shown.
In addition `top` and `bottom` will lead to a horizontal navigation bar, when `left` and `right` lead to a vertical navigation bar at the
left or right side.
If no `navBarLocation` is given the navigation bar will be shown at the top of the wizard.

#### \[navBarLayout\]
Another option that can be changed is the design or layout of the navigation bar.
Currently five different navigation bar layouts exist.
These are `small`, `large-filled`, `large-empty`, `large-filled-symbols` and `large-empty-symbols`.

The first three layouts are showing circles with or without a background, for each step of your wizard, in the navigation bar. 
The second two layouts `large-filled-symbols` and `large-empty-symbols` optionally add a symbol in the center of the circle, 
for each step of your wizard, in the navigation bar, if such a symbol has been defined for the step.

#### \[navigationMode\]
`ng2-archwizard` supports three different navigation modes:
- **strict** navigation mode: 
   The first navigation mode is strict navigation. 
   This mode describes the status quo, i.e. the current navigation behavior of the wizard. 
   Currently you can only navigate through the wizard steps in a linear fashion, 
   where you can only enter the next step if all previous steps have been completed and the exit condition of your current step have been fulfilled. 
   In this mode it is not possible to jump between different steps, i.e. move to step 3 from step 1, then go to step 2 to finally go to step 4. 
   The only exception to this rule are optional steps, which a user can skip. 
   Therefore you are required to do the steps in the order `1 -> 2 -> 3 -> 4`.
- **semi-strict** navigation mode:
   The second navigation mode is semi-strict navigation. 
   This mode lets the user navigate between the steps in any order he likes. 
   This means that in this navigation mode a user could complete the steps in the order `1 -> 3 -> 2 -> 4`, if the exit conditions have been fulfilled. 
   This mode has only one restriction, where the user can enter the completion step after he has completed all previous steps. 
   Again optional steps are skipable in this mode.
- **free** navigation mode:
   The third navigation mode is free navigation. 
   This mode let's the user navigate freely between the different steps, including the completion step, in any order he desires.

#### \[defaultStepIndex\]
Per default the wizard always starts with the first wizard step, after initialisation. The same applies for a reset, where the wizard normally resets to the first step.
Sometimes this needs to be changed. If another default wizard step needs to be used, you can set it, by using the `[defaultStepIndex]` input of the wizard component.
For example, to start the wizard in the second step, `defaultStepIndex="2"` can to be set.

#### \[disableNavigationBar\]
Sometimes it may be necessary to disable navigation via the navigation bar.
In such a case you can disable navigation via the navigation bar by setting the input `disableNavigationBar` of the wizard component to `true`.

#### Parameter overview
Possible `<wizard>` parameters:

| Parameter name         | Possible Values                                                                                       | Default Value |
| ---------------------- | ----------------------------------------------------------------------------------------------------- | ------------- |
| [navBarLocation]       | top &#124; bottom &#124; left &#124; right                                                            | top           |
| [navBarLayout]         | small &#124; large-filled &#124; large-empty &#124; large-filled-symbols &#124; large-empty-symbols   | small         |
| [navigationMode]       | strict &#124; semi-strict &#124; free                                                                 | strict        |
| [defaultStepIndex]     | number                                                                                                | 0             |
| [disableNavigationBar] | boolean                                                                                               | false         |

### \<wizard-step\>
The `<wizard-step></wizard-step>` environment is the wizard step environment. 
Every step that belongs to your wizard must be defined inside its own `<wizard-step></wizard-step>` environment.

#### \[stepTitle\]
A wizard step must contain a title, which is shown in the navigation bar of the wizard. 
The step title can be set by adding a `stepTitle` attribute to the step definition. 

#### \[navigationSymbol\]
Sometimes it's useful to add a symbol in the center of the circle in the navigation bar, that belongs to the step.
`ng2-archwizard` supports this through the `navigationSymbol` input attribute of the wizard step.

Be aware, that not all layouts display the symbols. Only the layouts `large-filled-symbols` and `large-empty-symbols` display the symbols.

If you want to add a `2` to the circle in the navigation bar belonging to the second step you can do it like this:

```html
<wizard-step stepTitle="Second Step" navigationSymbol="2"></wizard-step>
```

In addition to normal symbols it's also possible to use an icon from a font as a symbol.
To use an icon from a font you need to first search for the unicode belonging to the icon you want to insert.
Afterwards you can use the unicode in the [numeric character reference](https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references) 
format as the symbol for the step.
In addition you need to specify the font family, to which the icon belongs, otherwise the symbol can't be displayed correctly.

#### \[navigationSymbolFontFamily\]
To specify the font family of the used symbol inside the center of the circle in the navigation bar, that belongs to a step, you need to set the 
`navigationSymbolFontFamily` input attribute of the step.

For example, if you want to show the icon with the unicode `\f2dd` of [FontAwesome](http://fontawesome.io/) inside a step circle in the navigation bar, then 
you need to set the `navigationSymbol` input attribute of the step to `&#xf2dd;` and the `navigationSymbolFontFamily` to `FontAwesome`:

```html
<wizard-step stepTitle="Second Step" navigationSymbol="&#xf2dd;" navigationSymbolFontFamily="FontAwesome"></wizard-step>
```

#### \[canEnter\]
Sometimes it's required to only allow the user to enter a specific step if a certain validation method returns true.
In such a case you can use the `[canEnter]` input of the targeted wizard step.
This input can be either a boolean, which directly tells the wizard if the targeted step can be entered, 
or a lambda function, taking a `MovingDirection` and returning a boolean.
This function will then be called, with the direction in which the targeted step will be entered, whenever an operation has been performed, that leads to a change of the current step.
It then returns true, when the step change should succeed and false otherwise.

#### \[canExit\]
If you have an additional check or validation you need to perform to decide, if the step can be exited (both to the next step and to the previous step),
you can either pass a boolean or a function, taking a `MovingDirection` enum and returning a boolean, to the `[canExit]` attribute of the wizard step.
This boolean or function is taken in account when an operation has been performed, that leads to a change of the current step.
If `[canExit]` has been bound to a boolean, it needs to be true to leave the step either in both a forwards and backwards direction.
If only exiting one direction should be covered, you can pass a function taking `MovingDirection` and returning a boolean to `[canExit]`.
This function will then be called, with the direction in which the current step should be moved, whenever an operation has been performed, that leads to a change of the current step.
It then returns true, when the step change should succeed and false otherwise.

#### \(stepEnter\)
If you need to call a function to do some initialisation work before entering a wizard step you can add a `stepEnter` attribute to the wizard step environment like this:

```html
<wizard-step stepTitle="Second Step" (stepEnter)="enterSecondStep($event)"></wizard-step>
```

This leads to the calling of the `enterSecondStep` function when the wizard moves to this step.
When the first step of the wizard contains a `stepEnter` function, it not only gets called 
when the used moves back from a later step to the first step, but also after the wizard is initialized.
The event emitter will call the given function with a parameter that contains the `MovingDirection` of the user. 
If the user went backwards, like from the third step to the second or first step, then `MovingDirection.Backwards` will be passed to the function. 
If the user went forwards `MovingDirection.Forwards` will be passed to the function.

#### \(stepExit\)
Similar to `stepEnter` you can add a `stepExit` attribute to the wizard step environment, if you want to call a function every time a wizard step is exited 
either by pressing on a component with a `nextStep` or `previousStep` directive, or by a click on the navigation bar. 
`stepExit`, like `stepEnter` can call the given function with an argument of type `MovingDirection` that signalises in which direction the step was exited.

#### Parameter overview
Possible `<wizard-step>` parameters:

| Parameter name                | Possible Values                                   | Default Value |
| ----------------------------- | ------------------------------------------------- | ------------- |
| [stepTitle]                   | string                                            | null          |
| [navigationSymbol]            | string                                            | ''            |
| [navigationSymbolFontFamily]  | string                                            | null          |
| [canEnter]                    | function(MovingDirection): boolean &#124; boolean | true          |
| [canExit]                     | function(MovingDirection): boolean &#124; boolean | true          |
| (stepEnter)                   | function(MovingDirection)                         | null          |
| (stepExit)                    | function(MovingDirection)                         | null          |

### \<wizard-completion-step\>
In addition to the "normal" step component `<wizard-step>` it's also possible to define an optional `<wizard-completion-step>`.
This wizard completion step is, if defined, always appended at the end of your wizard as its last step.
It is meant as a step, which signalises the user that he successfully completed the wizard.
When the wizard completion step has been entered by the user all wizard steps, including the optional steps, are marked as completed.
In addition the user gets prevented from leaving the wizard completion step to another step after it has been entered. 

The given parameters for the wizard completion step are identical to the normal wizard step.
The only difference is, that it it isn't possible to pass a `(stepExit)` and `[canExit]` parameter to the wizard completion step, 
because it can't be exited.

#### Parameter overview
Possible `<wizard-completion-step>` parameters:

| Parameter name                | Possible Values                                   | Default Value |
| ----------------------------- | ------------------------------------------------- | ------------- |
| [stepTitle]                   | string                                            | null          |
| [navigationSymbol]            | string                                            | ''            |
| [navigationSymbolFontFamily]  | string                                            | null          |
| [canEnter]                    | function(MovingDirection): boolean &#124; boolean | true          |
| (stepEnter)                   | function(MovingDirection)                         | null          |

### \[enableBackLinks\]
In some cases it may be required that the user is able to leave an entered `wizard-completion-step`.
If this is the case you can enable this by adding the directive `[enableBackLinks]` to the `wizard-completion-step`.

```html
<wizard-completion-step enableBackLinks>
  Final wizard step
</wizard-completion-step>
```

#### Parameter overview
Possible `[enableBackLinks]` parameters:

| Parameter name                | Possible Values                                   | Default Value |
| ----------------------------- | ------------------------------------------------- | ------------- |
| (stepExit)                    | function(MovingDirection)                         | null          |


### \[wizardStepTitle\]
Sometimes it's not enough to define a title with the `stepTitle` attribute in `<wizard-step>` and `<wizard-completion-step>`.
One example for such a case is, if the title should be written in another font.
Another example would be if it's desired that the title should be choosen depending on the available width of your screen or window.
In such cases you may want to specify the html for the title of a wizard step yourself.
This can be achieved by using the `[wizardStepTitle]` directive inside a wizard step on a `ng-template` component.

```html
<wizard-step (stepEnter)="enterStep($event)">
  <ng-template wizardStepTitle>
    <span class="hidden-sm-down">Delivery address</span>
    <span class="hidden-md-up">Address</span>
  </ng-template>
</wizard-step>
```

Be aware, that you can only use `[wizardStepTitle]` together with Angular, because `ng-template` was introduced in Angular 4.

### \[optionalStep\]
If you need to define an optional step, that doesn't need to be done to continue to the next steps, you can define an optional step 
by adding the `optionalStep` directive to the step you want to declare as optional. 
To add the `optionalStep` directive to a wizard step, you can either add `optional` or `optionalStep` to the step definition.

### \[selectedStep\]
In some cases it may be a better choice to set the default wizard step not via a static number.
Another way to set the default wizard step is by using the `selectedStep` directive.
When attaching the `selectedStep` directive to an arbitrary wizard step, it will be marked as the default wizard step,
which is shown directly after the wizard startup.
To add the `selectedStep` directive to a wizard step, you can either add `selected` or `selectedStep` to the step definition. 

### \[goToStep\]
`ng2-archwizard` has three directives, that allow moving between steps.
These directives are the `previousStep`, `nextStep` and `goToStep` directives.
The `goToStep` directive needs to receive an argument, that tells the wizard to which step it should change, 
when the element with the `goToStep` directive has been clicked.
This argument has to be the zero-based index of the destination step:

```html
<button goToStep="2" (finalize)="finalizeStep()">Go directly to the third Step</button>
```

In the previous example the button moves the user automatically to the third step, after the user pressed onto it.
This makes it possible to directly jump to all already completed steps and to the first not completed optional or default (not optional) next step, 
which will set the current as completed and makes it possible to jump over steps defined as optional steps.

Alternatively to an absolute step index, it's also possible to set the destination wizard step as an offset to the source step:
```html
<button [goToStep]="{stepOffset: 1}" (finalize)="finalizeStep()">Go to the third Step</button>
```
In this example a click on the "Go to the third Step" button will move the user to the next step compared to the step the button belongs to.
If the button is for example part of the second step, a click on it will move the user to the third step.
When using offsets it's important to use `[]` around the `goToStep` directive to tell angular that the argument is to be interpreted as javascript.

In addition to a static value you can also pass a local variable from your component typescript class, 
that contains to which step a click on the element should change the current step of the wizard. 
This can be useful if your step transitions depend on some application dependent logic, that changes depending on the user input.
Here again it's important to use `[]` around the `goToStep` directive to tell angular that the argument is to be interpreted as javascript.  

#### \(preFinalize\)
Sometimes it's required to bind an event emitter to a specific element, which can perform a step transition. 
Such an event emitter can be bound to the `(preFinalize)` output of the element, which contains the `goToStep` directive.
This event emitter is then called, directly before the wizard transitions to the given step.

#### \(postFinalize\)
Alternatively you can also bind an event emitter to `(postFinalize)`, 
which is executed directly after the wizard transitions to the given step.

#### \(finalize\)
In case you don't really care when the finalization event emitter is called, you can also bind it simply to `(finalize)`. 
`finalize` is a synonym for `preFinalize`. 

#### Parameter overview
Possible parameters:

| Parameter name    | Possible Values                                           | Default Value |
| ----------------- | --------------------------------------------------------- | ------------- |
| [goToStep]        | WizardStep &#124; StepOffset &#124; number &#124; string  | null          |
| (preFinalize)     | function()                                                | null          |
| (postFinalize)    | function()                                                | null          |
| (finalize)        | function()                                                | null          |

### \[nextStep\]
By adding a `nextStep` directive to a button or a link inside a step, you automatically add a `onClick` listener to the button or link, that leads to the next step.
This listener will automatically change the currently selected wizard step to the next wizard step after a click on the component.

```html
<button (finalize)="finalizeStep()" nextStep>Next Step</button>
```

#### \(finalize\)
Like the `goToStep` directive the `nextStep` directive provides a `preFinalize`, `postFinalize` and `finalize` output, which are called every time
the current step is successfully exited, by clicking on the element containing the `nextStep` directive.

In the given code snipped above, a click on the button with the text `Next Step`, leads to a call of the `finalize` functions every time, the button has been pressed.

#### Parameter overview
Possible parameters:

| Parameter name    | Possible Values                             | Default Value |
| ----------------- | ------------------------------------------- | ------------- |
| (preFinalize)     | function()                                  | null          |
| (postFinalize)    | function()                                  | null          |
| (finalize)        | function()                                  | null          |

### \[previousStep\]
By adding a `previousStep` directive to a button or a link, you automatically add a `onClick` listener to the button or link, that changes your wizard to the previous step.
This listener will automatically change the currently selected wizard step to the previous wizard step after a click on the component.

```html
<button (finalize)="finalizeStep()" previousStep>Previous Step</button>
```

#### \(finalize\)
Like both the `goToStep` and `nextStep` directives the `previousStep` directives too provides a `preFinalize`, `postFinalize` and `finalize` output, which are called every time
the current step is successfully exited, by clicking on the element containing the `previousStep` directive.

#### Parameter overview
Possible parameters:

| Parameter name    | Possible Values                             | Default Value |
| ----------------- | ------------------------------------------- | ------------- |
| (preFinalize)     | function()                                  | null          |
| (postFinalize)    | function()                                  | null          |
| (finalize)        | function()                                  | null          |

### \[wizardStep\]
In some cases it may be a good idea to move a wizard step to a custom component.
This can be done by defining adding the `[wizardStep]` directive to the component, that contains the wizard step.

```html
<wizard>
  <wizard-step stepTitle="Steptitle 1">
    Step 1
  </wizard-step>
  <custom-step wizardStep stepTitle="Steptitle 2"></custom-step>
  <wizard-step stepTitle="Steptitle 3">
    Step 3
  </wizard-step>
</wizard>
```

#### Parameter overview
Possible `[wizardStep]` parameters:

| Parameter name                | Possible Values                                   | Default Value |
| ----------------------------- | ------------------------------------------------- | ------------- |
| [stepTitle]                   | string                                            | null          |
| [navigationSymbol]            | string                                            | ''            |
| [navigationSymbolFontFamily]  | string                                            | null          |
| [canEnter]                    | function(MovingDirection): boolean &#124; boolean | true          |
| [canExit]                     | function(MovingDirection): boolean &#124; boolean | true          |
| (stepEnter)                   | function(MovingDirection)                         | null          |
| (stepExit)                    | function(MovingDirection)                         | null          |

### \[wizardCompletionStep\]
In addition to the possibility of defining a normal wizard step in a custom component, 
it is also possible to define a wizard completion step in a custom component.
To define a wizard completion step in a custom component you need to add the `[wizardCompletionStep]` directive to the custom component, 
that contains the wizard completion step.

```html
<wizard>
  <wizard-step stepTitle="Steptitle 1">
    Step 1
  </wizard-step>
  <custom-step wizardCompletionStep stepTitle="Completion steptitle">
  </custom-step>
</wizard>
```

#### Parameter overview
Possible `[wizardCompletionStep]` parameters:

| Parameter name                | Possible Values                                   | Default Value |
| ----------------------------- | ------------------------------------------------- | ------------- |
| [stepTitle]                   | string                                            | null          |
| [navigationSymbol]            | string                                            | ''            |
| [navigationSymbolFontFamily]  | string                                            | null          |
| [canEnter]                    | function(MovingDirection): boolean &#124; boolean | true          |
| (stepEnter)                   | function(MovingDirection)                         | null          |

### Accessing the wizard component instance
Sometimes it's required to access the wizard component directly. 
In such a case you can get the instance of the used wizard component in your own component via:
```typescript
@ViewChild(WizardComponent)
public wizard: WizardComponent;
```

In case you've created your own wizard step component with the `wizardStep` directive,
you can inject the state of your wizard in your own component:
```typescript
constructor(private wizardState: WizardState)
```

Through the `WizardState` you can access the navigation mode of your wizard, 
which allows you to navigate the wizard programmatically.
Both instances, the wizard state and the navigation mode, can also be obtained from the injected `WizardComponent`.

## Example
You can find an basic example project using `ng2-archwizard` [here](https://madoar.github.io/ng2-archwizard-demo). 
The sources for the example can be found in the [ng2-archwizard-demo](https://github.com/madoar/ng2-archwizard-demo) repository.
It illustrates how the wizard looks like and how the different settings can change its layout.
