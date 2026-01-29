import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { FeaturesComponent } from './features/features.component';



@NgModule({
  declarations: [
    LandingComponent,
    HeroSectionComponent,
    HowItWorksComponent,
    FeaturesComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PublicModule { }
