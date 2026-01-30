import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { CardComponent } from './card/card.component';
import { LoaderComponent } from './loader/loader.component';
import { ProgressStepperComponent } from './progress-stepper/progress-stepper.component';
import { ChartComponent } from './chart/chart.component';
import { EmptyStateComponent } from './empty-state/empty-state.component';



@NgModule({
  declarations: [
    ButtonComponent,
    CardComponent,
    LoaderComponent,
    ProgressStepperComponent,
    ChartComponent,
    EmptyStateComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ChartComponent,
    LoaderComponent
  ]
})
export class SharedModule { }
