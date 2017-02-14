# Overview ng2-wizard

[![Build Status](https://travis-ci.org/madoar/ng2-wizard.png)](https://travis-ci.org/madoar/ng2-wizard)
[![Dependency Status](https://david-dm.org/madoar/ng2-wizard.svg)](https://david-dm.org/madoar/ng2-wizard)
[![Dev-Dependency Status](https://david-dm.org/madoar/ng2-wizard/dev-status.svg)](https://david-dm.org/madoar/ng2-wizard?type=dev)
[![Dependency Licence Status](https://dependencyci.com/github/madoar/ng2-wizard/badge)](https://dependencyci.com/github/madoar/ng2-wizard)
[![Code Climate](https://codeclimate.com/github/madoar/ng2-wizard/badges/gpa.svg)](https://codeclimate.com/github/madoar/ng2-wizard)
[![Test Coverage](https://codeclimate.com/github/madoar/ng2-wizard/badges/coverage.svg)](https://codeclimate.com/github/madoar/ng2-wizard/coverage)

This project contains a functional wizard component for [Angular 2](https://angular.io/).

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

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

### <wizard>
`<wizard>...</wizard>` is the environment, in which you define your wizard.
This environment must contain all steps that make up your wizard.

### <wizard-step>
`<wizard-step>...</wizard-step>` is the wizard step environment. 
Every step that your wizard contains must be defined inside its own `<wizard-step></wizard-step>` environment.
A wizard must contain a title, which is shown in the navigation bar of the wizard. 
The title of a step can be set by adding a `title` attribute to the step definition. 

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

Similarly you can add a `stepExit` attribute to the wizard step environment, if you want to call a function every time a wizard step is exited 
either by pressing on a component with a `nextStep` or `previousStep` directive, or by a click on the navigation bar. 
`stepExit`, like `stepEnter` can call the given function with an argument of type `MovingDirection` that signalises in which direction the step was exited.

### [optionalStep]
If you need to define an optional step, that doesn't need to be done to continue to the next steps, you can define an optional step 
by adding the `optionalStep` directive to the step you want to define as optional. 

### [nextStep]
By adding a `nextStep` directive to a button or a link inside a step, you automatically add a `onClick` listener to the button or link, that leads to the next step.
This listener will automatically change the currently selected wizard step to the next wizard step after a click on the component.

If you want to call a function only after pressing on a component with a `nextStep` directive you can add the a function 
to the component declaration of the component tagged with `nextStep` like this:

```html
<button (finalize)="finalizeStep()" nextStep>Next Step</button>
```

This leads to a call of the function `finalizeStep` every time, the button is pressed.

### [previousStep]
By adding a `previousStep` directive to a button or a link, you automatically add a `onClick` listener to the button or link, that changes your wizard to the previous step.
This listener will automatically change the currently selected wizard step to the previous wizard step after a click on the component.

### [goToStep]
In addition to the `previousStep` and `nextStep` directives the `goToStep` directive is available to move between steps.
The `goToStep` directive must receive an argument, that tells the directive to which the button should link:

```html
<button goToStep="2" (finalize)="finalizeStep()">Go directly to the third Step</button>
```

In the previous example the button will move the user automatically to the third step, after the user pressed onto it.
This makes it possible to directly jump to all already completed steps and to the first not completed optional or default (not optional) next step, 
which will set the current as completed and makes it possible to jump over steps defined as optional steps.

Like the `nextStep` directive the `goToStep` directive provides a `finalize` output, that will be called every time, 
the current step was successfully left by clicking on the button containg the `goToStep` directive. 
