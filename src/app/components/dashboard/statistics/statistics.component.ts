import { SkeletonComponent } from './../../../shared/skeleton/skeleton/skeleton.component';
import { AlertsService } from './../../../services/generic/alerts.service';
import { PublicService } from './../../../services/generic/public.service';
import { StatisticsService } from './../services/statistics';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Subscription, catchError, finalize, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [TranslateModule, CommonModule, TableModule, SkeletonComponent],
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent {
  private subscriptions: Subscription[] = [];
  currentLanguage: string = '';

  isLoadingStatistics: boolean = false;
  statisticsData: any;

  userData: any;
  banks: any = [];
  bankHeaders: any;
  parents: any = [];
  parentHeaders: any;
  schools: any = [];
  schoolHeaders: any;
  universities: any = [];
  universitiesHeaders: any;

  constructor(
    private statisticsService: StatisticsService,
    private publicService: PublicService,
    private alertsService: AlertsService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.currentLanguage = this.publicService?.getCurrentLanguage();
    this.getUserData();
    this.getStatisticsData();
    this.bankHeaders = [
      { field: 'bankName', header: 'dashboard.statistics.bankName' },
      { field: 'count', header: 'dashboard.statistics.usersNumber' }
    ];
    this.parentHeaders = [
      { field: 'User Name', header: 'dashboard.statistics.parentName' },
      { field: 'Kids Count', header: 'dashboard.statistics.kidsNumber' },
      { field: 'Schools Count', header: 'dashboard.statistics.schoolsNumber' },
      { field: 'Banks Count', header: 'dashboard.statistics.banksNumber' }
    ];

    this.schoolHeaders = [
      { field: 'school_name', header: 'dashboard.statistics.parentName' },
      { field: 'count_of_parents', header: 'dashboard.statistics.parentNumber' },
      { field: 'count_of_kids', header: 'dashboard.statistics.kidsNumber' }
    ];

    this.universitiesHeaders = [
      { field: 'university_name', header: 'dashboard.statistics.universityName' },
      { field: 'count_of_parents', header: 'dashboard.statistics.parentNumber' },
      { field: 'count_of_kids', header: 'dashboard.statistics.kidsNumber' }
    ];
  }
  getUserData(): void {
    this.userData = this.authService.getUserLoginDataLocally();
  }

  // Start Statistics Data Functions
  getStatisticsData(): void {
    this.isLoadingStatistics = true;
    let statisticsSubscription: Subscription = this.statisticsService?.getStatisticsData()
      .pipe(
        tap((res: any) => {
          this.processStatisticsResponse(res);
        }),
        catchError(err => this.handleError(err)),
        finalize(() => this.isLoadingStatistics = false)
      ).subscribe();
    this.subscriptions.push(statisticsSubscription);
  }
  private processStatisticsResponse(response: any): void {
    if (response.status == 200) {
      this.statisticsData = response?.data;
      this.banks = this.statisticsData?.interactive_bank;
      this.parents = this.statisticsData?.parents_data;
      this.schools = this.statisticsData?.schools_section_data;
      this.universities = this.statisticsData?.university_section_data;
      this.banks?.forEach((item: any) => {
        item?.bank_name ? item['bankName'] = JSON.parse(item?.bank_name)[this.currentLanguage] : '';
      });
      this.schools?.forEach((item: any) => {
        item['school_name'] = JSON.parse(item?.school_name)[this.currentLanguage];
      });
      this.universities?.forEach((item: any) => {
        item['university_name'] = JSON.parse(item?.university_name)[this.currentLanguage];
      });
    } else {
      this.handleError(response.message);
      return;
    }
  }

  // End Statistics Data Functions

  /* --- Handle api requests messages --- */
  private handleSuccess(msg: string | null): any {
    this.setMessage(msg || this.publicService.translateTextFromJson('general.successRequest'), 'success');
  }
  private handleError(err: string | null): any {
    this.setMessage(err || this.publicService.translateTextFromJson('general.errorOccur'), 'error');
  }
  private setMessage(message: string, type?: string | null): void {
    this.alertsService.openToast(type, type, message);
    this.publicService.showGlobalLoader.next(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }
}
