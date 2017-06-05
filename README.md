# Overview ng2-archwizard

[![Build Status](https://travis-ci.org/madoar/ng2-archwizard.svg?branch=master)](https://travis-ci.org/madoar/ng2-archwizard)
[![Dependency Status](https://david-dm.org/madoar/ng2-archwizard.svg)](https://david-dm.org/madoar/ng2-archwizard)
[![Dev-Dependency Status](https://david-dm.org/madoar/ng2-archwizard/dev-status.svg)](https://david-dm.org/madoar/ng2-archwizard?type=dev)
[![Dependency Licence Status](https://dependencyci.com/github/madoar/ng2-archwizard/badge)](https://dependencyci.com/github/madoar/ng2-archwizard)
[![Code Climate](https://codeclimate.com/github/madoar/ng2-archwizard/badges/gpa.svg)](https://codeclimate.com/github/madoar/ng2-archwizard)
[![Test Coverage](https://codeclimate.com/github/madoar/ng2-archwizard/badges/coverage.svg)](https://codeclimate.com/github/madoar/ng2-archwizard/coverage)
[![NPM Version](https://img.shields.io/npm/v/ng2-archwizard.svg)](https://www.npmjs.com/package/ng2-archwizard)

This project contains a functional wizard component for [Angular 2](https://angular.io/).

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Installation

Ng2-archwizard is available as an NPM package. To install ng2-archwizard in your project directory run:
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
  <wizard-step title="Title of step 1">
    Content of Step 1
    <button type="button" nextStep>Next Step</button>
    <button type="button" goToStep="2">Go directly to third Step</button>
  </wizard-step>
  <wizard-step title="Title of step 2" optionalStep>
    Content of Step 2
    <button type="button" previousStep>Go to previous step</button>
    <button type="button" nextStep>Go to next step</button>
  </wizard-step>
  <wizard-step title="Title of step 3">
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

#### Parameter overview
Possible `<wizard>` parameters:

| Parameter name    | Possible Values                                                                                       | Default Value |
| ----------------- | ----------------------------------------------------------------------------------------------------- | ------------- |
| [navBarLocation]  | top &#124; bottom &#124; left &#124; right                                                            | top           |
| [navBarLayout]    | small &#124; large-filled &#124; large-empty &#124; large-filled-symbols &#124; large-empty-symbols   | small         |

### \<wizard-step\>
The `<wizard-step></wizard-step>` environment is the wizard step environment. 
Every step that belongs to your wizard must be defined inside its own `<wizard-step></wizard-step>` environment.

#### \[title\]
A wizard must contain a title, which is shown in the navigation bar of the wizard. 
The title of a step can be set by adding a `title` attribute to the step definition. 

#### \[navigationSymbol\]
Sometimes it's useful to add a symbol in the center of the circle in the navigation bar, that belongs to the step.
`ng2-archwizard` supports this through the `navigationSymbol` input attribute of the wizard step.

Be aware, that not all layouts display the symbols. Only the layouts `large-filled-symbols` and `large-empty-symbols` display the symbols.

If you want to add a `2` to the circle in the navigation bar belonging to the second step you can do it like this:

```html
<wizard-step title="Second Step" navigationSymbol="2"></wizard-step>
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
<wizard-step title="Second Step" navigationSymbol="&#xf2dd;" navigationSymbolFontFamily="FontAwesome"></wizard-step>
```

#### \[canExit\]
If you have an additional check or validation you need to perform to decide, if the step can be exited (both to the next step and to the previous step),
you can either pass a boolean or a function, taking a `MovingDirection` enum and returning a boolean, to the `[canExit]` attribute of the wizard step.
This boolean or function is taken in account when an operation has been performed, that leads to a change of the current step.
If `[canExit]` has been bound to a boolean, it needs to be true to leave the step either in both a forwards and backwards direction.
If only exiting one direction should be covered, you can pass a function taking `MovingDirection` and returning a boolean to `[canExit]`.
This function will then be called, with the direction in which the current step should be moved, whenever an operation has been performed, that leads to a change of the current step.
It then returns true, when the step change should succeed and false otherwise.

#### \(canEnter\)
If you need to call a function to do some initialisation work before entering a wizard step you can add a `stepEnter` attribute to the wizard step environment like this:

```html
<wizard-step title="Second Step" (stepEnter)="enterSecondStep($event)"></wizard-step>
```

This leads to the calling of the `enterSecondStep` function when the wizard moves to this step.
When the first step of the wizard contains a `stepEnter` function, it not only gets called 
when the used moves back from a later step to the first step, but also after the wizard is initialized.
The event emitter will call the given function with a parameter that contains the `MovingDirection` of the user. 
If the user went backwards, like from the third step to the second or first step, then `MovingDirection.Backwards` will be passed to the function. 
If the user went forwards `MovingDirection.Forwards` will be passed to the function.

#### \(canExit\)
Similar to `stepEnter` you can add a `stepExit` attribute to the wizard step environment, if you want to call a function every time a wizard step is exited 
either by pressing on a component with a `nextStep` or `previousStep` directive, or by a click on the navigation bar. 
`stepExit`, like `stepEnter` can call the given function with an argument of type `MovingDirection` that signalises in which direction the step was exited.

#### Parameter overview
Possible `<wizard-step>` parameters:

| Parameter name                | Possible Values                                   | Default Value |
| ----------------------------- | ------------------------------------------------- | ------------- |
| [title]                       | string                                            | null          |
| [navigationSymbol]            | string                                            | ''            |
| [navigationSymbolFontFamily]  | string                                            | null          |
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
| [title]                       | string                                            | null          |
| [navigationSymbol]            | string                                            | ''            |
| [navigationSymbolFontFamily]  | string                                            | null          |
| (stepEnter)                   | function(MovingDirection)                         | null          |

### \[wizardStepTitle\]
Sometimes it's not enough to define a title with the `title` attribute in `<wizard-step>` and `<wizard-completion-step>`.
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

#### \(finalize\)
If you want to call a function only after pressing on a element with a `goToStep` directive, you can do this, 
by adding the function to the `finalize` attribute of the element with the `goToStep` directive.

#### Parameter overview
Possible parameters:

| Parameter name    | Possible Values                                           | Default Value |
| ----------------- | --------------------------------------------------------- | ------------- |
| [goToStep]        | WizardStep &#124; StepOffset &#124; number &#124; string  | null          |
| (finalize)        | function()                                                | null          |

### \[nextStep\]
By adding a `nextStep` directive to a button or a link inside a step, you automatically add a `onClick` listener to the button or link, that leads to the next step.
This listener will automatically change the currently selected wizard step to the next wizard step after a click on the component.

```html
<button (finalize)="finalizeStep()" nextStep>Next Step</button>
```

#### \(finalize\)
Like the `goToStep` directive the `nextStep` directive provides a `finalize` output, that is called every time
the current step is successfully exited, by clicking on the element containing the `nextStep` directive.

In the given code snipped above, a click on the button with the text `Next Step`, leads to a call of the function `finalizeStep` every time, the button has been pressed.

#### Parameter overview
Possible parameters:

| Parameter name    | Possible Values                             | Default Value |
| ----------------- | ------------------------------------------- | ------------- |
| (finalize)        | function()                                  | null          |

### \[previousStep\]
By adding a `previousStep` directive to a button or a link, you automatically add a `onClick` listener to the button or link, that changes your wizard to the previous step.
This listener will automatically change the currently selected wizard step to the previous wizard step after a click on the component.

```html
<button (finalize)="finalizeStep()" previousStep>Previous Step</button>
```

#### \(finalize\)
Like both the `goToStep` and `nextStep` directives the `previousStep` directives too provides a `finalize` output, that is called every time
the current step is successfully exited, by clicking on the element containing the `previousStep` directive.

#### Parameter overview
Possible parameters:

| Parameter name    | Possible Values                             | Default Value |
| ----------------- | ------------------------------------------- | ------------- |
| (finalize)        | function()                                  | null          |

## Example
You can find an basic example project using ng2-archwizard [here](https://madoar.github.io/ng2-archwizard-demo). 
The sources for the example can be found in the [ng2-archwizard-demo](https://github.com/madoar/ng2-archwizard-demo) repository.
It illustrates how the wizard looks like and how the different settings can change its layout.
