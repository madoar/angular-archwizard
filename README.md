# Overview angular-archwizard
[![Build Status](https://travis-ci.com/madoar/angular-archwizard.svg?branch=develop)](https://travis-ci.com/madoar/angular-archwizard)
[![Dependency Status](https://david-dm.org/madoar/angular-archwizard.svg)](https://david-dm.org/madoar/angular-archwizard)
[![Dev-Dependency Status](https://david-dm.org/madoar/angular-archwizard/dev-status.svg)](https://david-dm.org/madoar/angular-archwizard?type=dev)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/039c5be36d8646dfb73972e8679e5021)](https://www.codacy.com/app/marc.arndt/angular-archwizard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=madoar/angular-archwizard&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/039c5be36d8646dfb73972e8679e5021)](https://www.codacy.com/app/marc.arndt/angular-archwizard?utm_source=github.com&utm_medium=referral&utm_content=madoar/angular-archwizard&utm_campaign=Badge_Coverage)
[![NPM Version](https://img.shields.io/npm/v/angular-archwizard.svg)](https://www.npmjs.com/package/angular-archwizard)

This project contains a functional module with a wizard component and some supportive components and directives for [Angular](https://angular.io/) version 9 or later.

## Build
Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests
Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Compatibility
Latest `angular-archwizard` is compatible with Angular 9+.

## Gitpod
`angular-archwizard` can be developed with Gitpod, a free one-click online IDE for GitHub:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/madoar/angular-archwizard)

## Installation

### Step 1: Install `angular-archwizard`
`angular-archwizard` is available as a NPM package. To install `angular-archwizard` in your project directory run:

```bash
$ npm install --save angular-archwizard
```

### Step 2: Import the ArchwizardModule
After installation you can import `angular-archwizard` into your Angular project by adding the `ArchwizardModule` to your module declaration as follows:

```typescript
import { ArchwizardModule } from 'angular-archwizard';

@NgModule({
  imports: [
    ArchwizardModule
  ],
})
export class Module { }
```

### Step 3: Include styles
To allow customization, `angular-archwizard` bundles CSS styles separately. If you are using Angular CLI, import them into your `styles.css`...

```css
@import '../node_modules/angular-archwizard/archwizard.css';
```

...or include them into `angular.json`:

```javascript
{
  // ...
  "styles": [
    "node_modules/angular-archwizard/archwizard.css",
    "src/styles.css"
  ]
  // ...
}
```

If you are using SCSS, you can include the styles in the form of a `.scss` file: `node_modules/angular-archwizard/archwizard.scss`.
This way you can easily customize wizard's appearance by tweaking SCSS variables as described in [Styles Customization](#styles-customization).

## How to use the wizard
To use this wizard component in an angular project simply add a `aw-wizard` component to the html template of your component:

```html
<aw-wizard>
  <aw-wizard-step stepTitle="Title of step 1">
    Content of Step 1
    <button type="button" awNextStep>Next Step</button>
    <button type="button" [awGoToStep]="{stepIndex: 2}">Go directly to third Step</button>
  </aw-wizard-step>
  <aw-wizard-step stepTitle="Title of step 2" awOptionalStep>
    Content of Step 2
    <button type="button" awPreviousStep>Go to previous step</button>
    <button type="button" awNextStep>Go to next step</button>
  </aw-wizard-step>
  <aw-wizard-step stepTitle="Title of step 3">
    Content of Step 3
    <button type="button" awPreviousStep>Previous Step</button>
    <button type="button" (click)="finishFunction()">Finish</button>
  </aw-wizard-step>
</aw-wizard>
```

## Components

### \<aw-wizard\>
The `<aw-wizard>` environment is the environment in which you define the steps belonging to your wizard.
In addition to the contained wizard steps, `angular-archwizard` enables you to define the location and the layout of the navigation bar inside your wizard.
To set the location, the layout of the navigation bar and many other settings, you can pass the following parameters to the `aw-wizard` component:

#### \[navBarLocation\]
The location of the navigation bar, contained inside the wizard, can be specified through the `navBarLocation` input value.
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

#### \[navBarDirection\]
Normally the steps in the navigation bar are layed out from left to right or from top to bottom.
In some cases, like with languages that are written from right to left, it may be required to change this direction to layout the steps from right to left.
To layout the steps from right to left you can pass `right-to-left` to the `navBarDirection` input of the wizard component.

#### \[defaultStepIndex\]
Per default the wizard always starts with the first wizard step, after initialisation. The same applies for a reset, where the wizard normally resets to the first step.
Sometimes this needs to be changed. If another default wizard step needs to be used, you can set it, by using the `[defaultStepIndex]` input of the wizard component.
For example, to start the wizard in the second step, `[defaultStepIndex]="2"` needs to be set.

Please be aware, that angular will interpret the given input value as a string if it's not enclosed by `[]`!

#### \[disableNavigationBar\]
Sometimes it may be necessary to disable navigation via the navigation bar.
In such a case you can disable navigation via the navigation bar by setting the input `[disableNavigationBar]` of the wizard component to `true`.

After disabling the navigation bar, the user can't use the navigation bar anymore to navigate between steps.
Disabling the navigation bar doesn't restrict the use of elements (buttons or links) with an `awNextStep`, `awPreviousStep` or `awGoToStep` directive.

#### Parameter overview
Possible `<aw-wizard>` parameters:

| Parameter name           | Possible Values                                                                                         | Default Value     |
| ------------------------ | ------------------------------------------------------------------------------------------------------- | ----------------- |
| `[navBarLocation]`       | `'top'` \| `'bottom'` \| `'left'` \| `'right'`                                                          | `'top'`           |
| `[navBarLayout]`         | `'small'` \| `'large-filled'` \| `'large-empty'` \| `'large-filled-symbols'` \| `'large-empty-symbols'` | `'small'`         |
| `[navBarDirection]`      | `'left-to-right'` \| `'right-to-left'`                                                                  | `'left-to-right'` |
| `[defaultStepIndex]`     | `number`                                                                                                | `0`               |
| `[disableNavigationBar]` | `boolean`                                                                                               | `false`           |

### \<aw-wizard-step\>
`angular-archwizard` contains two ways to define a wizard step.
One of these two ways is by using the `<aw-wizard-step>` component.

#### \[stepId\]
A wizard step can have its own unique id.
This id can then be used to navigate to the step.
In addition the `[stepId]` of a wizard step is used as the `id` of the `li` element for the wizard step in the navigation bar.

#### \[stepTitle\]
A wizard step needs to contain a title, which is shown in the navigation bar of the wizard.
To set the title of a step, add the `stepTitle` input attribute, with the choosen step title, to the definition of your wizard step.

#### \[navigationSymbol\]
Sometimes it's useful to add a symbol in the center of the circle in the navigation bar, which belongs to the step.
`angular-archwizard` supports this through the `[navigationSymbol]` input attribute of the wizard step.

Be aware, that not all layouts display the symbols.
Only the layouts `large-filled-symbols` and `large-empty-symbols` display the symbols!

If you want to add a `2` to the circle in the navigation bar belonging to the second step, you can do it like this:

```html
<aw-wizard-step stepTitle="Second Step" [navigationSymbol]="{ symbol: '2' }">
  ...
</aw-wizard-step>
```

In addition to normal symbols it's also possible to use an icon from a font as a symbol.
To use an icon from a font you need to first search for the unicode belonging to the icon you want to insert.
Afterwards you can use the unicode in the [numeric character reference](https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references)
format as the symbol for the step.
In addition you need to specify the font family, to which the icon belongs, otherwise the symbol can't be displayed correctly.

The font family of the used symbol can be specified via the `fontFamily` field of the given `[navigationSymbol]` json input object.
For example, if you want to show the icon with the unicode `\f2dd` of [FontAwesome](http://fontawesome.io/) inside a step circle in the navigation bar, then
you can do this via the following `[navigationSymbol]` input attribute:

```html
<aw-wizard-step stepTitle="Second Step" [navigationSymbol]="{ symbol: '&#xf2dd;', fontFamily: 'FontAwesome' }">
  ...
</aw-wizard-step>
```

#### \[canEnter\]
Sometimes it's required to only allow the user to enter a specific step if a certain validation method returns true.
In such a case you can use the `[canEnter]` input of the targeted wizard step.
This input can be either a boolean, which directly tells the wizard if the targeted step can be entered,
or a lambda function, taking a `MovingDirection` and returning a `boolean` or a `Promise<boolean>`.
This function will then be called, with the direction in which the targeted step will be entered, whenever an operation has been performed, that leads to a change of the current step.
It then returns true, when the step change should succeed and false otherwise.

#### \[canExit\]
If you have an additional check or validation you need to perform to decide, if the step can be exited (both to the next step and to the previous step),
you can either pass a boolean or a function, taking a `MovingDirection` enum and returning a boolean or a `Promise<boolean>`, to the `[canExit]` attribute of the wizard step.
This boolean, or function, is taken into account, when an operation has been performed, which leads to a transition of the current step.
If `[canExit]` has been bound to a boolean, it needs to be true to leave the step in either direction (foreward AND backward).
If only exiting in one direction should be covered, you can pass a function, taking a `MovingDirection` and returning a boolean, to `[canExit]`.
This function will then be called whenever an operation has been performed, that leads to a change of the current step.

#### \(stepEnter\)
If you need to call a function to do some initialisation work before entering a wizard step you can add a `stepEnter` attribute to the wizard step environment like this:

```html
<aw-wizard-step stepTitle="Second Step" (stepEnter)="enterSecondStep($event)">
  ...
</aw-wizard-step>
```

This leads to the calling of the `enterSecondStep` function when the wizard moves to this step.
When the first step of the wizard contains a `stepEnter` function, it not only gets called
when the user moves back from a later step to the first step, but also after the wizard is initialized.
The event emitter will call the given function with a parameter that contains the `MovingDirection` of the user.
If the user went backwards, for example from the third step to the second or first step, then `MovingDirection.Backwards` will be passed to the function.
If the user went forwards `MovingDirection.Forwards` will be passed to the function.

#### \(stepExit\)
Similar to `stepEnter` you can add a `stepExit` attribute to the wizard step environment, if you want to call a function every time a wizard step is exited
either by pressing on a component with an `awNextStep` or `awPreviousStep` directive, or by a click on the navigation bar.
`stepExit`, like `stepEnter` can call the given function with an argument of type `MovingDirection` that signalises in which direction the step was exited.

#### Parameter overview
Possible `<aw-wizard-step>` parameters:

| Parameter name                | Possible Values                                                                                      | Default Value  |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- | -------------- |
| `[stepId]`                    | `string`                                                                                             | `null`         |
| `[stepTitle]`                 | `string`                                                                                             | `null`         |
| `[navigationSymbol]`          | `{symbol: string, fontFamily?: string}`                                                              | `{symbol: ''}` |
| `[canEnter]`                  | `function(MovingDirection): boolean` \| `function(MovingDirection): Promise<boolean>` \| `boolean`   | `true`         |
| `[canExit]`                   | `function(MovingDirection): boolean` \| `function(MovingDirection): Promise<boolean>` \| `boolean`   | `true`         |
| `(stepEnter)`                 | `function(MovingDirection): void`                                                                    | `null`         |
| `(stepExit)`                  | `function(MovingDirection): void`                                                                    | `null`         |

### \<aw-wizard-completion-step\>
In addition to the "normal" step component `<aw-wizard-step>` it's also possible to define an optional `<aw-wizard-completion-step>`.
The `aw-wizard-completion-step` is meant as the final wizard step, which signalises the user, that he or she successfully completed the wizard.
When an `aw-wizard-completion-step` has been entered by the user, all wizard steps, including the optional steps belonging to the wizard, are marked as completed.
In addition the user is prevented from leaving the `aw-wizard-completion-step` to another step, once it has been entered.

The given parameters for the wizard completion step are identical to the normal wizard step.
The only difference is, that it isn't possible to pass a `(stepExit)` and `[canExit]` parameter to the `aw-wizard-completion-step`, because it can't be exited.

#### Parameter overview
Possible `<aw-wizard-completion-step>` parameters:

| Parameter name                | Possible Values                                                                                      | Default Value  |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- | -------------- |
| `[stepId]`                    | `string`                                                                                             | `null`         |
| `[stepTitle]`                 | `string`                                                                                             | `null`         |
| `[navigationSymbol]`          | `{symbol: string, fontFamily?: string}`                                                              | `{symbol: ''}` |
| `[canEnter]`                  | `function(MovingDirection): boolean` \| `function(MovingDirection): Promise<boolean>` \| `boolean`   | `true`         |
| `(stepEnter)`                 | `function(MovingDirection): void`                                                                    | `null`         |

## Directives

### \[awNavigationMode\]
By default `angular-archwizard` operates in a "strict" navigation mode.
It requires users to navigate through the wizard steps in a linear fashion, where they can only enter the next step if all previous steps have been completed and the exit condition of the current step have been fulfilled.
The only exception to this rule are optional steps, which a user can skip.
Using the navigation bar, the user can navigate back to steps they already visited.

You can alter this behavior by applying to the `<aw-wizard>` element an additional `[awNavigationMode]` directive, which can be used in two ways.
The easiest option is to tweak the default navigation mode with `[navigateBackward]` and/or `[navigateForward]` inputs which control the navigation bar and have the following options:

| Parameter name                | Possible Values                                                                                      | Default Value |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- | ------------- |
| `[navigateBackward]`          | `'allow'` \| `'deny'`                                                                                | `'deny'`      |
| `[navigateForward]`           | `'allow'` \| `'deny'` \| `'visited'`                                                                 | `'allow'`     |

Take notice that the `'allow'` and `'visited'` options still respect step exit conditions.  Also, the completion step still only becomes enterable after all previous steps are completed.  Example usage:

```html
<aw-wizard [awNavigationMode] navigateBackward="allow" navigateForward="allow">
  ...
</aw-wizard>
```

If changes you need are more radical, you can define your own navigation mode.  In order to do this, create a class implementing the `NavigationMode` interface and pass an instance of this class into the `[awNavigationMode]` directive.
This takes priority over `[navigateBackward]` and `[navigateForward]` inputs.
Example usage:

custom-navigation-mode.ts:

```typescript
import { NavigationMode } from 'angular-archwizard'

class CustomNavigationMode implements NavigationMode {

  // ...
}
```

my.component.ts:

```typescript
@Component({
  // ...
})
class MyComponent {

  navigationMode = new CustomNavigationMode();
}
```

my.component.html:

```html
<aw-wizard [awNavigationMode]="navigationMode">
  ...
</aw-wizard>
```

Instead of implementing the `NavigationMode` interface from scratch, you can extend one of the classes provided by `angular-archwizard`:

-   `BaseNavigationMode`: This class contains an abstract method called `isNavigable`, which you will have to override to define wizard's behavior towards navigation using the navigation bar.

-   `ConfigurableNavigationMode`: This class defines the default navigation mode used by `angular-archwizard`. 
    In some cases, it might be more convenient to base your custom implementation on it.

This way of customizing the wizard is advanced, so be prepared to refer to documentation comments and source code for help.

#### Parameter overview
Possible `awNavigationMode` parameters:

| Parameter name                | Possible Values                                                                                      | Default Value |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- | ------------- |
| `[awNavigationMode]`          | `NavigationMode`                                                                                     | `null`        |
| `[navigateBackward]`          | `'allow'` \| `'deny'`                                                                                | `'deny'`      |
| `[navigateForward]`           | `'allow'` \| `'deny'` \| `'visited'`                                                                 | `'allow'`     |

### \[awEnableBackLinks\]
In some cases it may be required that the user is allowed to leave an entered `aw-wizard-completion-step`.
In such a case you can enable this by adding the directive `[awEnableBackLinks]` to the `aw-wizard-completion-step`.

```html
<aw-wizard-completion-step awEnableBackLinks>
  Final wizard step
</aw-wizard-completion-step>
```

#### Parameter overview
Possible `awEnableBackLinks` parameters:

| Parameter name                | Possible Values                                                                                      | Default Value |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- | ------------- |
| `(stepExit)`                  | `function(MovingDirection): void`                                                                    | `null`        |

### \[awWizardStepTitle\]
Sometimes it's not enough to define a title with the `stepTitle` attribute in `<aw-wizard-step>` and `<aw-wizard-completion-step>`.
One example for such a case is, if the title should be written in another font.
Another example would be if it's desired that the title should be chosen depending on the available width of your screen or window.
In such cases you may want to specify the html for the title of a wizard step yourself.
This can be achieved by using the `[awWizardStepTitle]` directive inside a wizard step on a `ng-template` component.

```html
<aw-wizard-step (stepEnter)="enterStep($event)">
  <ng-template awWizardStepTitle>
    <span class="hidden-sm-down">Delivery address</span>
    <span class="hidden-md-up">Address</span>
  </ng-template>
</aw-wizard-step>
```

Additionally it is possible to inject the corresponding `WizardStep` object into the `ng-template` environment.
This for example allows customization of the step title depending on the state of the wizard step, like on the completion and selection state:

```html
<aw-wizard-step (stepEnter)="enterStep($event)">
  <ng-template awWizardStepTitle let-wizardStep="wizardStep">
    {{ wizardStep.completed ? "Delivery address (✔)" : "Delivery address" }}
  </ng-template>
</aw-wizard-step>
```

### \[awWizardStepSymbol\]
In addition to the step title, the navigation symbol/step symbol can also be set via a directive.
This is required, if the navigation step symbol is not a simple character or a symbol, but something more complex, like a html component.
In such a case, the the navigation symbol can be specified using the `[awWizardStepSymbol]` directive, inside a wizard step on a `ng-template` component.

```html
<aw-wizard-step (stepEnter)="enterStep($event)">
  <ng-template awWizardStepSymbol>
    <!-- use <i class="fa fa-file"></i> for fontawesome version 4 -->
    <i class="far fa-file"></i>
  </ng-template>
</aw-wizard-step>
```

Additionally it is possible to inject the corresponding `WizardStep` object into the `ng-template` environment.
This for example allows customization of the navigation symbol depending on the state of the wizard step, like on the completion and selection state:

```html
<aw-wizard-step (stepEnter)="enterStep($event)">
  <ng-template awWizardStepSymbol let-wizardStep="wizardStep">
    <!-- use <i *ngIf="!wizardStep.completed" class="fa fa-file"></i> for fontawesome version 4 -->
    <i *ngIf="!wizardStep.completed" class="far fa-file"></i>
    <!-- use <i *ngIf="wizardStep.completed" class="fa fa-check"></i> for fontawesome version 4 -->
    <i *ngIf="wizardStep.completed" class="far fa-check"></i>
  </ng-template>
</aw-wizard-step>
```

### \[awOptionalStep\]
If you need to define an optional step, that doesn't need to be done to continue to the next steps, you can define an optional step
by adding the `awOptionalStep` directive to the step you want to declare as optional:

```html
<aw-wizard-step awOptionalStep>
  ...
</aw-wizard-step>
```

Sometimes a wizard step should only be marked as optional if some condition has been fulfilled. 
In such a case you can pass the condition to the `awOptionalStep` input parameter of the `awOptionalStep` directive 
to tell the wizard whether the step should be marked as optional:

```html
<aw-wizard-step [awOptionalStep]="condition">
  ...
</aw-wizard-step>
```

It is important to note that the condition input value can not be changed after initialization.

### \[awCompletedStep\]
In some cases it is required to specify a step as completed by default.
This means that the step should be shown as completed directly after initialization.
A step can be marked as completed by default by adding the `awCompletedStep` directive to 
the step you want to declare as completed:

```html
<aw-wizard-step awCompletedStep>
  ...
</aw-wizard-step>
```

Sometimes a wizard step should only be marked as completed if some condition has been fulfilled. 
In such cases you can pass the condition to the `awCompletedStep` input parameter of the `awCompletedStep` directive
to tell the wizard, whether the step should be marked as complete:

```html
<aw-wizard-step [awCompletedStep]="condition">
  ...
</aw-wizard-step>
```

It is important to note that the condition input value can not be changed after initialization.

### \[awSelectedStep\]
In some cases it may be a better choice to set the default wizard step not via a static number.
Another way to set the default wizard step is by using the `awSelectedStep` directive.
When attaching the `awSelectedStep` directive to an arbitrary wizard step, it will be marked as the default wizard step,
which is shown directly after the wizard startup.

### \[awGoToStep\]
`angular-archwizard` has three directives, which allow moving between steps.
These directives are the `awPreviousStep`, `asNextStep` and `awGoToStep` directives.

The `awGoToStep` directive needs to receive an input, which tells the wizard, to which step it should navigate,
when the element with the `awGoToStep` directive has been clicked.

This input accepts different arguments:

-   a destination **step index**:
    One possible argument for the input is a destination step index.
    A destination step index is always zero-based, i.e. the index of the first step inside the wizard is always zero.

    To pass a destination step index to an `awGoToStep` directive,
    you need to pass the following json object to the directive:

    ```html
    <button [awGoToStep]="{ stepIndex: 2 }" (finalize)="finalizeStep()">Go directly to the third Step</button>
    ```

-   a destination **step id**:
    Another possible argument for the input is a the unique step id of the destination step.
    This step id can be set for all wizard steps through their input `[stepId]`.

    To pass a unique destination step id to an `awGoToStep` directive,
    you need to pass the following json object to the directive:

    ```html
    <button [awGoToStep]="{ stepId: 'unique id of the third step' }" (finalize)="finalizeStep()">Go directly to the third Step</button>
    ```

-   a **step offset** between the current step and the destination step:
    Alternatively to an absolute step index or an unique step id,
    it's also possible to set the destination wizard step as an offset to the source step:

    ```html
    <button [awGoToStep]="{ stepOffset: 1 }" (finalize)="finalizeStep()">Go to the third Step</button>
    ```

In all above examples a click on the "Go to the third Step" button will move
the user to the next step (the third step) compared to the step the button belongs to (the second step).
If the button is part of the second step, a click on it will move the user to the third step.

In all above cases it's important to use `[]` around the `awGoToStep` directive to tell angular that the argument is to be interpreted as javascript.

In addition to a static value you can also pass a local variable from your component typescript class,
that contains to which step a click on the element should change the current step of the wizard.
This can be useful if your step transitions depend on some application dependent logic, that changes depending on the user input.
Here again it's important to use `[]` around the `awGoToStep` directive to tell angular that the argument is to be interpreted as javascript.

#### \(preFinalize\)
Sometimes it's required to bind an event emitter to a specific element, which can perform a step transition.
Such an event emitter can be bound to the `(preFinalize)` output of the element, which contains the `awGoToStep` directive.
This event emitter is then called, directly before the wizard transitions to the given step.

#### \(postFinalize\)
Alternatively you can also bind an event emitter to `(postFinalize)`,
which is executed directly after the wizard transitions to the given step.

#### \(finalize\)
In case you don't really care when the finalization event emitter is called, you can also bind it simply to `(finalize)`.
`finalize` is a synonym for `preFinalize`.

#### Parameter overview
Possible parameters:

| Parameter name    | Possible Values                                                   | Default Value |
| ----------------- | ----------------------------------------------------------------- | ------------- |
| `[goToStep]`      | `WizardStep` \| `StepOffset` \| `StepIndex` \| `StepId`           | `null`        |
| `(preFinalize)`   | `function(): void`                                                | `null`        |
| `(postFinalize)`  | `function(): void`                                                | `null`        |
| `(finalize)`      | `function(): void`                                                | `null`        |

### \[awNextStep\]
By adding a `awNextStep` directive to a button or a link inside a step, you automatically add a `onClick` listener to the button or link, that leads to the next step.
This listener will automatically change the currently selected wizard step to the next wizard step after a click on the component.

```html
<button (finalize)="finalizeStep()" awNextStep>Next Step</button>
```

#### \(finalize\)
Like the `awGoToStep` directive the `awNextStep` directive provides a `preFinalize`, `postFinalize` and `finalize` output, which are called every time
the current step is successfully exited, by clicking on the element containing the `nextStep` directive.

In the given code snipped above, a click on the button with the text `Next Step` leads to a call of the `finalize` function every time the button has been pressed.

#### Parameter overview
Possible parameters:

| Parameter name    | Possible Values                                                   | Default Value |
| ----------------- | ----------------------------------------------------------------- | ------------- |
| `(preFinalize)`   | `function(): void`                                                | `null`        |
| `(postFinalize)`  | `function(): void`                                                | `null`        |
| `(finalize)`      | `function(): void`                                                | `null`        |

### \[awPreviousStep\]
By adding a `awPreviousStep` directive to a button or a link, you automatically add a `onClick` listener to the button or link, that changes your wizard to the previous step.
This listener will automatically change the currently selected wizard step to the previous wizard step after a click on the component.

```html
<button (finalize)="finalizeStep()" awPreviousStep>Previous Step</button>
```

#### \(finalize\)
Like both the `awGoToStep` and `awNextStep` directives the `awPreviousStep` directives provides a `preFinalize`, `postFinalize` and `finalize` output, which are called every time
the current step is successfully exited, by clicking on the element containing the `awPreviousStep` directive.

#### Parameter overview
Possible parameters:

| Parameter name    | Possible Values                                                   | Default Value |
| ----------------- | ----------------------------------------------------------------- | ------------- |
| `(preFinalize)`   | `function(): void`                                                | `null`        |
| `(postFinalize)`  | `function(): void`                                                | `null`        |
| `(finalize)`      | `function(): void`                                                | `null`        |

### \[awWizardStep\]
In some cases it may be a good idea to move a wizard step to a custom component.
This can be done by defining adding the `awWizardStep` directive to the component that contains the wizard step.

```html
<aw-wizard>
  <aw-wizard-step stepTitle="Steptitle 1">
    Step 1
  </aw-wizard-step>
  <custom-step awWizardStep stepTitle="Steptitle 2">
    ...
  </custom-step>
  <aw-wizard-step stepTitle="Steptitle 3">
    Step 3
  </aw-wizard-step>
</aw-wizard>
```

#### Parameter overview
Possible `awWizardStep` parameters:

| Parameter name                | Possible Values                                                                                      | Default Value  |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- | -------------- |
| `[stepId]`                    | `string`                                                                                             | `null`         |
| `[stepTitle]`                 | `string`                                                                                             | `null`         |
| `[navigationSymbol]`          | `{symbol: string, fontFamily?: string}`                                                              | `{symbol: ''}` |
| `[canEnter]`                  | `function(MovingDirection): boolean` \| `function(MovingDirection): Promise<boolean>` \| `boolean`   | `true`         |
| `[canExit]`                   | `function(MovingDirection): boolean` \| `function(MovingDirection): Promise<boolean>` \| `boolean`   | `true`         |
| `(stepEnter)`                 | `function(MovingDirection): void`                                                                    | `null`         |
| `(stepExit)`                  | `function(MovingDirection): void`                                                                    | `null`         |

### \[awWizardCompletionStep\]
In addition to the possibility of defining a normal wizard step in a custom component,
it is also possible to define a wizard completion step in a custom component.
To define a wizard completion step in a custom component you need to add the `[awWizardCompletionStep]` directive to the custom component
that contains the wizard completion step.

```html
<aw-wizard>
  <aw-wizard-step stepTitle="Steptitle 1">
    Step 1
  </aw-wizard-step>
  <custom-step awWizardCompletionStep stepTitle="Completion steptitle">
    ...
  </custom-step>
</aw-wizard>
```

#### Parameter overview
Possible `awWizardCompletionStep` parameters:

| Parameter name                | Possible Values                                                                                      | Default Value  |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- | -------------- |
| `[stepId]`                    | `string`                                                                                             | `null`         |
| `[stepTitle]`                 | `string`                                                                                             | `null`         |
| `[navigationSymbol]`          | `{symbol: string, fontFamily?: string}`                                                              | `{symbol: ''}` |
| `[canEnter]`                  | `function(MovingDirection): boolean` \| `function(MovingDirection): Promise<boolean>` \| `boolean`   | `true`         |
| `(stepEnter)`                 | `function(MovingDirection): void`                                                                    | `null`         |

### \[awResetWizard\]
Sometimes it's also required to reset the wizard to its initial state.
In such a case you can use the `awResetWizard` directive.
This directive can be added to a button or a link for example.
When clicking on this element, the wizard will automatically reset to its `defaultStepIndex`.

In addition it's possible to define an `EventEmitter`, that is called when the wizard is being reset.
This `EventEmitter` can be bound to the `(finalize)` input of the `awResetWizard` directive.

#### Parameter overview
Possible `awResetWizard` parameters:

| Parameter name                | Possible Values                                                                                      | Default Value |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- | ------------- |
| `(finalize)`                  | `function(): void`                                                                                   | `null`        |

### Accessing the wizard component instance
Sometimes it's required to access the wizard component directly.
In such a case you can get the instance of the used wizard component in your own component via:

```typescript
@ViewChild(WizardComponent)
public wizard: WizardComponent;
```

### Navigating the wizard programmatically

In addition to letting the user navigate the wizard with `awNextStep`, `awPreviousStep` and `awGoToStep` directives,
you can trigger navigation programmatically.  Use navigation methods exposed by the `WizardComponent` class:

```typescript
wizard.goToNextStep();
wizard.goToPreviousStep();
wizard.goToStep(desinationIndex);
```

### Customizing the wizard stylesheets
Sometimes you like to use your own custom CSS for some parts of the wizard like its navigation bar.
This is quite easy to do.
Different ways are possible:

1.  Either use a wrapper around the wizard:
    ```html
    <div class="my-custom-css-wrapper">
      <aw-wizard>
        ...
      </aw-wizard>
    </div>
    ```

2.  Or add your css wrapper class directly to the wizard element:
    ```html
    <aw-wizard class="my-custom-css-wrapper">
      ...
    </aw-wizard>
    ```

When overriding css properties already defined in the existing navigation bar layouts, it is required to use `!important`.
In addition it is required to add `encapsulation: ViewEncapsulation.None` to the component, that defines the wizard and overrides its layout.
For additional information about how to write your own navigation bar please take a look at the existing navigation bar layouts, which can be found in the
[wizard-navigation-bar.scss](src/css/wizard-navigation-bar.scss) file.

### Working with dynamically inserted and removed steps
In some cases it may be required to remove or insert one or multiple steps after the wizard initialization.
For example after a user does some interaction with the wizard, it may be required to add or remove a later step.
In such situations the wizard supports the removal and insertion of steps in the DOM.

If an earlier step, compared to the current step, has been removed or inserted, the wizard will adjust the current step to ensure that the changed state is valid again.

When removing a step be sure to not remove the step the wizard is currently displaying, because otherwise the wizard will be inside an invalid state, which may lead to strange and unexpected behavior.

## Styles Customization

If you are using SCSS, you can customize the wizard's global styles and color theme using SCSS variables:

1.  Import `node_modules/angular-archwizard/archwizard.scss` into your `styles.scss` file as described in the [Installation](#installation) section.

2.  Re-define any of the variables you can find at the top of `node_modules/angular-archwizard/variables.scss`.

In the following example, we configure a simple color theme which only defines styles for two step states: 'default' and 'current'.

```scss
// styles.scss

$aw-colors: (
  '_': (
    'default': (
      'border-color-default': #76b900,
      'background-color-default': null,
      'symbol-color-default': #68aa20,
      'border-color-hover': #569700,
      'background-color-hover': null,
      'symbol-color-hover': #569700,
    ),
    'current': (
      'border-color-default': #bbdc80,
      'background-color-default': #bbdc80,
      'symbol-color-default': #808080,
      'border-color-hover': #76b900,
      'background-color-hover': #76b900,
      'symbol-color-hover': #808080,
    )
  )
);

@import '../node_modules/angular-archwizard/archwizard.scss';
```

Please don't hesitate to look inside `node_modules/angular-archwizard/variables.scss` for documentation
on the `$aw-colors` variable and other variables you can tweak to tune the wizard to your needs.

## Example
You can find an basic example project using `angular-archwizard` [here](https://madoar.github.io/angular-archwizard-demo).
The sources for the example can be found in the [angular-archwizard-demo](https://github.com/madoar/angular-archwizard-demo) repository.
It illustrates how the wizard looks like and how the different settings can change its layout and behavior.
