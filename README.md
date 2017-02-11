# Ng2Wizard

[![Build Status](https://travis-ci.org/madoar/ng2-wizard.png)](https://travis-ci.org/madoar/ng2-wizard)
[![Dependency Status](https://david-dm.org/madoar/ng2-wizard.svg)](https://david-dm.org/madoar/ng2-wizard)
[![Dev-Dependency Status](https://david-dm.org/madoar/ng2-wizard/dev-status.svg)](https://david-dm.org/madoar/ng2-wizard?type=dev)
[![Dependency Licence Status](https://dependencyci.com/github/madoar/ng2-wizard/badge)](https://dependencyci.com/github/madoar/ng2-wizard)

This project contains a functional wizard component for [Angular 2](https://angular.io/).

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## How to use the wizard

To use the this wizard component in an angular 2 project simply add a wizard component as followed to the html template of your component:

```angular2html
<wizard>
  <wizard-step title="Title of step 1">
    Content of Step 1
    <button type="button" nextStep>Next Step</button>
  </wizard-step>
  <wizard-step title="Title of step 2">
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
This contains all steps that belong to your wizard.

### <wizard-step>
`<wizard-step>...</wizard-step>` is the wizard step environment. 
Every wizard step must be defined inside its own `<wizard-step></wizard-step>` environment.
If you need to call a function to do some initializing work before entering a wizard step you can add `stepEnter` to the wizard step environment like this:

```angular2html
<wizard-step title="Second Step" (stepenter)="enterSecondStep()"></wizard-step>
```

This leads to the calling of the `enterSecondStep` function when the wizard moves to this step.
When the first step of the wizard contains a `stepEnter` function, it's also called after the wizard was initialized. 

Similarly you can add `stepExit` to the wizard step environment if you want to call a function every time a wizard step is exited,
either by pressing on a component with a `nextStep` or `previousStep` directive or by a click on the navigation bar. 

### [nextStep]
By adding `nextStep` to a button or a link you automatically add a `onClick` listener to the button or link, that leads to the next step.
This listener will automatically change the currently selected wizard step to the next wizard step after a click on the component.

If you want to call a function only after pressing on a component with a `nextStep` directive you can add the a function to the component declaration of the component tagged with `nextStep` like this:

```angular2html
<button (finalize)="finalizeStep()" nextStep>Next Step</button>
```

This leads to a call of the function `finalizeStep` everytime the button is pressed.

### [previousStep]
By adding `previousStep` to a button or a link you automatically add a `onClick` listener to the button or link, that leads to the previous step.
This listener will automatically change the currently selected wizard step to the previous wizard step after a click on the component.
