import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewAnalysisComponent } from './new-analysis/new-analysis.component';
import { ProcessingComponent } from './processing/processing.component';
import { ReportComponent } from './report/report.component';
import { HistoryComponent } from './history/history.component';
import { IdeaFormComponent } from './idea-form/idea-form.component';
import { RiskScoreComponent } from './risk-score/risk-score.component';
import { MarketInsightsComponent } from './market-insights/market-insights.component';
import { CompetitorListComponent } from './competitor-list/competitor-list.component';
import { BigPlayerAlertsComponent } from './big-player-alerts/big-player-alerts.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { ReportCardComponent } from './report-card/report-card.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartComponent } from '../shared/chart/chart.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    DashboardComponent,
    NewAnalysisComponent,
    ProcessingComponent,
    ReportComponent,
    HistoryComponent,
    IdeaFormComponent,
    RiskScoreComponent,
    MarketInsightsComponent,
    CompetitorListComponent,
    BigPlayerAlertsComponent,
    RecommendationsComponent,
    ReportCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class WorkspaceModule { }
